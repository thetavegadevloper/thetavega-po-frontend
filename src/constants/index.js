export const PO_STATUSES = [
  "Draft",
  "Pending Approval",
  "Approved",
  "Issued",
  "Rejected",
  "Cancelled",
  "Closed",
];

export const PO_TYPES = [
  "Project",
  "Material",
  "Service",
  "AMC",
  "Job Work",
  "Capital",
  "Consumable",
  "Subcontract",
];

export const PURCHASE_TYPES = ["Domestic", "Import"];
export const CHARGE_MODES = ["Inclusive", "At Actual", "Percent", "Fixed"];

export const ALL_PERMISSIONS = [
  "company.read", "company.write", "cost_center.read", "cost_center.write",
  "project.read", "project.write", "vendor.read", "vendor.write",
  "material.read", "material.write", "delivery.read", "delivery.write",
  "term.read", "term.write", "user.read", "user.write", "role.read", "role.write",
  "po.read", "po.create", "po.update", "po.manual_item", "po.submit",
  "po.approve", "po.reject", "po.issue", "po.revise", "po.cancel",
  "po.pdf", "po.attachment", "po.audit", "report.read",
];
