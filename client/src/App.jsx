import './App.css'
import { Routes, Route, Navigate} from 'react-router-dom'
import Form from './components/form/Form.jsx'
import SignUpForm from './components/form/SignUpForm.jsx'
import Home from './pages/home/Home.jsx'
import Profile from './pages/profile/Profile.jsx'
import useAuthStore from './utils/authStore.js'
import EditUser from './components/form/editUser/EditUser.jsx'
import ProfileSettings from './pages/profileSettings/ProfileSettings.jsx'
import ForgotPassword from './pages/forgotPassword/forgotPassword.jsx'
import ResetPassword from './pages/resetPassword/ResetPassword.jsx'
import Dashboard2 from './pages/Dashboard/Dashboard2.jsx'
import DebugTasks from './pages/DebugTask.jsx'
import Notifications from './pages/notifications/Notifications.jsx'
import Messages2 from './pages/messages/Messages2.jsx'
import { SocketProvider } from './utils/SocketProvider.jsx'

function App() {
  const { user, hasHydrated } = useAuthStore();

  if (!hasHydrated) {
  return null; // or loading spinner
}


  return (
     <>
        <SocketProvider>
      <Routes>
        <Route
        path="/"
        element={user ? <Home /> : <Form />}
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
        <Route path='/profile/:userId' element={<Profile/>} />
        <Route path='/updateUser' element={<EditUser/>} />
        <Route path='/profile/edit' element={<ProfileSettings/>} />
        <Route path='/dashboard' element={<Dashboard2/>} />
        <Route path="/debug-tasks" element={<DebugTasks />} />

        <Route path="/messages" element={<Messages2 />} />
        <Route path="/messages/:userId" element={<Messages2 />} />
        <Route path="/notifications" element={<Notifications />} />

        
      </Routes>
        </SocketProvider>
    </>
  )
}

export default App
