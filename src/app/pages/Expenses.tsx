import { motion } from "motion/react";
// Charts removed — simplified to monthly summary
import { Plus } from "lucide-react";
import PageHeader, { PageShell } from "../components/PageHeader";
import BentoCard from "../components/BentoCard";
import { Can } from "../../lib/auth/Can";

const thisMonthTotal = 272500;
const lastMonthTotal = 310000;
const monthDelta = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1);

const byCategory = [
  { category: "Salaries",      amount: 185000, color: "bg-indigo-500" },
  { category: "Utilities",     amount: 38000,  color: "bg-emerald-500" },
  { category: "Maintenance",   amount: 22000,  color: "bg-amber-500" },
  { category: "Transport",     amount: 18000,  color: "bg-sky-500" },
  { category: "Books & Library", amount: 9500, color: "bg-rose-500" },
];

const recent = [
  { date: "23 Apr", vendor: "BEST Electricity", category: "Utilities",  amount: 28400, paidBy: "Bank" },
  { date: "22 Apr", vendor: "Crompton Repairs", category: "Maintenance", amount: 6500, paidBy: "Cash" },
  { date: "20 Apr", vendor: "Sharma Stationery", category: "Supplies",   amount: 4200, paidBy: "UPI" },
  { date: "18 Apr", vendor: "Metro Transport", category: "Transport",   amount: 18000, paidBy: "Bank" },
  { date: "15 Apr", vendor: "Payroll April",   category: "Salaries",    amount: 185000, paidBy: "Bank" },
];

export default function Expenses() {
  const totalMonth = byCategory.reduce((a, c) => a + c.amount, 0);

  return (
    <PageShell>
      <PageHeader
        title="Expenses"
        subtitle="School expenditure — monthly budget vs. actual with category breakdown"
        actions={
          <Can permission="expenses.write">
            <button className="flex items-center gap-2 rounded-lg bg-[#1A237E] px-3 py-2 text-sm font-medium text-white hover:bg-[#283593]">
              <Plus className="h-4 w-4" /> Add Expense
            </button>
          </Can>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Total Monthly Expense */}
        <BentoCard className="col-span-12 lg:col-span-8">
          <h2 className="mb-4 text-lg font-semibold text-[#1A237E]">Monthly Expense Summary</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <p className="text-xs text-gray-500 mb-1">This Month</p>
              <p className="text-3xl font-bold text-[#1A237E]">{`₹${thisMonthTotal.toLocaleString("en-IN")}`}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <p className="text-xs text-gray-500 mb-1">Last Month</p>
              <p className="text-3xl font-bold text-gray-500">{`₹${lastMonthTotal.toLocaleString("en-IN")}`}</p>
              <p className={`mt-1 text-sm font-medium ${Number(monthDelta) <= 0 ? 'text-[#4CAF50]' : 'text-[#EF5350]'}`}>
                {Number(monthDelta) <= 0 ? '↓' : '↑'} {Math.abs(Number(monthDelta))}% vs previous month
              </p>
            </div>
          </div>
        </BentoCard>

        <BentoCard className="col-span-12 lg:col-span-4">
          <h2 className="mb-4 text-lg font-semibold text-[#1A237E] dark:text-white">This month by category</h2>
          <div className="space-y-3">
            {byCategory.map((c, i) => {
              const pct = (c.amount / totalMonth) * 100;
              return (
                <motion.div key={c.category} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-gray-700 dark:text-gray-300">{c.category}</span>
                    <span className="font-semibold text-[#1A237E] dark:text-white">₹{c.amount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                    <div className={`h-full rounded-full ${c.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4 border-t border-gray-100 pt-3 text-sm dark:border-white/10">
            <div className="flex justify-between">
              <span className="text-gray-500">Total</span>
              <span className="font-semibold text-[#1A237E] dark:text-white">₹{totalMonth.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </BentoCard>

        <BentoCard padding={false} className="col-span-12">
          <div className="border-b border-gray-100 px-6 py-4 dark:border-white/10">
            <h2 className="text-lg font-semibold text-[#1A237E] dark:text-white">Recent Expenses</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                {["Date","Vendor","Category","Amount","Paid By"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
              {recent.map((r, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 text-gray-600">{r.date}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{r.vendor}</td>
                  <td className="px-4 py-3 text-gray-600">{r.category}</td>
                  <td className="px-4 py-3 font-semibold text-[#1A237E] dark:text-white">₹{r.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-white/10">{r.paidBy}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </BentoCard>
      </div>
    </PageShell>
  );
}
