export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  date: Date;
  startTime: string;
  endTime: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface AppointmentFormData {
  doctorId: string;
  patientName: string;
  date: Date;
  startTime: string;
  endTime: string;
  reason: string;
}

export interface DoctorWithAppointments extends Doctor {
  appointments: Appointment[];
}
