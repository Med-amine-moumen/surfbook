"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");

  return (
    <div className="card max-w-md w-full text-center p-8 bg-white shadow-xl rounded-2xl">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your payment. Your booking has been fully confirmed and an updated invoice has been sent to your email.
      </p>

      {bookingId && (
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={`/booking/confirmation/${bookingId}`}
            className="btn-primary w-full inline-block text-center py-3"
          >
            View Booking Details
          </Link>
          <Link
            href="/"
            className="btn-secondary w-full inline-block text-center py-3"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
