import React from 'react';
import AppNavigation from './AppNavigation';
import {StoreProvider} from '../store';
import {AppContext} from '../hooks';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const AppContainer: React.FC = () => {
  const context = {};

  return (
    <StoreProvider>
      <AppContext.Provider value={context}>
        <SafeAreaProvider>
          <AppNavigation />
        </SafeAreaProvider>
      </AppContext.Provider>
    </StoreProvider>
  );
};

export default AppContainer;
