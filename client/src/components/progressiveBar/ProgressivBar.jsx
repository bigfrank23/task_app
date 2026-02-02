import React, { useState, useEffect, useCallback } from 'react';
import './progressiveBar.css'; 

const ProgressiveBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  const calculateScrollDistance = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const totalHeight = scrollHeight - clientHeight;
    // Calculate the percentage scrolled
    const progress = (scrollTop / totalHeight) * 100;
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    // Add event listener for scroll event
    window.addEventListener('scroll', calculateScrollDistance);

    // Clean up: remove event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', calculateScrollDistance);
    };
  }, [calculateScrollDistance]);

  return (
    <div className="progress-container" id='progressBox'>
      {/* The progress bar whose width changes with scroll position */}
      <div
        className="progress-bar"
        style={{ width: `${scrollProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressiveBar;
