# CodeRank

A full-stack coding assessment platform built for running structured coding tests, MCQ rounds, and mock interviews — with an admin panel to manage everything.

Built with React + Node.js + MongoDB.

---

## What it does

**For students/candidates:**
- Browse and attempt coding tests, MCQ rounds, and interview sessions
- Submit solutions along with time and space complexity analysis
- View detailed insights on past performance — scores, solved count, per-question breakdown
- Track progress over time through the insights page

**For admins:**
- Create tests manually or let AI generate them from a question bank
- Organize questions into folders and manage a reusable question bank
- Review submissions and evaluate them question by question, adding marks and remarks
- Upload interview results directly for candidates
- Manage the entire test lifecycle from one place

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend (client) | React, Vite, TailwindCSS + DaisyUI |
| Admin Panel | React, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT + HTTP-only cookies |
| AI Test Gen | Gemini API (via axios) |

---

## Project Structure

```
CodeRank/
├── client/        # Candidate-facing React app
├── admin/         # Admin dashboard React app
└── server/        # Express REST API
```

### Server routes

| Route | What it handles |
|---|---|
| `/api/auth` | Login, signup, logout |
| `/api/test` | Create, fetch, and manage tests |
| `/api/submissions` | Submit answers, evaluate, fetch results |
| `/api/question-bank` | CRUD for reusable questions |
| `/api/question-folders` | Organize questions into topic folders |
| `/api/ai-test` | Generate tests using AI |

---

## Getting Started

You'll need Node.js and a MongoDB instance (local or Atlas).

### 1. Clone the repo

```bash
git clone https://github.com/karanjain24895/CodeRank.git
cd CodeRank
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

Start the server:

```bash
npm run dev
```

### 3. Set up the client

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173`

### 4. Set up the admin panel

```bash
cd admin
npm install
npm run dev
```

Runs on `http://localhost:5174`

---

## Test Types

The platform supports three types of tests, each with its own flow:

- **Coding** — candidates submit links (e.g., GitHub Gist / Replit) along with their time and space complexity. Admins manually evaluate and assign marks per question.
- **MCQ** — auto-evaluated. Candidates pick from 4 options, results are instant.
- **Interview** — admin uploads the result directly after conducting the session.

---

## Submission Scoring

Each coding question is scored across three dimensions:

- Code correctness (`codingMarks`)
- Time complexity analysis (`timeComplexityMarks`)
- Space complexity analysis (`spaceComplexityMarks`)

Total score is computed as a virtual field on the submission document — nothing extra stored.

---

## AI Test Generation

Admins can generate tests automatically from saved question folders. The backend calls the Gemini API, selects relevant questions, and structures them into a test. The generated test goes through the same evaluation flow as a manually created one.

---

## License

MIT
