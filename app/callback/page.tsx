"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (!code) {
      router.push("/login");
      return;
    }

    const exchange = async () => {
      const res = await fetch("/api/auth/token", {
        method: "POST",
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      localStorage.setItem("token", data.id_token);

      router.push("/dashboard");
    };

    exchange();
  }, []);

  return <p className="text-white text-center mt-10">Authenticating...</p>;
}