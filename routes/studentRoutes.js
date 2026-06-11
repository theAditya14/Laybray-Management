import express from 'express';
import {
  getAllStudents,
  createStudent,
  editStudent,
  removeStudent,
  completeStudent,
  dueStudent,
} from '../controllers/studentController.js';

const router = express.Router();

router.get('/', getAllStudents);
router.post('/', createStudent);
router.put('/:id', editStudent);
router.delete('/:id', removeStudent);
router.patch('/:id/complete', completeStudent);
router.patch('/:id/due', dueStudent);

export default router;
