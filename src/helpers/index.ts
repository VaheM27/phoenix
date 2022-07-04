export * from './geoLocationHelpers';

export const toEnglishDigits = (str: String) => {
  const arabicNumbers = [
    /٠/g,
    /١/g,
    /٢/g,
    /٣/g,
    /٤/g,
    /٥/g,
    /٦/g,
    /٧/g,
    /٨/g,
    /٩/g,
  ];

  if (typeof str === 'string') {
    for (let i = 0; i < 10; i++) {
      str = str.replace(arabicNumbers[i], i.toString());
    }
  }
  return str;
};
