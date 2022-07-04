/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import AppContainer from './src/navigation/AppContainer';
import 'react-native-reanimated';
// import RNBootSplash from 'react-native-bootsplash';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {authStore} from './src/store/auth.store';
import {LogBox} from 'react-native';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import CodePush from 'react-native-code-push';
import FirebaseService from '~/services/FirebaseService';
import messaging from '@react-native-firebase/messaging';
import Notifications from '~/helpers/Notifications';
import {useNavigation} from '@react-navigation/native';

console.ignoredYellowBox = [];
console.disableYellowBox = true;

const App = () => {
  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
    '[Error: Request failed with status code 409]',
  ]);

  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  const onAuthStateChanged = (user: FirebaseAuthTypes.User) => {
    authStore.setFirebaseUser(user);
    if (initializing) {
      setInitializing(false);
    }
  };
  useEffect(() => {
    // @ts-ignore
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (!initializing) {
      // RNBootSplash.hide({duration: 250});
    }
  }, [initializing]);

  if (initializing) {
    return null;
  }

  return <AppContainer />;
};

export default CodePush(gestureHandlerRootHOC(App));
