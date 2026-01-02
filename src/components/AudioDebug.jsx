import { useEffect, useState } from "react";

const AudioDebug = () => {
  const [audioStatus, setAudioStatus] = useState({});

  useEffect(() => {
    const checkAudio = setInterval(() => {
      const audioPlayer = document.getElementById("audioPlayer");
      const remoteVideo = document.getElementById("remoteVideo");

      setAudioStatus({
        audioExists: !!audioPlayer,
        audioPlaying: audioPlayer ? !audioPlayer.paused : false,
        audioVolume: audioPlayer?.volume,
        audioMuted: audioPlayer?.muted,
        remoteVideoExists: !!remoteVideo,
        remoteVideoChildren: remoteVideo?.children.length || 0,
      });
    }, 500);

    return () => clearInterval(checkAudio);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <div className="font-bold mb-2">Audio Debug Info:</div>
      <div>
        Audio Element: {audioStatus.audioExists ? "✅ EXISTS" : "❌ MISSING"}
      </div>
      <div>Audio Playing: {audioStatus.audioPlaying ? "✅ YES" : "❌ NO"}</div>
      <div>Volume: {audioStatus.audioVolume || "N/A"}</div>
      <div>Muted: {audioStatus.audioMuted ? "❌ YES" : "✅ NO"}</div>
      <div>
        Remote Video:{" "}
        {audioStatus.remoteVideoExists ? "✅ EXISTS" : "❌ MISSING"}
      </div>
      <div>Video Children: {audioStatus.remoteVideoChildren}</div>
    </div>
  );
};

export default AudioDebug;
