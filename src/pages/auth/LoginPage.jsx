import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Spinner
} from "react-bootstrap";

import {
  Navigate,
  useLocation,
  useNavigate
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getApiError } from "../../utils/error";

export default function LoginPage() {
  const [form, setForm] = useState({
    userId: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    login,
    isAuthenticated
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  async function submit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(form);

      navigate(
        location.state?.from ||
          "/dashboard",
        {
          replace: true
        }
      );
    } catch (err) {
      setError(
        getApiError(
          err,
          "Unable to sign in"
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>
        {`

        /* =====================================================
           PAGE
        ===================================================== */

        .tv-login-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          overflow: hidden;

          background:
            #f4f7fa;
        }


        /* =====================================================
           LEFT INDUSTRIAL PANEL
        ===================================================== */

        .tv-login-left {
          width: 56%;
          min-height: 100vh;

          position: relative;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 60px;

          color: #fff;

          overflow: hidden;

          background:
            linear-gradient(
              135deg,
              #051521 0%,
              #08283e 45%,
              #0d3b59 100%
            );
        }


        /* =====================================================
           MOVING INDUSTRIAL GRID
        ===================================================== */

        .tv-login-grid {
          position: absolute;
          inset: -100px;

          background-image:
            linear-gradient(
              rgba(255,255,255,0.045) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.045) 1px,
              transparent 1px
            );

          background-size:
            46px 46px;

          animation:
            gridMove
            14s linear infinite;

          opacity: 0.7;
        }

        @keyframes gridMove {
          from {
            transform:
              translate(0, 0);
          }

          to {
            transform:
              translate(46px, 46px);
          }
        }


        /* =====================================================
           BACKGROUND GLOW
        ===================================================== */

        .tv-glow-one {
          position: absolute;

          width: 500px;
          height: 500px;

          border-radius: 50%;

          right: -200px;
          top: -170px;

          background:
            rgba(
              37,
              150,
              210,
              0.16
            );

          filter:
            blur(10px);

          animation:
            glowPulse
            5s ease-in-out infinite alternate;
        }


        .tv-glow-two {
          position: absolute;

          width: 380px;
          height: 380px;

          border-radius: 50%;

          left: -160px;
          bottom: -180px;

          background:
            rgba(
              21,
              122,
              168,
              0.16
            );

          animation:
            glowPulse
            7s ease-in-out infinite alternate-reverse;
        }


        @keyframes glowPulse {
          from {
            transform:
              scale(0.9);

            opacity: 0.5;
          }

          to {
            transform:
              scale(1.15);

            opacity: 1;
          }
        }


        /* =====================================================
           AUTOMATION NODES
        ===================================================== */

        .tv-node {
          position: absolute;

          width: 8px;
          height: 8px;

          border-radius: 50%;

          background:
            #6fd0ff;

          box-shadow:
            0 0 14px
            rgba(
              111,
              208,
              255,
              0.8
            );

          animation:
            nodePulse
            2.6s ease-in-out infinite;
        }


        .tv-node-1 {
          left: 12%;
          top: 22%;
        }


        .tv-node-2 {
          right: 17%;
          top: 35%;

          animation-delay:
            0.7s;
        }


        .tv-node-3 {
          left: 24%;
          bottom: 19%;

          animation-delay:
            1.3s;
        }


        @keyframes nodePulse {
          0%,
          100% {
            transform:
              scale(1);

            opacity: 0.45;
          }

          50% {
            transform:
              scale(1.7);

            opacity: 1;
          }
        }


        /* =====================================================
           SCAN LINE
        ===================================================== */

        .tv-scan-line {
          position: absolute;

          left: 0;
          right: 0;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(
                94,
                202,
                255,
                0.5
              ),
              transparent
            );

          animation:
            scanMove
            6s linear infinite;
        }


        @keyframes scanMove {
          from {
            top: 0%;
          }

          to {
            top: 100%;
          }
        }


        /* =====================================================
           LEFT CONTENT
        ===================================================== */

        .tv-login-content {
          width: 100%;
          max-width: 570px;

          position: relative;
          z-index: 4;

          animation:
            contentEnter
            0.8s ease-out;
        }


        @keyframes contentEnter {
          from {
            opacity: 0;

            transform:
              translateX(-28px);
          }

          to {
            opacity: 1;

            transform:
              translateX(0);
          }
        }


        /* =====================================================
           BRAND
        ===================================================== */

        .tv-brand {
          display: flex;
          align-items: center;

          gap: 14px;

          margin-bottom: 55px;
        }


        .tv-brand-icon {
          width: 54px;
          height: 54px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          font-size: 25px;

          background:
            rgba(
              255,
              255,
              255,
              0.09
            );

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.17
            );

          backdrop-filter:
            blur(8px);

          animation:
            iconFloat
            4s ease-in-out infinite;
        }


        @keyframes iconFloat {
          0%,
          100% {
            transform:
              translateY(0);
          }

          50% {
            transform:
              translateY(-5px);
          }
        }


        .tv-brand-company {
          font-size: 19px;

          font-weight: 700;

          letter-spacing: 0.4px;
        }


        .tv-brand-type {
          margin-top: 2px;

          font-size: 10px;

          letter-spacing: 1.8px;

          text-transform: uppercase;

          color:
            rgba(
              255,
              255,
              255,
              0.58
            );
        }


        /* =====================================================
           HEADING
        ===================================================== */

        .tv-small-label {
          display: inline-block;

          margin-bottom: 15px;

          font-size: 11px;

          font-weight: 600;

          letter-spacing: 2px;

          text-transform: uppercase;

          color: #70c8f3;
        }


        .tv-login-content h1 {
          max-width: 520px;

          margin: 0 0 20px;

          font-size: 45px;

          line-height: 1.14;

          font-weight: 700;

          letter-spacing: -0.8px;
        }


        .tv-login-content p {
          max-width: 500px;

          margin: 0;

          font-size: 15px;

          line-height: 1.75;

          color:
            rgba(
              255,
              255,
              255,
              0.68
            );
        }


        /* =====================================================
           SYSTEM STATUS
        ===================================================== */

        .tv-status {
          display: inline-flex;
          align-items: center;

          gap: 10px;

          margin-top: 40px;

          padding:
            9px 13px;

          border-radius: 30px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.11
            );

          background:
            rgba(
              255,
              255,
              255,
              0.045
            );

          font-size: 12px;

          color:
            rgba(
              255,
              255,
              255,
              0.72
            );
        }


        .tv-status-dot {
          width: 8px;
          height: 8px;

          border-radius: 50%;

          background:
            #46db84;

          animation:
            statusPulse
            2s infinite;
        }


        @keyframes statusPulse {
          0% {
            box-shadow:
              0 0 0 0
              rgba(
                70,
                219,
                132,
                0.55
              );
          }

          70% {
            box-shadow:
              0 0 0 8px
              rgba(
                70,
                219,
                132,
                0
              );
          }

          100% {
            box-shadow:
              0 0 0 0
              rgba(
                70,
                219,
                132,
                0
              );
          }
        }


        /* =====================================================
           RIGHT PANEL
        ===================================================== */

        .tv-login-right {
          width: 44%;
          min-height: 100vh;

          display: flex;
          align-items: center;
          justify-content: center;

          padding:
            45px;

          position: relative;

          background:
            linear-gradient(
              145deg,
              #f8fafc,
              #eef3f7
            );
        }


        /* =====================================================
           LOGIN CARD
        ===================================================== */

        .tv-login-card {
          width: 100%;
          max-width: 425px;

          border-radius: 20px;

          overflow: hidden;

          animation:
            cardEnter
            0.75s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            );
        }


        @keyframes cardEnter {
          from {
            opacity: 0;

            transform:
              translateY(30px)
              scale(0.98);
          }

          to {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }
        }


        .tv-login-card::before {
          content: "";

          display: block;

          width: 100%;
          height: 3px;

          background:
            linear-gradient(
              90deg,
              #0870a5,
              #35a7db,
              #0870a5
            );

          background-size:
            200% 100%;

          animation:
            topLineMove
            3s linear infinite;
        }


        @keyframes topLineMove {
          from {
            background-position:
              200% 0;
          }

          to {
            background-position:
              -200% 0;
          }
        }


        .tv-company-label {
          font-size: 11px;

          font-weight: 700;

          letter-spacing: 1.5px;

          text-transform: uppercase;

          color: #137cae;
        }


        .tv-login-title {
          margin-top: 8px;

          font-size: 30px;

          font-weight: 700;

          color: #172b3d;
        }


        .tv-login-subtitle {
          margin-top: 7px;

          font-size: 14px;

          color: #788794;
        }


        /* =====================================================
           FORM
        ===================================================== */

        .tv-login-card .form-label {
          margin-bottom: 7px;

          font-size: 13px;

          font-weight: 600;

          color: #304354;
        }


        .tv-login-card .form-control {
          min-height: 49px;

          border-radius: 10px;

          border:
            1px solid #d7e0e8;

          padding:
            10px 13px;

          font-size: 14px;

          background: #fbfcfd;

          transition:
            all 0.2s ease;
        }


        .tv-login-card .form-control:focus {
          background: #fff;

          border-color:
            #268ebd;

          box-shadow:
            0 0 0 3px
            rgba(
              38,
              142,
              189,
              0.11
            );

          transform:
            translateY(-1px);
        }


        /* =====================================================
           PASSWORD FIELD
        ===================================================== */

        .tv-password-wrap {
          position: relative;
        }


        .tv-password-wrap
        .form-control {
          padding-right: 48px;
        }


        .tv-password-btn {
          position: absolute;

          top: 50%;
          right: 12px;

          transform:
            translateY(-50%);

          border: 0;

          padding: 4px;

          background: transparent;

          color: #82909c;

          cursor: pointer;
        }


        .tv-password-btn:hover {
          color: #167ea9;
        }


        /* =====================================================
           LOGIN BUTTON
        ===================================================== */

        .tv-login-button {
          position: relative;

          min-height: 49px;

          overflow: hidden;

          border: 0;

          border-radius: 10px;

          font-weight: 600;

          background:
            linear-gradient(
              90deg,
              #116f9d,
              #178bb9
            );

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }


        .tv-login-button::after {
          content: "";

          position: absolute;

          top: 0;
          left: -80%;

          width: 40%;
          height: 100%;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(
                255,
                255,
                255,
                0.25
              ),
              transparent
            );

          transform:
            skewX(-20deg);

          animation:
            buttonShine
            4s infinite;
        }


        @keyframes buttonShine {
          0%,
          65% {
            left: -80%;
          }

          100% {
            left: 130%;
          }
        }


        .tv-login-button:hover:not(:disabled) {
          transform:
            translateY(-2px);

          box-shadow:
            0 9px 24px
            rgba(
              22,
              126,
              170,
              0.22
            );
        }


        /* =====================================================
           FOOTER
        ===================================================== */

        .tv-login-footer {
          margin-top: 30px;

          text-align: center;

          font-size: 11px;

          color: #9aa5ae;
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (
          max-width: 1100px
        ) {

          .tv-login-left {
            width: 52%;

            padding: 45px;
          }

          .tv-login-right {
            width: 48%;

            padding: 35px;
          }

          .tv-login-content h1 {
            font-size: 38px;
          }
        }


        @media (
          max-width: 991.98px
        ) {

          .tv-login-left {
            display: none;
          }

          .tv-login-right {
            width: 100%;

            padding:
              35px 20px;

            background:
              linear-gradient(
                180deg,
                #eaf2f6 0%,
                #f8fafc 100%
              );
          }

          .tv-login-card {
            max-width: 450px;
          }
        }


        @media (
          max-width: 575.98px
        ) {

          .tv-login-right {
            padding:
              20px 14px;
          }

          .tv-login-card {
            border-radius: 16px;
          }

          .tv-login-card
          .card-body {
            padding:
              28px 22px !important;
          }

          .tv-login-title {
            font-size: 26px;
          }

          .tv-login-subtitle {
            font-size: 13px;
          }
        }


        /* =====================================================
           ACCESSIBILITY
        ===================================================== */

        @media (
          prefers-reduced-motion:
          reduce
        ) {

          *,
          *::before,
          *::after {
            animation:
              none !important;

            transition:
              none !important;
          }
        }

        `}
      </style>


      <div className="tv-login-page">

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="tv-login-left">

          <div className="tv-login-grid" />

          <div className="tv-glow-one" />

          <div className="tv-glow-two" />

          <div className="tv-scan-line" />

          <div className="tv-node tv-node-1" />
          <div className="tv-node tv-node-2" />
          <div className="tv-node tv-node-3" />


          <div className="tv-login-content">

            {/* BRAND */}

            <div className="tv-brand">

              <div className="tv-brand-icon">
                <i className="bi bi-cpu" />
              </div>

              <div>

                <div className="tv-brand-company">
                  ThetaVega Tech
                </div>

                <div className="tv-brand-type">
                  Industrial Automation
                </div>

              </div>

            </div>


            {/* CONTENT */}

            <div className="tv-small-label">
              Industrial Procurement Platform
            </div>

            <h1>
              ThetaVega
              <br />
              Procurement Portal
            </h1>

            <p>
              A secure procurement workspace
              for managing vendors, purchase
              orders and commercial operations
              across industrial projects.
            </p>


            <div className="tv-status">

              <span className="tv-status-dot" />

              Secure enterprise access

            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="tv-login-right">

          <Card className="tv-login-card border-0 shadow-lg">

            <Card.Body className="p-4 p-md-5">

              {/* HEADER */}

              <div className="mb-4">

                <div className="tv-company-label">
                  ThetaVega Procurement Portal
                </div>

                <h2 className="tv-login-title">
                  Welcome Back
                </h2>

                <div className="tv-login-subtitle">
                  Sign in to continue to your workspace.
                </div>

              </div>


              {/* ERROR */}

              {error && (
                <Alert
                  variant="danger"
                  className="small py-2"
                >
                  {error}
                </Alert>
              )}


              {/* FORM */}

              <Form onSubmit={submit}>

                {/* USER ID */}

                <Form.Group className="mb-3">

                  <Form.Label>
                    User ID
                  </Form.Label>

                  <Form.Control
                    type="text"

                    placeholder="Enter your user ID"

                    value={
                      form.userId
                    }

                    onChange={(e) =>
                      setForm({
                        ...form,

                        userId:
                          e.target.value
                      })
                    }

                    autoComplete="username"

                    autoFocus

                    required
                  />

                </Form.Group>


                {/* PASSWORD */}

                <Form.Group className="mb-4">

                  <Form.Label>
                    Password
                  </Form.Label>

                  <div className="tv-password-wrap">

                    <Form.Control
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }

                      placeholder="Enter your password"

                      value={
                        form.password
                      }

                      onChange={(e) =>
                        setForm({
                          ...form,

                          password:
                            e.target.value
                        })
                      }

                      autoComplete="current-password"

                      required
                    />

                    <button
                      type="button"

                      className="tv-password-btn"

                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current
                        )
                      }

                      tabIndex={-1}
                    >

                      <i
                        className={
                          showPassword
                            ? "bi bi-eye-slash"
                            : "bi bi-eye"
                        }
                      />

                    </button>

                  </div>

                </Form.Group>


                {/* SIGN IN */}

                <Button
                  type="submit"

                  className="tv-login-button w-100"

                  disabled={
                    loading
                  }
                >

                  {loading ? (
                    <>

                      <Spinner
                        size="sm"
                        className="me-2"
                      />

                      Signing in...

                    </>
                  ) : (
                    <>

                      Sign In

                      <i className="bi bi-arrow-right ms-2" />

                    </>
                  )}

                </Button>

              </Form>


              {/* FOOTER */}

              <div className="tv-login-footer">

                © 2026 ThetaVega Tech · Industrial Automation

              </div>

            </Card.Body>

          </Card>

        </div>

      </div>
    </>
  );
}