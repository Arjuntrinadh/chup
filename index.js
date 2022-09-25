/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import BackgroundTaskService from './BackgroundTaskService';

AppRegistry.registerHeadlessTask('HeadlessAction', () =>{
    console.log('HI')
  BackgroundTaskService.start()
}
);
AppRegistry.registerComponent(appName, () => App);
