import {action, makeObservable, observable, computed} from 'mobx';
import _, {findIndex} from 'lodash';
import {Offer} from '~/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

export class ProfileStore {
  loading: boolean = false;
  refreshing: boolean = false;
  list: Offer[] = [];
  hasNextPage = true;
  error?: any = null;
  lastFetchDocument: any | null = null;
  currentProfile: any = null;

  constructor() {
    makeObservable(this, {
      loading: observable,
      refreshing: observable,
      list: observable,
      enteris: computed,
      getData: action,
      error: observable,
      setList: action,
      setRefreshing: action,
      setError: action,
      setLoading: action,
      currentProfile: observable,
      getCurrentProfile: action,
    });
  }
  setLoading = (value: boolean) => (this.loading = value);
  setRefreshing = (value: boolean) => (this.refreshing = value);
  setError = (value: any) => (this.error = value);
  setList = (value: Offer[]) => (this.list = value);

  get enteris(): {[id: string]: Offer} {
    return _.keyBy(this.list, 'id');
  }

  clearStore = () => {
    this.list = [];
    this.loading = false;
    this.refreshing = false;
    this.error = null;
    this.hasNextPage = true;
    this.lastFetchDocument = null;
    this.currentProfile = null;
  };

  getCurrentProfile = async () => {
    let data = (
      await firestore().collection('users').doc(auth().currentUser?.uid).get()
    ).data();
    this.currentProfile = data;
  };

  getData = async (refresh?: boolean) => {
    if (this.loading) {
      return;
    }
    try {
      this.setLoading(true);
      const isNextPage = this.hasNextPage && !refresh;
      const limit = 20;
      let query = firestore()
        .collection('users')
        .doc(auth().currentUser?.uid)
        .collection('offers')
        .orderBy('createdAt', 'desc')
        .limit(limit);

      if (isNextPage && this.lastFetchDocument) {
        query = query.startAfter(this.lastFetchDocument);
      }

      const response = await query.get();
      const {docs, empty} = response;
      const data = docs.map(doc => ({id: doc.id, ...doc.data()})) as Offer[];

      if (!empty) {
        this.lastFetchDocument = docs[docs.length - 1];
      }

      this.hasNextPage = response.size === limit;
      this.setList(isNextPage ? _.uniqBy(this.list.concat(data), 'id') : data);
    } catch (error) {
      this.setError(error);
    } finally {
      this.setLoading(false);
    }
  };

  fetchMore = async () => {
    if (!this.hasNextPage) {
      return;
    }
    this.getData();
  };

  refresh = async () => {
    this.setRefreshing(true);
    await this.getData(true);
    this.setRefreshing(false);
  };

  completeOffer = async (id: string) => {
    const response = await firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .collection('offers')
      .doc(id)
      .set({status: 'completed'}, {merge: true});

    const index = findIndex(this.list, {id});
    if (index != -1) {
      this.list[index].status = 'completed';
      this.setList([...this.list]);
    }
    return response;
  };

  deleteOffer = async (id: string) => {
    const docRef = firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .collection('offers')
      .doc(id);
    const deletedDocRef = firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .collection('deleted_offers')
      .doc(id);

    const response = await firestore().runTransaction(transaction => {
      return transaction.get(docRef).then(doc => {
        if (!doc.exists) {
          throw 'Document does not exist!';
        }
        transaction.set(deletedDocRef, {
          ...doc.data(),
          deleletedAt: moment().utc().toDate(),
        });
        transaction.delete(docRef);
      });
    });
    const index = findIndex(this.list, {id});
    if (index != -1) {
      this.list.splice(index, 1);
      this.setList([...this.list]);
    }
    return response;
  };
}

export const profileStore = new ProfileStore();
