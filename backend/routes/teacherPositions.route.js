import express from 'express';
import teacherPositionsController from '../controllers/teacherPositions.controller.js';

const router = express.Router();

router.get('/', teacherPositionsController.getAllPositions);
router.post('/', teacherPositionsController.createPosition);

export default router;
