import express from 'express';
// import {
//   getApplications,
//   getApplication,
//   createApplication,
//   updateApplication,
//   deleteApplication,
//   getStats,
// } from '../controller/applicationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// router.use(authMiddleware);

// router.route('/').get(getApplications).post(createApplication);
// router.route('/stats').get(getStats);
// router
//   .route('/:id')
//   .get(getApplication)
//   .put(updateApplication)
//   .delete(deleteApplication);

export default router;
