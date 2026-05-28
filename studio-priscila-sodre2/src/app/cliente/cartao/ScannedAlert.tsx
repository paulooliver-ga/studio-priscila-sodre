"use client";

import { useEffect, useState } from "react";

export default function ScannedAlert() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      // Remove o parâmetro da URL sem recarregar
      const url = new URL(window.location.href);
      url.searchParams.delete("scanned");
      window.history.replaceState({}, "", url.toString());
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="rounded-2xl p-4 text-center font-semibold transition-opacity duration-500"
      style={{
        background: "rgba(212,175,55,0.15)",
        border: "1px solid rgba(212,175,55,0.4)",
        color: "#D4AF37",
      }}
    >
      ✅ Serviço registrado no seu cartão!
    </div>
  );
}