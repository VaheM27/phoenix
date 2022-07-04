import {notificationTypes} from '~/helpers/Notifications';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
export default interface Notification {
  type: keyof typeof notificationTypes;
  actorName: string;
  actorId: string;
  body: string;
  referencePath: string;
  image: string;
  seen: boolean;
  createdAt: Date | FirebaseFirestoreTypes.Timestamp | any;
  id: string;
};
