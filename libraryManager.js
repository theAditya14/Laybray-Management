import { randomUUID } from 'crypto';
import {
  ensureAllDataFiles,
  readJson,
  writeJson,
  studentsPath,
  dueStudentsPath,
  completeStudentsPath,
  paymentHistoryPath,
} from './utils/fileService.js';

function formatDate(date) {
  const dt = new Date(date);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addMonths(date, count) {
  const dt = new Date(date);
  const day = dt.getDate();
  dt.setMonth(dt.getMonth() + count);
  if (dt.getDate() !== day) {
    dt.setDate(0);
  }
  return dt;
}

function getMonthLabel(dateString) {
  const dt = new Date(dateString);
  return dt.toLocaleString('default', { month: 'long', year: 'numeric' });
}

async function syncFiles(students) {
  const dueStudents = students.filter((student) => student.feeStatus === 'due');
  const completeStudents = students.filter((student) => student.feeStatus === 'complete');

  await Promise.all([
    writeJson(studentsPath, students),
    writeJson(dueStudentsPath, dueStudents),
    writeJson(completeStudentsPath, completeStudents),
  ]);
}

async function readStudentsFile() {
  return await readJson(studentsPath);
}

async function getStudents() {
  await ensureAllDataFiles();
  const students = await readStudentsFile();
  return await checkExpiredFees(students);
}

async function addPaymentHistoryRecord(record) {
  await ensureAllDataFiles();
  const history = await readJson(paymentHistoryPath);
  history.push(record);
  await writeJson(paymentHistoryPath, history);
  return record;
}

async function getPaymentHistory() {
  await ensureAllDataFiles();
  return await readJson(paymentHistoryPath);
}

async function getBackupData() {
  await ensureAllDataFiles();

  const [students, dueStudents, completeStudents, paymentHistory] = await Promise.all([
    readJson(studentsPath),
    readJson(dueStudentsPath),
    readJson(completeStudentsPath),
    readJson(paymentHistoryPath),
  ]);

  return { students, dueStudents, completeStudents, paymentHistory };
}

async function checkExpiredFees(students = null) {
  const currentStudents = students || (await readStudentsFile());
  const today = new Date();
  let changed = false;

  const updatedStudents = currentStudents.map((student) => {
    if (student.feeStatus !== 'complete' || !student.nextFeeDate) {
      return student;
    }

    const nextFeeDate = new Date(student.nextFeeDate);
    if (!Number.isNaN(nextFeeDate.getTime()) && today >= nextFeeDate) {
      changed = true;
      return {
        ...student,
        feeStatus: 'due',
      };
    }

    return student;
  });

  if (changed) {
    await syncFiles(updatedStudents);
  }

  return updatedStudents;
}

async function addStudent(student) {
  const students = await getStudents();
  const newStudent = {
    id: randomUUID(),
    date: student.date || formatDate(new Date()),
    name: student.name || '',
    mobile: student.mobile || '',
    seat: student.seat || '',
    amount: student.amount ? Number(student.amount) : 0,
    feeStatus: student.feeStatus === 'complete' ? 'complete' : 'due',
    lastPaidDate: student.lastPaidDate || '',
    nextFeeDate: student.nextFeeDate || '',
  };

  students.push(newStudent);
  await syncFiles(students);
  return newStudent;
}

async function deleteStudent(id) {
  const students = await getStudents();
  const filtered = students.filter((student) => student.id !== id);
  if (filtered.length === students.length) {
    return false;
  }

  await syncFiles(filtered);
  return true;
}

async function updateStudent(id, updatedStudent) {
  const students = await getStudents();
  let found = false;

  const updatedList = students.map((student) => {
    if (student.id !== id) {
      return student;
    }

    found = true;
    return {
      ...student,
      ...updatedStudent,
      id: student.id,
      amount: updatedStudent.amount !== undefined ? Number(updatedStudent.amount) : student.amount || 0,
      feeStatus: ['due', 'complete'].includes(updatedStudent.feeStatus)
        ? updatedStudent.feeStatus
        : student.feeStatus,
      lastPaidDate: updatedStudent.lastPaidDate !== undefined ? updatedStudent.lastPaidDate : (student.lastPaidDate || ''),
      nextFeeDate: updatedStudent.nextFeeDate !== undefined ? updatedStudent.nextFeeDate : (student.nextFeeDate || ''),
    };
  });

  if (!found) {
    throw new Error(`Student with id ${id} not found.`);
  }

  await syncFiles(updatedList);
  return updatedList.find((student) => student.id === id);
}

async function markFeeComplete(id) {
  const students = await getStudents();
  let found = false;

  const updatedList = students.map((student) => {
    if (student.id !== id) {
      return student;
    }

    found = true;
    const paidDate = formatDate(new Date());
    const nextFeeDate = formatDate(addMonths(paidDate, 1));

    return {
      ...student,
      feeStatus: 'complete',
      lastPaidDate: paidDate,
      nextFeeDate,
      amount: student.amount ? Number(student.amount) : 0,
    };
  });

  if (!found) {
    throw new Error(`Student with id ${id} not found.`);
  }

  await syncFiles(updatedList);
  const updatedStudent = updatedList.find((student) => student.id === id);

  const record = {
    studentId: updatedStudent.id,
    name: updatedStudent.name,
    paidDate: updatedStudent.lastPaidDate,
    amount: updatedStudent.amount || 0,
    seat: updatedStudent.seat,
    month: getMonthLabel(updatedStudent.lastPaidDate),
  };

  await addPaymentHistoryRecord(record);
  return updatedStudent;
}

async function markFeeDue(id) {
  const students = await getStudents();
  let found = false;

  const updatedList = students.map((student) => {
    if (student.id !== id) {
      return student;
    }

    found = true;
    return {
      ...student,
      feeStatus: 'due',
    };
  });

  if (!found) {
    throw new Error(`Student with id ${id} not found.`);
  }

  await syncFiles(updatedList);
  return updatedList.find((student) => student.id === id);
}

await ensureAllDataFiles();

export {
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
  markFeeComplete,
  markFeeDue,
  getPaymentHistory,
  getBackupData,
};
