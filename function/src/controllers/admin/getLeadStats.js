import { Lead } from '../../models/Lead.js';

export const getLeadStats = async (req, res) => {
  try {
    // Execute all database count queries concurrently for maximum performance
    const [
      total,
      verified,
      pending,
      duplicate,
      fake,
      matched,
      hot,
      warm,
      cold
    ] = await Promise.all([
      Lead.countDocuments({}),
      Lead.countDocuments({ status: 'Verified' }),
      Lead.countDocuments({ status: 'Pending' }),
      Lead.countDocuments({ status: 'Duplicate' }),
      Lead.countDocuments({ status: 'Fake' }),
      Lead.countDocuments({ status: 'Matched' }),
      Lead.countDocuments({ lead_quality: 'Hot' }),
      Lead.countDocuments({ lead_quality: 'Warm' }),
      Lead.countDocuments({ lead_quality: 'Cold' })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalLeads: total,
        status: {
          verified,
          pending,
          duplicate,
          fake,
          matched
        },
        quality: {
          hot,
          warm,
          cold
        }
      }
    });

  } catch (error) {
    console.error('Error fetching lead statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching statistics.',
      error: error.message
    });
  }
};