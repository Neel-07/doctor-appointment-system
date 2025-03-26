# Doctor Appointment Booking System

A responsive web application built with Next.js and Tailwind CSS that allows users to book, edit, and manage doctor appointments through an intuitive calendar interface.

## Features

- **Appointment Management:**
  - Book, edit, and delete appointments
  - View appointments in a calendar grid (monthly view)
  - Detailed day view for appointments
  - Confirmation messages after booking/editing/deleting

- **Calendar Integration:**
  - Monthly calendar grid view
  - Daily appointment list view
  - Interactive calendar for date selection

- **User Experience:**
  - Clean and intuitive UI
  - Mobile-responsive design
  - Real-time updates

## Technology Stack

- **Frontend Framework:** Next.js
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Form Handling:** React Hook Form

## Running Locally

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd doctor-appointment-system
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

3. Start the development server:
   ```bash
   bun run dev
   # or
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

- **View Appointments:** Navigate through the calendar to see appointments
- **Book an Appointment:** Click the "Book Appointment" button
- **Edit an Appointment:** Click on an existing appointment in the calendar
- **Delete an Appointment:** Open an appointment and click the "Delete" button
- **Switch Views:** Use the dropdown to switch between month and day views

## Project Structure

- `/src/app` - Next.js App Router pages
- `/src/components` - React components
- `/src/context` - Context providers for state management
- `/src/types` - TypeScript type definitions
- `/src/lib` - Utility functions

## Future Enhancements

- User authentication
- Doctor profiles and availability management
- Email notifications for appointments
- Dark mode toggle
- Search for doctors by specialty
- Patient profiles and history

## License

MIT
