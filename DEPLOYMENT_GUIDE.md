# EchoSphere Deployment Guide

This guide provides instructions for deploying the EchoSphere chat application in various environments.

## Prerequisites

- Node.js 14+ installed
- MongoDB account (Atlas recommended)
- Docker and Docker Compose (for containerized deployment)
- Domain name (optional, for production deployment)

## Option 1: Local Deployment

### Frontend Setup

1. Navigate to the public directory:
   ```
   cd public
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the public directory with:
   ```
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_LOCALHOST_KEY=echosphere-user
   ```

4. Build the React app:
   ```
   npm run build
   ```

5. Serve the built files:
   ```
   npx serve -s build
   ```

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with:
   ```
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   NODE_ENV=production
   ```

4. Start the server:
   ```
   npm start
   ```

## Option 2: Docker Deployment

1. Make sure Docker and Docker Compose are installed on your system

2. Create a `.env` file in the root directory with:
   ```
   MONGO_URL=your_mongodb_connection_string
   ```

3. For production deployment, update `docker-compose.yml` to use your actual domain instead of localhost:
   ```yaml
   front:
     environment:
       - REACT_APP_API_URL=https://api.yourdomain.com
   ```

4. Build and start the containers:
   ```
   docker-compose up -d --build
   ```

## Option 3: Cloud Deployment

### Frontend Deployment (Netlify/Vercel)

1. Build your React app:
   ```
   cd public
   npm run build
   ```

2. Deploy the `build` folder to Netlify/Vercel through their UI or CLI tools

3. Set environment variables in the provider's dashboard:
   - `REACT_APP_API_URL`: URL of your deployed backend API
   - `REACT_APP_LOCALHOST_KEY`: Key for local storage (e.g., "echosphere-user")

### Backend Deployment (Heroku/Railway)

1. Create a new app on your chosen platform

2. Connect your GitHub repository or push code directly

3. Set environment variables:
   - `PORT`: Usually set automatically by the platform
   - `MONGO_URL`: Your MongoDB connection string
   - `NODE_ENV`: Set to "production"

4. Deploy the application

## Security Considerations

1. Never commit sensitive information like MongoDB connection strings to your repository
2. Set up proper authentication and authorization
3. Enable CORS with appropriate origins
4. Use HTTPS for all communications
5. Regularly update dependencies for security patches

## Post-Deployment Checklist

- [ ] Test registration and login functionality
- [ ] Verify avatar selection works
- [ ] Ensure real-time messaging is working
- [ ] Check that message deletion works correctly
- [ ] Verify profile editing functionality
- [ ] Test the application on different devices and browsers

## Troubleshooting

- If real-time messaging is not working, ensure WebSocket connections are permitted by your hosting provider
- If images aren't loading, check CORS settings and CDN configuration
- For database connection issues, verify your MongoDB connection string and network permissions
