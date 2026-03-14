# Scheduler App


## Features
- User Authentication (Signup/Login).
- Define availability for multiple dates.
- Generate a unique booking link.
- Book 30-minute slots.
- Prevent double booking.

## Tech Stack
- **Frontend**: React (Vite), Axios, React Router.
- **Backend**: Node.js, Express, MySQL.
- **Database**: MySQL.

## Prerequisites
- Node.js installed.
- MySQL server running.

## Database Setup
1. Open your MySQL client (e.g., MySQL Workbench, Command Line).
2. Run the script found in `database/schema.sql`:
   

## Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add your database credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=scheduler_db
   ```
4. Run the backend server:
   ```bash
   npm run dev
   ```

## Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `backend/`: Express server and API logic.
- `frontend/`: React application.
- `database/`: SQL schema files.
