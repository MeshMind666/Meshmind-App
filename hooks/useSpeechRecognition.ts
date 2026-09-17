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

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
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
        onTranscriptChunk?.(finalChunk.trim(), true);
      } else if (currentInterim) {
        setInterimTranscript(currentInterim);
        onTranscriptChunk?.(currentInterim.trim(), false);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition event:", event.error);
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
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.shouldContinue = true;
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.warn("Recognition already started or error:", e);
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
    startListening,
    stopListening,
    setTranscript,
  };
}
