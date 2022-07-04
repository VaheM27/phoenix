import React, {FC, useRef, useState} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {colors, font, spacing, typography} from '~/theme';
import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextInput as RNTextInput,
} from 'react-native';
import {Text} from '..';
import {brandOptions} from '~/constants';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

interface optionType {
  label: string;
  value: string;
}

interface Props extends TextInputProps {
  title?: string;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  renderRight?: () => React.ReactNode;
  inputRef?: any;
  required?: boolean;
  innerTitle?: boolean;
  errorMessage?: string;
  errored?: boolean;
  color?: string;
  label?: string;
  variant?: keyof typeof typography;
  onSelect: (value: string) => void;
  options: optionType[];
}

const Dropdown: FC<Props> = props => {
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
    placeholder,
    errorMessage,
    color,
    errored,
    variant,
    options,
    onSelect,
  } = props;

  const pickerRef = useRef<RNPickerSelect>(null);

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
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <RNPickerSelect
            style={{
              inputIOS: {
                fontFamily: font.regular,
                width: '100%',
                height: '100%',
                zIndex: 5,
                paddingLeft: spacing.xMedium,
              },
            }}
            items={options}
            placeholder={{
              label: placeholder,
              value: '',
            }}
            onOpen={onFocus}
            onClose={onBlur}
            onValueChange={value => {
              onSelect(value);
            }}
          />
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
};

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

export default Dropdown;
