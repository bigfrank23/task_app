import "./popup.css";
import CloseIcon from '@mui/icons-material/Close';

const Popup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
      <div
        className="popup-container"
        // onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-close" onClick={onClose}>
          <CloseIcon style={{fontSize: "13px"}}/>
        </div>

        {title && <h2 className="popup-title">{title}</h2>}

        <div className="popup-content">
          {children}
        </div>
      </div>
  );
};

export default Popup;
