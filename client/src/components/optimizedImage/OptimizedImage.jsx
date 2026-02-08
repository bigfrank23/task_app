// components/OptimizedImage/OptimizedImage.jsx
import { useState } from 'react';
import { Blurhash } from 'react-blurhash';
import './optimizedImage.css';

const OptimizedImage = ({ 
  src, 
  alt, 
  width,
  height,
  blurhash,
  className = '',
  priority = false 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Calculate aspect ratio
  const aspectRatio = width && height ? `${width}/${height}` : '16/9';

  return (
    <div 
      className={`optimized-image-container ${className}`}
      style={{ aspectRatio }}
    >
      {/* Show blurhash while loading */}
      {blurhash && !isLoaded && !error && (
        <Blurhash
          hash={blurhash}
          width="100%"
          height="100%"
          resolutionX={32}
          resolutionY={32}
          punch={1}
          style={{
            position: 'absolute',
            inset: 0,
            // borderRadius: '8px',
          }}
        />
      )}

      {/* Show skeleton if no blurhash */}
      {!blurhash && !isLoaded && !error && (
        <div className="image-skeleton" />
      )}
      
      {/* Show error message */}
      {error && (
        <div className="image-error">
          Failed to load image
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`image ${isLoaded ? 'loaded' : ''}`}
        style={{ display: error ? 'none' : 'block' }}
      />
    </div>
  );
};

export default OptimizedImage;