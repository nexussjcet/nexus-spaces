# Nexus Spaces

Nexus spaces is a AI driven social media platform where SJCET students can find and connect with developers, designers and other skilled individuals.

# Project Set Up

## Building and running locally

To build and run this project in your local dev environment, follow the instructions below. Be sure you have [Node.js](https://nodejs.org/) installed before you start.

## Step 1: Install dependencies

Run `npm install`

Refer to the env.example file for the environment variables examples

## Step 2: Create a .env file with the example variables

## Step 3: Create a new [Supabase](https://supabase.com/) account

1. Create a new project in Supabase
2. Go to 'Connect>ORMS'
3. Under 'Tools', select 'Drizzle'
4. Copy the url into 'DATABASE_URL and paste the password that you entered for the project

## Step 4: Create an OAuth on GitHub

1. Go to [Developers](https://github.com/settings/developers)
2. 'New OAuth App'
3. Input your homepage URL: http://localhost:3000 
4. Input the authorisation url: http://localhost:3000/api/auth/callback/github
5. Copy the Client ID to AUTH_GITHUB_ID
6. Copy the Client Secret to AUTH_GITHUB_SECRET

## Step 5: Generate the Authentication Secret Key
1. Go to your local repo terminal and run: `npx auth`
2. Agree to install any necessary packages
3. Go to your terminal and run: `npx auth secret`
4. Copy and paste the key into AUTH_SECRET

## Step 6: Run the app

Run the development server `npm run dev` 
You should be able to the page open in: http://localhost:3000
