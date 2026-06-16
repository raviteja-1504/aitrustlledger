import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { FileDown, Plus, Award, TrendingUp, Lock } from "lucide-react";
import { toast } from "sonner";
import PageHeader, { PageShell } from "../components/PageHeader";
import BentoCard from "../components/BentoCard";
import { Can } from "../../lib/auth/Can";
import { useAuth } from "../../lib/auth/AuthContext";

const terms = ["Term 1 — Oct 2026", "Term 2 — Mar 2027", "Mid-Term — Dec 2026"];
const subjects = ["Math", "Science", "English", "Social", "Hindi"];
const classes = ["8-A", "8-B", "9-A", "10-A"];

interface Row { id: string; roll: number; name: string; marks: Record<string, number>; }

const students: Row[] = [
  "Aarav Mehta","Diya Sharma","Arjun Reddy","Isha Patel","Kabir Khan",
  "Myra Singh","Rohan Das","Saanvi Iyer","Vivaan Joshi","Zara Ali",
].map((name, i) => ({
  id: `s${i}`, roll: i + 1, name,
  marks: Object.fromEntries(subjects.map((s, si) => [s, 60 + ((i * 7 + si * 11) % 40)])),
}));

function grade(total: number): { letter: string; color: string } {
  const pct = total / subjects.length;
  if (pct >= 90) return { letter: "A+", color: "bg-emerald-100 text-emerald-700" };
  if (pct >= 80) return { letter: "A",  color: "bg-green-100 text-green-700" };
  if (pct >= 70) return { letter: "B",  color: "bg-sky-100 text-sky-700" };
  if (pct >= 60) return { letter: "C",  color: "bg-amber-100 text-amber-700" };
  if (pct >= 40) return { letter: "D",  color: "bg-orange-100 text-orange-700" };
  return { letter: "F", color: "bg-red-100 text-red-700" };
}

export default function Exams() {
  const { user, can } = useAuth();

  // Teachers only see classes where they have at least one subject assignment.
  const allowedClasses = useMemo(() => {
    if (user?.role !== "teacher") return classes;
    const assigned = new Set((user.scope?.assignments ?? []).map((a) => a.classId));
    return classes.filter((c) => assigned.has(c));
  }, [user]);

  const [term, setTerm] = useState(terms[0]);
  const [cls, setCls]   = useState(allowedClasses[0] ?? classes[0]);
  const [rows, setRows] = useState<Row[]>(students);

  /** Can this user edit the given (class, subject) cell? */
  const canEditCell = (classId: string, subject: string) =>
    can("students.marks.write", { classId, subject });

  const setMark = (rid: string, subj: string, v: number) => {
    if (!canEditCell(cls, subj)) return;  // defense-in-depth; input is also disabled
    setRows((rs) => rs.map((r) => (r.id === rid ? { ...r, marks: { ...r.marks, [subj]: v } } : r)));
  };

  const avgBySubject = subjects.map((s) => ({
    subject: s,
    avg: Math.round(rows.reduce((sum, r) => sum + r.marks[s], 0) / rows.length),
  }));
  const topper = [...rows].sort((a, b) => totalOf(b) - totalOf(a))[0];

  return (
    <PageShell>
      <PageHeader
        title="Exams & Grades"
        subtitle="Marks entry, automatic grading, and report card generation"
        actions={
          <>
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
              <FileDown className="h-4 w-4" /> Generate report cards
            </button>
            <Can permission="exams.write">
              <button onClick={() => toast.success("Marks saved")} className="flex items-center gap-2 rounded-lg bg-[#1A237E] px-3 py-2 text-sm font-medium text-white hover:bg-[#283593]">
                <Plus className="h-4 w-4" /> Save
              </button>
            </Can>
          </>
        }
      />

      <BentoCard className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Term</label>
            <select value={term} onChange={(e) => setTerm(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5">
              {terms.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Class</label>
            <select
              value={cls}
              onChange={(e) => setCls(e.target.value)}
              disabled={allowedClasses.length === 0}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5"
            >
              {allowedClasses.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          {user?.role === "teacher" && (
            <div className="ml-auto text-xs text-gray-500">
              You can edit marks for subjects you teach. Other cells are read-only.
            </div>
          )}
        </div>
      </BentoCard>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <BentoCard>
          <div className="text-xs text-gray-500">Top Scorer</div>
          <div className="mt-1 flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <span className="font-semibold text-[#1A237E] dark:text-white">{topper.name}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500">{totalOf(topper)} / {subjects.length * 100}</div>
        </BentoCard>
        {avgBySubject.slice(0, 3).map((s) => (
          <BentoCard key={s.subject}>
            <div className="text-xs text-gray-500">Avg {s.subject}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-[#1A237E] dark:text-white">{s.avg}</span>
              <span className="text-xs text-gray-500">/ 100</span>
              <TrendingUp className="ml-auto h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
              <div className="h-full rounded-full bg-gradient-to-r from-[#00897B] to-[#1A237E]" style={{ width: `${s.avg}%` }} />
            </div>
          </BentoCard>
        ))}
      </div>

      {/* Marks matrix */}
      <BentoCard padding={false}>
        <div className="border-b border-gray-100 px-6 py-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-[#1A237E] dark:text-white">Marks — {cls} — {term}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th className="w-12 px-3 py-3 text-left text-xs font-semibold uppercase text-gray-500">#</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-gray-500">Student</th>
                {subjects.map((s) => <th key={s} className="px-3 py-3 text-center text-xs font-semibold uppercase text-gray-500">{s}</th>)}
                <th className="px-3 py-3 text-center text-xs font-semibold uppercase text-gray-500">Total</th>
                <th className="px-3 py-3 text-center text-xs font-semibold uppercase text-gray-500">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
              {rows.map((r, i) => {
                const total = totalOf(r);
                const g = grade(total);
                return (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                    <td className="px-3 py-2 text-gray-500">{r.roll}</td>
                    <td className="px-3 py-2 font-medium text-gray-800 dark:text-gray-100">{r.name}</td>
                    {subjects.map((s) => {
                      const editable = canEditCell(cls, s);
                      return (
                        <td key={s} className="px-2 py-2 text-center">
                          <div className="relative inline-block">
                            <input
                              type="number" min={0} max={100}
                              value={r.marks[s]}
                              disabled={!editable}
                              onChange={(e) => setMark(r.id, s, Math.max(0, Math.min(100, Number(e.target.value))))}
                              title={editable ? undefined : "You are not the subject teacher for this class"}
                              className={`w-16 rounded-md border px-2 py-1 text-center text-sm dark:border-white/10 ${
                                editable
                                  ? "border-gray-200 bg-white dark:bg-white/5"
                                  : "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-500"
                              }`}
                            />
                            {!editable && (
                              <Lock className="pointer-events-none absolute -right-1 -top-1 h-3 w-3 text-gray-400" />
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-center font-semibold text-[#1A237E] dark:text-white">{total}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${g.color}`}>{g.letter}</span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </BentoCard>
    </PageShell>
  );
}

function totalOf(r: { marks: Record<string, number> }): number {
  return Object.values(r.marks).reduce((a, b) => a + b, 0);
}
