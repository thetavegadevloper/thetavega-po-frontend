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

import { masterApi } from "../../api/masterApi";
import { API_BASE_URL } from "../../api/http";

import PageHeader from "../../components/common/PageHeader";
import LoadingBlock from "../../components/common/LoadingBlock";
import EmptyState from "../../components/common/EmptyState";
import PaginationBar from "../../components/common/PaginationBar";
import PermissionGate from "../../components/auth/PermissionGate";

import { getApiError } from "../../utils/error";

import {
  getByPath,
  setByPath
} from "../../utils/object";

// =====================================================
// BACKEND BASE URL
//
// API_BASE_URL:
// http://localhost:5000/api
//
// Attachment URL:
// /attachments/filename.pdf
//
// Final:
// http://localhost:5000/attachments/filename.pdf
// =====================================================
const BACKEND_BASE_URL =
  API_BASE_URL.replace(
    /\/api\/?$/,
    ""
  );

// =====================================================
// CHECK IF VALUE IS BROWSER FILE
// =====================================================
function isFile(value) {
  return (
    typeof File !== "undefined" &&
    value instanceof File
  );
}

// =====================================================
// GET ATTACHMENT URL
// =====================================================
function getAttachmentUrl(file) {
  if (!file) {
    return "";
  }

  const url =
    file.url || "";

  if (!url) {
    return "";
  }

  // Already absolute URL
  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  // Relative backend URL
  return `${BACKEND_BASE_URL}${
    url.startsWith("/")
      ? url
      : `/${url}`
  }`;
}

// =====================================================
// VIEW FILE LINK
// =====================================================
function ViewFileLink({
  file,
  showName = true
}) {
  if (!file) {
    return "-";
  }

  const fileName =
    file.originalName ||
    file.fileName ||
    "";

  const url =
    getAttachmentUrl(file);

  if (!url) {
    return (
      <span>
        {fileName || "-"}
      </span>
    );
  }

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap">
      {showName && (
        <span>
          {fileName}
        </span>
      )}

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm btn-outline-primary"
        title={`Open ${fileName}`}
      >
        <i className="bi bi-eye me-1" />
        View
      </a>
    </div>
  );
}

// =====================================================
// FIELD
// =====================================================
function Field({
  field,
  value,
  onChange
}) {
  // ===================================================
  // FILE FIELD
  // ===================================================
  if (field.type === "file") {
    return (
      <>
        <Form.Control
          type="file"
          accept={field.accept}
          multiple={Boolean(
            field.multiple
          )}
          onChange={(event) => {
            const files =
              Array.from(
                event.target.files ||
                  []
              );

            if (field.multiple) {
              onChange(files);
            } else {
              onChange(
                files[0] ||
                  null
              );
            }
          }}
        />

        {/* =============================================
            EXISTING SINGLE FILE
        ============================================= */}
        {!field.multiple &&
          value &&
          !isFile(value) &&
          value?.originalName && (
            <div className="mt-2">
              <div className="small text-secondary mb-1">
                Current file:
              </div>

              <ViewFileLink
                file={value}
              />
            </div>
          )}

        {/* =============================================
            NEW SINGLE FILE
        ============================================= */}
        {!field.multiple &&
          isFile(value) && (
            <div className="small text-primary mt-1">
              Selected:{" "}
              <strong>
                {value.name}
              </strong>
            </div>
          )}

        {/* =============================================
            SUPPORTING FILES
        ============================================= */}
        {field.multiple &&
          Array.isArray(value) &&
          value.length > 0 && (
            <div className="mt-2">
              {value.map(
                (
                  file,
                  index
                ) => (
                  <div
                    key={
                      file?.fileName ||
                      file?.name ||
                      file?.originalName ||
                      index
                    }
                    className="mb-2"
                  >
                    {isFile(file) ? (
                      <div className="small text-primary">
                        Selected:{" "}
                        <strong>
                          {file.name}
                        </strong>
                      </div>
                    ) : (
                      <ViewFileLink
                        file={file}
                      />
                    )}
                  </div>
                )
              )}
            </div>
          )}
      </>
    );
  }

  // ===================================================
  // EXISTING COMMON FIELD LOGIC
  // ===================================================
  const common = {
    value:
      field.type ===
      "checkbox"
        ? undefined
        : value ?? "",

    checked:
      field.type ===
      "checkbox"
        ? Boolean(value)
        : undefined,

    required:
      field.required,

    onChange: (
      event
    ) => {
      let next;

      if (
        field.type ===
        "checkbox"
      ) {
        next =
          event.target.checked;
      } else if (
        field.type ===
        "number"
      ) {
        next =
          event.target.value ===
          ""
            ? ""
            : Number(
                event.target
                  .value
              );
      } else {
        next =
          event.target.value;
      }

      onChange(next);
    }
  };

  // ===================================================
  // SELECT
  // ===================================================
  if (
    field.type === "select"
  ) {
    return (
      <Form.Select
        {...common}
      >
        <option value="">
          Select...
        </option>

        {(field.options ||
          []).map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}
      </Form.Select>
    );
  }

  // ===================================================
  // TEXTAREA
  // ===================================================
  if (
    field.type ===
    "textarea"
  ) {
    return (
      <Form.Control
        as="textarea"
        rows={
          field.rows || 3
        }
        {...common}
      />
    );
  }

  // ===================================================
  // CHECKBOX
  // ===================================================
  if (
    field.type ===
    "checkbox"
  ) {
    return (
      <Form.Check
        type="switch"
        label={
          field.label
        }
        {...common}
      />
    );
  }

  // ===================================================
  // NORMAL INPUT
  // ===================================================
  return (
    <Form.Control
      type={
        field.type ||
        "text"
      }
      step={
        field.step
      }
      {...common}
    />
  );
}

