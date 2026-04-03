# Mobile Payment Fix - Deployment Guide

## Problem Identified

The payment was failing on mobile devices because the frontend was configured to use `http://localhost:3001` as the API base URL. This works on your laptop when the backend server is running locally, but:

1. **Mobile devices** cannot access `localhost:3001` on your laptop - they need a public URL
2. **Vercel deployment** - The frontend was deployed but still tried to connect to `http://localhost:3001` which doesn't exist in the cloud

## Changes Made

### 1. Updated `.env` file
- Changed `VITE_API_BASE_URL=http://localhost:3001` to `VITE_API_BASE_URL=` (empty)
- This allows the app to automatically use `window.location.origin` which will be your Vercel domain

### 2. Improved `UploadPage.tsx` payment handling
- Added better error handling with descriptive messages
- Added retry mechanism for slow mobile connections
- Added payment failure event handling
- Improved API URL detection for production

### 3. Added dependencies to `package.json`
- Added `razorpay` package for Vercel API routes
- Added `@vercel/node` for serverless function support

## Deployment Steps

### Step 1: Push Changes to Git

```bash
cd snapcut-ai
git add .
git commit -m "Fix mobile payment issue - use dynamic API URL"
git push origin main
```

### Step 2: Configure Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

**Production Environment:**
- `RAZORPAY_KEY_ID` = `rzp_test_SYcc6gZydQ5Yp7` (your test key)
- `RAZORPAY_KEY_SECRET` = (your secret key from Razorpay dashboard)

**Important:** The frontend uses `VITE_RAZORPAY_KEY_ID` which should be set in your local `.env` file, but for Vercel, you need to set the backend keys (`RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`) in the Vercel environment variables.

### Step 3: Redeploy

Vercel will automatically redeploy when you push to git. If not, manually trigger a redeployment:

1. Go to your Vercel dashboard
2. Select your project
3. Click "Deployments"
4. Click "Redeploy" on the latest deployment

### Step 4: Test on Mobile

1. Open your Vercel URL on a mobile device
2. Click "Upgrade to Pro" button
3. The payment should now work correctly

## How It Works Now

1. When a user clicks "Upgrade to Pro", the app:
   - Detects the current domain (e.g., `https://your-app.vercel.app`)
   - Calls `/api/create-order` on the same domain
   - Vercel routes this to the serverless function in `/api/create-order.ts`
   - The serverless function creates a Razorpay order
   - Razorpay checkout opens on mobile
   - After payment, verification happens via `/api/verify-payment`

2. This works on both mobile and desktop because:
   - The API URL is dynamically detected from `window.location.origin`
   - Vercel handles the API routes automatically
   - No hardcoded localhost URLs

## Troubleshooting

If payment still fails:

1. **Check browser console** - Open developer tools and look for errors
2. **Verify environment variables** - Make sure Razorpay keys are set correctly in Vercel
3. **Check API logs** - Go to Vercel > Functions to see any errors from the API routes
4. **Test locally** - Run `npm run dev` and test the payment flow

## Important Notes

- The `.env` file is not committed to git (it's in `.gitignore`)
- Environment variables for production must be set in Vercel dashboard
- The Razorpay test key `rzp_test_SYcc6gZydQ5Yp7` is for testing only
- For production, use live keys from Razorpay dashboard