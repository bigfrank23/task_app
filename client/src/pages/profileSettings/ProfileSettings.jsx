// pages/ProfileSettings.jsx
import ProfileInfoForm from "../../components/profileSettingsComponent/ProfileInfoForm";
import AvatarUpload from "../../components/profileSettingsComponent/AvatarUpload";
import CoverPhotoUpload from "../../components/profileSettingsComponent/CoverPhotoUpload";
import PasswordUpdateForm from "../../components/profileSettingsComponent/PasswordUpdateForm";
import './profileSettings.css'
import Header from '../../components/header/Header'
import PublicIcon from '@mui/icons-material/Public';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import useAuthStore from "../../utils/authStore";
import Footer from "../../components/footer/Footer";

const ProfileSettings = () => {
    const {user} = useAuthStore()

    const initials = `${user?.firstName?.charAt(0) ?? ""}${
    user?.lastName?.charAt(0) ?? ""
  }`.toUpperCase()
 return (
  <div>
      <Header/>
      <div className="profileSettings">
        <div className="profileSettingsLeft">
          <div className="profileSettingsLTop">
            {
            user?.coverPhoto ?
            <img src={user?.coverPhoto} alt="" className="bgCImg" />
            :
            <div
              className="bgCDiv"
              style={{
                backgroundImage: user?.coverImg
                  ? `url(${user.coverImg})`
                  : `linear-gradient(135deg, #667eea, #764ba2)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                height: "100px",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                position: "relative",
              }}
            />
          }
            <div className="profileSettingsLProfile">
              {user?.userImage ? (
              <img
                src={user.userImage}
                alt="user_profile_img"
                className="profileSettingsLProfileImg"
              />
            ) : (
              <span className="pfSAvatarFallback"
              >
                {initials}
              </span>
            )}
            </div>
            <h3 className="profileSettingsLUsername">{user?.firstName} {user?.lastName}</h3>
            <span className="profileSettingsHandle">@{user?.displayName}</span>
            <p className="profileSettingsLUserTitle">{user?.jobitle}</p>
            <p className="profileSettingsUserBio">{user?.bio}</p>
            {user?.location && (
            <div className="profileSettingsLocation">
              <LocationPinIcon className='profileSettingsLocationIcon' style={{fontSize: '.8rem'}}/>
              <span>{user?.location}</span>
            </div>)
              }
          </div>
        </div>
        <div className="profile-settings">
          <h1 className="profile-settings-title">Edit Profile</h1>

          <ProfileInfoForm />
          <AvatarUpload />
          <CoverPhotoUpload />
          <PasswordUpdateForm />
        </div>
      </div>
      <div><Footer/></div>
  </div>
  );
};

export default ProfileSettings;
