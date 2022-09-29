import { Text, View, PermissionsAndroid, Alert, TouchableOpacity, Image, NativeModules, ScrollView } from 'react-native'
import React, { Component } from 'react'
import BackgroundTaskService from './BackgroundTaskService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
const { AudioHandler } = NativeModules;
export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      statusX: 1,
      resText:null
    }
  }
  removeValue = async () => {
    try {
      await AsyncStorage.removeItem('@storage_Key')
    } catch (e) {
      alert('restart the app')
    }
  }

  storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@storage_Key', value)
    } catch (e) {
      alert('restart the app')
    }
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key')
      if (value !== null) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
    }
  }

  getDataX = async () => {
    try {
      const value = await AsyncStorage.getItem('@WATCH_ID')
      if (value !== null) {
        console.log(value)
        Geolocation.clearWatch(parseInt(value));
      } else {
        return true;
      }
    } catch (e) {
    }
  }

  getBackgroundPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          'title': 'Chup',
          'message': 'Chup access to your location'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        var x = await AudioHandler.getPermission();
        console.log(x)
        if (x == true) {
          var output = await this.getData();
          if (output == true) {
            this.setState({
              statusX: 10
            })
          }
          else {
            this.setState({
              statusX: 5
            })
          }
        } else {
          console.log("Notification permission denied")
          alert("Notification permission denied");
          this.setState({
            statusX: -1
          })
        }
      } else {
        console.log("location permission denied")
        alert("Location permission denied");
        this.setState({
          statusX: -1
        })
      }
    }
    catch (e) {
      alert(e)
    }
  }

  permissionCheck = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Chup',
          'message': 'Chup access to your location'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getBackgroundPermission()
      } else {
        console.log("location permission denied")
        alert("Location permission denied");
        this.setState({
          statusX: -1
        })
      }
    } catch (err) {
      alert(err)
    }
  }

  getTriggerInfo = async () => {
    try {
      const value = await AsyncStorage.getItem('@trigger')
      console.log(value)
      var res = JSON.parse(value)
      this.setState({
        resText: res
      })
    } catch (e) {
      console.log(e)
    }
  }

  componentDidMount() {
    this.getTriggerInfo();
    this.permissionCheck()

  }

  hero = async () => {
    if (this.state.statusX != 5) {
      await this.storeData("1");
      BackgroundTaskService.start()
      this.setState({
        statusX: 5
      })
    }
    else {
      Alert.alert('Are you sure to stop service ?',
        'Once you stop service this can no longer work',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Yes', onPress: async () => {
              await this.removeValue()
              BackgroundTaskService.stop();
              this.getDataX()
              AudioHandler.unMuteDevice('x', 'y')
              this.setState({
                statusX: 1
              })

            }
          },
        ],
        { cancelable: false }
      )

    }
  }

  resetTriggers = async() => {
    try {
      await AsyncStorage.removeItem('@trigger')
      this.setState({
        resText:null
      })
    } catch (e) {
      alert('restart the app')
    }
  }

  outputInfo = () => {
    if(this.state.resText != null){
      return(
        this.state.resText.map((i,j)=>{
          return(
            <View key={j} style={{ width:"100%",height:60,flexDirection:"row",justifyContent:"space-between"}} >
              <View style={{width:"45%",justifyContent:"center",alignItems:"center"}}>
                <Text style={{color:"black",fontWeight:"bold",color:"#00aaff"}}>
                  {i.time}
                </Text>
              </View>
              <View style={{width:"45%",justifyContent:"center",alignItems:"center"}}>
                <Text style={{color:"black",fontWeight:"bold",color:"#00ffff"}}>
                  {i.status}
                </Text>
              </View>
            </View>
          )
        })
      )
    }
  }
  // BackgroundTaskService.start()
  // BackgroundTaskService.stop()
  render() {
    return (
      <ScrollView style={{ backgroundColor: "#000", width: "100%"}}>
        <TouchableOpacity style={{alignSelf:"center",marginTop:30}} onPress={() => this.hero()}>
          <Image source={this.state.statusX == 5 ? require('./asseets/off.png') : require('./asseets/on.png')} style={{ width: 140, height: 200 }} />
        </TouchableOpacity>
        <Text style={{ color: "#fff", textAlign: "center", fontWeight:"bold" }}>
          {this.state.statusX == 5 ? "OFF THE SERVICE" : "ON THE SERVICE"}
        </Text>
        <View style={{width:"85%",minHeight:400,marginBottom:20,borderRadius:12,elevation:6,backgroundColor:"#0f0f0f",marginTop:20,alignSelf:"center"}}>
            <View style={{ width:"100%",height:60,flexDirection:"row",justifyContent:"space-between"}} >
              <View style={{width:"45%",justifyContent:"center",alignItems:"center"}}>
                <Text style={{color:"black",fontWeight:"bold",color:"#00aaff"}}>
                  Time
                </Text>
              </View>
              <View style={{width:"45%",justifyContent:"center",alignItems:"center"}}>
                <Text style={{color:"black",fontWeight:"bold",color:"#00ffff"}}>
                  Action
                </Text>
              </View>
            </View>
            {this.outputInfo()}
        </View>
        <TouchableOpacity onPress={() => {
          this.resetTriggers()
        }} style={{width:"50%",justifyContent:"center",alignItems:"center",borderRadius:30,elevation:12,height:60,backgroundColor:"#00aaff",alignSelf:"center",marginBottom:40}}>
          <Text style={{fontWeight:"bold",fontSize:16}}>
            Reset Data
          </Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

export default App