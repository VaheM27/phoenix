import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import {Api} from '~/utils';
import {Endpoints} from '~/config';
import Notification from '~/models/Notification';
import FirebaseService from '~/services/FirebaseService';
import {SCREEN_KEYS} from '~/navigation';
import {notificationsStore} from '~/store/notifications.store';
import Toast from 'react-native-toast-message';

export const notificationTypes = {
  LISTING_COMMENT: 'LISTING_COMMENT',
  LISTING_UPDATE: 'LISTING_UPDATE',
};

export const handleNotification = async (
  notification: Notification | any,
  navigation: any,
) => {
  FirebaseService.markNotificationAsRead(notification).then(() =>
    notificationsStore.getNotifications(),
  );

  switch (notification.type) {
    case notificationTypes.LISTING_COMMENT: {
      let listing = await FirebaseService.getDocumentByPath(
        notification.referencePath,
      );
      navigation.navigate(SCREEN_KEYS.OFFER_DETAILS, {
        listing,
      });
    }
  }
};

class Notifications {
  registerForegroundNotifications = (navigation: any) => {
    messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      let notification = remoteMessage.data;
      Toast.show({
        text1: remoteMessage.notification?.title,
        text2: remoteMessage.notification?.body,
        onPress: () => {
          handleNotification(notification, navigation);
        },
      });
    });
  };

  registerAppWithFCM = async () => {
    let authStatus = await messaging().requestPermission();
    if (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      messaging.AuthorizationStatus.PROVISIONAL
    ) {
    }
  };

  getToken = async () => {
    let token = await messaging().getToken();
    return token;
  };

  saveTokenToFirebase = async () => {
    let token = await this.getToken();
    let uid = auth().currentUser?.uid;
    console.log({
      uid: uid ? uid : null,
      token,
    });

    try {
      let res = await Api().post(Endpoints.DEVICE_TOKEN, {
        uid: uid ? uid : null,
        token,
      });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
}

export default new Notifications();
