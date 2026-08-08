import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Col, Form, Modal, Row, Table } from "react-bootstrap";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import LoadingBlock from "../../components/common/LoadingBlock";
import { masterApi } from "../../api/masterApi";
import { getApiError } from "../../utils/error";
import PermissionGate from "../../components/auth/PermissionGate";

const initial = { employeeCode: "", name: "", department: "", designation: "", email: "", mobile: "", roleId: "", userId: "", password: "", isActive: true };

export default function UsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initial);
  const users = useQuery({ queryKey: ["users", search], queryFn: () => masterApi.list("/users", { search }) });
  const roles = useQuery({ queryKey: ["roles", "active"], queryFn: () => masterApi.list("/roles", { isActive: true, limit: 200 }) });
  const save = useMutation({
    mutationFn: (payload) => editing ? masterApi.update("/users", editing._id, payload) : masterApi.create("/users", payload),
    onSuccess: () => { toast.success(`User ${editing ? "updated" : "created"}`); setShow(false); setEditing(null); setForm(initial); qc.invalidateQueries({ queryKey: ["users"] }); },
    onError: (e) => toast.error(getApiError(e)),
  });
  const status = useMutation({ mutationFn: ({ id, active }) => masterApi.setStatus("/users", id, active), onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }), onError: (e) => toast.error(getApiError(e)) });

  function open(row) {
    setEditing(row || null);
    setForm(row ? { ...row, roleId: row.roleId?._id || row.roleId || "", password: "" } : initial);
    setShow(true);
  }
  function submit(e) {
    e.preventDefault();
    const payload = { ...form };
    delete payload._id; delete payload.createdAt; delete payload.updatedAt; delete payload.__v;
    if (editing && !payload.password) delete payload.password;
    save.mutate(payload);
  }
  const data = users.data?.data || [];
  return <>
    <PageHeader title="User Master" subtitle="System users, login IDs and assigned roles." actions={<PermissionGate any={["user.write"]}><Button onClick={() => open()}><i className="bi bi-plus-lg me-2" />Add User</Button></PermissionGate>} />
    <Card className="border-0 shadow-sm"><Card.Body className="p-4"><Form.Control className="mb-3" style={{ maxWidth: 420 }} placeholder="Search user, email or employee code" value={search} onChange={(e) => setSearch(e.target.value)} />{users.isLoading ? <LoadingBlock /> : <div className="table-responsive"><Table hover className="align-middle"><thead className="table-light"><tr><th>Employee</th><th>Name</th><th>User ID</th><th>Email</th><th>Role</th><th>Status</th><th className="text-end">Action</th></tr></thead><tbody>{data.map((u) => <tr key={u._id}><td>{u.employeeCode}</td><td>{u.name}</td><td>{u.userId}</td><td>{u.email}</td><td>{u.roleId?.roleName || "-"}</td><td><span className={`badge ${u.isActive ? "text-bg-success" : "text-bg-secondary"}`}>{u.isActive ? "Active" : "Inactive"}</span></td><td className="text-end"><PermissionGate any={["user.write"]}><Button size="sm" variant="outline-primary" className="me-2" onClick={() => open(u)}><i className="bi bi-pencil" /></Button><Button size="sm" variant={u.isActive ? "outline-danger" : "outline-success"} onClick={() => status.mutate({ id: u._id, active: !u.isActive })}><i className={`bi ${u.isActive ? "bi-pause-circle" : "bi-play-circle"}`} /></Button></PermissionGate></td></tr>)}</tbody></Table></div>}</Card.Body></Card>
    <Modal show={show} onHide={() => setShow(false)} size="lg" centered><Form onSubmit={submit}><Modal.Header closeButton><Modal.Title>{editing ? "Edit" : "Add"} User</Modal.Title></Modal.Header><Modal.Body><Row className="g-3">
      {[["employeeCode","Employee Code"],["name","Name"],["department","Department"],["designation","Designation"],["email","Email","email"],["mobile","Mobile"],["userId","User ID"]].map(([name,label,type]) => <Col md={6} key={name}><Form.Label>{label}{["employeeCode","name","email","userId"].includes(name) && <span className="text-danger"> *</span>}</Form.Label><Form.Control type={type||"text"} value={form[name]||""} required={["employeeCode","name","email","userId"].includes(name)} onChange={(e) => setForm({...form,[name]:e.target.value})} /></Col>)}
      <Col md={6}><Form.Label>Role <span className="text-danger">*</span></Form.Label><Form.Select value={form.roleId} required onChange={(e) => setForm({...form, roleId:e.target.value})}><option value="">Select role</option>{(roles.data?.data||[]).map((r)=><option key={r._id} value={r._id}>{r.roleName}</option>)}</Form.Select></Col>
      <Col md={6}><Form.Label>{editing ? "New Password (optional)" : "Password"}</Form.Label><Form.Control type="password" minLength={8} required={!editing} value={form.password||""} onChange={(e)=>setForm({...form,password:e.target.value})} /></Col>
    </Row></Modal.Body><Modal.Footer><Button variant="outline-secondary" onClick={()=>setShow(false)}>Cancel</Button><Button type="submit" disabled={save.isPending}>{save.isPending?"Saving...":"Save User"}</Button></Modal.Footer></Form></Modal>
  </>;
}
