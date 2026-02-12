export const CalendarIcon = ({ size = 20, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    // xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke={color}
      strokeWidth="2"
    />
    <line
      x1="16"
      y1="2"
      x2="16"
      y2="6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="2"
      x2="8"
      y2="6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2" />
  </svg>
);

// Icon Components
export const AddIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export const EditIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const DeleteIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export const DeleteIcon2 = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

export const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const FilterListIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 5h18" />
    <path d="M6 12h12" />
    <path d="M10 19h4" />
  </svg>
);

export const ClearIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

export const NewMessageIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
    <path d="M2 6l10 7 10-7" />
    <line x1="18" y1="2" x2="18" y2="6" />
    <line x1="16" y1="4" x2="20" y2="4" />
  </svg>
);

export const NewFollowerIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="9" cy="8" r="4" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />

    <line x1="18" y1="8" x2="18" y2="14" />
    <line x1="15" y1="11" x2="21" y2="11" />
  </svg>
);

export const ClockIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="9" />

    <line x1="12" y1="12" x2="12" y2="7" />
    <line x1="12" y1="12" x2="16" y2="12" />
  </svg>
);

export const NotificationBellIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />

    <path d="M13.73 21a2 2 0 0 1-3.46 0" />

    <circle cx="18" cy="6" r="3" fill="red" stroke="none" />
  </svg>
);

export const NotificationIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M12 2a7 7 0 0 0-7 7c0 6-3 8-3 8h20s-3-2-3-8a7 7 0 0 0-7-7zm0 18a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z" />
  </svg>
);

export const NotificationOulineIcon = ({
  size = 24,
  // color = "currentColor",
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />

    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export const CheckMarkIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    className={className}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
);

export const AttachmentIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21.44 11.05l-8.49 8.49a5 5 0 01-7.07-7.07l9.9-9.9a3.5 3.5 0 014.95 4.95l-9.9 9.9a2 2 0 01-2.83-2.83l8.49-8.48" />
  </svg>
);

export const ImageErrorSVG = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="#9ca3af">
    <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14l4-4 3 3 5-5 6 6z" />
  </svg>
);

export const FileSVG = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="#6b7280">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
  </svg>
);

export const VideoSVG = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const LikeSVG = ({size = 24,
  color = "currentColor",
  className = "",}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={color}
  >
    <path d="M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13 1 6.59 7.41C6.22 7.78 6 8.3 6 8.83V19c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
  </svg>
);

export const LikedSVG = ({size = 24,
  color = "currentColor",
  className = "",}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={color}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const DislikeSVG = ({size = 24,
  color = "currentColor",
  className = "",}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={color}
  >
    <path
      d="M22 3h-4v12h4V3zM2 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32
           c0 .41.17.79.44 1.06L11 23l6.41-6.41
           c.37-.37.59-.89.59-1.42V5c0-1.1-.9-2-2-2H7
           c-.83 0-1.54.5-1.84 1.22L2.14 11.27
           c-.09.23-.14.47-.14.73v2z"
    />
  </svg>
);

export const ReactIcon = ({ size = 120, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 841.9 595.3" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" stroke="#61DAFB" stroke-width="40">
    <ellipse rx="200" ry="80" cx="420.9" cy="296.5"/>
    <ellipse rx="200" ry="80" cx="420.9" cy="296.5" transform="rotate(60 420.9 296.5)"/>
    <ellipse rx="200" ry="80" cx="420.9" cy="296.5" transform="rotate(120 420.9 296.5)"/>
  </g>
  <circle cx="420.9" cy="296.5" r="45" fill="#61DAFB"/>
</svg>
);

export const NodeIcon = ({ size = 120, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 256 288" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M128 0L256 74v140l-128 74L0 214V74z"
    fill="#539E43"
  />
  <text x="128" y="170" text-anchor="middle" font-size="80" fill="white" font-family="Arial, Helvetica, sans-serif">
    JS
  </text>
</svg>
);

export const MongoDBIcon = ({ size = 120, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 256 549" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M128 0C94 60 60 120 60 200c0 120 68 200 68 200s68-80 68-200C196 120 162 60 128 0z"
    fill="#4DB33D"
  />
  <path
    d="M128 60v420"
    stroke="#2F7C31"
    strokeWidth="10"
  />
</svg>
);

export const SocketIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <circle cx="256" cy="256" r="240" fill="black"/>
  <path
    d="M160 256h120l-40-40 40 40-40 40"
    fill="none"
    stroke="white"
    strokeWidth="20"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <circle cx="360" cy="256" r="18" fill="white"/>
</svg>
);

export const TaskFlowIcon = ({ size = 24, className = "" }) => (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={size} height={size} fill="currentColor" className={className}>
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#667eea" stopOpacity="1"/>
      <stop offset="100%" stopColor="#764ba2" stopOpacity="1"/>
    </linearGradient>
  </defs>

  <circle cx="50" cy="50" r="45" fill="url(#grad)"/>

  <path
    d="M 30 50 L 43 63 L 70 36"
    stroke="white"
    strokeWidth="8"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>

);
