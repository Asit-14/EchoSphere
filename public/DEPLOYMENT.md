# EchoSphere Frontend Deployment

## Manual Deployment Instructions

If you encounter issues with automatic deployment on Render.com, follow these steps:

1. Build the app locally:
```
cd public
npm install
npm run build
```

2. Deploy the `build` folder directly to a static hosting service:

- Netlify: Drag and drop the `build` folder
- Vercel: Import the repository and set the output directory to `public/build`
- GitHub Pages: Set the publishing source to the `build` folder

3. Set environment variables on your hosting platform:
```
REACT_APP_API_URL=https://echosphere-2fpq.onrender.com
REACT_APP_LOCALHOST_KEY=echosphere-user
```

## Running the App Locally

```
npm install
npm start
```
