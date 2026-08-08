import { useState } from "react";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getApiError } from "../../utils/error";

export default function LoginPage() {
  const [form, setForm] = useState({ userId: "admin", password: "ChangeMe@123" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError(getApiError(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-panel-left d-none d-lg-flex">
        <div className="login-copy">
          <div className="login-logo mb-4">TV</div>
          <h1 className="display-6 fw-bold">Purchase Order System</h1>
          <p className="lead opacity-75">Create, approve, issue and track purchase orders from one controlled application.</p>
          <div className="mt-5 d-grid gap-3">
            <div><i className="bi bi-check-circle me-2" /> Master-driven PO entry</div>
            <div><i className="bi bi-check-circle me-2" /> Controlled approval workflow</div>
            <div><i className="bi bi-check-circle me-2" /> PDF generation in your PO format</div>
            <div><i className="bi bi-check-circle me-2" /> MongoDB snapshots and audit trail</div>
          </div>
        </div>
      </div>
      <div className="login-panel-right">
        <Card className="login-card border-0 shadow-lg">
          <Card.Body className="p-4 p-md-5">
            <div className="mb-4">
              <div className="small text-primary fw-bold text-uppercase mb-2">ThetaVega Tech</div>
              <h2 className="h3 fw-bold mb-1">Sign in</h2>
              <p className="text-secondary mb-0">Use your PO system account.</p>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={submit}>
              <Form.Group className="mb-3">
                <Form.Label>User ID</Form.Label>
                <Form.Control value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} autoFocus required />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </Form.Group>
              <Button type="submit" className="w-100 py-2" disabled={loading}>
                {loading ? <><Spinner size="sm" className="me-2" />Signing in...</> : "Sign in"}
              </Button>
            </Form>
            <div className="small text-secondary mt-4 p-3 bg-light rounded">
              Seed login: <strong>admin</strong> / <strong>ChangeMe@123</strong>. Change this password for production use.
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
