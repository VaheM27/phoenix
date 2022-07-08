import React, {Dispatch, FC, SetStateAction, useMemo, useRef} from 'react';
import GorhomSheet from '@gorhom/bottom-sheet';
import {colors, screen} from '~/theme';
import {StyleSheet, View} from 'react-native';

interface BottomSheetProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  heights?: number[];
}

const BottomSheet: FC<BottomSheetProps> = ({
  heights = [screen.height / 2, screen.height - 100],
  setVisible,
  visible,
  children,
}) => {
  const bottomSheetRef = useRef<GorhomSheet>(null);
  const snapPoints = useMemo(() => heights, []);

  if (!visible) {
    return null;
  }
  return (
    <GorhomSheet
      enableOverDrag
      onClose={() => {
        setVisible(false);
      }}
      animateOnMount
      backgroundStyle={{
        backgroundColor: colors.white,
      }}
      enablePanDownToClose
      backdropComponent={() => {
        return (
          <View
            style={[
              styles.container,
              {
                height: screen.height,
                backgroundColor: 'rgba(0,0,0,0.3)',
              },
            ]}
          />
        );
      }}
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}>
      {children}
    </GorhomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default BottomSheet;
