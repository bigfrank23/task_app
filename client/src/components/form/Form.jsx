import { Link, Navigate, useNavigate } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./form.css";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNotification } from '../../utils/useNotification';
import apiRequest from '../../utils/apiRequest';
import useAuthStore from '../../utils/authStore';

const Form = () => {
    const [visible, setVisible] = useState(false)
    const { showSuccess, showError } = useNotification()
    const {setUser} = useAuthStore()
    const navigate = useNavigate()
    
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

    //Local Auth(Signin)
    const handleSubmit = async(e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)
        try {
            const res = await apiRequest.post('/user/auth/login', data)
            // console.log(res.data);
            setUser(res.data.detailsWithoutPassword)
            showSuccess(res.data.message)
            navigate('/')
            
        } catch (error) {
            console.log(error);
            // showError(error.response.statusText + "!")
            showError(error?.response?.data?.message || "Something went wrong")
            showError(error.message)
            
        }
    }


  return (
            <form className='form' onSubmit={handleSubmit}>
                <div className='formContent'>
                    <h2 className="formHeader">Sign in</h2>
                    <div className="formField">
                        <label htmlFor="email">Email Address</label>
                        <input type="text" name='email'/>
                    </div>
                    <div className="formField">
                        <label htmlFor="userPassword">Password</label>
                        <input type={visible ? "text" : "password"} name='password'/>
                        {visible ? (
                            (<VisibilityOffIcon onClick={handleVisibility} style={{alignSelf: "flex-end", cursor: "pointer", fontSize: '14px'}}/>)
                        ) : 
                        <VisibilityIcon onClick={handleVisibility} style={{alignSelf: "flex-end", cursor: "pointer", fontSize: '14px'}}/>
                        }
                        <div className='forgotPass'>
                        <Link to={'/forgot-password'}>Forgot password?</Link>
                        </div>
                    </div>
                    
                    <button type="submit">Submit</button>

                    <p className="formFooter">Don't have an account? 
                        <Link to="/signup">Sign up</Link>
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
    )
}

export default Form