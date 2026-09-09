import { Lead } from '../../models/Lead.js'; 
import { OtpVerification } from '../../models/OtpVerification.js'; 

// 1. Predefine the distance matrix (approximate distances in km)
const distanceMatrix = {
  mumbai: { mumbai: 0, pune: 150, nashik: 165, thane: 25, raigad: 100 },
  pune: { mumbai: 150, pune: 0, nashik: 210, thane: 140, raigad: 130 },
  nashik: { mumbai: 165, pune: 210, nashik: 0, thane: 145, raigad: 240 },
  thane: { mumbai: 25, pune: 140, nashik: 145, thane: 0, raigad: 90 },
  raigad: { mumbai: 100, pune: 130, nashik: 240, thane: 90, raigad: 0 }
};

// 2. Helper to determine Distance Category using the matrix
const determineDistanceCategory = (pickUp, dropOff) => {
  // Normalize inputs to lowercase and remove extra spaces to ensure they match our matrix keys
  const origin = pickUp.toLowerCase().trim();
  const destination = dropOff.toLowerCase().trim();

  // If the origin and destination are exactly the same city, it's a local move
  if (origin === destination) {
    return 'Short';
  }

  // Look up the distance in the matrix
  if (distanceMatrix[origin] && distanceMatrix[origin][destination] !== undefined) {
    const distanceKm = distanceMatrix[origin][destination];
    
    // Threshold: Anything over 50km is considered 'Long'
    return distanceKm > 50 ? 'Long' : 'Short';
  }

  // Fallback: If a user somehow submits a city outside our 5 predefined cities, 
  // safely default to 'Long' (or handle as an error depending on your business rules).
  return 'Long'; 
};

// 3. Helper: Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 4. Helper: Calculate Lead Score & Quality
const calculateLeadScore = (propertyType, distanceCategory, movingDate) => {
  let score = 0;
  
  // A. Urgency Score (Based on movingDate)
  const today = new Date();
  const moveDate = new Date(movingDate);
  const diffTime = moveDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  if (diffDays <= 7 && diffDays >= 0) score += 40;      // Within 7 days
  else if (diffDays > 7 && diffDays <= 30) score += 20; // Within 8-30 days
  else score += 5;                                      // 30+ days or in the past

  // B. Value Score (Based on distance and property type)
  if (distanceCategory === 'Long') score += 20;
  else if (distanceCategory === 'Short') score += 10;

  if (propertyType === 'Commercial') score += 20;
  else if (propertyType === 'Domestic') score += 10;

  // C. Determine Quality
  let quality = 'Cold';
  if (score >= 70) quality = 'Hot';
  else if (score >= 40) quality = 'Warm'; // Adjusted threshold slightly to account for the new scoring format

  return { score, quality };
};

export const createLead = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      pickUp,
      dropOff,
      propertyType, // Replaced 'services' with 'propertyType'
      movingDate,
      movingSize,
      additionalInformation
    } = req.body;

    // 1. Calculate Distance Category synchronously using the matrix
    const distanceCategory = determineDistanceCategory(pickUp, dropOff);

    // 2. Calculate Score and Quality before saving
    const { score: lead_score, quality: lead_quality } = calculateLeadScore(propertyType, distanceCategory, movingDate);

    // 3. Check for existing lead by phone (sort by newest first)
    const existingLead = await Lead.findOne({ phone }).sort({ createdAt: -1 });

    let leadId;

    if (existingLead) {
      // Scenario A: Duplicate Check (Already Verified for the exact same move)
      const isSameRoute = existingLead.pickUp === pickUp && existingLead.dropOff === dropOff;
      const isSameDate = new Date(existingLead.movingDate).getTime() === new Date(movingDate).getTime();

      if (existingLead.status === 'Verified' && isSameRoute && isSameDate) {
        const duplicateLead = await Lead.create({
          ...req.body,
          distanceCategory, // Save the calculated distance
          status: 'Duplicate',
          lead_score,
          lead_quality
        });
        return res.status(409).json({
          success: false,
          message: 'A verified request for this move already exists.',
          lead_id: duplicateLead._id
        });
      }

      // Scenario B: Pending or Re-attempt (User is trying again before verifying)
      if (existingLead.status === 'Pending' || existingLead.status === 'Re-attempt') {
        // Update the existing document
        existingLead.firstName = firstName;
        existingLead.lastName = lastName;
        existingLead.email = email;
        existingLead.pickUp = pickUp;
        existingLead.dropOff = dropOff;
        existingLead.propertyType = propertyType;
        existingLead.distanceCategory = distanceCategory; // Save the calculated distance
        existingLead.movingDate = movingDate;
        existingLead.movingSize = movingSize;
        existingLead.lead_score = lead_score;
        existingLead.additionalInformation = additionalInformation;
        existingLead.lead_quality = lead_quality;
        existingLead.status = 'Pending'; // Reset to pending for new OTP cycle
        
        await existingLead.save();
        leadId = existingLead._id;
      } else {
        // Scenario C: Old verified lead, but this is a NEW move
        const newLead = await Lead.create({
          ...req.body,
          distanceCategory,
          status: 'Pending',
          lead_score,
          lead_quality
        });
        leadId = newLead._id;
      }
    } else {
      // Scenario D: Completely new customer
      const newLead = await Lead.create({
        ...req.body,
        distanceCategory,
        status: 'Pending',
        lead_score,
        lead_quality
      });
      leadId = newLead._id;
    }

    // 4. Generate OTP and Expiry (Valid for 5 minutes)
    const otp = generateOTP();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000); 

    // 5. Save OTP to the verification collection
    await OtpVerification.create({
      lead_id: leadId,
      otp,
      expires_at
    });

    // 6. Send Response (Including OTP for easy assessment testing)
    return res.status(201).json({
      success: true,
      message: 'Lead created successfully. Please verify OTP.',
      data: {
        lead_id: leadId,
        otp: otp, 
        expires_at
      }
    });

  } catch (error) {
    // Removed the unique email check (error.code === 11000) as email is no longer unique
    console.error('Error creating lead:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error', 
      error: error.message 
    });
  }
};