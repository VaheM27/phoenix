import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_KEYS} from '../../navigation';
// import {SplashScreen} from '~/screens';
import {colors, spacing} from '~/theme';
import {useNavigationOptions} from './NavigationOptions';
import {useStore} from '~/store';
import {View} from 'react-native';
import {
  HomeScreen,
  NotificationsScreen,
  OfferDetailsScreen,
  PostOfferScreen,
  ProfileScreen,
} from '~/screens';
import i18n from 'i18next';
import {useNavigation} from '@react-navigation/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderButton from './components/HeaderButton';
import {authStore} from '~/store/auth.store';
import {firebase} from '@react-native-firebase/auth';

const AppStack = createNativeStackNavigator();
export default function AppNavigator({}: any) {
  const {headerOptions} = useNavigationOptions();

  const {profileStore} = useStore();

  useEffect(() => {
    (async () => await profileStore.getCurrentProfile())();
  }, []);

  const profileHeaderRight = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <HeaderButton
          style={{marginRight: spacing.medium}}
          onPress={() => {
            firebase.auth().signOut();
            profileStore.clearStore();
            authStore.clearStore();
          }}
          Icon={() => (
            <Ionicons size={20} name="exit-outline" color={colors.white} />
          )}
        />
      </View>
    );
  };

  return (
    <AppStack.Navigator
      screenOptions={headerOptions as any}
      initialRouteName={SCREEN_KEYS.HOME}>
      <AppStack.Screen
        name={SCREEN_KEYS.SPLASH}
        component={View}
        options={{animation: 'none'}}
      />
      <AppStack.Screen
        options={{
          headerTitle: i18n.t('HEADER.HOME'),
          headerRight: HomeHeaderRight,
        }}
        name={SCREEN_KEYS.HOME}
        component={HomeScreen}
      />
      <AppStack.Screen
        options={{
          headerTitle: i18n.t('HEADER.PROFILE'),
          headerRight: profileHeaderRight,
        }}
        name={SCREEN_KEYS.PROFILE}
        component={ProfileScreen}
      />
      <AppStack.Screen
        options={{}}
        name={SCREEN_KEYS.OFFER_DETAILS}
        component={OfferDetailsScreen}
      />
      <AppStack.Screen
        options={{headerShown: false}}
        name={SCREEN_KEYS.POST_OFFER}
        component={PostOfferScreen}
      />
      <AppStack.Screen
        options={{headerTitle: i18n.t('HEADER.NOTIFICATIONS')}}
        name={SCREEN_KEYS.NOTIFICATIONS}
        component={NotificationsScreen}
      />
    </AppStack.Navigator>
  );
}
const HomeHeaderRight = () => {
  const {navigate} = useNavigation();
  return (
    <View style={{flexDirection: 'row'}}>
      <HeaderButton
        style={{marginRight: spacing.medium}}
        onPress={() => {
          // @ts-ignore
          navigate(SCREEN_KEYS.NOTIFICATIONS);
        }}
        Icon={() => (
          <Ionicons
            size={20}
            name="notifications-outline"
            color={colors.white}
          />
        )}
      />
      <HeaderButton
        onPress={() => {
          // @ts-ignore
          navigate(SCREEN_KEYS.PROFILE);
        }}
        Icon={() => (
          <FontAwesome5Icon size={20} name="user" color={colors.white} />
        )}
      />
    </View>
  );
};
