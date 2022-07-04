import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {check} from 'react-native-permissions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Text} from '~/components';
import Permission from '~/models/Permission';
import {colors, spacing} from '~/theme';

interface PermissionDisplayerProps {
  permission: Permission;
}

const PermissionDisplayer: FC<PermissionDisplayerProps> = ({permission}) => {
  const [granted, setGranted] = useState(false);

  const handleGrantPermission = () => {
    setGranted(!granted);
  };

  const checkPermission = async () => {
    let result = await check(permission.permissionType);
    console.log(result);
    if (result === 'granted') {
      setGranted(true);
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', maxWidth: '75%'}}>
        <FontAwesome name={permission.thumbnail} size={25} />
        <View style={styles.textsContainer}>
          <Text variant="body1Bold">{permission.title}</Text>
          <Text color={colors.darkGrey} variant="caption1Regular">
            {permission.caption}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleGrantPermission}
        style={[
          styles.checkContainer,
          {
            backgroundColor: granted ? colors.black : colors.white,
          },
        ]}>
        <FontAwesome name="check" color={colors.white} size={16} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageStyle: {
    height: 50,
    width: 50,
  },
  textsContainer: {
    marginLeft: spacing.medium,
  },
  checkContainer: {
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.smaller,
  },
});

export default PermissionDisplayer;
