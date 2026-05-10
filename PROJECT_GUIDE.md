# NutriCare — Project Guide & Rules

This document outlines the core architecture, security restrictions, and environment setup for the NutriCare platform.

## 1. Environment Variables (.env)
The project requires the following variables in a `.env` file at the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 2. Authentication & Session Security
To prevent admin session hijacking when creating new patients, the `AuthContext.jsx` includes a session guard:

- **Guard Logic**: The `onAuthStateChange` listener ignores `INITIAL_SESSION` events if a user profile is already active in the state. 
- **Isolated Client**: Administrative user creation uses the `supabaseSignup` client (`src/lib/supabaseAdmin.js`) which is configured with `persistSession: false` to ensure it never touches the admin's local storage.

## 3. Routing Restrictions
Protected routes are wrapped in guards located in `App.jsx`:

- **AdminRoute**: Only allows access if `profile.role === 'admin'`. It waits for the profile to load before redirecting to avoid race conditions.
- **GuestRoute**: Redirects authenticated users to their respective dashboards based on their role.

## 4. Database Security (RLS)
The database uses **Row Level Security** to protect user data:

- **Role Checking**: The system uses a custom `get_my_role()` function (Security Definer) to check permissions. This avoids "Infinite Recursion" loops common in standard RLS policies.
- **Admin Access**: Admins can bypass standard RLS filters for management tasks using specialized RPC functions like `admin_get_users(role)`.

## 5. Deployment Instructions
1. Run `npm install` to install dependencies.
2. Run the `DATABASE_SETUP.sql` script in the Supabase SQL Editor.
3. Add your `.env` variables.
4. Run `npm run dev` to start the project.
