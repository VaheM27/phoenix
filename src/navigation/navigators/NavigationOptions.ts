import {colors, typography, spacing} from '../../theme';

const headerOptions = {
  headerBackTitleVisible: false,
  headerTitleAlign: 'center',
  headerTitleStyle: {...typography.title2Medium, color: colors.white},
  headerLeftContainerStyle: {paddingLeft: spacing.normal},
  headerRightContainerStyle: {paddingRight: spacing.normal},
  headerTintColor: colors.white,
  headerStyle: {
    backgroundColor: colors.primary,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 0,
    shadowOpacity: 0,
  },
};

export const useNavigationOptions = () => {
  return {headerOptions};
};
