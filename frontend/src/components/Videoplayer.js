import React, { useState, useRef } from "react";
import "../style/user.css";

const VideoPlayer = ({ src }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);
  const isPausedOnLeave = useRef(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isPausedOnLeave.current) {
      videoRef.current.currentTime = videoRef.current.duration - 0.1; // Set just before the end to avoid restart
    }
    videoRef.current.play().catch((error) => {
      console.error("Error trying to play the video: ", error);
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!videoRef.current.paused) {
      isPausedOnLeave.current = false;
      videoRef.current.pause();
    } else {
      isPausedOnLeave.current = true;
    }
  };

  const handleVideoEnd = () => {
    videoRef.current.currentTime = 0;
    if (isHovered) {
      videoRef.current.play().catch((error) => {
        console.error("Error trying to play the video: ", error);
      });
    } else {
      isPausedOnLeave.current = true;
    }
  };

  return (
    <div
      className="video-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video ref={videoRef} src={src} muted onEnded={handleVideoEnd} />
    </div>
  );
};

export default VideoPlayer;
