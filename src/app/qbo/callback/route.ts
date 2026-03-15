import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const QBO_TOKEN_URL =
  "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Check for errors returned by Intuit
  const error = searchParams.get("error");
  if (error) {
    const errorDescription =
      searchParams.get("error_description") ?? "Unknown error";
    console.error(`QBO OAuth error: ${error} — ${errorDescription}`);
    return errorPage(`Authorization denied: ${errorDescription}`);
  }

  const code = searchParams.get("code");
  const realmId = searchParams.get("realmId");
  const state = searchParams.get("state");

  if (!code || !realmId || !state) {
    return errorPage("Missing required parameters (code, realmId, or state).");
  }

  // CSRF validation: compare state param to the cookie we set in /qbo/connect
  const storedState = request.cookies.get("qbo_oauth_state")?.value;
  if (!storedState || storedState !== state) {
    return errorPage("Invalid state parameter. Please try connecting again.");
  }

  // Exchange authorization code for tokens
  const clientId = process.env.QBO_CLIENT_ID;
  const clientSecret = process.env.QBO_CLIENT_SECRET;
  const redirectUri =
    process.env.QBO_REDIRECT_URI ??
    "https://integrations.elevatepco.com/qbo/callback";

  if (!clientId || !clientSecret) {
    console.error("Missing QBO_CLIENT_ID or QBO_CLIENT_SECRET");
    return errorPage("Server configuration error.");
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  let tokenData: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    x_refresh_token_expires_in: number;
    token_type: string;
  };

  try {
    const tokenResponse = await fetch(QBO_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      console.error(
        `QBO token exchange failed (${tokenResponse.status}): ${errorBody}`
      );
      return errorPage("Failed to exchange authorization code for tokens.");
    }

    tokenData = await tokenResponse.json();
  } catch (err) {
    console.error("QBO token exchange network error:", err);
    return errorPage("Network error during token exchange.");
  }

  // Calculate token expiration timestamp
  const expiresAt = new Date(
    Date.now() + tokenData.expires_in * 1000
  ).toISOString();

  // Save tokens: realm_id on tenants, credentials in separate secure table
  try {
    // Look up tenant by realm_id
    const { data: existingTenant, error: selectError } = await supabase
      .schema("platform").from("tenants")
      .select("id")
      .eq("qbo_realm_id", realmId)
      .maybeSingle();

    if (selectError) {
      console.error("Supabase select error:", selectError);
      return errorPage("Database error while looking up tenant.");
    }

    let tenantId: string;

    if (existingTenant) {
      tenantId = existingTenant.id;
    } else {
      // No tenant for this realm — create one (may need manual config later)
      console.warn(
        `No existing tenant found for realm_id ${realmId}. ` +
          "Creating a new row — the tenant may need manual configuration."
      );

      const { data: newTenant, error: insertError } = await supabase
        .schema("platform").from("tenants")
        .insert({ qbo_realm_id: realmId })
        .select("id")
        .single();

      if (insertError || !newTenant) {
        console.error("Supabase insert error:", insertError);
        return errorPage("Database error while creating tenant record.");
      }

      tenantId = newTenant.id;
    }

    // Upsert tokens into the secure credentials table (service_role only)
    const { error: credError } = await supabase
      .schema("platform")
      .from("qbo_oauth_credentials")
      .upsert(
        {
          tenant_id: tenantId,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "tenant_id" }
      );

    if (credError) {
      console.error("Supabase credentials upsert error:", credError);
      return errorPage("Database error while saving tokens.");
    }
  } catch (err) {
    console.error("Unexpected Supabase error:", err);
    return errorPage("Unexpected database error.");
  }

  // Clear the state cookie and show success
  const response = successPage(realmId);
  response.cookies.delete("qbo_oauth_state");
  return response;
}

function successPage(realmId: string): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>QuickBooks Connected — ElevatePCO</title>
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
    <div class="icon">&#10003;</div>
    <h1>QuickBooks Connected</h1>
    <p>Your QuickBooks Online account has been successfully connected to ElevatePCO.</p>
    <p>You can close this window.</p>
    <p class="realm">Company ID: ${escapeHtml(realmId)}</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

function errorPage(message: string): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Connection Error — ElevatePCO</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f8fafc; color: #1e293b; }
    .card { background: white; border-radius: 12px; padding: 48px; max-width: 480px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 24px; margin: 0 0 12px; color: #dc2626; }
    p { color: #64748b; margin: 0 0 8px; font-size: 15px; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">&#10007;</div>
    <h1>Connection Error</h1>
    <p>${escapeHtml(message)}</p>
    <p style="margin-top: 16px;"><a href="/qbo/connect">Try again</a></p>
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
