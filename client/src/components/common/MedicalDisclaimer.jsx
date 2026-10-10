import React, { useState } from 'react';
import { ShieldAlert, Info, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Modal from './Modal';

export const DisclaimerBanner = ({ dismissible = true }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { t, language } = useLanguage();

  if (isDismissed) return null;

  return (
    <>
      <div className="bg-emerald-50/90 border-b border-emerald-100/80 px-4 py-2.5 text-xs text-emerald-900 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-200/60 text-emerald-800 uppercase tracking-wider shrink-0">
              {t('disclaimer.badge')}
            </span>
            <p className="line-clamp-1 sm:line-clamp-none font-normal text-slate-700">
              {t('disclaimer.text')}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="text-emerald-700 font-semibold hover:underline shrink-0 ml-1 inline-flex items-center gap-0.5"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{language === 'te' ? 'వివరాలు' : 'Read details'}</span>
            </button>
          </div>
          {dismissible && (
            <button
              onClick={() => setIsDismissed(true)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
              title="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <DisclaimerModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export const DisclaimerModal = ({ isOpen, onClose }) => {
  const { language } = useLanguage();

  const isTelugu = language === 'te';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isTelugu ? "పోషకాహార అవగాహన నోటీసు" : "Nutrition Awareness Notice"}
      subtitle={isTelugu ? "ప్రివెంటివ్ హెల్త్‌కేర్ మార్గదర్శకాలు" : "Preventive Healthcare Guidelines"}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-sm text-slate-600">
        <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/60 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 leading-relaxed">
            <strong className="font-semibold block mb-1">
              {isTelugu ? "ముఖ్యమైన వైద్య నిరాకరణ:" : "Important Medical Disclaimer:"}
            </strong>
            {isTelugu
              ? "న్యూట్రివిటా అనేది ప్రజల ఆరోగ్యం మరియు పోషకాహార అవగాహన కోసం అభివృద్ధి చేయబడిన వేదిక. ఇది ఏ రకమైన వైద్య పరీక్షలు లేదా రోగ నిర్ధారణను అందించదు."
              : "NutriVita is an educational nutrition platform. It does not provide medical diagnosis, clinical pathology interpretations, or prescription therapies."}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">
            {isTelugu ? "మా లక్ష్యాలు (Our Objectives)" : "Core Platform Principles"}
          </h4>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>
              {isTelugu
                ? "రోజువారీ ఆహారంలో విటమిన్లు మరియు ఖనిజాల ప్రాముఖ్యతపై అవగాహన కల్పించడం."
                : "Promote public awareness of micronutrient balance and vitamin-rich local whole foods."}
            </li>
            <li>
              {isTelugu
                ? "శరీరంలో అలసట, రోగనిరోధక శక్తి తగ్గడం వంటి ప్రాథమిక లక్షణాలను ఆహార లోపాలతో అనుసంధానించే విజ్ఞానం అందించడం."
                : "Help users explore potential nutritional gaps based on general wellness symptoms."}
            </li>
            <li>
              {isTelugu
                ? "తీవ్రమైన ఆరోగ్య సమస్యలకు ఎల్లప్పుడూ అర్హత కలిగిన వైద్యుడిని సంప్రదించాలి."
                : "Always seek the counsel of a certified physician or registered dietitian for persistent health complaints."}
            </li>
          </ul>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            {isTelugu ? "నేను అర్థం చేసుకున్నాను" : "I Understand & Acknowledge"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DisclaimerBanner;
