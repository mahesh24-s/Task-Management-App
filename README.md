# Task Management App

A modern task management application built with Next.js, TypeScript, and Express.js. This application provides a clean and intuitive interface for managing tasks with authentication, real-time updates, and a responsive design.

## 🚀 Features

- **User Authentication**: Secure login and registration system with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Status Tracking**: Organize tasks with different status badges
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **Real-time Updates**: Instant updates across the application
- **Type-safe**: Full TypeScript implementation for better code quality

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **React Hook Form** - Performant form library with validation
- **Zod** - TypeScript-first schema validation
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icons

### Backend
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Next-generation ORM
- **SQLite** - Lightweight database
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Zod** - Request validation

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-app
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   JWT_SECRET=your-secret-key-here
   ```

4. **Set up the database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   cd ..
   ```

## 🚀 Development

### Running the Application

**Option 1: Run both frontend and backend simultaneously**
```bash
npm run dev:full
```

**Option 2: Run separately**

**Frontend (Next.js):**
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

**Backend (Express.js):**
```bash
cd backend
npm run dev
```
The backend will run on [http://localhost:3001](http://localhost:3001)

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run dev:full` - Start both frontend and backend development servers
- `npm run build` - Build frontend for production
- `npm run start` - Start frontend production server
- `npm run lint` - Run ESLint
- `cd backend && npm run dev` - Start backend development server
- `cd backend && npm run build` - Build backend for production
- `cd backend && npm run start` - Start backend production server

## 📁 Project Structure

```
task-management-app/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── schemas/        # Request/response schemas
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   ├── app.ts          # Express app configuration
│   │   └── index.ts        # Server entry point
│   ├── prisma/             # Database schema and migrations
│   └── package.json
├── src/                    # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── lib/               # Utility libraries
│   ├── providers/         # Context providers
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🗄️ Database Schema

The application uses Prisma with SQLite. The main entities include:

- **User**: Stores user information and authentication data
- **Task**: Stores task details with relationships to users

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Health Check
- `GET /api/health` - Health check endpoint

## 🎨 Styling

The application uses Tailwind CSS for styling with a custom design system. Components are built using Radix UI for accessibility and consistency.

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |
| `JWT_SECRET` | JWT secret key | Required |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request