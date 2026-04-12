import profile1 from '@/assets/profile/male1.png';
import profile2 from '@/assets/profile/male2.png';
import profile3 from '@/assets/profile/male3.png';
import profile4 from '@/assets/profile/female1.png';
import profile5 from '@/assets/profile/female2.png';
import profile6 from '@/assets/profile/female3.png';
import profileDefault from '@/assets/profile/default.png';
export const profileImages = {
  profile1,
  profile2,
  profile3,
  profile4,
  profile5,
  profile6,
  default: profileDefault,
};

export const profileImageOptions = Object.keys(profileImages);
export const DEFAULT_PROFILE_IMAGE_KEY = 'default';

export const getProfileImageSrc = (profileImageKey) =>
  profileImages[profileImageKey] || profileImages[DEFAULT_PROFILE_IMAGE_KEY];
