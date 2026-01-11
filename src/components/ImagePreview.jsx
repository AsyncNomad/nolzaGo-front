import React from 'react';

const ImagePreview = ({ url, size = 70, corner = 8 }) => {
  if (!url) return null;
  return (
    <img
      src={url}
      alt="preview"
      style={{
        width: size,
        height: size,
        borderRadius: corner,
        objectFit: 'cover',
        border: '1px solid #eee',
      }}
    />
  );
};

export default ImagePreview;
