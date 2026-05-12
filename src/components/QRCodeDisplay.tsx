import QRCode from "react-qrcode-logo";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export default function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-gold-300">
      <QRCode
        value={value}
        size={size}
        qrStyle="dots"
        dotsOptions={{
          color: "#ec4899",
          type: "rounded"
        }}
        backgroundOptions={{
          color: "white",
        }}
        logoImage="https://ui-avatars.com/api/?name=PS&background=f9a8d4&color=ec4899"
        logoWidth={40}
        logoHeight={40}
      />
      <p className="mt-4 text-sm text-gray-500 break-all text-center">{value}</p>
    </div>
  );
}