"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ScanPage() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    // QR Okuyucuyu başlat
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText: string) => {
        // QR kod başarıyla okunduğunda
        scanner.clear();
        setScanResult(decodedText);
      },
      () => {
        // Tarama sırasında oluşan hataları görmezden gel (parametre kullanılmadığı için boş bırakıldı)
      }
    );

    // Sayfadan çıkıldığında kamerayı kapat
    return () => {
      scanner.clear().catch((e) => console.error("Scanner cleanup failed", e));
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-black/90">
      <div className="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl p-4">
        <h1 className="text-2xl font-bold text-center mb-4 text-black">Scan Company QR</h1>
        
        {/* Kamera görüntüsünün geleceği alan */}
        <div id="reader" className="w-full"></div>

        {scanResult && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded text-center">
            <p className="font-bold">QR Code Scanned!</p>
            <p className="break-all text-sm">{scanResult}</p>
            <Button 
              className="mt-4 w-full !bg-cyan-600 !text-white" 
              onClick={() => router.push(scanResult)}
            >
              Go to Quiz
            </Button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}