"use client";

import { useMemo, useState } from "react";
import { Booking } from "@/types";
import { formatDate } from "@/lib/helpers";

interface CalendarProps {
  bookings: Booking[];
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function Calendar({ bookings, currentDate, onPrevMonth, onNextMonth }: CalendarProps) {
  // Generate days of the month
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startPadding = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    
    // Previous month padding
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Next month padding to complete 6 rows (42 cells)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  }, [currentDate]);

  // Map bookings to days for easy rendering
  const bookingsByDay = useMemo(() => {
    const map = new Map<string, Booking[]>();
    
    bookings.forEach((booking) => {
      const start = new Date(booking.checkIn);
      start.setHours(0, 0, 0, 0);
      const end = new Date(booking.checkOut);
      end.setHours(0, 0, 0, 0);
      
      // Add booking to check-in day specifically to display the block
      const dateKey = start.toISOString().split("T")[0];
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(booking);
    });
    
    return map;
  }, [bookings]);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button onClick={onPrevMonth} className="p-2 hover:bg-gray-100 rounded-md">&larr; Prev</button>
          <button onClick={onNextMonth} className="p-2 hover:bg-gray-100 rounded-md">Next &rarr;</button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 h-[600px] auto-rows-fr">
        {daysInMonth.map((day, index) => {
          const dateKey = day.toISOString().split("T")[0];
          const dayBookings = bookingsByDay.get(dateKey) || [];
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          
          return (
            <div 
              key={index} 
              className={`border-r border-b border-gray-100 p-1 flex flex-col gap-1 overflow-hidden
                ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"}
                ${isToday ? "bg-blue-50/30" : ""}
              `}
            >
              <div className={`text-xs ml-1 font-medium ${isToday ? "text-blue-600 font-bold" : "text-gray-600"}`}>
                {day.getDate()}
              </div>
              
              <div className="flex flex-col gap-1 overflow-y-auto pr-1">
                {dayBookings.map((b) => {
                  const customer = b.customerId as any;
                  const room = b.roomId as any;
                  const customerName = customer?.firstName ? `${customer.firstName} ${customer.lastName}` : "Guest";
                  const roomName = room?.name || "Room";
                  
                  return (
                    <div 
                      key={b._id} 
                      className={`text-[10px] p-1.5 rounded border leading-tight
                        ${b.status === 'confirmed' ? 'bg-blue-100 border-blue-200 text-blue-800' : 
                          b.status === 'completed' ? 'bg-purple-100 border-purple-200 text-purple-800' : 
                          'bg-amber-100 border-amber-200 text-amber-800'}`}
                    >
                      <div className="font-bold truncate">{roomName}</div>
                      <div className="truncate">{customerName}</div>
                      <div className="text-gray-500 mt-0.5 truncate">
                        {formatDate(b.checkIn)} - {formatDate(b.checkOut)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
