import { useState, useEffect, useRef, useCallback } from 'react';

// SpeechRecognition constructor reference (cross-browser safe)
const getSpeechRecognitionConstructor = () => {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export const useSpeechRecognition = ({ onFinalTranscript, language = 'en' } = {}) => {
  const [isSupported] = useState(() => {
    return Boolean(getSpeechRecognitionConstructor());
  });
  const [status, setStatus] = useState(() => {
    return getSpeechRecognitionConstructor() ? 'idle' : 'unsupported';
  });
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [errorCode, setErrorCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const recognitionRef = useRef(null);
  const isStoppingExplicitlyRef = useRef(false);
  const onFinalCallbackRef = useRef(onFinalTranscript);

  useEffect(() => {
    onFinalCallbackRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          isStoppingExplicitlyRef.current = true;
          recognitionRef.current.abort();
        } catch (e) {
          // ignore cleanup errors
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const clearError = useCallback(() => {
    setErrorCode(null);
    setErrorMessage('');
    if (status === 'error' || status === 'permission-denied') {
      setStatus('idle');
    }
  }, [status]);

  const resetTranscript = useCallback(() => {
    setInterimTranscript('');
    setFinalTranscript('');
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) {
      setStatus('idle');
      return;
    }

    try {
      isStoppingExplicitlyRef.current = true;
      setStatus('processing');
      recognitionRef.current.stop();
    } catch (err) {
      console.warn('[useSpeechRecognition] Error stopping recognition:', err);
      setStatus('idle');
    }
  }, []);

  const cancelListening = useCallback(() => {
    if (!recognitionRef.current) {
      setStatus('idle');
      setInterimTranscript('');
      return;
    }

    try {
      isStoppingExplicitlyRef.current = true;
      recognitionRef.current.abort();
    } catch (err) {
      // ignore
    }
    setInterimTranscript('');
    setStatus('idle');
  }, []);

  const startListening = useCallback((customLang) => {
    const SpeechRecognitionClass = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionClass) {
      setStatus('unsupported');
      setErrorMessage(
        language === 'te'
          ? 'మీ బ్రౌజర్‌లో స్పీచ్ రికగ్నిషన్ సపోర్ట్ లేదు. దయచేసి గూగుల్ క్రోమ్ బ్రౌజర్ ఉపయోగించండి లేదా టైప్ చేయండి.'
          : 'Speech recognition is not supported in this browser. Please use Chrome/Edge or type your question.'
      );
      return;
    }

    // Stop existing session if active to prevent multiple instances
    if (recognitionRef.current) {
      try {
        isStoppingExplicitlyRef.current = true;
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }

    clearError();
    setInterimTranscript('');
    isStoppingExplicitlyRef.current = false;

    try {
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;

      recognition.continuous = false; // Capture discrete sentence
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Locale mapping
      const activeLang = customLang || language;
      if (activeLang === 'te') {
        recognition.lang = 'te-IN'; // Telugu (India)
      } else {
        // Prefer Indian English (en-IN), fallback is handled by browser
        recognition.lang = 'en-IN';
      }

      recognition.onstart = () => {
        setStatus('listening');
        setErrorCode(null);
        setErrorMessage('');
      };

      recognition.onresult = (event) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0]?.transcript || '';

          if (result.isFinal) {
            finalText += transcript;
          } else {
            interimText += transcript;
          }
        }

        if (interimText) {
          setInterimTranscript(interimText);
        }

        if (finalText) {
          setFinalTranscript(finalText);
          setInterimTranscript('');
          if (onFinalCallbackRef.current) {
            onFinalCallbackRef.current(finalText);
          }
        }
      };

      recognition.onerror = (event) => {
        const error = event.error;
        setErrorCode(error);

        if (isStoppingExplicitlyRef.current && (error === 'aborted' || error === 'no-speech')) {
          setStatus('idle');
          return;
        }

        switch (error) {
          case 'not-allowed':
          case 'permission-denied':
            setStatus('permission-denied');
            setErrorMessage(
              activeLang === 'te'
                ? 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి మీ బ్రౌజర్ సెట్టింగ్స్‌లో మైక్రోఫోన్ అనుమతించండి.'
                : 'Microphone permission denied. Please allow microphone access in your browser address bar.'
            );
            break;

          case 'audio-capture':
            setStatus('error');
            setErrorMessage(
              activeLang === 'te'
                ? 'మైక్రోఫోన్ అందుబాటులో లేదు లేదా కనెక్ట్ కాలేదు. దయచేసి పరికరాన్ని తనిఖీ చేయండి.'
                : 'Microphone is unavailable or not connected. Please check your audio input device.'
            );
            break;

          case 'no-speech':
            setStatus('idle');
            setErrorMessage(
              activeLang === 'te'
                ? 'ఎలాంటి ధ్వని గుర్తించబడలేదు. దయచేసి మైక్రోఫోన్ దగ్గర స్పష్టంగా మాట్లాడండి.'
                : 'No speech was detected. Please click the mic and try speaking again.'
            );
            break;

          case 'network':
            setStatus('error');
            setErrorMessage(
              activeLang === 'te'
                ? 'వాయిస్ గుర్తింపులో నెట్‌వర్క్ సమస్య ఏర్పడింది. దయచేసి ఇంటర్నెట్ కనెక్షన్ తనిఖీ చేయండి.'
                : 'Network error during voice recognition. Please check your internet connection.'
            );
            break;

          case 'language-not-supported':
            setStatus('error');
            setErrorMessage(
              activeLang === 'te'
                ? 'ఈ బ్రౌజర్‌లో తెలుగు వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు. దయచేసి టైప్ చేయండి.'
                : 'Speech language not supported by the browser engine. Please use typed input.'
            );
            break;

          case 'aborted':
            setStatus('idle');
            break;

          default:
            setStatus('error');
            setErrorMessage(
              activeLang === 'te'
                ? `స్పీచ్ రికగ్నిషన్ లోపం (${error}). దయచేసి మళ్ళీ ప్రయత్నించండి.`
                : `Voice recognition encountered an error (${error}). Please try again or type.`
            );
            break;
        }
      };

      recognition.onend = () => {
        // Clean up and prevent stuck listening state
        recognitionRef.current = null;
        setStatus('idle');
      };

      recognition.start();
    } catch (err) {
      console.error('[useSpeechRecognition] start error:', err);
      setStatus('error');
      setErrorMessage(
        language === 'te'
          ? 'వాయిస్ రికగ్నిషన్ ప్రారంభించడంలో లోపం. దయచేసి మళ్ళీ ప్రయత్నించండి.'
          : 'Could not start voice recognition. Please verify permissions or try again.'
      );
    }
  }, [language, clearError]);

  return {
    isSupported,
    status,
    isListening: status === 'listening',
    interimTranscript,
    finalTranscript,
    errorCode,
    errorMessage,
    startListening,
    stopListening,
    cancelListening,
    resetTranscript,
    clearError,
  };
};

export default useSpeechRecognition;
