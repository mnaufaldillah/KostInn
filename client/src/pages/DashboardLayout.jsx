import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axiosInstance from '../config/axiosinstance.js';
import SideBar from '../components/navbar/SideBar.jsx';

function DashboardLayout() {
  const [role, setRole] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      setReady(true);
      return;
    }
    axiosInstance
      .get('/me')
      .then(({ data }) => setRole(data.role))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  if (!localStorage.getItem('access_token')) return <Navigate to="/login" replace />;
  if (!ready) return null;

  return (
    <div className="ki-dashboard">
      <SideBar role={role} />
      <main className="ki-dashboard-main">
        <Outlet context={{ role }} />
      </main>
    </div>
  );
}

export default DashboardLayout;
