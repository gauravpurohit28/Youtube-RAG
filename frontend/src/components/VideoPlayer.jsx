import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";

const VideoPlayer = forwardRef(({ videoId, loading, Loader }, ref) => {
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
    <div className="w-full max-w-2xl aspect-video bg-black rounded-lg flex items-center justify-center">
      {loading ? <Loader /> : <div ref={containerRef} style={{ width: "100%", height: "100%" }} />}
    </div>
  );
});

export default VideoPlayer;
