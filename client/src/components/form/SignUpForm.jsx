import { Link } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./form.css";
import { useState } from "react";

const SignUpForm = () => {
  const [visible, setVisible] = useState(false)

  const handleVisibility = () => {
    setVisible(!visible)
  }
  return (
    <div className="form">
      <div className="formContent">
        <h2 className="formHeader">Sign up</h2>
        <div className="formField">
          <label htmlFor="firstName">First Name</label>
          <input type="text" />
        </div>
        <div className="formField">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" />
        </div>
        <div className="formField">
          <label htmlFor="email">Email Address</label>
          <input type="text" />
        </div>
        <div className="formField">
          <label htmlFor="password">Password</label>
          <input type={visible ? "text" : "password"} />
          {visible ? (
            (<VisibilityOffIcon onClick={handleVisibility} style={{alignSelf: "flex-end", cursor: "pointer"}}/>)
          ) : 
          <VisibilityIcon onClick={handleVisibility} style={{alignSelf: "flex-end", cursor: "pointer"}}/>
          }
        </div>
        <div className="formField">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type={visible ? "text" : "password"} />
          {visible ? (
            (<VisibilityOffIcon onClick={handleVisibility} style={{alignSelf: "flex-end", cursor: "pointer"}}/>)
          ) : 
          <VisibilityIcon onClick={handleVisibility} style={{alignSelf: "flex-end", cursor: "pointer"}}/>
          }
        </div>

        <button type="submit">Submit</button>

        <p className="formFooter">
          Already have an account?
          <Link to='/signin'>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
