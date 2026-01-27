"use client";
import Link from 'next/link'


function PaymentFailPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[70dvh] text-center px-4">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
                Payment Failed
            </h1>

            <p className="text-gray-700 max-w-md">
                Your payment was not completed or you canceled the process.
                Please return to the homepage and try again if needed.
            </p>

            <Link
                href="/"
                className="mt-6 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
            >
                ⬅ Back to Home
            </Link>
        </div>
    )
}

export default PaymentFailPage
