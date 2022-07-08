import {CompositeScreenProps} from '@react-navigation/native';
import {t} from 'i18next';
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Text} from '~/components';
import {SCREEN_KEYS} from '~/navigation';
import {colors, screen, spacing} from '~/theme';
import {Storage} from '~/utils';
import OnboardingTipDisplayer from './components/OnboardingTipDisplayer';
import ProgressLine from './components/ProgressLine';

const onboardingData = [
  {
    animation: require('../../../assets/animations/offers.json'),
    description: t(
      'ONBOARDING_SCHEMA.trade_phones_easily_get_offers_to_your_phone_in_minutes',
    ),
  },
  {
    animation: require('../../../assets/animations/find-offers.json'),
    description: t(
      'ONBOARDING_SCHEMA.look_through_thousands_of_listings_and_find_the_best_option',
    ),
  },
  {
    animation: require('../../../assets/animations/comments.json'),
    description: t(
      'ONBOARDING_SCHEMA.see_what_people_are_saying_about_the_phone_you_are_interested_in',
    ),
  },
  {
    animation: require('../../../assets/animations/location.json'),
    description: t(
      'ONBOARDING_SCHEMA.Fenix_thousands_of_cheap_phones_near_your_location',
    ),
  },
];

const OnboardingScreen: FC<CompositeScreenProps<any, any>> = ({navigation}) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const sendToLogin = () => {
    navigation.navigate(SCREEN_KEYS.SIGN_IN);
    Storage.set('finishedOnboarding', true);
  };

  useEffect(() => {
    flatListRef.current?.scrollToIndex({
      index: currentPage,
      animated: true,
    });
  }, [currentPage]);

  const handleScroll = (x: number | undefined) => {
    if (x === null || x === undefined) {
      return;
    }
    let index = x / screen.width;
    setCurrentPage(index);
  };

  const handleNextPress = () => {
    if (currentPage <= onboardingData.length - 2) {
      setCurrentPage(pre => pre + 1);
    } else {
      sendToLogin();
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.lineContainer}>
          <ProgressLine
            width={screen.contentWidth}
            currentIndex={currentPage}
            totalIndex={onboardingData.length - 1}
          />
        </View>
        <FlatList
          onScrollEndDrag={e =>
            handleScroll(e.nativeEvent.targetContentOffset?.x)
          }
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          ref={flatListRef}
          data={onboardingData}
          contentContainerStyle={{paddingVertical: spacing.medium}}
          renderItem={({item}) => (
            <OnboardingTipDisplayer
              description={item.description}
              animation={item.animation}
            />
          )}
        />
        <View style={styles.bottomContainer}>
          <Button
            style={{width: '100%'}}
            onPress={handleNextPress}
            text="Next"
          />
          <Text
            onPress={sendToLogin}
            style={{textDecorationLine: 'underline'}}
            color={colors.darkGrey}
            top="medium">
            Skip
          </Text>
        </View>
      </SafeAreaView>
      <StatusBar barStyle={'dark-content'} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyContainer: {
    marginTop: '10%',
    width: screen.contentWidth,
    alignItems: 'center',
    alignSelf: 'center',
  },
  lineContainer: {
    width: screen.contentWidth,
    alignSelf: 'center',
    marginTop: spacing.medium,
  },
  bottomContainer: {
    width: screen.contentWidth,
    alignSelf: 'center',
    marginBottom: spacing.large,
    alignItems: 'center',
  },
});

export default OnboardingScreen;
