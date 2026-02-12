// components/header/Header.jsx

import "./header.css";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ProgressiveBar from "../progressiveBar/ProgressivBar";
import apiRequest from "../../utils/apiRequest";
import { useNotification } from "../../utils/useNotification";
import useAuthStore from "../../utils/authStore";
import { Link, useNavigate } from "react-router-dom";
import { stringToColor } from "../../utils/stringColor";
import useTaskUIStore from "../../utils/taskUIStore";
import MessageButton from "../messages/MessageButton";
import NotificationBell from "../notifications/NotificationBell";
import DashboardIcon from '@mui/icons-material/Dashboard';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { TaskFlowIcon } from "../../utils/svgIcons";

const Header = () => {
  const [query, setQuery] = useState("");
  const setSearchQuery = useTaskUIStore((state) => state.setSearchQuery);
  const [dropDown, setDropDown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { showSuccess, showError } = useNotification();
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const initials = `${user?.firstName?.charAt(0) ?? ""}${
    user?.lastName?.charAt(0) ?? ""
  }`.toUpperCase();

  const handleChange = (e) => setQuery(e.target.value);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query.trim());
      navigate('/');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setSearchQuery("");
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      "⚠️ WARNING: This will permanently delete your account and all your data.\n\n" +
      "This includes:\n" +
      "• All your tasks\n" +
      "• All your messages\n" +
      "• All your connections\n" +
      "• Your profile data\n\n" +
      "This action CANNOT be undone!\n\n" +
      "Are you absolutely sure?"
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      "Last chance!\n\nClick OK to permanently delete your account."
    );

    if (!doubleConfirm) return;

    try {
      const res = await apiRequest.delete("/user/delete-account");
      localStorage.clear();
      showSuccess(res.data.message);
      logout();
      navigate("/signup", { replace: true });
    } catch (error) {
      console.error("Delete account error:", error);
      showError(error?.response?.data?.message || "Failed to delete account");
    }
  };

  const toggleDropDown = () => {
    setDropDown((prev) => !prev);
  };

  const handleClick = async () => {
    try {
      const res = apiRequest.post("/user/auth/logout");
      logout();
      showSuccess((await res).data.message);
      setDropDown(false);
      setMobileMenuOpen(false);
      navigate("/signin");
    } catch (error) {
      console.log(error);
      showError(error?.response?.data?.message || "Something went wrong");
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-btn')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <>
      <div className="header" id="header">
        {/* Logo - Always visible */}
        <div className="headerLeft">
          <Link to="/" className="homeLink">
            <TaskFlowIcon className="icon" />
            <p className="logo-text">TaskFlow</p>
          </Link>
        </div>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="search desktop-search">
          <SearchIcon className="searchIcon" />
          <input
            type="search"
            name="searchInput"
            placeholder="Search tasks..."
            value={query}
            onChange={handleChange}
            aria-label="Search"
            className="searchInput"
          />
        </form>

        {/* Desktop Navigation */}
        <div className="headerRight desktop-nav">
          <Link to="/about" className="nav-link">
            <InfoIcon className="icon" />
            <p>About</p>
          </Link>

          <Link to="/dashboard" className="nav-link">
            <DashboardIcon className="icon" />
            <p>Dashboard</p>
          </Link>

          <MessageButton />
          <NotificationBell />

          {/* Profile Dropdown */}
          <div className="headerRightItem profileItem">
            {user && (
              <>
                <div className="avatar" onClick={toggleDropDown}>
                  {user?.userImage ? (
                    <img 
                      src={user?.userImage} 
                      alt="user_profile_img"
                      onError={(e) => {
                        e.target.src = '/general/images/user.png';
                        e.target.alt = 'Image fail to load';
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <span 
                      className="avatarFallback"
                      style={{ backgroundColor: stringToColor(initials) }}
                    >
                      {initials}
                    </span>
                  )}
                </div>

                <div className="profileLabel">
                  <p>Me</p>
                  <ArrowDropDownIcon />
                </div>

                {dropDown && (
                  <ul className="hrDropDown">
                    <li onClick={handleClick}>
                      <p>Sign out</p>
                    </li>
                    <li className="danger" onClick={deleteAccount}>
                      <p>Delete Account</p>
                    </li>
                  </ul>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Icons */}
        <div className="mobile-icons">
          <button 
            className="icon-btn mobile-search-btn"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <SearchIcon />
          </button>

          <button 
            className="icon-btn mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Search Dropdown */}
        {searchOpen && (
          <div className="mobile-search-dropdown">
            <form onSubmit={handleSearch} className="mobile-search-form">
              <SearchIcon className="searchIcon" />
              <input
                type="search"
                name="searchInput"
                placeholder="Search tasks..."
                value={query}
                onChange={handleChange}
                aria-label="Search"
                className="searchInput"
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <nav className="mobile-nav">
              {user && (
                <>
                  <div className="user-profile-section">
                    <div className="avatar-small">
                      {user?.userImage ? (
                        <img src={user?.userImage} alt="profile" />
                      ) : (
                        <span 
                          className="avatarFallback"
                          style={{ backgroundColor: stringToColor(initials) }}
                        >
                          {initials}
                        </span>
                      )}
                    </div>
                    <div className="user-details">
                      <p className="user-name">{user?.firstName} {user?.lastName}</p>
                      <p className="user-email">@{user?.displayName}</p>
                    </div>
                  </div>
                  <div className="mobile-divider"></div>
                </>
              )}

              <Link 
                to="/about" 
                className="mobile-nav-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                <InfoIcon />
                <span>About</span>
              </Link>

              <Link 
                to="/dashboard" 
                className="mobile-nav-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                <DashboardIcon />
                <span>Dashboard</span>
              </Link>

              <div className="mobile-nav-item">
                <MessageButton />
              </div>

              <div className="mobile-nav-item">
                <NotificationBell />
              </div>

              <div className="mobile-divider"></div>

              <button 
                className="mobile-nav-item"
                onClick={handleClick}
              >
                <span>Sign Out</span>
              </button>

              <button 
                className="mobile-nav-item danger"
                onClick={deleteAccount}
              >
                <span>Delete Account</span>
              </button>
            </nav>
          </div>
        )}
      </div>
      <ProgressiveBar />
    </>
  );
};

export default Header;