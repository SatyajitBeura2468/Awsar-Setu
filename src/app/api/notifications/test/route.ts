import { getWebPush } from "@/lib/server/push";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const webpush = getWebPush();
  const supabase = await getSupabaseServerClient();

  if (!webpush || !supabase) {
    return Response.json({
      ok: false,
      error: "Push or Supabase credentials are not configured.",
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint,p256dh,auth")
    .eq("user_id", user.id);

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  await Promise.all(
    (data ?? []).map((subscription) =>
      webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        JSON.stringify({
          title: "AwsarSetu",
          body: "Test alert: meaningful opportunity notifications are configured.",
          url: "/account",
        }),
      ),
    ),
  );

  return Response.json({ ok: true, sent: data?.length ?? 0 });
}
