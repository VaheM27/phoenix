import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
import {toEnglishDigits, createGeoPoint} from '~/helpers';
import Listing from '~/models/Listing';

import storage from '@react-native-firebase/storage';
import Comment from '~/models/Comment';
import Notification from '~/models/Notification';

class FirebaseService {
  userUid = auth().currentUser?.uid;

  firebaseDateToJSDate = (firebaseDate: any) => {
    return new Date(firebaseDate.toMillis());
  };

  postListing = async (listing: Listing) => {
    Geolocation.getCurrentPosition(async position => {
      if (!position) {
        throw new Error('Position cannot be null');
      }
      const {latitude, longitude} = position.coords;

      let offerRef = firestore()
        .collection('users')
        .doc(this.userUid)
        .collection('offers')
        .doc();

      const urls = await Promise.all(
        listing.pictures!.map(async (picture, index) => {
          const downloadUrl = await this.uploadPicture(
            picture,
            `userMedia/${this.userUid}/offerMedias/${
              offerRef.id
            }/${index.toString()}.png`,
          );
          return downloadUrl;
        }),
      );

      return await offerRef.set({
        ...listing,
        status: 'pending',
        createdAt: new Date(),
        contactNumber: toEnglishDigits(listing.contactNumber),
        askingPrice: Number(toEnglishDigits(`${listing.askingPrice}`)),
        location: createGeoPoint(latitude, longitude),
        createdBy: this.userUid,
        listingId: offerRef.id,
        pictures: urls,
      });
    });
  };

  uploadPicture = async (pictureUri: string, path: string) => {
    const reference = storage().ref(path);
    await reference.putFile(pictureUri);

    const downloadUrl = await reference.getDownloadURL();
    return downloadUrl;
  };

  postComment = async (comment: Comment | any) => {
    const commentRef = firestore()
      .collection('users')
      .doc(comment.recepientId)
      .collection('offers')
      .doc(comment.listingId)
      .collection('comments')
      .doc();

    return await commentRef.set(comment);
  };

  fetchCommentsByPost = async (listingId: string, listingOwnerId: string) => {
    const commentsRef = firestore()
      .collection('users')
      .doc(listingOwnerId)
      .collection('offers')
      .doc(listingId)
      .collection('comments');

    const commentsData = (await commentsRef.get()).docs;
    const comments = commentsData.map(commentData => commentData.data());
    return comments;
  };

  reportComment = async (comment: Comment) => {
    let ref = firestore().collection('reports_comments').doc();

    await ref.set({
      comment,
      id: ref.id,
      listingId: comment.listingId,
      senderId: comment.senderId,
    });
    return;
  };

  sendDeviceToken = async (deviceToken: string) => {
    return await firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .update({
        deviceToken,
      });
  };

  /**
   *
   * @returns {Notification[]}
   */
  fetchNotifications = async () => {
    let notificationsRef = firestore().collection(
      `users/${auth().currentUser?.uid}/notifications`,
    );

    let notificationDocs = await (await notificationsRef.get()).docs;
    let notifications = notificationDocs.map(doc => doc.data() as Notification);
    return notifications;
  };

  getDocumentByPath = async (path: string) => {
    let ref = firestore().doc(path);
    let docData = await (await ref.get()).data();
    return docData;
  };

  markNotificationAsRead = async (notification: Notification) => {
    let uid = auth().currentUser?.uid;
    let notificationRef = firestore().doc(
      `users/${uid}/notifications/${notification.id}`,
    );
    console.log(`users/${uid}/notifications/${notification.id}`);
    await notificationRef.update({
      seen: true,
    });
  };

  getCurrentParticipantByOffer = async (offerPath: string) => {
    let uid = auth().currentUser?.uid;
    let participantsRef = firestore().doc(`${offerPath}/participants/${uid}`);
    let currentUserDocData = await (await participantsRef.get()).data();
    return currentUserDocData;
  };

  updateCurrentParticipantByOffer = async (
    offerPath: string,
    notificationState: boolean,
  ) => {
    let uid = auth().currentUser?.uid;
    let participantsRef = firestore().doc(`${offerPath}/participants/${uid}`);
    return await participantsRef.update({
      notifications_enabled: notificationState,
    });
  };

  setUserLanguagePreference = async (langKey: string) => {
    let uid = auth().currentUser?.uid;
    let currentUserRef = firestore().doc(`users/${uid}`);

    return await currentUserRef.update({
      langKey,
    });
  };
}

export default new FirebaseService();
