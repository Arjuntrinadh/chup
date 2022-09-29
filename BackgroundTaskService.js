
import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';
const { AudioHandler } = NativeModules;

const data = [
  [
    [
      82.24009865779442,
      16.980686164052898
    ],
    [
      82.24161295515307,
      16.980162317752644
    ],
    [
      82.24180626970974,
      16.98060604647877
    ],
    [
      82.24260530320987,
      16.98030406454278
    ],
    [
      82.242482870657,
      16.97986649801996
    ],
    [
      82.24350743780622,
      16.979410441683825
    ],
    [
      82.24340433671006,
      16.978972873076174
    ],
    [
      82.24000200051717,
      16.98037185644887
    ],
    [
      82.24009865779442,
      16.980686164052898
    ]
  ],
  [
    [
      82.24170204956584,
      16.97850766720515
    ],
    [
      82.24250992806901,
      16.978064261602384
    ],
    [
      82.24267976616392,
      16.97711159453523
    ],
    [
      82.24095384390864,
      16.977317932973875
    ],
    [
      82.24084367865959,
      16.978112553352403
    ],
    [
      82.24170204956584,
      16.97850766720515
    ]
  ],
  [
    [
      82.24021133782554,
      16.979941539194044
    ],
    [
      82.24063041448233,
      16.980096236905567
    ],
    [
      82.2413251994675,
      16.97979738893953
    ],
    [
      82.24122226835891,
      16.979364937511505
    ],
    [
      82.2405091028188,
      16.979104763001914
    ],
    [
      82.24021133782554,
      16.979941539194044
    ]
  ],
  [
    [
      82.2493854280093,
      17.11726203903892
    ],
    [
      82.24917890416373,
      17.116789081462116
    ],
    [
      82.2490230371094,
      17.116831287698815
    ],
    [
      82.2492373543081,
      17.11731914144707
    ],
    [
      82.2493854280093,
      17.11726203903892
    ]
  ]
]

getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@trigger')
    if (value !== null) {
      return value;
    } else {
      return "[]";
    }
  } catch (e) {
  }
}


const saveInfo = async (x, y) => {
  var raw = await getData();
  console.log(raw)
  var info = JSON.parse(raw)
  info.push({ time: x, status: y })
  var finalOut = JSON.stringify(info)
  try {
    await AsyncStorage.setItem('@trigger', finalOut)
    console.log("hi")
  } catch (e) {
    console.log(e)
  }
}

const inside = (point, vs) => {
  var x = point[0], y = point[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0], yi = vs[i][1];
    var xj = vs[j][0], yj = vs[j][1];

    var intersect = ((yi > y) != (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
};

var status = -1;

const checkInside = (x) => {
  return data.map(async (i, j) => {
    var check = inside(x, i)
    console.log(check + " , " + status)
    if (check == true && status == -1) {
      Geolocation.getCurrentPosition(
        (position) => {
          var check = inside([position.coords.longitude, position.coords.latitude], i)
          if (check == true) {
            console.log('mute device')
            AudioHandler.muteDevice('x', 'y')
            const d = new Date();
            const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
            saveInfo(time, "Mute")
            BackgroundService.updateNotification({ taskDesc: 'Your device is muted' });
            status = j;
          }
        },
        (error) => {
          console.log(error.code, error.message);
        },
        {
          enableHighAccuracy: true,
          accuracy: {
            android: 'high',
            ios: 'best',
          },
        }
      )
    }
    else if (check == false && status == j) {
      Geolocation.getCurrentPosition(
        (position) => {
          var check = inside([position.coords.longitude, position.coords.latitude], i)
          if (check == false) {
            AudioHandler.unMuteDevice('x', 'y')
            const d = new Date();
            const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
            saveInfo(time, "Unmute")
            BackgroundService.updateNotification({ taskDesc: 'Your device is unmuted' });
            status = -1;
            console.log('unmute device')
          }
        },
        (error) => {
          console.log(error.code, error.message);
        },
        {
          enableHighAccuracy: true,
          accuracy: {
            android: 'high',
            ios: 'best',
          },
        }
      )
    }
  }
  )
}

storeData = async (value) => {
  try {
    await AsyncStorage.setItem('@WATCH_ID', value)
  } catch (e) {
    console.log(e)
  }
}

const increaseCountTask = async taskDataArguments => {
  console.log('hi')
  const { delay } = taskDataArguments;
  status = -1;
  await new Promise(async (resolve) => {
    var watchID = Geolocation.watchPosition(
      (position) => {
        checkInside([position.coords.longitude, position.coords.latitude])
      },
      (error) => console.log(JSON.stringify(error)),
      {
        accuracy: {
          android: 'balanced',
          ios: 'best',
        },
        enableHighAccuracy: true,
        distanceFilter: 10,
      },
    )
    console.log(watchID)
    storeData(`${watchID}`);
  });

}

const options = {
  taskName: 'checking . . .',
  taskTitle: 'Chup',
  taskDesc: ' ',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  parameters: {
    delay: 12000,
  },
  actions: '["Exit"]',
};
const start = () => {
  BackgroundService.start(increaseCountTask, options);
};
const stop = () => {

  BackgroundService.stop();
};
export default {
  start,
  stop,
};


