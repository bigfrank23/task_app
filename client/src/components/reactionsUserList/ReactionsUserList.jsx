import Avatar from "../avatar/Avatar";
import FollowButton from "../social/FollowButton";
import useOnlineUsersStore from "../../utils/onlineUsersStore";
import './reactionsUserList.css'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const reactionIcons = {
  like: <ThumbUpIcon sx={{ color: '#2563eb', fontSize: 16 }} />,
  love: <FavoriteIcon sx={{ color: '#e11d48', fontSize: 16 }} />,
  celebrate: <HandshakeIcon sx={{ color: '#16a34a', fontSize: 16 }} />,
  dislike: <ThumbDownIcon sx={{ color: '#6b7280', fontSize: 16 }} />,
};

const flattenReactions = (reactions = {}) =>
  Object.entries(reactions).flatMap(([type, users]) =>
    users?.map(user => ({
      ...user,
      reactionType: type,
    })) || []
  );



export default function ReactionsUserList({ reactions }) {
    const { onlineUsers } = useOnlineUsersStore();
    const users = flattenReactions(reactions);
    console.log(users);

  if (!users.length) {
    return <p className="noMetaText">No reactions yet</p>;
  }

  return (
    <div className="reactUserList">
      {users.map((user) => (
        <div key={`${user._id}-${user.reactionType}`} className="reactUserRow">
             {/* Reaction icon */}
          <div className="reactionIcon">
            {reactionIcons[user.reactionType]}
          </div>
          <Avatar
            image={user.userImage}
            name={user.displayName}
            isOnline={onlineUsers[user._id]}
          />

          <div className="reactUserInfo">
            <h4>{user.displayName}</h4>
            {user.jobTitle && <p className="jobTitle">{user.jobTitle}</p>}
            {user.bio && <p className="bio">{user.bio}</p>}
          </div>

          <FollowButton
            userId={user._id}
            displayName={user.displayName}
            variant="secondary"
          />
        </div>
      ))}
    </div>
  );
}
