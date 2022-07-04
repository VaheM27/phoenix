import React, {FC} from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {WebViewWithLoader} from '~/components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '~/theme';

const WebviewScreen: FC<{
  route: RouteProp<any, any>;
}> = ({route}) => {
  const {uri} = route.params || {};
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <WebViewWithLoader source={{uri}} />
    </SafeAreaView>
  );
};

export default WebviewScreen;
