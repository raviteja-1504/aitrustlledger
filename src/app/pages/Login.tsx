import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { School, Loader2 } from "lucide-react";
import { useAuth } from "../../lib/auth/AuthContext";
import type { Role } from "../../lib/types";

const activeDemoRoles: Array<{ value: Role; label: string }> = [
  { value: "super_admin", label: "Super Admin" },
  { value: "school_admin", label: "School Admin" },
];

/**
 * Mock login form. Backend integration will replace the handleSubmit
 * with a POST /auth/login that sets an httpOnly cookie.
 */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("school_admin");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(role);
      navigate("/", { replace: true });
    }, 500);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#00897B] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-[#1a1d24]"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1A237E]">
            <School className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#1A237E] dark:text-white">School CRM</h1>
            <p className="text-xs text-gray-500">Secure login</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              required
              defaultValue="admin@meridian.edu"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#00897B] focus:ring-2 focus:ring-[#00897B]/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              required
              defaultValue="••••••••"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#00897B] focus:ring-2 focus:ring-[#00897B]/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Role (demo)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#00897B] dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              {activeDemoRoles.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A237E] py-2.5 text-sm font-medium text-white transition hover:bg-[#283593] disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Demo mode • Select an admin role to explore
        </p>
      </motion.div>
    </div>
  );
}
