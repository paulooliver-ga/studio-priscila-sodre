import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio Priscila Sodré",
  description: "Cartão fidelidade digital",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster position="top-center" toastOptions={{ style: { borderRadius: "12px" } }} />
      </body>
    </html>
  );
}
