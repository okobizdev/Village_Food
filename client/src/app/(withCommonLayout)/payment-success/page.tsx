"use client"

import { CheckCircle } from "lucide-react";
import Link from "next/link";

function PaymentSuccesPage() {

  return (
    <div className="flex flex-col items-center justify-center h-[70dvh] text-center px-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
        </div>

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-2">
          Your payment has been processed successfully.
        </p>

        <p className="text-sm text-gray-500 mb-8">
          You will receive a confirmation email shortly.
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
  )
}

export default PaymentSuccesPage
