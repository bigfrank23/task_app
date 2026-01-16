import "./glassModal.css";

export default function GlassModal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="glassModal"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        <button className="closeBtn" onClick={onClose}>×</button>

        {children}
      </div>
    </div>
  );
}
