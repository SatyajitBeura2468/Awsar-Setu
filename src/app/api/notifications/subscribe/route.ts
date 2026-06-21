import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const subscription = await request.json().catch(() => null);

  if (!subscription?.endpoint || !subscription?.keys?.p256dh) {
    return Response.json(
      { ok: false, error: "Invalid push subscription." },
      { status: 400 },
    );
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return Response.json({
      ok: false,
      error: "Supabase is not configured; subscription was not stored.",
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json(
      { ok: false, error: "Sign in to sync push subscriptions." },
      { status: 401 },
    );
  }

  const { error } = await supabase.from("push_subscriptions").upsert({
    user_id: user.id,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
    user_agent: request.headers.get("user-agent"),
  });

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
