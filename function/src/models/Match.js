import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    lead_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      unique: true // Ensures a lead can only be matched once
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    }
  },
  { timestamps: true } // Automatically creates createdAt and updatedAt
);

export const Match = mongoose.model('Match', matchSchema);