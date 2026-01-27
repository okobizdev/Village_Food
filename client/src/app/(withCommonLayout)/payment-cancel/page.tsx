"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";



export default function PaymentCancelPage() {

  return (
    <div className="flex flex-col items-center justify-center h-[70dvh] text-center px-4 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Payment Cancelled
        </h1>

        <p className="text-gray-700 mb-8 leading-relaxed">
          Your payment was not completed or you canceled the process.
          Please return to the homepage and try again if needed.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors font-medium"
          >
            ⬅ Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
