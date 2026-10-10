import { useState, useEffect, useRef, useCallback } from 'react';

// Strip Markdown formatting (e.g. bold, italics, links, headers, code, bullet asterisks)
const cleanMarkdownForSpeech = (markdown = '') => {
  return markdown
    .replace(/^#{1,6}\s+/gm, '') // Remove markdown headers (#, ##, etc.)
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italics
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links [text](url) -> text
    .replace(/^>\s+/gm, '') // Blockquotes
    .replace(/^[*+-]\s+/gm, '') // List bullets
    .replace(/\n{2,}/g, '. ') // Paragraphs to pause
    .replace(/\n/g, ', ')
    .trim();
};

export const useSpeechSynthesis = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState(null);
  const [voices, setVoices] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [hasTeluguVoice, setHasTeluguVoice] = useState(false);

  const utteranceRef = useRef(null);

  // Check support and load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const updateVoices = () => {
      try {
        const availableVoices = window.speechSynthesis.getVoices() || [];
        setVoices(availableVoices);
        const teluguFound = availableVoices.some(v =>
          (v.lang && (v.lang.toLowerCase().startsWith('te') || v.lang.toLowerCase().includes('telugu'))) ||
          (v.name && v.name.toLowerCase().includes('telugu'))
        );
        setHasTeluguVoice(teluguFound);
      } catch (e) {
        console.warn('[useSpeechSynthesis] Could not get voices:', e);
      }
    };

    updateVoices();

    // Chrome and Safari populate voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop currently playing speech
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentlySpeakingId(null);
    setStatusMessage('');
  }, []);

  // Speak specific text
  const speak = useCallback(({ id, text, language = 'en' }) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setStatusMessage('Text-to-speech is not supported in this browser.');
      return false;
    }

    // If currently speaking this exact message, toggle stop
    if (isSpeaking && currentlySpeakingId === id) {
      stop();
      return true;
    }

    // Cancel any previous speech session
    window.speechSynthesis.cancel();
    setStatusMessage('');

    const plainText = cleanMarkdownForSpeech(text);
    if (!plainText) return false;

    // Voice selection
    const availableVoices = window.speechSynthesis.getVoices() || voices;
    let selectedVoice = null;

    if (language === 'te') {
      // Find Telugu voice
      selectedVoice = availableVoices.find(v =>
        (v.lang && (v.lang.toLowerCase() === 'te-in' || v.lang.toLowerCase().startsWith('te'))) ||
        (v.name && v.name.toLowerCase().includes('telugu'))
      );

      if (!selectedVoice) {
        // As per mandate: Never convert Telugu text to an incorrect English voice just to make it play!
        // Clearly inform user.
        setIsSpeaking(false);
        setCurrentlySpeakingId(null);
        setStatusMessage(
          'ఈ డివైస్/బ్రౌజర్‌లో తెలుగు వాయిస్ (te-IN) ఇన్‌స్టాల్ అయి లేదు. టెక్స్ట్-టు-స్పీచ్ అందుబాటులో లేదు.'
        );
        return false;
      }
    } else {
      // Prefer Indian English (en-IN)
      selectedVoice = availableVoices.find(v =>
        v.lang && (v.lang.toLowerCase() === 'en-in' || v.name.toLowerCase().includes('india'))
      );

      // Fallback to any English voice
      if (!selectedVoice) {
        selectedVoice = availableVoices.find(v =>
          v.lang && v.lang.toLowerCase().startsWith('en')
        );
      }
    }

    try {
      const utterance = new SpeechSynthesisUtterance(plainText);
      utteranceRef.current = utterance;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      } else {
        utterance.lang = language === 'te' ? 'te-IN' : 'en-IN';
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentlySpeakingId(id);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentlySpeakingId(null);
      };

      utterance.onerror = (event) => {
        // If canceled explicitly, don't show error
        if (event.error === 'canceled' || event.error === 'interrupted') {
          setIsSpeaking(false);
          setCurrentlySpeakingId(null);
          return;
        }

        console.warn('[useSpeechSynthesis] Utterance error:', event);
        setIsSpeaking(false);
        setCurrentlySpeakingId(null);
        setStatusMessage(
          language === 'te'
            ? 'టెక్స్ట్-టు-స్పీచ్ ప్లే చేయడంలో లోపం సంభవించింది.'
            : 'Error occurred during audio speech playback.'
        );
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.error('[useSpeechSynthesis] speak error:', err);
      setIsSpeaking(false);
      setCurrentlySpeakingId(null);
      setStatusMessage('Could not initialize speech synthesis.');
      return false;
    }
  }, [voices, isSpeaking, currentlySpeakingId, stop]);

  return {
    isSupported,
    isSpeaking,
    currentlySpeakingId,
    statusMessage,
    hasTeluguVoice,
    speak,
    stop,
  };
};

export default useSpeechSynthesis;
