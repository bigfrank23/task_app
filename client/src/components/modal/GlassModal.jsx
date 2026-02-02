// import "./glassModal.css";

// export default function GlassModal({ open, onClose, children }) {
//   if (!open) return null;

//   return (
//     <div className="modalOverlay" onClick={onClose}>
//       <div
//         className="glassModal"
//         role="dialog"
//         aria-modal="true"
//         onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
//       >
//         <button className="closeBtn" onClick={onClose}>×</button>

//         {children}
//       </div>
//     </div>
//   );
// }
import "./modal.css";
import { useEffect, useRef } from "react";

export default function GlassModal({ open, onClose, title, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);

    // Focus trap
    const focusable = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusable?.[0];
    const lastFocusable = focusable?.[focusable.length - 1];

    firstFocusable?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="glassModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="closeBtn" 
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {title && (
          <h2 id="modal-title" className="mb-4 text-xl font-semibold">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
