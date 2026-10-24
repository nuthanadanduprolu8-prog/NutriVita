import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Award, 
  Download, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Check, 
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import BackButton from '../components/common/BackButton';
import { getRandomizedQuiz, getPerformanceFeedback } from '../data/quizData';
import { generateCertificate, downloadCertificateImage } from '../utils/certificateGenerator';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

const VitaQuiz = () => {
  const { t, language } = useLanguage();
  const isTelugu = language === 'te';
  const { user } = useAuth();

  // Quiz lifecycle: 'idle' | 'in_progress' | 'completed'
  const [quizState, setQuizState] = useState('idle');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // User responses for the current session
  // Each entry: { questionId, questionText, selectedOptionIndex, correctOptionIndex, isCorrect, options, teluguOptions, explanation, teluguExplanation }
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null); // Option index for the active question
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);

  // Review & Certificate state
  const [showReview, setShowReview] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [isDownloadingCert, setIsDownloadingCert] = useState(false);

  // Speech Synthesis & Recognition
  const { speak, stop: stopSpeaking, isSpeaking, currentlySpeakingId } = useSpeechSynthesis();

  // Voice recognition confirmation modal state
  const [pendingVoiceOption, setPendingVoiceOption] = useState(null);

  // Speech recognition callback
  const handleVoiceTranscript = (transcript) => {
    if (!transcript || hasSubmittedAnswer || quizState !== 'in_progress') return;

    const lower = transcript.toLowerCase().trim();
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    let matchedIndex = -1;

    // Check for "option 1", "option 2", "1", "2", "A", "B", "C", "D"
    if (lower.includes('option 1') || lower.includes('option a') || lower.includes('ఆప్షన్ 1') || lower.includes('ఒకటి') || lower === '1' || lower === 'a') {
      matchedIndex = 0;
    } else if (lower.includes('option 2') || lower.includes('option b') || lower.includes('ఆప్షన్ 2') || lower.includes('రెండు') || lower === '2' || lower === 'b') {
      matchedIndex = 1;
    } else if (lower.includes('option 3') || lower.includes('option c') || lower.includes('ఆప్షన్ 3') || lower.includes('మూడు') || lower === '3' || lower === 'c') {
      matchedIndex = 2;
    } else if (lower.includes('option 4') || lower.includes('option d') || lower.includes('ఆప్షన్ 4') || lower.includes('నాలుగు') || lower === '4' || lower === 'd') {
      matchedIndex = 3;
    } else {
      // Fuzzy text search across current options
      const activeOptions = isTelugu ? currentQ.teluguOptions : currentQ.options;
      for (let i = 0; i < activeOptions.length; i++) {
        const optText = activeOptions[i].toLowerCase();
        if (lower.includes(optText) || optText.includes(lower)) {
          matchedIndex = i;
          break;
        }
      }
    }

    if (matchedIndex !== -1 && matchedIndex < 4) {
      setPendingVoiceOption(matchedIndex);
    }
  };

  const {
    isSupported: isMicSupported,
    status: micStatus,
    startListening,
    stopListening
  } = useSpeechRecognition({
    onFinalTranscript: handleVoiceTranscript,
    language: isTelugu ? 'te-IN' : 'en-IN'
  });

  const isMicListening = micStatus === 'listening';

  // Start new randomized quiz
  const handleStartQuiz = () => {
    stopSpeaking();
    stopListening();
    const randomized = getRandomizedQuiz(15);
    setQuestions(randomized);
    setCurrentIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setHasSubmittedAnswer(false);
    setShowReview(false);
    setCertificateUrl(null);
    setQuizState('in_progress');
  };

  // Option selected by user
  const handleSelectOption = (index) => {
    if (hasSubmittedAnswer) return; // Prevent changing answer after selection

    setSelectedOption(index);
    setHasSubmittedAnswer(true);

    const currentQ = questions[currentIndex];
    const isCorrect = index === currentQ.correctAnswer;

    const answerRecord = {
      questionId: currentQ.id,
      nutrient: currentQ.nutrient,
      question: currentQ.question,
      teluguQuestion: currentQ.teluguQuestion,
      selectedOptionIndex: index,
      correctOptionIndex: currentQ.correctAnswer,
      isCorrect,
      options: currentQ.options,
      teluguOptions: currentQ.teluguOptions,
      explanation: currentQ.explanation,
      teluguExplanation: currentQ.teluguExplanation
    };

    setUserAnswers((prev) => [...prev, answerRecord]);
  };

  // Confirm voice selection
  const handleConfirmVoiceOption = () => {
    if (pendingVoiceOption !== null) {
      handleSelectOption(pendingVoiceOption);
      setPendingVoiceOption(null);
    }
  };

  // Next Question / Complete Quiz
  const handleNextQuestion = () => {
    stopSpeaking();
    stopListening();
    setPendingVoiceOption(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasSubmittedAnswer(false);
    } else {
      // Quiz completed
      setQuizState('completed');
    }
  };

  // Pre-generate certificate preview upon quiz completion
  useEffect(() => {
    if (quizState === 'completed' && userAnswers.length > 0) {
      const score = userAnswers.filter((a) => a.isCorrect).length;
      const total = userAnswers.length;
      const percentage = Math.round((score / total) * 100);
      const recipientName = user?.name || user?.fullName || 'NutriVita Learner';

      const dataUrl = generateCertificate({
        recipientName,
        score,
        total,
        percentage,
        isTelugu
      });
      setCertificateUrl(dataUrl);
    }
  }, [quizState, userAnswers, user, isTelugu]);

  // Download certificate action
  const handleDownloadCertificate = () => {
    setIsDownloadingCert(true);
    const score = userAnswers.filter((a) => a.isCorrect).length;
    const total = userAnswers.length;
    const percentage = Math.round((score / total) * 100);
    const recipientName = user?.name || user?.fullName || 'NutriVita Learner';

    setTimeout(() => {
      downloadCertificateImage({
        recipientName,
        score,
        total,
        percentage,
        isTelugu
      });
      setIsDownloadingCert(false);
    }, 400);
  };

  // TTS Read Question aloud
  const handleReadQuestion = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    if (isSpeaking && currentlySpeakingId === `q_${currentQ.id}`) {
      stopSpeaking();
      return;
    }

    const text = isTelugu ? currentQ.teluguQuestion : currentQ.question;
    speak({
      text,
      id: `q_${currentQ.id}`,
      language: isTelugu ? 'te' : 'en'
    });
  };

  // TTS Read Explanation aloud
  const handleReadExplanation = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    if (isSpeaking && currentlySpeakingId === `exp_${currentQ.id}`) {
      stopSpeaking();
      return;
    }

    const text = isTelugu ? currentQ.teluguExplanation : currentQ.explanation;
    speak({
      text,
      id: `exp_${currentQ.id}`,
      language: isTelugu ? 'te' : 'en'
    });
  };

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  // Derived score calculation
  const totalQuestions = questions.length || 15;
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const incorrectCount = userAnswers.length - correctCount;
  const percentageScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const feedback = getPerformanceFeedback(percentageScore, isTelugu);

  const currentQ = questions[currentIndex];
  const activeOptions = currentQ ? (isTelugu ? currentQ.teluguOptions : currentQ.options) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation Back */}
      <div className="flex items-center justify-start">
        <BackButton fallbackPath="/dashboard" />
      </div>

      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>{t('vitaQuiz.badge')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {t('vitaQuiz.headerTitle')}
        </h1>
        <p className="text-base text-gray-600">
          {t('vitaQuiz.subtitle')}
        </p>
      </div>

      {/* ======================================================== */}
      {/* 1. WELCOME / IDLE STATE                                  */}
      {/* ======================================================== */}
      {quizState === 'idle' && (
        <Card className="p-8 sm:p-10 border border-gray-200 shadow-sm bg-white text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shadow-sm">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('vitaQuiz.readyToTest')}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('vitaQuiz.startDescription')}
            </p>
          </div>

          {/* Highlights checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left text-xs text-gray-700 pt-2">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>15 Randomized Questions</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Instant Explanations</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Verified Certificate</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartQuiz}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 shadow-md shadow-emerald-200"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t('vitaQuiz.startQuiz')}
            </Button>
          </div>
        </Card>
      )}

      {/* ======================================================== */}
      {/* 2. QUIZ IN-PROGRESS STATE                                */}
      {/* ======================================================== */}
      {quizState === 'in_progress' && currentQ && (
        <Card className="p-6 sm:p-8 border border-gray-200 shadow-sm bg-white space-y-6">
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-500 font-semibold">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase tracking-wider text-[11px]">
                  {currentQ.nutrient}
                </span>
                <span className="text-gray-400">•</span>
                <span>{currentQ.category}</span>
              </div>
              <span className="text-emerald-700 font-bold">
                {t('vitaQuiz.questionProgress')} {currentIndex + 1} {t('vitaQuiz.of')} {totalQuestions}
              </span>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Title & TTS Audio Button */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-snug">
                {isTelugu ? currentQ.teluguQuestion : currentQ.question}
              </h2>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleReadQuestion}
                  className={`p-2 rounded-xl border transition-all ${
                    isSpeaking && currentlySpeakingId === `q_${currentQ.id}`
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                  title={t('vitaQuiz.readQuestion')}
                  aria-label={t('vitaQuiz.readQuestion')}
                >
                  {isSpeaking && currentlySpeakingId === `q_${currentQ.id}` ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                {isMicSupported && !hasSubmittedAnswer && (
                  <button
                    onClick={isMicListening ? stopListening : startListening}
                    className={`p-2 rounded-xl border transition-all ${
                      isMicListening
                        ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                    title={t('vitaQuiz.voiceAnswer')}
                    aria-label={t('vitaQuiz.voiceAnswer')}
                  >
                    {isMicListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Voice Listening indicator */}
            {isMicListening && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>{t('vitaQuiz.voiceListening')}</span>
              </div>
            )}
          </div>

          {/* Options Grid (Exactly 4 Options) */}
          <div className="space-y-3 pt-2">
            {activeOptions.map((optText, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQ.correctAnswer;
              const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

              let optionStyle = 'border-gray-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/20 text-gray-800 cursor-pointer';

              if (hasSubmittedAnswer) {
                if (isCorrectAnswer) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-2 ring-emerald-500/20';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = 'border-rose-400 bg-rose-50 text-rose-950 font-semibold ring-2 ring-rose-400/20';
                } else {
                  optionStyle = 'border-gray-200 bg-gray-50/60 text-gray-400 cursor-not-allowed opacity-70';
                }
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 text-sm font-medium ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        hasSubmittedAnswer && isCorrectAnswer
                          ? 'bg-emerald-600 text-white'
                          : hasSubmittedAnswer && isSelected
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {optionLetter}
                    </span>
                    <span>{optText}</span>
                  </div>

                  {/* Feedback Icons */}
                  {hasSubmittedAnswer && (
                    <div className="shrink-0">
                      {isCorrectAnswer && (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      )}
                      {isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Immediate Feedback & Scientific Explanation Box */}
          {hasSubmittedAnswer && (
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2.5 transition-all ${
                selectedOption === currentQ.correctAnswer
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/80 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {selectedOption === currentQ.correctAnswer ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{t('vitaQuiz.correct')}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>{t('vitaQuiz.incorrect')}</span>
                    </>
                  )}
                </div>

                <button
                  onClick={handleReadExplanation}
                  className="p-1 text-gray-600 hover:text-gray-800"
                  title="Read explanation aloud"
                  aria-label="Read explanation aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <span className="font-semibold block text-xs uppercase tracking-wider text-gray-600">
                  {t('vitaQuiz.scientificExplanation')}:
                </span>
                <p className="leading-relaxed opacity-95">
                  {isTelugu ? currentQ.teluguExplanation : currentQ.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Action */}
          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              onClick={handleNextQuestion}
              disabled={!hasSubmittedAnswer}
              className={`text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white ${
                !hasSubmittedAnswer ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>
                {currentIndex < totalQuestions - 1
                  ? t('vitaQuiz.nextQuestion')
                  : t('vitaQuiz.finishQuiz')}
              </span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* ======================================================== */}
      {/* 3. COMPLETED / SCORECARD STATE                           */}
      {/* ======================================================== */}
      {quizState === 'completed' && (
        <div className="space-y-8">
          <Card className="p-6 sm:p-10 border border-gray-200 shadow-sm bg-white space-y-8 text-center">
            {/* Score Title */}
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                {feedback.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {feedback.title}
              </h2>
              <p className="text-sm text-gray-600 max-w-lg mx-auto">
                {feedback.message}
              </p>
            </div>

            {/* Scoreboard Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs text-emerald-700 font-semibold block">{t('vitaQuiz.accuracy')}</span>
                <span className="text-3xl font-black text-emerald-900 block mt-1">
                  {percentageScore}%
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-600 font-semibold block">{t('vitaQuiz.correctCount')}</span>
                <span className="text-3xl font-black text-gray-900 block mt-1">
                  {correctCount} <span className="text-sm font-normal text-gray-500">/ {totalQuestions}</span>
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                <span className="text-xs text-rose-700 font-semibold block">{t('vitaQuiz.incorrectCount')}</span>
                <span className="text-3xl font-black text-rose-900 block mt-1">
                  {incorrectCount}
                </span>
              </div>
            </div>

            {/* Certificate Download Section */}
            <div className="p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-3xl border border-emerald-200 max-w-2xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                      {t('vitaQuiz.certificateTitle')}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600">
                    {t('vitaQuiz.certificateSubtitle')} ({user?.name || user?.fullName || 'NutriVita Learner'})
                  </p>
                </div>

                <Button
                  variant="primary"
                  onClick={handleDownloadCertificate}
                  disabled={isDownloadingCert}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shrink-0"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  {isDownloadingCert ? t('vitaQuiz.downloading') : t('vitaQuiz.downloadCertificate')}
                </Button>
              </div>

              {/* Certificate Canvas Image Preview */}
              {certificateUrl && (
                <div className="rounded-2xl overflow-hidden border border-emerald-200 shadow-md max-w-lg mx-auto bg-white">
                  <img
                    src={certificateUrl}
                    alt="NutriVita Certificate Preview"
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={handleStartQuiz}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold"
              >
                <RotateCcw className="w-4 h-4 mr-1.5" />
                {t('vitaQuiz.retryQuiz')}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReview(!showReview)}
                className="text-xs sm:text-sm font-semibold"
              >
                {showReview ? <ChevronUp className="w-4 h-4 mr-1.5" /> : <ChevronDown className="w-4 h-4 mr-1.5" />}
                {showReview ? t('vitaQuiz.hideReview') : t('vitaQuiz.reviewAnswers')}
              </Button>
            </div>
          </Card>

          {/* ======================================================== */}
          {/* 4. REVIEW SECTION                                        */}
          {/* ======================================================== */}
          {showReview && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span>{t('vitaQuiz.reviewAnswers')}</span>
                </h3>
                <span className="text-xs text-gray-500 font-medium">
                  {userAnswers.length} Questions Evaluated
                </span>
              </div>

              <div className="space-y-4">
                {userAnswers.map((ans, idx) => {
                  const opts = isTelugu ? ans.teluguOptions : ans.options;
                  const userOpt = opts[ans.selectedOptionIndex] || 'None';
                  const correctOpt = opts[ans.correctOptionIndex] || 'None';

                  return (
                    <Card key={idx} className="p-5 border border-gray-200 bg-white space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                            Q{idx + 1} • {ans.nutrient}
                          </span>
                          <h4 className="text-sm font-bold text-gray-900">
                            {isTelugu ? ans.teluguQuestion : ans.question}
                          </h4>
                        </div>
                        <Badge
                          variant={ans.isCorrect ? 'success' : 'danger'}
                          className="text-xs shrink-0"
                        >
                          {ans.isCorrect ? t('vitaQuiz.correct') : t('vitaQuiz.incorrect')}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div
                          className={`p-2.5 rounded-lg border ${
                            ans.isCorrect
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium'
                              : 'bg-rose-50/60 border-rose-200 text-rose-950 font-medium'
                          }`}
                        >
                          <span className="text-gray-500 block font-normal">{t('vitaQuiz.yourAnswer')}:</span>
                          <span className="font-semibold">{userOpt}</span>
                        </div>

                        <div className="p-2.5 rounded-lg border bg-emerald-50/40 border-emerald-200 text-emerald-950">
                          <span className="text-gray-500 block font-normal">{t('vitaQuiz.correctAnswer')}:</span>
                          <span className="font-semibold text-emerald-800">{correctOpt}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 space-y-1">
                        <span className="font-bold text-gray-800 block">
                          {t('vitaQuiz.scientificExplanation')}:
                        </span>
                        <p className="leading-relaxed">
                          {isTelugu ? ans.teluguExplanation : ans.explanation}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Voice Recognition Confirmation Modal */}
      {pendingVoiceOption !== null && currentQ && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Mic className="w-4 h-4 text-emerald-600" />
              <span>{t('vitaQuiz.voiceMatchedOption')} {String.fromCharCode(65 + pendingVoiceOption)}:</span>
            </h3>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900">
              {activeOptions[pendingVoiceOption]}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="primary"
                onClick={handleConfirmVoiceOption}
                className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                {t('vitaQuiz.confirmVoice')}
              </Button>
              <Button
                variant="outline"
                onClick={() => setPendingVoiceOption(null)}
                className="w-full text-xs"
              >
                {t('vitaQuiz.cancelVoice')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitaQuiz;
