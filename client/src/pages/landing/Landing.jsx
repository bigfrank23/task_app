// pages/landing/Landing.jsx

import { Link } from 'react-router-dom';
import Header from '../../components/header/Header';
import './landing.css';
import Footer from '../../components/footer/Footer';

const Landing = () => {
  return (
    <>
      <Header />
      <div className="landing-page">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="brand">TaskFlow</span>
            </h1>
            <p className="hero-subtitle">
              Where productivity meets collaboration
            </p>
            <p className="hero-description">
              Manage tasks, collaborate with teams, and stay productive—all in one place.
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn-landing btn-primary">
                Get Started Free
              </Link>
              <Link to="/signin" className="btn-landing btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <h2>Why TaskFlow?</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Smart Task Management</h3>
              <p>Create, organize, and track tasks with ease</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Team Collaboration</h3>
              <p>Work together in real-time</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Real-time Chat</h3>
              <p>Stay connected with your team</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Progress Tracking</h3>
              <p>Monitor your productivity</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to boost your productivity?</h2>
          <p>Join thousands of users who are getting things done with TaskFlow</p>
          <Link to="/signup" className="btn-landing btn-primary btn-large">
            Start Free Today
          </Link>
        </section>
      </div>
      <Footer/>
    </>
  );
};

export default Landing;