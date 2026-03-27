const API = "https://ox1nsotsmf.execute-api.ap-south-1.amazonaws.com/dev";

export async function api(path: string, options: any = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const url = `${API}/${path.replace(/^\/+/, "")}`;

  const headers: any = {
    "Content-Type": "application/json",
  };

  if (options.headers) {
    for (const key in options.headers) {
      if (key.toLowerCase() !== "authorization") {
        headers[key] = options.headers[key];
      }
    }
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log("API CALL →", url);
  console.log("TOKEN →", token?.slice(0, 20) + "...");

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API ERROR:", text);
    throw new Error(text);
  }

  return res.json();
}