'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Appointment, Doctor, AppointmentFormData } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface AppointmentContextType {
  doctors: Doctor[];
  appointments: Appointment[];
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  addAppointment: (appointment: AppointmentFormData) => void;
  editAppointment: (id: string, appointment: AppointmentFormData) => void;
  deleteAppointment: (id: string) => void;
  getAppointmentsByDate: (date: Date) => Appointment[];
  getAppointmentById: (id: string) => Appointment | undefined;
  getDoctorById: (id: string) => Doctor | undefined;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// Sample doctors data
const sampleDoctors: Doctor[] = [
  { id: '1', name: 'Dr. Jane Smith', specialty: 'Cardiology', available: true },
  { id: '2', name: 'Dr. Michael Johnson', specialty: 'Neurology', available: true },
  { id: '3', name: 'Dr. Sarah Williams', specialty: 'Dermatology', available: true },
  { id: '4', name: 'Dr. Robert Davis', specialty: 'Orthopedics', available: true },
  { id: '5', name: 'Dr. Emily Brown', specialty: 'Pediatrics', available: true },
];

// Sample appointments
const sampleAppointments: Appointment[] = [
  {
    id: '1',
    doctorId: '1',
    patientName: 'John Doe',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    startTime: '09:00',
    endTime: '09:30',
    reason: 'Annual checkup',
    status: 'confirmed',
  },
  {
    id: '2',
    doctorId: '2',
    patientName: 'Jane Smith',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    startTime: '14:00',
    endTime: '14:30',
    reason: 'Headache',
    status: 'pending',
  },
];

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(sampleDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const addAppointment = (appointmentData: AppointmentFormData) => {
    const newAppointment: Appointment = {
      id: uuidv4(),
      ...appointmentData,
      status: 'pending',
    };
    setAppointments([...appointments, newAppointment]);
  };

  const editAppointment = (id: string, appointmentData: AppointmentFormData) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, ...appointmentData }
          : appointment
      )
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id));
  };

  const getAppointmentsByDate = (date: Date) => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getAppointmentById = (id: string) => {
    return appointments.find((appointment) => appointment.id === id);
  };

  const getDoctorById = (id: string) => {
    return doctors.find((doctor) => doctor.id === id);
  };

  return (
    <AppointmentContext.Provider
      value={{
        doctors,
        appointments,
        selectedDate,
        setSelectedDate,
        addAppointment,
        editAppointment,
        deleteAppointment,
        getAppointmentsByDate,
        getAppointmentById,
        getDoctorById,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};
