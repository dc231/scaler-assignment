# Cal.com Clone – Scheduling Platform
A functional scheduling and booking web application built as a full-stack assignment. It allows ---
## ■ Tech Stack
## Frontend
- React.js (Vite)
- Tailwind CSS
- React Calendar
- Axios
- Date-fns
## Backend
- Node.js
- Express.js
## Database
- MySQL
---
## ■■ Features
1. **Event Types Management**
 - Create, edit, and delete meeting types (e.g., "15 Min Discovery Call")
 - Unique slug for each event type
2. **Availability Settings**
 - Configure working days and time ranges
 - Prevents overlapping availability
3. **Public Booking Page**
 - Real-time slot calculation based on availability and existing bookings
 - Prevents double booking
 - Clean Cal.com-like UI
4. **Bookings Dashboard**
 - View upcoming bookings
 - Cancel scheduled meetings
---
## ■■ Setup Instructions
## Prerequisites
- Node.js installed
- MySQL installed and running
---
## Database Setup
```sql
CREATE DATABASE calcom_clone;
USE calcom_clone;
CREATE TABLE event_types (
 id INT AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(255) NOT NULL,
 description TEXT,
 duration INT NOT NULL,
 slug VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE availability (
 id INT AUTO_INCREMENT PRIMARY KEY,
 day_of_week VARCHAR(20) NOT NULL,
 start_time TIME NOT NULL,
 end_time TIME NOT NULL,
 UNIQUE(day_of_week)
);
CREATE TABLE bookings (
 id INT AUTO_INCREMENT PRIMARY KEY,
 event_type_id INT,
 booker_name VARCHAR(255) NOT NULL,
 booker_email VARCHAR(255) NOT NULL,
 start_time DATETIME NOT NULL,
 end_time DATETIME NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (event_type_id)
 REFERENCES event_types(id)
 ON DELETE CASCADE
);
```
---
## Backend & Frontend Setup
### Backend
```bash
cd server
npm install
```
Create a `.env` file inside the `server` folder:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=calcom_clone
```
Start the backend server:
```bash
npm run dev
```
---
### Frontend
```bash
cd client
npm install
```
Start the frontend application:
```bash
npm run dev
```
---
## ■ Assumptions Made
- Single Admin User (No authentication)
- Server local time / UTC
- No payment integration
---
## ■ License
This project is created for learning and assignment purposes.