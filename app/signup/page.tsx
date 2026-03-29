"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup, login } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("caregiver");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      await signup(email, password, role);
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a] text-white">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Create Account
        </h1>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <input
          className="w-full p-3 mb-4 rounded-lg bg-white/20"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-4 rounded-lg bg-white/20"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="w-full p-3 mb-6 rounded-lg bg-white/20"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="caregiver">Caregiver</option>
          <option value="doctor">Doctor</option>
        </select>

        <button
          disabled={loading}
          onClick={handleSignup}
          className="w-full bg-indigo-500 hover:bg-indigo-600 p-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-sm mt-4 text-center text-muted-foreground">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-indigo-400 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}