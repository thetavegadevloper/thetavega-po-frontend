import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import LoadingBlock from "../../components/common/LoadingBlock";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import PaginationBar from "../../components/common/PaginationBar";
import PermissionGate from "../../components/auth/PermissionGate";
import { poApi } from "../../api/poApi";
import { formatDate, formatMoney } from "../../utils/format";
import { PO_STATUSES, PO_TYPES, PURCHASE_TYPES } from "../../constants";

export default function POListPage() {
  const navigate=useNavigate();
  const [filters,setFilters]=useState({page:1,limit:30,search:"",status:"",poType:"",purchaseType:"",dateFrom:"",dateTo:""});
  const q=useQuery({queryKey:["purchase-orders",filters],queryFn:()=>poApi.list(Object.fromEntries(Object.entries(filters).filter(([,v])=>v!=="")))});
  const rows=q.data?.data||[];const p=q.data?.pagination||{page:1,pages:1,total:0};
  const set=(name,value)=>setFilters(f=>({...f,[name]:value,page:1}));
  return <><PageHeader title="Purchase Orders" subtitle="Search, filter and manage the complete PO lifecycle." actions={<PermissionGate any={["po.create"]}><Button onClick={()=>navigate("/purchase-orders/new")}><i className="bi bi-plus-lg me-2"/>Create PO</Button></PermissionGate>}/>
  <Card className="border-0 shadow-sm"><Card.Body className="p-3 p-md-4"><Row className="g-2 mb-3"><Col md={4}><Form.Control placeholder="PO number, vendor or project" value={filters.search} onChange={e=>set("search",e.target.value)}/></Col><Col md={2}><Form.Select value={filters.status} onChange={e=>set("status",e.target.value)}><option value="">All status</option>{PO_STATUSES.map(x=><option key={x}>{x}</option>)}</Form.Select></Col><Col md={2}><Form.Select value={filters.poType} onChange={e=>set("poType",e.target.value)}><option value="">All PO types</option>{PO_TYPES.map(x=><option key={x}>{x}</option>)}</Form.Select></Col><Col md={2}><Form.Select value={filters.purchaseType} onChange={e=>set("purchaseType",e.target.value)}><option value="">Domestic / Import</option>{PURCHASE_TYPES.map(x=><option key={x}>{x}</option>)}</Form.Select></Col><Col md={2}><Button variant="outline-secondary" className="w-100" onClick={()=>setFilters({page:1,limit:30,search:"",status:"",poType:"",purchaseType:"",dateFrom:"",dateTo:""})}>Reset</Button></Col><Col md={3}><Form.Control type="date" value={filters.dateFrom} onChange={e=>set("dateFrom",e.target.value)}/></Col><Col md={3}><Form.Control type="date" value={filters.dateTo} onChange={e=>set("dateTo",e.target.value)}/></Col></Row>
  {q.isLoading?<LoadingBlock/>:rows.length===0?<EmptyState title="No purchase orders" text="Create a PO or change the filters."/>:<><div className="table-responsive"><Table hover className="align-middle"><thead className="table-light"><tr><th>PO Number</th><th>Date</th><th>Vendor</th><th>Project</th><th>PO Type</th><th className="text-end">Grand Total</th><th>Status</th><th></th></tr></thead><tbody>{rows.map(po=><tr key={po._id}><td><Link className="fw-semibold text-decoration-none" to={`/purchase-orders/${po._id}`}>{po.poNumber}{po.revisionNo?` / R${po.revisionNo}`:""}</Link></td><td>{formatDate(po.poDate)}</td><td>{po.vendor?.vendorName}<div className="small text-secondary">{po.vendor?.vendorCode}</div></td><td>{po.project?.projectCode||"-"}</td><td>{po.poType}</td><td className="text-end fw-semibold">{formatMoney(po.totals?.grandTotal,po.currency)}</td><td><StatusBadge status={po.status}/></td><td className="text-end"><Button size="sm" variant="outline-secondary" onClick={()=>navigate(`/purchase-orders/${po._id}`)}><i className="bi bi-eye"/></Button></td></tr>)}</tbody></Table></div><div className="d-flex justify-content-between align-items-center flex-wrap gap-2"><span className="small text-secondary">{p.total} PO(s)</span><PaginationBar page={p.page} pages={p.pages} onChange={page=>setFilters(f=>({...f,page}))}/></div></>}
  </Card.Body></Card></>;
}
