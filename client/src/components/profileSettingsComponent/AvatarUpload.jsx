import useAuthStore from "../../utils/authStore";
import ImageUploader from "./ImageUploader";

const AvatarUpload = () => {
  const {user} = useAuthStore()
  return(

  <>
  {
    (user?.user?.authProvider || user?.authProvider) === "local" &&
    <ImageUploader
      title="Profile Photo"
      aspect={1}
      previewClass="preview-img"
      uploadLabel="Upload Avatar"
      uploadEndpoint="/user/profile/avatar"
      fieldName="avatar"
    />
  }
  </>
  )
}

export default AvatarUpload;
