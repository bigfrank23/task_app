# TaskFlow

Where productivity meets collaboration.

## Features
- ✅ Smart Task Management
- 👥 Team Collaboration
- 💬 Real-time Chat
- 🔔 Smart Notifications
- 📎 File Attachments
- 📊 Progress Tracking

## Tech Stack
- **Frontend:** React, React Query, Socket.IO Client
- **Backend:** Node.js, Express, MongoDB, Socket.IO
- **Storage:** Cloudinary
- **Authentication:** JWT, Google OAuth

## Setup

### Prerequisites
- Node.js 18+
- MongoDB
- Cloudinary Account

### Installation

1. Clone the repo
```bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow
```

2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configure environment variables
```bash
# Backend .env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
# ... etc
```

4. Run the app
```bash
# Backend
npm start

# Frontend
npm run dev
```

## License
MIT
