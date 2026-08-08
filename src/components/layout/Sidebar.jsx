import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

const groups = [
  {
    label: "Purchase",
    items: [
      ["/dashboard", "bi-grid", "Dashboard"],
      [
        "/purchase-orders",
        "bi-receipt",
        "Purchase Orders",
        ["po.read", "po.create", "po.approve"]
      ],
      [
        "/purchase-orders/new",
        "bi-file-earmark-plus",
        "Create PO",
        ["po.create"]
      ],
      [
        "/approvals",
        "bi-check2-square",
        "Approval Inbox",
        ["po.approve", "po.reject"]
      ],
      [
        "/reports",
        "bi-bar-chart",
        "Reports",
        ["report.read"]
      ]
    ]
  },

  {
    label: "Masters",
    items: [
      [
        "/masters/companies",
        "bi-building",
        "Company",
        ["company.read", "company.write"]
      ],

      [
        "/masters/vendors",
        "bi-truck",
        "Vendors",
        ["vendor.read", "vendor.write"]
      ],

      [
        "/masters/materials",
        "bi-box-seam",
        "Materials",
        ["material.read", "material.write"]
      ],

      [
        "/masters/projects",
        "bi-kanban",
        "Projects",
        ["project.read", "project.write"]
      ],

      [
        "/masters/cost-centers",
        "bi-diagram-3",
        "Cost Centers",
        ["cost_center.read", "cost_center.write"]
      ],

      [
        "/masters/delivery-addresses",
        "bi-geo-alt",
        "Delivery Addresses",
        ["delivery.read", "delivery.write"]
      ],

      // ============================================
      // NEW PAYMENT TERMS MASTER
      // ============================================
      [
        "/masters/payment-terms",
        "bi-cash-coin",
        "Payment Terms",
        ["payment.read", "payment.write"]
      ],

      [
        "/masters/po-terms",
        "bi-card-text",
        "PO Terms",
        ["term.read", "term.write"]
      ],

      [
        "/masters/users",
        "bi-people",
        "Users",
        ["user.read", "user.write"]
      ],

      [
        "/masters/roles",
        "bi-shield-lock",
        "Roles",
        ["role.read", "role.write"]
      ]
    ]
  }
];

export default function Sidebar({
  mobile = false,
  onNavigate
}) {
  const { can } = useAuth();

  return (
    <div
      className={`sidebar ${
        mobile ? "sidebar-mobile" : ""
      }`}
    >
      <div className="sidebar-brand">
        <img
          src={logo}
          alt="ThetaVega"
          className="sidebar-logo"
        />

        <span>THETAVEGA TECH</span>
      </div>

      <div className="sidebar-scroll">
        {groups.map((group) => (
          <div
            key={group.label}
            className="mb-3"
          >
            <div className="sidebar-section-label">
              {group.label}
            </div>

            <nav className="nav flex-column gap-1">
              {group.items.map(
                ([
                  to,
                  icon,
                  label,
                  perms
                ]) => {
                  if (
                    perms?.length &&
                    !can(...perms)
                  ) {
                    return null;
                  }

                  return (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={onNavigate}
                      className={({
                        isActive
                      }) =>
                        `sidebar-link ${
                          isActive
                            ? "active"
                            : ""
                        }`
                      }
                    >
                      <i
                        className={`bi ${icon}`}
                      />

                      <span>
                        {label}
                      </span>
                    </NavLink>
                  );
                }
              )}
            </nav>
          </div>
        ))}
      </div>
    </div>
  );
}