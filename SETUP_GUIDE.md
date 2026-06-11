# Library Management System - Complete Setup Guide

## Overview

This is a full-stack Library Management System with:
- **Backend**: Express.js server with REST API
- **Frontend**: React with Vite
- **Storage**: JSON files managed by Node.js fs module

---

## 📦 Required npm Packages

The following packages need to be installed:

### Dependencies (Added to package.json)
- **express** `^4.18.2` - Backend web framework
- **cors** `^2.8.5` - Handle Cross-Origin requests between frontend and backend

### Dev Dependencies (Already in package.json)
- **concurrently** `^8.2.0` - Run both server and frontend simultaneously

---

## 🚀 Installation Steps

### Step 1: Install Dependencies

Open your terminal in the project root and run:

```bash
npm install
```

This will install:
- express
- cors
- All existing React and Vite dependencies

---

## 🏃 How to Run the Application

### Option 1: Run Backend and Frontend Separately (Recommended for Development)

#### Terminal 1 - Start Backend Server
```bash
npm run server
```

You should see:
```
╔════════════════════════════════════════╗
║ Library Management Server              ║
║ Running on http://localhost:3000       ║
╚════════════════════════════════════════╝
```

#### Terminal 2 - Start Frontend (Vite Dev Server)
```bash
npm run dev
```

The React app will be available at: `http://localhost:5173`

---

### Option 2: Run Both Simultaneously (One Command)

```bash
npm run dev:all
```

This uses `concurrently` to run both servers in the same terminal.

---

## 📊 Project Structure

```
Laybray Management/
│
├── server.js                          (Express backend)
├── libraryManager.js                  (File operations logic)
├── students.json                      (All students)
├── dueStudents.json                   (Students with pending fees)
├── completeStudents.json              (Students with completed fees)
├── package.json                       (Updated with new scripts)
│
├── src/
│   ├── App.jsx                        (Updated - fetches from backend)
│   ├── Component/
│   │   ├── StudentForm.jsx            (Updated - POST requests)
│   │   ├── Hero.jsx                   (Updated - DELETE/PATCH requests)
│   │   ├── Navbar.jsx
│   │   └── MainLaybout.jsx
│   ├── index.css
│   └── main.jsx
│
├── public/
├── vite.config.js
└── index.html
```

---

## 🔌 API Endpoints

All endpoints are available at `http://localhost:3000/students` (unless otherwise specified)

### 1. GET /students
**Fetch all students**
```javascript
fetch('http://localhost:3000/students')
  .then(res => res.json())
  .then(students => console.log(students))
```

### 2. POST /students
**Add a new student**
```javascript
fetch('http://localhost:3000/students', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    date: '2025-06-10',
    name: 'John Doe',
    mobile: '9876543210',
    seat: 'A-1',
    feeStatus: 'due'
  })
})
```

### 3. DELETE /students/:id
**Delete a student**
```javascript
fetch('http://localhost:3000/students/abc-123-def', {
  method: 'DELETE'
})
```

### 4. PUT /students/:id
**Update student information**
```javascript
fetch('http://localhost:3000/students/abc-123-def', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane Doe',
    mobile: '9876543211'
  })
})
```

### 5. PATCH /students/:id/complete
**Mark fee as complete**
```javascript
fetch('http://localhost:3000/students/abc-123-def/complete', {
  method: 'PATCH'
})
```

### 6. PATCH /students/:id/due
**Mark fee as due**
```javascript
fetch('http://localhost:3000/students/abc-123-def/due', {
  method: 'PATCH'
})
```

---

## 🔄 Data Flow

### Adding a Student
1. User fills StudentForm.jsx
2. Form submits → `POST /students`
3. Backend adds student to `students.json`
4. Backend also adds to `dueStudents.json` (default status: "due")
5. Frontend fetches updated list
6. UI updates automatically

### Marking Fee as Complete
1. User clicks "Done" button in Hero.jsx
2. Button triggers → `PATCH /students/:id/complete`
3. Backend updates student's `feeStatus` to "complete"
4. Removes from `dueStudents.json`
5. Adds to `completeStudents.json`
6. Frontend updates UI

### Marking Fee as Due
1. User clicks any button that triggers → `PATCH /students/:id/due`
2. Backend updates student's `feeStatus` to "due"
3. Removes from `completeStudents.json`
4. Adds to `dueStudents.json`
5. Frontend updates UI

### Deleting a Student
1. User clicks "Delete" button in Hero.jsx
2. Button triggers → `DELETE /students/:id`
3. Backend removes from all JSON files
4. Frontend updates UI

---

## 🗂️ JSON File Synchronization

The backend automatically keeps all three files synchronized:

**students.json** - Contains ALL students
```json
[
  {
    "id": "uuid-1234-5678",
    "date": "2025-06-10",
    "name": "John Doe",
    "mobile": "9876543210",
    "seat": "A-1",
    "feeStatus": "due",
    "lastPaidDate": "",
    "nextFeeDate": ""
  }
]
```

**dueStudents.json** - Only students with `feeStatus: "due"`
```json
[
  {
    "id": "uuid-1234-5678",
    "date": "2025-06-10",
    "name": "John Doe",
    "mobile": "9876543210",
    "seat": "A-1",
    "feeStatus": "due",
    "lastPaidDate": "",
    "nextFeeDate": ""
  }
]
```

**completeStudents.json** - Only students with `feeStatus: "complete"`
```json
[
  {
    "id": "uuid-9999-0000",
    "date": "2025-06-08",
    "name": "Jane Doe",
    "mobile": "9876543211",
    "seat": "B-2",
    "feeStatus": "complete",
    "lastPaidDate": "2025-06-08",
    "nextFeeDate": "2025-07-08"
  }
]
```

---

## 🐛 Troubleshooting

### Frontend shows "Error: Failed to fetch students"
**Solution**: Make sure the backend server is running on `http://localhost:3000`
```bash
# Terminal 1
npm run server
```

### Backend won't start - "Address already in use"
The port 3000 is already in use. Either:
1. Kill the process using port 3000
2. Change PORT in server.js to a different port (e.g., 3001)

### CORS errors in browser console
Make sure `cors` middleware is enabled in server.js (it already is by default)

### Students not appearing in frontend
1. Check browser console for fetch errors
2. Verify backend is running
3. Check that students.json has data

---

## ✨ Features Implemented

✅ Add new students with automatic ID generation (UUID)
✅ Separate students by fee status (Due/Complete)
✅ Mark fees as complete/due with one click
✅ Delete students permanently
✅ Update student information
✅ Real-time UI updates using React hooks
✅ Error handling and user feedback
✅ Loading states for async operations
✅ Automatic file synchronization
✅ Pretty JSON formatting for readability
✅ CORS enabled for frontend-backend communication
✅ Beginner-friendly code with detailed comments

---

## 📝 Example Usage

After running both servers:

1. Open `http://localhost:5173` in your browser
2. Click "Student Form" in the navbar
3. Fill in the form with student details
4. Click "Add Student"
5. Go to "Home" to see the student in "Fee Due"
6. Click "Done" to move to "Fee Complete"
7. Click "Delete" to remove from "Fee Complete"

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, TailwindCSS, React Router
- **Backend**: Express.js, CORS
- **Storage**: JSON files with Node.js fs module
- **Build Tool**: Vite
- **Package Manager**: npm

---

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the terminal where the server is running
3. Verify all files are in the correct location
4. Make sure ports 3000 and 5173 are available
5. Ensure all npm packages are installed: `npm install`

---

**Happy coding! 🚀**
