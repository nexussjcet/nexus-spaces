# Nexus Spaces

**Nexus Spaces** is an AI-driven social media platform where SJCET students can connect with developers, designers, and other skilled individuals.

---

## Project Setup

### Prerequisites
Before setting up the project, ensure you have the following:
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (bundled with Node.js)
- A [Supabase](https://supabase.com/) account
- A GitHub account for OAuth setup

### Steps to Build and Run Locally

Follow these steps to set up and run Nexus Spaces on your local machine:

#### Step 1: Install Dependencies
1. Clone the repository to your local machine:
   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Refer to the `env.example` file for example environment variables.

#### Step 2: Create a `.env` File
- Copy the `env.example` file:
  ```bash
  cp env.example .env
  ```
- Update the `.env` file with your specific environment variables.

#### Step 3: Set Up Supabase
1. Create a new project in [Supabase](https://supabase.com/).
2. Navigate to `Connect > ORMs`.
3. Under `Tools`, select **Drizzle**.
4. Copy the `DATABASE_URL` and enter the database password in the `.env` file.

#### Step 4: Configure GitHub OAuth
1. Go to [GitHub Developers Settings](https://github.com/settings/developers).
2. Create a new OAuth app:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Copy the **Client ID** and **Client Secret**:
   - Paste them into the `.env` file under `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`.

#### Step 5: Generate the Authentication Secret Key
1. Open your local repository in a terminal.
2. Run the following command to install necessary packages:
   ```bash
   npx auth
   ```
3. Generate the secret key:
   ```bash
   npx auth secret
   ```
4. Copy the generated key and paste it into `AUTH_SECRET` in the `.env` file.

#### Step 6: Run the Development Server
- Start the development server:
  ```bash
  npm run dev
  ```
- Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

---

## Contributing
If you'd like to contribute to Nexus Spaces, please submit a pull request or create an issue.


---

Feel free to reach out for support or questions!
