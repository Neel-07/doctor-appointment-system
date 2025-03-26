'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAppointments } from '@/context/AppointmentContext';
import { AppointmentFormData } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string | null;
}

// Time slots for the appointment
const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

export default function AppointmentModal({ isOpen, onClose, appointmentId }: AppointmentModalProps) {
  const { doctors, addAppointment, editAppointment, deleteAppointment, getAppointmentById } = useAppointments();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const { toast } = useToast();

  // Use useMemo to memoize the defaultValues object
  const defaultValues = useMemo(() => ({
    doctorId: '',
    patientName: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '09:30',
    reason: '',
  }), []);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<AppointmentFormData>({
    defaultValues
  });

  const startTime = watch('startTime');

  // Set default end time 30 minutes after start time
  useEffect(() => {
    if (startTime) {
      const startIndex = TIME_SLOTS.findIndex(time => time === startTime);
      if (startIndex >= 0 && startIndex < TIME_SLOTS.length - 1) {
        setValue('endTime', TIME_SLOTS[startIndex + 1]);
      }
    }
  }, [startTime, setValue]);

  // Memoize the reset function to prevent dependency array changes
  const resetForm = useCallback(() => {
    reset(defaultValues);
    setDate(new Date());
  }, [reset, defaultValues]);

  // Load appointment data if in edit mode
  useEffect(() => {
    if (!isOpen) return; // Only run when modal is open

    if (appointmentId) {
      const appointment = getAppointmentById(appointmentId);
      if (appointment) {
        setValue('doctorId', appointment.doctorId);
        setValue('patientName', appointment.patientName);
        setValue('date', new Date(appointment.date));
        setValue('startTime', appointment.startTime);
        setValue('endTime', appointment.endTime);
        setValue('reason', appointment.reason);
        setDate(new Date(appointment.date));
      }
    } else {
      resetForm();
    }
  }, [appointmentId, getAppointmentById, setValue, resetForm, isOpen]);

  const onSubmit = (data: AppointmentFormData) => {
    if (appointmentId) {
      editAppointment(appointmentId, data);
      toast({
        title: "Appointment updated",
        description: `Appointment has been updated for ${format(data.date, 'PPP')} at ${data.startTime}`,
      });
    } else {
      addAppointment(data);
      toast({
        title: "Appointment booked",
        description: `Appointment has been booked for ${format(data.date, 'PPP')} at ${data.startTime}`,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (appointmentId) {
      deleteAppointment(appointmentId);
      toast({
        title: "Appointment deleted",
        description: "The appointment has been cancelled and removed",
        variant: "destructive",
      });
      setShowDeleteDialog(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{appointmentId ? 'Edit Appointment' : 'Book Appointment'}</DialogTitle>
            <DialogDescription>
              {appointmentId
                ? "Update the details for this appointment."
                : "Fill in the details to book a new appointment."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Select
                  onValueChange={(value) => setValue('doctorId', value)}
                  defaultValue={watch('doctorId')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.doctorId && (
                  <p className="text-sm text-red-500">Please select a doctor</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  placeholder="Enter patient name"
                  {...register('patientName', { required: true })}
                />
                {errors.patientName && (
                  <p className="text-sm text-red-500">Patient name is required</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => {
                        if (selectedDate) {
                          setDate(selectedDate);
                          setValue('date', selectedDate);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Time</Label>
                  <Select
                    onValueChange={(value) => setValue('startTime', value)}
                    defaultValue={watch('startTime')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>End Time</Label>
                  <Select
                    onValueChange={(value) => setValue('endTime', value)}
                    defaultValue={watch('endTime')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.filter(time => time > startTime).map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Input
                  id="reason"
                  placeholder="Enter reason for the appointment"
                  {...register('reason')}
                />
              </div>
            </div>

            <DialogFooter>
              {appointmentId && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="mr-auto"
                >
                  Delete
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {appointmentId ? 'Update' : 'Book'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this appointment. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
