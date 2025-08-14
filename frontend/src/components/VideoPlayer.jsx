import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";

const VideoPlayer = forwardRef(({ videoId }, ref) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    seekTo: (seconds) => {
      if (playerRef.current?.seekTo) {
        playerRef.current.seekTo(seconds, true);
      }
    },
  }));

  useEffect(() => {
    if (!videoId) return;

    // Load YouTube API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    const createPlayer = () => {
      if (playerRef.current) {
        playerRef.current.loadVideoById(videoId);
      } else if (window.YT?.Player) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1,
            origin: window.location.origin,
          },
        });
      }
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }
  }, [videoId]);

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-[#2a2a2a] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
});

export default VideoPlayer;
