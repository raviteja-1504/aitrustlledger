import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Eye, EyeOff, Mail, Pencil, Phone, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import PageHeader, { PageShell } from "../components/PageHeader";
import BentoCard from "../components/BentoCard";
import FormModal, { Field, inputClass } from "../components/FormModal";
import { Can } from "../../lib/auth/Can";

const ALL_CLASSES = ["6-A","7-A","8-A","8-B","9-A","9-B","10-A","10-B","11-A","12-A"];
const ALL_SUBJECTS = ["Math","Science","English","Social","Hindi","PE","Computer","Art"];

interface StaffMember {
  id: string; name: string; role: string; department: string;
  email: string; phone: string; salary: number;
  subjectAssignments: { classId: string; subject: string }[];
}

const staff: StaffMember[] = [
  { id: "1", name: "Anita Rao",       role: "Class Teacher — 8A",   department: "Academics",  email: "anita@meridian.edu",  phone: "9876543210", salary: 62000, subjectAssignments: [{ classId: "8-A", subject: "Science" }] },
  { id: "2", name: "Vikram Joshi",    role: "HOD Mathematics",      department: "Academics",  email: "vikram@meridian.edu", phone: "9876543211", salary: 78000, subjectAssignments: [{ classId: "10-A", subject: "Math" }, { classId: "10-B", subject: "Math" }] },
  { id: "3", name: "Sneha Kapoor",    role: "Accountant",           department: "Finance",    email: "sneha@meridian.edu",  phone: "9876543212", salary: 52000, subjectAssignments: [] },
  { id: "4", name: "Arjun Reddy",     role: "PE Coach",             department: "Sports",     email: "arjun@meridian.edu",  phone: "9876543213", salary: 48000, subjectAssignments: [{ classId: "9-A", subject: "PE" }] },
  { id: "5", name: "Meera Pillai",    role: "Librarian",            department: "Library",    email: "meera@meridian.edu",  phone: "9876543214", salary: 44000, subjectAssignments: [] },
  { id: "6", name: "Rahul Sharma",    role: "Admissions Officer",   department: "Admissions", email: "rahul@meridian.edu",  phone: "9876543215", salary: 56000, subjectAssignments: [] },
  { id: "7", name: "Priya Nair",      role: "English Teacher",      department: "Academics",  email: "priya@meridian.edu",  phone: "9876543216", salary: 59000, subjectAssignments: [{ classId: "7-A", subject: "English" }] },
  { id: "8", name: "Karan Singh",     role: "IT Support",           department: "Operations", email: "karan@meridian.edu",  phone: "9876543217", salary: 50000, subjectAssignments: [] },
];

const deptColors: Record<string, string> = {
  Academics:  "bg-indigo-50 text-indigo-700",
  Finance:    "bg-emerald-50 text-emerald-700",
  Sports:     "bg-amber-50 text-amber-700",
  Library:    "bg-rose-50 text-rose-700",
  Admissions: "bg-sky-50 text-sky-700",
  Operations: "bg-violet-50 text-violet-700",
};

const blankStaff = {
  name: "",
  role: "Teacher",
  department: "Academics",
  email: "",
  phone: "",
  salary: "",
  classInCharge: "",              // "" means not a class teacher
  subjectAssignments: [] as { classId: string; subject: string }[],
};

