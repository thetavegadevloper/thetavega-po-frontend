import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useQueryClient,
} from "@tanstack/react-query";

import {
  authApi,
} from "../api/authApi";

const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  const queryClient =
    useQueryClient();

  const [
    token,
    setToken,
  ] = useState(() =>
    localStorage.getItem(
      "po_access_token"
    )
  );

  const [
    user,
    setUser,
  ] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem(
            "po_user"
          )
        ) ||
        null
      );
    } catch {
      return null;
    }
  });

  // =====================================================
  // LOGOUT
  // =====================================================
  const logout =
    useCallback(() => {
      localStorage.removeItem(
        "po_access_token"
      );

      localStorage.removeItem(
        "po_user"
      );

      setToken(null);
      setUser(null);

      queryClient.clear();
    }, [
      queryClient,
    ]);

  // =====================================================
  // LOGIN
  // =====================================================
  const login =
    useCallback(
      async (
        credentials
      ) => {
        const result =
          await authApi.login(
            credentials
          );

        localStorage.setItem(
          "po_access_token",
          result.token
        );

        localStorage.setItem(
          "po_user",
          JSON.stringify(
            result.user
          )
        );

        setToken(
          result.token
        );

        setUser(
          result.user
        );

        return result.user;
      },
      []
    );

  // =====================================================
  // REFRESH CURRENT USER
  // =====================================================
  const refreshMe =
    useCallback(
      async () => {
        const currentToken =
          localStorage.getItem(
            "po_access_token"
          );

        if (!currentToken) {
          return null;
        }

        const result =
          await authApi.me();

        const current =
          result.user;

        localStorage.setItem(
          "po_user",
          JSON.stringify(
            current
          )
        );

        setUser(
          current
        );

        return current;
      },
      []
    );

  // =====================================================
  // IMPORTANT:
  //
  // REFRESH USER FROM BACKEND ON APP LOAD
  //
  // This prevents old Role / Permissions / ApprovalLevel
  // remaining in browser localStorage.
  // =====================================================
  useEffect(() => {
    if (!token) {
      return;
    }

    refreshMe().catch(
      (error) => {
        console.error(
          "[AUTH] Unable to refresh current user:",
          error
        );
      }
    );
  }, [
    token,
    refreshMe,
  ]);

  // =====================================================
  // AUTH EXPIRED
  // =====================================================
  useEffect(() => {
    const handler = () =>
      logout();

    window.addEventListener(
      "po-auth-expired",
      handler
    );

    return () =>
      window.removeEventListener(
        "po-auth-expired",
        handler
      );
  }, [
    logout,
  ]);

  // =====================================================
  // PERMISSIONS
  // =====================================================
  const permissions =
    useMemo(
      () =>
        user?.role?.permissions ||
        user?.permissions ||
        [],
      [
        user,
      ]
    );

  // =====================================================
  // APPROVAL LEVEL
  // =====================================================
  const approvalLevel =
    useMemo(() => {
      const level =
        String(
          user?.approvalLevel ||
          "L3"
        )
          .trim()
          .toUpperCase();

      return [
        "L1",
        "L2",
        "L3",
      ].includes(
        level
      )
        ? level
        : "L3";
    }, [
      user,
    ]);

  // =====================================================
  // FINAL APPROVER
  // =====================================================
  const isFinalApprover =
    approvalLevel === "L1" ||
    approvalLevel === "L2";

  // =====================================================
  // PERMISSION CHECK
  // =====================================================
  const can =
    useCallback(
      (
        ...required
      ) =>
        permissions.includes(
          "*"
        ) ||
        required.some(
          (
            permission
          ) =>
            permissions.includes(
              permission
            )
        ),
      [
        permissions,
      ]
    );

  // =====================================================
  // VALUE
  // =====================================================
  const value =
    useMemo(
      () => ({
        token,

        user,

        permissions,

        approvalLevel,

        isFinalApprover,

        isAuthenticated:
          Boolean(
            token
          ),

        login,

        logout,

        can,

        refreshMe,
      }),
      [
        token,
        user,
        permissions,
        approvalLevel,
        isFinalApprover,
        login,
        logout,
        can,
        refreshMe,
      ]
    );

  return (
    <AuthContext.Provider
      value={
        value
      }
    >

      {children}

    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value =
    useContext(
      AuthContext
    );

  if (!value) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return value;
}