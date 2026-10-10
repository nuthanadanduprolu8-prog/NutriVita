import React, { useState } from 'react';
import { Flame, ChevronRight, Apple } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../common/Card';
import { getVerifiedFoodImageUrl, handleFoodImgError } from '../../utils/foodImageFallback';

const FoodCard = ({ food, onSelect }) => {
  const { language } = useLanguage();
  const isTelugu = language === 'te';
  const [imgError, setImgError] = useState(false);

  // Extract top 2 nutrient highlights
  const highlights = [];
  if (food.minerals?.iron >= 3.0) highlights.push(`Iron: ${food.minerals.iron}mg`);
  if (food.minerals?.calcium >= 100) highlights.push(`Calcium: ${food.minerals.calcium}mg`);
  if (food.vitamins?.vitaminC >= 30) highlights.push(`Vit C: ${food.vitamins.vitaminC}mg`);
  if (food.vitamins?.vitaminA >= 150) highlights.push(`Vit A: ${food.vitamins.vitaminA}mcg`);
  if (food.vitamins?.vitaminD > 0) highlights.push(`Vit D: ${food.vitamins.vitaminD}IU`);
  if (food.vitamins?.vitaminB12 > 0.3) highlights.push(`Vit B12: ${food.vitamins.vitaminB12}mcg`);
  if (food.macronutrients?.protein >= 10) highlights.push(`Protein: ${food.macronutrients.protein}g`);

  return (
    <Card hoverEffect padding="p-0" className="overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Real Food Image Container */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          {!imgError ? (
            <img
              src={getVerifiedFoodImageUrl(food)}
              alt={food.name}
              onError={(e) => {
                handleFoodImgError(e, food.id);
                setImgError(true);
              }}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50 text-emerald-700 p-4 text-center">
              <Apple className="w-10 h-10 mb-1 opacity-70" />
              <span className="text-xs font-semibold">{food.name}</span>
            </div>
          )}
          
          {/* Category Pill Over Image */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
              {food.category.replace('_', ' ')}
            </span>
          </div>

          {/* Calorie Tag */}
          <div className="absolute bottom-3 right-3">
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-900/80 text-white backdrop-blur-sm flex items-center gap-1 shadow-md">
              <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{food.calories} kcal</span>
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2.5">
          <div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {food.name}
            </h3>
            <p className="text-xs text-emerald-700 font-medium">
              {food.teluguName}
            </p>
          </div>

          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
            {isTelugu && food.descriptionTe ? food.descriptionTe : food.descriptionEn}
          </p>

          {/* Standout Nutrient Highlights */}
          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {highlights.slice(0, 2).map((h, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0">
        <button
          onClick={() => onSelect(food)}
          className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
        >
          <span>{isTelugu ? 'పోషక వివరాలు చూడండి' : 'View Nutrition Facts'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
};

export default FoodCard;