// =====================================================
// TABLE CELL
// =====================================================
function TableCell({
  row,
  path
}) {
  // ===================================================
  // GST CERTIFICATE
  // ONLY VIEW BUTTON
  // ===================================================
  if (
    path ===
    "gstCertificate.originalName"
  ) {
    const file =
      row.gstCertificate;

    if (!file) {
      return "-";
    }

    return (
      <ViewFileLink
        file={file}
        showName={false}
      />
    );
  }

  // ===================================================
  // PAN CARD
  // ONLY VIEW BUTTON
  // ===================================================
  if (
    path ===
    "panCard.originalName"
  ) {
    const file =
      row.panCard;

    if (!file) {
      return "-";
    }

    return (
      <ViewFileLink
        file={file}
        showName={false}
      />
    );
  }

  // ===================================================
  // SUPPORTING FILES
  // ONLY VIEW BUTTON
  // ===================================================
  if (
    path ===
    "supportingFiles"
  ) {
    const files =
      row.supportingFiles;

    if (
      !Array.isArray(files) ||
      files.length === 0
    ) {
      return "-";
    }

    return (
      <div className="d-flex flex-column gap-1">
        {files.map(
          (
            file,
            index
          ) => (
            <ViewFileLink
              key={
                file?.fileName ||
                file?.originalName ||
                index
              }
              file={file}
              showName={false}
            />
          )
        )}
      </div>
    );
  }

  // ===================================================
  // NORMAL COLUMN
  // ===================================================
  const value =
    getByPath(
      row,
      path
    );

  return String(
    value ?? "-"
  );
}

// =====================================================
// BUILD VENDOR FORM DATA
// =====================================================
function buildVendorFormData(
  data
) {
  const formData =
    new FormData();

  // ===================================================
  // NORMAL VENDOR FIELDS
  // ===================================================
  const normalFields = [
    "vendorCode",
    "vendorName",
    "purchaseType",
    "currency",
    "gstNo",
    "panNo",
    "bankName",
    "accountNo",
    "ifsc",
    "bankAddress",
    "cancelledCheque",
    "isActive"
  ];

  normalFields.forEach(
    (field) => {
      const value =
        data[field];

      if (
        value !==
          undefined &&
        value !== null
      ) {
        formData.append(
          field,
          String(value)
        );
      }
    }
  );

  // ===================================================
  // ADDRESS
  // ===================================================
  formData.append(
    "registeredAddress",
    JSON.stringify(
      data.registeredAddress ||
        {}
    )
  );

  // ===================================================
  // CONTACTS
  // ===================================================
  formData.append(
    "contacts",
    JSON.stringify(
      data.contacts ||
        []
    )
  );

  // ===================================================
  // GST CERTIFICATE
  // ===================================================
  if (
    isFile(
      data.gstCertificate
    )
  ) {
    formData.append(
      "gstCertificate",
      data.gstCertificate
    );
  }

  // ===================================================
  // PAN CARD
  // ===================================================
  if (
    isFile(
      data.panCard
    )
  ) {
    formData.append(
      "panCard",
      data.panCard
    );
  }

  // ===================================================
  // SUPPORTING FILES
  // ===================================================
  if (
    Array.isArray(
      data.supportingFiles
    )
  ) {
    data.supportingFiles.forEach(
      (file) => {
        if (
          isFile(file)
        ) {
          formData.append(
            "supportingFiles",
            file
          );
        }
      }
    );
  }

  return formData;
}

