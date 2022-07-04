import React, {FC, useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors} from '~/theme';
import {Text} from '..';

interface PickerProps {
  options: string[];
  horizontal?: boolean;
  multiple?: boolean;
  value?: string;
  pickedColor?: string;
  onPick: (pickedItem: string[]) => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  optionRingStyle?: ViewStyle;
  numColumns?: number;
}

const ExpandingPicker: FC<PickerProps> = ({
  options,
  horizontal,
  multiple,
  value,
  pickedColor = colors.black,
  onPick,
  style,
  textStyle,
  optionRingStyle,
  numColumns,
}) => {
  const [picked, setPicked] = useState(() => {
    if (value) {
      return [value];
    } else {
      return [];
    }
  });

  function handlePick(option: string) {
    if (picked.includes(option)) {
      let pickedCopy = picked;
      pickedCopy = pickedCopy.filter(x => x !== option);
      pickedCopy = pickedCopy.filter(x => x);
      setPicked(pickedCopy);
    } else {
      if (multiple) {
        setPicked(pre => [...pre, option]);
        return;
      }

      setPicked([option]);
    }
  }

  useEffect(() => {
    if (onPick) {
      onPick(picked);
    }
  }, [picked]);

  const RenderOption = ({option}: any) => (
    <View
      style={[styles.optionContainer, {width: numColumns ? '45%' : '100%'}]}>
      <TouchableOpacity
        onPress={() => handlePick(option)}
        style={[styles.optionTouchContainer]}>
        <View style={[styles.optionRingContainer, optionRingStyle]}>
          <View
            style={[
              styles.optionRing,
              {
                backgroundColor: picked.includes(option)
                  ? pickedColor
                  : 'transparent',
              },
            ]}
          />
        </View>
        <Text
          variant="body1Bold"
          color={colors.black}
          style={{
            ...styles.optionText,
            ...textStyle,
          }}>
          {option}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[
        {
          flexDirection: horizontal ? 'row' : 'column',
          marginHorizontal: horizontal ? 5 : 0,
        },
        style,
      ]}>
      <FlatList
        nestedScrollEnabled
        disableVirtualization
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        horizontal={horizontal}
        data={options}
        numColumns={numColumns}
        renderItem={({item}) => {
          return <RenderOption option={item} />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  optionTouchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionRing: {
    height: 15,
    width: 15,
    borderRadius: 100,
  },
  optionRingContainer: {
    borderRadius: 100,
    padding: 2,
    borderWidth: 1,
  },
  optionText: {
    marginLeft: 15,
    fontSize: 18,
  },
  optionContainer: {marginVertical: 10},
});

export default ExpandingPicker;
