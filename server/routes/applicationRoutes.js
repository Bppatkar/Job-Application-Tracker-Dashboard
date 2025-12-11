import express from 'express';
import {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  getStats,
  uploadApplicationResume,
  uploadCoverLetter,
  downloadFile,
  deleteFile,
} from '../controller/applicationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  uploadResume as uploadResumeMiddleware,
  uploadMultiple,
} from '../utils/multer.js';

const router = express.Router();

router.use(authMiddleware);

router.route('/').get(getApplications).post(createApplication);
router.route('/stats').get(getStats);
router
  .route('/:id')
  .get(getApplication)
  .put(updateApplication)
  .delete(deleteApplication);

router.post(
  '/applications/:id/resume',
  uploadResumeMiddleware,
  uploadApplicationResume
);
router.post(
  '/applications/:id/cover-letter',
  uploadResumeMiddleware,
  uploadCoverLetter
);
router.route('/:type/:filename').get(downloadFile).delete(deleteFile);

export default router;
