import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import type { Permission } from "../types";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  permission?: Permission;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  permission,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, can } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }
  if (permission && !can(permission)) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
}
