"use client";
import { useRef, useState } from "react";
import { PlayCircle, PauseCircle } from "lucide-react";

export default function VideoPost({ src }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
const [userInteracted, setUserInteracted] = useState(false);


  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    setUserInteracted(true);

    if (video.paused) {
      video.muted = false
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        src={src}
        className="rounded-[10px] w-full max-h-[600px] sm:max-h-[400px] object-cover cursor-pointer"
        autoPlay
        muted={!userInteracted}
        loop
        playsInline
        onClick={togglePlay}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {isPlaying ? (
          <PauseCircle
            className="text-white opacity-60 hover:opacity-100 transition duration-300"
            size={50}
            onClick={togglePlay}
          />
        ) : (
          <PlayCircle
            className="text-white opacity-60 hover:opacity-100 transition duration-300"
            size={50}
            onClick={togglePlay}
          />
        )}
      </div>
    </div>
  );
}
