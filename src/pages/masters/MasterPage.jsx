import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Col, Form, Modal, Row, Table } from "react-bootstrap";
import toast from "react-hot-toast";
import { masterApi } from "../../api/masterApi";
import PageHeader from "../../components/common/PageHeader";
import LoadingBlock from "../../components/common/LoadingBlock";
import EmptyState from "../../components/common/EmptyState";
import PaginationBar from "../../components/common/PaginationBar";
import PermissionGate from "../../components/auth/PermissionGate";
import { getApiError } from "../../utils/error";
import { getByPath, setByPath } from "../../utils/object";

function Field({ field, value, onChange }) {
  const common = {
    value: field.type === "checkbox" ? undefined : (value ?? ""),
    checked: field.type === "checkbox" ? Boolean(value) : undefined,
    required: field.required,
    onChange: (e) => {
      let next;
      if (field.type === "checkbox") next = e.target.checked;
      else if (field.type === "number") next = e.target.value === "" ? "" : Number(e.target.value);
      else next = e.target.value;
      onChange(next);
    },
  };

  if (field.type === "select") {
    return <Form.Select {...common}><option value="">Select...</option>{field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}</Form.Select>;
  }
  if (field.type === "textarea") return <Form.Control as="textarea" rows={field.rows || 3} {...common} />;
  if (field.type === "checkbox") return <Form.Check type="switch" label={field.label} {...common} />;
  return <Form.Control type={field.type || "text"} step={field.step} {...common} />;
}

export default function MasterPage({ config }) {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(config.initial || {});

  const query = useQuery({
    queryKey: ["master", config.endpoint, page, search, activeFilter],
    queryFn: () => masterApi.list(config.endpoint, { page, limit: 30, search, ...(activeFilter !== "" ? { isActive: activeFilter } : {}) }),
  });

  const save = useMutation({
    mutationFn: (payload) => editing ? masterApi.update(config.endpoint, editing._id, payload) : masterApi.create(config.endpoint, payload),
    onSuccess: () => {
      toast.success(`${config.singular} ${editing ? "updated" : "created"}`);
      setShow(false); setEditing(null); setForm(config.initial || {});
      qc.invalidateQueries({ queryKey: ["master", config.endpoint] });
    },
    onError: (err) => toast.error(getApiError(err)),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }) => masterApi.setStatus(config.endpoint, id, isActive),
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["master", config.endpoint] }); },
    onError: (err) => toast.error(getApiError(err)),
  });

  function openNew() { setEditing(null); setForm(structuredClone(config.initial || {})); setShow(true); }
  function openEdit(row) { setEditing(row); setForm(structuredClone(row)); setShow(true); }
  function submit(e) {
    e.preventDefault();
    let payload = structuredClone(form);
    delete payload._id; delete payload.__v; delete payload.createdAt; delete payload.updatedAt;
    payload = config.clean ? config.clean(payload) : payload;
    save.mutate(payload);
  }

  const rows = query.data?.data || [];
  const pagination = query.data?.pagination || { page: 1, pages: 1, total: rows.length };

  return (
    <>
      <PageHeader title={config.title} subtitle={`Maintain ${config.singular.toLowerCase()} records used while creating purchase orders.`}
        actions={<PermissionGate any={[config.writePermission]}><Button onClick={openNew}><i className="bi bi-plus-lg me-2" />Add {config.singular}</Button></PermissionGate>} />

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-3 p-md-4">
          <Row className="g-2 mb-3">
            <Col md={7} lg={5}><Form.Control placeholder={config.searchPlaceholder} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></Col>
            <Col md={3} lg={2}><Form.Select value={activeFilter} onChange={(e) => { setActiveFilter(e.target.value); setPage(1); }}><option value="">All status</option><option value="true">Active</option><option value="false">Inactive</option></Form.Select></Col>
          </Row>
          {query.isLoading ? <LoadingBlock /> : rows.length === 0 ? <EmptyState /> : (
            <>
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light"><tr>{config.columns.map(([, label]) => <th key={label}>{label}</th>)}<th>Status</th><th className="text-end">Action</th></tr></thead>
                  <tbody>{rows.map((row) => <tr key={row._id}>{config.columns.map(([path]) => <td key={path}>{String(getByPath(row, path) ?? "-")}</td>)}<td><span className={`badge ${row.isActive ? "text-bg-success" : "text-bg-secondary"}`}>{row.isActive ? "Active" : "Inactive"}</span></td><td className="text-end text-nowrap"><PermissionGate any={[config.writePermission]}><Button variant="outline-primary" size="sm" className="me-2" onClick={() => openEdit(row)}><i className="bi bi-pencil" /></Button><Button variant={row.isActive ? "outline-danger" : "outline-success"} size="sm" onClick={() => statusMutation.mutate({ id: row._id, isActive: !row.isActive })}><i className={`bi ${row.isActive ? "bi-pause-circle" : "bi-play-circle"}`} /></Button></PermissionGate></td></tr>)}</tbody>
                </Table>
              </div>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2"><span className="small text-secondary">{pagination.total} record(s)</span><PaginationBar page={pagination.page} pages={pagination.pages} onChange={setPage} /></div>
            </>
          )}
        </Card.Body>
      </Card>
<Modal
  show={show}
  onHide={() => !save.isPending && setShow(false)}
  size="lg"
  centered
  scrollable
>
  <Form onSubmit={submit}>
    <Modal.Header closeButton>
      <Modal.Title>
        {editing ? "Edit" : "Add"} {config.singular}
      </Modal.Title>
    </Modal.Header>

    <Modal.Body
      style={{
        maxHeight: "70vh",
        overflowY: "auto",
      }}
    >
      <Row className="g-3">
        {config.fields.map((field) => {
          const isCheckbox = field.type === "checkbox";

          return (
            <Col
              key={field.name}
              md={field.col || 6}
              className={isCheckbox ? "d-flex align-items-end" : ""}
            >
              {!isCheckbox && (
                <Form.Label>
                  {field.label}
                  {field.required && (
                    <span className="text-danger"> *</span>
                  )}
                </Form.Label>
              )}

              <Field
                field={field}
                value={getByPath(form, field.name)}
                onChange={(value) =>
                  setForm((prev) => setByPath(prev, field.name, value))
                }
              />
            </Col>
          );
        })}
      </Row>
    </Modal.Body>

    <Modal.Footer>
      <Button
        variant="outline-secondary"
        onClick={() => setShow(false)}
      >
        Cancel
      </Button>

      <Button type="submit" disabled={save.isPending}>
        {save.isPending ? "Saving..." : "Save"}
      </Button>
    </Modal.Footer>
  </Form>
</Modal>
     
    </>
  );
}
