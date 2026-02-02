import "./popup.css";
import CloseIcon from '@mui/icons-material/Close';

const Popup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="popup-backdrop" onClick={onClose} />
      
      {/* Modal */}
      <div className="popup-container">
        <button className="popup-close" onClick={onClose}>
          <CloseIcon style={{ fontSize: "16px" }} />
        </button>

        {title && <h2 className="popup-title">{title}</h2>}

        <div className="popup-content">
          {children}
        </div>
      </div>
    </>
  );
};


export default Popup;
