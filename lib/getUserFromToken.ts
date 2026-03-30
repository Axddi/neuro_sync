import { jwtDecode } from "jwt-decode";

interface CognitoToken {
  email: string;
  sub: string;
  "cognito:username": string;
  "cognito:groups"?: string[];
}

export function getUserFromToken() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: CognitoToken = jwtDecode(token);

    return {
      email: decoded.email,
      id: decoded.sub,
      username: decoded["cognito:username"],
      role: decoded["cognito:groups"]?.[0] || "user",
    };
  } catch (err) {
    console.error("Invalid token");
    return null;
  }
}