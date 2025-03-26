'use client';

import { useEffect, useState, useMemo } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { addMonths, format, getMonth, getYear, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppointments } from '@/context/AppointmentContext';
import AppointmentModal from './AppointmentModal';

export default function AppointmentCalendar() {
  const { appointments, selectedDate, setSelectedDate, getAppointmentsByDate } = useAppointments();
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'month' | 'day'>('month');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  // Function to update days in month when month changes
  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    setDaysInMonth(eachDayOfInterval({ start, end }));
  }, [currentMonth]);

  // Function to handle month navigation
  const handleNavigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev =>
      direction === 'prev' ? addMonths(prev, -1) : addMonths(prev, 1)
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setCalendarMode('day');
  };

  const handleOpenNewAppointment = () => {
    setAppointmentId(null);
    setIsAppointmentModalOpen(true);
  };

  const handleEditAppointment = (id: string) => {
    setAppointmentId(id);
    setIsAppointmentModalOpen(true);
  };

  const getAppointmentsForDay = (date: Date) => {
    return getAppointmentsByDate(date);
  };

  const monthYearDisplay = format(currentMonth, 'MMMM yyyy');

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handleNavigateMonth('prev')}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div className="text-xl font-semibold">{monthYearDisplay}</div>
          <Button
            variant="outline"
            onClick={() => handleNavigateMonth('next')}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={handleOpenNewAppointment} size="sm">
            Book Appointment
          </Button>
          <Select
            value={calendarMode}
            onValueChange={(value) => setCalendarMode(value as 'month' | 'day')}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month View</SelectItem>
              <SelectItem value="day">Day View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {calendarMode === 'month' ? (
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center font-medium text-gray-500">
              {day}
            </div>
          ))}

          {daysInMonth.map((date, i) => {
            const dayAppointments = getAppointmentsForDay(date);
            const isToday = isSameDay(date, new Date());
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

            return (
              <div
                key={i}
                className={cn(
                  "min-h-24 p-2 border rounded-md cursor-pointer transition-colors",
                  isToday ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50",
                  isSelected ? "border-blue-500 ring-2 ring-blue-200" : ""
                )}
                onClick={() => handleDateClick(date)}
              >
                <div className="flex justify-between items-start">
                  <span className={cn(
                    "text-sm font-medium",
                    isToday ? "text-blue-600" : ""
                  )}>
                    {format(date, 'd')}
                  </span>
                  {dayAppointments.length > 0 && (
                    <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                      {dayAppointments.length}
                    </span>
                  )}
                </div>
                <div className="mt-2 space-y-1">
                  {dayAppointments.slice(0, 2).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="text-xs p-1 rounded bg-blue-50 border border-blue-100 truncate"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAppointment(appointment.id);
                      }}
                    >
                      {appointment.startTime} - {appointment.patientName}
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayAppointments.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <DayView
          date={selectedDate || new Date()}
          onBackToMonth={() => setCalendarMode('month')}
          onEditAppointment={handleEditAppointment}
        />
      )}

      {isAppointmentModalOpen && (
        <AppointmentModal
          isOpen={isAppointmentModalOpen}
          onClose={() => setIsAppointmentModalOpen(false)}
          appointmentId={appointmentId}
        />
      )}
    </div>
  );
}

function DayView({
  date,
  onBackToMonth,
  onEditAppointment
}: {
  date: Date;
  onBackToMonth: () => void;
  onEditAppointment: (id: string) => void;
}) {
  const { getAppointmentsByDate, getDoctorById } = useAppointments();
  const appointments = getAppointmentsByDate(date);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle >Appointments for {format(date, 'MMMM d, yyyy')}</CardTitle>
          <Button variant="outline" onClick={onBackToMonth} size="sm">
            Back to Month View
          </Button>
        </div>
        <CardDescription>
          {appointments.length
            ? `${appointments.length} appointment${appointments.length === 1 ? '' : 's'} scheduled`
            : 'No appointments scheduled for this day'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <div className="space-y-3">
            {appointments.map(appointment => {
              const doctor = getDoctorById(appointment.doctorId);
              return (
                <Card key={appointment.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onEditAppointment(appointment.id)}>
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{appointment.startTime} - {appointment.endTime}</p>
                        <p className="text-gray-600">{appointment.patientName}</p>
                        <p className="text-sm text-gray-500">With {doctor?.name || 'Unknown Doctor'}</p>
                      </div>
                      <div className="flex items-start">
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          appointment.status === 'confirmed' ? "bg-green-100 text-green-800" :
                          appointment.status === 'pending' ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        )}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    {appointment.reason && (
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Reason:</span> {appointment.reason}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
            <p className="mt-1 text-sm text-gray-500">No appointments scheduled for this day.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Icons
function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
