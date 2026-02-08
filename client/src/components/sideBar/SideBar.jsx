import './sideBar.css'
import LocationPinIcon from '@mui/icons-material/LocationPin';
import PeopleIcon from '@mui/icons-material/People';
import CircleIcon from '@mui/icons-material/Circle';
import ChatIcon from '@mui/icons-material/Chat';
import BarChartIcon from '@mui/icons-material/BarChart';
import useAuthStore from '../../utils/authStore';
import { Link } from 'react-router-dom';
import { EditIcon } from '../../utils/svgIcons';
import useOnlineUsersStore from '../../utils/onlineUsersStore';
import { useFollowers } from '../../utils/useSocialFeatures';
import { formatTime } from '../../utils/time';
import Avatar from '../avatar/Avatar';

const SideBar = ({showEditProfile, showBottomAnalytics}) => {
  const {user} = useAuthStore()
  const { onlineUsers } = useOnlineUsersStore(); // ✅ Access online users
  const { data: followersData } = useFollowers(user?._id);
  

  const followers = followersData?.followers || [];

  const initials = `${user?.firstName?.charAt(0) ?? ""}${
    user?.lastName?.charAt(0) ?? ""
  }`.toUpperCase()
  return (
    <div className='sideBar'>
      <div className="sbTop">
        {user?.coverPhoto ? (
          <img 
            src={user.coverPhoto} 
            alt="Cover" 
            className="sbCoverImg" 
            loading='lazy'
            onError={(e)=> {e.target.src = '/general/images/placeholder.jpg'; e.target.alt = 'Image fail to load'}}
          />
        ) : (
          <div
            className="sbCoverDiv"
            style={{
              backgroundImage: user?.coverImg
                ? `url(${user.coverImg})`
                : `linear-gradient(135deg, #667eea, #764ba2)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "100%",
              height: "120px",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              position: "relative",
            }}
          />
        )}
        
        <Link to={`/profile/${user?._id}`} className="sbProfile">
          {user?.userImage ? (
            <img
              src={user.userImage}
              alt="user_profile_img"
              className="sbProfileImg"
              onError={(e)=> {e.target.src = '/general/images/user.png'; e.target.alt = 'Image fail to load'}}
              loading="lazy"
            />
          ) : (
            <span className="sbAvatarFallback">
              {initials}
            </span>
          )}
        </Link>
        
        <h3 className="sbUsername">{user?.firstName} {user?.lastName}</h3>
        <p className="sbUserTitle">{user?.jobTitle}</p>
        <p className="sbUserBio">{user?.bio}</p>
        {user?.location && (
          <div className="sbLocation">
            <LocationPinIcon className='sbLocationIcon'/>
            <span>{user?.location}</span>
          </div>
        )}
        
        {showEditProfile && (
          <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
            <Link to="/profile/edit">
              <button className="editButton">
                <span className="editText">Edit Profile</span>
                <EditIcon className="editIcon" />
              </button>
            </Link>
          </div>
        )}
      </div>
      {followers.length > 0 && (
      <div className="sbMiddle1">
        <div className="sbItems">
          <div className='sbItem'>
            <PeopleIcon className='sbItemIcon'/>  
            <h4 className="sbTitle">Followers</h4>
          </div>
          <span className="sbCount">{followers.length}</span>
        </div>
        {/* ✅ Map through actual followers with online status */}
        {followers.slice(0, 4).map(follower => (
          <div key={follower._id} className="sbConnections">
            <Link to={`/profile/${follower?._id}`}>
              <Avatar image={follower?.userImage} name={follower?.displayName} isOnline={onlineUsers[follower._id]}/>
            </Link>
            <div className="sbConnection">
              <h4 className='sbConnectionName'>{follower.displayName}</h4>
              <p className="sbConnectionBio">
                {follower.jobTitle?.slice(0, 50) || ''}
              </p>
              <span>
                {onlineUsers[follower._id] ? 'online' : `offline${follower.lastSeen ? ` ${formatTime(follower.lastSeen)}` : ''}`}
              </span>
            </div>
            <ChatIcon className='sbConnectionChatIcon'/>
          </div>
        ))}
       {followers.length > 4 && (
          <div className="sbConnectionViewAll">
            <span>View All</span>
          </div>
        )}
      </div>
      )}
      {showBottomAnalytics && (
      <div className="sbBottom">
        <div className="sbBottomTittle">
          <BarChartIcon/>
          <h4>Analytics</h4>
        </div>
        <div className="sbBottomItems">
          <div className="sbBottomItem">
            <div>
              <p>Profile Viewers</p>
              <span>3</span>
            </div>
            <div className="sbBottomItemView">
              <span>View</span>
            </div>
          </div>
          <div className="sbBottomItem">
            <div>
              <p>Total Task completed</p>
              <span>3</span>
            </div>
            <div className="sbBottomItemView">
              <span>View</span>
            </div>
          </div>
          <div className="sbBottomItem">
            <div>
              <p>Total Task created</p>
              <span>29</span>
            </div>
            <div className="sbBottomItemView">
              <span>View</span>
            </div>
          </div>
          <div className="sbBottomItem">
            <div>
              <p>Total Task pending</p>
              <span>8</span>
            </div>
            <div className="sbBottomItemView">
              <span>View</span>
            </div>
          </div>
          <div className="sbBottomItem">
            <div>
              <p>Total Reaction</p>
              <span>8</span>
            </div>
            <div className="sbBottomItemView">
              <span>View</span>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}

export default SideBar