// =====================================================
// MASTER PAGE
// =====================================================
export default function MasterPage({
  config
}) {
  const qc =
    useQueryClient();

  const [
    page,
    setPage
  ] = useState(1);

  const [
    search,
    setSearch
  ] = useState("");

  const [
    activeFilter,
    setActiveFilter
  ] = useState("");

  const [
    show,
    setShow
  ] = useState(false);

  const [
    editing,
    setEditing
  ] = useState(null);

  const [
    form,
    setForm
  ] = useState(
    config.initial ||
      {}
  );

  // ===================================================
  // QUERY
  // ===================================================
  const query =
    useQuery({
      queryKey: [
        "master",
        config.endpoint,
        page,
        search,
        activeFilter
      ],

      queryFn: () =>
        masterApi.list(
          config.endpoint,
          {
            page,
            limit: 30,
            search,

            ...(
              activeFilter !==
              ""
                ? {
                    isActive:
                      activeFilter
                  }
                : {}
            )
          }
        )
    });

  // ===================================================
  // SAVE
  // ===================================================
  const save =
    useMutation({
      mutationFn: (
        payload
      ) =>
        editing
          ? masterApi.update(
              config.endpoint,
              editing._id,
              payload
            )
          : masterApi.create(
              config.endpoint,
              payload
            ),

      onSuccess: () => {
        toast.success(
          `${config.singular} ${
            editing
              ? "updated"
              : "created"
          }`
        );

        setShow(false);

        setEditing(null);

        setForm(
          config.initial ||
            {}
        );

        qc.invalidateQueries({
          queryKey: [
            "master",
            config.endpoint
          ]
        });
      },

      onError: (
        error
      ) =>
        toast.error(
          getApiError(
            error
          )
        )
    });

  // ===================================================
  // STATUS
  // ===================================================
  const statusMutation =
    useMutation({
      mutationFn: ({
        id,
        isActive
      }) =>
        masterApi.setStatus(
          config.endpoint,
          id,
          isActive
        ),

      onSuccess: () => {
        toast.success(
          "Status updated"
        );

        qc.invalidateQueries({
          queryKey: [
            "master",
            config.endpoint
          ]
        });
      },

      onError: (
        error
      ) =>
        toast.error(
          getApiError(
            error
          )
        )
    });

  // ===================================================
  // NEW
  // ===================================================
  function openNew() {
    setEditing(null);

    setForm(
      structuredClone(
        config.initial ||
          {}
      )
    );

    setShow(true);
  }

  // ===================================================
  // EDIT
  // ===================================================
  function openEdit(
    row
  ) {
    setEditing(row);

    setForm(
      structuredClone(
        row
      )
    );

    setShow(true);
  }

  // ===================================================
  // SUBMIT
  // ===================================================
  function submit(
    event
  ) {
    event.preventDefault();

    // =================================================
    // VENDOR ONLY
    // =================================================
    if (
      config.endpoint ===
      "/vendors"
    ) {
      let vendorData = {
        ...form
      };

      delete vendorData._id;
      delete vendorData.__v;
      delete vendorData.createdAt;
      delete vendorData.updatedAt;

      vendorData =
        config.clean
          ? config.clean(
              vendorData
            )
          : vendorData;

      const formData =
        buildVendorFormData(
          vendorData
        );

      save.mutate(
        formData
      );

      return;
    }

    // =================================================
    // ALL OTHER MASTERS - OLD LOGIC
    // =================================================
    let payload =
      structuredClone(
        form
      );

    delete payload._id;
    delete payload.__v;
    delete payload.createdAt;
    delete payload.updatedAt;

    payload =
      config.clean
        ? config.clean(
            payload
          )
        : payload;

    save.mutate(
      payload
    );
  }

  // ===================================================
  // DATA
  // ===================================================
  const rows =
    query.data?.data ||
    [];

  const pagination =
    query.data
      ?.pagination || {
      page: 1,
      pages: 1,
      total:
        rows.length
    };

  // ===================================================
  // UI
  // ===================================================
  return (
    <>
      <PageHeader
        title={
          config.title
        }

        subtitle={`Maintain ${config.singular.toLowerCase()} records used while creating purchase orders.`}

        actions={
          <PermissionGate
            any={[
              config.writePermission
            ]}
          >
            <Button
              onClick={
                openNew
              }
            >
              <i className="bi bi-plus-lg me-1" />

              Add{" "}
              {config.singular}
            </Button>
          </PermissionGate>
        }
      />

      <Card className="border-0 shadow-sm">

        <Card.Body className="p-3 p-md-4">

          <Row className="g-2 mb-3">

            <Col
              md={7}
              lg={5}
            >

              <Form.Control
                placeholder={
                  config.searchPlaceholder
                }

                value={
                  search
                }

                onChange={(
                  event
                ) => {
                  setSearch(
                    event.target
                      .value
                  );

                  setPage(1);
                }}
              />

            </Col>

            <Col
              md={3}
              lg={2}
            >

              <Form.Select
                value={
                  activeFilter
                }

                onChange={(
                  event
                ) => {
                  setActiveFilter(
                    event.target
                      .value
                  );

                  setPage(1);
                }}
              >

                <option value="">
                  All status
                </option>

                <option value="true">
                  Active
                </option>

                <option value="false">
                  Inactive
                </option>

              </Form.Select>

            </Col>

          </Row>

          {query.isLoading ? (

            <LoadingBlock />

          ) : rows.length ===
            0 ? (

            <EmptyState />

          ) : (

            <>
              <div className="table-responsive">

                <Table
                  hover
                  className="align-middle"
                >

                  <thead className="table-light">

                    <tr>

                      {config.columns.map(
                        ([
                          ,
                          label
                        ]) => (
                          <th
                            key={
                              label
                            }
                          >
                            {label}
                          </th>
                        )
                      )}

                      <th>
                        Status
                      </th>

                      <th className="text-end">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {rows.map(
                      (
                        row
                      ) => (

                        <tr
                          key={
                            row._id
                          }
                        >

                          {config.columns.map(
                            ([
                              path
                            ]) => (
                              <td
                                key={
                                  path
                                }
                              >
                                <TableCell
                                  row={
                                    row
                                  }
                                  path={
                                    path
                                  }
                                />
                              </td>
                            )
                          )}

                          <td>

                            <span
                              className={`badge ${
                                row.isActive
                                  ? "text-bg-success"
                                  : "text-bg-secondary"
                              }`}
                            >
                              {row.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </td>

                          <td className="text-end text-nowrap">

                            <PermissionGate
                              any={[
                                config.writePermission
                              ]}
                            >

                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"

                                onClick={() =>
                                  openEdit(
                                    row
                                  )
                                }
                              >
                                <i className="bi bi-pencil" />
                              </Button>

                              <Button
                                variant={
                                  row.isActive
                                    ? "outline-danger"
                                    : "outline-success"
                                }

                                size="sm"

                                onClick={() =>
                                  statusMutation.mutate(
                                    {
                                      id:
                                        row._id,

                                      isActive:
                                        !row.isActive
                                    }
                                  )
                                }
                              >
                                <i
                                  className={`bi ${
                                    row.isActive
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

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

                <span className="small text-secondary">

                  {
                    pagination.total
                  }{" "}
                  record(s)

                </span>

                <PaginationBar
                  page={
                    pagination.page
                  }

                  pages={
                    pagination.pages
                  }

                  onChange={
                    setPage
                  }
                />

              </div>

            </>

          )}

        </Card.Body>

      </Card>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      <Modal
        show={
          show
        }

        onHide={() =>
          !save.isPending &&
          setShow(false)
        }

        size="lg"
        centered
        scrollable
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
                ? `Edit ${config.singular}`
                : `Add ${config.singular}`}

            </Modal.Title>

          </Modal.Header>

          <Modal.Body
            style={{
              maxHeight:
                "70vh",

              overflowY:
                "auto"
            }}
          >

            <Row className="g-3">

              {config.fields.map(
                (
                  field
                ) => {
                  const isCheckbox =
                    field.type ===
                    "checkbox";

                  return (
                    <Col
                      key={
                        field.name
                      }

                      md={
                        field.col ||
                        6
                      }

                      className={
                        isCheckbox
                          ? "d-flex align-items-end"
                          : ""
                      }
                    >

                      {!isCheckbox && (

                        <Form.Label>

                          {
                            field.label
                          }

                          {field.required && (

                            <span className="text-danger">
                              {" "}
                              *
                            </span>

                          )}

                        </Form.Label>

                      )}

                      <Field
                        field={
                          field
                        }

                        value={
                          getByPath(
                            form,
                            field.name
                          )
                        }

                        onChange={(
                          value
                        ) =>
                          setForm(
                            (
                              previous
                            ) =>
                              setByPath(
                                previous,
                                field.name,
                                value
                              )
                          )
                        }
                      />

                    </Col>
                  );
                }
              )}

            </Row>

          </Modal.Body>

          <Modal.Footer>

            <Button
              type="button"
              variant="outline-secondary"

              onClick={() =>
                setShow(false)
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
                : "Save"}
            </Button>

          </Modal.Footer>

        </Form>

      </Modal>

    </>
  );
}