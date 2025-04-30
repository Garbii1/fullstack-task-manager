# Full-Stack Task Management App (TaskMaster Pro - Monorepo)

A comprehensive task management web application built with the MERN stack (MongoDB, Express, React, Node.js) plus real-time capabilities using Socket.IO, all managed within a single repository. Organize your tasks efficiently with features like categorization, deadlines, priorities, a Kanban board, and a calendar view.

**[View Live Demo](https://fullstack-task-manager-alpha.vercel.app/)**

![TaskMaster Pro Homepage Screenshot](./screenshots/homepage.jpeg)
![TaskMaster Pro Register Screenshot](./screenshots/register.jpeg)
![TaskMaster Pro Login Screenshot](./screenshots/login.jpeg)
![TaskMaster Pro Dark Mode Screenshot](./screenshots/darkmode.jpeg)
![TaskMaster Pro Dashboard Screenshot](./screenshots/dashboard.jpeg)
![TaskMaster Pro List View Screenshot](./screenshots/listview.jpeg)
![TaskMaster Pro Kanbanboard Screenshot](./screenshots/kanbanboard.jpeg)
![TaskMaster Pro Calendar View Screenshot](./screenshots/calendarview.jpeg)

## Overview

This project is a full-stack web application designed to help users manage their tasks effectively. Users can perform CRUD operations on tasks, assign various properties like categories, priorities, and deadlines, and visualize their workflow using different views like a list, a drag-and-drop Kanban board, and a calendar. Real-time synchronization ensures that changes are reflected instantly across all connected clients. The application also features JWT-based authentication, a responsive design, and a dark/light theme toggle. Both the frontend and backend code are contained within this single repository.

## Features Implemented

-   [x] **User Authentication:** Secure JWT-based Register & Login.
-   [x] **Task CRUD:** Create, Read, Update, and Delete tasks.
-   [x] **Task Properties:** Assign Categories (Work, Personal, Hobby, Other), Deadlines, Priority (High, Medium, Low), and Status (Not Started, In Progress, Completed).
-   [x] **Kanban Board View:** Visualize tasks by status with drag-and-drop functionality (`react-beautiful-dnd`).
-   [x] **Calendar View:** View tasks based on their deadlines (`react-calendar`).
-   [x] **List View:** Simple list display of tasks.
-   [x] **Real-time Updates:** Instant synchronization across clients using WebSockets (`socket.io`).
-   [x] **Dark/Light Mode Toggle:** User preference saved in local storage.
-   [x] **Responsive Design:** Adapts to Mobile, Tablet, and Desktop screens.
-   [x] **Homepage:** Landing page for unauthenticated users.
-   [x] **Protected Routes:** Dashboard and task-related actions require login.
-   [x] **Loading & Empty States:** User-friendly indicators.
-   [x] **Error Handling:** Notifications for API or validation errors.
-   [x] **Modal Popups:** Used for editing tasks smoothly.

## Tech Stack

**Frontend (`task-manager-frontend` directory):**
*   React.js (v18)
*   React Router (`react-router-dom`) for routing
*   Axios for API requests
*   Socket.IO Client (`socket.io-client`) for real-time communication
*   React Beautiful DnD (`react-beautiful-dnd`) for drag & drop
*   React Calendar (`react-calendar`) for calendar view
*   `date-fns` for date formatting
*   CSS (with CSS Variables for theming)

**Backend (`task-manager-backend` directory):**
*   Node.js
*   Express.js framework
*   MongoDB Atlas (Cloud Database - Free Tier)
*   Mongoose (ODM for MongoDB)
*   Socket.IO (`socket.io`) for real-time communication
*   JSON Web Token (`jsonwebtoken`) for authentication
*   `bcryptjs` for password hashing
*   `cors` for handling Cross-Origin Resource Sharing
*   `dotenv` for environment variables

**Database:**
*   MongoDB (via MongoDB Atlas Free Tier)

**Deployment:**
*   Frontend: Vercel (Free Plan)
*   Backend: Render (Free Plan)

## Getting Started

Follow these steps to set up and run the project locally from this monorepo.

**Prerequisites:**

*   [Node.js](https://nodejs.org/) (v18 or later recommended) and npm (or yarn)
*   [Git](https://git-scm.com/)
*   A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and your connection string

**Installation & Setup:**

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Garbii1/fullstack-task-manager.git
    cd fullstack-task-manager
    ```
    *You are now in the root directory of the monorepo.*

2.  **Setup Backend (Terminal 1):**
    *   Navigate to the backend project folder:
        ```bash
        cd task-manager-backend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create an environment file named `.env` in the `task-manager-backend` directory.
    *   Add your environment variables to the `.env` file:
        ```dotenv
        # MongoDB Atlas connection string
        MONGO_URI=<your_mongodb_atlas_connection_string>

        # JWT secret key for authentication (choose a strong, random string)
        JWT_SECRET=<your_strong_jwt_secret>

        # Port the backend server will run on
        PORT=5000

        # Frontend origin allowed for CORS during development
        CORS_ORIGIN=http://localhost:3000
        ```
    *   Start the backend development server:
        ```bash
        npm run dev
        ```
    *   _Keep this terminal running. The backend server should now be active on `http://localhost:5000`._

3.  **Setup Frontend (Terminal 2):**
    *   **Open a new terminal window or tab.**
    *   Navigate from the **monorepo root** to the frontend project folder:
        ```bash
        # Example: If you are in the monorepo root (fullstack-task-manager)
        cd task-manager-frontend

        # Or, provide the full path if needed from elsewhere
        # cd /path/to/your/projects/fullstack-task-manager/task-manager-frontend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create an environment file named `.env` in the `task-manager-frontend` directory.
    *   Add your environment variables to the `.env` file:
        ```dotenv
        # URL for the backend API (running locally)
        REACT_APP_API_URL=http://localhost:5000/api

        # URL for the backend Socket.IO server (running locally)
        REACT_APP_SOCKET_URL=http://localhost:5000
        ```
    *   Start the frontend development server:
        ```bash
        npm start
        ```
    *   _Your browser should automatically open to `http://localhost:3000`, displaying the frontend application._

You should now have both the backend and frontend running locally and communicating with each other!

## API Endpoints Overview

*(API code resides in the `task-manager-backend` directory)*

### Authentication (`/api/auth`)

*   `POST /register`: Register a new user.
*   `POST /login`: Log in an existing user, returns JWT token.
*   `GET /me`: Get the profile of the currently logged-in user (Protected).

### Tasks (`/api/tasks`)

*(All routes below require authentication)*

*   `GET /`: Get all tasks for the logged-in user.
*   `POST /`: Create a new task.
*   `GET /:id`: Get a specific task by ID.
*   `PUT /:id`: Update a specific task by ID.
*   `DELETE /:id`: Delete a specific task by ID.

## Deployment Notes

### Monorepo Deployment Strategy

This project uses a single GitHub repository containing both frontend and backend code. Deployment requires specific configurations on hosting platforms to target the correct subdirectories.

#### Backend (Render)

*   **Repository:** Connect the single `fullstack-task-manager` GitHub repository.
*   **Root Directory:** `task-manager-backend` **(Crucial!)**
*   **Build Command:** `npm install`
*   **Start Command:** `npm start`
*   **Environment Variables:**
    *   `MONGO_URI`: Your MongoDB Atlas connection string.
    *   `JWT_SECRET`: Your chosen secret key for JWT signing.
    *   `PORT`: Typically `5000` or let Render assign.
    *   `CORS_ORIGIN`: Your **deployed** Vercel frontend URL (e.g., `https://your-app-name.vercel.app`).

#### Frontend (Vercel)

*   **Repository:** Connect the single `fullstack-task-manager` GitHub repository.
*   **Root Directory:** `task-manager-frontend` **(Crucial!)**
*   **Framework Preset:** `Create React App` (should auto-detect).
*   **Build Command:** Default Create React App build command (usually `npm run build`).
*   **Environment Variables:**
    *   `REACT_APP_API_URL`: Your **deployed** Render backend URL + `/api` (e.g., `https://your-backend.onrender.com/api`).
    *   `REACT_APP_SOCKET_URL`: Your **deployed** Render backend URL (e.g., `https://your-backend.onrender.com`).

## Challenges Faced & Solutions

*   **Dependency Conflicts:** `react-beautiful-dnd` required React v18, conflicting with the initial React v19 setup.
    *   **Solution:** Downgraded the frontend project (`task-manager-frontend`) to use React v18 (`react@^18.2.0 react-dom@^18.2.0`).
*   **Real-time Sync Logic:** Managing state updates from Socket.IO across multiple views (List, Kanban, Calendar) consistently.
    *   **Solution:** Centralized Socket.IO event listeners within the main `DashboardPage.js` component and passed state/handlers down to child components as needed. Implemented logic to handle updates/deletions affecting tasks currently being edited in modals.
*   **CORS Configuration:** Ensuring the deployed frontend (Vercel) could communicate with the deployed backend (Render) while restricting access during development.
    *   **Solution:** Utilized the `CORS_ORIGIN` environment variable on the backend, setting it to `http://localhost:3000` for development and the specific Vercel URL for production.
*   **Monorepo Deployment:** Correctly configuring hosting platforms (Render, Vercel) to build and run code from specific subdirectories (`task-manager-backend`, `task-manager-frontend`) within the single repository.
    *   **Solution:** Explicitly setting the **Root Directory** option in both Render and Vercel deployment settings to point to the appropriate subfolder.

## Future Improvements

*   [ ] **Task Reminders:** Implement email or browser push notifications for task deadlines.
*   [ ] **Search & Filtering:** Add functionality to search tasks by title/description and filter by category/priority/status.
*   [ ] **Task History:** Track and display a log of changes made to each task.
*   [ ] **User Settings:** Allow users to update their profile information (e.g., username, password).
*   [ ] **Sharing:** Introduce options to share boards or individual tasks publicly (read-only).
*   [ ] **Testing:** Add comprehensive unit and integration tests for both frontend and backend.

## Author

*   **Muhammed Babatunde Garuba**
*   GitHub: [@Garbii1](https://github.com/Garbii1)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)