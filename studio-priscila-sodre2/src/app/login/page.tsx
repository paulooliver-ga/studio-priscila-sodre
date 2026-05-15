"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LOGO_BASE64 } from "@/lib/logo";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: "", phone: "", password: "", birthdate: "" });
  function handlePhone(v: string) {
    setForm({ ...form, phone: v.replace(/\D/g, "") });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.phone || !form.password) { toast.error("Preencha telefone e senha"); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Erro ao entrar"); return; }
      toast.success(mode === "login" ? "Bem-vinda! 💖" : "Conta criada! 💖");
      if (data.role === "ADMIN") router.push("/admin");
      else router.push("/cliente/cartao");
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <img src={LOGO_BASE64} alt="Studio Priscila Sodré"
            className="w-36 h-36 rounded-full object-cover"
            style={{ border: "3px solid #D4AF37", boxShadow: "0 0 40px rgba(212,175,55,0.5)" }} />
        </div>
        <h1 className="font-display text-2xl font-bold gold-text">Studio Priscila Sodré</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(212,175,55,0.5)" }}>Cartão fidelidade digital ✨</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm card">
        {/* Tabs */}
        <div className="flex rounded-2xl p-1 mb-5" style={{ background: "rgba(212,175,55,0.08)" }}>
          {(["login", "register"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
              style={mode === m
                ? { background: "linear-gradient(135deg, #D4AF37, #f0d060)", color: "#000" }
                : { color: "rgba(212,175,55,0.5)" }}>
              {m === "login" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
           <div>
             <label className="text-xs font-semibold uppercase tracking-wide block mb-1" 
               style={{ color: "rgba(212,175,55,0.6)" }}>Data de Aniversário</label>
             <input className="input-field" type="date"
                value={form.birthdate}
               onChange={(e) => setForm({ ...form, birthdate: e.target.value })} />
             <p className="text-xs mt-1" style={{ color: "rgba(212,175,55,0.3)" }}>
               Ganhe 10% de desconto no seu aniversário! 🎂
             </p>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1"
              style={{ color: "rgba(212,175,55,0.6)" }}>Telefone (somente números)</label>
            <input className="input-field" placeholder="61999999999"
              value={form.phone} onChange={(e) => handlePhone(e.target.value)} required />
            <p className="text-xs mt-1" style={{ color: "rgba(212,175,55,0.3)" }}>Ex: 61982533037</p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1"
              style={{ color: "rgba(212,175,55,0.6)" }}>Senha</label>
            <input className="input-field" type="password" placeholder="••••••••"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? "Aguarde..." : mode === "login" ? "Entrar ✨" : "Criar conta"}
          </button>
        </form>
      </div>

      <p className="text-xs mt-6" style={{ color: "rgba(212,175,55,0.3)" }}>
        Studio Priscila Sodré • (61) 98253-3037
      </p>
    </div>
  );
}
