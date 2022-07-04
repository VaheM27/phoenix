import firebase from '@react-native-firebase/app';
import * as geofirex from 'geofirex';
import GeoLocation, {GeoPosition} from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';

export const getCurrentPositionAsync =
  async (): Promise<GeolocationResponse> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, reject);
    });
  };

export const getHumanizedDistance = (distanceInKm: number) => {
  if (distanceInKm < 5) {
    return 'Near';
  } else if (distanceInKm < 10) {
    return 'Near';
  } else if (distanceInKm < 50) {
    return 'Far';
  } else {
    return 'far';
  }
};

export const getCityName = async (latitude: number, longitude: number) => {
  const apiKey =
    'pk.eyJ1IjoiaW1ub3Rjb29sIiwiYSI6ImNrZTdlc2FkZTB0eTYyenBvcTRmMGR1aXMifQ.icYxZK586YQnXs4oHtBVxw';

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?limit=1&access_token=${apiKey}`;
  const result = await fetch(url).then(res => res.json());
  if (
    result &&
    result.features &&
    result.features[0] &&
    result.features[0].place_name
  ) {
    const splited = result.features[0].place_name.split(', ');

    let cityName = null;
    switch (splited.length) {
      case 5:
        cityName = splited[2];
        break;
      case 4:
        cityName = splited[1];
        break;
      case 3:
      case 2:
      case 1:
        cityName = splited[0];
        break;
      default:
        break;
    }
    return cityName;
  } else {
    return null;
  }
};

export const createGeoPoint = (latitude: number, longitude: number) => {
  return geofirex.init(firebase).point(latitude, longitude);
};

export const getCurrentPosition = (): Promise<GeoPosition> => {
  return new Promise(async (resolve, reject) => {
    if (Platform.OS == 'ios') {
      await GeoLocation.requestAuthorization('whenInUse');
    } else {
      await PermissionsAndroid.request(
        'android.permission.ACCESS_FINE_LOCATION',
      );
    }
    GeoLocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
    });
  });
};
