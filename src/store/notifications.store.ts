import {action, makeObservable, observable} from 'mobx';
import _, {findIndex} from 'lodash';
import Notification from '~/models/Notification';
import FirebaseService from '~/services/FirebaseService';

export class NotificationsStore {
  loading: boolean = false;
  notifications: Notification[] = [];
  error: any = '';

  constructor() {
    makeObservable(this, {
      loading: observable,
      notifications: observable,
      getNotifications: action,
    });
  }

  setLoading = (value: boolean) => (this.loading = value);

  clearStore = () => {
    this.notifications = [];
  };

  getNotifications = async () => {
    this.setLoading(true);
    try {
      let notifications = await FirebaseService.fetchNotifications();
      console.log(notifications);
      this.notifications = notifications;
      this.setLoading(false);
    } catch (err) {
      console.log(err);
      this.error = err;
    }
  };
}

export const notificationsStore = new NotificationsStore();
