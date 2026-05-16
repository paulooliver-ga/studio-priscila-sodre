"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Promotion { id: string; title: string; description: string; active: boolean; startsAt: string; endsAt: string; }

export default function PromocoesAdminPage() {
  const [toggling, setToggling] = useState(false);

  async function handleAdd(e: React.FormEvent) {
  e.preventDefault();
  setAdding(true);
  try {
    const res = await fetch("/api/admin/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) throw new Error("Erro");
    toast.success("Promoção criada! 🎉");
    setForm({ title: "", description: "", startsAt: "", endsAt: "" });
    load();
  } catch {
    toast.error("Erro ao criar");
  } finally {
    setAdding(false);
  }
}
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", startsAt: "", endsAt: "" });
  const [adding, setAdding] = useState(false);
  const [waLinks, setWaLinks] = useState<{name: string; phone: string; link: string}[]>([]);

  async function load() {
  setLoading(true);
  try {
    const res = await fetch("/api/admin/promotions");
    if (!res.ok) throw new Error("Erro");
    const data = await res.json();
    setPromos(data);
  } catch {
    toast.error("Erro ao carregar");
  } finally {
    setLoading(false);
  }
}
  useEffect(() => {
  load();
}, []);



 async function togglePromo(id: string) {
  setToggling(true);
  try {
    const res = await fetch(`/api/admin/promotions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !promos.find(p => p.id === id)?.active }),
    });
    if (!res.ok) { toast.error("Erro ao ativar/desativar"); return; }
    toast.success("Promoção atualizada!");
    load();
  } catch {
    toast.error("Erro");
  } finally {
    setToggling(false);
  }
}
   {waLinks.length > 0 && (
  <div className="card">
    <h3 className="font-bold gold-text mb-3">📣 Enviar para clientes</h3>
    <p className="text-xs mb-4" style={{ color: "rgba(212,175,55,0.5)" }}>
      Clique em cada cliente para abrir o WhatsApp
    </p>
    <div className="space-y-2">
      {waLinks.map((l) => (
        <a key={l.phone} href={l.link} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-between rounded-2xl px-4 py-3 transition-all hover:opacity-80"
          style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#f5e6a3" }}>{l.name}</p>
            <p className="text-xs" style={{ color: "rgba(212,175,55,0.4)" }}>📞 {l.phone}</p>
          </div>
          <span style={{ color: "#25d366" }}>💬</span>
        </a>
      ))}
    </div>
  </div>
)}

 return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold gold-text">Promoções</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(212,175,55,0.5)" }}>Gerencie as promoções da semana</p>
      </div>
      <div className="card">
        <h2 className="font-display text-lg font-semibold gold-text mb-4">Nova Promoção</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <input className="input-field" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input-field resize-none" rows={3} placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Início</label>
              <input type="datetime-local" className="input-field" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} required />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Fim</label>
              <input type="datetime-local" className="input-field" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} required />
            </div>
          </div>
          <button type="submit" disabled={adding} className="btn-primary w-full">{adding ? "..." : "+ Adicionar Promoção"}</button>
        </form>
      </div>
      {loading ? <p className="text-center py-8" style={{ color: "rgba(212,175,55,0.4)" }}>Carregando...</p> : (
    <div className="space-y-3">
     {promos.map((p) => (
      <div key={p.id} className="card">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold gold-text">{p.title}</h3>
            <p className="text-sm mt-1" style={{ color: "rgba(212,175,55,0.6)" }}>{p.description}</p>
            <p className="text-xs mt-2" style={{ color: "rgba(212,175,55,0.3)" }}>
              {new Date(p.startsAt).toLocaleDateString('pt-BR')} → {new Date(p.endsAt).toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="flex gap-2">
            <button onClick={() => togglePromo(p.id)} disabled={toggling}
              className="flex-1 text-xs px-3 py-2 rounded-full font-semibold"
              style={{ background: p.active ? "rgba(212,175,55,0.2)" : "rgba(100,100,100,0.2)", color: p.active ? "#D4AF37" : "#999" }}>
              {p.active ? "✓ Ativa" : "○ Inativa"}
            </button>
            <button onClick={() => sendWhatsAppReminder(p)} disabled={sending}
              className="flex-1 text-xs px-3 py-2 rounded-full font-semibold"
              style={{ background: "rgba(37,211,102,0.15)", color: "#25d366" }}>
              📣 WhatsApp
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
)};
</div>
);
}
