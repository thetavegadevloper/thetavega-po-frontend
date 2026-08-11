import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Col,
  Row,
  Table
} from "react-bootstrap";

import { Link } from "react-router-dom";

import PageHeader from "../components/common/PageHeader";
import StatusBadge from "../components/common/StatusBadge";
import LoadingBlock from "../components/common/LoadingBlock";

import { poApi } from "../api/poApi";

import {
  formatDate,
  formatMoney
} from "../utils/format";

import { useAuth } from "../context/AuthContext";

// =====================================================
// KPI CONFIG
// =====================================================
const statConfig = [
  {
    status: "Draft",
    icon: "bi-pencil-square",
    className: "kpi-draft",
    label: "Purchase Orders"
  },
  {
    status: "Pending Approval",
    icon: "bi-hourglass-split",
    className: "kpi-pending",
    label: "Awaiting Review"
  },
  {
    status: "Approved",
    icon: "bi-check-circle",
    className: "kpi-approved",
    label: "Approved Orders"
  },
  {
    status: "Issued",
    icon: "bi-send-check",
    className: "kpi-issued",
    label: "Issued Orders"
  }
];

// =====================================================
// DASHBOARD
// =====================================================
export default function DashboardPage() {
  const { user } = useAuth();

  // ===================================================
  // PURCHASE ORDERS
  // ===================================================
  const recent = useQuery({
    queryKey: [
      "purchase-orders",
      "dashboard"
    ],

    queryFn: () =>
      poApi.list({
        page: 1,
        limit: 100
      })
  });

  const rows =
    recent.data?.data ||
    [];

  // ===================================================
  // KPI COUNTS
  // ===================================================
  const counts =
    Object.fromEntries(
      statConfig.map(
        ({ status }) => [
          status,
          rows.filter(
            (row) =>
              row.status ===
              status
          ).length
        ]
      )
    );

  // ===================================================
  // ISSUED VALUE
  // ===================================================
  const issuedValue =
    rows
      .filter(
        (row) =>
          row.status ===
          "Issued"
      )
      .reduce(
        (sum, row) =>
          sum +
          Number(
            row.totals
              ?.grandTotal ||
              0
          ),
        0
      );

  return (
    <>
      {/* =================================================
          DASHBOARD KPI STYLES
      ================================================= */}

      <style>
        {`

        /* =====================================================
           KPI GRID
        ===================================================== */

        .po-kpi-card {
          position: relative;

          border: 1px solid rgba(15, 23, 42, 0.055) !important;

          border-radius: 17px;

          overflow: hidden;

          background: #ffffff;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;

          animation:
            kpiCardEnter
            0.55s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            both;
        }


        /* =====================================================
           STAGGERED ENTRANCE
        ===================================================== */

        .po-kpi-col:nth-child(1)
        .po-kpi-card {
          animation-delay: 0.04s;
        }

        .po-kpi-col:nth-child(2)
        .po-kpi-card {
          animation-delay: 0.11s;
        }

        .po-kpi-col:nth-child(3)
        .po-kpi-card {
          animation-delay: 0.18s;
        }

        .po-kpi-col:nth-child(4)
        .po-kpi-card {
          animation-delay: 0.25s;
        }


        @keyframes kpiCardEnter {
          from {
            opacity: 0;

            transform:
              translateY(16px)
              scale(0.985);
          }

          to {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }
        }


        /* =====================================================
           HOVER
        ===================================================== */

        .po-kpi-card:hover {
          transform:
            translateY(-5px);

          box-shadow:
            0 13px 30px
            rgba(
              15,
              23,
              42,
              0.09
            ) !important;
        }


        /* =====================================================
           TOP ACCENT
        ===================================================== */

        .po-kpi-card::before {
          content: "";

          position: absolute;

          top: 0;
          left: 0;

          height: 3px;
          width: 100%;

          transform-origin: left;

          animation:
            kpiLineLoad
            0.8s ease
            both;
        }


        @keyframes kpiLineLoad {
          from {
            transform:
              scaleX(0);
          }

          to {
            transform:
              scaleX(1);
          }
        }


        /* =====================================================
           SOFT BACKGROUND DECORATION
        ===================================================== */

        .po-kpi-card::after {
          content: "";

          position: absolute;

          width: 115px;
          height: 115px;

          right: -45px;
          bottom: -58px;

          border-radius: 50%;

          opacity: 0.5;

          transition:
            transform 0.4s ease;
        }


        .po-kpi-card:hover::after {
          transform:
            scale(1.18);
        }


        /* =====================================================
           CARD BODY
        ===================================================== */

        .po-kpi-body {
          min-height: 122px;

          position: relative;

          z-index: 2;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 15px;

          padding:
            20px 20px 18px;
        }


        /* =====================================================
           TEXT
        ===================================================== */

        .po-kpi-status {
          margin-bottom: 4px;

          color: #64748b;

          font-size: 13px;

          font-weight: 600;

          letter-spacing: 0.1px;
        }


        .po-kpi-value {
          line-height: 1;

          margin-bottom: 8px;

          color: #102033;

          font-size: 36px;

          font-weight: 750;

          letter-spacing: -1px;

          animation:
            kpiNumberEnter
            0.65s ease
            both;
        }


        @keyframes kpiNumberEnter {
          from {
            opacity: 0;

            transform:
              translateY(8px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }
        }


        .po-kpi-label {
          font-size: 11px;

          font-weight: 500;

          color: #94a3b8;
        }


        /* =====================================================
           ICON
        ===================================================== */

        .po-kpi-icon {
          width: 54px;
          height: 54px;

          flex: 0 0 54px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 15px;

          font-size: 23px;

          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }


        .po-kpi-card:hover
        .po-kpi-icon {
          transform:
            translateY(-2px)
            rotate(-3deg)
            scale(1.06);
        }


        /* =====================================================
           DRAFT
        ===================================================== */

        .kpi-draft::before {
          background:
            linear-gradient(
              90deg,
              #64748b,
              #94a3b8
            );
        }

        .kpi-draft::after {
          background:
            rgba(
              100,
              116,
              139,
              0.08
            );
        }

        .kpi-draft
        .po-kpi-icon {
          color: #53657a;

          background:
            #f1f5f9;
        }

        .kpi-draft:hover
        .po-kpi-icon {
          box-shadow:
            0 8px 20px
            rgba(
              100,
              116,
              139,
              0.16
            );
        }


        /* =====================================================
           PENDING
        ===================================================== */

        .kpi-pending::before {
          background:
            linear-gradient(
              90deg,
              #e8a317,
              #f5c453
            );
        }

        .kpi-pending::after {
          background:
            rgba(
              245,
              158,
              11,
              0.09
            );
        }

        .kpi-pending
        .po-kpi-icon {
          color: #c47a05;

          background:
            #fff7df;
        }

        .kpi-pending:hover
        .po-kpi-icon {
          box-shadow:
            0 8px 20px
            rgba(
              245,
              158,
              11,
              0.18
            );
        }


        /* =====================================================
           APPROVED
        ===================================================== */

        .kpi-approved::before {
          background:
            linear-gradient(
              90deg,
              #159b68,
              #40c28b
            );
        }

        .kpi-approved::after {
          background:
            rgba(
              22,
              163,
              74,
              0.08
            );
        }

        .kpi-approved
        .po-kpi-icon {
          color: #16845d;

          background:
            #eaf9f2;
        }

        .kpi-approved:hover
        .po-kpi-icon {
          box-shadow:
            0 8px 20px
            rgba(
              22,
              163,
              74,
              0.17
            );
        }


        /* =====================================================
           ISSUED
        ===================================================== */

        .kpi-issued::before {
          background:
            linear-gradient(
              90deg,
              #1479d2,
              #36a5ee
            );
        }

        .kpi-issued::after {
          background:
            rgba(
              37,
              99,
              235,
              0.08
            );
        }

        .kpi-issued
        .po-kpi-icon {
          color: #1676d2;

          background:
            #eaf3ff;
        }

        .kpi-issued:hover
        .po-kpi-icon {
          box-shadow:
            0 8px 20px
            rgba(
              37,
              99,
              235,
              0.17
            );
        }


        /* =====================================================
           MAIN DASHBOARD CARDS
        ===================================================== */

        .dashboard-main-card {
          border-radius: 16px;

          border:
            1px solid
            rgba(
              15,
              23,
              42,
              0.05
            ) !important;

          overflow: hidden;
        }


        /* =====================================================
           RECENT TABLE
        ===================================================== */

        .dashboard-po-table
        tbody tr {
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }


        .dashboard-po-table
        tbody tr:hover {
          background:
            #f8fbff;
        }


        /* =====================================================
           ACTION PANEL
        ===================================================== */

        .dashboard-action-card {
          border-radius: 16px;

          border:
            1px solid
            rgba(
              15,
              23,
              42,
              0.05
            ) !important;

          animation:
            actionCardEnter
            0.65s ease
            0.18s both;
        }


        @keyframes actionCardEnter {
          from {
            opacity: 0;

            transform:
              translateX(15px);
          }

          to {
            opacity: 1;

            transform:
              translateX(0);
          }
        }


        .dashboard-issued-value {
          color: #102033;

          letter-spacing: -0.6px;
        }


        .dashboard-action-card
        .btn {
          border-radius: 9px;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }


        .dashboard-action-card
        .btn:hover {
          transform:
            translateY(-1px);
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (
          max-width: 767.98px
        ) {

          .po-kpi-body {
            min-height: 108px;

            padding:
              17px 17px;
          }

          .po-kpi-value {
            font-size: 31px;
          }

          .po-kpi-icon {
            width: 48px;
            height: 48px;

            flex-basis: 48px;

            font-size: 20px;
          }
        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (
          prefers-reduced-motion:
          reduce
        ) {

          .po-kpi-card,
          .po-kpi-card::before,
          .po-kpi-value,
          .dashboard-action-card {
            animation:
              none !important;
          }

          .po-kpi-card,
          .po-kpi-icon,
          .dashboard-action-card .btn {
            transition:
              none !important;
          }
        }

        `}
      </style>


      {/* =================================================
          HEADER
      ================================================= */}

      <PageHeader
        title={`Welcome, ${
          user?.name ||
          "User"
        }`}

        subtitle="Current PO activity and quick actions."
      />


      {/* =================================================
          4 KPI CARDS
      ================================================= */}

      <Row className="g-3 mb-4">

        {statConfig.map(
          (
            {
              status,
              icon,
              className,
              label
            }
          ) => (

            <Col
              key={status}
              xs={12}
              sm={6}
              xl={3}
              className="po-kpi-col"
            >

              <Card
                className={`
                  po-kpi-card
                  ${className}
                  h-100
                  border-0
                  shadow-sm
                `}
              >

                <Card.Body className="po-kpi-body">

                  {/* KPI VALUE */}

                  <div>

                    <div className="po-kpi-status">
                      {status}
                    </div>

                    <div className="po-kpi-value">
                      {
                        counts[
                          status
                        ] ||
                        0
                      }
                    </div>

                    <div className="po-kpi-label">
                      {label}
                    </div>

                  </div>


                  {/* KPI ICON */}

                  <div className="po-kpi-icon">

                    <i
                      className={`bi ${icon}`}
                    />

                  </div>

                </Card.Body>

              </Card>

            </Col>

          )
        )}

      </Row>


      {/* =================================================
          RECENT PO + ACTION PANEL
      ================================================= */}

      <Row className="g-3 mb-4">

        {/* =================================================
            RECENT PURCHASE ORDERS
        ================================================= */}

        <Col
          xs={12}
          lg={8}
        >

          <Card className="dashboard-main-card border-0 shadow-sm h-100">

            <Card.Header className="bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">

              <div>

                <h3 className="h6 fw-bold mb-0">
                  Recent Purchase Orders
                </h3>

              </div>


              <Link
                to="/purchase-orders"
                className="small text-decoration-none"
              >
                View all
              </Link>

            </Card.Header>


            <Card.Body className="px-0">

              {recent.isLoading ? (

                <LoadingBlock />

              ) : (

                <div className="table-responsive">

                  <Table
                    hover
                    className="dashboard-po-table align-middle mb-0"
                  >

                    <thead className="table-light">

                      <tr>

                        <th className="ps-4">
                          PO No.
                        </th>

                        <th>
                          Date
                        </th>

                        <th>
                          Vendor
                        </th>

                        <th>
                          Total
                        </th>

                        <th>
                          Status
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {rows
                        .slice(
                          0,
                          8
                        )
                        .map(
                          (
                            po
                          ) => (

                            <tr
                              key={
                                po._id
                              }
                            >

                              <td className="ps-4">

                                <Link
                                  to={`/purchase-orders/${po._id}`}
                                  className="fw-semibold text-decoration-none"
                                >

                                  {
                                    po.poNumber
                                  }

                                  {po.revisionNo
                                    ? ` / R${po.revisionNo}`
                                    : ""}

                                </Link>

                              </td>


                              <td>

                                {formatDate(
                                  po.poDate
                                )}

                              </td>


                              <td>

                                {
                                  po.vendor
                                    ?.vendorName ||
                                  "-"
                                }

                              </td>


                              <td>

                                {formatMoney(
                                  po.totals
                                    ?.grandTotal,

                                  po.currency
                                )}

                              </td>


                              <td>

                                <StatusBadge
                                  status={
                                    po.status
                                  }
                                />

                              </td>

                            </tr>

                          )
                        )}

                    </tbody>

                  </Table>

                </div>

              )}

            </Card.Body>

          </Card>

        </Col>


        {/* =================================================
            ACTION PANEL
        ================================================= */}

        <Col
          xs={12}
          lg={4}
        >

          <Card className="dashboard-action-card border-0 shadow-sm h-100">

            <Card.Body className="p-4">

              <div className="text-secondary small mb-1">
                Issued PO value in loaded records
              </div>


              <div className="dashboard-issued-value h3 fw-bold mb-4">

                {formatMoney(
                  issuedValue
                )}

              </div>


              <div className="d-grid gap-2">

                <Link
                  className="btn btn-primary"
                  to="/purchase-orders/new"
                >

                  <i className="bi bi-plus-circle me-2" />

                  Create Purchase Order

                </Link>


                <Link
                  className="btn btn-outline-primary"
                  to="/approvals"
                >

                  <i className="bi bi-check2-square me-2" />

                  Open Approval Inbox

                </Link>


                <Link
                  className="btn btn-outline-secondary"
                  to="/reports"
                >

                  <i className="bi bi-bar-chart me-2" />

                  PO Reports

                </Link>

              </div>

            </Card.Body>

          </Card>

        </Col>

      </Row>

    </>
  );
}