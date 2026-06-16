import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Permission, Role, User } from "../types";
import { authorize, type AuthCtx } from "../rbac";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: Role) => void; // mock — swap for real API later
  logout: () => void;
  /**
   * Check whether the current user can perform `permission`. Pass `ctx` to
   * apply attribute-aware rules (e.g., teacher can only write marks for their
   * own classes).
   */
  can: (permission: Permission, ctx?: AuthCtx) => boolean;
  switchRole: (role: Role) => void; // dev convenience; remove in prod
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Default mock user — Super Admin so devs see everything.
// Replace with a real /auth/me call when backend lands.
const mockUsers: Record<Role, User> = {
  super_admin: { id: "u_sa", tenantId: "t_meridian", name: "Priya Sharma", email: "priya@meridian.edu", role: "super_admin" },
  school_admin: { id: "u_ad", tenantId: "t_meridian", name: "Rajesh Iyer", email: "rajesh@meridian.edu", role: "school_admin" },
  teacher: {
    id: "u_tc",
    tenantId: "t_meridian",
    name: "Anita Rao",
    email: "anita@meridian.edu",
    role: "teacher",
    scope: {
      // Classes for which Anita is the class-teacher (can mark attendance).
      classIds: ["8-A", "9-A"],
      // Subject assignments (can enter marks). A single teacher can teach
      // the same subject in multiple classes; a class can have multiple
      // subject teachers for different subjects.
      assignments: [
        { classId: "8-A", subject: "Math" },
        { classId: "9-A", subject: "Math" },
        { classId: "8-B", subject: "Math" }, // teaches Math in 8-B but isn't class teacher
      ],
    },
  },
  accountant: { id: "u_ac", tenantId: "t_meridian", name: "Suresh Patel", email: "suresh@meridian.edu", role: "accountant" },
  admissions_officer: { id: "u_ao", tenantId: "t_meridian", name: "Neha Gupta", email: "neha@meridian.edu", role: "admissions_officer" },
  parent: { id: "u_pr", tenantId: "t_meridian", name: "Vikram Singh", email: "vikram@home.com", role: "parent", scope: { studentIds: ["s_1001"] } },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUsers.super_admin);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login: (role) => setUser(mockUsers[role]),
      logout: () => setUser(null),
      can: (permission, ctx) => (user ? authorize(user, permission, ctx) : false),
      switchRole: (role) => setUser(mockUsers[role]),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
