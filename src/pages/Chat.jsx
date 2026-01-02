import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Bookmark, Search, ArrowRight } from "lucide-react";
import {
  MdHomeFilled,
  MdMenuBook,
  MdOutlineOfflinePin,
  MdAdsClick,
  MdGTranslate,
  MdAttachFile,
  MdMicNone,
} from "react-icons/md";
import { FiBook } from "react-icons/fi";
import { PiBookBookmarkLight } from "react-icons/pi";
import { FaBookAtlas } from "react-icons/fa6";
import TodaysLearning from "../assets/todays_learning.png";
import { TbFileSearch } from "react-icons/tb";
import EgoPride from "../assets/ego-pride.jpg";
import WealthDesire from "../assets/wealth-desire.jpg";
import RitualReality from "../assets/ritual-reality.jpg";
import LifeDeath from "../assets/life-death.jpg";
import SimpleLiving from "../assets/simple-living.jpg";
import TruthLies from "../assets/truth-lies.jpg";
import Poem from "../assets/poem.png";
import YogiVemana from "../assets/yogi_vemana.png";
import { PiSealQuestionLight } from "react-icons/pi";
import { IoReloadCircleOutline } from "react-icons/io5";
import { LiaFileDownloadSolid } from "react-icons/lia";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PiSpeakerSimpleHighBold, PiSpeakerSlashBold } from "react-icons/pi";
import ChatBg from "../assets/chat_bg.png";
import BgVideo from "../assets/bg_video.mp4";

