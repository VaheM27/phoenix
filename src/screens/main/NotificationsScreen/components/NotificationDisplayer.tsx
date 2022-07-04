import React, {FC} from 'react';
import Notification from '~/models/Notification';
import {handleNotification, notificationTypes} from '~/helpers/Notifications';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from '~/components';
import {colors, spacing} from '~/theme';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {MotiView} from 'moti';
interface NotificationDisplayerProps {
  notification: Notification;
}

const NotificationDisplayer: FC<NotificationDisplayerProps> = ({
  notification,
}) => {
  const navigation = useNavigation();
  switch (notification.type) {
    case notificationTypes.LISTING_COMMENT: {
      return (
        <>
          <TouchableOpacity
            onPress={() => handleNotification(notification, navigation)}
            activeOpacity={0.7}
            style={[
              styles.container,
              {
                backgroundColor: !notification.seen
                  ? colors.lightGrey
                  : colors.white,
              },
            ]}>
            <MotiView
              style={[styles.dotStyle, {opacity: notification.seen ? 0 : 1}]}
            />
            <View style={{maxWidth: '80%'}}>
              <Text top="small" variant="body2Regular">
                {notification.body}
              </Text>
              <Text
                top="small"
                color={colors.darkGrey}
                variant="caption1Regular">
                {moment(notification.createdAt).format('MMM Do YY')}
              </Text>
            </View>
            <Image
              style={styles.imageStyle}
              source={{uri: notification.image}}
            />
          </TouchableOpacity>
        </>
      );
    }
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    padding: spacing.medium,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageStyle: {
    height: 55,
    width: 55,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.grey,
  },
  dotStyle: {
    height: 10,
    width: 10,
    backgroundColor: colors.secondary,
    borderRadius: 100,
  },
});

export default NotificationDisplayer;
