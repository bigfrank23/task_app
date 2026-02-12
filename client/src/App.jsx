import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import useAuthStore from './utils/authStore.js'
import { SocketProvider } from './utils/SocketProvider.jsx'
import './App.css'
import { TaskFlowIcon } from './utils/svgIcons.jsx'
import { NotFound } from './pages/Notfound.jsx'

const Home = lazy(() => import('./pages/home/Home.jsx'))
const Landing = lazy(() => import('./pages/landing/Landing.jsx'))
const About = lazy(() => import('./pages/about/About.jsx'))

const Form = lazy(() => import('./components/form/Form.jsx'))
const SignUpForm = lazy(() => import('./components/form/SignUpForm.jsx'))
const ForgotPassword = lazy(() => import('./pages/forgotPassword/ForgotPassword.jsx'))
const ResetPassword = lazy(() => import('./pages/resetPassword/ResetPassword.jsx'))

const Profile = lazy(() => import('./pages/profile/Profile.jsx'))
const EditUser = lazy(() => import('./components/form/editUser/EditUser.jsx'))
const ProfileSettings = lazy(() => import('./pages/profileSettings/ProfileSettings.jsx'))

const Dashboard2 = lazy(() => import('./pages/Dashboard/Dashboard2.jsx'))
const Messages2 = lazy(() => import('./pages/messages/Messages2.jsx'))
const Notifications = lazy(() => import('./pages/notifications/Notifications.jsx'))


// function AppLoader() {
//   return (
//     <div className="app-loader">
//       <h3 className="app-loader__logo">
//         TaskFl
//         <TaskFlowIcon size={15} />
//         w
//       </h3>
//       <span className="app-loader__text">Loading...</span>
//     </div>
//   );
// }
const AppLoader = () => (
  <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }}>
    <h2 className="app-loader__logo">
        TaskFl
        <TaskFlowIcon size={15} />
        w
      </h2>
      <span className="app-loader__text">Loading...</span>
  </div>
);

function App() {
  const { user, hasHydrated } = useAuthStore();

  if (!hasHydrated) {
    return null; // or loading spinner
  }

  return (
    <>
      <SocketProvider>
        <Suspense fallback={<AppLoader />}>
        <Routes>
          {/* ✅ Home route - Landing for logged out, Feed for logged in */}
          <Route
            path="/"
            element={user ? <Home /> : <Landing />}
          />

          {/* ✅ About page - accessible to everyone */}
          <Route path="/about" element={<About />} />

          {/* ✅ Auth routes - redirect to home if already logged in */}
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

          {/* ✅ Protected routes - require login */}
          <Route 
            path='/profile/:userId' 
            element={user ? <Profile /> : <Navigate to="/signin" replace />} 
          />

          <Route 
            path='/updateUser' 
            element={user ? <EditUser /> : <Navigate to="/signin" replace />} 
          />

          <Route 
            path='/profile/edit' 
            element={user ? <ProfileSettings /> : <Navigate to="/signin" replace />} 
          />

          <Route 
            path='/dashboard' 
            element={user ? <Dashboard2 /> : <Navigate to="/signin" replace />} 
          />

          <Route 
            path="/messages" 
            element={user ? <Messages2 /> : <Navigate to="/signin" replace />} 
          />

          <Route 
            path="/messages/:userId" 
            element={user ? <Messages2 /> : <Navigate to="/signin" replace />} 
          />

          <Route 
            path="/notifications" 
            element={user ? <Notifications /> : <Navigate to="/signin" replace />} 
          />

          {/* ✅ Catch all - redirect based on auth status */}
          {/* <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          /> */}
          <Route path="*" element={<NotFound />} />

        </Routes>
        </Suspense>
      </SocketProvider>
    </>
  )
}

export default App