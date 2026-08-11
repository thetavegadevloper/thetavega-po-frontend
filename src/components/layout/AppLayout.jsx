import { useState } from "react";

import {
  Button,
  Offcanvas
} from "react-bootstrap";

import {
  Outlet,
  useNavigate
} from "react-router-dom";

import Sidebar from "./Sidebar";

import { useAuth } from "../../context/AuthContext";

// =====================================================
// APPLICATION LAYOUT
// =====================================================
export default function AppLayout() {
  const [
    showMenu,
    setShowMenu
  ] = useState(false);

  const {
    user,
    logout
  } = useAuth();

  const navigate =
    useNavigate();

  // ===================================================
  // LOGOUT
  // ===================================================
  function handleLogout() {
    logout();

    navigate(
      "/login",
      {
        replace: true
      }
    );
  }

  // ===================================================
  // USER INITIAL
  // ===================================================
  const userInitial =
    String(
      user?.name ||
      user?.userId ||
      "U"
    )
      .charAt(0)
      .toUpperCase();

  return (
    <>
      <style>
        {`

        /* =====================================================
           ROOT LAYOUT

           IMPORTANT:
           Browser/body itself will NOT scroll.

           Sidebar:
           fixed full viewport height.

           Main content:
           internally scrollable.
        ===================================================== */

        html,
        body,
        #root {
          width: 100%;
          height: 100%;
          min-height: 100%;
          margin: 0;
        }

        body {
          overflow: hidden;
        }


        /* =====================================================
           APP SHELL
        ===================================================== */

        .app-shell {
          width: 100%;
          height: 100vh;

          display: flex;

          overflow: hidden;

          background:
            #f4f7fb;

          color:
            #152238;
        }


        /* =====================================================
           DESKTOP SIDEBAR WRAPPER

           IMPORTANT:
           Sidebar never moves with page content.
        ===================================================== */

        .sidebar-wrap {
          width: 252px;
          min-width: 252px;
          flex: 0 0 252px;

          height: 100vh;

          position: relative;

          z-index: 1030;

          overflow: hidden;
        }


        /* =====================================================
           SIDEBAR
        ===================================================== */

        .sidebar {
          width: 100%;
          height: 100%;

          position: relative;

          display: flex;
          flex-direction: column;

          overflow: hidden;

          color:
            #d5dfed;

          background:
            linear-gradient(
              180deg,
              #0d1728 0%,
              #0d1b2f 48%,
              #091525 100%
            );

          border-right:
            1px solid
            rgba(
              255,
              255,
              255,
              0.04
            );
        }


        /* =====================================================
           SIDEBAR DECORATION
        ===================================================== */

        .sidebar::before {
          content: "";

          position: absolute;

          width: 280px;
          height: 280px;

          right: -190px;
          bottom: 35px;

          border-radius: 50%;

          background:
            rgba(
              27,
              126,
              229,
              0.085
            );

          pointer-events: none;
        }


        .sidebar::after {
          content: "";

          position: absolute;

          width: 200px;
          height: 200px;

          left: -140px;
          top: -110px;

          border-radius: 50%;

          background:
            rgba(
              31,
              132,
              232,
              0.07
            );

          pointer-events: none;
        }


        /* =====================================================
           SIDEBAR BRAND
        ===================================================== */

        .sidebar-brand {
          height: 74px;
          min-height: 74px;
          flex: 0 0 74px;

          position: relative;
          z-index: 2;

          display: flex;
          align-items: center;

          gap: 11px;

          padding:
            0 18px;

          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              0.07
            );
        }


        .sidebar-logo-wrap {
          width: 38px;
          height: 38px;

          flex:
            0 0 38px;

          display: flex;
          align-items: center;
          justify-content: center;
        }


        .sidebar-logo {
          width: 38px;
          height: 38px;

          object-fit: contain;

          transition:
            transform
            0.25s ease;
        }


        .sidebar-brand:hover
        .sidebar-logo {
          transform:
            scale(1.06);
        }


        .sidebar-brand-copy {
          min-width: 0;
        }


        .sidebar-brand-name {
          color:
            #ffffff;

          font-size:
            13px;

          font-weight:
            750;

          letter-spacing:
            0.2px;

          line-height:
            1.2;

          white-space:
            nowrap;
        }


        .sidebar-brand-subtitle {
          margin-top:
            4px;

          color:
            #71839f;

          font-size:
            8px;

          font-weight:
            700;

          letter-spacing:
            1.25px;

          text-transform:
            uppercase;

          white-space:
            nowrap;
        }


        /* =====================================================
           SIDEBAR NAVIGATION SCROLL

           Only navigation itself scrolls when needed.
           Footer always remains at bottom.
        ===================================================== */

        .sidebar-scroll {
          flex:
            1 1 auto;

          min-height: 0;

          position: relative;
          z-index: 2;

          overflow-y: auto;
          overflow-x: hidden;

          padding:
            14px 10px 16px;

          overscroll-behavior:
            contain;
        }


        /* =====================================================
           SIDEBAR SCROLLBAR
        ===================================================== */

        .sidebar-scroll {
          scrollbar-width:
            thin;

          scrollbar-color:
            rgba(
              255,
              255,
              255,
              0.13
            )
            transparent;
        }


        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }


        .sidebar-scroll::-webkit-scrollbar-track {
          background:
            transparent;
        }


        .sidebar-scroll::-webkit-scrollbar-thumb {
          border-radius:
            10px;

          background:
            rgba(
              255,
              255,
              255,
              0.13
            );
        }


        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background:
            rgba(
              255,
              255,
              255,
              0.22
            );
        }


        /* =====================================================
           SIDEBAR GROUP
        ===================================================== */

        .sidebar-group {
          margin-bottom:
            20px;

          animation:
            sidebarGroupEnter
            0.4s ease
            both;
        }


        @keyframes sidebarGroupEnter {

          from {
            opacity: 0;

            transform:
              translateX(-8px);
          }

          to {
            opacity: 1;

            transform:
              translateX(0);
          }

        }


        .sidebar-section-label {
          min-height:
            27px;

          display: flex;
          align-items: center;

          padding:
            0 10px;

          margin-bottom:
            4px;

          color:
            #667a99;

          font-size:
            9px;

          font-weight:
            700;

          letter-spacing:
            1.5px;

          text-transform:
            uppercase;
        }


        /* =====================================================
           SIDEBAR LINKS
        ===================================================== */

        .sidebar-link {
          position:
            relative;

          min-height:
            42px;

          display:
            flex;

          align-items:
            center;

          gap:
            9px;

          padding:
            6px 9px;

          margin-bottom:
            3px;

          border-radius:
            10px;

          color:
            #c7d1df;

          font-size:
            13px;

          font-weight:
            500;

          text-decoration:
            none;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }


        .sidebar-link:hover {
          color:
            #ffffff;

          background:
            rgba(
              255,
              255,
              255,
              0.055
            );

          transform:
            translateX(3px);
        }


        /* =====================================================
           SIDEBAR ICON
        ===================================================== */

        .sidebar-link-icon {
          width:
            30px;

          height:
            30px;

          flex:
            0 0 30px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            8px;

          color:
            #8fa5c2;

          background:
            rgba(
              255,
              255,
              255,
              0.035
            );

          transition:
            all 0.2s ease;
        }


        .sidebar-link-icon i {
          font-size:
            13px;
        }


        .sidebar-link-text {
          flex:
            1 1 auto;

          min-width:
            0;

          white-space:
            nowrap;
        }


        /* =====================================================
           ACTIVE SIDEBAR LINK
        ===================================================== */

        .sidebar-link.active {
          color:
            #ffffff;

          background:
            linear-gradient(
              100deg,
              #176ee8 0%,
              #248cff 100%
            );

          box-shadow:
            0 6px 17px
            rgba(
              26,
              109,
              227,
              0.24
            );
        }


        .sidebar-link.active
        .sidebar-link-icon {
          color:
            #ffffff;

          background:
            rgba(
              255,
              255,
              255,
              0.14
            );
        }


        .sidebar-link.active:hover {
          transform:
            none;
        }


        .sidebar-active-dot {
          width:
            4px;

          height:
            4px;

          flex:
            0 0 4px;

          margin-left:
            auto;

          border-radius:
            50%;

          opacity:
            0;

          background:
            #ffffff;

          transform:
            scale(0);

          transition:
            all 0.2s ease;
        }


        .sidebar-link.active
        .sidebar-active-dot {
          opacity:
            0.9;

          transform:
            scale(1);
        }


        /* =====================================================
           SIDEBAR FOOTER

           Always remains at bottom.
        ===================================================== */

        .sidebar-footer {
          height:
            60px;

          min-height:
            60px;

          flex:
            0 0 60px;

          position:
            relative;

          z-index:
            2;

          display:
            flex;

          align-items:
            center;

          gap:
            9px;

          padding:
            10px 17px;

          border-top:
            1px solid
            rgba(
              255,
              255,
              255,
              0.065
            );

          background:
            rgba(
              0,
              0,
              0,
              0.08
            );
        }


        .sidebar-footer-dot {
          width:
            7px;

          height:
            7px;

          flex:
            0 0 7px;

          border-radius:
            50%;

          background:
            #32cf7b;

          animation:
            securePulse
            2.2s infinite;
        }


        @keyframes securePulse {

          0% {
            box-shadow:
              0 0 0 0
              rgba(
                50,
                207,
                123,
                0.45
              );
          }

          70% {
            box-shadow:
              0 0 0 7px
              rgba(
                50,
                207,
                123,
                0
              );
          }

          100% {
            box-shadow:
              0 0 0 0
              rgba(
                50,
                207,
                123,
                0
              );
          }

        }


        .sidebar-footer-title {
          color:
            #aebbd0;

          font-size:
            10px;

          font-weight:
            600;
        }


        .sidebar-footer-text {
          margin-top:
            2px;

          color:
            #63758e;

          font-size:
            8px;
        }


        /* =====================================================
           MAIN APPLICATION AREA

           IMPORTANT:
           Full viewport height.
           Main does NOT allow body/document scrolling.
        ===================================================== */

        .app-main {
          flex:
            1 1 auto;

          min-width:
            0;

          height:
            100vh;

          max-height:
            100vh;

          display:
            flex;

          flex-direction:
            column;

          overflow:
            hidden;

          background:
            #f4f7fb;
        }


        /* =====================================================
           TOPBAR

           Topbar no longer needs sticky because
           content below it scrolls independently.
        ===================================================== */

        .topbar {
          width:
            100%;

          height:
            74px;

          min-height:
            74px;

          flex:
            0 0 74px;

          position:
            relative;

          z-index:
            1020;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          padding:
            0 22px;

          background:
            rgba(
              255,
              255,
              255,
              0.98
            );

          backdrop-filter:
            blur(12px);

          -webkit-backdrop-filter:
            blur(12px);

          border-bottom:
            1px solid
            #e6ebf1;

          box-shadow:
            0 1px 4px
            rgba(
              15,
              23,
              42,
              0.025
            );
        }


        /* =====================================================
           TOPBAR LEFT
        ===================================================== */

        .topbar-left {
          min-width:
            0;

          display:
            flex;

          align-items:
            center;

          gap:
            12px;
        }


        .topbar-product-title {
          color:
            #14233a;

          font-size:
            15px;

          font-weight:
            700;

          letter-spacing:
            -0.1px;
        }


        .topbar-product-subtitle {
          margin-top:
            2px;

          color:
            #8c99aa;

          font-size:
            10px;

          font-weight:
            500;
        }


        /* =====================================================
           MOBILE MENU BUTTON
        ===================================================== */

        .mobile-menu-btn {
          width:
            40px;

          height:
            40px;

          padding:
            0;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            10px !important;

          color:
            #334155 !important;

          background:
            #f8fafc !important;

          border:
            1px solid
            #e3e8ef !important;
        }


        .mobile-menu-btn:hover {
          color:
            #176ee8 !important;

          background:
            #eef5ff !important;
        }


        /* =====================================================
           USER AREA
        ===================================================== */

        .topbar-user-area {
          display:
            flex;

          align-items:
            center;

          gap:
            11px;
        }


        .topbar-user-details {
          text-align:
            right;

          line-height:
            1.1;
        }


        .topbar-user-name {
          color:
            #172438;

          font-size:
            12px;

          font-weight:
            700;
        }


        .topbar-user-role {
          margin-top:
            5px;

          color:
            #8997a8;

          font-size:
            10px;
        }


        /* =====================================================
           USER AVATAR
        ===================================================== */

        .user-avatar {
          width:
            39px;

          height:
            39px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            12px;

          color:
            #176fe6;

          font-size:
            13px;

          font-weight:
            700;

          background:
            linear-gradient(
              145deg,
              #edf4ff,
              #e1ecff
            );

          border:
            1px solid
            #dbe7f8;

          transition:
            transform
            0.2s ease,
            box-shadow
            0.2s ease;
        }


        .user-avatar:hover {
          transform:
            translateY(-1px);

          box-shadow:
            0 5px 12px
            rgba(
              34,
              92,
              170,
              0.13
            );
        }


        /* =====================================================
           LOGOUT
        ===================================================== */

        .topbar-logout {
          width:
            38px;

          height:
            38px;

          padding:
            0;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            10px !important;

          color:
            #64748b !important;

          background:
            #ffffff !important;

          border:
            1px solid
            #dce3eb !important;

          transition:
            all
            0.2s ease;
        }


        .topbar-logout:hover {
          color:
            #dc3545 !important;

          background:
            #fff5f6 !important;

          border-color:
            #efc0c4 !important;

          transform:
            translateY(-1px);
        }


        /* =====================================================
           CONTENT AREA

           THIS AREA ALONE SCROLLS.

           Sidebar and top navbar always stay visible.
        ===================================================== */

        .content-area {
          flex:
            1 1 auto;

          min-height:
            0;

          width:
            100%;

          overflow-y:
            auto;

          overflow-x:
            hidden;

          overscroll-behavior:
            contain;

          padding:
            22px 24px 32px;

          background:
            #f4f7fb;

          scrollbar-width:
            thin;

          scrollbar-color:
            #b8c3d1
            transparent;
        }


        /* =====================================================
           CONTENT SCROLLBAR
        ===================================================== */

        .content-area::-webkit-scrollbar {
          width:
            7px;
        }


        .content-area::-webkit-scrollbar-track {
          background:
            transparent;
        }


        .content-area::-webkit-scrollbar-thumb {
          border-radius:
            10px;

          background:
            #c3ccd8;
        }


        .content-area::-webkit-scrollbar-thumb:hover {
          background:
            #9caabb;
        }


        /* =====================================================
           CONTENT INNER
        ===================================================== */

        .content-inner {
          width:
            100%;

          max-width:
            none !important;

          min-width:
            0;

          margin:
            0;

          padding:
            0;
        }


        /* =====================================================
           REMOVE OLD CONTAINER WIDTH LIMITS
        ===================================================== */

        .content-inner
        > .container,

        .content-inner
        > .container-fluid {
          width:
            100% !important;

          max-width:
            none !important;
        }


        /* =====================================================
           MOBILE SIDEBAR
        ===================================================== */

        .sidebar-mobile {
          width:
            100%;

          height:
            100vh;
        }


        .tv-mobile-offcanvas {
          border-right:
            0 !important;

          background:
            #0d1728 !important;
        }


        .tv-mobile-offcanvas
        .offcanvas-header {
          background:
            #0d1728;

          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              0.06
            );
        }


        .tv-mobile-offcanvas
        .offcanvas-body {
          height:
            100%;

          padding:
            0;

          overflow:
            hidden;

          background:
            #0d1728;
        }


        /* =====================================================
           MEDIUM DESKTOP
        ===================================================== */

        @media (
          max-width:
            1199.98px
        ) {

          .sidebar-wrap {
            width:
              235px;

            min-width:
              235px;

            flex-basis:
              235px;
          }


          .sidebar-brand {
            padding:
              0 14px;
          }


          .content-area {
            padding:
              20px;
          }

        }


        /* =====================================================
           TABLET / MOBILE

           Desktop sidebar disappears through Bootstrap.
           Main becomes full width.
        ===================================================== */

        @media (
          max-width:
            991.98px
        ) {

          .app-shell {
            width:
              100%;

            height:
              100vh;
          }


          .app-main {
            width:
              100%;

            height:
              100vh;
          }


          .topbar {
            height:
              66px;

            min-height:
              66px;

            flex-basis:
              66px;

            padding:
              0 14px;
          }


          .content-area {
            padding:
              17px;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (
          max-width:
            575.98px
        ) {

          .topbar {
            padding:
              0 10px;
          }


          .topbar-user-area {
            gap:
              7px;
          }


          .user-avatar {
            width:
              36px;

            height:
              36px;

            border-radius:
              10px;
          }


          .topbar-logout {
            width:
              36px;

            height:
              36px;
          }


          .content-area {
            padding:
              14px 12px 24px;
          }

        }


        /* =====================================================
           LARGE SCREENS
        ===================================================== */

        @media (
          min-width:
            1600px
        ) {

          .content-area {
            padding-left:
              30px;

            padding-right:
              30px;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (
          prefers-reduced-motion:
            reduce
        ) {

          .sidebar-group,
          .sidebar-footer-dot {
            animation:
              none !important;
          }


          .sidebar-link,
          .sidebar-link-icon,
          .sidebar-logo,
          .user-avatar,
          .topbar-logout {
            transition:
              none !important;
          }

        }

        `}
      </style>


      {/* =================================================
          APPLICATION SHELL
      ================================================= */}

      <div className="app-shell">

        {/* =================================================
            DESKTOP SIDEBAR
        ================================================= */}

        <aside className="d-none d-lg-block sidebar-wrap">

          <Sidebar />

        </aside>


        {/* =================================================
            MOBILE SIDEBAR
        ================================================= */}

        <Offcanvas
          show={
            showMenu
          }

          onHide={() =>
            setShowMenu(
              false
            )
          }

          placement="start"

          className="d-lg-none tv-mobile-offcanvas"

          style={{
            width: 285
          }}
        >

          <Offcanvas.Body>

            <Sidebar
              mobile

              onNavigate={() =>
                setShowMenu(
                  false
                )
              }
            />

          </Offcanvas.Body>

        </Offcanvas>


        {/* =================================================
            MAIN
        ================================================= */}

        <div className="app-main">

          {/* =================================================
              TOP NAVBAR
          ================================================= */}

          <header className="topbar">

            {/* LEFT */}

            <div className="topbar-left">

              <Button
                variant="light"

                className="d-lg-none mobile-menu-btn"

                onClick={() =>
                  setShowMenu(
                    true
                  )
                }
              >

                <i className="bi bi-list fs-5" />

              </Button>


              <div>

                <div className="topbar-product-title">
                  Procurement Portal
                </div>

                <div className="topbar-product-subtitle d-none d-sm-block">
                  Purchase Order Management
                </div>

              </div>

            </div>


            {/* =================================================
                USER
            ================================================= */}

            <div className="topbar-user-area">

              <div className="topbar-user-details d-none d-sm-block">

                <div className="topbar-user-name">

                  {user?.name ||
                    user?.userId ||
                    "User"}

                </div>

                <div className="topbar-user-role">

                  {user?.role
                    ?.name ||
                    user?.roleName ||
                    "User"}

                </div>

              </div>


              {/* AVATAR */}

              <div
                className="user-avatar"

                title={
                  user?.name ||
                  user?.userId ||
                  "User"
                }
              >

                {userInitial}

              </div>


              {/* LOGOUT */}

              <Button
                variant="outline-secondary"

                className="topbar-logout"

                onClick={
                  handleLogout
                }

                title="Logout"
              >

                <i className="bi bi-box-arrow-right" />

              </Button>

            </div>

          </header>


          {/* =================================================
              SCROLLABLE PAGE CONTENT

              ONLY THIS PART SCROLLS
          ================================================= */}

          <main className="content-area">

            <div className="content-inner">

              <Outlet />

            </div>

          </main>

        </div>

      </div>
    </>
  );
}