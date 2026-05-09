import { createBrowserRouter, Outlet } from 'react-router';
import { lazy, Suspense } from 'react';
import { DirectChat } from './components/DirectChat';

// Eager — páginas leves que carregam sempre
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy — carregam só quando o usuário navega para a rota
const Feed = lazy(() => import('./pages/Feed'));
const Profile = lazy(() => import('./pages/Profile'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const Learning = lazy(() => import('./pages/Learning'));
const CoursePlayer = lazy(() => import('./pages/CoursePlayer'));
const RoadmapDetail = lazy(() => import('./pages/RoadmapDetail'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PartnerDashboard = lazy(() => import('./pages/PartnerDashboard'));
const ApplyPartner = lazy(() => import('./pages/ApplyPartner'));

function Root() {
  return <Outlet />;
}

function AuthLayout() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Carregando...</div>}>
        <Outlet />
      </Suspense>
      <DirectChat />
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Landing },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: '*', Component: Landing },
      {
        Component: AuthLayout,
        children: [
          { path: 'admin', Component: AdminDashboard },
          { path: 'partner', Component: PartnerDashboard },
          { path: 'apply-partner', Component: ApplyPartner },
          { path: 'learning', Component: Learning },
          { path: 'roadmap/:id', Component: RoadmapDetail },
          { path: 'course/:courseId', Component: CoursePlayer },
          { path: 'feed', Component: Feed },
          { path: 'profile', Component: Profile },
          { path: 'portfolio', Component: Portfolio },
          { path: 'user/:userId', Component: UserProfile },
        ],
      },
    ],
  },
]);
