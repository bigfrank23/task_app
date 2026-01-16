import { useState } from "react";
import "./profileSettingsComponent.css";
import { useUpdatePassword } from "../../utils/useProfileHooks";
import { useNotification } from "../../utils/useNotification";
import useAuthStore from "../../utils/authStore";

const PasswordUpdateForm = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const mutation = useUpdatePassword()
  const {showSuccess, showError, showInfo} = useNotification()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const { user} = useAuthStore();

if (user?.user?.authProvider === "google") {
  showInfo("You signed in with Google. Password change is not available.")
  return (
    <div className="profile-card">
      <h2>Password</h2>
      <p>
        You signed in with Google. Password change is not available.
      </p>
    </div>
  );
}



  const handleSubmit = (e) => {
  e.preventDefault();

  if (form.newPassword.length < 8) {
    return setError("New password must be at least 8 characters");
  }

  if (form.newPassword !== form.confirmPassword) {
    return setError("Passwords do not match");
  }

  mutation.mutate(
    {
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    },
    {
      onSuccess: (res) => {
        showSuccess(res.message || "Password updated successfully");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        
      },
      onError: (err) => {
        setError(err.response?.data?.message || "Password update failed");
        showError(err.response?.data?.message || "Password update failed")
      },
    }
  );
};


  return (
    <div className={`profile-card ${mutation.isPending ? "loading" : ""}`}>
      <h2>Change Password</h2>

      {error && <div className="error-text">{error}</div>}
      {success && <div className="success-text">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default PasswordUpdateForm;
