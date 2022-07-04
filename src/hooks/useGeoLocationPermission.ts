import {useState, useEffect, useCallback} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import GeoLocation, {
  AuthorizationLevel,
} from 'react-native-geolocation-service';

type useGeoLocationPermissionArgs = {
  ios: AuthorizationLevel[] | AuthorizationLevel;
  android:
    | 'android.permission.ACCESS_FINE_LOCATION'
    | 'android.permission.ACCESS_COARSE_LOCATION';
};

export const useGeoLocationPermission = ({
  ios: iosPermissions,
  android: androidPermission,
}: useGeoLocationPermissionArgs) => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const requestGeolocationPermission = useCallback<
    () => Promise<void>
  >(async () => {
    switch (Platform.OS) {
      case 'ios': {
        try {
          if (Array.isArray(iosPermissions)) {
            const permissions = await Promise.all(
              iosPermissions.map(permission =>
                GeoLocation.requestAuthorization(permission),
              ),
            );

            const allPermissionsGranted = permissions.every(
              status => status === 'granted',
            );

            setHasLocationPermission(allPermissionsGranted);
          } else {
            const permission = await GeoLocation.requestAuthorization(
              iosPermissions,
            );
            setHasLocationPermission(permission === 'granted');
          }
        } catch (error) {
          throw new Error(
            `useGeoLocationPermission: (iOS) Failed to requestAuthorization. ${error}`,
          );
        }
        break;
      }
      case 'android': {
        try {
          const permission = await PermissionsAndroid.request(
            androidPermission,
          );
          setHasLocationPermission(permission === 'granted');
        } catch (error) {
          throw new Error(
            `useGeoLocationPermission: (Android) Failed to requestPermission. ${error}`,
          );
        }
        break;
      }
    }
  }, [androidPermission, iosPermissions]);

  useEffect(() => {
    if (!hasLocationPermission) {
      requestGeolocationPermission();
    }
  }, [hasLocationPermission, requestGeolocationPermission]);

  return [hasLocationPermission, requestGeolocationPermission];
};
