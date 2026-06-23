export function getPublicEnv() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  };
}

export function isSupabaseConfigured() {
  const env = getPublicEnv();
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function getClientConfigStatus() {
  const env = getPublicEnv();
  return {
    supabase: Boolean(env.supabaseUrl && env.supabaseAnonKey),
    browserNotifications: Boolean(
      env.supabaseUrl && env.supabaseAnonKey && env.vapidPublicKey,
    ),
  };
}

export function requireServerEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}
