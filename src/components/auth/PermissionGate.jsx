import { useAuth } from "../../context/AuthContext";

export default function PermissionGate({ any = [], children, fallback = null }) {
  const { can } = useAuth();
  if (!any.length || can(...any)) return children;
  return fallback;
}
