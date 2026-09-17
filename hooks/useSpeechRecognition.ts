"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface SpeechRecognitionOptions {
  onTranscriptChunk?: (text: string, isFinal: boolean) => void;
  lang?: string;
}

export function useSpeechRecognition({
  onTranscriptChunk,
  lang = "vi-VN",
}: SpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSecure, setIsSecure] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const secure =
        window.isSecureContext ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      setIsSecure(secure);
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: any) => {
      let currentInterim = "";
      let finalChunk = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalChunk += text + " ";
        } else {
          currentInterim += text;
        }
      }

      if (finalChunk) {
        setTranscript((prev) => prev + finalChunk);
        setInterimTranscript("");
        // Only send to backend on final confirmed speech (not interim)
        onTranscriptChunk?.(finalChunk.trim(), true);
      } else if (currentInterim) {
        // Update UI display only — do NOT send interim to backend
        // (prevents false HUD triggers from unfinished speech)
        setInterimTranscript(currentInterim);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition event:", event.error);
      if (event.error === "not-allowed") {
        setError("Trình duyệt di động chặn Micro qua HTTP. Hãy dùng ô nhập/icon Mic bàn phím bên dưới hoặc bật HTTPS.");
      } else {
        setError(`Lỗi Micro: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      if (recognitionRef.current?.shouldContinue) {
        try {
          recognition.start();
        } catch (e) {}
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.shouldContinue = false;
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [lang, onTranscriptChunk]);

  const startListening = useCallback(() => {
    setError(null);
    // Trigger mobile OS permission prompt if available
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {});
    }

    if (!recognitionRef.current) {
      setError("Trình duyệt không hỗ trợ Web Speech API trên HTTP.");
      return;
    }

    try {
      recognitionRef.current.shouldContinue = true;
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e: any) {
      console.warn("Recognition start error:", e);
      setError("Không thể bật micro. Trình duyệt di động yêu cầu kết nối bảo mật HTTPS.");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.shouldContinue = false;
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimTranscript("");
    } catch (e) {}
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    isSecure,
    error,
    startListening,
    stopListening,
    setTranscript,
  };
}

