import { OtpVerification } from '../../models/OtpVerification.js';
import { Lead } from '../../models/Lead.js';

export const verifyOtp = async (req, res) => {
  try {
    const { id: lead_id } = req.params; // Extract ID from the URL
    const { otp } = req.body;           // Extract OTP from the request body

    // 1. Basic validation
    if (!lead_id || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Lead ID in URL and OTP in body are required for verification.'
      });
    }

    // 2. Find the most recent OTP record for this lead
    const otpRecord = await OtpVerification.findOne({ lead_id }).sort({ created_at: -1 });

    // 3. Check if record exists (TTL index might have deleted it if expired)
    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: 'OTP not found or has expired. Please request a new one.'
      });
    }

    // 4. Check if it's already verified
    if (otpRecord.verified_at !== null) {
      return res.status(400).json({
        success: false,
        message: 'This OTP has already been verified.'
      });
    }

    // 5. Verify the OTP matches
    if (otpRecord.otp !== otp) {
      return res.status(401).json({
        success: false,
        message: 'Invalid OTP provided.'
      });
    }

    // 6. Double-check expiration (just in case the TTL index is lagging)
    if (new Date() > otpRecord.expires_at) {
      return res.status(401).json({
        success: false,
        message: 'This OTP has expired. Please request a new one.'
      });
    }

    // 7. All good! Update the OTP record and the Lead
    otpRecord.verified_at = new Date();
    await otpRecord.save();

    await Lead.findByIdAndUpdate(lead_id, { status: 'Verified' });

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully. Lead is now verified!'
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during verification',
      error: error.message
    });
  }
};