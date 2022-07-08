import {CompositeScreenProps} from '@react-navigation/core';

import {observer} from 'mobx-react';
import React, {FC, useCallback, useEffect, useState, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  SectionList,
} from 'react-native';
import {
  BottomSheet,
  EmptyView,
  FloatingAddButton,
  OfferListItem,
  Text,
} from '~/components';
import permissions from '~/constants/permissions';
import {useGeoLocationPermission} from '~/hooks';
import {SCREEN_KEYS} from '~/navigation';
import {useStore} from '~/store';
import {colors, spacing} from '~/theme';
import {Offer} from '~/types';
import PermissionDisplayer from './components/PermissionDisplayer';
import Permission from '~/models/Permission';

type Section = {
  title: string;
  data: Offer[];
};

const HomeScreen: FC<CompositeScreenProps<any, any>> = ({navigation}) => {
  const {t} = useTranslation();
  const {offersStore} = useStore();
  const {authStore} = useStore();
  const {getData, refresh, refreshing, loading, fetchMore, list, error} =
    offersStore;
  const sections = useMemo(() => {
    // Group items by cityName
    const result: Section[] = [];
    list.forEach((item, index) => {
      if (index == 0) {
        result.push({
          title: item.cityName,
          data: [item],
        });
      } else {
        const last = list[index - 1];
        if (last.cityName === item.cityName) {
          result[result.length - 1].data.push(item);
        } else {
          result.push({
            title: item.cityName,
            data: [item],
          });
        }
      }
    });
    return result;
  }, [list]);
  const [permissionsModalVisible, setPermissionsModalVisible] = useState(false);

  const [hasLocationPermission, requestGeolocationPermission] =
    useGeoLocationPermission({
      ios: 'whenInUse',
      android: 'android.permission.ACCESS_FINE_LOCATION',
    });
  useEffect(() => {
    if (hasLocationPermission) {
      getData();
    }
  }, [hasLocationPermission]);

  const keyExtractor = useCallback(item => item.id, []);
  const renderItem = useCallback(
    item => (
      <OfferListItem
        onPress={() => {
          onItemPress(item);
        }}
        item={item}
      />
    ),
    [],
  );
  const renderSectionHeader = useCallback(
    ({section}) => (
      <Text variant="body1Bold" style={styles.sectionHeader}>
        {section.title || 'Unkown'}
      </Text>
    ),
    [],
  );
  const onCreatePress = useCallback(() => {
    navigation.navigate(SCREEN_KEYS.POST_OFFER);
  }, []);

  const onItemPress = (item: any) => {
    navigation.navigate(SCREEN_KEYS.OFFER_DETAILS, {
      listing: item,
    });
  };

  useEffect(() => {
    setPermissionsModalVisible(false);
  }, [authStore.manualLoggedIn]);

  return (
    <>
      <View style={styles.container}>
        <SectionList<Offer>
          sections={sections as any}
          refreshing={refreshing}
          onRefresh={refresh}
          contentContainerStyle={{
            paddingBottom: 50,
          }}
          onEndReached={fetchMore}
          keyExtractor={keyExtractor}
          renderSectionHeader={renderSectionHeader}
          renderItem={({item}) => {
            return renderItem(item);
          }}
          ListEmptyComponent={
            !hasLocationPermission ? (
              <EmptyView
                isFailed
                errorTitle={t('location_permission_denied')} // Location permission denied
                errorMessage={
                  t('cant_access_the_user_location') // Can't access the user location. Please enable in the app settings
                }
                // @ts-ignore
                onRetry={requestGeolocationPermission}
              />
            ) : (
              <EmptyView
                isLoading={loading}
                isFailed={error}
                onRetry={getData}
              />
            )
          }
          ListFooterComponent={
            loading && !refreshing && list.length > 0 ? (
              <View style={{height: 100, width: '100%'}}>
                <ActivityIndicator size={'small'} />
              </View>
            ) : undefined
          }
        />
        {hasLocationPermission && <FloatingAddButton onPress={onCreatePress} />}
      </View>

      <BottomSheet
        visible={permissionsModalVisible}
        setVisible={setPermissionsModalVisible}>
        <View style={{paddingHorizontal: spacing.medium}}>
          <Text color={colors.darkGrey} variant="body2Regular">
            Some permissions you might want to enable in order to fully use the
            app.
          </Text>
          <FlatList<Permission>
            style={{marginTop: spacing.medium}}
            data={permissions}
            ItemSeparatorComponent={() => (
              <View style={{height: spacing.normal}} />
            )}
            renderItem={({item}) => {
              if (item.title !== 'Notifications') {
                return <PermissionDisplayer permission={item} />;
              } else {
                return null;
              }
            }}
          />
        </View>
      </BottomSheet>
    </>
  );
};

export default observer(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sectionHeader: {
    backgroundColor: colors.white,
    textAlign: 'center',
    paddingVertical: spacing.smaller,
    color: colors.red,
  },
});
