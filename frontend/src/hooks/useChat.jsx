import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [userUid, setUserUid] = useState(null);
  const storageKey = useMemo(() => {
    return userUid
      ? `libraLearn.chatHistory.${userUid}`
      : "libraLearn.chatHistory.anon";
  }, [userUid]);

  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    // Load chat history for current auth user.
    // (This keeps the "Chat with Avatar" panel useful after navigating away/back.)
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      setChatHistory([]);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setChatHistory(Array.isArray(parsed) ? parsed : []);
    } catch {
      setChatHistory([]);
    }
  }, [storageKey]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUserUid(firebaseUser?.uid ?? null);
    });

    return () => unsubscribe();
  }, []);

  const chat = async (message, language = 'en', customMessage = null) => {
    setLoading(true);
    
    // If custom message is provided (from RAG), use it directly
    if (customMessage) {
      setMessage(customMessage);
      addToHistory(customMessage);
      setLoading(false);
      return;
    }
    
    // Otherwise, use regular chat API
    try {
      const data = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, language }),
      });

      const raw = await data.text();
      let parsed;
      try {
        parsed = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          "Chat service returned non-JSON. Check backend server and VITE_API_URL."
        );
      }

      if (!data.ok) {
        throw new Error(parsed?.message || "Chat request failed.");
      }

      const resp = parsed?.messages || [];

      // Persist a simple Q/A history for later viewing.
      // Backend returns only avatar messages (not the user query), so we attach the query here.
      const answers = Array.isArray(resp)
        ? resp.map((m) => ({ text: m?.text ?? "" })).filter((a) => a.text)
        : [];

      setChatHistory((prev) => {
        const next = [
          ...prev,
          {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            query: message,
            answers,
            createdAt: Date.now(),
          },
        ];

        localStorage.setItem(storageKey, JSON.stringify(next.slice(-50))); // keep last 50 entries
        return next.slice(-50);
      });

      setMessages((messages) => [...messages, ...resp]);
    } finally {
      setLoading(false);
    }
  };
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [currentAudio, setCurrentAudio] = useState(null);
  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        currentAudio,
        setCurrentAudio,
        chatHistory,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
