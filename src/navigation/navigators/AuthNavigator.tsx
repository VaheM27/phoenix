import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_KEYS} from '~/navigation';
import {useNavigationOptions} from './NavigationOptions';
import {
  ForgetPasswordScreen,
  OnboardingScreen,
  SignInScreen,
  SignUpScreen,
  WebViewScreen,
} from '~/screens';
import {Storage} from '~/utils';

const AuthStack = createNativeStackNavigator();
function AuthNavigator() {
  const {headerOptions} = useNavigationOptions();

  const finishedOnboarding = React.useMemo(
    () => Storage.getBoolean('finishedOnboarding'),
    [],
  );

  return (
    <AuthStack.Navigator
      initialRouteName={
        finishedOnboarding ? SCREEN_KEYS.SIGN_IN : SCREEN_KEYS.ONBOARDING
      }
      // @ts-ignore
      screenOptions={{...headerOptions, headerShown: false}}>
      <AuthStack.Screen
        name={SCREEN_KEYS.ONBOARDING}
        component={OnboardingScreen}
      />
      <AuthStack.Screen name={SCREEN_KEYS.SIGN_IN} component={SignInScreen} />
      <AuthStack.Screen name={SCREEN_KEYS.SIGN_UP} component={SignUpScreen} />
      <AuthStack.Screen
        name={SCREEN_KEYS.FORGOT_PASSWORD}
        component={ForgetPasswordScreen}
      />
      <AuthStack.Screen name={SCREEN_KEYS.WEBVIEW} component={WebViewScreen} />
    </AuthStack.Navigator>
  );
}

export default AuthNavigator;
