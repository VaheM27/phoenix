import React, {useState, useRef} from 'react';
import {colors} from '~/theme';
import {Button, Screen, Text} from '~/components';
import {observer} from 'mobx-react-lite';
import {TextInput} from '~/components';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  TextInput as RNTextInput,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {SCREEN_KEYS} from '~/navigation';
import {CompositeScreenProps} from '@react-navigation/core';
import {useStore} from '~/store';
import {Formik} from 'formik';
import {signUpSchema} from '~/utils/ValidationSchemas';
import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
  spaceBetween: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 0.8,
    justifyContent: 'center',
  },
  bottomSection: {
    justifyContent: 'flex-end',
  },
});

const SignUpScreen: React.FC<CompositeScreenProps<any, any>> = ({
  navigation,
}) => {
  const {t} = useTranslation();
  const {authStore} = useStore();
  const emailRef = useRef<RNTextInput>();
  const passwordRef = useRef<RNTextInput>();
  const [loading, setLoading] = useState(false);

  const focusOnEmail = () => {
    emailRef.current?.focus();
  };
  const focusOnPassword = () => {
    passwordRef.current?.focus();
  };
  const onTermsPress = () => {
    navigation.navigate(SCREEN_KEYS.WEBVIEW, {
      uri: 'https://fenix-bd79c.web.app/terms',
    });
  };
  const onPolicyPress = () => {
    navigation.navigate(SCREEN_KEYS.WEBVIEW, {
      uri: 'https://fenix-bd79c.web.app/policy',
    });
  };
  const onSignUpPress = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    if (loading) {
      return;
    }
    const trimedName = values.name.trim();
    const trimedEmail = values.email.trim();
    if (!trimedName || !trimedEmail || !values.password) {
      return;
    }

    setLoading(true);
    try {
      await authStore.signUp(trimedName, trimedEmail, values.password);
    } catch (error: any) {
      Toast.show({type: 'error', text1: error.message});
    } finally {
      setLoading(false);
    }
  };
  const onSignInPress = () => {
    navigation.navigate(SCREEN_KEYS.SIGN_IN);
  };

  return (
    <Screen scrollable safe>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Formik
          initialValues={{name: '', email: '', password: ''}}
          validationSchema={signUpSchema}
          onSubmit={onSignUpPress}>
          {({
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            handleSubmit,
          }) => (
            <View style={styles.spaceBetween}>
              <View style={styles.contentContainer}>
                <Text
                  center
                  variant={'title1Bold'}
                  top="medium"
                  bottom={'tiny'}
                  text={'Fenix'}
                />

                <TextInput
                  required
                  editable={!loading}
                  title={t('name')}
                  placeholder={'John Doe'}
                  returnKeyType={'next'}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  errorMessage={touched.name ? errors?.name : ''}
                  onSubmitEditing={focusOnEmail}
                />
                <TextInput.Email
                  required
                  inputRef={emailRef}
                  editable={!loading}
                  returnKeyType={'next'}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  errorMessage={touched.email ? errors?.email : ''}
                  onSubmitEditing={focusOnPassword}
                />
                <TextInput.Password
                  required
                  inputRef={passwordRef}
                  returnKeyType={'go'}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  errorMessage={touched.password ? errors?.password : ''}
                  blurOnSubmit={true}
                  onSubmitEditing={handleSubmit}
                />
                <Text style={{textAlign: 'right'}}>
                  {t('by_clicking_sign_up')}
                  <Text color={colors.link} onPress={onPolicyPress}>
                    {t('privacy_policy')}
                  </Text>
                  {' ' + t('and') + ' '}
                  <Text color={colors.link} onPress={onTermsPress}>
                    {t('terms_and_conditions')}
                  </Text>
                </Text>
              </View>

              <View style={styles.bottomSection}>
                <Text bottom="small" style={{alignSelf: 'center'}}>
                  <Text variant={'body2Regular'} text={t('have_an_account')} />
                  <Text
                    variant={'body2Regular'}
                    onPress={onSignInPress}
                    color={colors.link}
                    text={` ${t('sign_in')} `}
                  />
                </Text>
                <Button
                  top={'small'}
                  loading={loading}
                  disabled={!values.name || !values.email || !values.password}
                  text={t('sign_up')}
                  onPress={handleSubmit}
                />
              </View>
            </View>
          )}
        </Formik>
      </TouchableWithoutFeedback>
    </Screen>
  );
};

export default observer(SignUpScreen);
