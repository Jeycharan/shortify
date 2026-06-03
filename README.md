# Shortify - URL Shortener with Analytics

A full-stack URL shortener application with analytics tracking. Built with React, Node.js, Express, and MongoDB.

## Features

### Mandatory Features
- **Authentication**: User signup and login with JWT tokens
- **URL Shortening**: Generate short URLs with unique codes
- **User Dashboard**: View and manage all created short URLs
- **Analytics**: Track click count, creation date, and recent visits
- **Responsive UI**: Clean dashboard layout with proper loading states

### Bonus Features
- Custom alias for short URLs
- QR code generation for each short URL
- Expiry date for links
- Charts for daily click trends
- Edit destination URL

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Chart.js |
| Backend | Node.js, Express, JWT, bcrypt |
| Database | MongoDB, Mongoose |
| Validation | express-validator |

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Configure the environment variables in `.env`:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shortify
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

The backend API will be available at `https://shortify-pe39.onrender.com`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## MongoDB Atlas Setup

### Getting Your MongoDB Atlas URI

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Click "Try Free" and sign up

2. **Create a New Cluster**
   - Click "Build a Database"
   - Choose the free M0 cluster (no credit card required)
   - Select a cloud provider (AWS, Google Cloud, or Azure)
   - Choose a region closest to you
   - Click "Create Cluster"

3. **Configure Database Access**
   - Click "Database Access" in the left sidebar
   - Click "ADD NEW DATABASE USER"
   - Choose "Password" authentication method
   - Enter a username and password (save these!)
   - Select "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Click "Network Access" in the left sidebar
   - Click "ADD IP ADDRESS"
   - Click "ALLOW ACCESS FROM ANYWHERE" (for development)
   - Click "Confirm"

5. **Get Your Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with your database name (e.g., `shortify`)

6. **Update Your `.env` File**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shortify
   ```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout (protected)
- `GET /api/auth/me` - Get current user (protected)

### URL Management
- `POST /api/urls` - Create short URL (protected)
- `GET /api/urls` - Get user's URLs (protected)
- `GET /api/urls/:id` - Get URL details (protected)
- `PUT /api/urls/:id` - Update URL (protected)
- `DELETE /api/urls/:id` - Delete URL (protected)

### Analytics
- `GET /api/analytics/:urlId` - Get analytics (protected)
- `GET /api/analytics/:urlId/visits` - Get visit history (protected)
- `GET /api/analytics/:urlId/stats` - Get aggregated stats (protected)

### Public
- `GET /:shortCode` - Redirect to original URL

## Project Structure

```
Shortify/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── config/      # Database, environment
│   │   ├── models/      # Mongoose schemas
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth, validation
│   │   ├── utils/       # Helpers
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── frontend/            # React application
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   ├── contexts/    # React contexts
│   │   ├── App.js
│   │   └── index.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── README.md
└── ARCHITECTURE.md
```

## Assumptions

1. MongoDB is used as the database (easier for analytics document structure)
2. JWT tokens stored in localStorage with Authorization header
3. 6-character short codes using base62 (a-zA-Z0-9)
4. Analytics stores last 100 visits per URL to prevent unbounded growth
5. 301 redirect for SEO-friendly permanent redirects
6. Tailwind CSS for styling (rapid development, good looking UI)
7. Vite for frontend build tool (faster than CRA)
8. Rate limiting on auth endpoints to prevent abuse
9. Password hashing with bcrypt (12 rounds)
10. Frontend and backend run on different ports during development

## AI Planning Document

This application was planned and built using Claude Code (Claude 4.7) with the following approach:

1. **Initial Analysis**: Explored the requirements and identified the core features needed
2. **Architecture Design**: Designed a clean separation of concerns with models, controllers, routes, and middleware
3. **Implementation**: Built the backend first (Express API), then the frontend (React)
4. **Testing**: Verified the application flow end-to-end

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Home      │  │  Dashboard  │  │  Analytics  │              │
│  │   Page      │  │             │  │  Dashboard  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Express)                          │
│  ┌─────────────┐  ┌─��───────────┐  ┌─────────────┐              │
│  │  Auth       │  │  URL        │  │  Analytics  │              │
│  │  Controller │  │  Controller │  │  Controller │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Auth       │  │  URL        │  │  Analytics  │              │
│  │  Routes     │  │  Routes     │  │  Routes     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Auth       │  │  URL        │  │  Analytics  │              │
│  │  Middleware │  │  Middleware │  │  Middleware │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ MongoDB
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Database (MongoDB)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Users      │  │  URLs       │  │  Analytics  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## Video Demonstration

A video demonstrating the application is available at: [Link to video]

## Hackathon Information

This project is a part of a hackathon run by [https://katomaran.com](https://katomaran.com)

## License

MIT License
