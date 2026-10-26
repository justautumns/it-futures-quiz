"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { QRCodeCanvas } from "qrcode.react";
import { useState, useRef, useEffect } from "react";

type Company = any;

export default function CompanyDashboardClient({ company }: { company: Company }) {
  const [logoUrl, setLogoUrl] = useState(company.logoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeQrUrl, setActiveQrUrl] = useState<string | null>(null);

   const wsRef = useRef<WebSocket | null>(null);
  const [isWsConnected, setIsWsConnected] = useState(false);

  // WebSocket Bağlantısını Başlat (Sadece bir kez)
  useEffect(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    
    // Nginx üzerinden WebSocket bağlantısı (port belirtmeye gerek yok, Nginx yönlendiriyor)
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log("Connecting to WebSocket at:", wsUrl);
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected to dashboard");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'SCORE_UPDATE') {
          console.log("🔄 New score received, refreshing page...");
          window.location.reload(); 
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    // Hata mesajını konsola yazdırmıyoruz
    ws.onerror = () => {};

    return () => {
      // Bileşen ekrandan kalkarken bağlantıyı kapat
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (uploadRes.ok && uploadData.url) {
        await fetch("/api/company/update-logo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyId: company.id, logoUrl: uploadData.url }),
        });
        setLogoUrl(uploadData.url);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center p-4 md:p-8">
      {/* Üst Bar */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-300 dark:border-white/10 pb-4 gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center border border-gray-300 dark:border-white/20 shrink-0">
            {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" /> : <span className="text-xs text-gray-500 dark:text-gray-400">No Logo</span>}
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-cyan-600 dark:text-cyan-400">{company.name} Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Manage your quizzes and view results</p>
          </div>
        </div>
        <div className="flex gap-4 items-center mt-4 md:mt-0">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>

      {/* Logo Yükleme */}
      <div className="w-full max-w-4xl mb-6 md:mb-8">
        <div className="rounded-2xl border border-gray-300 bg-white/40 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-black/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Logo</span>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} variant="outline" className="w-full md:w-auto border-gray-300 text-cyan-600 dark:border-white/20 dark:text-cyan-400">
            {isUploading ? "Uploading..." : logoUrl ? "Change Logo" : "Upload Logo"}
          </Button>
        </div>
      </div>

      {/* Quizzes ve Sonuçlar */}
      <div className="w-full max-w-4xl space-y-8">
        <div className="rounded-2xl border border-gray-300 bg-white/40 p-4 md:p-8 backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Your Quizzes</h2>
            <Link href="/company/quiz/new" className="w-full md:w-auto">
              <Button className="w-full md:w-auto !bg-cyan-600 !text-white">Create New Quiz</Button>
            </Link>
          </div>
          
          {company.quizzes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">No quizzes yet. Create your first one!</p>
          ) : (
            <div className="space-y-6">
              {company.quizzes.map((quiz: any) => (
                <div key={quiz.id} className="border border-gray-300 dark:border-white/10 rounded-xl p-4">
                  
                  <div className="flex flex-col gap-4 mb-4">
                    <span className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 break-words">
                      {quiz.title}
                    </span>
                    
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-white/20 dark:text-gray-300 dark:hover:bg-white/10"
                        onClick={() => setActiveQrUrl(`${window.location.origin}/quiz/${company.id}`)}
                      >
                        QR Code
                      </Button>
                      <Link href={`/company/quiz/${quiz.id}`} className="w-full sm:w-auto">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-white/20 dark:text-gray-300 dark:hover:bg-white/10">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Liderlik Tablosu */}
                  <div className="bg-gray-100 dark:bg-black/20 rounded-lg p-4 overflow-x-auto">
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Leaderboard</h4>
                    {quiz.scores.length === 0 ? (
                      <p className="text-xs text-gray-500 dark:text-gray-400">No one has taken this quiz yet.</p>
                    ) : (
                      <table className="w-full text-left text-sm min-w-[300px]">
                        <thead>
                          <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-300 dark:border-white/10">
                            <th className="pb-2">Name</th>
                            <th className="pb-2">Email</th>
                            <th className="pb-2 text-right">Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quiz.scores.map((score: any) => (
                            <tr key={score.id} className="border-b border-gray-200 dark:border-white/5 last:border-0">
                              <td className="py-2 text-gray-800 dark:text-white truncate max-w-[100px]">{score.user.name}</td>
                              <td className="py-2 text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{score.user.email}</td>
                              <td className="py-2 text-right font-bold text-cyan-600 dark:text-cyan-400">{score.points}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QR KOD MODALI */}
      {activeQrUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 max-w-sm w-full text-center relative shadow-2xl">
            <button 
              onClick={() => setActiveQrUrl(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Scan to Play</h3>
            <div className="bg-white p-4 rounded-xl inline-block mb-6">
              <QRCodeCanvas value={activeQrUrl} size={200} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 break-all mb-4">
              {activeQrUrl}
            </p>
            <Button onClick={() => setActiveQrUrl(null)} className="w-full !bg-itf-blue !text-white">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}