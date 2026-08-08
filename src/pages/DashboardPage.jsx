import { useQuery } from "@tanstack/react-query";
import { Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import StatusBadge from "../components/common/StatusBadge";
import LoadingBlock from "../components/common/LoadingBlock";
import { poApi } from "../api/poApi";
import { formatDate, formatMoney } from "../utils/format";
import { useAuth } from "../context/AuthContext";

const statConfig = [
  ["Draft", "bi-pencil-square"],
  ["Pending Approval", "bi-hourglass-split"],
  ["Approved", "bi-check-circle"],
  ["Issued", "bi-send-check"],
];

export default function DashboardPage() {
  const { user } = useAuth();
  const recent = useQuery({
    queryKey: ["purchase-orders", "dashboard"],
    queryFn: () => poApi.list({ page: 1, limit: 100 }),
  });

  const rows = recent.data?.data || [];
  const counts = Object.fromEntries(statConfig.map(([status]) => [status, rows.filter((r) => r.status === status).length]));
  const issuedValue = rows.filter((r) => r.status === "Issued").reduce((sum, r) => sum + Number(r.totals?.grandTotal || 0), 0);

  return (
    <>
      <PageHeader title={`Welcome, ${user?.name || "User"}`} subtitle="Current PO activity and quick actions." />
      <Row className="g-3 mb-4">
        {statConfig.map(([status, icon]) => (
          <Col key={status} xs={12} sm={6} xl={3}>
            <Card className="metric-card h-100 border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-secondary small">{status}</div>
                  <div className="display-6 fw-bold">{counts[status] || 0}</div>
                </div>
                <div className="metric-icon"><i className={`bi ${icon}`} /></div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3 mb-4">
        <Col xs={12} lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <div><h3 className="h6 fw-bold mb-0">Recent Purchase Orders</h3></div>
              <Link to="/purchase-orders" className="small text-decoration-none">View all</Link>
            </Card.Header>
            <Card.Body className="px-0">
              {recent.isLoading ? <LoadingBlock /> : (
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead className="table-light"><tr><th className="ps-4">PO No.</th><th>Date</th><th>Vendor</th><th>Total</th><th>Status</th></tr></thead>
                    <tbody>
                      {rows.slice(0, 8).map((po) => (
                        <tr key={po._id}>
                          <td className="ps-4"><Link to={`/purchase-orders/${po._id}`} className="fw-semibold text-decoration-none">{po.poNumber}{po.revisionNo ? ` / R${po.revisionNo}` : ""}</Link></td>
                          <td>{formatDate(po.poDate)}</td>
                          <td>{po.vendor?.vendorName || "-"}</td>
                          <td>{formatMoney(po.totals?.grandTotal, po.currency)}</td>
                          <td><StatusBadge status={po.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="text-secondary small mb-1">Issued PO value in loaded records</div>
              <div className="h3 fw-bold mb-4">{formatMoney(issuedValue)}</div>
              <div className="d-grid gap-2">
                <Link className="btn btn-primary" to="/purchase-orders/new"><i className="bi bi-plus-circle me-2" />Create Purchase Order</Link>
                <Link className="btn btn-outline-primary" to="/approvals"><i className="bi bi-check2-square me-2" />Open Approval Inbox</Link>
                <Link className="btn btn-outline-secondary" to="/reports"><i className="bi bi-bar-chart me-2" />PO Reports</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
