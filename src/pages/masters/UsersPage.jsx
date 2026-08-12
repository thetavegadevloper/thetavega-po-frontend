import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table
} from "react-bootstrap";

import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader";
import LoadingBlock from "../../components/common/LoadingBlock";
import PermissionGate from "../../components/auth/PermissionGate";

import { masterApi } from "../../api/masterApi";
import { getApiError } from "../../utils/error";

// =====================================================
// PO APPROVAL LEVELS
// =====================================================
const APPROVAL_LEVELS = [
  {
    value: "L3",
    label: "L3 - Supervisor / Initiator",
    description: "PO requires final approval"
  },
  {
    value: "L2",
    label: "L2 - Manager / Final Approval Authority",
    description: "Final approval authority"
  },
  {
    value: "L1",
    label: "L1 - Director / Final Approval Authority",
    description: "Final approval authority"
  }
];

// =====================================================
// INITIAL FORM
// =====================================================
const initial = {
  employeeCode: "",
  name: "",
  department: "",
  designation: "",
  email: "",
  mobile: "",
  roleId: "",
  approvalLevel: "L3",
  userId: "",
  password: "",
  isActive: true
};

// =====================================================
// USER MASTER
// =====================================================
export default function UsersPage() {
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initial);

  // ===================================================
  // LOAD USERS
  // ===================================================
  const users = useQuery({
    queryKey: ["users", search],

    queryFn: () =>
      masterApi.list("/users", {
        search
      })
  });

  // ===================================================
  // LOAD ACTIVE ROLES
  // ===================================================
  const roles = useQuery({
    queryKey: ["roles", "active"],

    queryFn: () =>
      masterApi.list("/roles", {
        isActive: true,
        limit: 200
      })
  });

  // ===================================================
  // SAVE USER
  // ===================================================
  const save = useMutation({
    mutationFn: (payload) =>
      editing
        ? masterApi.update(
            "/users",
            editing._id,
            payload
          )
        : masterApi.create(
            "/users",
            payload
          ),

    onSuccess: () => {
      toast.success(
        `User ${editing ? "updated" : "created"}`
      );

      setShow(false);
      setEditing(null);
      setForm(initial);

      qc.invalidateQueries({
        queryKey: ["users"]
      });
    },

    onError: (e) =>
      toast.error(
        getApiError(e)
      )
  });

  // ===================================================
  // ACTIVE / INACTIVE
  // ===================================================
  const status = useMutation({
    mutationFn: ({
      id,
      active
    }) =>
      masterApi.setStatus(
        "/users",
        id,
        active
      ),

    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["users"]
      }),

    onError: (e) =>
      toast.error(
        getApiError(e)
      )
  });

  // ===================================================
  // OPEN ADD / EDIT
  // ===================================================
  function open(row) {
    setEditing(
      row || null
    );

    if (row) {
      setForm({
        ...row,

        roleId:
          row.roleId?._id ||
          row.roleId ||
          "",

        approvalLevel:
          row.approvalLevel ||
          "L3",

        password: ""
      });
    } else {
      setForm({
        ...initial
      });
    }

    setShow(true);
  }

  // ===================================================
  // CLOSE MODAL
  // ===================================================
  function closeModal() {
    setShow(false);
    setEditing(null);
    setForm({
      ...initial
    });
  }

  // ===================================================
  // SUBMIT
  // ===================================================
  function submit(e) {
    e.preventDefault();

    const payload = {
      ...form
    };

    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.__v;

    // Handle populated role object safely
    if (
      payload.roleId &&
      typeof payload.roleId === "object"
    ) {
      payload.roleId =
        payload.roleId._id;
    }

    // Password optional while editing
    if (
      editing &&
      !payload.password
    ) {
      delete payload.password;
    }

    // Approval Level required
    payload.approvalLevel =
      payload.approvalLevel ||
      "L3";

    save.mutate(
      payload
    );
  }

  // ===================================================
  // DATA
  // ===================================================
  const data =
    users.data?.data ||
    [];

  // ===================================================
  // APPROVAL LEVEL INFO
  // ===================================================
  function getApprovalLevelInfo(level) {
    switch (level) {
      case "L1":
        return {
          level: "L1",
          name: "Director",
          authority: "Final Authority",
          badge: "text-bg-primary"
        };

      case "L2":
        return {
          level: "L2",
          name: "Manager",
          authority: "Final Authority",
          badge: "text-bg-info"
        };

      case "L3":
      default:
        return {
          level: "L3",
          name: "Supervisor",
          authority: "Initiator",
          badge: "text-bg-secondary"
        };
    }
  }

  return (
    <>
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <PageHeader
        title="User Master"
        subtitle="System users, login IDs, roles and PO approval authority."

        actions={
          <PermissionGate
            any={[
              "user.write"
            ]}
          >
            <Button
              onClick={() =>
                open()
              }
            >
              <i className="bi bi-plus-lg me-2" />

              Add User
            </Button>
          </PermissionGate>
        }
      />


      {/* =================================================
          USER TABLE
      ================================================= */}

      <Card className="border-0 shadow-sm">

        <Card.Body className="p-4">

          {/* SEARCH */}

          <Form.Control
            className="mb-3"

            style={{
              maxWidth: 420
            }}

            placeholder="Search user, email or employee code"

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />


          {users.isLoading ? (

            <LoadingBlock />

          ) : (

            <div className="table-responsive">

              <Table
                hover
                className="align-middle"
              >

                <thead className="table-light">

                  <tr>

                    <th>
                      Employee
                    </th>

                    <th>
                      Name
                    </th>

                    <th>
                      User ID
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Role
                    </th>

                    <th>
                      Approval Level
                    </th>

                    <th>
                      Authority
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

                  {data.map((u) => {

                    const level =
                      getApprovalLevelInfo(
                        u.approvalLevel
                      );

                    return (
                      <tr
                        key={u._id}
                      >

                        {/* EMPLOYEE */}

                        <td>
                          {u.employeeCode}
                        </td>


                        {/* NAME */}

                        <td>

                          <div className="fw-semibold">
                            {u.name}
                          </div>

                          {u.designation && (

                            <div className="small text-secondary">
                              {u.designation}
                            </div>

                          )}

                        </td>


                        {/* USER ID */}

                        <td>
                          {u.userId}
                        </td>


                        {/* EMAIL */}

                        <td>
                          {u.email}
                        </td>


                        {/* ROLE */}

                        <td>
                          {u.roleId?.roleName || "-"}
                        </td>


                        {/* APPROVAL LEVEL */}

                        <td>

                          <span
                            className={`badge ${level.badge}`}
                          >
                            {level.level}
                          </span>

                        </td>


                        {/* AUTHORITY */}

                        <td>

                          <div className="fw-semibold small">
                            {level.name}
                          </div>

                          <div className="text-secondary small">
                            {level.authority}
                          </div>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`badge ${
                              u.isActive
                                ? "text-bg-success"
                                : "text-bg-secondary"
                            }`}
                          >
                            {u.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>

                        </td>


                        {/* ACTION */}

                        <td className="text-end">

                          <PermissionGate
                            any={[
                              "user.write"
                            ]}
                          >

                            {/* EDIT */}

                            <Button
                              size="sm"

                              variant="outline-primary"

                              className="me-2"

                              onClick={() =>
                                open(u)
                              }
                            >
                              <i className="bi bi-pencil" />
                            </Button>


                            {/* STATUS */}

                            <Button
                              size="sm"

                              variant={
                                u.isActive
                                  ? "outline-danger"
                                  : "outline-success"
                              }

                              onClick={() =>
                                status.mutate({
                                  id: u._id,
                                  active:
                                    !u.isActive
                                })
                              }
                            >

                              <i
                                className={`bi ${
                                  u.isActive
                                    ? "bi-pause-circle"
                                    : "bi-play-circle"
                                }`}
                              />

                            </Button>

                          </PermissionGate>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </Table>

            </div>

          )}

        </Card.Body>

      </Card>


      {/* =================================================
          ADD / EDIT USER MODAL
      ================================================= */}

      <Modal
        show={show}
        onHide={closeModal}
        size="lg"
        centered
      >

        <Form
          onSubmit={submit}
        >

          <Modal.Header
            closeButton
          >

            <Modal.Title>

              {editing
                ? "Edit User"
                : "Add User"}

            </Modal.Title>

          </Modal.Header>


          <Modal.Body>

            <Row className="g-3">

              {/* =================================================
                  EMPLOYEE CODE
              ================================================= */}

              <Col md={6}>

                <Form.Label>
                  Employee Code
                  <span className="text-danger">
                    {" "}*
                  </span>
                </Form.Label>

                <Form.Control
                  required

                  value={
                    form.employeeCode ||
                    ""
                  }

                  onChange={(e) =>
                    setForm({
                      ...form,
                      employeeCode:
                        e.target.value
                    })
                  }
                />

              </Col>


              {/* =================================================
                  NAME
              ================================================= */}

              <Col md={6}>

                <Form.Label>
                  Name
                  <span className="text-danger">
                    {" "}*
                  </span>
                </Form.Label>

                <Form.Control
                  required

                  value={
                    form.name ||
                    ""
                  }

                  onChange={(e) =>
                    setForm({
                      ...form,
                      name:
                        e.target.value
                    })
                  }
                />

              </Col>


              {/* =================================================
                  DEPARTMENT
              ================================================= */}

              <Col md={6}>

                <Form.Label>
                  Department
                </Form.Label>

                <Form.Control
                  value={
                    form.department ||
                    ""
                  }

                  onChange={(e) =>
                    setForm({
                      ...form,
                      department:
                        e.target.value
                    })
                  }
                />

              </Col>


              {/* =================================================
                  DESIGNATION
              ================================================= */}

              <Col md={6}>

                <Form.Label>
                  Designation
                </Form.Label>

                <Form.Control
                  value={
                    form.designation ||
                    ""
                  }

                  onChange={(e) =>
                    setForm({
                      ...form,
                      designation:
                        e.target.value
                    })
                  }
                />

              </Col>


              {/* =================================================
                  EMAIL
              ================================================= */}

              <Col md={6}>

                <Form.Label>
                  Email
                  <span className="text-danger">
                    {" "}*
                  </span>
                </Form.Label>

                <Form.Control
                  type="email"

                  required

                  value={
                    form.email ||
                    ""
                  }

                  onChange={(e) =>
                    setForm({
                      ...form,
                      email:
                        e.target.value
                    })
                  }
                />

              </Col>


              {/* =================================================
                  MOBILE
              ================================================= */}

              <Col md={6}>

                <Form.Label>
                  Mobile
                </Form.Label>

                <Form.Control
                  value={
                    form.mobile ||
                    ""
                  }

                  onChange={(e) =>
                    setForm({
                      ...form,
                      mobile:
                        e.target.value
                    })
                  }
                />

              </Col>


              {/* =================================================
                  USER ID
              ================================================= */}

              <Col md={6}>

                <Form.Label>
                  User ID
                  <span className="text-danger">
                    {" "}*
                  </span>
                </Form.Label>

                <Form.Control
                  required

                  value={
                    form.userId ||
                    ""
                  }

                  onChange={(e) =>
                    setForm({
                      ...form,
                      userId:
                        e.target.value
                    })
                  }
                />

              </Col>


              {/* =================================================
                  ROLE
              ================================================= */}

              <Col md={6}>

                <Form.Label>
                  Role
                  <span className="text-danger">
                    {" "}*
                  </span>
                </Form.Label>

                <Form.Select
                  required

                  value={
                    form.roleId ||
                    ""
                  }

                  onChange={(e) =>
                    setForm({
                      ...form,
                      roleId:
                        e.target.value
                    })
                  }
                >

                  <option value="">
                    Select role
                  </option>

                  {(
                    roles.data?.data ||
                    []
                  ).map((r) => (

                    <option
                      key={r._id}
                      value={r._id}
                    >
                      {r.roleName}
                    </option>

                  ))}

                </Form.Select>

              </Col>


              {/* =================================================
                  PO APPROVAL LEVEL
              ================================================= */}

              <Col md={6}>

                <Form.Label>

                  PO Approval Level

                  <span className="text-danger">
                    {" "}*
                  </span>

                </Form.Label>


                <Form.Select
                  required

                  value={
                    form.approvalLevel ||
                    "L3"
                  }

                  onChange={(e) =>
                    setForm({
                      ...form,
                      approvalLevel:
                        e.target.value
                    })
                  }
                >

                  <option value="">
                    Select Approval Level
                  </option>


                  {APPROVAL_LEVELS.map(
                    (level) => (

                      <option
                        key={
                          level.value
                        }

                        value={
                          level.value
                        }
                      >
                        {level.label}
                      </option>

                    )
                  )}

                </Form.Select>


                {/* LEVEL INFORMATION */}

                {form.approvalLevel && (

                  <div className="mt-2 small">

                    {form.approvalLevel ===
                      "L3" && (

                      <span className="text-secondary">
                        Supervisor / Initiator —
                        PO will require final approval
                        from L2 or L1.
                      </span>

                    )}


                    {form.approvalLevel ===
                      "L2" && (

                      <span className="text-info">
                        Manager — Final Approval
                        Authority.
                      </span>

                    )}


                    {form.approvalLevel ===
                      "L1" && (

                      <span className="text-primary">
                        Director — Final Approval
                        Authority.
                      </span>

                    )}

                  </div>

                )}

              </Col>


              {/* =================================================
                  PASSWORD
              ================================================= */}

              <Col md={6}>

                <Form.Label>

                  {editing
                    ? "New Password (optional)"
                    : "Password"}

                  {!editing && (

                    <span className="text-danger">
                      {" "}*
                    </span>

                  )}

                </Form.Label>


                <Form.Control
                  type="password"

                  minLength={8}

                  required={
                    !editing
                  }

                  value={
                    form.password ||
                    ""
                  }

                  onChange={(e) =>
                    setForm({
                      ...form,
                      password:
                        e.target.value
                    })
                  }
                />

              </Col>

            </Row>

          </Modal.Body>


          {/* =================================================
              FOOTER
          ================================================= */}

          <Modal.Footer>

            <Button
              variant="outline-secondary"
              type="button"
              onClick={closeModal}
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
                : "Save User"}

            </Button>

          </Modal.Footer>

        </Form>

      </Modal>
    </>
  );
}