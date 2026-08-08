import { Pagination } from "react-bootstrap";

export default function PaginationBar({ page = 1, pages = 1, onChange }) {
  if (pages <= 1) return null;
  const items = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, page + 2);
  for (let p = start; p <= end; p += 1) {
    items.push(<Pagination.Item key={p} active={p === page} onClick={() => onChange(p)}>{p}</Pagination.Item>);
  }
  return (
    <Pagination className="mb-0">
      <Pagination.First disabled={page === 1} onClick={() => onChange(1)} />
      <Pagination.Prev disabled={page === 1} onClick={() => onChange(page - 1)} />
      {items}
      <Pagination.Next disabled={page === pages} onClick={() => onChange(page + 1)} />
      <Pagination.Last disabled={page === pages} onClick={() => onChange(pages)} />
    </Pagination>
  );
}
