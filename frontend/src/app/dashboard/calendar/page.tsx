"use client";

import { useState, useEffect } from "react";
import { bookingApi } from "@/lib/api";
import { Booking } from "@/types";
import Calendar from "@/components/Calendar";

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadData(currentDate);
  }, [currentDate]);

  async function loadData(date: Date) {
    try {
      setLoading(true);
      
      const year = date.getFullYear();
      const month = date.getMonth();
      // Fetch specifically for the current month view (including padding days)
      const startDate = new Date(year, month, -7).toISOString().split("T")[0];
      const endDate = new Date(year, month + 1, 7).toISOString().split("T")[0];

      const data = await bookingApi.getAll(`startDate=${startDate}&endDate=${endDate}`);
      // Only show non-cancelled bookings
      setBookings(data.bookings.filter((b: Booking) => b.status !== "cancelled"));
    } catch (err) {
      console.error("Error loading calendar data:", err);
    } finally {
      setLoading(false);
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div>
      <div className="page-header mb-6">
        <div>
          <h1 className="page-title">Booking Calendar</h1>
          <p className="page-subtitle">View and manage your bookings by date</p>
        </div>
      </div>

      {loading && bookings.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="card">
          <Calendar
            bookings={bookings}
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        </div>
      )}
    </div>
  );
}
