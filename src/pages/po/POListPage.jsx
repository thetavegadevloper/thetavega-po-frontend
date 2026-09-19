import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Table
} from "react-bootstrap";

import {
  Link,
  useNavigate
} from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import LoadingBlock from "../../components/common/LoadingBlock";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import PaginationBar from "../../components/common/PaginationBar";
import PermissionGate from "../../components/auth/PermissionGate";

import { poApi } from "../../api/poApi";

import {
  formatDate,
  formatMoney
} from "../../utils/format";

import {
  PO_STATUSES,
  PO_TYPES,
  PURCHASE_TYPES
} from "../../constants";

export default function POListPage() {
  const navigate = useNavigate();

  // =====================================================
  // FILTERS
  // =====================================================
  const [filters, setFilters] = useState({
    page: 1,
    limit: 30,
    search: "",
    status: "",
    poType: "",
    purchaseType: "",
    dateFrom: "",
    dateTo: ""
  });

  // =====================================================
  // LOAD PURCHASE ORDERS
  //
  // IMPORTANT:
  //
  // 1. First call normal list API.
  // 2. For rows where approval user data is missing,
  //    call the existing PO detail API.
  // 3. Merge approval information into list row.
  //
  // This is a frontend workaround until the hosted
  // backend list endpoint is updated.
  // =====================================================
  const q = useQuery({
    queryKey: [
      "purchase-orders",
      filters
    ],

    queryFn: async () => {
      // ===============================================
      // NORMAL LIST API
      // ===============================================
      const listResponse =
        await poApi.list(
          Object.fromEntries(
            Object.entries(
              filters
            ).filter(
              ([, value]) =>
                value !== ""
            )
          )
        );

      const listRows =
        listResponse?.data ||
        [];

      // ===============================================
      // ENRICH ROWS FROM DETAIL API ONLY WHEN NEEDED
      // ===============================================
      const enrichedRows =
        await Promise.all(
          listRows.map(
            async (po) => {
              const status =
                po.status;

              const approval =
                po.approval || {};

              const approvedStatus =
                [
                  "Approved",
                  "Issued",
                  "Closed"
                ].includes(
                  status
                );

              const rejectedStatus =
                status ===
                "Rejected";

              // =======================================
              // DETAIL API REQUIRED?
              //
              // Pending rows already have submitter.
              //
              // For Approved / Issued / Closed:
              // fetch detail if approvedBy missing.
              //
              // For Rejected:
              // fetch detail if rejectedBy missing.
              //
              // Also fetch if submittedBy is missing.
              // =======================================
              const needsDetail =
                !approval
                  ?.submittedBy ||
                (
                  approvedStatus &&
                  !approval
                    ?.approvedBy
                ) ||
                (
                  rejectedStatus &&
                  !approval
                    ?.rejectedBy
                );

              if (
                !needsDetail
              ) {
                return po;
              }

              try {
                const detailResponse =
                  await poApi.get(
                    po._id
                  );

                const detailPO =
                  detailResponse
                    ?.data;

                if (!detailPO) {
                  return po;
                }

                return {
                  ...po,
                  ...detailPO,

                  approval: {
                    ...approval,
                    ...(
                      detailPO
                        .approval ||
                      {}
                    )
                  }
                };
              } catch (
                error
              ) {
                console.error(
                  `[PO LIST] Unable to load approval detail for ${po.poNumber}:`,
                  error
                );

                // Keep list working even if one
                // detail request fails.
                return po;
              }
            }
          )
        );

      // ===============================================
      // KEEP ORIGINAL PAGINATION ETC.
      // ===============================================
      return {
        ...listResponse,
        data:
          enrichedRows
      };
    }
  });

  // =====================================================
  // DATA
  // =====================================================
  const rows =
    q.data?.data ||
    [];

  const p =
    q.data?.pagination || {
      page: 1,
      pages: 1,
      total: 0
    };

  // =====================================================
  // SET FILTER
  // =====================================================
  const set = (
    name,
    value
  ) => {
    setFilters(
      (current) => ({
        ...current,

        [name]:
          value,

        page:
          1
      })
    );
  };

  // =====================================================
  // RESET FILTERS
  // =====================================================
  function resetFilters() {
    setFilters({
      page: 1,
      limit: 30,
      search: "",
      status: "",
      poType: "",
      purchaseType: "",
      dateFrom: "",
      dateTo: ""
    });
  }

  // =====================================================
  // SUBMITTED BY
  // =====================================================
  function renderSubmittedBy(
    po
  ) {
    const submittedBy =
      po.approval
        ?.submittedBy;

    const submittedLevel =
      po.approval
        ?.submittedLevel ||
      submittedBy
        ?.approvalLevel ||
      "";

    if (!submittedBy) {
      return (
        <span className="text-secondary">
          -
        </span>
      );
    }

    return (
      <div
        style={{
          minWidth:
            125
        }}
      >
        {/* NORMAL FONT */}
        <div>
          {submittedBy.name ||
            "-"}
        </div>

        {submittedLevel && (
          <div className="small text-secondary">
            {submittedLevel}
          </div>
        )}
      </div>
    );
  }

  // =====================================================
  // APPROVED / REJECTED BY
  // =====================================================
  function renderApprovedBy(
    po
  ) {
    const approvedBy =
      po.approval
        ?.approvedBy;

    const approvedLevel =
      po.approval
        ?.approvedLevel ||
      approvedBy
        ?.approvalLevel ||
      "";

    // ===================================================
    // APPROVED USER
    // ===================================================
    if (approvedBy) {
      return (
        <div
          style={{
            minWidth:
              125
          }}
        >
          {/* NORMAL FONT */}
          <div>
            {approvedBy.name ||
              "-"}
          </div>

          {approvedLevel && (
            <div className="small text-secondary">
              {approvedLevel}
            </div>
          )}
        </div>
      );
    }

    // ===================================================
    // REJECTED USER
    // ===================================================
    if (
      po.status ===
      "Rejected"
    ) {
      const rejectedBy =
        po.approval
          ?.rejectedBy;

      const rejectedLevel =
        po.approval
          ?.rejectedLevel ||
        rejectedBy
          ?.approvalLevel ||
        "";

      if (rejectedBy) {
        return (
          <div
            style={{
              minWidth:
                125
            }}
          >
            <div>
              {rejectedBy.name ||
                "-"}
            </div>

            <div className="small text-danger">
              {rejectedLevel
                ? `${rejectedLevel} • Rejected`
                : "Rejected"}
            </div>
          </div>
        );
      }

      return (
        <span className="text-danger">
          Rejected
        </span>
      );
    }

    // ===================================================
    // PENDING
    // ===================================================
    if (
      po.status ===
      "Pending Approval"
    ) {
      return (
        <span className="text-warning">
          Pending
        </span>
      );
    }

    return (
      <span className="text-secondary">
        -
      </span>
    );
  }

  return (
    <>
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <PageHeader
        title="Purchase Orders"

        subtitle="Search, filter and manage the complete PO lifecycle."

        actions={
          <PermissionGate
            any={[
              "po.create"
            ]}
          >
            <Button
              onClick={() =>
                navigate(
                  "/purchase-orders/new"
                )
              }
            >
              <i className="bi bi-plus-lg me-2" />

              Create PO
            </Button>
          </PermissionGate>
        }
      />

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <Card className="border-0 shadow-sm">

        <Card.Body className="p-3 p-md-4">

          {/* ===============================================
              FILTERS
          =============================================== */}

          <Row className="g-2 mb-3">

            <Col md={4}>

              <Form.Control
                placeholder="PO number, vendor or project"

                value={
                  filters.search
                }

                onChange={(e) =>
                  set(
                    "search",
                    e.target.value
                  )
                }
              />

            </Col>

            <Col md={2}>

              <Form.Select
                value={
                  filters.status
                }

                onChange={(e) =>
                  set(
                    "status",
                    e.target.value
                  )
                }
              >
                <option value="">
                  All status
                </option>

                {PO_STATUSES.map(
                  (x) => (
                    <option
                      key={x}
                    >
                      {x}
                    </option>
                  )
                )}

              </Form.Select>

            </Col>

            <Col md={2}>

              <Form.Select
                value={
                  filters.poType
                }

                onChange={(e) =>
                  set(
                    "poType",
                    e.target.value
                  )
                }
              >
                <option value="">
                  All PO types
                </option>

                {PO_TYPES.map(
                  (x) => (
                    <option
                      key={x}
                    >
                      {x}
                    </option>
                  )
                )}

              </Form.Select>

            </Col>

            <Col md={2}>

              <Form.Select
                value={
                  filters.purchaseType
                }

                onChange={(e) =>
                  set(
                    "purchaseType",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Domestic / Import
                </option>

                {PURCHASE_TYPES.map(
                  (x) => (
                    <option
                      key={x}
                    >
                      {x}
                    </option>
                  )
                )}

              </Form.Select>

            </Col>

            <Col md={2}>

              <Button
                variant="outline-secondary"

                className="w-100"

                onClick={
                  resetFilters
                }
              >
                Reset
              </Button>

            </Col>

            <Col md={3}>

              <Form.Control
                type="date"

                value={
                  filters.dateFrom
                }

                onChange={(e) =>
                  set(
                    "dateFrom",
                    e.target.value
                  )
                }
              />

            </Col>

            <Col md={3}>

              <Form.Control
                type="date"

                value={
                  filters.dateTo
                }

                onChange={(e) =>
                  set(
                    "dateTo",
                    e.target.value
                  )
                }
              />

            </Col>

          </Row>

          {/* ===============================================
              DATA
          =============================================== */}

          {q.isLoading ? (

            <LoadingBlock />

          ) : rows.length === 0 ? (

            <EmptyState
              title="No purchase orders"
              text="Create a PO or change the filters."
            />

          ) : (
            <>
              <div className="table-responsive">

                <Table
                  hover
                  className="align-middle"
                >

                  <thead className="table-light">

                    <tr>

                      <th>
                        PO Number
                      </th>

                      <th>
                        Date
                      </th>

                      <th>
                        Vendor
                      </th>

                      <th>
                        Project
                      </th>

                      <th>
                        PO Type
                      </th>

                      <th className="text-end">
                        Grand Total
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Submitted By
                      </th>

                      <th>
                        Approved By
                      </th>

                      <th />

                    </tr>

                  </thead>

                  <tbody>

                    {rows.map(
                      (po) => (

                        <tr
                          key={
                            po._id
                          }
                        >

                          {/* PO NUMBER */}

                          <td>

                            <Link
                              className="fw-semibold text-decoration-none"

                              to={`/purchase-orders/${po._id}`}
                            >
                              {po.poNumber}

                              {po.revisionNo
                                ? ` / R${po.revisionNo}`
                                : ""}
                            </Link>

                          </td>

                          {/* DATE */}

                          <td>

                            {formatDate(
                              po.poDate
                            )}

                          </td>

                          {/* VENDOR */}

                          <td>

                            <div>
                              {po.vendor
                                ?.vendorName ||
                                "-"}
                            </div>

                            <div className="small text-secondary">
                              {po.vendor
                                ?.vendorCode ||
                                ""}
                            </div>

                          </td>

                          {/* PROJECT */}

                          <td>

                            {po.project
                              ?.projectCode ||
                              "-"}

                          </td>

                          {/* PO TYPE */}

                          <td>

                            {po.poType}

                          </td>

                          {/* TOTAL */}

                          <td className="text-end fw-semibold">

                            {formatMoney(
                              po.totals
                                ?.grandTotal,

                              po.currency
                            )}

                          </td>

                          {/* STATUS */}

                          <td>

                            <StatusBadge
                              status={
                                po.status
                              }
                            />

                          </td>

                          {/* SUBMITTED BY */}

                          <td>

                            {renderSubmittedBy(
                              po
                            )}

                          </td>

                          {/* APPROVED BY */}

                          <td>

                            {renderApprovedBy(
                              po
                            )}

                          </td>

                          {/* VIEW */}

                          <td className="text-end">

                            <Button
                              size="sm"

                              variant="outline-secondary"

                              onClick={() =>
                                navigate(
                                  `/purchase-orders/${po._id}`
                                )
                              }
                            >
                              <i className="bi bi-eye" />
                            </Button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </Table>

              </div>

              {/* =============================================
                  PAGINATION
              ============================================= */}

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

                <span className="small text-secondary">

                  {p.total} PO(s)

                </span>

                <PaginationBar
                  page={
                    p.page
                  }

                  pages={
                    p.pages
                  }

                  onChange={(page) =>
                    setFilters(
                      (current) => ({
                        ...current,
                        page
                      })
                    )
                  }
                />

              </div>

            </>
          )}

        </Card.Body>

      </Card>
    </>
  );
}