import Application from '../models/Application.js';

export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id }).sort({
      appliedDate: -1,
    });
    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server-error',
      error: error.message,
    });
  }
};

export const createApplication = async (req, res) => {
  try {
    const { company, position, jobLink, status, notes, salary } = req.body;

    const application = await Application.create({
      user: req.user.id,
      company,
      position,
      jobLink,
      status,
      notes,
      salary,
    });

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server-error',
      error: error.message,
    });
  }
};

export const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // making sure that user own that application
    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server-error',
      error: error.message,
    });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    application = await Application.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server-error',
      error: error.message,
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }
    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server-error',
      error: error.message,
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await Application.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const totalApplication = await Application.countDocuments({
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      stats,
      total: totalApplications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server-error',
      error: error.message,
    });
  }
};
