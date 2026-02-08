import React, { useState } from 'react'
import OptimizedImage from '../../components/optimizedImage/OptimizedImage';


const AttachmentFallback = ({ filename = 'Attachment unavailable' }) => (
  <div
    className="middleBodyImg"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f3f4f6',
      color: '#6b7280',
      fontSize: '12px',
      textAlign: 'center',
      padding: '20px'
    }}
  >
    <span>{filename}</span>
  </div>
);

export default AttachmentFallback

export const SafeImage = ({ file }) => {
  const [error, setError] = useState(false);

  if (!file?.url || error) {
    return <AttachmentFallback filename={file?.filename} />;
  }

  return (
    <OptimizedImage
      src={file.url}
      alt={file.filename}
      width={file.width}
      height={file.height}
      blurhash={file.blurhash}
      className="middleBodyImg"
      onError={() => setError(true)}
    />
  );
};


export const SafeVideo = ({ file }) => {
  const [error, setError] = useState(false);

  if (!file?.url || error) {
    return <AttachmentFallback filename={file?.filename || 'Video unavailable'} />;
  }

  return (
    <video
      src={file.url}
      controls
      className="middleBodyImg"
      onError={() => setError(true)}
    />
  );
};

export const SafeFile = ({ file }) => {
  if (!file?.url) {
    return <AttachmentFallback filename={file?.filename} />;
  }

  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      className="middleBodyFile"
    >
      {file.filename || 'Download file'}
    </a>
  );
};


