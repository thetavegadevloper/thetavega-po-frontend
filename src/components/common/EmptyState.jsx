export default function EmptyState({ icon = "bi-inbox", title = "No records found", text = "" }) {
  return (
    <div className="text-center py-5 text-secondary">
      <i className={`bi ${icon} fs-1 d-block mb-2`} />
      <div className="fw-semibold text-dark">{title}</div>
      {text && <div className="small mt-1">{text}</div>}
    </div>
  );
}
