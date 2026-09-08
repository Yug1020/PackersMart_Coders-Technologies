import mongoose from 'mongoose';

const otpVerificationSchema = new mongoose.Schema({
  lead_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead', // Must match the name of your Lead model exactly
    required: [true, 'Lead ID is required to associate the OTP']
  },
  otp: {
    type: String,
    required: [true, 'OTP is required'],
    match: [/^\d{6}$/, 'OTP must be exactly 6 numeric digits'], 
  },
  expires_at: {
    type: Date,
    required: [true, 'Expiration time is required']
  },
  verified_at: {
    type: Date,
    default: null // Null until successfully verified
  },
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true // Prevents accidental modification after creation
  }
});

// TTL Index: Automatically deletes the document when the current time reaches `expires_at`
otpVerificationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

const OtpVerification = mongoose.model('OtpVerification', otpVerificationSchema);

export { OtpVerification };