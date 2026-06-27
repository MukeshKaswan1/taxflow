import express from 'express';
import {
  submitOtp,
  getJobStatus,
  getAllJobs,
  patchJob,
  requestResendOtp,
  revealPassword,
  adminEditJob,
} from '../controllers/jobController.js';
import { launchJob, stopJob, cloneJob } from '../controllers/orchestratorController.js';
import { authenticate, requireRole, requireUser } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Bot-only unauthenticated-style access uses WEBHOOK_SECRET via authenticate middleware
router.post(['/api/jobs/launch', '/jobs/launch'], requireUser, launchJob);
router.get(['/api/jobs', '/jobs'], requireUser, getAllJobs);
router.get(['/api/jobs/:jobId', '/jobs/:jobId'], getJobStatus);
router.get(['/api/jobs/:jobId/reveal-password', '/jobs/:jobId/reveal-password'], requireUser, requireRole('admin'), revealPassword);
router.post(['/api/jobs/:jobId/otp', '/jobs/:jobId/otp'], requireUser, submitOtp);
router.post(['/api/jobs/:jobId/resend-otp', '/jobs/:jobId/resend-otp'], requireUser, requestResendOtp);
router.patch(['/api/jobs/:jobId', '/jobs/:jobId'], patchJob);
router.post(['/api/jobs/:jobId/stop', '/jobs/:jobId/stop'], requireUser, stopJob);
router.post(['/api/jobs/:jobId/clone', '/jobs/:jobId/clone'], requireUser, cloneJob);
router.put(['/api/jobs/:jobId/admin-edit', '/jobs/:jobId/admin-edit'], requireUser, requireRole('admin'), adminEditJob);

export default router;
