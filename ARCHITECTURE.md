# Architecture Document - Shortify URL Shortener

## Overview

Shortify is a full-stack URL shortener application that allows users to create short links for long URLs and track basic analytics such as click count, creation date, and recent visits. The platform allows authenticated users to manage their links and view performance insights.

## Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library for building components |
| Vite | Build tool and development server |
| Tailwind CSS | Utility-first CSS framework for styling |
| React Router | Client-side routing |
| Chart.js | Data visualization for analytics |
| React Chart.js 2 | React wrapper for Chart.js |
| Axios | HTTP client for API communication |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime for server |
| Express | Web framework for building REST APIs |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| Mongoose | MongoDB object modeling |
| express-validator | Input validation |
| express-rate-limit | Rate limiting for security |

### Database
| Technology | Purpose |
|------------|---------|
| MongoDB | NoSQL database for storing data |
| Mongoose | ODM for MongoDB |

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Client Layer                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────────────────┐   │
│  │   React App     │  │   React Router  │  │   State Management        │   │
│  │   Components    │  │   Navigation    │  │   (AuthContext)           │   │
│  └─────────────────┘  └─────────────────┘  └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API Gateway Layer                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────────────────┐   │
│  │   Express       │  │   CORS          │  │   Rate Limiting           │   │
│  │   Server        │  │   Middleware    │  │   (Auth Endpoints)        │   │
│  └─────────────────┘  └─────────────────┘  └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Routes
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Application Layer                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Auth        │  │  URL         │  │  Analytics   │  │  Redirect    │   │
│  │  Controller  │  │  Controller  │  │  Controller  │  │  Controller  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Business Logic
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Data Access Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  User Model  │  │  URL Model   │  │  Analytics   │  │  Middleware  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Mongoose
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Database Layer                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        MongoDB Atlas / Local                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
Frontend Component Tree
├── App
│   ├── AuthProvider (Context)
│   ├── BrowserRouter
│   │   ├── Header
│   │   │   ├── Logo
│   │   │   ├── Nav Links
│   │   │   └── User Menu
│   │   ├── MainContent
│   │   │   ├── Home (Public)
│   │   │   ├── Login (Public)
│   │   │   ├── Register (Public)
│   │   │   ├── ProtectedRoute
│   │   │   │   ├── Dashboard
│   │   │   │   │   ├── URLForm
│   │   │   │   │   ├── URLList
│   │   │   │   │   └── StatsCard
│   │   │   │   ├── URLDetail
│   │   │   │   │   ├── URLInfo
│   │   │   │   │   ├── AnalyticsChart (Bar/Line)
│   │   │   │   │   ├── DeviceBreakdown (Pie)
│   │   │   │   │   ├── ReferrerBreakdown (Bar)
│   │   │   │   │   └── VisitHistoryTable
│   │   │   │   └── NotFound
│   │   └── Footer
```

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String,        // Unique, required, 3-30 chars
  email: String,           // Unique, required, lowercase
  password: String,        // Hashed with bcrypt (12 rounds)
  isActive: Boolean,       // Default: true
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- { username: 1 } (unique)
- { email: 1 } (unique)
```

### URL Collection
```javascript
{
  _id: ObjectId,
  originalUrl: String,     // Required, validated URL
  shortCode: String,       // Unique, 6-char base62
  customAlias: String,     // Unique, optional
  title: String,           // Optional, max 200 chars
  description: String,     // Optional, max 500 chars
  userId: ObjectId,        // Reference to User
  expiresAt: Date,         // Optional
  isActive: Boolean,       // Default: true
  maxClicks: Number,       // Optional
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- { shortCode: 1 } (unique)
- { customAlias: 1 } (unique)
- { userId: 1, createdAt: -1 }

Virtuals:
- analytics (populated from Analytics collection)
```

### Analytics Collection
```javascript
{
  _id: ObjectId,
  urlId: ObjectId,         // Unique reference to URL
  clickCount: Number,      // Total clicks
  lastVisit: Date,         // Timestamp of last visit
  visits: [                // Array of last 100 visits
    {
      timestamp: Date,
      ip: String,
      userAgent: String,
      referrer: String,
      country: String,
      deviceType: String,  // mobile, desktop, tablet, unknown
      browser: String,
      os: String
    }
  ],
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- { urlId: 1 }
- { 'visits.timestamp': -1 }

Methods:
- addVisit(visitData) - Add a new visit
- getDailyClicks(days) - Get daily click counts for chart
- getDeviceBreakdown() - Get device type distribution
- getReferrerBreakdown() - Get referrer distribution
```

