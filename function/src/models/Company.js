import mongoose from "mongoose";

const supportedCities = ['Mumbai', 'Pune', 'Nashik', 'Thane', 'Raigad'];

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    coverageAreas: [{
      type: String,
      enum: supportedCities,
      required: true
    }],
    serviceTypes: [{
      type: String,
      enum: ['Domestic', 'Commercial'],
      required: true
    }],
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Company = mongoose.model('Company', companySchema);