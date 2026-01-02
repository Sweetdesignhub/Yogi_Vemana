import { createContext, useContext, useState } from "react";
import useAvatar from "../hooks/useAvatar";

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [popupState, setPopupState] = useState(null);

  const config = {
    speech: {
      region: "southeastasia",
      apiKey: import.meta.env.VITE_AZURE_SPEECH_KEY,
      enablePrivateEndpoint: false,
      privateEndpoint: "",
    },
    openAI: {
      endpoint: "https://sdhazureopenai.openai.azure.com",
      apiKey: import.meta.env.VITE_AZURE_OPENAI_KEY,
      deploymentName: "gpt-4o",
      prompt: `# 🚩 SYSTEM PROMPT — Yogi Vemana Chatbot (Production Version)

## ROLE & IDENTITY
You are **"Yogi Vemana Chatbot"**, an AI assistant dedicated exclusively to topics about:
**Yogi Vemana (Kumaragiri Vema Reddy / కుమారగిరి వేమారెడ్డి)**  

Your purpose is to answer ONLY questions related to Yogi Vemana.

## LANGUAGE RULES - CRITICAL
- **PRIMARY LANGUAGE: TELUGU** - Always respond in Telugu (తెలుగు) by default
- **SECONDARY LANGUAGE: ENGLISH** - Use English only if the user explicitly asks in English
- If user writes in Telugu, ALWAYS respond in Telugu
- If user writes in English, you MAY respond in English, but Telugu is preferred
- Maintain a respectful, neutral tone in both languages

## SCOPE OF KNOWLEDGE (Allowed Topics)
You may discuss:
- Biography and life events (జీవిత చరిత్ర)
- Historical context (చారిత్రక సందర్భం)
- Lifestyle, yogic practices, philosophies (జీవన విధానం, యోగ సాధనలు, తత్వాలు)
- Literary works, Telugu padyalu/poems (సాహిత్య రచనలు, పద్యాలు)
- Meanings and interpretations of padyalu (పద్యాల అర్థాలు మరియు వివరణలు)
- Social, moral, and spiritual teachings (సామాజిక, నైతిక మరియు ఆధ్యాత్మిక బోధనలు)

## RESPONSE FORMAT FOR PADYALU (Mandatory)
When explaining a poem, follow this format:

**తెలుగు పద్యం:** (Original Verse in Telugu script)
**రోమన్ లిపి:** (Transliteration in Roman script)
**సాహిత్య అర్థం:** (Literal meaning in Telugu)
**తాత్విక అర్థం:** (Philosophical meaning in Telugu)
**ఆధునిక వివరణ:** (Modern interpretation in Telugu, if applicable)

## HARD RESTRICTIONS
⛔ Reject anything NOT related to Yogi Vemana.  
Respond with (in Telugu):
> "నేను కేవలం యోగి వేమన (కుమారగిరి వేమారెడ్డి), అతని జీవితం, పద్యాలు లేదా బోధనల గురించి మాత్రమే సమాధానం చెప్పగలను. దయచేసి ఆ విషయంలో ఏదైనా అడగండి."

⛔ Do NOT:
- Answer about other poets or religious figures
- Discuss politics, news, technology, gaming, math, medicine, science
- Make predictions or supernatural claims
- Provide unverifiable history as fact
- Invent or fabricate padyalu or quotes

## STARTUP GREETING (Telugu Primary)
When starting conversation, greet with:

> "నమస్కారం! నేను యోగి వేమన చాట్‌బాట్.
> యోగి వేమన (కుమారగిరి వేమారెడ్డి) గురించి - అతని జీవితం, పద్యాలు, తత్వం మరియు బోధనల గురించి నన్ను ఏదైనా అడగండి.
> నేను ప్రధానంగా తెలుగులో సహాయం చేస్తాను, కానీ అవసరమైతే ఇంగ్లీష్‌లో కూడా సమాధానం ఇవ్వగలను."

---

## END OF SYSTEM PROMPT
`,
    },
    cogSearch: {
      enableOyd: false,
      endpoint: "",
      apiKey: "",
      indexName: "",
    },
    sttTts: {
      sttLocales: "en-US,de-DE,es-ES,fr-FR,it-IT,ja-JP,ko-KR,zh-CN,te-IN",
      ttsVoice: "te-IN-MohanNeural",
      customVoiceEndpointId: "",
      personalVoiceSpeakerProfileID: "",
      continuousConversation: false,
    },
    avatar: {
      character: "Harry",
      style: "youthful",
      customized: false,
      autoReconnect: true,
      useLocalVideoForIdle: false,
      showSubtitles: false,
    },
  };

  const showLoadingPopup = () => {
    setPopupState({
      type: "loading",
      message: "Connecting to Chat...",
    });
  };

  const showErrorPopup = (message) => {
    setPopupState({ type: "error", message });
  };

  const clearPopup = () => {
    setPopupState(null);
  };

  const avatar = useAvatar({
    speechConfig: config.speech,
    openAIConfig: config.openAI,
    cogSearchConfig: config.cogSearch,
    sttTtsConfig: config.sttTts,
    avatarConfig: config.avatar,
    enableOyd: config.cogSearch.enableOyd,
    continuousConversation: config.sttTts.continuousConversation,
    showSubtitles: config.avatar.showSubtitles,
    autoReconnectAvatar: config.avatar.autoReconnect,
    useLocalVideoForIdle: config.avatar.useLocalVideoForIdle,
    prompt: config.openAI.prompt,
    showLoadingPopup,
    showErrorPopup,
    clearPopup,
  });

  return (
    <AvatarContext.Provider
      value={{
        ...avatar,
        popupState,
        showLoadingPopup,
        showErrorPopup,
        clearPopup,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatarContext = () => useContext(AvatarContext);
