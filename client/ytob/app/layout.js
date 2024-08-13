import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import LoadingProvider from '@/components/ui/LoadingProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'YTOB',
  description: 'Youtube video to Blog generation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
       <ErrorBoundary>
          <LoadingProvider>
              <AuthProvider>
                  {children}
              </AuthProvider>
          </LoadingProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