## API Design

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "60d5f4a8f1e2b3c4d5e6f7a8",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "isActive": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/login
Login an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/logout
Logout the current user (protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

#### GET /api/auth/me
Get current user details (protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "User retrieved successfully",
  "user": { ... }
}
```

### URL Management Endpoints

#### POST /api/urls
Create a new short URL (protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very/long/url/here",
  "title": "My Link",
  "description": "A description for my link",
  "customAlias": "my-link",
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "maxClicks": 1000
}
```

**Response (201 Created):**
```json
{
  "message": "Short URL created successfully",
  "url": {
    "_id": "60d5f4a8f1e2b3c4d5e6f7a8",
    "originalUrl": "https://example.com/very/long/url/here",
    "shortCode": "aB3xYz",
    "title": "My Link",
    "description": "A description for my link",
    "customAlias": "my-link",
    "userId": "60d5f4a8f1e2b3c4d5e6f7a8",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "isActive": true,
    "maxClicks": 1000,
    "analytics": { ... }
  }
}
```

#### GET /api/urls
Get all URLs for the current user (protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 20) - Items per page

**Response (200 OK):**
```json
{
  "message": "URLs retrieved successfully",
  "urls": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### GET /api/urls/:id
Get URL details by ID (protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "URL retrieved successfully",
  "url": { ... }
}
```

#### PUT /api/urls/:id
Update a URL (protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "originalUrl": "https://new-url.com",
  "title": "Updated Title",
  "description": "Updated description",
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "maxClicks": 500,
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "message": "URL updated successfully",
  "url": { ... }
}
```

#### DELETE /api/urls/:id
Delete a URL (protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "URL deleted successfully"
}
```

### Analytics Endpoints

#### GET /api/analytics/:urlId
Get analytics for a URL (protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Analytics retrieved successfully",
  "analytics": {
    "clickCount": 150,
    "lastVisit": "2024-01-15T10:30:00.000Z",
    "dailyClicks": [
      { "date": "2024-01-09", "count": 20 },
      { "date": "2024-01-10", "count": 25 },
      ...
    ],
    "deviceBreakdown": {
      "desktop": 80,
      "mobile": 60,
      "tablet": 10,
      "unknown": 0
    },
    "referrerBreakdown": {
      "google.com": 50,
      "facebook.com": 30,
      "direct": 70
    }
  }
}
```

#### GET /api/analytics/:urlId/visits
Get visit history for a URL (protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 50) - Items per page

**Response (200 OK):**
```json
{
  "message": "Visit history retrieved successfully",
  "visits": [
    {
      "timestamp": "2024-01-15T10:30:00.000Z",
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "referrer": "https://google.com",
      "country": "US",
      "deviceType": "desktop",
      "browser": "Chrome",
      "os": "Windows"
    },
    ...
  ],
  "pagination": { ... }
}
```

#### GET /api/analytics/:urlId/stats
Get aggregated stats for a URL (protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Stats retrieved successfully",
  "stats": {
    "totalClicks": 150,
    "lastVisit": "2024-01-15T10:30:00.000Z",
    "dailyClicks": [ ... ],
    "deviceBreakdown": { ... },
    "referrerBreakdown": { ... }
  }
}
```

### Public Endpoints

#### GET /:shortCode
Redirect to original URL (public).

**Response:**
- 301 Redirect to original URL
- 404 if URL not found
- 410 if URL expired
- 403 if URL is inactive or max clicks reached

## Security Considerations

### Authentication & Authorization
- JWT tokens with 24-hour expiration
- Passwords hashed with bcrypt (12 rounds)
- Protected routes require valid token
- Token stored in localStorage with Authorization header

### Input Validation
- Express-validator for all API endpoints
- URL validation using validator library
- Input sanitization (trim, length limits)
- MongoDB injection prevention via Mongoose

### Rate Limiting
- 10 requests per 15 minutes for auth endpoints
- Configurable via express-rate-limit

### CORS
- Configured for frontend domain only
- Credentials enabled for cookies

### Data Validation
- URL format validation before storage
- Custom alias uniqueness check
- Expiration date validation
- Max clicks validation

## Short Code Generation

### Algorithm
- Base62 encoding (a-z, A-Z, 0-9)
- 6-character length
- Random generation using Math.random()
- Collision detection with retry logic (max 5 attempts)

### Example
```
Generated codes:
- aB3xYz
- X9kLmN
- 123abc
- ZzZzZz
```

### Custom Alias Support
- Users can specify custom aliases
- Must be 3-20 characters
- Only letters, numbers, underscores, and hyphens allowed
- Checked for uniqueness before creation

## Analytics Tracking

### Data Collected
- Timestamp of visit
- IP address
- User agent string
- Referrer URL
- Device type (mobile, desktop, tablet)
- Browser name
- Operating system

### Analytics Calculations
- Total click count
- Last visit timestamp
- Daily click distribution (for charts)
- Device type breakdown (pie chart)
- Referrer breakdown (bar chart)

### Storage Optimization
- Last 100 visits stored per URL
- Older visits are discarded
- Click count and last visit updated on each visit

## Deployment Considerations

### Environment Variables
```bash
# Backend
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shortify
JWT_SECRET=secure_random_string_here
JWT_EXPIRES_IN=24h
FRONTEND_URL=https://yourdomain.com

# Frontend
VITE_API_URL=https://api.yourdomain.com/api
```

### Production Build
```bash
# Backend
npm start

# Frontend
npm run build
# Serve dist/ folder with a static server
```

### Scaling Considerations
- Use MongoDB Atlas for production (scalable)
- Consider Redis for caching popular URLs
- Add CDN for static assets
- Implement request logging for monitoring
- Add health check endpoint for load balancers

## Testing Strategy

### Backend Testing
- Unit tests for controllers
- Integration tests for API endpoints
- Database tests for models
- Test framework: Jest + Supertest

### Frontend Testing
- Unit tests for components
- Integration tests for pages
- E2E tests for user flows
- Test framework: React Testing Library + Jest

## Future Enhancements

### Planned Features
1. QR code generation for URLs
2. Email notifications for link activity
3. Bulk URL shortening via CSV
4. Social media integration
5. Advanced analytics (geolocation, time-based trends)
6. API rate limiting per user
7. URL expiration notifications

### Technical Improvements
1. Add Redis caching for popular URLs
2. Implement background job processing for analytics
3. Add WebSocket for real-time analytics updates
4. Implement URL validation with headless browser
5. Add image thumbnails for URLs
