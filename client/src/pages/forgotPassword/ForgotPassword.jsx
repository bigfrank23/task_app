import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";
import Footer from "../../components/footer/Footer";
import './forgotPassword.css'


const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: (data) =>
      apiRequest.post("/user/auth/forgot-password", data),
  });
  

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email });
  };

  return (
    <div className="forgotPassword">
    <form onSubmit={handleSubmit} className="auth-card">
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">
        {mutation.isPending ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
    <Footer/>
    </div>
  );
};

export default ForgotPassword