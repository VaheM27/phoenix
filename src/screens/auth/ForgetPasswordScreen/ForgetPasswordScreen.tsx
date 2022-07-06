import React, {useState} from 'react';
import {Button, Screen, Text} from '~/components';
import {TextInput} from '~/components';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {SCREEN_KEYS} from '~/navigation';
import auth from '@react-native-firebase/auth';
import {CompositeScreenProps} from '@react-navigation/core';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors, spacing} from '~/theme';
import {use} from 'i18next';
import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
  spaceBetween: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 0.8,
  },
  bottomSection: {
  },
  backButton: {
    position: 'absolute',
    left: spacing.content,
  },
});

const ForgetPasswordScreen: React.FC<CompositeScreenProps<any, any>> = ({
  navigation,
  route,
}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(route.params?.email || '');
  const disabled = !email;

  const onForgotPress = async () => {
    const trimedEmail = email.trim();
    if (!trimedEmail?.length) {
      return;
    }
    setLoading(true);
    try {
      await auth().sendPasswordResetEmail(trimedEmail);
      navigation.navigate(SCREEN_KEYS.SIGN_IN, {email: trimedEmail});
      Toast.show({
        type: 'success',
        text1: t('we_have_sent_you_a_reset_link'),
      });
    } catch (error: any) {
      Toast.show({type: 'error', text1: error.message});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scrollable safe>
      <View style={styles.spaceBetween}>
        <View style={styles.contentContainer}>
          <Text
            center
            variant={'title1Bold'}
            top="medium"
            bottom={'xxLarge'}
            text={t('send_reset_password_link')}
          />

          <TextInput.Email
            autoFocus
            value={email}
            editable={!loading}
            returnKeyType={'go'}
            blurOnSubmit={false}
            onChangeText={setEmail}
            onSubmitEditing={onForgotPress}
          />
        </View>

        <View style={styles.bottomSection}>
          <Button
            top={'small'}
            loading={loading}
            disabled={disabled}
            text={t('send')}
            onPress={onForgotPress}
          />
        </View>
      </View>
      <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
        <Ionicons
          size={52}
          color={colors.black}
          name="ios-arrow-back-circle-sharp"
        />
      </TouchableOpacity>
    </Screen>
  );
};

export default ForgetPasswordScreen;
