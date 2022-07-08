import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Text from '../Text';
import {colors, spacing} from '~/theme';
import {Offer} from '~/types';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View as MotiView} from '@motify/components';

export type OfferListItemProps = {
  item: Offer;
  onPress: () => void;
};

const OfferListItem: React.FC<OfferListItemProps> = ({item, onPress}) => {
  const specifications = [
    item.brand,
    item.phoneColor,
    item.phoneStorage,
    item.phoneCondition,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <MotiView style={styles.itemContainer}>
      <TouchableOpacity style={styles.contentContainer} onPress={onPress}>
        <Image
          source={{
            uri: item.pictures[0],
          }}
          style={styles.imageStyle}
        />

        <View
          style={{
            flex: 1,
            paddingRight: spacing.small,
            marginLeft: spacing.large,
          }}>
          <Text style={{textTransform: 'capitalize'}} variant="body1Bold">
            {item.phoneModel}
          </Text>
          <Text variant="body2Regular" style={{textTransform: 'capitalize'}}>
            {specifications}
          </Text>
          <View
            style={[styles.row, {marginTop: spacing.medium, flexWrap: 'wrap'}]}>
            <View style={[styles.row, {marginRight: spacing.medium}]}>
              <FontAwesome5 size={16} name="location-arrow" />
              <Text style={{marginLeft: spacing.small}} text={item.distance} />
            </View>

            <View style={[styles.row, {marginRight: spacing.medium}]}>
              <Ionicons size={16} name="pricetag" />
              <Text
                variant="body2Regular"
                style={{marginLeft: spacing.small}}
                text={`$${item.askingPrice.toString()}`}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    paddingVertical: spacing.normal,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginHorizontal: spacing.content,
  },
  contentContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    height: 60,
    width: 60,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
});

export default React.memo(OfferListItem);
