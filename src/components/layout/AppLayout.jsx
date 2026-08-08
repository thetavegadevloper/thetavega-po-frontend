import { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function AppLayout() {
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="d-none d-lg-block sidebar-wrap"><Sidebar /></aside>
      <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} className="d-lg-none" style={{ width: 290 }}>
        <Offcanvas.Body className="p-0"><Sidebar mobile onNavigate={() => setShowMenu(false)} /></Offcanvas.Body>
      </Offcanvas>

      <div className="app-main">
        <header className="topbar">
          <div className="d-flex align-items-center gap-2">
            <Button variant="light" className="d-lg-none border" onClick={() => setShowMenu(true)}>
              <i className="bi bi-list fs-5" />
            </Button>
            <div className="d-none d-sm-block">
              <div className="fw-semibold">Purchase Order System</div>
             
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-sm-block">
              <div className="small fw-semibold">{user?.name || user?.userId}</div>
              <div className="small text-secondary">{user?.role?.name || user?.roleName || "User"}</div>
            </div>
            <div className="user-avatar">{String(user?.name || "U").charAt(0).toUpperCase()}</div>
            <Button variant="outline-secondary" size="sm" onClick={handleLogout} title="Logout">
              <i className="bi bi-box-arrow-right" />
            </Button>
          </div>
        </header>
        <main className="content-area"><Outlet /></main>
      </div>
    </div>
  );
}
