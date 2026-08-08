import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function NotFoundPage(){return <div className="min-vh-100 d-flex align-items-center justify-content-center text-center"><div><div className="display-1 fw-bold text-primary">404</div><h1 className="h3">Page not found</h1><p className="text-secondary">The page you requested does not exist.</p><Button as={Link} to="/dashboard">Go to Dashboard</Button></div></div>}
