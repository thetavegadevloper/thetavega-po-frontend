import { useState } from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";

import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader";

import { masterApi } from "../../api/masterApi";

import { getApiError } from "../../utils/error";

import LoadingBlock from "../../components/common/LoadingBlock";

import PermissionGate from "../../components/auth/PermissionGate";

// =====================================================
// INITIAL ROLE
// =====================================================
const initial = {
  roleName: "",
  permissions: ["*"],
  isActive: true,
};

export default function RolesPage() {
  const qc =
    useQueryClient();

  const [
    show,
    setShow,
  ] =
    useState(false);

  const [
    editing,
    setEditing,
  ] =
    useState(null);

  const [
    form,
    setForm,
  ] =
    useState(initial);

  // =====================================================
  // LOAD ROLES
  // =====================================================
  const q =
    useQuery({
      queryKey: [
        "roles",
      ],

      queryFn: () =>
        masterApi.list(
          "/roles",
          {
            limit: 200,
          }
        ),
    });

  // =====================================================
  // SAVE ROLE
  // =====================================================
  const save =
    useMutation({
      mutationFn: (
        payload
      ) =>
        editing
          ? masterApi.update(
              "/roles",
              editing._id,
              payload
            )
          : masterApi.create(
              "/roles",
              payload
            ),

      onSuccess: () => {
        toast.success(
          editing
            ? "Role updated successfully"
            : "Role created successfully"
        );

        setShow(false);
        setEditing(null);

        setForm({
          ...initial,
        });

        qc.invalidateQueries({
          queryKey: [
            "roles",
          ],
        });
      },

      onError: (
        error
      ) =>
        toast.error(
          getApiError(
            error
          )
        ),
    });

  // =====================================================
  // STATUS
  // =====================================================
  const status =
    useMutation({
      mutationFn: ({
        id,
        active,
      }) =>
        masterApi.setStatus(
          "/roles",
          id,
          active
        ),

      onSuccess: () =>
        qc.invalidateQueries({
          queryKey: [
            "roles",
          ],
        }),

      onError: (
        error
      ) =>
        toast.error(
          getApiError(
            error
          )
        ),
    });

  // =====================================================
  // OPEN MODAL
  // =====================================================
  function open(
    role
  ) {
    setEditing(
      role ||
      null
    );

    if (role) {
      setForm({
        roleName:
          role.roleName ||
          "",

        // ===============================================
        // FORCE FULL APPLICATION ACCESS
        // ===============================================
        permissions: [
          "*",
        ],

        isActive:
          role.isActive !==
          false,
      });
    } else {
      setForm({
        ...initial,
      });
    }

    setShow(true);
  }

  // =====================================================
  // CLOSE
  // =====================================================
  function closeModal() {
    setShow(false);

    setEditing(null);

    setForm({
      ...initial,
    });
  }

  // =====================================================
  // SUBMIT
  // =====================================================
  function submit(
    event
  ) {
    event.preventDefault();

    const payload = {
      roleName:
        String(
          form.roleName ||
          ""
        ).trim(),

      // ===============================================
      // ALL ROLES HAVE ALL APPLICATION PERMISSIONS
      // ===============================================
      permissions: [
        "*",
      ],

      // ===============================================
      // OLD FIELD KEPT NULL
      // ===============================================
      approvalLimit:
        null,

      isActive:
        form.isActive,
    };

    save.mutate(
      payload
    );
  }

  // =====================================================
  // DESCRIPTION
  // =====================================================
  function getDescription(
    roleName
  ) {
    const name =
      String(
        roleName ||
        ""
      )
        .trim()
        .toLowerCase();

    if (
      name ===
      "supervisor"
    ) {
      return "PO Initiator";
    }

    if (
      name ===
      "manager"
    ) {
      return "Manager";
    }

    if (
      name ===
      "director"
    ) {
      return "Director";
    }

    if (
      name ===
      "admin"
    ) {
      return "System Administrator";
    }

    return "Application User";
  }

  return (
    <>
      <PageHeader
        title="Role Master"
        subtitle="All roles have complete application access. PO approval authority is controlled separately in User Master."
        actions={
          <PermissionGate
            any={[
              "role.write",
            ]}
          >
            <Button
              onClick={() =>
                open()
              }
            >
              <i className="bi bi-plus-lg me-2" />

              Add Role
            </Button>
          </PermissionGate>
        }
      />

      <Card className="border-0 shadow-sm">

        <Card.Body className="p-4">

          {q.isLoading ? (

            <LoadingBlock />

          ) : (

            <div className="table-responsive">

              <Table
                hover
                className="align-middle mb-0"
              >

                <thead className="table-light">

                  <tr>

                    <th>
                      Role
                    </th>

                    <th>
                      Description
                    </th>

                    <th>
                      Application Access
                    </th>

                    <th>
                      PO Approval Authority
                    </th>

                    <th>
                      Status
                    </th>

                    <th className="text-end">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {(
                    q.data?.data ||
                    []
                  ).map(
                    (role) => (

                      <tr
                        key={
                          role._id
                        }
                      >

                        <td className="fw-semibold">

                          {
                            role.roleName
                          }

                        </td>

                        <td className="text-secondary">

                          {getDescription(
                            role.roleName
                          )}

                        </td>

                        <td>

                          <span className="badge text-bg-primary">

                            <i className="bi bi-check-circle me-1" />

                            Full Access

                          </span>

                        </td>

                        <td>

                          <span className="small text-secondary">

                            Controlled in User Master

                          </span>

                        </td>

                        <td>

                          <span
                            className={`badge ${
                              role.isActive
                                ? "text-bg-success"
                                : "text-bg-secondary"
                            }`}
                          >

                            {role.isActive
                              ? "Active"
                              : "Inactive"}

                          </span>

                        </td>

                        <td className="text-end">

                          <PermissionGate
                            any={[
                              "role.write",
                            ]}
                          >

                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="me-2"
                              onClick={() =>
                                open(
                                  role
                                )
                              }
                            >

                              <i className="bi bi-pencil" />

                            </Button>

                            <Button
                              size="sm"
                              variant={
                                role.isActive
                                  ? "outline-danger"
                                  : "outline-success"
                              }
                              onClick={() =>
                                status.mutate({
                                  id:
                                    role._id,

                                  active:
                                    !role.isActive,
                                })
                              }
                            >

                              <i
                                className={`bi ${
                                  role.isActive
                                    ? "bi-pause-circle"
                                    : "bi-play-circle"
                                }`}
                              />

                            </Button>

                          </PermissionGate>

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

      {/* =================================================
          MODAL
      ================================================= */}

      <Modal
        show={
          show
        }
        onHide={
          closeModal
        }
        centered
      >

        <Form
          onSubmit={
            submit
          }
        >

          <Modal.Header
            closeButton
          >

            <Modal.Title>

              {editing
                ? "Edit Role"
                : "Add Role"}

            </Modal.Title>

          </Modal.Header>

          <Modal.Body>

            <Row className="g-3">

              <Col md={12}>

                <Form.Label>
                  Role Name *
                </Form.Label>

                <Form.Control
                  required
                  value={
                    form.roleName
                  }
                  placeholder="Supervisor / Manager / Director / Admin"
                  onChange={(e) =>
                    setForm({
                      ...form,

                      roleName:
                        e.target.value,
                    })
                  }
                />

              </Col>

              <Col md={12}>

                <AlertBox />

              </Col>

            </Row>

          </Modal.Body>

          <Modal.Footer>

            <Button
              variant="outline-secondary"
              type="button"
              onClick={
                closeModal
              }
            >

              Cancel

            </Button>

            <Button
              type="submit"
              disabled={
                save.isPending
              }
            >

              {save.isPending
                ? "Saving..."
                : "Save Role"}

            </Button>

          </Modal.Footer>

        </Form>

      </Modal>
    </>
  );
}

// =====================================================
// ROLE INFO
// =====================================================
function AlertBox() {
  return (
    <div className="alert alert-info mb-0">

      <div className="fw-semibold mb-1">

        Full Application Access

      </div>

      <div className="small">

        This role automatically receives all application
        permissions including Masters, Purchase Orders,
        Approval Inbox and Reports.

      </div>

      <hr />

      <div className="small">

        PO approval authority is assigned separately
        in User Master:

      </div>

      <div className="d-flex flex-wrap gap-2 mt-2">

        <span className="badge text-bg-secondary">
          L3 - Submit
        </span>

        <span className="badge text-bg-info">
          L2 - Final Authority
        </span>

        <span className="badge text-bg-primary">
          L1 - Final Authority
        </span>

      </div>

    </div>
  );
}