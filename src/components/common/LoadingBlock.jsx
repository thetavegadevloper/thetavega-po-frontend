import { Spinner } from "react-bootstrap";

export default function LoadingBlock({ text = "Loading..." }) {
  return (
    <div className="py-5 text-center text-secondary">
      <Spinner animation="border" size="sm" className="me-2" />
      {text}
    </div>
  );
}
