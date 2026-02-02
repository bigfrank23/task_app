import React, { useState, useRef, useLayoutEffect } from 'react';
import './readMoreText.css';

const ReadMoreText = ({ children, limit, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const ref = useRef(null);

  // Check if content is actually truncated on mount and window resize
  useLayoutEffect(() => {
    if (ref.current) {
      const element = ref.current;
      const isClamped = element.scrollHeight > element.clientHeight;
      setIsTruncated(isClamped);
    }
  }, [children, limit]); // Re-run if the text content or limit changes

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div>
      <div
        ref={ref}
        // Apply 'truncate-text' class only if not expanded, plus any additional classes
        className={`${!isExpanded ? 'truncate-text' : ''} ${className}`.trim()}
        style={{ '--limit': limit }} // Pass the line limit as a CSS variable
      >
        {children}
      </div>
      {/* Show button only if text is actually truncated */}
      {isTruncated && (
        <button onClick={toggleExpanded} className="read-more-button">
          {isExpanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

export default ReadMoreText;
