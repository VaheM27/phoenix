import * as React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {WebView, WebViewProps} from 'react-native-webview';
import {colors} from '~/theme';

export default function WebViewWithLoader(props: WebViewProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const onLoadStart = () => {
    setIsLoading(true);
  };
  const onLoadEnd = () => {
    setIsLoading(false);
  };
  return (
    <View style={{flex: 1}}>
      <WebView {...props} onLoadEnd={onLoadEnd} onLoadStart={onLoadStart} />
      <Loader isLoading={isLoading} />
    </View>
  );
}

const Loader = ({isLoading}: {isLoading: boolean}) => {
  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator color={colors.primary} size={'large'} />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
});
