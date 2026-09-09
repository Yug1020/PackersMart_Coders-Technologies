import { Lead } from '../../models/Lead.js';
import { Company } from '../../models/Company.js';

export const getMatchingCompanies = async (req, res) => {
  try {
    const { lead_id: leadId } = req.params;

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    // <-- NEW CHECK: Ensure lead is Verified before searching for companies
    if (lead.status !== 'Verified') {
      let errorMessage = 'Only verified leads can be matched with companies.';
      if (lead.status === 'Matched') {
        errorMessage = 'This lead has already been matched with a company.';
      } else if (lead.status === 'Pending' || lead.status === 'Re-attempt') {
        errorMessage = 'This lead is pending OTP verification.';
      } else {
        errorMessage = `Cannot search matches for a lead with status: ${lead.status}.`;
      }

      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const matchingCompanies = await Company.find({
      isActive: true,
      coverageAreas: { $all: [lead.pickUp, lead.dropOff] },
      serviceTypes: { $in: [lead.propertyType] }
    }).sort({ rating: -1, _id: 1 });

    if (matchingCompanies.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No matching companies available for this route and service type.',
        data: []
      });
    }

    let suggestedCompany;
    if (lead.lead_quality === 'Hot') {
      suggestedCompany = matchingCompanies[0]; 
    } else {
      suggestedCompany = matchingCompanies[1] || matchingCompanies[0]; 
    }

    return res.status(200).json({
      success: true,
      lead_quality: lead.lead_quality,
      matchCount: matchingCompanies.length,
      suggestedMatch: suggestedCompany,
      allMatches: matchingCompanies
    });

  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid lead ID format.' });
    }
    console.error('Error fetching matching companies:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
  }
};