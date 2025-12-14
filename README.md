# TaskiFy

TaskiFy is a modern, feature-rich task management application designed to help individuals and teams organize, track, and complete tasks efficiently. Built with the MERN stack (MongoDB, Express, React, Node.js), it features a stunning dark mode interface with Glassmorphism aesthetics.

## 🚀 Features

-   **User Authentication**: Secure Login and Signup functionality using JWT.
-   **Role-Based Access Control**:
    -   **Users**: Create, read, update, and delete personal tasks. Filter tasks by status and priority.
    -   **Admins**: View all users, manage user roles, delete users, and oversee all system tasks.
-   **Task Management**:
    -   Create tasks with titles, descriptions, priorities (Low, Medium, High), and due dates.
    -   Track status: Pending, In Progress, Completed.
-   **Modern UI/UX**:
    -   Fully responsive design using **Tailwind CSS**.
    -   **Dark Mode** by default with beautiful **Glassmorphism** effects.
    -   Interactive dashboards for both Users and Admins.

## 🛠️ Tech Stack

### Frontend
-   **React** (Vite)
-   **Tailwind CSS** (Styling)
-   **Lucide React** (Icons)
-   **Axios** (API Requests)
-   **React Router DOM** (Navigation)

### Backend
-   **Node.js** & **Express.js** (Server)
-   **MongoDB** (Database)
-   **Mongoose** (ODM)
-   **JWT** (Authentication)
-   **Bcrypt.js** (Password Hashing)

## 📂 Project Structure

```
TaskApp/
├── config/             # Database configuration
├── controllers/        # Request handlers (Auth, Tasks, Admin)
├── middlewares/        # Auth middleware
├── models/             # Mongoose models (User, Task)
├── routes/             # API routes
├── index.js            # Server entry point
├── package.json        # Backend dependencies
└── frontend/           # React Frontend Application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Auth Context
    │   ├── Pages/      # Application pages (Home, Dashboard, etc.)
    │   └── utils/      # API helpers
    ├── index.css       # Global styles (Tailwind + Theme)
    └── package.json    # Frontend dependencies
```

## ⚡ Getting Started

### Prerequisites
-   Node.js (v14+ recommended)
-   MongoDB (Local or Atlas connection string)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd TaskApp
```

### 2. Backend Setup
1.  Navigate to the root directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
4.  Start the backend server:
    ```bash
    npm start
    # or for development with nodemon
    npm run dev
    ```

### 3. Frontend Setup
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## 📄 API Endpoints

### Auth
-   `POST /api/auth/register` - Register a new user
-   `POST /api/auth/login` - Login user

### Tasks
-   `GET /api/tasks` - Get user's tasks
-   `POST /api/tasks` - Create a new task
-   `PUT /api/tasks/:id` - Update a task
-   `DELETE /api/tasks/:id` - Delete a task

### Admin
-   `GET /api/admin/users` - Get all users
-   `DELETE /api/admin/users/:id` - Delete a user
-   `PUT /api/admin/users/:id/role` - Change user role

## 📈 Scalability & Future Development

To scale this application for production use or larger team development, consider the following improvements:

### Code Quality & Architecture
-   **TypeScript Migration**: Adopt TypeScript for both frontend and backend to ensure type safety and robustness.
-   **Testing Strategy**: Implement Unit Tests (Jest/Vitest), Integration Tests (Supertest), and E2E Tests (Cypress/Playwright) to prevent regressions.
-   **Modular Pattern**: Refactor the backend into a **Service-Repository Pattern** to decouple business logic from controllers.

### Performance & Scaling
-   **Database Optimization**: Add indexes for frequently queried fields (e.g., `status`, `priority`) in MongoDB.
-   **Caching**: Implement **Redis** caching for user sessions and frequently accessed data to reduce database load.
-   **Microservices**: As the app grows, split distinct domains (Auth, Tasks, Notifications) into separate microservices.

### CI/CD & DevOps
-   **Dockerization**: Containerize the application using Docker for consistent environments across development and production.
-   **CI/CD Pipelines**: Set up GitHub Actions or Jenkins for automated testing and deployment.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
