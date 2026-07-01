"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";

function SidebarLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <svg width="26" height="26" viewBox="0 0 30 30" fill="none">
        <rect width="30" height="30" rx="8" fill="#5DA8D6"/>
        <path d="M6 15C8.5 12.5 11 11.5 15 13.5C19 15.5 21 16.5 24 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M6 19C8.5 16.5 11 15.5 15 17.5C19 19.5 21 20.5 24 18" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span style={{ fontSize: "14px", fontWeight: 700, color: "#1F2937", letterSpacing: "0.08em", textTransform: "uppercase" as const, fontFamily: "'Playfair Display', serif" }}>
        SurfBook
      </span>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { t } = useLanguage();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isSuperAdmin = user?.role === "super_admin";

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (isSuperAdmin) router.push("/super-admin");
    }
  }, [user, loading, isSuperAdmin, router]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4EFE3" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#5DA8D6", animation: "pulse 1.5s infinite" }}/>
          <span style={{ fontSize: "13px", color: "#5C6470", fontFamily: "'DM Sans', sans-serif" }}>Loading…</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const companyNavItems = [
    { label: t.dashboard.overview,   href: "/dashboard",              section: ""       },
    { label: t.dashboard.calendar,   href: "/dashboard/calendar",     section: ""       },
    { label: t.dashboard.bookings,   href: "/dashboard/bookings",     section: "manage" },
    { label: t.dashboard.rooms,      href: "/dashboard/rooms",        section: "manage" },
    { label: t.dashboard.packages,   href: "/dashboard/packages",     section: "manage" },
    { label: t.dashboard.activities, href: "/dashboard/activities",   section: "manage" },
    { label: t.dashboard.sessions,   href: "/dashboard/sessions",     section: "manage" },
    { label: t.dashboard.customers,  href: "/dashboard/customers",    section: "people" },
    { label: t.dashboard.team,       href: "/dashboard/team",         section: "people" },
    { label: t.dashboard.settings,   href: "/dashboard/settings",     section: "billing" },
  ];

  const filteredNavItems = companyNavItems.filter((item) => {
    if (user.role === "staff")
      return ["/dashboard","/dashboard/calendar","/dashboard/bookings","/dashboard/customers","/dashboard/sessions"].includes(item.href);
    if (user.role === "manager")
      return !["/dashboard/team","/dashboard/settings","/dashboard/subscription"].includes(item.href);
    return true;
  });

  const sectionLabels: Record<string, string> = { manage: "Manage", people: "People", billing: "Billing" };
  let currentSection = "";
  const navWithSections = filteredNavItems.map((item) => {
    const showSection = item.section && item.section !== currentSection;
    if (item.section) currentSection = item.section;
    return { ...item, showSectionLabel: showSection ? sectionLabels[item.section] : null };
  });

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  const SidebarContent = (
    <div style={{ display: "flex", flexDirection: "column" as const, height: "100%", background: "#FAF6EC", borderRight: "1px solid rgba(31,41,55,0.08)" }}>
      <div style={{ padding: "20px", borderBottom: "1px solid rgba(31,41,55,0.08)" }}>
        <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
          <SidebarLogo />
        </Link>
      </div>

      <nav style={{ flex: 1, padding: "12px", overflowY: "auto" as const }}>
        {navWithSections.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <div key={item.href}>
              {item.showSectionLabel && (
                <p style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.1em", padding: "20px 10px 8px", color: "rgba(92,100,112,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
                  {item.showSectionLabel}
                </p>
              )}
              <Link
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 10px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: "none",
                  marginBottom: "2px",
                  transition: "all 150ms",
                  fontFamily: "'DM Sans', sans-serif",
                  ...(isActive
                    ? { background: "rgba(93,168,214,0.1)", color: "#5DA8D6", border: "1px solid rgba(93,168,214,0.2)" }
                    : { color: "#5C6470", border: "1px solid transparent" }),
                }}
              >
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", flexShrink: 0, background: isActive ? "#5DA8D6" : "rgba(31,41,55,0.18)" }}/>
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>

      <div style={{ padding: "16px", borderTop: "1px solid rgba(31,41,55,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, background: "rgba(93,168,214,0.12)", border: "1px solid rgba(93,168,214,0.22)", color: "#5DA8D6", fontFamily: "'Playfair Display', serif" }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#1F2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, fontFamily: "'DM Sans', sans-serif" }}>
              {user.firstName} {user.lastName}
            </p>
            <p style={{ fontSize: "10px", color: "#5C6470", textTransform: "capitalize" as const }}>{user.role.replace("_", " ")}</p>
          </div>
        </div>
        <button onClick={logout} style={{ fontSize: "12px", fontWeight: 500, color: "rgba(92,100,112,0.7)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif", transition: "color 150ms" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#EF4444")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(92,100,112,0.7)")}>
          {t.dashboard.logout}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F4EFE3", fontFamily: "'DM Sans', sans-serif" }}>

      <aside className="w-56 fixed inset-y-0 left-0 z-30 hidden md:flex flex-col">
        {SidebarContent}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ background: "rgba(31,41,55,0.4)" }} onClick={() => setSidebarOpen(false)}/>
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-56 flex flex-col md:hidden transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {SidebarContent}
      </aside>

      <main className="flex-1 md:ml-56 min-h-screen flex flex-col">
        <div className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-20"
          style={{ background: "#FAF6EC", borderBottom: "1px solid rgba(31,41,55,0.08)" }}>
          <SidebarLogo />
          <button style={{ color: "#1F2937", background: "none", border: "none", cursor: "pointer", padding: "4px" }} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {sidebarOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, padding: "32px", maxWidth: "1280px", width: "100%" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
