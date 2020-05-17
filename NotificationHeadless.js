import {ToastAndroid} from 'react-native';

export default PushNotification = async (data) => {
  console.log('Received fcm notification in RN.');
  ToastAndroid.show('Received message from fcm', ToastAndroid.LONG);
}

