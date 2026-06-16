import { useState } from "react";
import { ChevronDown, LogOut, Shield } from "lucide-react";
import { useAuth } from "../../lib/auth/AuthContext";
import type { Role } from "../../lib/types";

const roleLabels: Record<Role, string> = {
  super_admin: "Super Admin",
  school_admin: "School Admin",
  teacher: "Teacher",
  accountant: "Accountant",
  admissions_officer: "Admissions Officer",
  parent: "Parent",
};

const activeDemoRoles: Role[] = ["super_admin", "school_admin"];

/**
 * Topbar user menu with avatar, name, role switcher (dev only), logout.
 * The role switcher will be removed once real auth lands.
 */
export default function UserMenu() {
  const { user, switchRole, logout } = useAuth();
  const [open, setOpen] = useState(false);
  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-white/90 transition hover:bg-white/10"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00897B] font-semibold text-white">
          {initials}
        </div>
        <div className="hidden text-left md:block">
          <div className="text-sm font-medium text-white">{user.name}</div>
          <div className="text-xs text-white/60">{roleLabels[user.role]}</div>
        </div>
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <>
          <button className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-[#1a1d24] dark:ring-white/10">
            <div className="border-b border-gray-100 px-4 py-3 dark:border-white/10">
              <div className="text-sm font-medium text-[#1A237E] dark:text-white">{user.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
            </div>
            <div className="px-2 py-2">
              <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <Shield className="h-3 w-3" /> Switch role (dev)
              </div>
              {activeDemoRoles.map((r) => (
                <button
                  key={r}
                  onClick={() => { switchRole(r); setOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition hover:bg-[#E3F2FD] dark:hover:bg-white/5 ${
                    user.role === r ? "text-[#00897B] font-medium" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <span>{roleLabels[r]}</span>
                  {user.role === r && <span className="text-xs">●</span>}
                </button>
              ))}
            </div>
            <div className="border-t border-gray-100 p-2 dark:border-white/10">
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-[#EF5350] transition hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
