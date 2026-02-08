import "./header.css";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LogoDevIcon from "@mui/icons-material/LogoDev";
import ProgressiveBar from "../progressiveBar/ProgressivBar";
import SettingsIcon from "@mui/icons-material/Settings";
import apiRequest from "../../utils/apiRequest";
import { useNotification } from "../../utils/useNotification";
import useAuthStore from "../../utils/authStore";
import { useNavigate } from "react-router-dom";
import { stringToColor } from "../../utils/stringColor";
import useTaskUIStore from "../../utils/taskUIStore";
import MessageButton from "../messages/MessageButton";
import NotificationBell from "../notifications/NotificationBell";
import DashboardIcon from '@mui/icons-material/Dashboard';

const Header = () => {
  const [query, setQuery] = useState("");
   const setSearchQuery = useTaskUIStore((state) => state.setSearchQuery);
  const [dropDown, setDropDown] = useState(false);
  const { showSuccess, showError } = useNotification();
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const initials = `${user?.firstName?.charAt(0) ?? ""}${
    user?.lastName?.charAt(0) ?? ""
  }`.toUpperCase()

  const handleChange = (e) => setQuery(e.target.value);
  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     // replace with real search action
  //     console.log("Search for:", query);
  //   }
  // };

   const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // ✅ Update global search state
      setSearchQuery(query);
      console.log("🔍 Searching for:", query);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setSearchQuery("");
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
      navigate("/signin");
    } catch (error) {
      console.log(error);
      showError(error?.response?.data?.message || "Something went wrong");
      showError(error.message);
    }
  };

  return (
    <>
      <div className="header" id="header">
        <div className="headerLeft">
          <a href="/" className="homeLink">
              <HomeIcon className="icon" />
              <p>Home</p>
            </a>
          <div className="search">
            <SearchIcon className="searchIcon" />
            <input
              type="search"
              name="searchInput"
              placeholder="Search tasks, people, dates..."
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              aria-label="Search"
              className="searchInput"
            />
          </div>
        </div>
        <div className="headerRight">
          <div className="headerRightItem">
            <a href="/dashboard" className="dashboardLink">
              <DashboardIcon className="icon" />
              <p>Dashboard</p>
            </a>
          </div>
          <div  style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <MessageButton />
            <NotificationBell />
            {/* Your existing user menu */}
          </div>

          {/* PROFILE */}
          <div className="headerRightItem profileItem">
            {/* Avatar */}
            <div className="avatar" onClick={toggleDropDown}>
              {user?.userImage ? (
                <img src={user?.userImage} alt="user_profile_img" 
                onError={(e)=> {e.target.src = '/general/images/user.png'; e.target.alt = 'Image fail to load'}}
                loading="lazy"
                />
              ) : (
                <span className="avatarFallback"
                style={{ backgroundColor: stringToColor(initials) }}>
                  {initials}
                </span>
              )}
            </div>

            {/* Label */}
            <div className="profileLabel">
              <p>Me</p>
              <ArrowDropDownIcon />
            </div>

            {/* Dropdown */}
            {dropDown && (
              <ul className="hrDropDown">
                <li id="settings">
                  <SettingsIcon />
                  <p>Settings</p>
                </li>
                <li onClick={handleClick}>
                  <p>Sign out</p>
                </li>
                <li className="danger">
                  <p>Delete Account</p>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <ProgressiveBar />
    </>
  );
};

export default Header;
