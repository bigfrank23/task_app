import ImageUploader from "./ImageUploader";

const CoverPhotoUpload = () => (
  <ImageUploader
    title="Cover Photo"
    aspect={16 / 9}
    previewClass="cover-preview"
    uploadLabel="Upload Cover"
    uploadEndpoint="/user/profile/cover"
    fieldName="cover"
  />
);

export default CoverPhotoUpload;
