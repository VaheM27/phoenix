import React, {useEffect, useState, useRef} from 'react';
import {colors, spacing} from '~/theme';
import {Button, Screen, Text} from '~/components';
import {observer} from 'mobx-react-lite';
import {TextInput} from '~/components';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  ScrollView,
  TextInput as RNTextInput,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {SCREEN_KEYS} from '~/navigation';
import {Storage} from '~/utils';
import auth from '@react-native-firebase/auth';
import {CompositeScreenProps} from '@react-navigation/core';
import {useTranslation} from 'react-i18next';
import {useStore} from '~/store';
import i18next from 'i18next';
import {getDeviceLanguage} from '~/helpers/getDeviceLanguage';

const styles = StyleSheet.create({
  spaceBetween: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 0.8,
    justifyContent: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: spacing.small,
    paddingVertical: spacing.medium,
  },
  bottomSection: {
    justifyContent: 'flex-end',
  },
});

const SignInScreen: React.FC<CompositeScreenProps<any, any>> = ({
  navigation,
  route,
}) => {
  const {authStore} = useStore();
  const {t} = useTranslation();
  const scrollRef = useRef<ScrollView>();
  const passwordRef = useRef<RNTextInput>();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(
    Storage.getString('lastSignInEmail') || '',
  );
  const [password, setPassword] = useState('');
  const disabled = !email || !password;

  const signIn = async (_email: string, _password: string) => {
    if (loading || !_email || !_password) {
      return;
    }
    const trimedEmail = _email.trim();

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(trimedEmail, password);
      Storage.set('lastSignInEmail', trimedEmail);
      authStore.setManualLoggedIn(true);
    } catch (error: any) {
      Toast.show({type: 'error', text1: error.message});
    } finally {
      setLoading(false);
    }
  };

  const onSignInPress = () => {
    signIn(email, password);
  };

  const focusOnPassword = () => {
    passwordRef.current?.focus();
  };
  const onSignUpPress = () => {
    navigation.navigate(SCREEN_KEYS.SIGN_UP);
  };
  const onForgotPress = () => {
    navigation.navigate(SCREEN_KEYS.FORGOT_PASSWORD, {email});
  };

  useEffect(() => {
    const deviceLanguage = getDeviceLanguage();
    let appLanguage = 'en';
    if (deviceLanguage === 'ar_AR') {
      appLanguage = 'ar';
    }

    i18next.changeLanguage(appLanguage, err => {
      if (err) {
        return console.log('something went wrong loading', err);
      }
    });

    const {params = {}} = route;
    if (params.email) {
      setEmail(params.email);
    }
    if (params.password) {
      setPassword(params.password);
    }
    if (params.autoSignIn) {
      signIn(params.email || email, params.password || password);
    }
  }, [route.params]);

  return (
    <Screen scrollable scrollRef={scrollRef} safe>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.spaceBetween}>
          <View style={styles.contentContainer}>
            <Text
              center
              variant={'title1Bold'}
              top="medium"
              bottom={'tiny'}
              text={'Fenix'}
            />

            <TextInput.Email
              value={email}
              editable={!loading}
              returnKeyType={'next'}
              onChangeText={setEmail}
              onSubmitEditing={focusOnPassword}
            />
            <TextInput.Password
              inputRef={passwordRef}
              returnKeyType={'go'}
              value={password}
              onChangeText={setPassword}
              blurOnSubmit={true}
              onSubmitEditing={onSignInPress}
            />
            <Text
              touchable
              variant={'caption1Regular'}
              containerStyle={styles.forgotPassword}
              onPress={onForgotPress}
              text={t('forgot_password')}
            />
          </View>

          <View style={styles.bottomSection}>
            <Text bottom="small" style={{alignSelf: 'center'}}>
              <Text variant={'body2Regular'} text={t('dont_have_an_account')} />
              <Text
                variant={'body2Regular'}
                onPress={onSignUpPress}
                color={colors.link}
                text={` ${t('sign_up')} `}
              />
            </Text>
            <Button
              top={'small'}
              loading={loading}
              disabled={disabled}
              text={t('sign_in')}
              onPress={onSignInPress}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Screen>
  );
};

export default observer(SignInScreen);
