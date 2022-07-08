import {action, makeObservable, observable} from 'mobx';
import auth from '@react-native-firebase/auth';
import Comment from '~/models/Comment';
import FirebaseService from '~/services/FirebaseService';
import {profileStore} from './profile.store';

export class CommentsStore {
  loading: boolean = false;
  comments: any = [];

  constructor() {
    makeObservable(this, {
      loading: observable,
      comments: observable,
      clearStore: action,
      fetchComments: action,
      setComments: action,
    });
  }

  setComments = (value: any) => (this.comments = value);

  // Reset all values to initation value
  clearStore() {
    this.loading = false;
  }

  async fetchComments(listingId: string, listingOwnerId: string) {
    const comms = await FirebaseService.fetchCommentsByPost(
      listingId,
      listingOwnerId,
    );
    this.setComments(comms);
  }

  async postComment(comment: Comment) {
    let fullComment = {
      ...comment,
      createdAt: new Date(),
      senderId: auth().currentUser?.uid,
      senderName: profileStore.currentProfile?.name,
    };
    await FirebaseService.postComment(fullComment);
    this.setComments([...this.comments, fullComment]);
  }
}

export const commentsStore = new CommentsStore();
