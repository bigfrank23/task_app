// pages/ProfileSettings.jsx
import ProfileInfoForm from "../../components/profileSettingsComponent/ProfileInfoForm";
import AvatarUpload from "../../components/profileSettingsComponent/AvatarUpload";
import CoverPhotoUpload from "../../components/profileSettingsComponent/CoverPhotoUpload";
import PasswordUpdateForm from "../../components/profileSettingsComponent/PasswordUpdateForm";
import './profileSettings.css'
import Header from '../../components/header/Header'
import PublicIcon from '@mui/icons-material/Public';
import LocationPinIcon from '@mui/icons-material/LocationPin';

const ProfileSettings = () => {
 return (
  <div>
      <Header/>
      <div className="profileSettings">
        <div className="profileSettingsLeft">
          <div className="profileSettingsLTop">
            <img src="/general/images/wp.jpg" alt="" className="profileSettingsLbCoverImg" />
            <div className="profileSettingsLProfile">
              <img src="/general/images/franklin.jpg" alt="" className="profileSettingsLProfileImg" />
            </div>
            <h3 className="profileSettingsLUsername">John Franklin</h3>
            <p className="profileSettingsLUserTitle">Full Stack Developer</p>
            <p className="profileSettingsUserBio">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti deleniti a non error vero perspiciatis quisquam. Ea dolore deserunt magnam?</p>
            <div className="profileSettingsLocation">
              <LocationPinIcon className='profileSettingsLocationIcon'/>
              <span>New York, USA</span>
            </div>
          </div>
        </div>
        <div className="profile-settings">
          <h1 className="profile-settings-title">Profile Settings</h1>

          <ProfileInfoForm />
          <AvatarUpload />
          <CoverPhotoUpload />
          <PasswordUpdateForm />
        </div>
      </div>
  </div>
  );
};

export default ProfileSettings;
