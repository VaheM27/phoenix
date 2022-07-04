import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  I18nManager,
  ActivityIndicator,
} from 'react-native';
import {OfferListItem, OfferListItemProps} from '~/components';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RectButton} from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {colors} from '~/theme';
import {useStore} from '~/store';
import Toast from 'react-native-toast-message';
import {useTranslation} from 'react-i18next';

const SwipeableOfferListItem: React.FC<OfferListItemProps> = props => {
  const {item: offer} = props;
  const ref = useRef();
  const [loading, setLoading] = useState(false);
  const {profileStore} = useStore();
  const {t} = useTranslation();
  const isCompleted = offer.status === 'completed';
  const close = () => {
    ref.current?.close();
  };
  const onCompletePress = async () => {
    try {
      setLoading(true);
      await profileStore.completeOffer(offer.id);
      Toast.show({type: 'success', text1: t('offer_completed_successfully')});
    } catch (error) {
      Toast.show({type: 'error', text1: error.message});
    } finally {
      setLoading(false);
    }
  };
  const onDeletePress = async () => {
    try {
      setLoading(true);
      await profileStore.deleteOffer(offer.id);
      Toast.show({type: 'success', text1: t('offer_deleted_successfully')});
    } catch (error) {
      Toast.show({type: 'error', text1: error.message});
    } finally {
      setLoading(false);
    }
  };
  const renderRightAction = (
    iconName: string,
    color: string,
    onPress: () => void,
    x: number,
    progress: Animated.AnimatedInterpolation,
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = () => {
      onPress();
      close();
    };

    return (
      <Animated.View style={{flex: 1, transform: [{translateX: trans}]}}>
        <RectButton
          style={[styles.rightAction, {backgroundColor: color}]}
          onPress={pressHandler}>
          <FontAwesome
            color={colors.white}
            name={iconName}
            size={28}
            style={{alignSelf: 'center'}}
          />
        </RectButton>
      </Animated.View>
    );
  };
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation,
    _dragAnimatedValue: Animated.AnimatedInterpolation,
  ) => (
    <View
      style={{
        width: isCompleted ? 64 : 128,
        height: '100%',
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      }}>
      {!isCompleted &&
        renderRightAction(
          'check',
          colors.success,
          onCompletePress,
          128,
          progress,
        )}
      {renderRightAction('trash', colors.danger, onDeletePress, 64, progress)}
    </View>
  );
  return (
    <Swipeable ref={ref} renderRightActions={renderRightActions}>
      <OfferListItem {...props} />
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loader: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.transparentWhite,
  },
});

export default React.memo(SwipeableOfferListItem);
