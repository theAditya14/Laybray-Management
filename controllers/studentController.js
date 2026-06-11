import {
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
  markFeeComplete,
  markFeeDue,
} from '../libraryManager.js';

export async function getAllStudents(req, res) {
  try {
    const students = await getStudents();
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students', details: error.message });
  }
}

export async function createStudent(req, res) {
  try {
    const studentData = req.body;
    if (!studentData.name || !studentData.mobile || !studentData.seat) {
      return res.status(400).json({ error: 'Missing required fields: name, mobile, seat' });
    }

    const newStudent = await addStudent(studentData);
    res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Failed to add student', details: error.message });
  }
}

export async function editStudent(req, res) {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedStudent = await updateStudent(id, updatedData);
    res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student', details: error.message });
  }
}

export async function removeStudent(req, res) {
  try {
    const { id } = req.params;
    const deleted = await deleteStudent(id);
    if (!deleted) {
      return res.status(404).json({ error: `Student with ID ${id} not found` });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student', details: error.message });
  }
}

export async function completeStudent(req, res) {
  try {
    const { id } = req.params;
    const updatedStudent = await markFeeComplete(id);
    res.status(200).json({ message: 'Fee marked as complete', student: updatedStudent });
  } catch (error) {
    console.error('Error marking fee as complete:', error);
    res.status(500).json({ error: 'Failed to mark fee as complete', details: error.message });
  }
}

export async function dueStudent(req, res) {
  try {
    const { id } = req.params;
    const updatedStudent = await markFeeDue(id);
    res.status(200).json({ message: 'Fee marked as due', student: updatedStudent });
  } catch (error) {
    console.error('Error marking fee as due:', error);
    res.status(500).json({ error: 'Failed to mark fee as due', details: error.message });
  }
}
