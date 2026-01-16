import Cropper from "react-easy-crop";
import { useState } from "react";

const ImageCropModal = ({
  image,
  aspect = 1,
  onCancel,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  return (
    <div className="crop-backdrop">
      <div className="crop-container">
        <h3>Crop Image</h3>

        <div className="crop-area">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) =>
              setCroppedAreaPixels(pixels)
            }
          />
        </div>

        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(e.target.value)}
        />

        <div className="crop-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={() => onCropComplete(croppedAreaPixels)}>
            Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
