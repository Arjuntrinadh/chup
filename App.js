import { Text, View, PermissionsAndroid, Alert, TouchableOpacity, Image , NativeModules } from 'react-native'
import React, { Component } from 'react'
import BackgroundTaskService from './BackgroundTaskService';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { AudioHandler } = NativeModules;
export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      statusX: 1
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

  componentDidMount() {
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

  // BackgroundTaskService.start()
  // BackgroundTaskService.stop()
  render() {
    return (
      <View style={{ backgroundColor: "#000", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity onPress={() => this.hero()}>
          <Image source={this.state.statusX == 5 ? require('./asseets/off.png') : require('./asseets/on.png')} style={{ width: 140, height: 200 }} />
        </TouchableOpacity>
        <Text style={{ color: "white", textAlign: "center" }}>
         {this.state.statusX == 5 ? "OFF THE SERVICE" : "ON THE SERVICE"} 
        </Text>
      </View>
    )
  }
}

export default App