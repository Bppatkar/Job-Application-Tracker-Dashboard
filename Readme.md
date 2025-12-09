# Job Application Tracker 📋

A full-stack MERN application to track job applications with authentication, analytics dashboard, and CRUD operations.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Password encryption

### 📊 Dashboard
- Real-time application statistics
- Interactive charts using Recharts
- Status distribution visualization
- Quick overview cards

### 📝 Application Management
- **Create**: Add new job applications
- **Read**: View all applications with details
- **Update**: Modify application status and details
- **Delete**: Remove applications
- **Search & Filter**: Filter by status, company, date

### 🎨 UI/UX
- Responsive design with Tailwind CSS
- Clean and modern interface
- Toast notifications
- Loading states
- Form validation

## 🚀 Tech Stack

### **Frontend**
- **React** - UI library
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/job-tracker.git
cd job-tracker
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
echo "MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
PORT=5000" > .env

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start React development server
npm start
```

## ⚙️ Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobtracker
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

## 📁 Project Structure

```
job-tracker/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── applicationRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── ApplicationList.js
    │   │   ├── AddApplication.js
    │   │   ├── StatsCard.js
    │   │   └── PrivateRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    ├── tailwind.config.js
    └── package.json
```

## 🔧 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get all applications |
| GET | `/api/applications/stats` | Get application statistics |
| GET | `/api/applications/:id` | Get single application |
| POST | `/api/applications` | Create new application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |

## 🎯 Usage Guide

### 1. Registration
- Navigate to `/register`
- Enter name, email, and password
- Click "Register" to create account

### 2. Login
- Go to `/login`
- Enter registered credentials
- Access dashboard upon successful login

### 3. Add Application
1. Click "Add New Application" in dashboard
2. Fill in:
   - Company name
   - Position
   - Job link (optional)
   - Status (Applied/Interview/Rejected/Offer/Accepted)
   - Notes (optional)
   - Salary (optional)
3. Click "Add Application"

### 4. Manage Applications
- **View**: All applications listed in table
- **Edit**: Click edit icon on any application
- **Delete**: Click delete icon with confirmation
- **Filter**: Use status dropdown to filter applications

### 5. View Analytics
- Dashboard shows real-time statistics
- Bar chart displays status distribution
- Quick stats cards show totals

## 📱 Screenshots

### Login Page
![Login Page](https://via.placeholder.com/800x450/3b82f6/ffffff?text=Login+Page)

### Dashboard
![Dashboard](https://via.placeholder.com/800x450/10b981/ffffff?text=Dashboard+Analytics)

### Applications List
![Applications](https://via.placeholder.com/800x450/8b5cf6/ffffff?text=Applications+List)

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create job-tracker-backend

# Add environment variables
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### API Testing with Postman
Import the Postman collection from `docs/postman_collection.json`

## 🔄 Environment Setup for Development

1. **MongoDB Setup:**
   - Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get connection string
   - Update `.env` file

2. **Development Mode:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📈 Future Enhancements

- [ ] Email notifications for status updates
- [ ] File upload for resumes and cover letters
- [ ] Export applications to PDF/CSV
- [ ] Calendar view for interviews
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)
- [ ] Integration with LinkedIn API
- [ ] Job search from external APIs
- [ ] AI-powered application suggestions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👨‍💻 Author

**Your Name**
- Portfolio: [Bhanu Portfolio](https://portfolio-bhanu-2026.vercel.app/)
- LinkedIn: [Bhanu](https://www.linkedin.com/in/bhanu-pratap-patkar/)
- GitHub: [@Bppatkar](https://github.com/Bppatkar)

## 🙏 Acknowledgments

- [MERN Stack Documentation](https://www.mongodb.com/mern-stack)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [React Hot Toast](https://react-hot-toast.com)

## ⭐ Support

If you like this project, please give it a star on GitHub!

---

**Built with ❤️ using MERN Stack By Bhanu Pratap Patkar**

---


**Happy Job Hunting! 🚀**