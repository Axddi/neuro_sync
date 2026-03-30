"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleLogin = () => {
  const domain = "https://neurosync-dev-auth-76108613.auth.ap-south-1.amazoncognito.com";
  const clientId = "4qp727h14n606fb0thoikhb5oo";

  const redirectUri = encodeURIComponent("http://localhost:3000/dashboard");

  const url = `${domain}/login?client_id=${clientId}&response_type=token&scope=openid+email&redirect_uri=${redirectUri}`;

  window.location.href = url;
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1f1f2e] to-[#2c2c3c] text-white">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          NeuroSync Login
        </h1>

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <input
          className="w-full p-3 mb-4 rounded-lg bg-white/20 outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-6 rounded-lg bg-white/20 outline-none"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 p-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm mt-4 text-center text-muted-foreground">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-indigo-400 cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}