# Quick Start Guide

## Install Dependencies
```bash
npm install
```

This installs:
- `express` - Backend framework
- `cors` - Handle frontend-backend communication
- `concurrently` - Run both servers together

---

## Start Development Servers

### Option 1: Both in One Command (Easiest)
```bash
npm run dev:all
```

### Option 2: Separate Terminals
```bash
# Terminal 1
npm run server

# Terminal 2  
npm run dev
```

---

## Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

---

## What Was Updated

### New Files
- `server.js` - Express backend with 6 REST endpoints
- `SETUP_GUIDE.md` - Complete documentation

### Updated Files
- `package.json` - Added express, cors, scripts
- `src/App.jsx` - Fetches students from backend on load
- `src/Component/StudentForm.jsx` - Uses fetch() to POST new students
- `src/Component/Hero.jsx` - Uses fetch() for DELETE and PATCH requests

### Existing Files (No Changes Needed)
- `libraryManager.js` - Already handles all file operations
- `students.json` - Auto-synced by backend
- `dueStudents.json` - Auto-synced by backend
- `completeStudents.json` - Auto-synced by backend

---

## How It Works

```
User Action → React Component
    ↓
fetch() sends request
    ↓
Express Server (server.js)
    ↓
libraryManager.js (handles fs operations)
    ↓
JSON Files Updated
    ↓
Response sent back to React
    ↓
UI Updates Automatically
```

---

## Features

✅ Add students  
✅ Delete students  
✅ Mark fees as complete  
✅ Mark fees as due  
✅ Real-time UI updates  
✅ Error handling  
✅ Loading states  
✅ Auto-synced JSON files  

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot fetch students" | Start backend: `npm run server` |
| "Address already in use" | Port 3000 is taken, kill it or change PORT in server.js |
| CORS errors | cors is enabled by default in server.js |
| No students appearing | Check backend logs and students.json file |

---

**See SETUP_GUIDE.md for complete documentation**
