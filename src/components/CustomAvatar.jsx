import { useEffect, useState } from "react";
import YogiVemana from "../assets/yogi_vemana.png";

const CustomAvatar = ({ isSpeaking, sessionActive }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(isSpeaking);
  }, [isSpeaking]);

  useEffect(() => {
    // Ensure audio element is properly configured when session starts
    if (sessionActive) {
      const checkAudio = setInterval(() => {
        const audioPlayer = document.getElementById("audioPlayer");
        if (audioPlayer) {
          audioPlayer.volume = 1.0;
          audioPlayer.muted = false;
          console.log("Audio player found and configured:", {
            volume: audioPlayer.volume,
            muted: audioPlayer.muted,
            paused: audioPlayer.paused,
            srcObject: audioPlayer.srcObject,
          });
          clearInterval(checkAudio);
        }
      }, 500);

      return () => clearInterval(checkAudio);
    }
  }, [sessionActive]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Custom Avatar Image */}
      <div className="relative">
        <img
          src={YogiVemana}
          alt="Yogi Vemana"
          className={`w-full max-h-[700px] object-contain transition-all duration-300 ${
            isAnimating ? "scale-105 brightness-110" : "scale-100"
          }`}
          style={{
            filter: isAnimating
              ? "drop-shadow(0 0 20px rgba(255, 226, 59, 0.5))"
              : "none",
          }}
        />

        {/* Speaking Indicator */}
        {/* {isSpeaking && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <div
              className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        )} */}

        {/* Session Status Indicator */}
        {!sessionActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-sm">Initializing session...</p>
            </div>
          </div>
        )}
      </div>

      {/* CRITICAL: These elements must exist in the DOM for Azure Avatar SDK */}
      <div
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        {/* Remote video container - Azure SDK will inject video element here */}
        <div id="remoteVideo" style={{ width: "450px", height: "300px" }}></div>
      </div>
    </div>
  );
};

export default CustomAvatar;