export default function Staff() {
  const [list, setList] = useState<StaffMember[]>(staff);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(blankStaff);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [newAssignClass, setNewAssignClass] = useState(ALL_CLASSES[0]);
  const [newAssignSubject, setNewAssignSubject] = useState(ALL_SUBJECTS[0]);
  const [visibleSalaryIds, setVisibleSalaryIds] = useState<string[]>([]);

  const depts = ["All", ...Array.from(new Set(list.map((s) => s.department)))];
  const filtered = list.filter((s) =>
    (dept === "All" || s.department === dept) &&
    (s.name + s.role + s.subjectAssignments.map((a) => `${a.classId}${a.subject}`).join("")).toLowerCase().includes(q.toLowerCase())
  );

  const addAssignment = () => {
    const exists = draft.subjectAssignments.some(
      (a) => a.classId === newAssignClass && a.subject === newAssignSubject
    );
    if (exists) return;
    setDraft({
      ...draft,
      subjectAssignments: [...draft.subjectAssignments, { classId: newAssignClass, subject: newAssignSubject }],
    });
  };

  const removeAssignment = (idx: number) =>
    setDraft({ ...draft, subjectAssignments: draft.subjectAssignments.filter((_, i) => i !== idx) });

  const openCreateStaff = () => {
    setEditingStaffId(null);
    setDraft(blankStaff);
    setOpen(true);
  };

  const openEditStaff = (member: StaffMember) => {
    const classTeacherMatch = member.role.match(/Class Teacher — (.+)$/);
    setEditingStaffId(member.id);
    setDraft({
      name: member.name,
      role: classTeacherMatch ? "Teacher" : member.role,
      department: member.department,
      email: member.email,
      phone: member.phone,
      salary: String(member.salary),
      classInCharge: classTeacherMatch?.[1] ?? "",
      subjectAssignments: member.subjectAssignments.map((assignment) => ({ ...assignment })),
    });
    setOpen(true);
  };

  const handleSaveStaff = () => {
    const roleLabel = draft.classInCharge
      ? `Class Teacher — ${draft.classInCharge}`
      : draft.role;
    const saved: StaffMember = {
      id: editingStaffId ?? `staff-${Date.now()}`,
      name: draft.name.trim(),
      role: roleLabel,
      department: draft.department,
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      salary: Number(draft.salary) || 0,
      subjectAssignments: draft.subjectAssignments,
    };
    setList((xs) => editingStaffId ? xs.map((s) => s.id === editingStaffId ? saved : s) : [saved, ...xs]);
    setDraft(blankStaff);
    setEditingStaffId(null);
    setOpen(false);
    toast.success(
      `${saved.name} ${editingStaffId ? "updated" : "added"}${draft.classInCharge ? ` as class teacher of ${draft.classInCharge}` : ""}` +
      (draft.subjectAssignments.length ? ` · ${draft.subjectAssignments.length} subject assignment(s)` : "")
    );
  };

  return (
    <PageShell>
      <PageHeader
        title="Staff Directory"
        subtitle="Teachers, administrators, and support staff"
        actions={
          <Can permission="staff.write">
            <button
              onClick={openCreateStaff}
              className="flex items-center gap-2 rounded-lg bg-[#1A237E] px-3 py-2 text-sm font-medium text-white hover:bg-[#283593]"
            >
              <UserPlus className="h-4 w-4" /> Add Staff
            </button>
          </Can>
        }
      />

      <BentoCard className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5">
            <Search className="h-4 w-4 text-gray-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or role" className="flex-1 bg-transparent outline-none" />
          </div>
          <div className="flex flex-wrap gap-1">
            {depts.map((d) => (
              <button key={d} onClick={() => setDept(d)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                dept === d ? "bg-[#1A237E] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300"
              }`}>{d}</button>
            ))}
          </div>
        </div>
      </BentoCard>

      <FormModal
        open={open}
        onClose={() => { setOpen(false); setEditingStaffId(null); setDraft(blankStaff); }}
        title={editingStaffId ? "Edit Staff Member" : "Add Staff Member"}
        subtitle={editingStaffId ? "Admin-only correction for staff details, salary, and subject assignments" : "Create a staff account with optional class + subject assignments"}
        submitLabel={editingStaffId ? "Save Staff" : "Add Staff"}
        size="lg"
        onSubmit={handleSaveStaff}
        submitDisabled={!draft.name.trim() || !draft.email.trim()}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name" required>
            <input
              className={inputClass}
              placeholder="e.g. Priya Nair"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              required
            />
          </Field>
          <Field label="Role / Designation" required>
            <input
              className={inputClass}
              list="staff-role-options"
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              required
            />
            <datalist id="staff-role-options">
              {["Teacher","HOD Mathematics","Accountant","Admissions Officer","Librarian","PE Coach","IT Support","Counsellor"].map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </Field>
          <Field label="Department" required>
            <select
              className={inputClass}
              value={draft.department}
              onChange={(e) => setDraft({ ...draft, department: e.target.value })}
            >
              {["Academics","Finance","Admissions","Sports","Library","Operations"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Class Teacher Of" hint="Leave blank if not a class teacher">
            <select
              className={inputClass}
              value={draft.classInCharge}
              onChange={(e) => setDraft({ ...draft, classInCharge: e.target.value })}
            >
              <option value="">— None —</option>
              {ALL_CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Email" required>
            <input
              type="email"
              className={inputClass}
              placeholder="name@meridian.edu"
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              required
            />
          </Field>
          <Field label="Phone">
            <input
              className={inputClass}
              placeholder="9876543210"
              value={draft.phone}
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
            />
          </Field>
          <Field label="Monthly Salary (₹)" hint="Private by default in the directory">
            <input
              type="number"
              min={0}
              className={inputClass}
              placeholder="60000"
              value={draft.salary}
              onChange={(e) => setDraft({ ...draft, salary: e.target.value })}
            />
          </Field>
        </div>

        <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="mb-2 text-sm font-medium text-gray-700">Subject Assignments (optional)</div>
          <div className="mb-2 text-xs text-gray-500">
            Classes & subjects this teacher teaches. Drives marks-entry access on the Exams page.
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              className={`${inputClass} w-auto`}
              value={newAssignClass}
              onChange={(e) => setNewAssignClass(e.target.value)}
            >
              {ALL_CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select
              className={`${inputClass} w-auto`}
              value={newAssignSubject}
              onChange={(e) => setNewAssignSubject(e.target.value)}
            >
              {ALL_SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button
              type="button"
              onClick={addAssignment}
              className="rounded-lg border border-[#00897B] bg-white px-3 py-2 text-sm font-medium text-[#00897B] transition hover:bg-[#E0F2F1]"
            >
              + Add
            </button>
          </div>
          {draft.subjectAssignments.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {draft.subjectAssignments.map((a, i) => (
                <span key={`${a.classId}-${a.subject}`} className="inline-flex items-center gap-1 rounded-full bg-[#E0F2F1] px-2.5 py-1 text-xs font-medium text-[#00796B]">
                  {a.classId} · {a.subject}
                  <button type="button" onClick={() => removeAssignment(i)} className="ml-1 text-[#00796B] hover:text-[#EF5350]">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </FormModal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <BentoCard>
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1A237E] to-[#00897B] text-sm font-semibold text-white">
                  {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-[#1A237E] dark:text-white">{s.name}</div>
                  <div className="truncate text-xs text-gray-600 dark:text-gray-400">{s.role}</div>
                </div>
                <Can permission="staff.write">
                  <button
                    type="button"
                    onClick={() => openEditStaff(s)}
                    className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-[#1A237E]"
                    aria-label={`Edit ${s.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </Can>
              </div>
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${deptColors[s.department] ?? "bg-gray-100 text-gray-700"}`}>{s.department}</span>
              <div className="mt-4 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /><span className="truncate">{s.email}</span></div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /><span>{s.phone}</span></div>
              </div>
              {s.subjectAssignments.length > 0 && (
                <div className="mt-4 rounded-lg bg-[#F5F5F5] p-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#1A237E]">
                    <BookOpen className="h-3.5 w-3.5" /> Subjects
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.subjectAssignments.map((a) => (
                      <span key={`${a.classId}-${a.subject}`} className="rounded-full bg-white px-2 py-1 text-[11px] font-medium text-gray-700">
                        {a.classId} · {a.subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/10">
                <span className="text-xs text-gray-500">Salary</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#1A237E]">
                    {visibleSalaryIds.includes(s.id) ? `₹${s.salary.toLocaleString("en-IN")}` : "Private"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setVisibleSalaryIds((ids) => ids.includes(s.id) ? ids.filter((id) => id !== s.id) : [...ids, s.id])}
                    className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-[#1A237E]"
                    aria-label={visibleSalaryIds.includes(s.id) ? "Hide salary" : "Show salary"}
                  >
                    {visibleSalaryIds.includes(s.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </BentoCard>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}
