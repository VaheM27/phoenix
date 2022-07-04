import {Permission as RnPermission} from 'react-native-permissions';

interface Permission {
  permissionType: RnPermission;
  thumbnail: string;
  caption: string;
  title: string;
}

// eslint-disable-next-line no-undef
export default Permission;
