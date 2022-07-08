import {MotiView} from 'moti';
import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import {colors} from '~/theme';

interface ProgressLine {
  currentIndex: number;
  totalIndex: number;
  width: number;
}

const ProgressLine: FC<ProgressLine> = ({currentIndex, totalIndex, width}) => {
  const styles = StyleSheet.create({
    container: {},
    lineBackground: {
      height: 3,
      borderRadius: 100,
      width: width,
      backgroundColor: colors.grey,
      position: 'absolute',
      top: 0,
    },
    completedContainer: {
      height: 3,
      borderRadius: 100,
      backgroundColor: colors.black,
      position: 'absolute',
      top: 0,
    },
  });

  return (
    <MotiView style={styles.container}>
      <MotiView style={styles.lineBackground} />
      <MotiView
        transition={{
          type: 'timing',
          duration: 1000,
        }}
        from={{
          width: (width / totalIndex) * currentIndex,
        }}
        animate={{
          width: (width / totalIndex) * currentIndex,
        }}
        style={styles.completedContainer}
      />
    </MotiView>
  );
};

export default ProgressLine;
