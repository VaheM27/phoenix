import {useEffect, useRef, useCallback} from 'react';
import GeoLocation, {
  GeoPosition,
  GeoError,
  GeoOptions,
} from 'react-native-geolocation-service';
import {useGeoLocationPermission} from './useGeoLocationPermission';

export const useGeoLocation = (
  callbackFn: (position: GeoPosition) => void,
  errorCallbackFn: (error: GeoError) => void,
  options?: GeoOptions,
) => {
  const geoOptions = useRef(options);

  const [hasLocationPermission] = useGeoLocationPermission({
    ios: ['whenInUse'],
    android: 'android.permission.ACCESS_FINE_LOCATION',
  });

  const getCurrentPosition = useCallback(() => {
    if (hasLocationPermission) {
      GeoLocation.getCurrentPosition(
        callbackFn,
        errorCallbackFn,
        geoOptions.current,
      );
    }
  }, [callbackFn, errorCallbackFn, hasLocationPermission]);

  useEffect(() => getCurrentPosition(), [getCurrentPosition]);

  return {
    getCurrentPosition,
  };
};
