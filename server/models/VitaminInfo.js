import mongoose from 'mongoose';
import { memoryStore, getDBStatus } from '../config/db.js';

const vitaminInfoSchema = new mongoose.Schema({
  vitaminId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  nameEn: {
    type: String,
    required: true,
  },
  nameTe: {
    type: String,
    required: true,
  },
  chemicalName: {
    type: String,
  },
  type: {
    type: String,
    enum: ['water_soluble', 'fat_soluble', 'mineral'],
    default: 'water_soluble',
  },
  rdaAdults: {
    male: { type: String, default: 'Varies' },
    female: { type: String, default: 'Varies' },
    pregnancy: { type: String },
    elderly: { type: String },
    unit: { type: String },
  },
  primaryFunctionsEn: [{ type: String }],
  primaryFunctionsTe: [{ type: String }],
  deficiencySymptomsEn: [{ type: String }],
  deficiencySymptomsTe: [{ type: String }],
  synergisticPairs: [
    {
      partnerNutrient: { type: String },
      explanationEn: { type: String },
      explanationTe: { type: String },
    }
  ],
  topFoodSources: [{ type: String }], // references food IDs
  preventiveTipsEn: [{ type: String }],
  preventiveTipsTe: [{ type: String }],
});

const VitaminInfoModel = mongoose.models.VitaminInfo || mongoose.model('VitaminInfo', vitaminInfoSchema);

// Unified Vitamin Repository
export const VitaminRepository = {
  async findAll({ type, search } = {}) {
    let vitamins = [...memoryStore.vitamins];

    if (type && type !== 'all') {
      vitamins = vitamins.filter(v => v.type === type);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      vitamins = vitamins.filter(v =>
        v.nameEn.toLowerCase().includes(q) ||
        (v.nameTe && v.nameTe.toLowerCase().includes(q)) ||
        (v.chemicalName && v.chemicalName.toLowerCase().includes(q)) ||
        (v.deficiencySymptomsEn && v.deficiencySymptomsEn.some(s => s.toLowerCase().includes(q))) ||
        (v.deficiencySymptomsTe && v.deficiencySymptomsTe.some(s => s.toLowerCase().includes(q)))
      );
    }

    return vitamins;
  },

  async findById(vitaminId) {
    const vitamin = memoryStore.vitamins.find(v => v.vitaminId === vitaminId);
    if (!vitamin) return null;

    // Populate topFoodSources with real food items
    const richFoodItems = (vitamin.topFoodSources || [])
      .map(foodId => memoryStore.foods.find(f => f.id === foodId))
      .filter(Boolean);

    return {
      ...vitamin,
      richFoodDetails: richFoodItems
    };
  }
};

export default VitaminInfoModel;
