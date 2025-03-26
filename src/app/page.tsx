import Navbar from '@/components/Navbar';
import AppointmentCalendar from '@/components/AppointmentCalendar';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Appointment Dashboard</h1>
            <p className="text-gray-500">Manage your medical appointments with ease.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <AppointmentCalendar />
          </div>
        </div>
      </div>
    </main>
  );
}
