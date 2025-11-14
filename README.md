# CRM Platform - Modern Customer Relationship Management

A full-stack CRM platform built with the MERN stack (MongoDB replaced with PostgreSQL) designed for fast-scaling startups. Features real-time insights, lead management, and role-based access control.

## 🚀 Features Implemented

### ✅ Core Features
- **JWT Authentication** - Secure login/logout system
- **Lead Management** - Create and view sales leads
- **Role-based Access** - Middleware for protected routes
- **RESTful API** - Well-structured backend endpoints
- **PostgreSQL Database** - Robust data persistence with Prisma ORM
- **Docker Support** - Containerized development environment

### 🔄 Work in Progress
- User registration interface
- Lead update/delete operations  
- Activity timeline for leads
- Real-time notifications
- Analytics dashboard with charts
- Email automation system

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** with **Prisma ORM**
- **JWT** + **bcrypt** for authentication
- **Docker** for containerization

### Frontend
- **React** + **TypeScript**
- **Context API** for state management
- **CSS3** with modern responsive design
- **REST API** integration

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/PRADEEP930/CRM.git
cd CRM
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your database credentials
```

3. **Database Setup**
```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Run database migrations
npx prisma generate
npx prisma db push
```

4. **Frontend Setup**
```bash
cd frontend
npm install
```

5. **Run the Application**
```bash
# Terminal 1 - Backend (from backend/)
npm run dev

# Terminal 2 - Frontend (from frontend/)
npm start
```

6. **Access the Application**
```bash
Frontend: http://localhost:3000

Backend API: http://localhost:5000
```

**🔑 Default Credentials**
Use these test credentials to login:
```bash
Email: test1763121995797@crm.com
Password: test123
```

**🗂 Project Structure**
```bash
CRM/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth & validation
│   │   ├── routes/          # API endpoints
│   │   ├── utils/           # Utilities
│   │   └── types/           # TypeScript definitions
│   ├── prisma/              # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.tsx          # Main app component
│   │   └── index.tsx        # Entry point
│   └── package.json
└── docker-compose.yml       # Docker configuration
```

## 📄📡 API Documentation
**Authentication**
- POST /api/auth/login - User login

- POST /api/auth/register - User registration (backend ready)

**Leads Management**
- GET /api/leads - Get all leads (protected)

- POST /api/leads - Create new lead (protected)

**Health Check**
- GET /api/health - API status check

**🗃 Database Schema**
```bash
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      UserRole @default(SALES_EXECUTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  leads     Lead[]
}

model Lead {
  id          String   @id @default(cuid())
  name        String
  email       String
  phone       String?
  company     String?
  status      LeadStatus @default(NEW)
  source      String?
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  assignedTo  User?    @relation(fields: [assignedToId], references: [id])
  assignedToId String?
}
```

## 🚧 Development Roadmap**
**Phase 1 - Complete ✅**
- Project setup and architecture

- Database design and ORM setup

- Authentication system

- Basic lead management

- Docker containerization

**Phase 2 - In Progress 🔄**
- User registration interface

- Lead update and delete operations

- Activity timeline for leads

- Real-time notifications with Socket.io

- Analytics dashboard with charts

- Email automation system

- Comprehensive testing suite

**🤝 Contributing**
This is an active development project. Contributions are welcome! Please feel free to submit issues and enhancement requests.

**📄 License**
This project is developed as part of a technical assessment.

**👥 Authors**
Pradeep Yadav - Initial development and architecture

---
**Note**: This is a work in progress. The core authentication and lead management features are fully functional, with additional features planned for future releases.
