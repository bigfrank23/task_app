import { useEffect, useState } from "react";
import "./editUser.css";
import apiRequest from "../../../utils/apiRequest";
import useAuthStore from "../../../utils/authStore";

const EditUser = () => {
  const { user, setCurrentUser } = useAuthStore();

  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user?.detailsWithoutPassword?.displayName || "",
        firstName: user?.detailsWithoutPassword?.firstName || "",
        lastName: user?.detailsWithoutPassword?.lastName || "",
        email: user?.detailsWithoutPassword?.email || "",
        password: "",
      });
    }
    
    
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await apiRequest.put("/user/auth/update", formData);
      setCurrentUser(res.data.user);
      setSuccess("Profile updated successfully");
      setFormData({ ...formData, password: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editProfile">
      <form className="editProfileCard" onSubmit={handleSubmit}>
        <h2>Edit User</h2>

        <input
          type="text"
          name="displayName"
          placeholder="Display Name"
          value={formData.displayName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        {user?.authProvider !== "google" && (
          <input
            type="password"
            name="password"
            placeholder="New Password (optional)"
            value={formData.password}
            onChange={handleChange}
          />
        )}

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditUser;
