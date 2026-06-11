# 📚 Library Management System

A modern **Library Management System** built using **React, Tailwind CSS, Node.js, and Express**. This project helps manage students, track fee status, maintain payment history, and automatically organize due and completed payments.

---

## 🚀 Features

### 👨‍🎓 Student Management

* Add new students
* Edit student information
* Delete students
* Search students by name, seat number, or mobile number

### 💰 Fee Management

* Separate sections for:

  * Fee Due
  * Fee Complete
* Mark fees as completed
* Automatically update student status
* Maintain payment records

### 📊 Dashboard

* Total students
* Due students
* Completed students
* Payment statistics

### 📂 Data Storage

Data is stored using JSON files:

* `students.json`
* `dueStudents.json`
* `completeStudents.json`
* `paymentHistory.json`

### ⚙️ Backend

Built with:

* Node.js
* Express.js

Using:

* Routes
* Controllers
* Utility functions
* File services

---

## 🛠 Tech Stack

### Frontend

* React
* Tailwind CSS
* React Router DOM

### Backend

* Node.js
* Express.js

### Storage

* JSON files

---

## 📁 Project Structure

```text
src/
│
├── Component/
│     ├── Hero.jsx
│     ├── Navbar.jsx
│     ├── StudentForm.jsx
│     └── MainLayout.jsx
│
├── App.jsx
└── main.jsx

controllers/
routes/
utils/

students.json
dueStudents.json
completeStudents.json
paymentHistory.json

server.js
package.json
```

---

## ▶️ Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Run backend:

```bash
node server.js
```

Run frontend:

```bash
npm run dev
```

---

## ✨ Future Improvements

* MongoDB Integration
* Authentication and Login System
* Admin Dashboard
* Export Data to CSV/PDF
* Notifications and Reminders
* Cloud Database Support

---

## 🤖 AI Assistance

This project was developed with the help of AI tools for learning, code optimization, debugging, and improving project structure.

AI tools were used as assistants during development, while the implementation, understanding, customization, and overall project decisions were carried out by the developer.

---

## 👨‍💻 Developer

**Aditya**

Aspiring Full Stack Developer

Currently learning:

* React
* Node.js
* Express.js
* Data Structures and Algorithms
* Backend Development

---

### ⭐ If you like this project, consider giving it a star!
