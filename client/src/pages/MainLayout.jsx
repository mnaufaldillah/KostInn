import { Outlet } from 'react-router-dom';
import NavBar from '../components/navbar/NavBar.jsx';

function MainLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default MainLayout;
