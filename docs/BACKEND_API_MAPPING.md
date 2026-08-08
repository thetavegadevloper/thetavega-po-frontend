# Backend API Mapping

| Frontend screen | Backend endpoint |
|---|---|
| Login | `POST /api/auth/login` |
| Current user | `GET /api/auth/me` |
| Company Master | `/api/companies` |
| Vendor Master | `/api/vendors` |
| Material Master | `/api/materials` |
| Project Master | `/api/projects` |
| Cost Center Master | `/api/cost-centers` |
| Delivery Master | `/api/delivery-addresses` |
| PO Terms | `/api/po-terms` |
| Users | `/api/users` |
| Roles | `/api/roles` |
| PO List/Create | `/api/purchase-orders` |
| PO Detail/Update | `/api/purchase-orders/:id` |
| Submit | `/api/purchase-orders/:id/submit` |
| Approve | `/api/purchase-orders/:id/approve` |
| Reject | `/api/purchase-orders/:id/reject` |
| Issue | `/api/purchase-orders/:id/issue` |
| Revise | `/api/purchase-orders/:id/revise` |
| Cancel | `/api/purchase-orders/:id/cancel` |
| Close | `/api/purchase-orders/:id/close` |
| PDF | `/api/purchase-orders/:id/pdf` |
| Regenerate PDF | `/api/purchase-orders/:id/pdf/regenerate` |
| Email PO | `/api/purchase-orders/:id/email` |
| Audit | `/api/purchase-orders/:id/audit` |
| Attachments | `/api/purchase-orders/:id/attachments` |
| PO Report | `/api/reports/purchase-orders` |
| CSV Export | `/api/reports/purchase-orders/export` |
