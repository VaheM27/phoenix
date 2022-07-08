import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import {observer} from 'mobx-react';
import {useStore} from '../../store';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Notifications from '~/helpers/Notifications';

const RootStack = createNativeStackNavigator();
function RootStackScreen() {
  const {authStore} = useStore();
  const navigation = useNavigation();
  const notificationsSignUp = async () => {
    await Notifications.registerAppWithFCM();
    await Notifications.saveTokenToFirebase();
    await Notifications.registerForegroundNotifications(navigation);
  };

  useEffect(() => {
    notificationsSignUp();
  }, []);

  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {authStore.isSignedIn ? (
        <RootStack.Screen name={'App'} component={AppNavigator} />
      ) : (
        <RootStack.Screen name={'Auth'} component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}

export default observer(RootStackScreen);
