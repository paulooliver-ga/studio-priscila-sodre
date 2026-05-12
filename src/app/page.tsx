import { getSession } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getSession();

  if (session) {
    if (session.user.role === "ADMIN") {
      redirect("/admin");
    } else {
      redirect("/cliente/cartao");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-gold-50 px-4">
      <div className="text-center max-w-2xl">
        <div className="w-24 h-24 rounded-full bg-primary-100 border-3 border-gold-300 flex items-center justify-center mx-auto mb-6">
          <span className="text-primary-300 font-bold text-4xl">PS</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Studio Priscila Sodré
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Beleza e Elegância
        </p>
        <p className="text-gray-500 mb-8">
          Seu cartão fidelidade digital está a um clique de distância!
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="btn-primary px-8 py-4 text-lg"
          >
            Entrar ou Criar Conta
          </a>
        </div>
      </div>
    </div>
  );
}