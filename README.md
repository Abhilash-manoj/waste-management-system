# Waste Disposal and Reporting System

A web-based application designed to improve waste management processes by facilitating communication between members, workers, and administrators.  

This system streamlines the waste collection process by allowing **members** to submit requests, **workers** to manage tasks, and **administrators** to oversee and monitor performance.  

---

##  Features

###  Member
- Register and log in securely.  
- Submit waste collection requests with details (waste type, house number, ward number, preferred collection date).  
- View request status updates.  
- Edit profile (including profile picture).  
- Receive email notifications when workers confirm a task.  

###  Worker
- View and accept pending tasks (sorted by urgency).  
- Reschedule and update task statuses.  
- Mark tasks as completed.  
- Edit profile (with optional profile picture).  
- Compete for **Employee of the Month** (highest completed tasks).  

###  Admin
- Add, manage, and delete user accounts.  
- Monitor tasks and performance across wards.  
- Generate reports for completed/pending tasks.  
- Search users and workers.  
- Award **Employee of the Month** badge automatically.  

---

## Tech Stack

### Frontend
- **HTML** – Structure  
- **CSS** – Styling  
- **JavaScript** – Interactivity  

### Backend
- **Node.js** – Server-side logic  
- **Express.js** – API routes and middleware  

### Database
- **MySQL** – Relational database for storing users, requests, and reports  

---

##  Project Modules

1. **Member Module** – Request management and status tracking.  
2. **Worker Module** – Task handling, scheduling, and completion.  
3. **Admin Module** – User and task management, reporting.  
4. **Database Module** – Secure storage of all users, requests, feedback, and reports.  

---

## Project Structure
```
waste-management-system/
│
├── backend/
│   ├── server.js               # Entry point
│   ├── routes/                 # API endpoints
│   ├── controllers/            # Request handlers
│   ├── models/                 # OOP classes (User, Member, Worker, Admin, etc.)
│   ├── services/               # Business logic
│   ├── config/                 # Database configuration
│   └── utils/                  # Helpers (validators, email, etc.)
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── main.js
│
└── README.md
```

---

##  Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/waste-management-system.git
   cd waste-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in `backend/`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=yourpassword
   DB_NAME=waste_management
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

5. Open `frontend/index.html` in a browser to access the UI.

---

##  Database Schema (MySQL)

- **Users** (id, name, email, password, role, house_number, ward_number, profile_picture)  
- **WasteRequests** (id, member_id, waste_type, ward_number, preferred_date, assigned_worker_id, status)  
- **Feedback** (id, request_id, member_id, comments, date_submitted)  
- **Reports** (id, admin_id, generated_on, details)  

---

##  References

- [HTML](https://www.w3schools.com/html/default.asp)  
- [CSS](https://www.w3schools.com/css/default.asp)  
- [JavaScript](https://www.w3schools.com/js/default.asp)  
- [Node.js](https://nodejs.org/en/)  
- [Express.js](https://expressjs.com/)  
- [MySQL](https://dev.mysql.com/doc/)  

---

##  Contributors

- Abdul Rahman Y [20423501]  
- Abhilash Manoj [20423502]  
- Abhinand A [20423503]  
- Abhin Madhav R [20423504]  
- Abhishek Raj [20423505]  
