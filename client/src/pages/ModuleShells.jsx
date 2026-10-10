import React from 'react';
import { 
  BookOpen, 
  Apple, 
  ShieldCheck, 
  UtensilsCrossed, 
  CalendarCheck, 
  Scan, 
  Sparkles, 
  HelpCircle, 
  Bookmark,
  Heart
} from 'lucide-react';
import FoundationFeatureShell from '../components/common/FoundationFeatureShell';

export const VitaminExplorerPage = () => (
  <FoundationFeatureShell
    title="Vitamin & Mineral Encyclopedia"
    subtitle="Evidence-based dietary reference for 13 essential vitamins and minerals"
    icon={BookOpen}
    stageNumber="4"
    description="This module hosts complete scientific profiles, daily RDAs for men, women, and children, common deficiency signs, synergistic pairs, and top whole-food sources."
    features={[
      "Water-soluble & fat-soluble vitamins catalog",
      "Interactive RDA daily targets gauge",
      "Nutrient absorption synergy pairs (e.g., Vit C + Iron)",
      "Bilingual English and Telugu nutritional terms"
    ]}
  />
);

export const FoodExplorerPage = () => (
  <FoundationFeatureShell
    title="Food Explorer & Database"
    subtitle="Verified nutritional directory with genuine food photography"
    icon={Apple}
    stageNumber="4"
    description="Browse and filter 60+ staple and regional Indian foods with verified royalty-free CDN images, detailed macronutrient cards, and micronutrient breakdowns."
    features={[
      "Verified real food photos with zero generic placeholders",
      "Sort by Iron, Vitamin C, Calcium, Protein, and Calories",
      "Category filters: Vegetables, Fruits, Millets, Pulses, Dairy, etc.",
      "Modal view with full micro and macronutrient profile per 100g"
    ]}
  />
);

export const SymptomCheckerPage = () => (
  <FoundationFeatureShell
    title="Symptom-Based Deficiency Awareness"
    subtitle="Connect everyday physical signals with potential nutritional gaps"
    icon={ShieldCheck}
    stageNumber="5"
    description="Select observable symptoms (bleeding gums, brittle nails, muscle cramps, fatigue, night vision issues) to identify potential underlying vitamin deficiencies."
    features={[
      "Categorized body part and symptom selectors",
      "Deficiency likelihood algorithm with transparent rationale",
      "Targeted whole-food corrective dietary suggestions",
      "Strict preventive health notice (no medical diagnosis claims)"
    ]}
  />
);

export const BalanceMyMealPage = () => (
  <FoundationFeatureShell
    title="Balance My Meal (Plate Visualizer)"
    subtitle="Interactive visual plate balancing tool for optimal macronutrient splits"
    icon={UtensilsCrossed}
    stageNumber="6"
    description="Build your daily plate interactively to ensure a healthy 50% vegetables, 25% protein/pulses, and 25% whole grains ratio."
    features={[
      "Visual circular plate graphic with macro sections",
      "Real-time calorie and fiber accumulator",
      "Missing micronutrient alert (e.g., 'Low Vitamin C in this meal')",
      "Food synergy tips for enhanced nutrient bioavailability"
    ]}
  />
);

export const MealPlannerPage = () => (
  <FoundationFeatureShell
    title="Smart Meal Planner"
    subtitle="Customized 1-day and 7-day meal plans tailored to your health goals"
    icon={CalendarCheck}
    stageNumber="6"
    description="Generate complete breakfast, lunch, snack, and dinner meal plans based on your calorie target, dietary preferences, and target vitamins."
    features={[
      "1-Day and 7-Day automated meal schedules",
      "Customizable serving sizes and alternative item swapper",
      "Exportable and printable grocery list",
      "Save plans to your personal profile"
    ]}
  />
);

export const LabelLensPage = () => (
  <FoundationFeatureShell
    title="Label Lens (OCR Nutrition Scanner)"
    subtitle="Scan packaged nutrition labels with instant Nutri-Grade and red flags"
    icon={Scan}
    stageNumber="7"
    description="Optical Character Recognition (OCR) powered by Tesseract.js extracts calories, sugars, sodium, and fats from product labels, paired with a 1-click manual entry fallback."
    features={[
      "Live webcam/mobile camera scanner & image drag-and-drop",
      "Automatic regex extraction of nutritional facts",
      "Nutri-Grade rating (A to E) with high-sugar/sodium alerts",
      "Immediate manual fallback form for crumpled or low-res labels"
    ]}
  />
);

export const VitaMateAIPage = () => (
  <FoundationFeatureShell
    title="VitaMate AI Nutrition Assistant"
    subtitle="Conversational preventive nutrition guide with bilingual voice support"
    icon={Sparkles}
    stageNumber="8"
    description="Ask nutrition questions, receive meal ideas, compare foods, and understand vitamin synergies with dual-engine AI and voice recognition in English and Telugu."
    features={[
      "Dual-engine architecture: Cloud LLM + offline clinical knowledge engine",
      "Web Speech API: Voice recording & text-to-speech reading in EN & TE",
      "One-click quick prompt chips for common dietary questions",
      "Guardrailed system prompt enforcing preventive nutrition recommendations"
    ]}
  />
);

export const VitaQuizPage = () => (
  <FoundationFeatureShell
    title="VitaQuiz Nutrition Challenge"
    subtitle="Gamified nutrition trivia and deficiency awareness test"
    icon={HelpCircle}
    stageNumber="9"
    description="Test your vitamin knowledge with 15 interactive questions, receive instant feedback and explanations, and earn a downloadable NutriVita Wellness Certificate."
    features={[
      "15 randomized multiple-choice nutrition awareness questions",
      "Instant correct/incorrect feedback with scientific rationale",
      "Scorecards classifying user knowledge levels",
      "Printable NutriVita Nutrition Awareness Certificate badge"
    ]}
  />
);

export const NutritionAwarenessPage = () => (
  <FoundationFeatureShell
    title="Nutrition Awareness"
    subtitle="Nutrition guides, mythbusters, and local superfoods"
    icon={Heart}
    stageNumber="9"
    description="Educational community articles on eradicating hidden hunger, seasonal local superfoods (Amla, Ragi, Moringa), and evidence-based nutrition mythbusting."
    features={[
      "Anemia prevention community handbook",
      "Sunshine vitamin: Tackling Vitamin D deficiency in modern lifestyles",
      "Busting common dietary & supplement myths",
      "Curated Telugu & English health awareness guides"
    ]}
  />
);

export const SavedPlansPage = () => (
  <FoundationFeatureShell
    title="Saved Plans & Health Assessments"
    subtitle="Review your saved meal schedules and past deficiency evaluations"
    icon={Bookmark}
    stageNumber="10"
    description="Access your saved meal plans, review dietary adjustments, and track your nutritional progress over time."
    features={[
      "List of user-saved 1-day and 7-day meal plans",
      "Historical symptom assessment records",
      "Export and print capabilities for family or community sharing",
      "One-click reload into the active Meal Balancer"
    ]}
  />
);
