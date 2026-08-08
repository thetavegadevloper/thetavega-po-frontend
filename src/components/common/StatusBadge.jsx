const classes = {
  Draft: "text-bg-secondary",
  "Pending Approval": "text-bg-warning",
  Approved: "text-bg-info",
  Issued: "text-bg-success",
  Rejected: "text-bg-danger",
  Cancelled: "text-bg-dark",
  Closed: "text-bg-primary",
};

export default function StatusBadge({ status }) {
  return <span className={`badge rounded-pill ${classes[status] || "text-bg-light"}`}>{status || "-"}</span>;
}
