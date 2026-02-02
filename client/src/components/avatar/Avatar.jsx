import { stringToColor } from "../../utils/stringColor";

const Avatar = ({ image, name, isOnline, size = 36 }) => {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0
      }}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
          onError={(e)=> {e.target.src = '/general/images/user.png'; e.target.alt = 'Image fail to load'}}
          loading="lazy"
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: stringToColor(name ?? initials),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size / 2.2,
            fontWeight: 600,
            color: '#ffffff'
          }}
        >
          {initials}
        </div>
      )}

      <span
        style={{
          position: 'absolute',
          top: -1,
          right: -1,
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: '50%',
          backgroundColor: isOnline ? '#10b981' : '#9ca3af',
          border: '2px solid white'
        }}
      />
    </div>
  );
};


export default Avatar