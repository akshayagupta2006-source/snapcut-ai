# SnapCut AI Backend Server

Secure backend server for handling Razorpay payments and other sensitive operations.

## Setup

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
cd server
npm install
```

### Environment Variables

Create a `.env` file in the `server` directory:

```
PORT=3001
RAZORPAY_KEY_ID=rzp_test_SYcc6gZydQ5Yp7
RAZORPAY_KEY_SECRET=3FSPOvINCaAYhuIQHRqf5JYV
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

**⚠️ IMPORTANT**: Never commit `.env` file to version control. Add it to `.gitignore`.

### Running the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

### 1. Health Check
```
GET /health
```
Returns server status.

### 2. Create Payment Order
```
POST /api/create-order
Content-Type: application/json

{
  "amount": 500,
  "currency": "INR",
  "receipt": "receipt-123456"
}
```

### 3. Verify Payment
```
POST /api/verify-payment
Content-Type: application/json

{
  "orderId": "order_...",
  "paymentId": "pay_...",
  "signature": "signature_..."
}
```

### 4. Get Payment Details
```
POST /api/payment-details
Content-Type: application/json

{
  "paymentId": "pay_..."
}
```

### 5. Webhook (Razorpay Events)
```
POST /api/webhook
```
Receives payment events from Razorpay.

## Security Features

✅ **Secret Key Protection**: Razorpay secret key is stored only on the backend
✅ **Signature Verification**: All payments are cryptographically verified
✅ **CORS Enabled**: Secured cross-origin requests
✅ **Error Handling**: Safe error responses without exposing sensitive data
✅ **Webhook Support**: Handles real-time payment events

## Deployment

### Heroku
```bash
git push heroku main
```

### Vercel with API Routes
Move to `/api` directory and use Vercel's serverless functions.

### Self-hosted (VPS)
```bash
npm run build
npm start
```

Use PM2 for process management:
```bash
npm install -g pm2
pm2 start index.ts --name "snapcut-backend"
```

## Frontend Integration

The frontend communicates with this backend at `http://localhost:3001` (for development).

Update the API URL in production:
- Frontend: Change `http://localhost:3001` to your production backend URL

## Troubleshooting

**CORS Error**: Ensure CORS middleware is enabled
**Port Already in Use**: Change `PORT` in `.env`
**Razorpay SDK Error**: Check if keys are correct in `.env`

## Support

For issues, check backend logs:
```bash
npm run dev
```
