import React from 'react';

export const HomeIcon = ({ size = 22, color = '#f36f72' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const BackIcon = ({ size = 22, color = '#444' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 19 8 12l7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlusIcon = ({ size = 20, color = '#f36f72' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ChatIcon = ({ size = 22, color = '#f36f72' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 4h16v11.5a1 1 0 0 1-1 1H7l-3 3z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const BookmarkIcon = ({ size = 20, color = '#f36f72' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M6 4h12v16l-6-4-6 4z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const UserIcon = ({ size = 22, color = '#f36f72' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="2" />
    <path d="M5 20c.8-3.3 3.8-5 7-5s6.2 1.7 7 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const CameraIcon = ({ size = 22, color = '#a6a6a6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 7h3l2-2h6l2 2h3v12H4z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="3.5" stroke={color} strokeWidth="2" />
  </svg>
);

export const SendIcon = ({ size = 22, color = '#f36f72' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="m4 12 16-7-5 14-3-4-4-3z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const LocationIcon = ({ size = 18, color = '#f36f72' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21s7-5.5 7-11.2A7 7 0 0 0 5 9.8C5 15.5 12 21 12 21z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="9.5" r="2.5" stroke={color} strokeWidth="2" />
  </svg>
);
