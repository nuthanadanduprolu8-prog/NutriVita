import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Trash2, 
  Copy, 
  Check, 
  AlertCircle, 
  Apple, 
  BookOpen, 
  ExternalLink,
  ShieldCheck,
  Globe,
  ArrowRight,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import aiService from '../services/aiService';
import foodService from '../services/foodService';
import vitaminService from '../services/vitaminService';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FoodDetailModal from '../components/food/FoodDetailModal';
import VitaminDetailModal from '../components/vitamin/VitaminDetailModal';
import BackButton from '../components/common/BackButton';

// Simple Markdown Formatter for Assistant Messages
const FormattedMessage = ({ text = '' }) => {
  if (!text) return null;

  // Split by double newline for paragraphs/blocks
  const blocks = text.split('\n\n');

  return (
    <div className="space-y-3 text-sm leading-relaxed text-slate-800">
      {blocks.map((block, bIdx) => {
        // Headers
        if (block.startsWith('### ')) {
          return (
            <h3 key={bIdx} className="text-base font-bold text-slate-900 border-b border-emerald-100 pb-1 mt-2">
              {block.replace('### ', '')}
            </h3>
          );
        }
        if (block.startsWith('#### ')) {
          return (
            <h4 key={bIdx} className="text-sm font-bold text-emerald-800 mt-2">
              {block.replace('#### ', '')}
            </h4>
          );
        }

        // Blockquotes / Note
        if (block.startsWith('> ')) {
          return (
            <div key={bIdx} className="p-3 bg-emerald-50/70 border-l-4 border-emerald-500 rounded-r-xl text-xs text-emerald-900 font-medium my-2">
              {block.replace('> ', '')}
            </div>
          );
        }

        // Italic Disclaimer block
        if (block.startsWith('*Note:') || block.startsWith('*గమనిక:')) {
          const cleanText = block.replace(/^\*/, '').replace(/\*$/, '');
          return (
            <div key={bIdx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic mt-3 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{cleanText}</span>
            </div>
          );
        }

        // Bullet lists
        if (block.includes('\n* ') || block.startsWith('* ')) {
          const items = block.split('\n').filter(line => line.startsWith('* '));
          return (
            <ul key={bIdx} className="space-y-1.5 pl-1 my-2">
              {items.map((item, iIdx) => {
                const itemContent = item.replace('* ', '');
                // Parse bold parts inside bullet
                const parts = itemContent.split(/(\*\*.*?\*\*)/g);
                return (
                  <li key={iIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>
                      {parts.map((part, pIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={pIdx} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                      })}
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Standard paragraph with bold formatting
        const parts = block.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={bIdx} className="text-xs sm:text-sm">
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={pIdx} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
};

const VitaMateAI = () => {
  const { t, language } = useLanguage();
  const isTelugu = language === 'te';
  const { user } = useAuth();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text: isTelugu
        ? `నమస్కారం! నేను **విటామేట్ (VitaMate)** — మీ వ్యక్తిగత పోషకాహార మరియు విటమిన్ అవగాహన సహాయకుడిని. 🌿\n\n` +
          `విటమిన్లు, ఆహార వనరులు, పోషక లోపాల ముందస్తు సంకేతాలు, లేదా సమతుల్య భోజనం గురించి ఏదైనా అడగండి. మీరు టైప్ చేయవచ్చు లేదా మైక్రోఫోన్ బటన్ నొక్కి మాట్లాడవచ్చు!`
        : `Hello! I am **VitaMate**, your NutriVita preventive nutrition guide. 🌿\n\n` +
          `Ask me anything about essential vitamins, rich food sources, deficiency signs, or building a balanced daily plate. You can type or tap the microphone to speak!`,
      timestamp: new Date(),
      relatedFoods: [],
      relatedVitamins: [],
      suggestedFollowUps: isTelugu
        ? ['శాకాహారులకు విటమిన్ B12 ఎలా లభిస్తుంది?', 'అలసట నివారణకు ఏ ఆహారాలు మేలు?', 'ఐరన్ శోషణకు విటమిన్ సి ఎలా సహాయపడుతుంది?']
        : ['What are the best vegetarian sources of Vitamin B12?', 'How does Vitamin C help with Iron absorption?', 'Which foods boost hemoglobin for anemia?'],
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState([]);

  // Modals
  const [selectedFoodModal, setSelectedFoodModal] = useState(null);
  const [selectedVitaminModal, setSelectedVitaminModal] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Speech Recognition Hook
  const {
    isSupported: isSpeechRecognitionSupported,
    status: speechStatus,
    isListening,
    interimTranscript,
    errorMessage: speechErrorMessage,
    startListening,
    stopListening,
    cancelListening,
    clearError: clearSpeechError,
  } = useSpeechRecognition({
    language,
    onFinalTranscript: (finalText) => {
      if (finalText && finalText.trim()) {
        setInputMessage((prev) => {
          const separator = prev && !prev.endsWith(' ') ? ' ' : '';
          return `${prev}${separator}${finalText.trim()}`;
        });
      }
    },
  });

  // Speech Synthesis Hook
  const {
    isSpeaking,
    currentlySpeakingId,
    statusMessage: ttsStatusMessage,
    hasTeluguVoice,
    speak,
    stop: stopSpeaking,
  } = useSpeechSynthesis();

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load suggested prompt chips
  useEffect(() => {
    aiService.getPrompts(language)
      .then((res) => {
        if (res.data) setSuggestedPrompts(res.data);
      })
      .catch(() => {});
  }, [language]);

  // Handle Send Message
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    // Stop active speech recognition or synthesis if active
    if (isListening) stopListening();
    if (isSpeaking) stopSpeaking();

    const userMessageObj = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessageObj]);
    setInputMessage('');
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setErrorBanner(
        isTelugu
          ? 'మీరు ప్రస్తుతం ఆఫ్‌లైన్‌లో ఉన్నారు. VitaMate AI సంభాషణలకు ఇంటర్నెట్ కనెక్షన్ అవసరం.'
          : 'You are currently offline. VitaMate AI conversation requires an active internet connection.'
      );
      return;
    }

    setErrorBanner('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await aiService.sendMessage({
        message: query,
        history: historyPayload,
        language,
        userProfile: user || {},
      });

      const assistantMessageObj = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: res.message || '',
        timestamp: new Date(),
        relatedFoods: res.relatedFoods || [],
        relatedVitamins: res.relatedVitamins || [],
        suggestedFollowUps: res.suggestedFollowUps || [],
        engine: res.engine,
      };

      setMessages((prev) => [...prev, assistantMessageObj]);
    } catch (err) {
      console.error('VitaMate send error:', err);
      const errMsg = err.response?.data?.message || (
        isTelugu
          ? 'క్షమించండి, మీ ప్రశ్నకు సమాధానం ఇవ్వడంలో సమస్య ఏర్పడింది. దయచేసి మళ్ళీ ప్రయత్నించండి.'
          : 'Sorry, could not process your question. Please check your network or try again.'
      );
      setErrorBanner(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Toggle speech input
  const handleToggleVoice = () => {
    clearSpeechError();
    if (isListening) {
      stopListening();
    } else {
      startListening(language);
    }
  };

  // Read message aloud
  const handleReadAloud = (msg) => {
    if (currentlySpeakingId === msg.id && isSpeaking) {
      stopSpeaking();
    } else {
      speak({
        id: msg.id,
        text: msg.text,
        language: msg.text && /[\u0C00-\u0C7F]/.test(msg.text) ? 'te' : language,
      });
    }
  };

  // Copy message to clipboard
  const handleCopyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Clear chat
  const handleClearChat = () => {
    if (isSpeaking) stopSpeaking();
    if (isListening) cancelListening();

    setMessages([
      {
        id: 'welcome_reset',
        sender: 'assistant',
        text: isTelugu
          ? `సంభాషణ రీసెట్ చేయబడింది. మీరు ఏ పోషకాహార అంశంపై తెలుసుకోవాలనుకుంటున్నారు?`
          : `Conversation cleared. What nutritional topic would you like to explore today?`,
        timestamp: new Date(),
        relatedFoods: [],
        relatedVitamins: [],
        suggestedFollowUps: isTelugu
          ? ['శాకాహారులకు విటమిన్ B12 ఎలా లభిస్తుంది?', 'అలసట నివారణకు ఏ ఆహారాలు మేలు?', 'ఐరన్ శోషణకు విటమిన్ సి ఎలా సహాయపడుతుంది?']
          : ['What are the best vegetarian sources of Vitamin B12?', 'How does Vitamin C help with Iron absorption?', 'Which foods boost hemoglobin for anemia?'],
      }
    ]);
  };

  // Open food modal
  const handleOpenFood = async (foodId) => {
    try {
      const res = await foodService.getFoodById(foodId);
      if (res.data) setSelectedFoodModal(res.data);
    } catch (e) {
      // Fallback: search by id
    }
  };

  // Open vitamin modal
  const handleOpenVitamin = async (vitaminId) => {
    try {
      const res = await vitaminService.getVitaminById(vitaminId);
      if (res.data) setSelectedVitaminModal(res.data);
    } catch (e) {
      // Fallback
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BackButton fallbackPath="/dashboard" />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('vitamate.badge')}</span>
            </span>
            <span className="text-xs text-slate-400">• Evidence-Based</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t('vitamate.title')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {t('vitamate.subtitle')}
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Active Locale indicator */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Voice Locale: {isTelugu ? 'te-IN (తెలుగు)' : 'en-IN (English)'}</span>
          </div>

          {/* Clear conversation button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            className="text-xs text-slate-600 hover:text-rose-600 hover:border-rose-300"
            title={t('vitamate.clearChat')}
          >
            <Trash2 className="w-3.5 h-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">{t('vitamate.clearChat')}</span>
          </Button>
        </div>
      </div>

      {/* TTS Warning banner if Telugu voice is missing on device */}
      {isTelugu && !hasTeluguVoice && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{t('vitamate.teluguVoiceMissing')}</span>
          </div>
          <span className="text-[11px] font-semibold text-amber-900 px-2 py-0.5 bg-amber-100 rounded-lg">
            Typed input & Telugu answers fully active
          </span>
        </div>
      )}

      {/* Speech synthesis status message if any */}
      {ttsStatusMessage && (
        <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{ttsStatusMessage}</span>
        </div>
      )}

      {/* Chat Container */}
      <Card className="flex flex-col h-[650px] p-0 overflow-hidden border border-slate-200/80 shadow-md">
        
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gradient-to-b from-slate-50/50 to-white">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Assistant Avatar */}
              {msg.sender === 'assistant' && (
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              {/* Message Bubble */}
              <div className={`max-w-[88%] sm:max-w-[78%] space-y-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-3xl p-4 sm:p-5 shadow-sm transition-all ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none ml-auto'
                      : currentlySpeakingId === msg.id
                      ? 'bg-emerald-50/80 border-2 border-emerald-400 text-slate-800 rounded-tl-none ring-4 ring-emerald-500/10'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.text}
                    </p>
                  ) : (
                    <FormattedMessage text={msg.text} />
                  )}
                </div>

                {/* Assistant Controls Bar */}
                {msg.sender === 'assistant' && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 pl-1 text-xs text-slate-500">
                    {/* Read Aloud Button */}
                    <button
                      onClick={() => handleReadAloud(msg)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                        currentlySpeakingId === msg.id && isSpeaking
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 animate-pulse'
                          : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                      }`}
                      title={
                        currentlySpeakingId === msg.id && isSpeaking
                          ? t('vitamate.stopSpeaking')
                          : t('vitamate.readAloud')
                      }
                    >
                      {currentlySpeakingId === msg.id && isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                          <span>{t('vitamate.stopSpeaking')}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{t('vitamate.readAloud')}</span>
                        </>
                      )}
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
                      title={t('vitamate.copy')}
                    >
                      {copiedMessageId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">{t('vitamate.copied')}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{t('vitamate.copy')}</span>
                        </>
                      )}
                    </button>

                    <span className="text-[10px] text-slate-400 ml-auto">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}

                {/* Structured Food Recommendations Cards */}
                {msg.sender === 'assistant' && msg.relatedFoods && msg.relatedFoods.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Apple className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('vitamate.relatedFoods')}</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {msg.relatedFoods.map((food) => (
                        <div
                          key={food.id}
                          onClick={() => handleOpenFood(food.id)}
                          className="flex items-center gap-2.5 p-2 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-sm cursor-pointer transition-all group"
                        >
                          <img
                            src={food.imageUrl}
                            alt={food.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700">
                              {food.name}
                            </h5>
                            <p className="text-[10px] text-slate-400 truncate">
                              {food.teluguName || `${food.calories} kcal`}
                            </p>
                          </div>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 shrink-0 mr-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Vitamins Chips */}
                {msg.sender === 'assistant' && msg.relatedVitamins && msg.relatedVitamins.length > 0 && (
                  <div className="pt-1 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
                      <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                      <span>{t('vitamate.relatedVitamins')}:</span>
                    </span>
                    {msg.relatedVitamins.map((vit) => (
                      <button
                        key={vit.vitaminId}
                        onClick={() => handleOpenVitamin(vit.vitaminId)}
                        className="px-2.5 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>{vit.nameEn || vit.vitaminId}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Follow-up Question Suggestion Chips */}
                {msg.sender === 'assistant' && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {msg.suggestedFollowUps.map((promptText, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSendMessage(promptText)}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-xs font-medium transition-colors text-left flex items-center gap-1"
                      >
                        <span>{promptText}</span>
                        <ArrowRight className="w-3 h-3 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading / Thinking State */}
          {loading && (
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="rounded-3xl rounded-tl-none p-4 bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {t('vitamate.thinking')}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Banner */}
        {errorBanner && (
          <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-xs text-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorBanner}</span>
            </div>
            <button
              onClick={() => handleSendMessage()}
              className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{t('vitamate.retry')}</span>
            </button>
          </div>
        )}

        {/* Live Speech Recognition Transcript Floating Overlay */}
        {isListening && (
          <div className="px-4 py-2.5 bg-rose-50 border-t border-rose-200 text-xs flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-rose-900 leading-none">
                  {t('vitamate.micListening')} ({isTelugu ? 'te-IN' : 'en-IN'})
                </p>
                <p className="text-[11px] text-rose-700 truncate mt-0.5 italic">
                  {interimTranscript ? `"${interimTranscript}"` : (isTelugu ? 'మాట్లాడండి...' : 'Listening to speech...')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="primary"
                size="sm"
                onClick={stopListening}
                className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] px-2.5 py-1 h-auto"
              >
                {t('vitamate.micStop')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={cancelListening}
                className="text-[11px] px-2 py-1 h-auto"
              >
                {t('vitamate.micCancel')}
              </Button>
            </div>
          </div>
        )}

        {/* Speech Error Banner */}
        {speechErrorMessage && (
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{speechErrorMessage}</span>
            </div>
            <button
              onClick={clearSpeechError}
              className="text-xs font-semibold text-amber-700 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-3">
          
          {/* Quick Suggested Prompt Chips (Scrollable row) */}
          {suggestedPrompts.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="font-bold text-slate-400 shrink-0 text-[11px]">
                {t('vitamate.suggestedTitle')}:
              </span>
              {suggestedPrompts.slice(0, 5).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt.text)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-slate-600 whitespace-nowrap text-xs font-medium transition-colors shrink-0"
                >
                  {prompt.text}
                </button>
              ))}
            </div>
          )}

          {/* Main Input Row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button with Multi-State Visuals */}
            <div className="relative group">
              <button
                type="button"
                onClick={handleToggleVoice}
                disabled={!isSpeechRecognitionSupported}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all focus:outline-none ${
                  !isSpeechRecognitionSupported
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                    : isListening
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 ring-4 ring-rose-200 animate-pulse'
                    : speechStatus === 'permission-denied'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : speechStatus === 'error'
                    ? 'bg-rose-100 text-rose-700 border border-rose-300'
                    : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800'
                }`}
                title={
                  !isSpeechRecognitionSupported
                    ? t('vitamate.micUnsupported')
                    : isListening
                    ? t('vitamate.micStop')
                    : speechStatus === 'permission-denied'
                    ? t('vitamate.micDenied')
                    : `${t('vitamate.micReady')} (${isTelugu ? 'te-IN' : 'en-IN'})`
                }
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t('vitamate.inputPlaceholder')}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-all outline-none"
              disabled={loading}
            />

            {/* Send Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={!inputMessage.trim() || loading}
              className="h-11 px-4 sm:px-5 rounded-2xl font-bold shrink-0 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{t('vitamate.send')}</span>
            </Button>
          </form>

          {/* Preventive Notice Footer */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('disclaimer.badge')}</span>
            </span>
            <span className="hidden sm:inline text-slate-400">
              {isTelugu ? 'వ్యక్తిగత ఆరోగ్య నిర్ధారణకు వైద్యులను సంప్రదించండి.' : 'Consult healthcare professionals for personal clinical diagnosis.'}
            </span>
          </div>
        </div>
      </Card>

      {/* Populated Food Detail Modal */}
      {selectedFoodModal && (
        <FoodDetailModal
          food={selectedFoodModal}
          isOpen={!!selectedFoodModal}
          onClose={() => setSelectedFoodModal(null)}
        />
      )}

      {/* Populated Vitamin Detail Modal */}
      {selectedVitaminModal && (
        <VitaminDetailModal
          vitamin={selectedVitaminModal}
          isOpen={!!selectedVitaminModal}
          onClose={() => setSelectedVitaminModal(null)}
        />
      )}
    </div>
  );
};

export default VitaMateAI;
