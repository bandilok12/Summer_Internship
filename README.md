# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

 Event Management System (MERN Stack)

A full-stack Event Management System built using the MERN stack (MongoDB, Express.js, React.js, Node.js).  
This application allows users to register, login, create events, view events, and manage event details.

---

## Features

- User Authentication (Register / Login)
- JWT-based authentication
- Create events
- View events
- Delete events
- Modern responsive UI
- MongoDB database integration
- REST API backend

---

## Tech Stack

Frontend
- React.js
- CSS / Bootstrap / Tailwind

Backend
- Node.js
- Express.js

Database
- MongoDB
- Mongoose

Authentication
- JWT
- bcryptjs

---

# Project Structure

event-management-system
│
├── client (Frontend - React)
│
├── server (Backend - Node + Express)
│
└── README.md

---

# Installation and Setup

## 1️⃣ Clone the Repository
git clone https://github.com/yourusername/event-management-system.git

- cd event-management-system

# Backend Setup
Go to the server folder

- cd server

Install dependencies

- npm install

Create `.env` file inside **server**

PORT=5000
MONGO_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your_secret_key

Run the backend server

- node index.js

Backend will run at

http://localhost:5000

---

# Frontend Setup

Open another terminal and go to client folder
- cd client

Install dependencies
- npm install

Run the frontend
- npm run dev

Frontend will run at
- http://localhost:3000
