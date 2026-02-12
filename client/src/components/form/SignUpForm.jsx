// import { Link, useNavigate } from "react-router-dom";
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import "./form.css";
// import { useEffect, useState } from "react";
// import { GoogleLogin } from "@react-oauth/google";
// import apiRequest from "../../utils/apiRequest";
// import useAuthStore from "../../utils/authStore";
// import { useNotification } from '../../utils/useNotification'
// import { TaskFlowIcon } from "../../utils/svgIcons";
// import Footer from "../footer/Footer";

// const SignUpForm = () => {
//   const [visible, setVisible] = useState(false)
//   const {setUser} = useAuthStore()
//   const { showSuccess, showError } = useNotification()
//   const navigate = useNavigate()
//   const [passwordsNotMatch, setPasswordsNotMatch] = useState(false)

//   useEffect(() => {
//   if (passwordsNotMatch) {
//     const timer = setTimeout(() => {
//       setPasswordsNotMatch(false); // hide message after 5s
//     }, 5000);
//     return () => clearTimeout(timer); // cleanup
//   }

//   // console.log(useAuthStore.getState().user);
  
// }, [passwordsNotMatch]);

//   const handleVisibility = () => {
//     setVisible(!visible)
//   }


//   // GOOGLE Auth
//    const handleSuccess = async (response) => {
//     try {
//       const res = await apiRequest.post('/user/auth/google', {
//         credential: response.credential
//       });

//       // console.log(res.data);
//       setUser(res.data)
      
//       localStorage.setItem('token', res.data.token); // your JWT
//       navigate('/')
//     } catch (err) {
//       console.error(err);
//     }
//   };


//   // Local Auth
//   const handleSubmit = async(e) => {
//     e.preventDefault()
//     const formData = new FormData(e.target)
//     const data = Object.fromEntries(formData)

//     if (data.password !== data.confirmPassword) {
//       return setPasswordsNotMatch(true)
//       // return alert('Passwords do not match');
//     }


//     try {
//       const res = await apiRequest.post('/user/auth/register', data)
//       showSuccess(res.data.message)
//       setUser(res.data.detailsWithoutPassword)
//       navigate('/')
//     } catch (error) {
//       showError(error.response.statusText + "!")
//       showError(error?.response?.data?.message || "Something went wrong")
//       showError(error.message)
      
//     }
    

//   }

//   return (
//     <form className="form" onSubmit={handleSubmit}>
//       <div className="formContent">
//       <span style={{textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Welcome to TaskFl<TaskFlowIcon size={15}/>w</span>
//         <h2 className="formHeader">Sign up</h2>
//         <div className="formField">
//           <label htmlFor="firstName">Display Name</label>
//           <input type="text" name="displayName"/>
//         </div>
//         <div className="formField">
//           <label htmlFor="firstName">First Name</label>
//           <input type="text" name="firstName"/>
//         </div>
//         <div className="formField">
//           <label htmlFor="lastName">Last Name</label>
//           <input type="text" name="lastName"/>
//         </div>
//         <div className="formField">
//           <label htmlFor="email">Email Address</label>
//           <input type="text" name="email"/>
//         </div>
//         <div className="formField">
//           <label htmlFor="password">Password</label>
//           <input type={visible ? "text" : "password"} name="password"/>
//           {visible ? (
//             (<VisibilityOffIcon onClick={handleVisibility} style={{alignSelf: "flex-end", cursor: "pointer", fontSize: '14px'}}/>)
//           ) : 
//           <VisibilityIcon onClick={handleVisibility} style={{alignSelf: "flex-end", cursor: "pointer", fontSize: '14px'}}/>
//           }
//         </div>
//         <div className="formField">
//           <label htmlFor="confirmPassword">Confirm Password</label>
//           <input type={visible ? "text" : "password"} name="confirmPassword"/>
//           {visible ? (
//             (<VisibilityOffIcon onClick={handleVisibility} style={{alignSelf: "flex-end", cursor: "pointer", fontSize: '14px'}}/>)
//           ) : 
//           <VisibilityIcon onClick={handleVisibility} style={{alignSelf: "flex-end", cursor: "pointer", fontSize: '14px'}}/>
//           }
//         </div>
//           {
//             passwordsNotMatch && (
//               <span className="validationError">Passwords do not match!</span>     
//             )
//           }

//         <button type="submit">Submit</button>

//         <p className="formFooter">
//           Already have an account?
//           <Link to='/signin'>Sign in</Link>
//         </p>
//       {/* <div className="divider">
//       <span>OR</span>
//       </div>

//       <div className="googleAuth">
//         <GoogleLogin
//           onSuccess={handleSuccess}
//           onError={() => showError("Sign in Failed!")}
//         />
//       </div> */}
//       </div>
//       <Footer/>
//     </form>
//   );
// };

// export default SignUpForm;
// components/form/SignUpForm.jsx

import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./form.css";
import { useEffect, useState } from "react";
import apiRequest from "../../utils/apiRequest";
import useAuthStore from "../../utils/authStore";
import { useNotification } from '../../utils/useNotification'
import { TaskFlowIcon } from "../../utils/svgIcons";
import Footer from "../footer/Footer";

const SignUpForm = () => {
  const [visible, setVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useAuthStore();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const [passwordsNotMatch, setPasswordsNotMatch] = useState(false);

  useEffect(() => {
    if (passwordsNotMatch) {
      const timer = setTimeout(() => {
        setPasswordsNotMatch(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [passwordsNotMatch]);

  const handleVisibility = () => {
    setVisible(!visible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Validation
    if (data.password !== data.confirmPassword) {
      setPasswordsNotMatch(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiRequest.post('/user/auth/register', data);
      showSuccess(res.data.message);
      setUser(res.data.detailsWithoutPassword);
      
      // Store token if provided
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      showError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="formContent">
        <div style={{ 
          textAlign: 'center', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: 10
        }}>
          <span style={{ fontSize: 18, color: '#6b7280', display: 'flex', alignItems: 'center' }}>
            Welcome to TaskFl<TaskFlowIcon size={18}/>w
          </span>
        </div>

        <h2 className="formHeader">Create Account</h2>

        <div className="formField">
          <label htmlFor="displayName">Display Name *</label>
          <input 
            type="text" 
            name="displayName" 
            id="displayName"
            placeholder="johndoe"
            required
            autoComplete="username"
          />
        </div>

        <div className="formField">
          <label htmlFor="firstName">First Name *</label>
          <input 
            type="text" 
            name="firstName" 
            id="firstName"
            placeholder="John"
            required
            autoComplete="given-name"
          />
        </div>

        <div className="formField">
          <label htmlFor="lastName">Last Name *</label>
          <input 
            type="text" 
            name="lastName" 
            id="lastName"
            placeholder="Doe"
            required
            autoComplete="family-name"
          />
        </div>

        <div className="formField">
          <label htmlFor="email">Email Address *</label>
          <input 
            type="email" 
            name="email" 
            id="email"
            placeholder="john@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="formField">
          <label htmlFor="password">Password *</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={visible ? "text" : "password"} 
              name="password" 
              id="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              minLength={6}
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
        </div>

        <div className="formField">
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={visible ? "text" : "password"} 
              name="confirmPassword" 
              id="confirmPassword"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              minLength={6}
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
        </div>

        {passwordsNotMatch && (
          <span className="validationError">
            ⚠️ Passwords do not match!
          </span>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p className="formFooter">
          Already have an account?
          <Link to='/signin'>Sign In</Link>
        </p>
      </div>
      <Footer />
    </form>
  );
};

export default SignUpForm;