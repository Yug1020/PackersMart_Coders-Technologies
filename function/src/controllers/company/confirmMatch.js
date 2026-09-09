import { Lead } from '../../models/Lead.js';
import { Company } from '../../models/Company.js';
import { Match } from '../../models/Match.js';

export const confirmMatch = async (req, res) => {
  try {
    // Extract both IDs from the URL parameters
    const { lead_id, company_id } = req.params;

    if (!lead_id || !company_id) {
      return res.status(400).json({ success: false, message: 'Both Lead ID and Company ID are required in the URL.' });
    }

    // 1. Verify Lead exists and is not already matched
    const lead = await Lead.findById(lead_id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }
    if (lead.status === 'Matched') {
      return res.status(400).json({ success: false, message: 'Lead is already matched.' });
    }

    // 2. Verify Company exists and is active
    const company = await Company.findById(company_id);
    if (!company || !company.isActive) {
      return res.status(404).json({ success: false, message: 'Company not found or inactive.' });
    }

    // 3. Create the Match document
    const newMatch = await Match.create({
      lead_id,
      company_id
    });

    // 4. Update the Lead status to 'Matched'
    lead.status = 'Matched';
    await lead.save();

    return res.status(201).json({
      success: true,
      message: 'Lead successfully matched with company.',
      data: newMatch
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A match record already exists for this lead.' });
    }

    console.error('Error confirming match:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
  }
};