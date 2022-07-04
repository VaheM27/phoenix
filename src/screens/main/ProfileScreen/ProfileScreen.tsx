import {CompositeScreenProps} from '@react-navigation/core';
import {observer} from 'mobx-react';
import React, {FC, useCallback, useEffect} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {EmptyView} from '~/components';
import {SCREEN_KEYS} from '~/navigation';
import {useStore} from '~/store';
import {colors, spacing} from '~/theme';
import {Offer} from '~/types';
import SwipeableOfferListItem from './components/SwipeableOfferListItem';

const ProfileScreen: FC<CompositeScreenProps<any, any>> = ({navigation}) => {
  const {profileStore} = useStore();
  const {getData, refresh, refreshing, loading, fetchMore, list, error} =
    profileStore;

  useEffect(() => {
    getData();
  }, []);

  const keyExtractor = useCallback(item => item.id, []);
  const renderItem = useCallback(
    item => (
      <SwipeableOfferListItem
        onPress={() => {
          onItemPress(item);
        }}
        item={item}
      />
    ),
    [],
  );

  const onItemPress = (item: any) => {
    navigation.navigate(SCREEN_KEYS.OFFER_DETAILS, {
      listing: item,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList<Offer>
        data={list}
        refreshing={refreshing}
        onRefresh={refresh}
        contentContainerStyle={{paddingBottom: 50}}
        style={{padding: spacing.content}}
        onEndReached={fetchMore}
        keyExtractor={keyExtractor}
        renderItem={({item}) => {
          return renderItem(item);
        }}
        ListEmptyComponent={
          <EmptyView isLoading={loading} isFailed={error} onRetry={getData} />
        }
        ListFooterComponent={
          loading && !refreshing && list.length > 0 ? (
            <View style={{height: 100, width: '100%'}}>
              <ActivityIndicator />
            </View>
          ) : undefined
        }
      />
    </View>
  );
};

export default observer(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
