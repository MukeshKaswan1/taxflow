import { AuthProvider } from '../context/AuthContext';
import ClientShell from '../components/layout/ClientShell';
import './globals.css';

export const metadata = {
  title: 'TaxFlow Processing Dashboard',
  description: 'Real-time processing queue status',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <AuthProvider>
          <ClientShell>{children}</ClientShell>
        </AuthProvider>
      </body>
    </html>
  );
}
