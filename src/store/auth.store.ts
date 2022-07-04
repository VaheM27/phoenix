import {action, computed, makeObservable, observable} from 'mobx';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export class AuthStore {
  loading: boolean = false;
  firebaseUser: FirebaseAuthTypes.User | null = null;
  manualLoggedIn: boolean = false;

  constructor() {
    makeObservable(this, {
      loading: observable,
      firebaseUser: observable,
      isSignedIn: computed,
      setLoading: action,
      setFirebaseUser: action,
      clearStore: action,
    });
  }

  // Reset all values to initation value
  clearStore = () => {
    this.loading = false;
  };
  setFirebaseUser = (value: FirebaseAuthTypes.User | null) => {
    this.firebaseUser = value;
  };
  setLoading = (value: boolean) => {
    this.loading = value;
  };
  setManualLoggedIn = (value: boolean) => {
    this.manualLoggedIn = value;
  };

  get isSignedIn() {
    return !!this.firebaseUser;
  }

  signUp = async (displayName: string, email: string, password: string) => {
    const {user} = await auth().createUserWithEmailAndPassword(email, password);
    try {
      const updatePromise = user.updateProfile({displayName});
      const addPromise = firestore()
        .collection('users')
        .doc(user.uid)
        .set({name: displayName});
      await Promise.all([updatePromise, addPromise]);
    } catch (error) {
      await user.delete();
      throw error;
    }
  };
}

export const authStore = new AuthStore();
