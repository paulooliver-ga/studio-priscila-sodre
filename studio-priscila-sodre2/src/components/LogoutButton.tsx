"use client";
export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }
  return (
    <button onClick={handleLogout} className="text-xs" style={{ color: "rgba(212,175,55,0.4)" }}>
      Sair
    </button>
  );
}