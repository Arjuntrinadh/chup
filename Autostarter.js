import BatchedBridge from "react-native/Libraries/BatchedBridge/BatchedBridge";
import BackgroundTaskService from "./BackgroundTaskService";
export class ExposedToJava {
  AutoStart(message) {
     BackgroundTaskService.start()
  }
}

const exposedToJava = new ExposedToJava();
BatchedBridge.registerCallableModule("JavaScriptVisibleToJava", exposedToJava);