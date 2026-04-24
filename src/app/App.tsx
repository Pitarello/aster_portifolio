import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { AppProvider } from './context/AppContext';

export default function App() {
<<<<<<< HEAD
  // Force re-mount of provider to clear HMR cache issues
  return (
    <AppProvider key="app-provider">
=======
  return (
    <AppProvider>
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
      <RouterProvider router={router} />
      <Toaster />
    </AppProvider>
  );
}
