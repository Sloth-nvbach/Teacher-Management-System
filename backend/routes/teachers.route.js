import express from 'express';
import teachersController from '../controllers/teachers.controller.js';

const router = express.Router();

router.get('/', teachersController.getAllTeachers);
router.post('/', teachersController.createTeacher);

export default router;
