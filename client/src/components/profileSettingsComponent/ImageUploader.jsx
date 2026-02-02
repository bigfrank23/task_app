import { useRef, useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ImageCropModal from "./ImageCropModal";
import ProgressRing from "../progressRing/ProgressRing";
import { getCroppedImg } from "../../utils/cropImage";
import { useImageUpload } from "../../utils/useImageUpload";
import useAuthStore from "../../utils/authStore";
import "./profileSettingsComponent.css";
import { useNotification } from "../../utils/useNotification";

const ImageUploader = ({
  title,
  aspect = 1,
  previewClass,
  uploadLabel,
  uploadEndpoint,
  fieldName,
  maxSizeMB = 5,
}) => {
  const inputRef = useRef(null);
  const { updateUser} = useAuthStore();
  const uploadMutation = useImageUpload();

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [showCrop, setShowCrop] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {showSuccess, showError} = useNotification()

  const validateFile = (selected) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selected.type)) {
      setError("Invalid file type. Only JPEG, PNG, WEBP allowed.");
      return false;
    }
    if (selected.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max ${maxSizeMB}MB allowed.`);
      return false;
    }
    return true;
  };

  const handleFile = (selected) => {
    if (!validateFile(selected)) return;
    setError("");
    setSuccess("");
    setFileName(selected.name);
    setPreview(URL.createObjectURL(selected));
    setShowCrop(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const selected = e.dataTransfer.files[0];
    if (selected) handleFile(selected);
  };

  const handleCropComplete = async (cropPixels) => {
    const cropped = await getCroppedImg(preview, cropPixels);
    setFile(cropped);
    setPreview(URL.createObjectURL(cropped));
    setShowCrop(false);
  };

  const handleUpload = () => {
    if (!file) return;

    setError("");
    setSuccess("");
    setProgress(0);

    const formData = new FormData();
    formData.append(fieldName, file);

    uploadMutation.mutate(
      {
        endpoint: uploadEndpoint,
        formData,
        onProgress: setProgress,
      },
      {
        onSuccess: (data) => {
          // Fix: Update with the correct field name
          const updateField = fieldName === 'avatar' ? 'userImage' : 'coverPhoto';
          updateUser({ [updateField]: data.url });
          setSuccess("Upload successful!");
          showSuccess(data?.message)
          setProgress(100);
        },
        onError: (err) => {
          setError(err.response?.data?.message || "Upload failed.");
          showError(err.response?.data?.message || "Upload failed.");
          setProgress(0);
        },
      }
    );
    
  };

  return (
    <div className="profile-card">
      <h2>{title}</h2>

      {preview && <img src={preview} alt="Preview" className={previewClass} />}

      {error && <div className="error-text">{error}</div>}
      {success && <div className="success-text">{success}</div>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden-file-input"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      <div
        className={`drop-zone ${dragActive ? "drag-active" : ""}`}
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <FileUploadIcon />
        <p>Click or drag image here</p>
        {fileName && <div className="file-name">{fileName}</div>}
      </div>

      <button onClick={handleUpload} disabled={!file || uploadMutation.isPending}>
        {uploadMutation.isPending ? "Uploading..." : uploadLabel}
      </button>

      {uploadMutation.isPending && progress > 0 && (
        // <ProgressRing progress={progress} />
        <div style={{ marginTop: "10px", width: "100%", height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px" }}>
        <div style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: "#2563eb",
          borderRadius: "4px",
          transition: "width 0.2s ease"
        }} />
      </div>
      )}

      {showCrop && (
        <ImageCropModal
          image={preview}
          aspect={aspect}
          onCancel={() => setShowCrop(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export default ImageUploader;
