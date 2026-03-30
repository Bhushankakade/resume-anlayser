# ResumeAI - MERN Stack Resume Analyzer

This is a full-stack Resume Analyzer application built with the MERN stack (MongoDB, Express, React, Node.js). It uses Google's Gemini LLM to analyze uploaded PDF resumes and provide actionable feedback, and integrates Razorpay for an automated credit/billing system.

## Features

- **Authentication:** Secure user registration, login, and JWT-based session management.
- **Credit System:** New users get 3 free credits. Analyzing a resume deducts 1 credit.
- **Razorpay Billing:** Users can purchase additional credits via the integrated Razorpay checkout flow (mocked for testing purposes).
- **AI Resume Analysis:** Upload a PDF resume. The backend extracts text using `pdf-parse` and scores it using the **Google Gemini 1.5 Flash API**.
- **Aesthetic UI:** Premium Glassmorphism UI built with Tailwind CSS, Framer Motion, and Lucide React icons.

## Prerequisites

Node.js (v18+) and npm installed on your machine.
A MongoDB cluster (e.g., MongoDB Atlas).

## Environment Variables

### Backend (`/backend/.env`)

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_google_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Frontend (`/frontend/.env`)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Running the Project Locally

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

The server will start on `http://localhost:5000`.

### 2. Start the Frontend

In a separate terminal window:

```bash
cd frontend
npm install
npm run dev
```

The React app will be available at `http://localhost:5173`.

## Deployment Recommendations

1. **Database:** Host your MongoDB database on **MongoDB Atlas** (Free tier available).
2. **Backend:** Deploy the Node.js Express server to **Render** or **Railway**. Remember to add all the Backend Environment Variables in the provider's dashboard.
3. **Frontend:** Deploy the Vite React app to **Vercel** or **Netlify**. Ensure you set the `VITE_API_URL` to your production backend URL and `VITE_RAZORPAY_KEY_ID` to your production Razorpay key.

## Built With

*   [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [Framer Motion](https://www.framer.com/motion/)
*   [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
*   [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
*   [Google Gemini API](https://ai.google.dev/)
*   [Razorpay](https://razorpay.com/)
