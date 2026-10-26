# IT Futures Event App - Digital Scavenger Hunt

A web-based gamification tool for the IT Futures fair. Visitors scan QR codes at company booths, engage in conversations with staff, answer quizzes, and earn points. The most successful participants win prizes.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Authentication:** Auth.js (NextAuth)
- **Database ORM:** Prisma
- **Database:** PostgreSQL (running in Docker)
- **Real-time:** WebSocket (ws)
- **Containerization:** Docker & Docker Compose

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:
- Node.js (v20 or higher)
- Docker & Docker Compose
- Git

## 🛠️ Local Setup Instructions

Follow these steps exactly in order to get the application running locally.

Step 1: Clone the Repository
Open your terminal and clone the project.
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
Step 2: Install Dependencies
Install all required npm packages.

bash
npm install
Step 3: Set Up Environment Variables
Copy the example environment file and configure it.

bash
cp .env.example .env
Open the .env file and fill in the required values:

DATABASE_URL: Use postgresql://user:password@localhost:5432/eventdb?schema=public for the local Docker setup.

AUTH_SECRET: A random string used by Auth.js to encrypt sessions. Generate one using npx auth secret.

AUTH_TRUST_HOST: Set to true.

AUTH_GOOGLE_ID & AUTH_GOOGLE_SECRET: (Optional) For Google login.

Step 4: Start the PostgreSQL Database via Docker
Start the database container in the background.

bash
docker compose up -d
Verify it is running:

bash
docker compose ps
Step 5: Initialize the Database with Prisma
Run the following commands sequentially to generate the Prisma client and apply all necessary migrations (including initial setup, consent fields, and logo fields).

bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma migrate dev --name add_consent
npx prisma migrate dev --name add_logo
Step 6: Start the WebSocket Server
The WebSocket server is required for real-time leaderboard updates. Open a new terminal window, navigate to the project directory, and run:

bash
npx tsx ws-server.ts
Keep this terminal window open and running in the background.

Step 7: Start the Next.js Development Server
Return to your original terminal and start the Next.js server.

bash
npm run dev
Step 8: Access the Application
Open your browser and navigate to:

Main App: http://localhost:3000

Company Login: http://localhost:3000/company/login

📂 Project Structure
text
├── app/                  # Next.js App Router (pages and API routes)
├── components/           # Reusable React components (UI, auth, layout)
├── lib/                  # Utility functions, Prisma client, Auth config
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── types/                # TypeScript type definitions
├── ws-server.ts          # WebSocket server for real-time updates
├── docker-compose.yml    # Docker configuration for PostgreSQL
└── .env.example          # Example environment variables
🔐 Security Notes
Passwords (if used) are hashed using bcryptjs before being stored.

The AUTH_SECRET must be kept secure and never committed to version control.

The .env file is ignored by Git to prevent leaking sensitive credentials.

Quiz answers are validated on the server-side (/api/quiz/check-answer) to prevent cheating via client-side inspection.

📝 License
This project is developed for the IT Futures fair. All rights reserved.