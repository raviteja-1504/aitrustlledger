import { useState } from "react";
import { motion } from "motion/react";
import { Award, CheckCircle2, Clock, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import PageHeader, { PageShell } from "../components/PageHeader";
import BentoCard from "../components/BentoCard";
import FormModal, { Field, inputClass } from "../components/FormModal";
import { Can } from "../../lib/auth/Can";

interface Scholarship {
  id: string; student: string; grade: string; type: "Merit" | "Sports" | "Need-based" | "Staff";
  percent: number; amount: number; status: "Approved" | "Pending" | "Rejected"; approver?: string;
}

const rows: Scholarship[] = [
  { id: "1", student: "Aarav Mehta",   grade: "9-A",  type: "Merit",      percent: 50, amount: 32500, status: "Approved", approver: "Principal" },
  { id: "2", student: "Diya Sharma",   grade: "10-B", type: "Sports",     percent: 30, amount: 22500, status: "Approved", approver: "Principal" },
  { id: "3", student: "Kabir Khan",    grade: "8-A",  type: "Need-based", percent: 75, amount: 41250, status: "Pending" },
  { id: "4", student: "Isha Patel",    grade: "11-A", type: "Merit",      percent: 100, amount: 78000, status: "Approved", approver: "Trust Board" },
  { id: "5", student: "Rohan Das",     grade: "7-B",  type: "Staff",      percent: 50, amount: 27500, status: "Approved" },
  { id: "6", student: "Saanvi Iyer",   grade: "12-A", type: "Merit",      percent: 25, amount: 19500, status: "Pending" },
];

const typeColors: Record<Scholarship["type"], string> = {
  Merit:       "bg-indigo-50 text-indigo-700",
  Sports:      "bg-emerald-50 text-emerald-700",
  "Need-based":"bg-rose-50 text-rose-700",
  Staff:       "bg-amber-50 text-amber-700",
};
const statusColors: Record<Scholarship["status"], string> = {
  Approved: "bg-green-100 text-green-700",
  Pending:  "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-700",
};

const blankConcession = { student: "", grade: "8-A", type: "Merit" as Scholarship["type"], percent: "25", reason: "" };
const BASE_FEE_FOR_DEMO = 65000;

export default function Scholarships() {
  const [list, setList] = useState<Scholarship[]>(rows);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(blankConcession);

  const approved = list.filter((r) => r.status === "Approved");
  const totalImpact = approved.reduce((a, r) => a + r.amount, 0);

  const handleCreate = () => {
    const pct = Math.max(0, Math.min(100, Number(draft.percent)));
    const created: Scholarship = {
      id: `sc-${Date.now()}`,
      student: draft.student.trim(),
      grade: draft.grade,
      type: draft.type,
      percent: pct,
      amount: Math.round((pct / 100) * BASE_FEE_FOR_DEMO),
      status: "Pending",
    };
    setList((xs) => [created, ...xs]);
    setDraft(blankConcession);
    setOpen(false);
    toast.success(`Concession requested for ${created.student} (pending approval)`);
  };

  return (
    <PageShell>
      <PageHeader
        title="Scholarships & Concessions"
        subtitle="Approve discounts and track their impact on fee collections"
        actions={
          <Can permission="scholarships.write">
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg bg-[#1A237E] px-3 py-2 text-sm font-medium text-white hover:bg-[#283593]"
            >
              + New Concession
            </button>
          </Can>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat icon={Award}        tone="bg-indigo-50 text-indigo-600"   label="Total Recipients" value={String(list.length)} />
        <Stat icon={CheckCircle2} tone="bg-emerald-50 text-emerald-600" label="Approved"         value={String(approved.length)} />
        <Stat icon={Clock}        tone="bg-amber-50 text-amber-600"     label="Pending"          value={String(list.filter((r) => r.status === "Pending").length)} />
        <Stat icon={TrendingDown} tone="bg-rose-50 text-rose-600"       label="Collection Impact" value={`₹${(totalImpact / 1000).toFixed(0)}k`} />
      </div>

      <BentoCard padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                {["Student","Class","Type","%","Amount","Status","Approver"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
              {list.map((r, i) => (
                <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{r.student}</td>
                  <td className="px-4 py-3 text-gray-600">{r.grade}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[r.type]}`}>{r.type}</span></td>
                  <td className="px-4 py-3 text-gray-700">{r.percent}%</td>
                  <td className="px-4 py-3 font-semibold text-[#1A237E] dark:text-white">₹{r.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[r.status]}`}>{r.status}</span></td>
                  <td className="px-4 py-3 text-gray-500">{r.approver ?? "—"}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </BentoCard>

      <FormModal
        open={open}
        onClose={() => setOpen(false)}
        title="New Concession / Scholarship"
        subtitle="New concessions start as Pending until approved"
        submitLabel="Submit for Approval"
        onSubmit={handleCreate}
        submitDisabled={!draft.student.trim() || !draft.percent}
      >
        <Field label="Student Name" required>
          <input
            className={inputClass}
            placeholder="e.g. Aarav Mehta"
            value={draft.student}
            onChange={(e) => setDraft({ ...draft, student: e.target.value })}
            required
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Class" required>
            <select
              className={inputClass}
              value={draft.grade}
              onChange={(e) => setDraft({ ...draft, grade: e.target.value })}
            >
              {["6-A","7-A","8-A","8-B","9-A","9-B","10-A","10-B","11-A","12-A"].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </Field>
          <Field label="Type" required>
            <select
              className={inputClass}
              value={draft.type}
              onChange={(e) => setDraft({ ...draft, type: e.target.value as Scholarship["type"] })}
            >
              {(["Merit","Sports","Need-based","Staff"] as const).map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Discount Percent" required hint={`Amount (est.): ₹${Math.round((Number(draft.percent || 0) / 100) * BASE_FEE_FOR_DEMO).toLocaleString("en-IN")}`}>
          <input
            type="number"
            min={1}
            max={100}
            className={inputClass}
            value={draft.percent}
            onChange={(e) => setDraft({ ...draft, percent: e.target.value })}
            required
          />
        </Field>
        <Field label="Reason / Justification">
          <textarea
            className={`${inputClass} min-h-[70px]`}
            placeholder="Academic performance, financial need, etc."
            value={draft.reason}
            onChange={(e) => setDraft({ ...draft, reason: e.target.value })}
          />
        </Field>
      </FormModal>
    </PageShell>
  );
}

function Stat({ icon: Icon, tone, label, value }: { icon: any; tone: string; label: string; value: string }) {
  return (
    <BentoCard>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tone}`}><Icon className="h-5 w-5" /></div>
        <div>
          <div className="text-xs text-gray-500">{label}</div>
          <div className="text-xl font-semibold text-[#1A237E] dark:text-white">{value}</div>
        </div>
      </div>
    </BentoCard>
  );
}
