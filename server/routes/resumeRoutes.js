import express from 'express';
import { 
    createResume, getResumeById, updateResume, enhanceProfessionalSummary,
    getUserResumes, deleteResume, parseResumeFromPDF // <--- Import these
} from '../controllers/resumeController.js';
import userAuth from '../middleware/userAuth.js';

// --- CHANGE IS HERE ---
// Humne curly braces {} lagaye hain aur sahi naam use kiya hai
import { uploadResumeImage } from '../middleware/multer.js'; 

const router = express.Router();

router.post('/create', userAuth, createResume);
router.get('/get/:resumeId', userAuth, getResumeById);

// --- AND HERE ---
// upload.single ki jagah uploadResumeImage.single
router.put('/update', userAuth, uploadResumeImage.single('image'), updateResume);

router.post('/enhance-summary', userAuth, enhanceProfessionalSummary);
router.get('/all', userAuth, getUserResumes);
router.delete('/delete/:resumeId', userAuth, deleteResume);
router.post('/parse', userAuth, parseResumeFromPDF);

export default router;