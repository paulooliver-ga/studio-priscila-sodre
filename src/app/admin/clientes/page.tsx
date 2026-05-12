import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export default async function AdminClientesPage() {
  await requireAdmin();

  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    include: {
      loyaltyCards: {
        include: {
          entries: {
            include: { service: true },
          },
          rewards: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
        <p className="text-gray-500">{clients.length} clientes cadastradas</p>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serviços
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recompensas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => {
              const loyaltyCard = client.loyaltyCards[0];
              const serviceCount = loyaltyCard?.entries.filter(
                (e) => e.service.type === "SERVICE"
              ).length || 0;
              const rewardCount = loyaltyCard?.rewards.filter((r) => !r.used).length || 0;

              return (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                        <span className="text-primary-300 font-bold">
                          {client.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {client.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="badge badge-primary">{serviceCount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="badge badge-warning">{rewardCount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-primary-300 hover:text-primary-400 font-medium">
                      Ver cartão
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}