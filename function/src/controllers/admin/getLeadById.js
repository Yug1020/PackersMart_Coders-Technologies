import { Lead } from '../../models/Lead.js';

export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the entire lead document
    const lead = await Lead.findById(id);

    // Handle case where lead does not exist
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: lead
    });

  } catch (error) {
    // Handle invalid MongoDB ObjectId format errors gracefully
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid lead ID format.'
      });
    }

    console.error('Error fetching lead details:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching lead details.',
      error: error.message
    });
  }
};