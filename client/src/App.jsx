import './App.css'
import { Routes, Route, Navigate} from 'react-router-dom'
import Form from './components/form/Form.jsx'
import SignUpForm from './components/form/SignUpForm.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Home from './pages/home/Home.jsx'
import Profile from './pages/profile/Profile.jsx'
import useAuthStore from './utils/authStore.js'
import EditUser from './components/form/editUser/EditUser.jsx'
import ProfileSettings from './pages/profileSettings/ProfileSettings.jsx'
import ForgotPassword from './pages/forgotPassword/forgotPassword.jsx'
import ResetPassword from './pages/resetPassword/ResetPassword.jsx'

function App() {
  const { user, hasHydrated } = useAuthStore();

  if (!hasHydrated) {
  return null; // or loading spinner
}


  return (
     <>
      <Routes>
        <Route
        path="/"
        element={user ? <Home /> : <Form />}
      />

      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/signin" replace />}
      />

      <Route
        path="/signup"
        element={!user ? <SignUpForm /> : <Navigate to="/" replace />}
      />

      <Route
        path="/signin"
        element={!user ? <Form /> : <Navigate to="/" replace />}
      />
      <Route
        path="/forgot-password"
        element={!user ? <ForgotPassword /> : <Navigate to="/" replace />}
      />
      <Route
        path="/reset-password/:token"
        element={!user ? <ResetPassword /> : <Navigate to="/" replace />}
      />
        <Route path='/:profile' element={<Profile/>} />
        <Route path='/updateUser' element={<EditUser/>} />
        <Route path='/profile-settings' element={<ProfileSettings/>} />

      </Routes>
    </>
  )
}

export default App
