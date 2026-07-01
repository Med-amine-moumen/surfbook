"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <svg width="28" height="28" viewBox="0 0 30 30" fill="none">
        <rect width="30" height="30" rx="8" fill="#5DA8D6" />
        <path
          d="M6 15C8.5 12.5 11 11.5 15 13.5C19 15.5 21 16.5 24 14"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M6 19C8.5 16.5 11 15.5 15 17.5C19 19.5 21 20.5 24 18"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span
        style={{
          color: dark ? "#1F2937" : "#F8F5F2",
          fontSize: "17px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontFamily: "'Playfair Display', serif",
        }}
      >
        SurfBook
      </span>
    </div>
  );
}

const fieldStyle = {
  width: "100%",
  borderRadius: "12px",
  padding: "10px 16px",
  fontSize: "14px",
  background: "#FFFFFF",
  border: "1px solid rgba(31,41,55,0.12)",
  color: "#1F2937",
  outline: "none",
  transition: "all 0.2s ease",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#5C6470",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};

export default function LoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser.role === "super_admin") {
        logout();
        setError("Access denied. Please use the Super Admin login portal.");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F4EFE3",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        className="hidden lg:flex"
        style={{
          width: "48%",
          flexShrink: 0,
          position: "relative",
          backgroundImage: 'url("/hero.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "rgba(31,41,55,0.52)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Logo />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            style={{
              fontSize: "clamp(26px, 3vw, 40px)",
              fontWeight: 700,
              color: "#F8F5F2",
              fontFamily: "'Playfair Display', serif",
              lineHeight: 1.15,
              marginBottom: "12px",
            }}
          >
            Run your surf camp
            <br />
            on autopilot.
          </p>
          <p style={{ fontSize: "14px", color: "rgba(244,239,227,0.65)", lineHeight: 1.6 }}>
            Bookings, payments, and your team - all in one place.
          </p>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div className="lg:hidden" style={{ marginBottom: "40px" }}>
            <Logo dark />
          </div>

          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#1F2937",
              fontFamily: "'Playfair Display', serif",
              marginBottom: "8px",
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: "14px", color: "#5C6470", marginBottom: "36px" }}>
            Sign in to your SurfBook account.
          </p>

          {error && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "14px",
                marginBottom: "20px",
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#DC2626",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                style={fieldStyle}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                style={fieldStyle}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                fontSize: "15px",
                marginTop: "4px",
                border: 0,
                color: "#FFFFFF",
                fontWeight: 600,
                background: loading ? "rgba(93,168,214,0.55)" : "#5DA8D6",
                boxShadow: "0 0 24px rgba(93,168,214,0.22)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "14px", color: "#5C6470", marginTop: "28px" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "#5DA8D6", fontWeight: 600, textDecoration: "none" }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
