import { useEffect, useState } from "react";
import {
  NavLink,
  useLocation
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

// =====================================================
// PURCHASE MENU
// =====================================================
const purchaseItems = [
  [
    "/dashboard",
    "bi-grid",
    "Dashboard"
  ],

  [
    "/purchase-orders",
    "bi-receipt",
    "Purchase Orders",
    [
      "po.read",
      "po.create",
      "po.approve"
    ]
  ],

  [
    "/purchase-orders/new",
    "bi-file-earmark-plus",
    "Create PO",
    [
      "po.create"
    ]
  ],

  [
    "/approvals",
    "bi-check2-square",
    "Approval Inbox",
    [
      "po.approve",
      "po.reject"
    ]
  ],

  [
    "/reports",
    "bi-bar-chart",
    "Reports",
    [
      "report.read"
    ]
  ]
];

// =====================================================
// MASTER MENU
// =====================================================
const masterItems = [
  [
    "/masters/companies",
    "bi-building",
    "Company",
    [
      "company.read",
      "company.write"
    ]
  ],

  [
    "/masters/vendors",
    "bi-truck",
    "Vendors",
    [
      "vendor.read",
      "vendor.write"
    ]
  ],

  [
    "/masters/materials",
    "bi-box-seam",
    "Materials",
    [
      "material.read",
      "material.write"
    ]
  ],

  [
    "/masters/projects",
    "bi-kanban",
    "Projects",
    [
      "project.read",
      "project.write"
    ]
  ],

  [
    "/masters/cost-centers",
    "bi-diagram-3",
    "Cost Centers",
    [
      "cost_center.read",
      "cost_center.write"
    ]
  ],

  [
    "/masters/delivery-addresses",
    "bi-geo-alt",
    "Delivery Addresses",
    [
      "delivery.read",
      "delivery.write"
    ]
  ],

  [
    "/masters/payment-terms",
    "bi-cash-coin",
    "Payment Terms",
    [
      "payment.read",
      "payment.write"
    ]
  ],

  [
    "/masters/po-terms",
    "bi-card-text",
    "PO Terms",
    [
      "term.read",
      "term.write"
    ]
  ],

  [
    "/masters/users",
    "bi-people",
    "Users",
    [
      "user.read",
      "user.write"
    ]
  ],

  [
    "/masters/roles",
    "bi-shield-lock",
    "Roles",
    [
      "role.read",
      "role.write"
    ]
  ]
];

// =====================================================
// SIDEBAR
// =====================================================
export default function Sidebar({
  mobile = false,
  onNavigate
}) {
  const { can } = useAuth();

  const location =
    useLocation();

  // Automatically open Masters when user is
  // currently inside any /masters page.
  const [
    mastersOpen,
    setMastersOpen
  ] = useState(
    location.pathname.startsWith(
      "/masters"
    )
  );

  // ===================================================
  // KEEP MASTERS OPEN WHEN NAVIGATING INSIDE MASTERS
  // ===================================================
  useEffect(() => {
    if (
      location.pathname.startsWith(
        "/masters"
      )
    ) {
      setMastersOpen(true);
    }
  }, [
    location.pathname
  ]);

  // ===================================================
  // PERMISSION CHECK
  // ===================================================
  function hasPermission(
    perms
  ) {
    if (
      !perms?.length
    ) {
      return true;
    }

    return can(
      ...perms
    );
  }

  // ===================================================
  // VISIBLE MASTER ITEMS
  // ===================================================
  const visibleMasterItems =
    masterItems.filter(
      ([
        _to,
        _icon,
        _label,
        perms
      ]) =>
        hasPermission(
          perms
        )
    );

  const masterActive =
    location.pathname.startsWith(
      "/masters"
    );

  return (
    <div
      className={`sidebar ${
        mobile
          ? "sidebar-mobile"
          : ""
      }`}
    >

      {/* =================================================
          BRAND
      ================================================= */}

      <div className="sidebar-brand">

        <div className="sidebar-logo-wrap">

          <img
            src={logo}
            alt="ThetaVega Tech"
            className="sidebar-logo"
          />

        </div>

        <div className="sidebar-brand-copy">

          <div className="sidebar-brand-name">
            THETAVEGA TECH
          </div>

         

        </div>

      </div>


      {/* =================================================
          SCROLL AREA
      ================================================= */}

      <div className="sidebar-scroll">

        {/* =================================================
            PURCHASE
        ================================================= */}

        <div className="sidebar-group">

          <div className="sidebar-section-label">
            Purchase
          </div>

          <nav className="nav flex-column">

            {purchaseItems.map(
              ([
                to,
                icon,
                label,
                perms
              ]) => {

                if (
                  !hasPermission(
                    perms
                  )
                ) {
                  return null;
                }

                return (
                  <NavLink
                    key={to}

                    to={to}

                    onClick={
                      onNavigate
                    }

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

                    <span className="sidebar-link-icon">

                      <i
                        className={`bi ${icon}`}
                      />

                    </span>

                    <span className="sidebar-link-text">
                      {label}
                    </span>

                    <span className="sidebar-active-dot" />

                  </NavLink>
                );
              }
            )}

          </nav>

        </div>


        {/* =================================================
            MASTERS DROPDOWN
        ================================================= */}

        {visibleMasterItems.length >
          0 && (

          <div className="sidebar-group">

            <div className="sidebar-section-label">
              Configuration
            </div>


            {/* =============================================
                MASTER MAIN BUTTON
            ============================================= */}

            <button
              type="button"

              className={`
                sidebar-link
                sidebar-dropdown-button
                ${
                  masterActive
                    ? "master-active"
                    : ""
                }
              `}

              onClick={() =>
                setMastersOpen(
                  (current) =>
                    !current
                )
              }
            >

              <span className="sidebar-link-icon">

                <i className="bi bi-sliders" />

              </span>

              <span className="sidebar-link-text">
                Masters
              </span>

              <i
                className={`
                  bi
                  bi-chevron-down
                  sidebar-dropdown-arrow
                  ${
                    mastersOpen
                      ? "open"
                      : ""
                  }
                `}
              />

            </button>


            {/* =============================================
                MASTER CHILDREN
            ============================================= */}

            <div
              className={`
                sidebar-submenu
                ${
                  mastersOpen
                    ? "open"
                    : ""
                }
              `}
            >

              <div className="sidebar-submenu-inner">

                {visibleMasterItems.map(
                  ([
                    to,
                    icon,
                    label
                  ]) => (

                    <NavLink
                      key={to}

                      to={to}

                      onClick={
                        onNavigate
                      }

                      className={({
                        isActive
                      }) =>
                        `sidebar-submenu-link ${
                          isActive
                            ? "active"
                            : ""
                        }`
                      }
                    >

                      <span className="sidebar-submenu-line" />

                      <span className="sidebar-submenu-icon">

                        <i
                          className={`bi ${icon}`}
                        />

                      </span>

                      <span>
                        {label}
                      </span>

                    </NavLink>

                  )
                )}

              </div>

            </div>

          </div>

        )}

      </div>


      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="sidebar-footer">

        <span className="sidebar-footer-dot" />

        <div>

          <div className="sidebar-footer-title">
            Secure Access
          </div>

          <div className="sidebar-footer-text">
            ThetaVega Tech
          </div>

        </div>

      </div>


      {/* =================================================
          DROPDOWN STYLE
      ================================================= */}

      <style>
        {`

        /* =====================================================
           MASTER DROPDOWN BUTTON
        ===================================================== */

        .sidebar-dropdown-button {
          width: 100%;

          border: 0;

          text-align: left;

          cursor: pointer;

          background: transparent;
        }


        .sidebar-dropdown-button.master-active {
          color: #ffffff;

          background:
            rgba(
              32,
              132,
              255,
              0.10
            );
        }


        .sidebar-dropdown-button.master-active
        .sidebar-link-icon {
          color: #65aeff;

          background:
            rgba(
              36,
              140,
              255,
              0.12
            );
        }


        /* =====================================================
           DROPDOWN ARROW
        ===================================================== */

        .sidebar-dropdown-arrow {
          margin-left: auto;

          color: #6e82a0;

          font-size: 11px;

          transition:
            transform 0.28s ease,
            color 0.2s ease;
        }


        .sidebar-dropdown-arrow.open {
          transform:
            rotate(180deg);

          color: #9ec8ff;
        }


        /* =====================================================
           SUBMENU ANIMATION
        ===================================================== */

        .sidebar-submenu {
          display: grid;

          grid-template-rows: 0fr;

          opacity: 0;

          transition:
            grid-template-rows 0.3s ease,
            opacity 0.25s ease;
        }


        .sidebar-submenu.open {
          grid-template-rows: 1fr;

          opacity: 1;
        }


        .sidebar-submenu-inner {
          min-height: 0;

          overflow: hidden;

          padding-left: 11px;
        }


        .sidebar-submenu.open
        .sidebar-submenu-inner {
          padding-top: 5px;

          padding-bottom: 4px;
        }


        /* =====================================================
           SUBMENU ITEM
        ===================================================== */

        .sidebar-submenu-link {
          position: relative;

          min-height: 38px;

          display: flex;

          align-items: center;

          gap: 9px;

          margin:
            2px 0 2px 15px;

          padding:
            5px 10px 5px 13px;

          border-radius: 9px;

          color: #9eacc0;

          font-size: 12px;

          font-weight: 500;

          text-decoration: none;

          transition:
            color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }


        .sidebar-submenu-link:hover {
          color: #ffffff;

          background:
            rgba(
              255,
              255,
              255,
              0.045
            );

          transform:
            translateX(2px);
        }


        /* =====================================================
           SUBMENU CONNECTING LINE
        ===================================================== */

        .sidebar-submenu-line {
          position: absolute;

          left: -7px;

          width: 1px;
          height: 100%;

          background:
            rgba(
              130,
              157,
              194,
              0.16
            );
        }


        /* =====================================================
           SUBMENU ICON
        ===================================================== */

        .sidebar-submenu-icon {
          width: 25px;
          height: 25px;

          flex:
            0 0 25px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 7px;

          color: #7186a4;

          font-size: 11px;

          background:
            rgba(
              255,
              255,
              255,
              0.025
            );
        }


        /* =====================================================
           ACTIVE MASTER CHILD
        ===================================================== */

        .sidebar-submenu-link.active {
          color: #ffffff;

          background:
            rgba(
              38,
              137,
              255,
              0.13
            );
        }


        .sidebar-submenu-link.active
        .sidebar-submenu-icon {
          color: #65aeff;

          background:
            rgba(
              38,
              137,
              255,
              0.12
            );
        }


        .sidebar-submenu-link.active
        .sidebar-submenu-line {
          width: 2px;

          background:
            #2587f7;
        }

        `}
      </style>

    </div>
  );
}