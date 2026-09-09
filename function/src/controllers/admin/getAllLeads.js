import { Lead } from '../../models/Lead.js';

export const getAllLeads = async (req, res) => {
  try {
    // Fetch all leads, sorted by newest first, selecting only the necessary fields
    const leads = await Lead.find({})
      .select('firstName lastName pickUp dropOff propertyType movingDate status lead_quality createdAt')
      .sort({ createdAt: -1 });

    // Format the output to explicitly match the admin display requirements
    const formattedLeads = leads.map(lead => ({
      leadId: lead._id,
      customerName: `${lead.firstName} ${lead.lastName}`,
      pickupCity: lead.pickUp,
      destination: lead.dropOff,
      serviceType: lead.propertyType,
      date: lead.movingDate,
      leadQuality: lead.lead_quality,
      currentStatus: lead.status
    }));

    return res.status(200).json({
      success: true,
      count: formattedLeads.length,
      data: formattedLeads
    });

  } catch (error) {
    console.error('Error fetching admin leads:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching leads.',
      error: error.message
    });
  }
};
