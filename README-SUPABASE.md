# Supabase Setup Guide for PromptForge

This guide will help you set up Supabase for your PromptForge application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `promptforge`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait for the project to be created (2-3 minutes)

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Click on **Settings** → **API**
3. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Disable auth for development
# NEXT_PUBLIC_DISABLE_AUTH=true
```

Replace `your_project_url_here` and `your_anon_key_here` with your actual values.

## 4. Run Database Migrations

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Run migrations:
   ```bash
   supabase db push
   ```

### Option B: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Click on **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run"
5. Copy and paste the contents of `supabase/migrations/002_rls_policies.sql`
6. Click "Run"

## 5. Enable Authentication

1. Go to **Authentication** → **Settings**
2. Configure your site URL:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Additional Redirect URLs**: `http://localhost:3000/dashboard`
3. Enable email authentication:
   - Go to **Authentication** → **Providers**
   - Enable **Email** provider
   - Optionally enable **Google** or other providers

## 6. Set Up Edge Functions (Optional)

If you want to use the server-side benchmarking function:

1. Install Supabase CLI (if not already installed)
2. Deploy the edge function:
   ```bash
   supabase functions deploy benchmark-prompts
   ```

## 7. Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`
3. Try signing up with a new account
4. Check if you can create prompts in the dashboard

## 8. Production Deployment

### For Vercel Deployment:

1. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Update your Supabase authentication settings:
   - **Site URL**: `https://your-domain.com`
   - **Additional Redirect URLs**: `https://your-domain.com/dashboard`

### For Other Platforms:

1. Add the same environment variables to your hosting platform
2. Update the site URLs in Supabase authentication settings

## Troubleshooting

### Common Issues:

1. **"Invalid supabaseUrl" error**:
   - Check that your `NEXT_PUBLIC_SUPABASE_URL` is correct
   - Make sure it starts with `https://`

2. **Authentication not working**:
   - Verify your redirect URLs in Supabase settings
   - Check that email authentication is enabled

3. **Database permission errors**:
   - Make sure you've run the RLS policies migration
   - Check that your user is properly created in the `users` table

4. **Edge functions not working**:
   - Ensure you've deployed the function to Supabase
   - Check that your API keys are properly configured

### Getting Help:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Join the [Supabase Discord](https://discord.supabase.com)
- Check the [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## Database Schema Overview

The database includes these main tables:

- **users**: User profiles linked to Supabase auth
- **prompts**: User-created prompts with versioning
- **prompt_versions**: Version history for prompts
- **benchmark_runs**: Benchmark test runs
- **model_responses**: Responses from different AI models
- **evaluations**: User ratings and feedback on responses
- **api_keys**: Encrypted storage of user API keys
- **usage_tracking**: Usage statistics and limits

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.
