import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLaybout from './Component/MainLaybout';
import Hero from './Component/Hero';
import StudentForm from './Component/StudentForm';

const API_URL = 'http://localhost:3000';

export default function App() {
  const [students, setStudents] = useState([]);
  const [feeComplete, setFeeComplete] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/students`);
      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.statusText}`);
      }

      const data = await response.json();
      setAllStudents(data);
      setStudents(data.filter((student) => student.feeStatus === 'due'));
      setFeeComplete(data.filter((student) => student.feeStatus === 'complete'));
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDueStudents = () => {
    setStudents(allStudents.filter((student) => student.feeStatus === 'due'));
  };

  const fetchCompleteStudents = () => {
    setFeeComplete(allStudents.filter((student) => student.feeStatus === 'complete'));
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/paymentHistory`);
      if (!response.ok) {
        throw new Error(`Failed to fetch payment history: ${response.statusText}`);
      }
      const history = await response.json();
      setPaymentHistory(history);
    } catch (err) {
      console.error('Error fetching payment history:', err);
    }
  };

  const refreshAllData = async () => {
    await fetchStudents();
    await fetchPaymentHistory();
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLaybout />,
      children: [
        {
          index: true,
          element: (
            <Hero
              students={students}
              feeComplete={feeComplete}
              paymentHistory={paymentHistory}
              loading={loading}
              error={error}
              refreshAllData={refreshAllData}
            />
          ),
        },
        {
          path: 'Home',
          element: (
            <Hero
              students={students}
              feeComplete={feeComplete}
              paymentHistory={paymentHistory}
              loading={loading}
              error={error}
              refreshAllData={refreshAllData}
            />
          ),
        },
        {
          path: 'StudentForm',
          element: (
            <StudentForm
              onStudentAdded={refreshAllData}
            />
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
