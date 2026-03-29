import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = await req.json();

  const domain = "https://neurosync-dev-auth-76108613.auth.ap-south-1.amazoncognito.com";
  const clientId = "4qp727h14n606fb0thoikhb5oo";
  const redirectUri = "http://localhost:3000/";

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(`${domain}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await response.json();

  return NextResponse.json(data);
}