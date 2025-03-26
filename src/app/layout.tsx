import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppointmentProvider } from "@/context/AppointmentContext";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Doctor Appointment System",
  description: "Book appointments with doctors easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        <AppointmentProvider>
          {children}
          <Toaster />
        </AppointmentProvider>
        
      </body>
    </html>
  );
}
