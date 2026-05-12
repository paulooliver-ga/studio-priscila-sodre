import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import QRCodeDisplay from "@/components/QRCodeDisplay";

export default async function AdminServicosPage() {
  await requireAdmin();

  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
  });

  const appUrl = process.env.APP_URL || "http://localhost:3000";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Serviços</h2>
          <p className="text-gray-500">Adicione ou visualize QR Codes</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary">Novo Serviço</button>
          <button className="btn-secondary">Novo Produto</button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="card">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`badge ${
                  service.type === "SERVICE" ? "badge-primary" : "badge-warning"
                }`}
              >
                {service.type === "SERVICE" ? "Serviço" : "Produto"}
              </span>
              <span className={service.active ? "badge-success" : "badge-warning"}>
                {service.active ? "Ativo" : "Inativo"}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{service.name}</h3>
            <QRCodeDisplay value={`${appUrl}/scan/${service.qrCode}`} size={150} />
            <div className="mt-4 flex gap-2">
              <button className="flex-1 btn-primary py-2 text-sm">Imprimir</button>
              <button className="flex-1 btn-secondary py-2 text-sm">Editar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}