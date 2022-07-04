import React, {MutableRefObject, useState} from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  View,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import {colors, spacing, typography, font} from '../../theme';
import Text from '../Text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
  },
  inputContainer: {
    // backgroundColor: colors.lightGrey,
    flexDirection: 'column',
    height: 52,
    borderColor: colors.border,

    backgroundColor: colors.white,
    borderRadius: 5,
    borderWidth: 1,
  },
  focusedContainer: {
    borderColor: colors.black,
    backgroundColor: colors.white,
  },
  errorContainer: {
    borderColor: colors.danger,
    backgroundColor: colors.white,
  },
  input: {
    ...typography.caption1Regular,
    flex: 1,
    height: '100%',
    color: colors.input,
    padding: spacing.xMedium,
  },
  multilineInput: {
    textAlignVertical: 'top',
    marginVertical: spacing.tiny,
  },
  iconContainer: {
    padding: spacing.small,
    height: '100%',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    marginTop: spacing.xSmall,
    marginBottom: spacing.tiny,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firstNameContainer: {
    flex: 1,
    marginRight: spacing.small,
  },
  lastNameContainer: {
    flex: 1,
    marginLeft: spacing.small,
  },
});

interface optionType {
  label: string;
  value: string;
}

interface Props extends TextInputProps {
  title?: string;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  renderRight?: () => React.ReactNode;
  inputRef?: MutableRefObject<RNTextInput | undefined>;
  required?: boolean;
  innerTitle?: boolean;
  errorMessage?: string;
  errored?: boolean;
  color?: string;
  label?: string;
  variant?: keyof typeof typography;
  onSelect?: (value: string) => void;
  options?: optionType[];
  renderLeft?: () => React.ReactNode;
}

export default function TextInput(props: Props) {
  const [focused, setFocused] = useState(!!props.autoFocus);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  const {
    title,
    containerStyle,
    inputContainerStyle,
    style,
    renderRight,
    inputRef,
    required,
    errorMessage,
    color,
    errored,
    variant,
    onSelect,
    renderLeft,
  } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      {!!title && (
        <View style={styles.titleContainer}>
          <Text
            color={color}
            variant={!variant ? 'body1Regular' : variant}
            text={title}
          />
          {required && (
            <Text
              color={colors.danger}
              variant={!variant ? 'body1Regular' : variant}
              text={'*'}
            />
          )}
        </View>
      )}
      <View
        style={[
          styles.inputContainer,
          focused && styles.focusedContainer,
          errorMessage || errored ? styles.errorContainer : undefined,
          inputContainerStyle,
        ]}>
        <View style={{flexDirection: 'row', flex: 1}}>
          {renderLeft?.()}
          <RNTextInput
            // @ts-ignore

            ref={inputRef}
            {...props}
            onFocus={onFocus}
            onBlur={onBlur}
            autoCorrect={false}
            autoCapitalize={'none'}
            blurOnSubmit={true}
            style={[styles.input, style]}
          />
          {/* @ts-ignore */}
          {renderRight?.()}
        </View>
      </View>
      {errorMessage ? (
        <View style={styles.titleContainer}>
          <Text
            color={colors.danger}
            variant={'caption1Regular'}
            text={errorMessage}
          />
        </View>
      ) : undefined}
    </View>
  );
}

const EmailInput = (props: Props) => {
  const {t} = useTranslation();

  return (
    <TextInput
      title={t('email')}
      placeholder={'example@fenix.com'}
      autoCapitalize="none"
      autoComplete="email"
      textContentType="emailAddress"
      keyboardType="email-address"
      {...props}
    />
  );
};

const UsernameInput = (props: Props) => {
  return (
    <TextInput
      title={'Username'}
      placeholder={'fenix'}
      autoCapitalize="none"
      autoComplete="username"
      textContentType="username"
      keyboardType="email-address"
      {...props}
    />
  );
};

const PasswordInput = (props: Props) => {
  const {t} = useTranslation();
  const [secured, setSecured] = useState(true);
  const toggle = () => setSecured(prev => !prev);

  const renderRight = () => {
    if (!props.value) {
      return null;
    }
    return (
      <TouchableOpacity style={styles.iconContainer} onPress={toggle}>
        <MaterialCommunityIcons
          size={font.size.body1}
          name={secured ? 'eye-off' : 'eye'}
        />
      </TouchableOpacity>
    );
  };
  return (
    <TextInput
      title={t('password')}
      placeholder={'********'}
      autoCapitalize="none"
      autoComplete="password"
      textContentType="password"
      renderRight={renderRight}
      secureTextEntry={secured}
      {...props}
    />
  );
};

TextInput.Username = UsernameInput;
TextInput.Email = EmailInput;
TextInput.Password = PasswordInput;
