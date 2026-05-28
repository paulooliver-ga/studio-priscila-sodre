<button
  onClick={async () => {
    console.log("selectedPromoId:", selectedPromoId);
    console.log("promocoes:", promocoes);
    
    const clientPhones = ["61999999999", "61988888888"];
    const promotion = promocoes.find(p => p.id === selectedPromoId);
    
    console.log("promotion encontrada:", promotion);
    
    if (!promotion) {
      toast.error("Selecione uma promoção");
      return;
    }

    const res = await fetch("/api/admin/send-promotions-whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientPhones,
        promotionTitle: promotion.titulo,
        promotionDescription: promotion.descricao,
      }),
    });

    const data = await res.json();
    console.log("Resposta:", data);
    
    if (data.ok) {
      toast.success(data.message);
    } else {
      toast.error(data.error);
    }
  }}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
>
  📱 Enviar WhatsApp
</button>