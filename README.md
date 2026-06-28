# AI Interview Prep & Resume Analyzer

Hey! 👋 Welcome to my AI-powered interview prep app. I built this because getting ready for interviews is hard enough without having to guess what questions they'll actually ask you. This project takes a target job description and your resume (or just a quick blurb about your experience), and uses AI to generate tailored technical questions, behavioral questions, and a custom learning roadmap. 

## What it does
- **Custom Interview Strategies:** Paste the job description, upload your resume (PDF), and get incredibly targeted prep materials.
- **AI-Powered Analysis:** Uses Google Gemini (and Groq/Llama as fallbacks) to do a deep dive on how well your resume matches the job requirements.
- **Dashboard & History:** All your generated interview reports are saved to your personal dashboard so you can review them whenever you want.
- **Secure Authentication:** Standard JWT login flow with HTTP-only cookies to keep your session secure.

## Tech Stack
I built this project using a modern JS stack:
- **Frontend:** React 18 with Vite, heavily styled using vanilla Sass. It features a responsive, sleek dark theme.
- **Backend:** Node.js & Express.
- **Database:** MongoDB & Mongoose for handling users, auth tokens, and saving interview reports.
- **AI Integrations:** `@google/genai` and `groq-sdk` for the heavy LLM lifting.
- **Other cool stuff:** `pdf-parse` for reading those uploaded resumes and `puppeteer` (just in case we need to fetch live data!).

## How to run it locally

If you want to spin this up yourself and play around with the code, here's how:

### 1. Clone the repo
```bash
git clone https://github.com/rozichilwal/Interview-prep-app
cd Interview-Prep-App
```

### 2. Set up the Backend
```bash
cd Backend
npm install
```
You'll need a `.env` file in the `Backend` folder. Go ahead and create one with these variables:
```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key # Used as a fallback if Gemini is busy
```
Then start the development server:
```bash
npm run dev
```

### 3. Set up the Frontend
Open up a new terminal tab and run:
```bash
cd Frontend
npm install
npm run dev
```

The frontend will start running on `http://localhost:5173`. I've set up the Vite proxy to automatically route `/api` requests to the backend, so you don't have to deal with annoying CORS errors during development!

## Security 
Just a quick heads-up: make sure you never commit your `.env` file or any API keys. The `.gitignore` is already set up to catch it, but it's always good to be careful.

---
Feel free to poke around the code, use it to crush your next interview, or submit PRs if you have ideas on how to make it better!
