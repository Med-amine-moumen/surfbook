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

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
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
            Set up in minutes.
            <br />
            No credit card needed.
          </p>
          <p style={{ fontSize: "14px", color: "rgba(244,239,227,0.65)", lineHeight: 1.6 }}>
            Join hundreds of surf camps already using SurfBook.
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
        <div style={{ width: "100%", maxWidth: "420px" }}>
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
            Create your account
          </h1>
          <p style={{ fontSize: "14px", color: "#5C6470", marginBottom: "36px" }}>
            Set up your surf company in minutes.
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

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input
                  style={fieldStyle}
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  style={fieldStyle}
                  type="text"
                  name="lastName"
                  placeholder="Surfer"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Company Name</label>
              <input
                style={fieldStyle}
                type="text"
                name="companyName"
                placeholder="Bali Surf Camp"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                style={fieldStyle}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                style={fieldStyle}
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
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
              {loading ? "Creating account..." : "Create Account - It's Free"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "14px", color: "#5C6470", marginTop: "24px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#5DA8D6", fontWeight: 600, textDecoration: "none" }}>
              Log in
            </Link>
          </p>
          <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(92,100,112,0.55)", marginTop: "12px" }}>
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
