// import React, {
//   useState,
//   useRef,
//   useEffect,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import "../style/user.css";

// const VideoPlayer = forwardRef(({ src, style, startTime }, ref) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const videoRef = useRef(null);
//   const isPausedOnLeave = useRef(false);

//   useImperativeHandle(ref, () => ({
//     play: () => videoRef.current.play(),
//     pause: () => videoRef.current.pause(),
//     isPaused: () => videoRef.current.paused,
//   }));

//   useEffect(() => {
//     const setInitialTime = () => {
//       if (videoRef.current && startTime != null) {
//         videoRef.current.currentTime = startTime;
//       }
//     };

//     videoRef.current.addEventListener("loadedmetadata", setInitialTime);

//     return () => {
//       if (videoRef.current) {
//         videoRef.current.removeEventListener("loadedmetadata", setInitialTime);
//       }
//     };
//   }, [startTime]);

//   const handleMouseEnter = () => {
//     setIsHovered(true);
//     if (isPausedOnLeave.current) {
//       videoRef.current.currentTime = videoRef.current.duration - 0.1; // Set just before the end to avoid restart
//     }
//     videoRef.current.play().catch((error) => {
//       console.error("Error trying to play the video: ", error);
//     });
//   };

//   const handleMouseLeave = () => {
//     setIsHovered(false);
//     if (!videoRef.current.paused) {
//       isPausedOnLeave.current = false;
//       videoRef.current.pause();
//     } else {
//       isPausedOnLeave.current = true;
//     }
//   };

//   const handleVideoEnd = () => {
//     videoRef.current.currentTime = 0;
//     if (isHovered) {
//       videoRef.current.play().catch((error) => {
//         console.error("Error trying to play the video: ", error);
//       });
//     } else {
//       isPausedOnLeave.current = true;
//     }
//   };

//   return (
//     <div
//       className="video-container"
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       <video
//         ref={videoRef}
//         src={src}
//         style={style}
//         muted
//         onEnded={handleVideoEnd}
//         playsInline
//         preload="auto"
//       />
//     </div>
//   );
// });

// export default VideoPlayer;

import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import "../style/user.css";

const isIPhoneSafari = () => {
  return (
    /iP(ad|hone|od)/.test(navigator.platform) &&
    /Safari/i.test(navigator.userAgent) &&
    !/CriOS/i.test(navigator.userAgent)
  );
};

const VideoPlayer = forwardRef(({ src, style, startTime }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);
  const isPausedOnLeave = useRef(false);
  const isSafariOnIPhone = isIPhoneSafari(); // Check if the user is on iPhone Safari

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause(),
    isPaused: () => videoRef.current.paused,
  }));

  useEffect(() => {
    const setInitialTime = () => {
      if (videoRef.current && startTime != null) {
        videoRef.current.currentTime = startTime;
      }
    };

    videoRef.current.addEventListener("loadedmetadata", setInitialTime);

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadedmetadata", setInitialTime);
      }
    };
  }, [startTime]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isPausedOnLeave.current) {
      videoRef.current.currentTime = videoRef.current.duration - 0.1;
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
      <video
        ref={videoRef}
        src={src}
        style={style}
        muted
        onEnded={handleVideoEnd}
        playsInline
        preload="auto"
        poster={isSafariOnIPhone ? "./images/games-img.png" : undefined} // Conditionally apply the poster
      />
    </div>
  );
});

export default VideoPlayer;
