import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <h1 className="brand">User Profile</h1>
        <nav>
          <NavLink to="/accounting" className={({ isActive }) => isActive ? 'active' : ''}>Accounting Settings</NavLink>
          <NavLink to="/terms" className={({ isActive }) => isActive ? 'active' : ''}>Terms & Services</NavLink>
          <NavLink to="/rate" className={({ isActive }) => isActive ? 'active' : ''}>Rate Us</NavLink>
          <NavLink to="/help" className={({ isActive }) => isActive ? 'active' : ''}>Help & Support</NavLink>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

