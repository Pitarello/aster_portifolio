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
<<<<<<< HEAD
import { DirectChat } from './components/DirectChat';
=======
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e

function Root() {
  return <Outlet />;
}

<<<<<<< HEAD
function AuthLayout() {
  return (
    <>
      <Outlet />
      <DirectChat />
    </>
  );
}

=======
// The router needs to be completely re-instantiated if hot module reloading occurred
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
<<<<<<< HEAD
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
=======
      {
        index: true,
        Component: Landing,
      },
      {
        path: 'admin',
        Component: AdminDashboard,
      },
      {
        path: 'partner',
        Component: PartnerDashboard,
      },
      {
        path: 'apply-partner',
        Component: ApplyPartner,
      },
      {
        path: 'learning',
        Component: Learning,
      },
      {
        path: 'roadmap/:id',
        Component: RoadmapDetail,
      },
      {
        path: 'course/:courseId',
        Component: CoursePlayer,
      },
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'register',
        Component: Register,
      },
      {
        path: 'feed',
        Component: Feed,
      },
      {
        path: 'profile',
        Component: Profile,
      },
      {
        path: 'portfolio',
        Component: Portfolio,
      },
      {
        path: 'user/:userId',
        Component: UserProfile,
      },
      {
        path: '*',
        Component: Landing,
      },
    ]
  }
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
]);