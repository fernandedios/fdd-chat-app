export const AVATARS = [
  { id: 'prot', label: 'Joker' },
  { id: 'ryuji', label: 'Ryuji' },
  { id: 'ann', label: 'Ann' },
  { id: 'yusuke', label: 'Yusuke' },
  { id: 'makoto', label: 'Makoto' },
  { id: 'futaba', label: 'Futaba' },
  { id: 'haru', label: 'Haru' },
  { id: 'mona', label: 'Morgana' },
];

export const avatarUrl = (id) => `/avatars/${id}.jpg`;
export const FALLBACK_AVATAR = avatarUrl('prot');
export const MAX_MESSAGE_LENGTH = 500;
