import Permission from '~/models/Permission';

const permissions: Permission[] = [
  {
    caption: 'In order to find listings near you.',
    thumbnail: 'location-arrow',
    permissionType: 'image',
    title: 'Location',
  },
  {
    caption:
      'In order to notify you about your listings and the ones you are interested in',
    thumbnail: 'bell',
    permissionType: 'image',
    title: 'Notifications',
  },
  {
    caption: 'In order to let you upload pictures when creating a listing',
    thumbnail: 'image',
    permissionType: 'image',
    title: 'Gallery',
  },
];

export default permissions;
