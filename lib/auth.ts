export async function login(email: string, password: string) {
  const res = await fetch(
    "https://ox1nsotsmf.execute-api.ap-south-1.amazonaws.com/dev/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  document.cookie = `token=${data.token}; path=/;`;
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  document.cookie = "token=; Max-Age=0; path=/";
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!getToken();
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