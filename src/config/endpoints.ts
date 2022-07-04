import firebase from '@react-native-firebase/app';

const projectId = firebase.app().options.projectId;

// const firebaseUrl = 'http://localhost:5001/fenix-bd79c/us-central1/api';
const firebaseUrl = `https://us-central1-${projectId}.cloudfunctions.net/api/v1`;
const global = `https://us-central1-${projectId}.cloudfunctions.net/api/global`;

export const Endpoints = {
  OFFERS: firebaseUrl + '/offers_placed',
  POSTS: firebaseUrl + '/posts',
  DEVICE_TOKEN: global + '/save_token',
};
