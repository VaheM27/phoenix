import {Image, MotiView} from 'moti';
import React, {useState, FC} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from '~/theme';

interface PhonePictureDisplayerProps {
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  onBackPress?: () => void;
  picture: string;
}

const PhonePictureDisplayer: FC<PhonePictureDisplayerProps> = ({
  onPress,
  picture,
  style,
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={style}>
      {loading && (
        <MotiView
          from={{
            opacity: 1,
          }}
          onDidAnimate={(styleprop, finished) => {
            if (finished) {
              setLoading(false);
            }
          }}
          animate={{
            opacity: 0,
          }}
          transition={{
            type: 'timing',
            duration: 1000,
          }}
          style={{
            position: 'absolute',
            zIndex: 10,
            left: 0,
            right: 0,
            backgroundColor: colors.offWhite,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{height: 100, width: '100%'}}>
            <ActivityIndicator />
          </View>
        </MotiView>
      )}
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.imageContainer}
        onPress={onPress}>
        <Image
          resizeMode="cover"
          style={styles.imageContainer}
          source={{
            uri: picture,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: '100%',
  },
});

export default PhonePictureDisplayer;
