import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <>
      <h1>Main Layout</h1>
      <Outlet />
    </>
  );
}

export default MainLayout;