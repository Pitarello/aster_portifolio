import { createBrowserRouter, Outlet } from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Portfolio from './pages/Portfolio';
import UserProfile from './pages/UserProfile';
import Learning from './pages/Learning';
import CoursePlayer from './pages/CoursePlayer';
import RoadmapDetail from './pages/RoadmapDetail';
import AdminDashboard from './pages/AdminDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import ApplyPartner from './pages/ApplyPartner';
import Landing from './pages/Landing';
import { DirectChat } from './components/DirectChat';

function Root() {
  return <Outlet />;
}

function AuthLayout() {
  return (
    <>
      <Outlet />
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
        // All authenticated pages get the DirectChat widget
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