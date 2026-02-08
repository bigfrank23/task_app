// backend/utils/imageProcessor.js
import sharp from 'sharp';
import { encode } from 'blurhash';

export const generateBlurhash = async (buffer) => {
  try {
    const { data, info } = await sharp(buffer)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: 'inside' })
      .toBuffer({ resolveWithObject: true });
    
    const blurhash = encode(
      new Uint8ClampedArray(data),
      info.width,
      info.height,
      4,
      4
    );
    
    return blurhash;
  } catch (error) {
    console.error('Blurhash generation error:', error);
    return null;
  }
};

export const getImageDimensions = async (buffer) => {
  try {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
    };
  } catch (error) {
    console.error('Get dimensions error:', error);
    return { width: null, height: null };
  }
};