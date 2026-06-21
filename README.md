# Interview Prep App

A full-stack web application designed to help job seekers prepare for interviews by generating customized, AI-driven interview strategies based on a target job description and the candidate's profile/resume.

## Features

- **User Authentication**: Secure signup and login flow with JWT and HTTP-only cookies.
- **Custom Interview Plans**: Paste a job description and upload a resume (or write a self-description) to generate targeted technical questions, behavioral questions, and a learning roadmap.
- **AI-Powered Analysis**: Utilizes AI services in the backend to deeply analyze the match between the resume and job requirements.
- **Modern UI**: A responsive, dark-themed user interface built with React and Sass.
- **History & Reports**: Saves past generated interview reports to your personal dashboard so you can review them later.

## Tech Stack

### Frontend
- React 18 (Vite)
- Sass for styling
- React Router DOM
- Axios for API requests

### Backend
- Node.js & Express.js
- MongoDB & Mongoose (for Users, Tokens, and Interview Reports)
- JSON Web Tokens (JWT) & bcryptjs for Authentication
- Google Gemini AI / LLM APIs for generating content

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB connection string (Atlas or Local)
- AI API Key (e.g. Google Gemini)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd "Resume analyzer"
   ```

2. **Setup the Backend:**
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file in the `Backend` directory with your environment variables:
   ```env
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   GOOGLE_GENAI_API_KEY=your_gemini_api_key
   ```
   Run the backend development server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../Frontend
   npm install
   ```
   Run the frontend development server:
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to `http://localhost:5173` in your browser. The Vite proxy is automatically configured to forward `/api` requests to the backend server.

## Security Note
This project contains a properly configured `.gitignore` that ensures sensitive files like `.env` and `node_modules` are excluded from version control. Never commit your API keys or database passwords to GitHub!
