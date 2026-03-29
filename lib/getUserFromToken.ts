import { jwtDecode } from "jwt-decode";

interface CognitoToken {
  email: string;
  sub: string;
  "cognito:username": string;
}

export function getUserFromToken() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const decoded: CognitoToken = jwtDecode(token);

    return {
      email: decoded.email,
      id: decoded.sub,
      username: decoded["cognito:username"],
    };
  } catch (err) {
    console.error("Invalid token");
    return null;
  }
}