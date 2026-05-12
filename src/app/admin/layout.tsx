import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <HeaderAdmin />
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-around py-3">
          <Link
            href="/admin/clientes"
            className="flex flex-col items-center text-primary-300 hover:text-primary-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-xs mt-1">Clientes</span>
          </Link>
          <Link
            href="/admin/servicos"
            className="flex flex-col items-center text-gray-500 hover:text-primary-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-xs mt-1">Serviços</span>
          </Link>
          <Link
            href="/admin/promocoes"
            className="flex flex-col items-center text-gray-500 hover:text-primary-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-xs mt-1">Promoções</span>
          </Link>
          <Link
            href="/admin/recompensas"
            className="flex flex-col items-center text-gray-500 hover:text-primary-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-xs mt-1">Recompensas</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

function HeaderAdmin() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 border-2 border-gold-300 flex items-center justify-center">
            <span className="text-primary-300 font-bold text-lg">PS</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Studio Priscila Sodré</h1>
            <span className="badge badge-warning text-xs">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}