export default function Chat() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState(null);
  const [detectedLanguage, setDetectedLanguage] = useState(null);

  const navigate = useNavigate();

  const VOICE_MAP = {
    "te-IN": "te-IN-MohanNeural",
    "en-IN": "en-IN-MohanNeural",
  };

  // Session ID
  const sessionId = useRef(`session_${Date.now()}`);

  // Silence detection timer
  const silenceTimerRef = useRef(null);
  const SILENCE_DURATION = 1500; // 1.5 seconds of silence before auto-submit
  const hasReceivedSpeechRef = useRef(false); // Track if we've received any speech
  const currentInputRef = useRef(""); // Store current input text

  console.log("Speech Key:", process.env.VITE_AZURE_SPEECH_KEY);
  // Azure Speech Service configuration
  const SPEECH_KEY = process.env.VITE_AZURE_SPEECH_KEY;
  const SPEECH_REGION = "southeastasia";

  // Speech recognizer and synthesizer refs
  const speechRecognizerRef = useRef(null);
  const speechSynthesizerRef = useRef(null);
  const speechConfigRef = useRef(null);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    speechConfigRef.current = sdk.SpeechConfig.fromSubscription(
      SPEECH_KEY,
      SPEECH_REGION
    );

    // Enable continuous language detection
    speechConfigRef.current.setProperty(
      sdk.PropertyId.SpeechServiceConnection_LanguageIdMode,
      "Continuous"
    );

    // Default TTS voice (will be overridden dynamically)
    speechConfigRef.current.speechSynthesisVoiceName = "te-IN-MohanNeural";

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      if (speechRecognizerRef.current) {
        speechRecognizerRef.current.close();
      }
      if (speechSynthesizerRef.current) {
        speechSynthesizerRef.current.close();
      }
    };
  }, []);

  // Reset silence timer whenever speech is detected
  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    // Only set timer if we have received speech
    if (!hasReceivedSpeechRef.current) {
      return;
    }

    // Set a new timer to auto-submit after silence
    silenceTimerRef.current = setTimeout(() => {
      const currentInput = currentInputRef.current.trim();
      console.log("Silence detected. Current input:", currentInput);
      console.log("Is recording:", isRecording);

      if (currentInput && speechRecognizerRef.current) {
        console.log("Auto-submitting message...");

        // Stop recording first
        speechRecognizerRef.current.stopContinuousRecognitionAsync(
          () => {
            console.log("Recording stopped for auto-submit");
            setIsRecording(false);
            speechRecognizerRef.current.close();
            speechRecognizerRef.current = null;
            hasReceivedSpeechRef.current = false;

            // Submit the message with the captured text
            const messageToSend = currentInputRef.current.trim();
            if (messageToSend) {
              setUserInput("");
              currentInputRef.current = "";

              // Replace chat history with new user message
              setChatHistory([{ type: "user", text: messageToSend }]);
              setIsLoading(true);

              // Send to API
              fetch("https://chatbot.stockgenius.ai/chat", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userinput: messageToSend,
                  sessionid: sessionId.current,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  // Replace with user message and bot response
                  setChatHistory([
                    { type: "user", text: messageToSend },
                    { type: "bot", text: data.response },
                  ]);

                  // Bot message is always at index 1 now
                  speakText(data.response, 1);
                })
                .catch((error) => {
                  console.error("Error sending message:", error);
                  setChatHistory([
                    { type: "user", text: messageToSend },
                    {
                      type: "bot",
                      text: "Sorry, I encountered an error. Please try again.",
                    },
                  ]);
                })
                .finally(() => {
                  setIsLoading(false);
                });
            }
          },
          (err) => {
            console.error("Error stopping recognition:", err);
            setIsRecording(false);
            hasReceivedSpeechRef.current = false;
          }
        );
      }
    }, SILENCE_DURATION);
  };

  // Start Azure Speech Recognition
  const startRecording = () => {
    if (!speechConfigRef.current) {
      alert("Speech service not initialized");
      return;
    }

    try {
      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();

      // 🔹 Enable auto language detection with both English and Telugu
      const autoDetectConfig = sdk.AutoDetectSourceLanguageConfig.fromLanguages(
        ["en-US", "te-IN", "en-IN"] // Added en-IN for Indian English
      );

      speechRecognizerRef.current = sdk.SpeechRecognizer.FromConfig(
        speechConfigRef.current,
        autoDetectConfig,
        audioConfig
      );

      setIsRecording(true);
      setUserInput(""); // 🔥 Clear previous input when starting new recording
      hasReceivedSpeechRef.current = false; // Reset speech tracking
      currentInputRef.current = ""; // Reset input ref

      speechRecognizerRef.current.recognized = (s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          const autoDetectResult =
            sdk.AutoDetectSourceLanguageResult.fromResult(e.result);

          const language = autoDetectResult.language;
          const recognizedText = e.result.text;

          console.log("Detected language:", language);
          console.log("Recognized text:", recognizedText);

          // Mark that we've received speech
          hasReceivedSpeechRef.current = true;

          // 🔥 Update detected language for TTS
          setDetectedLanguage(language);

          // 🔥 Update both state and ref
          const newText = currentInputRef.current + " " + recognizedText;
          const trimmedText = newText.trim();
          currentInputRef.current = trimmedText;
          setUserInput(trimmedText);

          console.log("Updated input:", trimmedText);

          // Reset the silence timer since we just detected speech
          resetSilenceTimer();
        }
      };

      // Handle when speech starts (recognizing event)
      speechRecognizerRef.current.recognizing = (s, e) => {
        if (e.result.text) {
          // Reset timer when user is actively speaking
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
        }
      };

      // 🔹 Handle recognition errors
      speechRecognizerRef.current.canceled = (s, e) => {
        console.error("Recognition canceled:", e.reason);
        if (e.reason === sdk.CancellationReason.Error) {
          console.error("Error details:", e.errorDetails);
        }
        setIsRecording(false);
        hasReceivedSpeechRef.current = false;
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
      };

      speechRecognizerRef.current.startContinuousRecognitionAsync(
        () => {
          console.log("Recognition started successfully");
        },
        (error) => {
          console.error("Error starting recognition:", error);
          setIsRecording(false);
          hasReceivedSpeechRef.current = false;
        }
      );
    } catch (error) {
      console.error("Speech recognition error:", error);
      setIsRecording(false);
      hasReceivedSpeechRef.current = false;
    }
  };

  // Stop Azure Speech Recognition
  const stopRecording = () => {
    // Clear any pending silence timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    hasReceivedSpeechRef.current = false;
    currentInputRef.current = "";

    if (speechRecognizerRef.current) {
      speechRecognizerRef.current.stopContinuousRecognitionAsync(
        () => {
          console.log("Recognition stopped");
          setIsRecording(false);
          speechRecognizerRef.current.close();
          speechRecognizerRef.current = null;
        },
        (err) => {
          console.error("Error stopping recognition:", err);
          setIsRecording(false);
        }
      );
    }
  };

  // Azure Text-to-Speech with proper stop control
  const speakText = async (text, messageIndex) => {
    if (!speechConfigRef.current) {
      alert("Speech service not initialized");
      return;
    }

    // If already speaking this message, stop it
    if (speakingMessageIndex === messageIndex) {
      stopSpeaking();
      return;
    }

    // Stop any current speech before starting new one
    stopSpeaking();

    try {
      // Use detected language voice or default to Telugu
      const selectedVoice =
        detectedLanguage && VOICE_MAP[detectedLanguage]
          ? VOICE_MAP[detectedLanguage]
          : "te-IN-MohanNeural";

      speechConfigRef.current.speechSynthesisVoiceName = selectedVoice;

      // Create synthesizer with null audio config to get audio data
      speechSynthesizerRef.current = new sdk.SpeechSynthesizer(
        speechConfigRef.current,
        null // null audio config means we'll handle playback ourselves
      );

      setSpeakingMessageIndex(messageIndex);

      // Wrap text in SSML to slow down the speech
      const ssml = `
      <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${
        detectedLanguage || "te-IN"
      }'>
        <voice name='${selectedVoice}'>
          <prosody rate='-10%' pitch='-1st'>
            ${text}
          </prosody>
        </voice>
      </speak>
    `;

      speechSynthesizerRef.current.speakSsmlAsync(
        ssml,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            // Create audio element for playback
            const audioData = result.audioData;
            const blob = new Blob([audioData], { type: "audio/wav" });
            const url = URL.createObjectURL(blob);

            audioPlayerRef.current = new Audio(url);

            // Handle audio end
            audioPlayerRef.current.onended = () => {
              setSpeakingMessageIndex(null);
              URL.revokeObjectURL(url);
              if (speechSynthesizerRef.current) {
                speechSynthesizerRef.current.close();
                speechSynthesizerRef.current = null;
              }
            };

            // Handle audio errors
            audioPlayerRef.current.onerror = (error) => {
              console.error("Audio playback error:", error);
              setSpeakingMessageIndex(null);
              URL.revokeObjectURL(url);
              if (speechSynthesizerRef.current) {
                speechSynthesizerRef.current.close();
                speechSynthesizerRef.current = null;
              }
            };

            // Play the audio
            audioPlayerRef.current.play().catch((error) => {
              console.error("Error playing audio:", error);
              setSpeakingMessageIndex(null);
              URL.revokeObjectURL(url);
            });
          }
        },
        (error) => {
          console.error("TTS error:", error);
          setSpeakingMessageIndex(null);
          if (speechSynthesizerRef.current) {
            speechSynthesizerRef.current.close();
            speechSynthesizerRef.current = null;
          }
        }
      );
    } catch (error) {
      console.error("Speech synthesis error:", error);
      setSpeakingMessageIndex(null);
    }
  };

  // Stop Azure Speech Synthesis
  const stopSpeaking = () => {
    // Stop audio playback
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current = null;
    }

    // Close synthesizer
    if (speechSynthesizerRef.current) {
      try {
        speechSynthesizerRef.current.close();
      } catch (error) {
        console.error("Error closing synthesizer:", error);
      }
      speechSynthesizerRef.current = null;
    }

    setSpeakingMessageIndex(null);
  };

  // Send message to API
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    setUserInput("");

    // Replace chat history with new user message
    setChatHistory([{ type: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("https://chatbot.stockgenius.ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userinput: userMessage,
          sessionid: sessionId.current,
        }),
      });

      const data = await response.json();

      // Replace with user message and bot response
      setChatHistory([
        { type: "user", text: userMessage },
        { type: "bot", text: data.response },
      ]);

      // Automatically speak the response using Azure TTS
      // Bot message is always at index 1 now
      speakText(data.response, 1);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory([
        { type: "user", text: userMessage },
        {
          type: "bot",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hotTopics = [
    {
      title: "Truth & Lies",
      image: TruthLies,
      gradient: "from-orange-600/80 to-orange-800/80",
    },
    {
      title: "Ego & Pride",
      image: EgoPride,
    },
    {
      title: "Wealth & Desire",
      image: WealthDesire,
    },
    {
      title: "Rite & Reality",
      image: RitualReality,
    },
    {
      title: "Life & Death",
      image: LifeDeath,
    },
    {
      title: "Simple Living",
      image: SimpleLiving,
    },
  ];

  const peopleAsk = [
    "Why do people chase wealth endlessly?",
    "Is prayer enough without good actions?",
    "How should one live simply today?",
  ];

  const savedLearnings = [
    "A pure heart needs no disguise.",
    "Ego clouds even sharp intelligence.",
    "Ritual without compassion is empty.",
  ];

  const continueQuestions = [
    "Why does ego destroy wisdom?",
    "What did you teach about true happiness?",
    "How should one live a simple life today?",
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${ChatBg})` }}
    >
      {/* Navigation */}
      <nav className="px-6 py-2 lg:px-12 mt-6 mx-6 lg:mx-12 bg-black/70 rounded-3xl shadow-[0px_5.09px_43.24px_0px_#0000001F]">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold tracking-wide">
            Vemana Teachings
          </h1>

          <div className="hidden md:flex font-roboto items-center gap-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer text-white hover:text-yellow-200 transition"
            >
              <MdHomeFilled size={20} />
              <span>Home</span>
            </button>
            <button className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white transition">
              <MdMenuBook size={20} />
              <span>Teachings</span>
            </button>
            <button className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white transition">
              <FiBook size={20} />
              <span>Poems</span>
            </button>
            <button className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white transition">
              <PiBookBookmarkLight size={20} />
              <span>Saved</span>
            </button>
          </div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
              size={20}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#FFFFFF1F] border border-slate-600 rounded-full text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-14 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Today's Learning */}
            <div className="relative backdrop-blur-sm rounded-3xl p-6 border border-yellow-700/50 shadow-2xl bg-yellow-900/90 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${TodaysLearning})`,
                  opacity: 0.15,
                }}
              ></div>

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <FaBookAtlas size={18} className="text-white" />
                  <span className="text-white font-roboto text-sm font-medium">
                    Today's Learning
                  </span>
                </div>
                <h2 className="text-white text-2xl font-montserrat mb-4 leading-tight">
                  "Truth needs no decoration"
                </h2>
                <button className="flex items-center gap-2 justify-end w-full cursor-pointer text-[#FFFFFFBF] font-roboto hover:text-yellow-100 transition text-sm font-medium">
                  Explain this to me
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Hot Topics */}
            <div
              className="rounded-3xl p-6 backdrop-blur-sm"
              style={{
                background: "#000000",
                opacity: 0.8,
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TbFileSearch size={18} className="text-white" />
                <span className="text-white font-roboto font-medium">
                  Hot Topics
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {hotTopics.map((topic, index) => (
                  <button
                    key={index}
                    className="relative rounded-xl aspect-[4/3] cursor-pointer overflow-hidden hover:scale-105 transition shadow-lg border"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${topic.image})`,
                      }}
                    />

                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, rgba(255, 230, 7, 0.1) 0%, rgba(51, 46, 27, 0.02) 100%),
          radial-gradient(146.13% 118.42% at 50% -15.5%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%)`,
                      }}
                    />

                    <div className="relative z-10 flex items-center justify-center h-full px-2 text-white font-semibold text-sm text-center">
                      {topic.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* A Poem to Reflect On */}
            <div className="relative backdrop-blur-sm rounded-3xl p-6 border border-yellow-700/50 shadow-2xl bg-yellow-900/90 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${Poem})`,
                  opacity: 0.4,
                }}
              ></div>

              <div className="relative">
                <h2 className="text-white text-2xl font-montserrat mb-4 leading-tight">
                  A Poem to
                  <br /> Reflect On
                </h2>
                <button className="flex items-center gap-2 justify-end w-full cursor-pointer text-[#FFFFFFBF] font-roboto hover:text-yellow-100 transition text-sm font-medium">
                  Explain this to me
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Center - Main Character with Chat */}
          <div className="lg:col-span-8 flex flex-col relative">
            <div className="flex gap-4 h-full items-start">
              {/* User Questions - Left Side */}
              <div className="flex-1 rounded-3xl overflow-y-auto max-h-[43rem]">
                <div className="space-y-6">
                  {chatHistory.map((message, index) => (
                    <div key={index}>
                      {message.type === "user" && (
                        <div className="flex justify-end mb-2">
                          <div
                            className="max-w-[85%] p-4 text-white"
                            style={{
                              border: "1px solid rgba(255, 255, 255, 0.20)",
                              background:
                                "radial-gradient(146.13% 118.42% at 50% -15.5%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(180deg, rgba(0, 255, 240, 0.10) 0%, rgba(27, 51, 51, 0.02) 100%)",
                            }}
                          >
                            <p className="text-sm font-montserrat leading-relaxed">
                              {message.text}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Avatar Section - Center */}
              <div className="flex-shrink-0 w-[270px] h-[800px]">
                <img
                  src={YogiVemana}
                  alt="Yogi Vemana"
                  className="w-full h-full object-cover"
                />

                {/* Floating Question Input - Full Width */}
                <div className="absolute bottom-0 left-0 right-0 px-6">
                  <div
                    className="bg-[#050505E5] rounded-2xl p-4 flex items-start gap-3 w-full"
                    style={{
                      backdropFilter: "blur(15px)",
                      boxShadow:
                        "0px 22.5px 45px 0px #0000001A, 0px 11.25px 22.5px 0px #0000000D, 0px 3.75px 7.5px 0px #0000000D, 0px 37.5px 75px 0px #1FDFFA26 inset",
                    }}
                  >
                    <textarea
                      placeholder="Ask your question here..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 bg-transparent text-white placeholder-white focus:outline-none text-lg h-24 resize-none"
                    />

                    <button
                      onClick={sendMessage}
                      disabled={isLoading || !userInput.trim()}
                      className="bg-white rounded-full p-2 cursor-pointer"
                    >
                      <MdAdsClick size={18} className="text-[#0C55F3]" />
                    </button>

                    <button className="bg-white rounded-full p-2 cursor-pointer">
                      <MdGTranslate size={18} className="text-[#0C55F3]" />
                    </button>

                    <button className="bg-white rounded-full p-2 cursor-pointer">
                      <LiaFileDownloadSolid
                        size={18}
                        className="text-[#0C55F3]"
                      />
                    </button>

                    <button className="bg-white rounded-full p-2 cursor-pointer">
                      <MdAttachFile className="text-[#0C55F3]" />
                    </button>

                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`rounded-full p-2 cursor-pointer ${
                        isRecording ? "bg-red-500 animate-pulse" : "bg-white"
                      }`}
                      title={isRecording ? "Stop Recording" : "Start Recording"}
                    >
                      <MdMicNone
                        className={
                          isRecording ? "text-white" : "text-[#0C55F3]"
                        }
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bot Responses - Right Side */}
              <div className="flex-1 rounded-3xl overflow-y-auto max-h-[43rem]">
                <div className="space-y-6">
                  {chatHistory.map((message, index) => (
                    <div key={index}>
                      {message.type === "bot" && (
                        <div className="flex justify-start mt-30">
                          <div
                            className="max-w-[85%] p-4 font-roboto text-white"
                            style={{
                              border: "1px solid rgba(255, 255, 255, 0.20)",
                              background:
                                "radial-gradient(146.13% 118.42% at 50% -15.5%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(180deg, rgba(255, 230, 7, 0.10) 0%, rgba(51, 46, 27, 0.02) 100%)",
                            }}
                          >
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ children }) => (
                                  <p className="text-sm leading-relaxed mb-2">
                                    {children}
                                  </p>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-semibold text-yellow-300">
                                    {children}
                                  </strong>
                                ),
                              }}
                            >
                              {message.text}
                            </ReactMarkdown>

                            <button
                              onClick={() => speakText(message.text, index)}
                              className="mt-2 text-xs text-gray-200 cursor-pointer hover:text-white flex items-center gap-1"
                            >
                              {speakingMessageIndex === index ? (
                                <>
                                  <PiSpeakerSlashBold size={18} /> Stop
                                </>
                              ) : (
                                <>
                                  <PiSpeakerSimpleHighBold size={18} /> Listen
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start mt-30">
                      <div className="bg-yellow-900/80 text-white rounded-2xl p-4">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* People Often Ask */}
            <div
              className="rounded-3xl p-4"
              style={{
                background: "linear-gradient(180deg, #1A3A6C 0%, #14305B 100%)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <PiSealQuestionLight size={18} className="text-white" />
                <span className="text-white font-roboto font-medium">
                  People Often Ask
                </span>
              </div>
              <div className="space-y-3">
                {peopleAsk.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setUserInput(question)}
                    className="relative w-full text-left cursor-pointer text-white font-montserrat text-sm hover:text-white p-3 flex items-center justify-between group"
                  >
                    <span>{question}</span>
                    <ArrowRight
                      size={16}
                      className="opacity-0 group-hover:opacity-100 transition"
                    />
                    <span
                      className="absolute bottom-0 left-0 w-full h-px"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 48.08%, rgba(255, 255, 255, 0) 100%)",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Your Saved Learnings */}
            <div
              className="rounded-3xl p-6"
              style={{
                background: "linear-gradient(180deg, #1A3A6C 0%, #14305B 100%)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <MdOutlineOfflinePin size={18} className="text-white" />
                <span className="text-white font-roboto font-medium">
                  Your Saved Learnings
                </span>
              </div>
              <div className="space-y-2">
                {savedLearnings.map((learning, index) => (
                  <button
                    key={index}
                    className="relative w-full text-left text-white font-montserrat text-sm p-2 cursor-pointer flex items-center justify-between group"
                  >
                    <span>{learning}</span>
                    <ArrowRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition"
                    />
                    <span
                      className="absolute bottom-0 left-0 w-full h-px"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 48.08%, rgba(255, 255, 255, 0) 100%)",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Continue Where You Left Off */}
            <div
              className="rounded-3xl p-6"
              style={{
                background: "linear-gradient(180deg, #1A3A6C 0%, #14305B 100%)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <IoReloadCircleOutline size={18} className="text-white" />
                <span className="text-white font-roboto font-medium">
                  Continue Where You Left Off
                </span>
              </div>
              <div className="space-y-3">
                {continueQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setUserInput(question)}
                    className="relative w-full text-left text-white text-sm cursor-pointer font-montserrat p-3 flex items-center justify-between group"
                  >
                    <span>{question}</span>
                    <ArrowRight
                      size={16}
                      className="opacity-0 group-hover:opacity-100 transition"
                    />
                    <span
                      className="absolute bottom-0 left-0 w-full h-px"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 48.08%, rgba(255, 255, 255, 0) 100%)",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
