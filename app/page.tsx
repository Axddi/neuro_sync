"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/mood"); // ✅ logged in → go app
    } else {
      router.replace("/login"); // ❌ not logged in → login
    }
  }, []);

  return null;
}