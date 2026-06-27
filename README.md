# RegisterKaro - Income Tax Portal Credentials Generation Automation

This repository contains the automation system for generating and recovering Income Tax portal credentials, streaming events in real-time, and presenting runs on an interactive operations dashboard.

---

## Architecture Overview

1. **`automation/`**: Playwright (Chromium) bot that logs into/interacts with the live Income-Tax portal.
2. **`service/`**: Node.js Express server acting as the orchestrator and persistence layer for jobs & events, using MongoDB.
3. **`ui/`**: Next.js 14 Web UI displaying active job streams, interactive live consoles (for human-in-the-loop OTP entry), and admin metrics.

---

## Prerequisites

* **Node.js** (v18 or higher recommended)
* **MongoDB** (running locally on port `27017` or remote URI)

---

## Getting Started (<10 minutes Setup)

### 1. Configure Environment Variables
Create `.env` files in each project directory. You can copy the values below:

#### `service/.env`
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/registerkaro
WEBHOOK_SECRET=my_super_secret_webhook_token
JWT_SECRET=change-this-jwt-secret-in-production
JWT_EXPIRES_IN=7d
ADMIN_PASSWORD=admin123
SPOC_PASSWORD=spoc123
ENCRYPTION_KEY=32-char-hex-or-passphrase-for-aes
```

#### `automation/.env`
```env
WEBHOOK_URL=http://localhost:4000/webhook/events
API_URL=http://localhost:4000/api
WEBHOOK_SECRET=my_super_secret_webhook_token
DUMMY_PAN=ABCDE1234F
DUMMY_JOB_ID=66782c5a0000000000000001
```

#### `ui/.env`
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
MONGO_URI=mongodb://localhost:27017/registerkaro
```

---

### 2. Install Dependencies
Run the command below from the root directory to install all dependencies for the workspace and sub-components:
```bash
npm run install:all
```

---

### 3. Seed Database Users
Seed the MongoDB database with admin and SPOC users:
```bash
npm run seed:users --prefix service
```

---

### 4. Start the Application
Launch both the backend API and Next.js frontend concurrently:
```bash
npm run dev
```
* **Frontend Web UI**: [http://localhost:3008](http://localhost:3008)
* **Backend Express API**: [http://localhost:4000](http://localhost:4000)

---

### 5. Running Automated Tests
Run unit and integration tests (built using Node.js's native `node:test` framework):
```bash
npm run test
```

---

## Triggering an Automation Run

1. Open the UI at [http://localhost:3008](http://localhost:3008) and log in using either `admin` / `admin123` or `spoc` / `spoc123`.
2. Click **Launch Job** from the sidebar.
3. Fill in the taxpayer's **PAN** (format `ABCDE1234F`) and required basic information (Name, Date of Birth, Email, Mobile).
4. Click **Launch Job** to spawn the bot.
5. You will be redirected to the **Live Job Details Console** where you can observe real-time progress.
6. When the bot reaches the **OTP Gate**, enter the received OTP in the provided UI field to resume execution.
