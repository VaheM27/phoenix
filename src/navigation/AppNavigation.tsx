import React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {RootNavigator} from './navigators';
import {StatusBar, View} from 'react-native';
import {colors} from '../theme';
import {GlobalToast} from '../components';
import {useFlipper} from '@react-navigation/devtools';

const AppNavigation = () => {
  const navigationRef = useNavigationContainerRef();
  useFlipper(navigationRef);

  return (
    <View style={{flex: 1}}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={'light-content'}
      />
      <NavigationContainer ref={navigationRef}>
        <RootNavigator />
      </NavigationContainer>
      <GlobalToast />
    </View>
  );
};

export default AppNavigation;
