# Social Login Configuration for EchoSphere

This guide explains how to set up social login (Google, GitHub, Facebook) for the EchoSphere chat application.

## Prerequisites

You will need to create OAuth applications with each provider to get client IDs and secrets:

### 1. Google OAuth Setup

1. Go to [Google Developer Console](https://console.developers.google.com/)
2. Create a new project
3. Navigate to "Credentials" → "Create Credentials" → "OAuth client ID"
4. Select "Web application"
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production URL
6. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (for development)
   - `https://your-production-url/api/auth/google/callback` (for production)
7. Note your Client ID and Client Secret

### 2. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in app details:
   - Homepage URL: `http://localhost:3000` (or your production URL)
   - Authorization callback URL: `http://localhost:5000/api/auth/github/callback` (or your production version)
4. Note your Client ID and Client Secret

### 3. Facebook OAuth Setup

1. Go to [Facebook Developer Portal](https://developers.facebook.com/)
2. Create a new app (choose "Other" as app type)
3. Add "Facebook Login" product
4. In settings, add the following OAuth Redirect URI:
   - `http://localhost:5000/api/auth/facebook/callback` (for development)
   - `https://your-production-url/api/auth/facebook/callback` (for production)
5. Note your App ID and App Secret

## Configuration

### Server Configuration

1. Add the following variables to your `.env` file in the server directory:

```env
# Server Configuration
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

### Production Deployment

When deploying to production, make sure to:

1. Update all OAuth callback URLs in the developer portals to use your production URLs
2. Update the environment variables on your hosting platform
3. Set `NODE_ENV=production` in your environment variables

## Troubleshooting

### Common Issues:

1. **Redirect URI mismatch**: Ensure the redirect URIs in your OAuth provider settings match exactly what's in your code.
2. **Permissions issues**: Make sure you've requested the correct scopes in each provider configuration.
3. **SSL requirements**: Facebook requires HTTPS for production callbacks.

### Testing Social Login:

1. Click the social login buttons on the login or register page
2. You should be redirected to the provider's authorization page
3. After authorizing, you should be redirected back to your app and logged in

## Security Considerations

1. Keep your client secrets secure and never commit them to public repositories
2. Regularly rotate your client secrets
3. Implement proper token validation and CSRF protection
4. Use HTTPS in production
