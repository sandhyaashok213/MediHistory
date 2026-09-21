import { useEffect, useRef, useState } from "react";
import "./VoiceTextarea.css";
import { useVoiceLanguage } from "./VoiceLanguageContext";

function VoiceTextarea({
  value,
  onChange,
  placeholder = "Start typing or use voice input...",
  rows = 5,
}) {
  const {
    language,
    selectedLanguage,
  } = useVoiceLanguage();

  const recognitionRef = useRef(null);
  const committedTextRef = useRef("");
  const onChangeRef = useRef(onChange);

  const [supported, setSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    setSupported(true);

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
      committedTextRef.current = value || "";
    };

    recognition.onresult = (event) => {
      let interimText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          const existing =
            committedTextRef.current.trim();

          const newText = transcript.trim();

          if (existing && newText) {
            committedTextRef.current =
              existing + " " + newText;
          } else if (newText) {
            committedTextRef.current = newText;
          }
        } else {
          interimText += transcript;
        }
      }

      const finalText =
        committedTextRef.current.trim();

      const temporaryText = interimText.trim();

      if (temporaryText) {
        onChangeRef.current(
          finalText
            ? finalText + " " + temporaryText
            : temporaryText
        );
      } else {
        onChangeRef.current(finalText);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);

      if (event.error === "not-allowed") {
        setError(
          "Microphone permission was denied. Please allow microphone access."
        );
      } else if (
        event.error === "language-not-supported"
      ) {
        setError(
          selectedLanguage.label +
            " voice recognition is not supported by this browser."
        );
      } else if (event.error === "no-speech") {
        setError(
          "No speech detected. Please speak clearly and try again."
        );
      } else if (event.error === "audio-capture") {
        setError(
          "No microphone was detected on this device."
        );
      } else {
        setError(
          "Voice recognition failed. Please try again."
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);

      onChangeRef.current(
        committedTextRef.current.trim()
      );
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (error) {
      }

      recognitionRef.current = null;
      setIsListening(false);
    };
  }, [language]);

  const startListening = () => {
    if (!supported) {
      setError(
        "Voice recognition is not supported in this browser."
      );
      return;
    }

    if (!recognitionRef.current) {
      setError(
        "Voice recognition is unavailable."
      );
      return;
    }

    try {
      setError("");
      committedTextRef.current = value || "";

      recognitionRef.current.start();
    } catch (error) {
      setError(
        "Voice recognition is already active."
      );
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) {
      return;
    }

    try {
      recognitionRef.current.stop();
    } catch (error) {
    }

    setIsListening(false);
  };

  return (
    <div className="voice-textarea-wrapper">
      <div className="voice-textarea-header">
        <span className="voice-label">
          Voice Input
        </span>

        <div className="voice-language-display">
          {selectedLanguage.nativeLabel}
        </div>

        {supported && (
          <button
            type="button"
            className={
              isListening
                ? "voice-button voice-button-stop"
                : "voice-button"
            }
            onClick={
              isListening
                ? stopListening
                : startListening
            }
          >
            {isListening
              ? "⏹ Stop"
              : "🎤 Speak"}
          </button>
        )}
      </div>

      <textarea
        className="voice-textarea"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={rows}
      />

      {isListening && (
        <div className="voice-status">
          <span className="voice-dot"></span>

          Listening in{" "}
          <strong>
            {selectedLanguage.nativeLabel}
          </strong>
          ...
        </div>
      )}

      {!supported && (
        <div className="voice-error">
          Voice recognition is not supported by this browser.
        </div>
      )}

      {error && (
        <div className="voice-error">
          {error}
        </div>
      )}
    </div>
  );
}

export default VoiceTextarea;