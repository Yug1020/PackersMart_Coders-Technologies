import { Lead } from '../../models/Lead.js';

export const getPendingLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ status: 'Pending' })
      .select('firstName lastName pickUp dropOff propertyType movingDate status lead_quality createdAt')
      .sort({ createdAt: -1 });

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

    return res.status(200).json({ success: true, count: formattedLeads.length, data: formattedLeads });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching pending leads.', error: error.message });
  }
};
