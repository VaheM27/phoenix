import {useState} from 'react';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  ImagePickerResponse,
  Asset,
  PhotoQuality,
} from 'react-native-image-picker';

export const useImagePicker = (
  options: ImageLibraryOptions = {
    mediaType: 'mixed',
  },
) => {
  const [images, setImages] = useState<any>([]);

  return [
    images,
    async () => {
      const result = await launchImageLibrary(options);
      let uris = result.assets?.map((x: any) => x.uri);
      if (uris) {
        setImages(uris);
      }
    },
    setImages,
  ];
};
