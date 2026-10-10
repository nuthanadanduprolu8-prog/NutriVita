import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true,
  },
  symptomsReported: [{
    type: String, // symptom IDs
  }],
  detectedDeficiencies: [{
    vitaminId: { type: String, required: true },
    confidence: { type: String, enum: ['high', 'moderate', 'low'], default: 'moderate' },
    score: { type: Number, default: 0 },
    primaryFoods: [{ type: String }],
  }],
  notes: {
    type: String,
    default: 'Preventive nutritional evaluation for community health awareness.',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AssessmentModel = mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema);

export default AssessmentModel;
