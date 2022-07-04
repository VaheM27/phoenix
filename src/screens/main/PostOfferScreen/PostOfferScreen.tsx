import React, {useRef, useState, FC} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  Dropdown,
  StepProgress,
  Text,
  TextInput,
  Button,
  ExpandingPicker,
} from '~/components';
import {brandOptions, colourOptions, storageOptions} from '~/constants';
import {colors, screen, spacing} from '~/theme';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import FirebaseService from '~/services/FirebaseService';
import Toast from 'react-native-toast-message';
import {useImagePicker} from '~/hooks';
import {CompositeScreenProps} from '@react-navigation/core';
import {useStore} from '~/store';
import {Formik} from 'formik';
import {offerSchemas} from '~/utils/ValidationSchemas';
import Listing from '~/models/Listing';
import {t} from 'i18next';
import {Image} from 'moti';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';

const screenPadding = 30;

const PostOfferScreen: FC<CompositeScreenProps<any, any>> = ({navigation}) => {
  const {offersStore} = useStore();
  const scrollRef = useRef<ScrollView>(null);

  const [activePage, setActivePage] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [canPost, setCanPost] = useState<boolean>(true);
  const [input, setInput] = useState<Listing>({
    postTitle: '',
    brand: '',
    phoneColor: '',
    phoneModel: '',
    phoneStorage: '',
    phoneCondition: '',
    description: '',
    contactNumber: '',
    askingPrice: '',
    pictures: [],
  });

  const [phoneImages, pickPhoneImages] = useImagePicker({
    mediaType: 'photo',
    selectionLimit: 3,
    maxWidth: 1000,
    maxHeight: 1000,
    quality: 0.5,
  });

  const animateToPage = (pageNum: number) => {
    setSubmitted(true);
    scrollRef.current?.scrollTo({
      x: (screen.contentWidth + screenPadding) * pageNum,
    });
    setActivePage(pageNum);
    setSubmitted(false);
  };

  const postListing = async (lastVals: any) => {
    setCanPost(false);
    try {
      await FirebaseService.postListing({
        ...input,
        createdAt: moment().utc().toDate(),
        ...lastVals,
        pictures: phoneImages,
      });
      Toast.show({
        type: 'success',
        text1: t('offer_posted_successfully'), // Offer posted successfully
        visibilityTime: 3000,
      });
      await offersStore.getData(true);
      navigation.goBack();
    } catch (err) {
      console.log(err);
      console.log('err');
      Toast.show({
        type: 'error',
        text1: t('something_went_wrong'), // Something went wrong
        visibilityTime: 3000,
        text2: t('failed_to_post_your_offer'), // Failed to post your offer, please try again later.
      });
      setCanPost(true);
    }
    return;
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{alignItems: 'center', paddingBottom: 50}}>
          <View style={styles.titleContainer}>
            <TouchableOpacity
              onPress={() =>
                activePage > 0
                  ? animateToPage(activePage - 1)
                  : navigation.goBack()
              }
              style={{position: 'absolute', left: 10}}>
              <Icon name="arrow-left" size={20} />
            </TouchableOpacity>
            <Text variant="title2Medium" color={colors.black}>
              {t('add_new_offer')}
            </Text>
          </View>
          <StepProgress
            width={screen.contentWidth - screenPadding}
            step={activePage}
            totalSteps={3}
          />
          <ScrollView
            scrollEnabled={false}
            horizontal
            pagingEnabled
            ref={scrollRef}
            style={styles.bodyContainer}>
            <Formik
              onSubmit={vals => {
                setInput({
                  ...input,
                  ...vals,
                });

                animateToPage(1);
              }}
              validationSchema={offerSchemas.offerSchema1}
              initialValues={{
                postTitle: '',
                brand: '',
                phoneColor: '',
                phoneModel: '',
                phoneStorage: '',
              }}>
              {({
                handleChange,
                handleBlur,
                values,
                errors,
                handleSubmit,
                setFieldValue,
              }) => (
                <View style={styles.postScreenContainer}>
                  <View style={styles.inputsContainer}>
                    <TextInput
                      onChangeText={handleChange('postTitle')}
                      onBlur={handleBlur('postTitle')}
                      errorMessage={submitted ? errors?.postTitle : ''}
                      containerStyle={{marginTop: spacing.small}}
                      variant="title2Medium"
                      placeholder={t('write_an_attractive_heading')}
                      placeholderTextColor={colors.grey}
                      color={colors.black}
                      title={t('title')}
                    />

                    <Dropdown
                      options={brandOptions}
                      onSelect={value => setFieldValue('brand', value, true)}
                      onBlur={handleBlur('brand')}
                      errorMessage={submitted ? errors?.brand : ''}
                      errored={!values?.brand && submitted}
                      containerStyle={{marginTop: spacing.small}}
                      variant="title2Medium"
                      placeholder={t('select_the_brand_of_your_phone')} // Select the brand of your phone
                      placeholderTextColor={colors.grey}
                      color={colors.black}
                      title={t('brand')} // Brand
                    />

                    <TextInput
                      returnKeyType="done"
                      errored={!values?.phoneModel && submitted}
                      onChangeText={handleChange('phoneModel')}
                      onBlur={handleBlur('phoneModel')}
                      errorMessage={submitted ? errors?.phoneModel : ''}
                      containerStyle={{marginTop: spacing.small}}
                      variant="title2Medium"
                      placeholder={t('what_is_the_model_of_your_phone')}
                      placeholderTextColor={colors.grey}
                      color={colors.black}
                      title={t('phone_details')} // Phone Details
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: spacing.small,
                        alignItems: 'flex-start',
                      }}>
                      <Dropdown
                        onSelect={value =>
                          setFieldValue('phoneColor', value, true)
                        }
                        onBlur={handleBlur('phoneColor')}
                        errorMessage={submitted ? errors?.phoneColor : ''}
                        errored={!values?.phoneColor && submitted}
                        options={colourOptions}
                        containerStyle={{width: '48%', alignSelf: 'flex-start'}}
                        variant="title2Medium"
                        placeholder={t('color')} // Colour
                        placeholderTextColor={colors.grey}
                        color={colors.black}
                      />

                      <Dropdown
                        onSelect={value =>
                          setFieldValue('phoneStorage', value, true)
                        }
                        onBlur={handleBlur('phoneStorage')}
                        errorMessage={submitted ? errors?.phoneStorage : ''}
                        errored={!values?.phoneStorage && submitted}
                        options={storageOptions}
                        containerStyle={{width: '48%', alignSelf: 'flex-start'}}
                        variant="title2Medium"
                        placeholder={t('storage')} // Storage
                        placeholderTextColor={colors.grey}
                        color={colors.black}
                      />
                    </View>
                  </View>

                  <Button
                    waitAsync
                    onPress={() => {
                      setSubmitted(true);
                      handleSubmit();
                    }}
                    style={{marginTop: spacing.huge}}
                    color={colors.black}
                    text={t('next')}
                  />
                </View>
              )}
            </Formik>

            <Formik
              validationSchema={offerSchemas.offerSchema2}
              onSubmit={vals => {
                setInput({
                  ...input,
                  ...vals,
                });
                animateToPage(2);
              }}
              initialValues={{
                phoneCondition: '',
                pictures: [],
              }}>
              {({setFieldValue, handleSubmit, errors}) => (
                <View style={styles.postScreenContainer}>
                  <View style={styles.inputsContainer}>
                    <Text
                      color={colors.black}
                      variant="title2Medium"
                      text={t('phone_condition')} // Phone Condition
                    />
                    <ExpandingPicker
                      textStyle={{fontSize: 24}}
                      style={{marginTop: spacing.xLarge}}
                      options={['New', 'Mint', 'Good', 'Fair']}
                      onPick={value =>
                        setFieldValue('phoneCondition', value[0])
                      }
                    />
                    <Text
                      color={colors.danger}
                      top="medium"
                      variant="body1Regular">
                      {submitted ? errors.phoneCondition : ''}
                    </Text>
                  </View>
                  <View style={styles.inputsContainer}>
                    <Text color={colors.black} variant="title2Medium">
                      Phone Pictures
                    </Text>
                    {phoneImages?.length < 1 && (
                      <TouchableOpacity
                        onPress={async () => {
                          await pickPhoneImages();
                          setFieldValue('pictures', phoneImages);
                        }}
                        style={{marginTop: spacing.large}}>
                        <Text
                          style={{
                            color: colors.darkGrey,
                            textDecorationLine: 'underline',
                          }}>
                          Upload
                        </Text>
                      </TouchableOpacity>
                    )}

                    {phoneImages && phoneImages.length > 0 && (
                      <FlatList
                        style={{marginTop: spacing.large}}
                        ItemSeparatorComponent={() => (
                          <View
                            style={{
                              borderRadius: 100,
                              marginHorizontal: spacing.medium,
                              alignSelf: 'center',
                            }}
                          />
                        )}
                        ListFooterComponent={() => (
                          <TouchableOpacity
                            onPress={async () => {
                              await pickPhoneImages();
                            }}
                            style={{alignSelf: 'center'}}>
                            <AntDesign name="edit" size={32} />
                          </TouchableOpacity>
                        )}
                        ListFooterComponentStyle={{
                          alignItems: 'center',
                          alignSelf: 'center',
                          marginLeft: spacing.large,
                        }}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={phoneImages}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => (
                          <Image
                            source={{uri: item}}
                            resizeMode="contain"
                            style={styles.phonePicture}
                          />
                        )}
                      />
                    )}
                  </View>
                  <Text
                    color={colors.danger}
                    top="medium"
                    variant="body1Regular">
                    {phoneImages.length < 1
                      ? 'Must upload at least 1 picture'
                      : ''}
                  </Text>

                  <Button
                    onPress={() => {
                      if (phoneImages.length > 0) {
                        handleSubmit();
                      }
                    }}
                    style={{marginTop: spacing.huge}}
                    color={colors.black}
                    text="Next"
                  />
                </View>
              )}
            </Formik>

            <Formik
              onSubmit={async vals => {
                if (!canPost) {
                  return;
                }
                const lastVals = {
                  ...input,
                  ...vals,
                  askingPrice: parseFloat(vals.askingPrice),
                };
                await postListing(lastVals);
              }}
              validationSchema={offerSchemas.offerSchema3}
              initialValues={{
                description: '',
                contactNumber: '',
                askingPrice: '',
              }}>
              {({handleSubmit, handleBlur, handleChange, errors, values}) => (
                <View style={styles.postScreenContainer}>
                  <View style={styles.inputsContainer}>
                    <TextInput
                      errorMessage={submitted ? errors.description : ''}
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      inputContainerStyle={{
                        height: 150,
                        paddingTop: spacing.xMedium,
                      }}
                      multiline
                      containerStyle={{marginTop: spacing.large}}
                      variant="title2Medium"
                      placeholder={t('mention_any_features_realted_to_phone')}
                      placeholderTextColor={colors.grey}
                      color={colors.black}
                      title={t('description')}
                    />

                    <TextInput
                      errorMessage={submitted ? errors.contactNumber : ''}
                      errored={!values.contactNumber && submitted}
                      onChangeText={handleChange('contactNumber')}
                      containerStyle={{marginTop: spacing.large}}
                      variant="title2Medium"
                      placeholder="05xxxxxxxx"
                      placeholderTextColor={colors.grey}
                      color={colors.black}
                      title={t('contact_number')}
                    />

                    <TextInput
                      errorMessage={submitted ? errors.askingPrice : ''}
                      errored={!values.askingPrice && submitted}
                      onChangeText={handleChange('askingPrice')}
                      keyboardType="number-pad"
                      containerStyle={{marginTop: spacing.large}}
                      variant="title2Medium"
                      placeholderTextColor={colors.grey}
                      color={colors.black}
                      title={t('price')}
                      renderLeft={() => (
                        <Text
                          style={{
                            alignSelf: 'center',
                            marginLeft: spacing.medium,
                          }}
                          color={colors.black}>
                          ريال
                        </Text>
                      )}
                    />
                  </View>
                  <Button
                    onPress={() => {
                      setSubmitted(true);
                      handleSubmit();
                    }}
                    style={{marginTop: spacing.huge}}
                    color={colors.black}
                    text="Next"
                  />
                </View>
              )}
            </Formik>
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'center',
  },
  titleContainer: {
    marginVertical: spacing.huge,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
  },
  bodyContainer: {
    width: screen.contentWidth + screenPadding,
  },
  inputsContainer: {
    marginTop: spacing.medium,
  },
  postScreenContainer: {
    width: screen.contentWidth + screenPadding,
    paddingHorizontal: screenPadding,
  },
  phonePicture: {
    height: 150,
    width: 150,
    borderRadius: 5,
  },
});

export default PostOfferScreen;
