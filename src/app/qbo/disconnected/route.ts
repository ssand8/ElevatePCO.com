import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const QBO_REVOKE_URL =
  "https://developer.api.intuit.com/v2/oauth2/tokens/revoke";

export async function GET(request: NextRequest) {
  const realmId = new URL(request.url).searchParams.get("realmId");
  return handleDisconnect(realmId);
}

export async function POST(request: NextRequest) {
  let realmId: string | null = null;

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const body = await request.json();
      realmId = body.realmId ?? null;
    } catch {
      return errorResponse("Invalid JSON body.");
    }
  } else {
    const formData = await request.formData().catch(() => null);
    realmId = formData?.get("realmId")?.toString() ?? null;
  }

  return handleDisconnect(realmId);
}

async function handleDisconnect(
  realmId: string | null
): Promise<NextResponse> {
  if (!realmId) {
    return errorResponse("Missing realmId parameter.");
  }

  const clientId = process.env.QBO_CLIENT_ID;
  const clientSecret = process.env.QBO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Missing QBO_CLIENT_ID or QBO_CLIENT_SECRET");
    return errorResponse("Server configuration error.");
  }

  // Look up the tenant by realm_id
  const { data: tenant, error: selectError } = await supabase
    .schema("platform").from("tenants")
    .select("id")
    .eq("qbo_realm_id", realmId)
    .maybeSingle();

  if (selectError) {
    console.error("Supabase select error:", selectError);
    return errorResponse("Database error while looking up tenant.");
  }

  if (!tenant) {
    return errorResponse(`No tenant found for Company ID ${realmId}.`);
  }

  // Get the refresh token from the secure credentials table for revocation
  const { data: creds, error: credsError } = await supabase
    .schema("platform")
    .from("qbo_oauth_credentials")
    .select("refresh_token")
    .eq("tenant_id", tenant.id)
    .maybeSingle();

  if (credsError) {
    console.error("Supabase credentials select error:", credsError);
    return errorResponse("Database error while looking up credentials.");
  }

  // Revoke the token at Intuit (best-effort — we clear locally even if this fails)
  if (creds?.refresh_token) {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    try {
      const revokeResponse = await fetch(QBO_REVOKE_URL, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ token: creds.refresh_token }),
      });

      if (!revokeResponse.ok) {
        const body = await revokeResponse.text();
        console.warn(
          `QBO token revocation returned ${revokeResponse.status}: ${body}`
        );
      }
    } catch (err) {
      console.warn("QBO token revocation network error (proceeding):", err);
    }
  }

  // Delete credentials from the secure table
  const { error: deleteError } = await supabase
    .schema("platform")
    .from("qbo_oauth_credentials")
    .delete()
    .eq("tenant_id", tenant.id);

  if (deleteError) {
    console.error("Supabase delete error:", deleteError);
    return errorResponse("Database error while clearing tokens.");
  }

  return disconnectSuccessPage(realmId);
}

function disconnectSuccessPage(realmId: string): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>QuickBooks Disconnected — ElevatePCO</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f8fafc; color: #1e293b; }
    .card { background: white; border-radius: 12px; padding: 48px; max-width: 480px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 24px; margin: 0 0 12px; }
    p { color: #64748b; margin: 0 0 8px; font-size: 15px; }
    .realm { font-family: monospace; font-size: 13px; color: #94a3b8; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">&#128275;</div>
    <h1>QuickBooks Disconnected</h1>
    <p>Your QuickBooks Online account has been disconnected from ElevatePCO.</p>
    <p>The connection tokens have been revoked and removed.</p>
    <p class="realm">Company ID: ${escapeHtml(realmId)}</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

function errorResponse(message: string): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Disconnect Error — ElevatePCO</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f8fafc; color: #1e293b; }
    .card { background: white; border-radius: 12px; padding: 48px; max-width: 480px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 24px; margin: 0 0 12px; color: #dc2626; }
    p { color: #64748b; margin: 0 0 8px; font-size: 15px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">&#10007;</div>
    <h1>Disconnect Error</h1>
    <p>${escapeHtml(message)}</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 400,
    headers: { "Content-Type": "text/html" },
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
