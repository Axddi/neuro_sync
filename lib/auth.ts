export async function login(email: string, password: string) {
  const res = await fetch(
    "https://ox1nsotsmf.execute-api.ap-south-1.amazonaws.com/dev/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", 
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}
export function getUserRole(): string | null {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    const parsed = JSON.parse(user);
    return parsed.role || null;
  } catch {
    return null;
  }
}
export async function signup(
  email: string,
  password: string,
  role: string
) {
  const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

  const redirectUri = encodeURIComponent("http://localhost:3000/callback");

  window.location.href =
  `${domain}/signup?client_id=${clientId}&response_type=token&scope=openid+email&redirect_uri=${redirectUri}&state=${role}`;
}