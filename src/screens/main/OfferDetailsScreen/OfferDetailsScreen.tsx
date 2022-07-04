import {CompositeScreenProps} from '@react-navigation/core';
import React, {FC, useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Clipboard,
  FlatList,
  Keyboard,
  GestureResponderHandlers,
} from 'react-native';
import {check} from 'react-native-permissions';
import {BottomSheet, Switch, Text, TextInput} from '~/components';
import {colors, screen, spacing} from '~/theme';
import {ScrollView} from '@motify/components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {DetailDisplayer} from './components';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import {PhonePictureDisplayer} from './components';
import {useTranslation} from 'react-i18next';
import ImageView from 'react-native-image-viewing';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {commentsStore} from '~/store/comments.store';
import {observer} from 'mobx-react';
import CommentDisplayer from './components/CommentDisplayer';
import {KeyboardAccessoryView} from '@flyerhq/react-native-keyboard-accessory-view';
import FirebaseService from '~/services/FirebaseService';
import permissions from '~/constants/permissions';
import PermissionDisplayer from '../HomeScreen/components/PermissionDisplayer';
import Permission from '~/models/Permission';
import {useStore} from '~/store';

const OfferDetailsScreen: FC<CompositeScreenProps<any, any>> = ({
  navigation,
  route,
}) => {
  const {t} = useTranslation();
  const {authStore} = useStore();
  const {listing} = route.params;
  const [imageView, setImageView] = useState({
    index: 0,
    visible: false,
  });

  const [notificationsPanelVisible, setNotificationsPanelVisible] =
    useState(false);
  const [commentsVisible, setCommentsVisible] = useState<boolean>(false);
  const [commentText, setCommentText] = useState('');
  const [particpantData, setParticipantData] = useState<any>(null);
  const [permissionsModalVisible, setPermissionsModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: listing.postTitle,
    });
    commentsStore.fetchComments(listing.listingId, listing.createdBy);
    getParticipant();
  }, []);

  const renderScrollable = (panHandlers: GestureResponderHandlers) => (
    <ScrollView keyboardDismissMode="interactive" {...panHandlers} />
  );

  const copyPhone = () => {
    Clipboard.setString(listing.contactNumber);
    Toast.show({
      text1: 'Copied',
      text2: 'Text copied to clipboard',
      type: 'success',
    });
  };

  const submitComment = async () => {
    try {
      await commentsStore.postComment({
        comment: commentText,
        listingId: listing.listingId,
        recepientId: listing.createdBy,
      });

      setCommentText('');
      Keyboard.dismiss();

      Toast.show({
        text1: 'Comment Posted',
        text2: 'Your comment has been posted.',
      });
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: 'An Error Occured',
        text2: 'An error occured while posting your comment.',
      });
    }
  };

  const getParticipant = async () => {
    let currentParticipant = await FirebaseService.getCurrentParticipantByOffer(
      `users/${listing.createdBy}/offers/${listing.listingId}`,
    );
    setParticipantData(currentParticipant);
  };

  const updateParticipantData = async () => {
    await FirebaseService.updateCurrentParticipantByOffer(
      `users/${listing.createdBy}/offers/${listing.listingId}`,
      particpantData.notifications_enabled,
    );
  };

  useEffect(() => {
    if (particpantData) {
      updateParticipantData();
    }
  }, [particpantData]);

  const checkPermission = async (permission: Permission) => {
    let result = await check(permission.permissionType);
    if (result !== 'granted') {
      setPermissionsModalVisible(true);
    }
  };

  useEffect(() => {
    const notificationPermission = permissions.find(
      el => el.title === 'Notifications',
    );
    if (notificationPermission) {
      checkPermission(notificationPermission);
    }
  }, [permissions]);

  useEffect(() => {
    setPermissionsModalVisible(false);
  }, [authStore.manualLoggedIn]);

  return (
    <View style={styles.container}>
      <ScrollView
        scrollEventThrottle={16}
        contentContainerStyle={{paddingBottom: 50}}>
        <View style={{height: 300}}>
          <View style={styles.commentsIcon}>
            <TouchableOpacity
              style={{marginRight: spacing.medium}}
              onPress={() => setNotificationsPanelVisible(true)}>
              <Ionicons size={32} name="notifications" color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCommentsVisible(true)}>
              <FontAwesome size={32} name="comments" color={colors.white} />
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            data={listing.pictures}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <PhonePictureDisplayer
                onBackPress={() => navigation.goBack()}
                onPress={() =>
                  setImageView({
                    index,
                    visible: true,
                  })
                }
                style={{height: '100%', width: screen.width}}
                picture={item}
              />
            )}
            keyExtractor={item => item}
            style={{width: screen.width, height: '40%'}}
          />
        </View>
        <View style={{width: screen.contentWidth, alignSelf: 'center'}}>
          {/* Model */}
          <DetailDisplayer title={t('model')}>
            {listing.phoneModel}
          </DetailDisplayer>
          {/* Details */}
          <DetailDisplayer title={t('details')}>
            {listing.brand} - {listing.phoneColor} - {listing.phoneStorage}
          </DetailDisplayer>
          {/* Description */}
          <DetailDisplayer title={t('description')}>
            {listing.description}
          </DetailDisplayer>
          {/* Condition */}
          <DetailDisplayer title={t('phone_condition')}>
            {listing.phoneCondition}
          </DetailDisplayer>
          {/* Contact */}
          <DetailDisplayer
            containerRight={() => (
              <TouchableOpacity onPress={copyPhone}>
                <Feather size={20} color={colors.black} name="copy" />
              </TouchableOpacity>
            )}
            title={t('contact_number')}>
            {listing.contactNumber}
          </DetailDisplayer>
          {/* Price */}
          <DetailDisplayer title={t('price')}>
            ريال{listing.askingPrice}
          </DetailDisplayer>
        </View>
      </ScrollView>
      <ImageView
        backgroundColor="black"
        animationType="slide"
        images={listing.pictures.map((pic: string) => {
          return {
            uri: pic,
          };
        })}
        imageIndex={imageView.index}
        visible={imageView.visible}
        presentationStyle="pageSheet"
        onRequestClose={() =>
          setImageView({
            ...imageView,
            visible: false,
          })
        }
      />
      <BottomSheet
        heights={[screen.height - 100]}
        visible={commentsVisible}
        setVisible={setCommentsVisible}>
        <View style={styles.commentsContainer}>
          <Text variant="title2Medium">Comments</Text>
          {commentsStore.comments && commentsStore.comments.length > 0 ? (
            <FlatList
              data={commentsStore.comments}
              renderItem={({item}) => <CommentDisplayer comment={item} />}
            />
          ) : (
            <Text top="normal" variant="body1Regular">
              Be the first one to comment
            </Text>
          )}
        </View>
        <KeyboardAccessoryView
          renderScrollable={renderScrollable}
          style={{width: '100%'}}>
          <TextInput
            value={commentText}
            onChangeText={text => setCommentText(text)}
            renderRight={() => (
              <TouchableOpacity
                onPress={submitComment}
                style={{
                  height: '100%',
                  justifyContent: 'center',
                  paddingRight: spacing.medium,
                }}>
                <Ionicons name="send" size={20} />
              </TouchableOpacity>
            )}
            inputContainerStyle={styles.inputAccessoryInputContainerStyle}
            placeholder="Comment"
          />
        </KeyboardAccessoryView>
      </BottomSheet>

      <BottomSheet
        heights={[screen.height / 3.5]}
        visible={notificationsPanelVisible}
        setVisible={setNotificationsPanelVisible}>
        <View
          style={{
            width: screen.contentWidth,
            alignSelf: 'center',
            marginTop: spacing.medium,
          }}>
          <Text variant="subTitle2Bold">{t('listing_notifications')}</Text>
          <Switch
            value={particpantData?.notifications_enabled}
            description={t('listing_switch_description')}
            text={t('notifications_enabled')}
            onPress={value =>
              setParticipantData({
                ...particpantData,
                notifications_enabled: value,
              })
            }
          />
        </View>
      </BottomSheet>
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
              if (item.title === 'Notifications') {
                return <PermissionDisplayer permission={item} />;
              } else {
                return null;
              }
            }}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.offWhite,
    flex: 1,
  },
  inputAccessoryInputContainerStyle: {
    borderRadius: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: colors.grey,
  },
  commentsIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 30,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderTopLeftRadius: 5,
    flexDirection: 'row',
  },
  commentsContainer: {
    height: '100%',
    width: '100%',
    paddingHorizontal: spacing.medium,
  },
});

export default observer(OfferDetailsScreen);
