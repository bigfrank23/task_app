import { useState } from "react";
import "./profileSettingsComponent.css";
import useAuthStore from "../../utils/authStore";
import { useUpdateProfile } from "../../utils/useProfileHooks.js";
import {useNotification} from '../../utils/useNotification.js'

const ProfileInfoForm = () => {
  const {user, updateUser} = useAuthStore()
  const mutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    displayName: user?.displayName || user?.user?.displayName ||  "",
    firstName: user?.firstName || user?.user?.firstName || "",
    lastName: user?.lastName || user?.user?.lastName || "",
    jobTitle: user?.jobTitle || user?.user?.jobTitle || "",
    location: user?.location || user?.user?.location || "",
    email: user?.email || "",
    bio: user?.bio || user?.user?.bio || "",
  });
  const {showSuccess, showError} = useNotification()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // API call later
  // await new Promise((r) => setTimeout(r, 800));
   const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate(formData, {
      onSuccess: (res) => {
        showSuccess(res.data.message);
        updateUser(res.data.user);
      },
      onError: (err) => {
        showError(err.response?.data?.message || "Error updating profile");
      },
    });
  };

  // console.log(user.authProvider);
  


  return (
    <div className={`profile-card ${mutation.isPending ? "loading" : ""}`}>
      <h2>Profile Information</h2>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Display Name</label>
          <input name="displayName" value={formData?.displayName} onChange={handleChange} />
        </div>
        {
          (user?.user?.authProvider || user?.authProvider) === "local" &&
        <div className="form-group">
          <label>First Name</label>
          <input name="firstName" value={formData?.firstName} onChange={handleChange} />
        </div>
        }
        {
          (user?.user?.authProvider || user?.authProvider) === "local" &&
          <div className="form-group">
            <label>Last Name</label>
            <input name="lastName" value={formData?.lastName} onChange={handleChange} />
          </div>
        }
        <div className="form-group">
          <label>Job Title</label>
          <input name="jobTitle" value={formData?.jobTitle} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input name="location" value={formData?.location} onChange={handleChange} />
        </div>

        {
          (user?.user?.authProvider || user?.authProvider) === "local" &&
        <div className="form-group">
          <label>Email</label>
          <input name="email" value={formData?.email} onChange={handleChange} />
        </div>
        }

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows="3"
            value={formData?.bio}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileInfoForm;
