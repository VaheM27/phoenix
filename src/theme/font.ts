import {colors} from './colors';

const type = {
  regular: 'SFProText-Regular',
  medium: 'SFProText-Medium',
  bold: 'SFProText-Bold',
};

const size = {
  title1: 34, // Page title (unscrolled)
  title2: 17, // Page title (scrolled)

  body1: 17, // Paragraph text, List item titles, Links
  body2: 15, // Secondary text

  caption1: 13, // Caption text
  caption2: 12, // Action bar labels

  subTitle1: 25,
  subTitle2: 20,
};

export const typography = {
  title1Bold: {
    fontFamily: type.bold,
    fontSize: size.title1,
  },
  title2Medium: {
    fontFamily: type.medium,
    fontSize: size.title2,
  },
  body1Regular: {
    fontFamily: type.regular,
    fontSize: size.body1,
  },
  body1Bold: {
    fontFamily: type.bold,
    fontSize: size.body1,
  },
  body2Regular: {
    fontFamily: type.regular,
    fontSize: size.body2,
  },
  caption1Regular: {
    fontFamily: type.regular,
    fontSize: size.caption1,
  },
  caption2Regular: {
    fontFamily: type.regular,
    fontSize: size.caption2,
  },
  subTitle1Bold: {
    fontFamily: type.bold,
    fontSize: size.subTitle1,
  },
  subTitle2Bold: {
    fontFamily: type.bold,
    fontSize: size.subTitle2,
  },
};

export const font = {
  ...type,
  size,
};
