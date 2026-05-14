"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Reward { id: string; type: string; reason: string; used: boolean; createdAt: string; loyaltyCard: { user: { name: string; phone: string } }; }

export default function RecompensasPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  async function load() {
    const res = await fetch(`/api/admin/rewards?filter=${filter}`);
    setRewards(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, [filter]);

  async function markUsed(id: string) {
    await fetch(`/api/admin/rewards/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ used: true }) });
    toast.success("Marcada como usada! ✅");
    load();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold gold-text">Recompensas</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(212,175,55,0.5)" }}>Gerencie brindes e descontos</p>
      </div>
      <div className="flex gap-2">
        {(["pending", "all"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-2xl text-sm font-semibold transition-all"
            style={filter === f
              ? { background: "linear-gradient(135deg, #D4AF37, #f0d060)", color: "#000" }
              : { background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.2)", color: "rgba(212,175,55,0.6)" }}>
            {f === "pending" ? "🏆 Pendentes" : "📋 Todas"}
          </button>
        ))}
      </div>
      {loading ? <p className="text-center py-8" style={{ color: "rgba(212,175,55,0.4)" }}>Carregando...</p> :
        rewards.length === 0 ? (
          <div className="card text-center py-12">
            <span className="text-5xl">🎉</span>
            <p className="mt-4" style={{ color: "rgba(212,175,55,0.5)" }}>{filter === "pending" ? "Nenhuma pendente!" : "Nenhuma encontrada."}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rewards.map((r) => (
              <div key={r.id} className={`card flex items-center justify-between gap-4 ${r.used ? "opacity-40" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{r.type === "GIFT" ? "🎁" : "🏷️"}</span>
                  <div>
                    <p className="font-semibold" style={{ color: "#f5e6a3" }}>{r.loyaltyCard.user.name}</p>
                    <p className="text-xs" style={{ color: "rgba(212,175,55,0.5)" }}>{r.type === "GIFT" ? "Brinde" : "50% Desconto"} — {r.reason}</p>
                    <p className="text-xs" style={{ color: "rgba(212,175,55,0.35)" }}>📞 {r.loyaltyCard.user.phone} • {new Date(r.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                {!r.used ? (
                  <button onClick={() => markUsed(r.id)} className="btn-gold text-sm whitespace-nowrap">Usar ✓</button>
                ) : (
                  <span className="text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(212,175,55,0.05)", color: "rgba(212,175,55,0.3)" }}>Usado</span>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
