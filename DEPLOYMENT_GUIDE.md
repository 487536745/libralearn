# MERN Stack Deployment Guide - LibraLearn

## Overview
This guide helps you properly connect and deploy your MERN stack application with:
- Frontend: https://libralearn.vercel.app (Vercel)
- Backend: https://libralearn-production.up.railway.app (Railway)

## ✅ Changes Made

### Frontend Changes
1. **Updated API URLs** in all components:
   - `src/hooks/useChat.jsx`
   - `src/components/UI.jsx`
   - `src/components/QuizGamePage.jsx`
   - `src/components/HumanRightsReading.jsx`

2. **Environment Configuration**:
   - Updated `frontend/.env.example` with Railway backend URL
   - All API calls now use `VITE_API_URL` environment variable

### Backend Changes
1. **CORS Configuration**:
   - Added specific origin whitelist for Vercel domain
   - Configured proper credentials and headers
   - Added development origins for local testing

2. **Server Configuration**:
   - Updated to listen on `0.0.0.0` for Railway compatibility
   - Added environment variable support for PORT
   - Enhanced logging for debugging

3. **Environment Variables**:
   - Updated `backend/.env.example` with all required variables
   - Added production-ready configuration

## 🚀 Deployment Steps

### Backend Deployment (Railway)

1. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "Fix CORS and API URLs for production deployment"
   git push origin main
   ```

2. **Configure Railway Environment Variables**:
   - Go to your Railway project dashboard
   - Navigate to Settings → Environment Variables
   - Add these variables:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ELEVEN_LABS_API_KEY=your_eleven_labs_api_key_here
     NODE_ENV=production
     FRONTEND_URL=https://libralearn.vercel.app
     PORT=3000
     ```

3. **Redeploy Backend**:
   - Railway will automatically redeploy when you push changes
   - Monitor deployment logs for any errors
   - Verify backend is accessible: `https://libralearn-production.up.railway.app/`

### Frontend Deployment (Vercel)

1. **Configure Vercel Environment Variables**:
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add this variable:
     ```
     VITE_API_URL=https://libralearn-production.up.railway.app
     ```

2. **Redeploy Frontend**:
   - Vercel will automatically redeploy when you push changes
   - Monitor deployment logs
   - Verify frontend is accessible: `https://libralearn.vercel.app`

## 🔧 Testing the Connection

### 1. Test Backend Health
```bash
curl https://libralearn-production.up.railway.app/
```
Expected response: "Hello World!"

### 2. Test CORS Configuration
```bash
curl -H "Origin: https://libralearn.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://libralearn-production.up.railway.app/ragAsk
```

### 3. Test API Endpoints
- Test RAG endpoint from browser network tab
- Check for CORS errors in browser console
- Verify API responses are successful

## 🐛 Common Issues & Solutions

### CORS Errors
**Problem**: "Access-Control-Allow-Origin header is present on the requested resource"
**Solution**: 
- Verify backend CORS configuration includes your Vercel domain
- Check Railway environment variables are set correctly
- Ensure backend is redeployed after CORS changes

### Failed to Fetch / Network Errors
**Problem**: "Failed to fetch" or "Network error"
**Solution**:
- Verify `VITE_API_URL` is set correctly in Vercel
- Check backend is running and accessible
- Test API endpoints directly with curl
- Verify Railway deployment logs for errors

### Environment Variables Not Working
**Problem**: API calls still going to localhost
**Solution**:
- Ensure `.env` files are in `.gitignore`
- Set environment variables in deployment platform (Vercel/Railway)
- Restart/redeploy after adding environment variables
- Check that variable names match exactly (VITE_API_URL vs VITE_BACKEND_URL)

### Backend Not Starting
**Problem**: Railway deployment fails
**Solution**:
- Check Railway deployment logs
- Verify all required environment variables are set
- Ensure `package.json` start script is correct
- Check for any missing dependencies

## 📋 Pre-Deployment Checklist

### Backend ✅
- [ ] Environment variables configured in Railway
- [ ] CORS settings include Vercel domain
- [ ] Server listens on `0.0.0.0`
- [ ] PORT uses environment variable
- [ ] All API endpoints tested locally
- [ ] Dependencies are up to date

### Frontend ✅
- [ ] Environment variables configured in Vercel
- [ ] All API URLs use environment variable
- [ ] No hardcoded localhost URLs remain
- [ ] Build process works without errors
- [ ] Firebase configuration is correct

### Testing ✅
- [ ] Backend health check passes
- [ ] CORS preflight requests work
- [ ] API endpoints return expected responses
- [ ] Frontend can successfully call backend
- [ ] No console errors in production

## 🔄 Git Commands for Deployment

```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "Configure production deployment: fix CORS, update API URLs, add environment variables"

# Push to trigger deployments
git push origin main

# Monitor both deployments:
# Railway: https://railway.app/project/your-project-id
# Vercel: https://vercel.com/your-username/libralearn
```

## 📞 Support

If you encounter issues:

1. **Check logs first**: Railway and Vercel both provide detailed deployment logs
2. **Test locally**: Run both frontend and backend locally with production environment variables
3. **Verify URLs**: Ensure all URLs are correct and accessible
4. **Check CORS**: Use browser dev tools to inspect CORS headers
5. **Environment variables**: Double-check variable names and values in both platforms

Your MERN stack should now be properly connected and deployed! 🎉
