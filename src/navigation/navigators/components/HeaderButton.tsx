import React, {FC} from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';

interface HeaderButtonProps {
  Icon: any;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
}

const HeaderButton: FC<HeaderButtonProps> = ({Icon, onPress, style}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Icon />
    </TouchableOpacity>
  );
};

export default HeaderButton;
