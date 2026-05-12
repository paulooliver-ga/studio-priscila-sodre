export default function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 border-2 border-gold-300 flex items-center justify-center">
              <span className="text-primary-300 font-bold text-lg">PS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Studio Priscila Sodré</h1>
              <p className="text-xs text-gray-500">Beleza e Elegância</p>
            </div>
          </div>
          {isAdmin && (
            <span className="badge badge-warning">Admin</span>
          )}
        </div>
      </div>
    </header>
  );
}