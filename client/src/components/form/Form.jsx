// import { Link, Navigate, useNavigate } from 'react-router-dom'
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import "./form.css";
// import { useState } from "react";
// import { GoogleLogin } from "@react-oauth/google";
// import { useNotification } from '../../utils/useNotification';
// import apiRequest from '../../utils/apiRequest';
// import useAuthStore from '../../utils/authStore';
// import { TaskFlowIcon } from '../../utils/svgIcons';
// import Footer from '../footer/Footer';

// const Form = () => {
//     const [visible, setVisible] = useState(false)
//     const { showSuccess, showError } = useNotification()
//     const {setUser} = useAuthStore()
//     const navigate = useNavigate()
    
//       const handleVisibility = () => {
//         setVisible(!visible)
//       }


//       // GOOGLE Auth
//          const handleSuccess = async (response) => {
//           try {
//             const res = await apiRequest.post('/user/auth/google', {
//               credential: response.credential
//             });
      
//             // console.log(res.data);
//             setUser(res.data)
            
//             localStorage.setItem('token', res.data.token); // your JWT
//             navigate('/')
//           } catch (err) {
//             console.error(err);
//           }
//         };

//     //Local Auth(Signin)
//     const handleSubmit = async(e) => {
//         e.preventDefault()
//         const formData = new FormData(e.target)
//         const data = Object.fromEntries(formData)
//         try {
//             const res = await apiRequest.post('/user/auth/login', data)
//             // console.log(res.data);
//             setUser(res.data.detailsWithoutPassword)
//             showSuccess(res.data.message)
//             navigate('/')
            
//         } catch (error) {
//             console.log(error);
//             // showError(error.response.statusText + "!")
//             showError(error?.response?.data?.message || "Something went wrong")
//             showError(error.message)
            
//         }
//     }


//   return (
//             <form className='form' onSubmit={handleSubmit}>
//                 <div className='formContent'>
//                     <span style={{textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Welcome back to TaskFl<TaskFlowIcon size={15}/>w</span>
//                     <h2 className="formHeader">Sign in</h2>
//                     <div className="formField">
//                         <label htmlFor="email">Email Address</label>
//                         <input type="text" name='email'/>
//                     </div>
//                     <div className="formField">
//                         <label htmlFor="userPassword">Password</label>
//                         <input type={visible ? "text" : "password"} name='password'/>
//                         {visible ? (
//                             (<VisibilityOffIcon onClick={handleVisibility} style={{alignSelf: "flex-end", cursor: "pointer", fontSize: '14px'}}/>)
//                         ) : 
//                         <VisibilityIcon onClick={handleVisibility} style={{alignSelf: "flex-end", cursor: "pointer", fontSize: '14px'}}/>
//                         }
//                         <div className='forgotPass'>
//                         <Link to={'/forgot-password'}>Forgot password?</Link>
//                         </div>
//                     </div>
                    
//                     <button type="submit">Submit</button>

//                     <p className="formFooter">Don't have an account? 
//                         <Link to="/signup">Sign up</Link>
//                     </p>
//                     {/* <div className="divider">
//                     <span>OR</span>
//                     </div>

//                 <div className="googleAuth">
//                     <GoogleLogin
//                     onSuccess={handleSuccess}
//                     onError={() => showError("Sign in Failed!")}
//                     />
//                 </div> */}
//                 </div>
//                 <Footer/>
//             </form>
//     )
// }

// export default Form
// components/form/Form.jsx

import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./form.css";
import { useState } from "react";
import { useNotification } from '../../utils/useNotification';
import apiRequest from '../../utils/apiRequest';
import useAuthStore from '../../utils/authStore';
import { TaskFlowIcon } from '../../utils/svgIcons';
import Footer from '../footer/Footer';

const Form = () => {
  const [visible, setVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useNotification();
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleVisibility = () => {
    setVisible(!visible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    setIsSubmitting(true);

    try {
      const res = await apiRequest.post('/user/auth/login', data);
      setUser(res.data.detailsWithoutPassword);
      
      // Store token if provided
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      
      showSuccess(res.data.message);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      showError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className='form' onSubmit={handleSubmit}>
      <div className='formContent'>
        <div style={{ 
          textAlign: 'center', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: 10
        }}>
          <span style={{ fontSize: 18, color: '#6b7280', display: 'flex', alignItems: 'center' }}>
            Welcome back to TaskFl<TaskFlowIcon size={18}/>w
          </span>
        </div>

        <h2 className="formHeader">Sign In</h2>

        <div className="formField">
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            name='email' 
            id='email'
            placeholder="john@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="formField">
          <label htmlFor="password">Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={visible ? "text" : "password"} 
              name='password' 
              id='password'
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            {visible ? (
              <VisibilityOffIcon 
                onClick={handleVisibility} 
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: 20,
                  color: '#6b7280'
                }}
              />
            ) : (
              <VisibilityIcon 
                onClick={handleVisibility} 
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: 20,
                  color: '#6b7280'
                }}
              />
            )}
          </div>
          <div className='forgotPass'>
            <Link to={'/forgot-password'}>Forgot password?</Link>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>

        <p className="formFooter">
          Don't have an account?
          <Link to="/signup">Sign Up</Link>
        </p>
      </div>
      <Footer />
    </form>
  );
};

export default Form;