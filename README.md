# IT Futures Event App - Digital Scavenger Hunt

A web-based gamification tool for the IT Futures fair. Visitors scan QR codes at company booths, engage in conversations with staff, answer quizzes, and earn points. The most successful participants win prizes.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Authentication:** Auth.js (NextAuth)
- **Database ORM:** Prisma
- **Database:** PostgreSQL (running in Docker)
- **Containerization:** Docker & Docker Compose

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20 or higher)
- [Docker](https://www.docker.com/) & Docker Compose
- [Git](https://git-scm.com/)

## 🛠️ Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
Install dependencies:

bash
npm install
Set up environment variables:
Copy the example environment file:

bash
cp .env.example .env
Open .env and fill in the required values:

DATABASE_URL: The PostgreSQL connection string (default is provided for Docker setup).

AUTH_SECRET: A random string used by Auth.js to encrypt sessions. You can generate one with npx auth secret.

AUTH_GOOGLE_ID & AUTH_GOOGLE_SECRET: (Optional) For Google login.

Start the PostgreSQL database via Docker:

bash
docker compose up -d
This will start a PostgreSQL container in the background.

Initialize the database with Prisma:

bash
npx prisma generate
npx prisma migrate dev --name init
This generates the Prisma client and creates the necessary database tables.

Start the development server:

bash
npm run dev
Access the application:
Open your browser and navigate to http://localhost:3000.

📂 Project Structure
text
├── app/                  # Next.js App Router (pages and API routes)
├── components/           # Reusable React components (UI, auth, layout)
├── lib/                  # Utility functions, Prisma client, Auth config
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── types/                # TypeScript type definitions
├── docker-compose.yml    # Docker configuration for PostgreSQL
└── .env.example          # Example environment variables
🔐 Security Notes
Passwords are hashed using bcryptjs before being stored in the database.

The AUTH_SECRET must be kept secure and never committed to version control.

The .env file is ignored by Git to prevent leaking sensitive credentials.

Quiz answers are validated on the server-side to prevent cheating.

📝 License
This project is developed for the IT Futures fair. All rights reserved