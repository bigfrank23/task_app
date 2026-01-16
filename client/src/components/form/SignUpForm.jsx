import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./form.css";
import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import apiRequest from "../../utils/apiRequest";
import useAuthStore from "../../utils/authStore";
import { useNotification } from '../../utils/useNotification'

const SignUpForm = () => {
  const [visible, setVisible] = useState(false)
  const {setUser} = useAuthStore()
  const { showSuccess, showError } = useNotification()
  const navigate = useNavigate()
  const [passwordsNotMatch, setPasswordsNotMatch] = useState(false)

  useEffect(() => {
  if (passwordsNotMatch) {
    const timer = setTimeout(() => {
      setPasswordsNotMatch(false); // hide message after 5s
    }, 5000);
    return () => clearTimeout(timer); // cleanup
  }

  // console.log(useAuthStore.getState().user);
  
}, [passwordsNotMatch]);

  const handleVisibility = () => {
    setVisible(!visible)
  }


  // GOOGLE Auth
   const handleSuccess = async (response) => {
    try {
      const res = await apiRequest.post('/user/auth/google', {
        credential: response.credential
      });

      // console.log(res.data);
      setUser(res.data)
      
      localStorage.setItem('token', res.data.token); // your JWT
      navigate('/')
    } catch (err) {
      console.error(err);
    }
  };


  // Local Auth
  const handleSubmit = async(e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    if (data.password !== data.confirmPassword) {
      return setPasswordsNotMatch(true)
      // return alert('Passwords do not match');
    }


    try {
      const res = await apiRequest.post('/user/auth/register', data)
      showSuccess(res.data.message)
      setUser(res.data.detailsWithoutPassword)
      navigate('/')
    } catch (error) {
      showError(error.response.statusText + "!")
      showError(error?.response?.data?.message || "Something went wrong")
      showError(error.message)
      
    }
    

  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="formContent">
        <h2 className="formHeader">Sign up</h2>
        <div className="formField">
          <label htmlFor="firstName">Display Name</label>
          <input type="text" name="displayName"/>
        </div>
        <div className="formField">
          <label htmlFor="firstName">First Name</label>
          <input type="text" name="firstName"/>
        </div>
        <div className="formField">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" name="lastName"/>
        </div>
        <div className="formField">
          <label htmlFor="email">Email Address</label>
          <input type="text" name="email"/>
        </div>
        <div className="formField">
          <label htmlFor="password">Password</label>
          <input type={visible ? "text" : "password"} name="password"/>
          {visible ? (
            (<VisibilityOffIcon onClick={handleVisibility} style={{alignSelf: "flex-end", cursor: "pointer", fontSize: '14px'}}/>)
          ) : 
          <VisibilityIcon onClick={handleVisibility} style={{alignSelf: "flex-end", cursor: "pointer", fontSize: '14px'}}/>
          }
        </div>
        <div className="formField">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type={visible ? "text" : "password"} name="confirmPassword"/>
          {visible ? (
            (<VisibilityOffIcon onClick={handleVisibility} style={{alignSelf: "flex-end", cursor: "pointer", fontSize: '14px'}}/>)
          ) : 
          <VisibilityIcon onClick={handleVisibility} style={{alignSelf: "flex-end", cursor: "pointer", fontSize: '14px'}}/>
          }
        </div>
          {
            passwordsNotMatch && (
              <span className="validationError">Passwords do not match!</span>     
            )
          }

        <button type="submit">Submit</button>

        <p className="formFooter">
          Already have an account?
          <Link to='/signin'>Sign in</Link>
        </p>
      <div className="divider">
      <span>OR</span>
      </div>

      <div className="googleAuth">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => showError("Sign in Failed!")}
        />
      </div>
      </div>
    </form>
  );
};

export default SignUpForm;
