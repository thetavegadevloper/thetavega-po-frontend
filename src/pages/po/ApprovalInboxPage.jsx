import { useQuery } from "@tanstack/react-query";
import { Button, Card, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import LoadingBlock from "../../components/common/LoadingBlock";
import EmptyState from "../../components/common/EmptyState";
import { poApi } from "../../api/poApi";
import { formatDate, formatMoney } from "../../utils/format";

export default function ApprovalInboxPage(){const navigate=useNavigate();const q=useQuery({queryKey:["purchase-orders","approval-inbox"],queryFn:()=>poApi.list({status:"Pending Approval",limit:200})});const rows=q.data?.data||[];return <><PageHeader title="Approval Inbox" subtitle="Purchase orders currently waiting for approval."/><Card className="border-0 shadow-sm"><Card.Body className="p-0">{q.isLoading?<LoadingBlock/>:rows.length===0?<EmptyState icon="bi-check2-circle" title="Nothing pending" text="There are no purchase orders awaiting approval."/>:<div className="table-responsive"><Table hover className="align-middle mb-0"><thead className="table-light"><tr><th className="ps-4">PO</th><th>Date</th><th>Vendor</th><th>Project</th><th className="text-end">Total</th><th></th></tr></thead><tbody>{rows.map(po=><tr key={po._id}><td className="ps-4 fw-semibold">{po.poNumber}{po.revisionNo?` / R${po.revisionNo}`:""}</td><td>{formatDate(po.poDate)}</td><td>{po.vendor?.vendorName}</td><td>{po.project?.projectCode||"-"}</td><td className="text-end fw-semibold">{formatMoney(po.totals?.grandTotal,po.currency)}</td><td className="text-end pe-4"><Button size="sm" onClick={()=>navigate(`/purchase-orders/${po._id}`)}>Review</Button></td></tr>)}</tbody></Table></div>}</Card.Body></Card></>}
