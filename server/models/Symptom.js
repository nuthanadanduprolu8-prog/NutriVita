import mongoose from 'mongoose';

const symptomSchema = new mongoose.Schema({
  symptomId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  titleEn: {
    type: String,
    required: true,
  },
  titleTe: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['mouth_gums', 'skin_hair', 'energy_fatigue', 'vision_eyes', 'bones_joints', 'immunity_infections'],
    required: true,
    index: true,
  },
  associatedDeficiencies: [
    {
      vitaminId: { type: String, required: true },
      likelihoodWeight: { type: Number, default: 0.8 },
    }
  ],
  recommendedActionEn: { type: String },
  recommendedActionTe: { type: String },
});

const SymptomModel = mongoose.models.Symptom || mongoose.model('Symptom', symptomSchema);

export default SymptomModel;
