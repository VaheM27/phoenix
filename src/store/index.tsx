import React from 'react';
import {AuthStore, authStore} from './auth.store';
import {CommentsStore, commentsStore} from './comments.store';
import {OffersStore, offersStore} from './offers.store';
import {ProfileStore, profileStore} from './profile.store';

type StoreTypes = {
  authStore: AuthStore;
  offersStore: OffersStore;
  profileStore: ProfileStore;
  commentsStore: CommentsStore;
};

export const createStore: () => StoreTypes = () => {
  return {
    authStore,
    offersStore,
    profileStore,
    commentsStore,
  };
};

export const store = createStore();

/* Store helpers */
const StoreContext = React.createContext(store);

export const StoreProvider: React.FC = ({children}) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const clearStore = () => {
  // @ts-ignore
  Object.values(store).forEach(_store => _store.clearStore?.());
};

// @ts-ignore
export const useStore: () => StoreTypes = () => {
  const context = React.useContext(StoreContext);
  if (!context) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return context;
};
