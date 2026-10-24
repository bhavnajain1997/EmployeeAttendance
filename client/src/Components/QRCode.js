
import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

const QRCode = () => {
  const [qrToken, setQrToken] = useState("");
  const [countdown, setCountdown] = useState(10);

  const generateNewToken = () => {
    const payload = {
      officeId: "VORLDX_HQ_01",
      token:
        "VX_ATTN_" +
        Math.random().toString(36).substring(2, 10).toUpperCase(),
      timestamp: Date.now(),
    };

    setQrToken(JSON.stringify(payload));
    setCountdown(10);
  };

  useEffect(() => {
    generateNewToken();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          generateNewToken();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">VorldX Employee Attendance QR Scan</h1>

        <p className="text-xs text-slate-400 mt-2 mb-6">
          Scan this QR code using the employee app.
        </p>

        <div className="p-4 bg-white rounded-2xl mb-6">
          {qrToken && (
            <QRCodeSVG value={qrToken} size={220} level="H" />
          )}
        </div>

        <p className="text-sm text-slate-300 mb-5">
          QR refreshes in:{" "}
          <span className="text-cyan-400 font-bold">
            {countdown}s
          </span>
        </p>

        <button
          onClick={generateNewToken}
          className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold"
        >
          Refresh QR
        </button>
      </div>
    </div>
  );
};

export default QRCode;
