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
  uploadCoverLetter as uploadCoverLetterMiddleware,
} from '../utils/multer.js';

const router = express.Router();

router.use(authMiddleware);

router.route('/').get(getApplications).post(createApplication);

router
  .route('/:id')
  .get(getApplication)
  .put(updateApplication)
  .delete(deleteApplication);

router.route('/stats').get(getStats);

router
  .post('/:id/resume', uploadResumeMiddleware, uploadApplicationResume)
  .delete(deleteFile);
router
  .post('/:id/cover-letter', uploadCoverLetterMiddleware, uploadCoverLetter)
  .delete(deleteFile);

// router.route('/:type/:filename').get(downloadFile).delete(deleteFile);

export default router;
