"use client";
import { useEffect } from "react";

export default function AuthHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;

    if (hash.includes("id_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("id_token");

      if (token) {
        localStorage.setItem("token", token);
        window.history.replaceState(null, "", "/dashboard");
      }
    }
  }, []);

  return null;
}