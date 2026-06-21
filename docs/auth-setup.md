# Auth Setup

## Email And Password

Enable email/password sign-in in Supabase Auth. The app uses `signInWithPassword` and does not fake login when credentials are absent.

## Phone OTP

1. Configure an SMS provider in Supabase.
2. Set `NEXT_PUBLIC_ENABLE_PHONE_OTP=true`.
3. Test OTP delivery in a non-production environment first.

When disabled, the UI shows a clean configuration notice.

## Continue With Google

1. Create a Google OAuth client in Google Cloud Console.
2. Add the client ID and secret inside Supabase Auth provider settings.
3. Add redirect URLs for local and production deployments.
4. Do not store OAuth client secrets in this repository.

Google OAuth is the only allowed Google service integration.
