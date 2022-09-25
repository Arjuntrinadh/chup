
import BackgroundService from 'react-native-background-actions';
import BackgroundJob from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';
const { AudioHandler } = NativeModules;

const data = [
  [
    [
      82.24167191595757,
      16.97844751644483
    ],
    [
      82.2409208580952,
      16.978006359507617
    ],
    [
      82.24102228713133,
      16.977706095030825
    ],
    [
      82.24203899246805,
      16.97738504248086
    ],
    [
      82.24242055884167,
      16.977509767996864
    ],
    [
      82.24211868671136,
      16.978265048518026
    ],
    [
      82.24167191595757,
      16.97844751644483
    ]
  ],
  [
    [
      82.24206898686617,
      16.979924751552474
    ],
    [
      82.24194359679336,
      16.979599243375503
    ],
    [
      82.24335423512025,
      16.979110980049867
    ],
    [
      82.243479625193,
      16.979445055093848
    ],
    [
      82.24206898686617,
      16.979924751552474
    ]
  ],
  [
    [
      82.240711,
      16.980421
    ],
    [
      82.240579,
      16.980093
    ],
    [82.24128, 16.979806],
    [
      82.241441,
      16.980176
    ],
    [82.240711, 16.980421]
  ],
  [
    [
      82.240433,
      16.979471
    ],
    [
      82.240499,
      16.979268
    ],
    [82.241222, 16.97952],
    [
      82.241163,
      16.979694
    ],
    [82.240433, 16.979471]
  ],
  [
    [
      82.241908,
      16.980536
    ],
    [
      82.241772,
      16.980218
    ],
    [
      82.242264,
      16.980009
    ],
    [
      82.242412,
      16.980371
    ],
    [
      82.241908,
      16.980536
    ]
  ],
  [
    [
      82.25559584040309,
      17.114159308850205
    ],
    [
      82.25614010713082,
      17.114154986133997
    ],
    [
      82.25609336954494,
      17.113428768382832
    ],
    [
      82.25561533622584,
      17.113589533338597
    ],
    [
      82.25559584040309,
      17.114159308850205
    ]
  ],
  [
    [
      82.24950626204196,
      17.117748223342275
    ],
    [
      82.24903931654666,
      17.11682053971562
    ],
    [
      82.24982604895752,
      17.116590646556503
    ],
    [
      82.25030714431631,
      17.117429079059193
    ],
    [
      82.24950626204196,
      17.117748223342275
    ]
  ]
]



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
    console.log(check)
    if (check == true && status == -1) {
      console.log('mute device')
      AudioHandler.muteDevice('x', 'y')
      await BackgroundService.updateNotification({ taskDesc: 'Your device is muted' });
      status = j;

    }
    else if (check == false && status == j) {
      AudioHandler.unMuteDevice('x', 'y')
      await BackgroundService.updateNotification({ taskDesc: 'Your device is unmuted' });
      status = -1;
      console.log('unmute device')
    }
  }
  )
}

const increaseCountTask = async taskDataArguments => {
  const { delay } = taskDataArguments;
  await new Promise(async (resolve) => {
    Geolocation.watchPosition(
      (position) => {
        checkInside([position.coords.longitude, position.coords.latitude])
      },
      (error) => console.log(JSON.stringify(error)),
      {
        accuracy: {
          android: 'balanced',
          ios: 'best',
        },
        enableHighAccuracy: false,
        distanceFilter: 10,
        
      },
    )
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


