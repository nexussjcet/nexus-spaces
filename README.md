# Nexus Spaces

Nexus Spaces is an AI-driven social media platform where SJCET students can connect with developers, designers, and other skilled individuals.

---

## Project Setup

### Prerequisites

Before you start, ensure you have the following installed:

- [Node.js](https://nodejs.org/)

### Building and Running Locally

Follow these steps to set up the project in your local development environment:

---

## Step 1: Install Dependencies

1. Clone the repository to your local machine.
2. Navigate to the project folder.
3. Run the following command to install required dependencies:

   ```bash
   npm install
   ```

---

## Step 2: Set Up Environment Variables (.env)

1. Refer to the `env.example` file for examples of the required environment variables.
2. Create a `.env` file in the root of the project.
3. Copy and configure the variables from `env.example` into your `.env` file.

#### ⚠️ Caution: Do not include your secret keys in the example env.example file. Keep them private in your .env file.

---

## Step 3: Set Up Supabase

1. Create a [Supabase](https://supabase.com/) account.
2. Create a new project within Supabase.
3. Navigate to **Connect > ORMs**.
4. Under **Tools**, select **Drizzle**.
5. Copy the database URL into the `DATABASE_URL` variable in your `.env` file.
6. Enter the password you set for the project into your `.env` file.

---

## Step 4: Set Up GitHub OAuth

1. Go to [GitHub Developers](https://github.com/settings/developers).
2. Create a **New OAuth App**.
3. Provide the following details:
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization Callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Copy the generated Client ID and paste it into `AUTH_GITHUB_ID` in your `.env` file.
5. Copy the generated Client Secret and paste it into `AUTH_GITHUB_SECRET` in your `.env` file.

---

## Step 5: Generate an Authentication Secret Key

1. Open your terminal in the project directory.
2. Run the following command to install any necessary packages:

   ```bash
   npx auth
   ```

3. Generate the secret key by running:

   ```bash
   npx auth secret
   ```

4. Copy and paste the generated key into `AUTH_SECRET` in your `.env` file.

---

## Step 6: Push Database Schema (Essential Step)

1. Push the database schema to Supabase by running:

   ```bash
   npm run db:push
   ```

   > **Note:** The `db:push` command synchronizes your Schema with your database schema without using migrations. This is particularly useful during prototyping and local development.
---

## Step 7: Run the Application

1. Start the development server by running:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:

   [http://localhost:3000](http://localhost:3000)

---

### Additional Commands

- **Database Push:**
  Push the database schema to Supabase:

  ```bash
  npm run db:push
  ```

---

### Troubleshooting

If you encounter any issues during setup, double-check:

- Your `.env` file configuration.
- That you’ve run `npm install` and `npm run db:push` correctly.
- Your Supabase project setup.

For further assistance, refer to the official documentation of [Supabase](https://supabase.com/docs) or [Next.js](https://nextjs.org/docs).

---
