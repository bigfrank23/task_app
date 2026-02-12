import { Link } from "react-router-dom";

// pages/NotFound.jsx
export const NotFound = () => (
  <div style={{ 
    height: '100vh', 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center' 
  }}>
    <h1 style={{ fontSize: '6rem', margin: 0 }}>404</h1>
    <p style={{ fontSize: '1.5rem', marginBottom: 30 }}>Page not found</p>
    <Link to="/" style={{ 
      padding: '12px 24px', 
      background: 'linear-gradient(135deg, #535bf2 0%, #764ba2 100%)', 
      color: 'white',
      borderRadius: '8px',
      textDecoration: 'none'
    }}>
      Go Home
    </Link>
  </div>
);