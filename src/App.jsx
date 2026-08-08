import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MasterPage from "./pages/masters/MasterPage";
import UsersPage from "./pages/masters/UsersPage";
import RolesPage from "./pages/masters/RolesPage";
import { MASTER_CONFIGS } from "./pages/masters/masterConfigs";
import POListPage from "./pages/po/POListPage";
import POFormPage from "./pages/po/POFormPage";
import PODetailPage from "./pages/po/PODetailPage";
import ApprovalInboxPage from "./pages/po/ApprovalInboxPage";
import ReportsPage from "./pages/reports/ReportsPage";
import NotFoundPage from "./pages/NotFoundPage";

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/purchase-orders" element={<POListPage />} />
        <Route path="/purchase-orders/new" element={<POFormPage />} />
        <Route path="/purchase-orders/:id/edit" element={<POFormPage />} />
        <Route path="/purchase-orders/:id" element={<PODetailPage />} />
        <Route path="/approvals" element={<ApprovalInboxPage />} />
        <Route path="/reports" element={<ReportsPage />} />

        {Object.entries(MASTER_CONFIGS).map(([key, config]) => (
          <Route
            key={key}
            path={`/masters/${key}`}
            element={<MasterPage config={config} />}
          />
        ))}
        <Route path="/masters/users" element={<UsersPage />} />
        <Route path="/masters/roles" element={<RolesPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
