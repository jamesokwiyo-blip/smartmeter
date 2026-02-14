## Smart Meter Portal - Power Rwanda

A modern electricity purchase portal for smart meter management.

## What technologies are used for this project?

### Frontend
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router v6
- TanStack Query
- Recharts

### Backend
- Node.js
- Express
- MongoDB Atlas (Mongoose)
- JWT Authentication
- bcryptjs

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jamesokwiyo-blip/smartmeter.git
cd smartmeter
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:

**Backend (.env):**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

**Frontend (.env.local):** *(optional - for local backend testing)*
```env
VITE_API_URL=http://localhost:5000/api
```

For production, the frontend automatically connects to: `https://smartmeter-jdw0.onrender.com/api`

4. Start the development servers:
```bash
# Start both frontend and backend
npm run dev:both

# Or start them separately
npm run dev          # Frontend only
npm run dev:server   # Backend only
```

## Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set the build command to `npm run build`
3. Set the output directory to `dist`

### Render (Backend)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `npm install`
   - Start Command: `npm run start`
   - Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV`

## Database Migration

The project has been migrated from JSON file storage to MongoDB Atlas for better scalability and production readiness.

