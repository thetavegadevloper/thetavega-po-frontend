# ThetaVega Purchase Order System - React Frontend

This frontend is built specifically for the Node.js + Express + MongoDB PO backend in `po-system-backend-v1-tested`.

## Stack

- React 18
- Vite
- Bootstrap 5
- React-Bootstrap
- TanStack React Query v5
- Axios
- React Router
- React Hot Toast

## Main screens

1. Login
2. Dashboard
3. Purchase Order List
4. Create / Edit PO
5. PO Detail + Workflow
6. Approval Inbox
7. PO Reports + CSV Export
8. Company Master
9. Vendor Master
10. Material Master
11. Project Master
12. Cost Center Master
13. Delivery Address Master
14. PO Terms Master
15. User Master
16. Role / Permission Master

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
npm run dev
```

Default frontend URL:

```text
http://localhost:3000
```

Backend expected at:

```text
http://localhost:5000/api
```

Set it in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Seed login

If you used the supplied backend seed without changing the environment variables:

```text
User ID: admin
Password: ChangeMe@123
```

Change the seeded credentials before production deployment.

## React Query usage

Server state is not manually copied into global stores. React Query handles:

- master list caching
- purchase order lists
- PO detail
- approval inbox
- reports
- audit history
- attachment lists
- cache invalidation after save/workflow actions

Examples of query keys:

```js
["master", "/vendors", page, search]
["purchase-orders", filters]
["purchase-order", poId]
["po-audit", poId]
["po-report", filters]
```

## PO flow implemented

```text
Create Draft
   -> Submit
   -> Pending Approval
   -> Approve / Reject
   -> Approved
   -> Issue
   -> Issued
   -> PDF / Email / Revision / Close
```

When `PO_APPROVAL_REQUIRED=false` on the backend, a Draft PO can be issued directly by a user having `po.issue` permission.

## Calculation rule

The frontend calculates an estimated total only for immediate user feedback. The backend remains authoritative and recalculates:

- qty x rate
- GST
- packing
- freight
- rounding
- grand total
- amount in words

Never save client-calculated totals directly as the source of truth.

## PDF authentication

The PDF route is JWT protected. The frontend uses Axios to request the PDF as a Blob with the bearer token, then opens/downloads the returned Blob. It does not use a plain unauthenticated URL.

## Recommended next refinements

- multi-file attachment classification / delete endpoint if the backend later exposes it
- company logo upload endpoint when backend exposes one
- vendor KYC document upload when backend exposes endpoints
- multi-contact editor for Vendor Master (current UI supports the primary contact)
- optional React Query Devtools in development
- form schema validation with Zod/Yup if you want stricter client-side validation
