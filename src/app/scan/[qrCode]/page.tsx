export default function ScanPage({
  params,
}: {
  params: Promise<{ qrCode: string }>;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-300 mx-auto mb-4"></div>
        <p className="text-gray-600">Processando QR Code...</p>
      </div>
    </div>
  );
}