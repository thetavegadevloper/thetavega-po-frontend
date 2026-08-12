import { useQuery } from "@tanstack/react-query";

import {
  Alert,
  Badge,
  Button,
  Card,
  Table
} from "react-bootstrap";

import {
  useNavigate
} from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import LoadingBlock from "../../components/common/LoadingBlock";
import EmptyState from "../../components/common/EmptyState";

import { useAuth } from "../../context/AuthContext";

import { poApi } from "../../api/poApi";

import {
  formatDate,
  formatMoney
} from "../../utils/format";

import {
  getApiError
} from "../../utils/error";

export default function ApprovalInboxPage() {
  const navigate =
    useNavigate();

  // =====================================================
  // CURRENT USER APPROVAL AUTHORITY
  // =====================================================
  const {
    approvalLevel,
    isFinalApprover
  } = useAuth();

  // =====================================================
  // LOAD ONLY PENDING APPROVAL POs
  // =====================================================
  const q = useQuery({
    queryKey: [
      "purchase-orders",
      "approval-inbox"
    ],

    queryFn: () =>
      poApi.list({
        status:
          "Pending Approval",

        limit:
          200
      })
  });

  const rows =
    q.data?.data ||
    [];

  // =====================================================
  // OPEN PO DETAIL
  // =====================================================
  function openPO(poId) {
    navigate(
      `/purchase-orders/${poId}`
    );
  }

  return (
    <>
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <PageHeader
        title="Approval Inbox"

        subtitle={
          isFinalApprover
            ? "Review item price, quantity, GST, terms and total before final PO approval."
            : "View Purchase Orders currently waiting for L2 / L1 verification and approval."
        }
      />


      {/* =================================================
          CURRENT AUTHORITY INFORMATION
      ================================================= */}

      {isFinalApprover ? (

        <Alert
          variant="info"
          className="border-0 shadow-sm"
        >
          <div className="d-flex align-items-start gap-3">

            <i className="bi bi-shield-check fs-4" />

            <div>

              <div className="fw-semibold">

                Final Approval Authority — {approvalLevel}

              </div>

              <div className="small mt-1">

                Before approval, verify the material/item,
                description, quantity, rate/price, GST,
                basic amount, grand total and commercial terms.

              </div>

            </div>

          </div>
        </Alert>

      ) : (

        <Alert
          variant="secondary"
          className="border-0 shadow-sm"
        >
          <div className="d-flex align-items-start gap-3">

            <i className="bi bi-eye fs-4" />

            <div>

              <div className="fw-semibold">

                View Only — {approvalLevel || "L3"}

              </div>

              <div className="small mt-1">

                You can view Purchase Orders awaiting approval,
                but final Approve / Reject actions are available
                only to L2 or L1 authority.

              </div>

            </div>

          </div>
        </Alert>

      )}


      {/* =================================================
          APPROVAL INBOX TABLE
      ================================================= */}

      <Card className="border-0 shadow-sm">

        <Card.Header className="bg-white border-0 px-4 pt-4 pb-3">

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <div className="fw-semibold fs-5">

                Pending Verification

              </div>

              <div className="small text-secondary">

                Purchase Orders submitted and waiting for final review.

              </div>

            </div>


            <Badge
              bg="warning"
              text="dark"
              className="px-3 py-2"
            >

              {rows.length} Pending

            </Badge>

          </div>

        </Card.Header>


        <Card.Body className="p-0">

          {/* ===============================================
              LOADING
          =============================================== */}

          {q.isLoading ? (

            <LoadingBlock text="Loading approval inbox..." />

          ) : q.isError ? (

            <div className="p-4">

              <Alert
                variant="danger"
                className="mb-0"
              >

                {getApiError(
                  q.error
                )}

              </Alert>

            </div>

          ) : rows.length === 0 ? (

            /* =============================================
               EMPTY
            ============================================= */

            <EmptyState
              icon="bi-check2-circle"

              title="Nothing pending"

              text="There are no Purchase Orders awaiting approval."
            />

          ) : (

            /* =============================================
               TABLE
            ============================================= */

            <div className="table-responsive">

              <Table
                hover
                className="align-middle mb-0"
              >

                <thead className="table-light">

                  <tr>

                    <th className="ps-4">
                      PO
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
                      Submitted Level
                    </th>

                    <th className="text-end">
                      PO Total
                    </th>

                    <th>
                      Status
                    </th>

                    <th className="text-end pe-4">
                      Action
                    </th>

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

                        {/* ===================================
                            PO NUMBER
                        =================================== */}

                        <td className="ps-4">

                          <div className="fw-semibold">

                            {
                              po.poNumber
                            }

                            {po.revisionNo
                              ? ` / R${po.revisionNo}`
                              : ""}

                          </div>


                          <div className="small text-secondary">

                            {
                              po.documentHeading
                            }

                          </div>

                        </td>


                        {/* ===================================
                            DATE
                        =================================== */}

                        <td>

                          {formatDate(
                            po.poDate
                          )}

                        </td>


                        {/* ===================================
                            VENDOR
                        =================================== */}

                        <td>

                          <div className="fw-semibold">

                            {
                              po.vendor
                                ?.vendorName ||
                              "-"
                            }

                          </div>


                          <div className="small text-secondary">

                            {
                              po.vendor
                                ?.vendorCode ||
                              ""
                            }

                          </div>

                        </td>


                        {/* ===================================
                            PROJECT
                        =================================== */}

                        <td>

                          <div>

                            {po.project
                              ?.projectCode ||
                              "-"}

                          </div>


                          {po.project
                            ?.projectName && (

                            <div className="small text-secondary">

                              {
                                po.project
                                  .projectName
                              }

                            </div>

                          )}

                        </td>


                        {/* ===================================
                            CREATOR / SUBMITTED LEVEL
                        =================================== */}

                        <td>

                          <Badge
                            bg={
                              po.creatorApprovalLevel === "L3"
                                ? "secondary"
                                : "info"
                            }
                          >

                            {po.creatorApprovalLevel ||
                              "L3"}

                          </Badge>


                          <div className="small text-secondary mt-1">

                            {po.creatorApprovalLevel === "L3"
                              ? "Initiator"
                              : "Creator"}

                          </div>

                        </td>


                        {/* ===================================
                            TOTAL
                        =================================== */}

                        <td className="text-end">

                          <div className="fw-bold">

                            {formatMoney(
                              po.totals
                                ?.grandTotal,
                              po.currency
                            )}

                          </div>


                          <div className="small text-secondary">

                            Tax:{" "}

                            {formatMoney(
                              po.totals
                                ?.taxTotal,
                              po.currency
                            )}

                          </div>

                        </td>


                        {/* ===================================
                            STATUS
                        =================================== */}

                        <td>

                          <Badge
                            bg="warning"
                            text="dark"
                          >

                            Pending Approval

                          </Badge>

                        </td>


                        {/* ===================================
                            ACTION
                        =================================== */}

                        <td className="text-end pe-4">

                          <Button
                            size="sm"

                            variant={
                              isFinalApprover
                                ? "primary"
                                : "outline-secondary"
                            }

                            onClick={() =>
                              openPO(
                                po._id
                              )
                            }
                          >

                            <i
                              className={`bi ${
                                isFinalApprover
                                  ? "bi-search"
                                  : "bi-eye"
                              } me-1`}
                            />

                            {isFinalApprover
                              ? "Review & Verify"
                              : "View PO"}

                          </Button>

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
    </>
  );
}