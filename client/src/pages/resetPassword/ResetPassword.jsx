import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiRequest from "../../utils/apiRequest";
import { useNotification } from "../../utils/useNotification";
import './resetPassword.css'
import Footer from "../../components/footer/Footer";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const { showSuccess, showError } = useNotification()
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) =>
      apiRequest.patch(`/user/auth/reset-password/${token}`, data),
  });

 const handleSubmit = (e) => {
  e.preventDefault();

  console.log("Sending:", { newPassword: password }); // ADD THIS
  mutation.mutate({ newPassword: password },
    {
      onSuccess: (res) => {
        showSuccess(res.data.message);
        console.log("Success response:", res.data.message);
        navigate('/')
      },
      onError: (err) => {
        // showError(err.response?.data?.message);
        const message = err.response?.data?.message || "Something went wrong";
      console.error("Reset error:", err);
      showError(message)
      },
    }
  );
};

  return (
    <div className="resetPassword">
        <form onSubmit={handleSubmit} className="auth-card">
        <h2>Reset Password</h2>
        <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
        <button type="submit">Reset</button>
        </form>
        <Footer/>
    </div>
  );
};


export default ResetPassword