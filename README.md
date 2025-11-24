# Finance Push Notifications

A client-server application with React frontend and Node.js/Express backend.

## Project Structure

```
FinancePushNotifications/
├── client/          # React frontend application
└── server/          # Node.js/Express backend server
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Client Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The React app will run on `http://localhost:3000`

### Server Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The Express server will run on `http://localhost:3001`

## API Endpoints

- `GET /api/hello` - Test endpoint that returns a greeting message
- `GET /api/health` - Health check endpoint

## Development

The client and server should be run in separate terminal windows/tabs for development.



1. Go to the client folder and run 
npm install 