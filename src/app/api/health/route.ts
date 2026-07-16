export async function GET() {
  return Response.json({
    ok: true,
    service: "AwsarSetu",
    version: "2.0.0",
  });
}
