import {CompositeScreenProps} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {FC, useEffect} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {notificationsStore} from '~/store/notifications.store';
import {colors, screen} from '~/theme';
import NotificationDisplayer from './components/NotificationDisplayer';

const NotificationsScreen: FC<CompositeScreenProps<any, any>> = ({}) => {
  useEffect(() => {
    (async () => await notificationsStore.getNotifications())();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        refreshing={notificationsStore.loading}
        onRefresh={notificationsStore.getNotifications}
        style={{flex: 1, paddingBottom: 100}}
        contentContainerStyle={{width: screen.width, alignSelf: 'center'}}
        data={notificationsStore.notifications
          .slice()
          .sort((a, b) => b.createdAt - a.createdAt)}
        renderItem={({item}) => <NotificationDisplayer notification={item} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default observer(NotificationsScreen);
