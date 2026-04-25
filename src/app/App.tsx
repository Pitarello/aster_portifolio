import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { AppProvider } from './context/AppContext';

export default function App() {
  // Force re-mount of provider to clear HMR cache issues
  return (
    <AppProvider key="app-provider">
      <RouterProvider router={router} />
      <Toaster />
    </AppProvider>
  );
}
