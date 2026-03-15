import { NextResponse } from "next/server";

const QBO_AUTH_URL = "https://appcenter.intuit.com/connect/oauth2";
const QBO_SCOPES = "com.intuit.quickbooks.accounting";

export async function GET() {
  const clientId = process.env.QBO_CLIENT_ID;
  const redirectUri =
    process.env.QBO_REDIRECT_URI ??
    "https://integrations.elevatepco.com/qbo/callback";

  if (!clientId) {
    return new NextResponse("Server configuration error: missing QBO_CLIENT_ID", {
      status: 500,
    });
  }

  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    scope: QBO_SCOPES,
    redirect_uri: redirectUri,
    state,
  });

  const authorizationUrl = `${QBO_AUTH_URL}?${params.toString()}`;

  const response = NextResponse.redirect(authorizationUrl);

  // Store state in a secure httpOnly cookie for CSRF validation on callback
  response.cookies.set("qbo_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });

  return response;
}
