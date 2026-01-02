import { Routes, Route } from "react-router-dom";
import { AvatarProvider, useAvatarContext } from "./contexts/AvatarContext";
import LandingPage from "./pages/LandingPage";
import Chat from "./pages/Chat";
import Popup from "./components/Popup";

function AppContent() {
  const { popupState } = useAvatarContext();

  return (
    <>
      <Popup popupState={popupState} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AvatarProvider>
      <AppContent />
    </AvatarProvider>
  );
}

export default App;
