import { createBrowserRouter, useSearchParams } from 'react-router-dom';
import MainLayout from '../pages/MainLayout.jsx';
import Homepage from '../pages/Homepage.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import VerifyOTP from '../pages/VerifyOTP.jsx';
import ResetPassword from '../pages/ResetPassword.jsx';
import SetPassword from '../pages/SetPassword.jsx';
import UploadIDCard from '../pages/UploadIDCard.jsx';
import DashboardLayout from '../pages/DashboardLayout.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Profile from '../pages/Profile.jsx';
import KostHistory from '../pages/KostHistory.jsx';
import UserList from '../pages/UserList.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'verify-otp', element: <VerifyOTP /> },
      { path: 'reset-password', element: <ResetPasswordRoute /> },
      { path: 'upload-id', element: <UploadIDCard /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'profil', element: <Profile /> },
      { path: 'riwayat', element: <KostHistory /> },
      { path: 'pengguna', element: <UserList /> },
    ],
  },
]);

export default router;

// ponytail: one route, two views — token present = set-password, absent = request form
function ResetPasswordRoute() {
  const [params] = useSearchParams();
  return params.get('token') ? <SetPassword /> : <ResetPassword />;
}
