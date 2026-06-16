import { Link, useNavigate } from "react-router";
import BentoCard from "../components/BentoCard";
import { Users, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import FormModal, { Field, inputClass } from "../components/FormModal";
import { Can } from "../../lib/auth/Can";
import FeeBuilder, { createFeeHead, type FeePlan } from "../components/FeeBuilder";

interface GradeData {
  grade: number;
  sections: string[];
  totalStudents: number;
  color: string;
}

const gradesData: GradeData[] = [
  { grade: 1, sections: ['A', 'B', 'C'], totalStudents: 78, color: '#E3F2FD' },
  { grade: 2, sections: ['A', 'B', 'C'], totalStudents: 75, color: '#E8F5E9' },
  { grade: 3, sections: ['A', 'B', 'C'], totalStudents: 82, color: '#FFF3E0' },
  { grade: 4, sections: ['A', 'B', 'C'], totalStudents: 80, color: '#F3E5F5' },
  { grade: 5, sections: ['A', 'B', 'C', 'D'], totalStudents: 96, color: '#E0F2F1' },
  { grade: 6, sections: ['A', 'B', 'C', 'D'], totalStudents: 92, color: '#FCE4EC' },
  { grade: 7, sections: ['A', 'B', 'C'], totalStudents: 85, color: '#E1F5FE' },
  { grade: 8, sections: ['A', 'B', 'C'], totalStudents: 87, color: '#F1F8E9' },
  { grade: 9, sections: ['A', 'B', 'C'], totalStudents: 84, color: '#FFF8E1' },
  { grade: 10, sections: ['A', 'B', 'C'], totalStudents: 81, color: '#EDE7F6' },
  { grade: 11, sections: ['A', 'B'], totalStudents: 62, color: '#E0F7FA' },
  { grade: 12, sections: ['A', 'B'], totalStudents: 58, color: '#F9FBE7' },
];

const feeByGrade: Record<string, { tuition: number; books: number }> = {
  "1": { tuition: 42000, books: 4200 },
  "2": { tuition: 42000, books: 4300 },
  "3": { tuition: 44000, books: 4500 },
  "4": { tuition: 46000, books: 4700 },
  "5": { tuition: 48000, books: 5000 },
  "6": { tuition: 55000, books: 6200 },
  "7": { tuition: 56000, books: 6400 },
  "8": { tuition: 58000, books: 6700 },
  "9": { tuition: 65000, books: 7800 },
  "10": { tuition: 68000, books: 8200 },
  "11": { tuition: 78000, books: 9200 },
  "12": { tuition: 82000, books: 9600 },
};

function buildStudentFeePlan(grade: string): FeePlan {
  const preset = feeByGrade[grade] ?? feeByGrade["6"];
  return {
    heads: [
      createFeeHead("Tuition", preset.tuition),
      createFeeHead("Books", preset.books, "One-time"),
    ],
    discount: { amount: 0, comment: "" },
  };
}

const makeBlankStudent = () => ({
  name: "",
  grade: "6",
  section: "A",
  rollNo: "",
  dob: "",
  gender: "Male",
  parentName: "",
  parentPhone: "",
  parentEmail: "",
  address: "",
  admissionFeePaid: "0",
  generateInvoice: true,
  feePlan: buildStudentFeePlan("6"),
});

export default function Students() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(makeBlankStudent);
  const totalStudents = gradesData.reduce((sum, grade) => sum + grade.totalStudents, 0);

  const handleCreate = () => {
    const gradeInt = parseInt(draft.grade, 10);
    toast.success(
      `${draft.name} admitted to Grade ${draft.grade}-${draft.section}` +
      (draft.generateInvoice ? " · Fee invoice generated" : ""),
    );
    setDraft(makeBlankStudent());
    setOpen(false);
    navigate(`/students/${gradeInt}`);
  };

  const updateGrade = (grade: string) => {
    const nextSections = gradesData.find((g) => String(g.grade) === grade)?.sections ?? ["A"];
    setDraft({
      ...draft,
      grade,
      section: nextSections.includes(draft.section) ? draft.section : nextSections[0],
      feePlan: buildStudentFeePlan(grade),
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-[#FAFAFA] min-h-screen"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1A237E] mb-2">Student Information System</h1>
        <p className="text-gray-600">Select a grade to view class rosters and student profiles</p>
      </div>

      {/* Total Students + Add CTA */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <BentoCard className="max-w-xs hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#00897B] rounded-xl flex items-center justify-center shadow-sm">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-[#1A237E]">{totalStudents}</p>
            </div>
          </div>
        </BentoCard>
        <Can permission="students.write">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#1A237E] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#283593]"
          >
            <UserPlus className="h-4 w-4" /> Add Student
          </button>
        </Can>
      </div>

      {/* Grade Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, staggerChildren: 0.05 }}
      >
        {gradesData.map((gradeData, i) => (
          <motion.div
            key={gradeData.grade}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link 
              to={`/students/${gradeData.grade}`}
              className="block transform hover:-translate-y-2 transition-transform duration-300"
            >
              <BentoCard 
                className="h-full cursor-pointer hover:shadow-lg border-none"
                style={{ backgroundColor: gradeData.color }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-4xl font-bold text-[#1A237E]">{gradeData.grade}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-[#1A237E] mb-2">
                    Grade {gradeData.grade}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex gap-1">
                      {gradeData.sections.map((section) => (
                        <span 
                          key={section} 
                          className="px-2 py-1 bg-white/60 text-[#1A237E] text-xs font-semibold rounded-md shadow-sm"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[#1A237E]/70 font-medium">
                    <Users className="w-4 h-4" />
                    <span>{gradeData.totalStudents} Students</span>
                  </div>
                </div>
              </BentoCard>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <FormModal
        open={open}
        onClose={() => setOpen(false)}
        title="Add New Student"
        subtitle="Enrolls the student, creates the parent account, and captures their individual fee structure."
        submitLabel="Admit Student"
        size="xl"
        onSubmit={handleCreate}
        submitDisabled={!draft.name.trim() || !draft.parentName.trim() || !draft.parentPhone.trim()}
      >
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Student</div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name" required>
            <input className={inputClass} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required />
          </Field>
          <Field label="Date of Birth">
            <input type="date" className={inputClass} value={draft.dob} onChange={(e) => setDraft({ ...draft, dob: e.target.value })} />
          </Field>
          <Field label="Grade" required>
            <select className={inputClass} value={draft.grade} onChange={(e) => updateGrade(e.target.value)}>
              {gradesData.map((g) => <option key={g.grade} value={String(g.grade)}>Grade {g.grade}</option>)}
            </select>
          </Field>
          <Field label="Section" required>
            <select className={inputClass} value={draft.section} onChange={(e) => setDraft({ ...draft, section: e.target.value })}>
              {(gradesData.find((g) => String(g.grade) === draft.grade)?.sections ?? ["A"]).map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Roll No.">
            <input type="number" min={1} className={inputClass} value={draft.rollNo} onChange={(e) => setDraft({ ...draft, rollNo: e.target.value })} />
          </Field>
          <Field label="Gender">
            <select className={inputClass} value={draft.gender} onChange={(e) => setDraft({ ...draft, gender: e.target.value })}>
              {["Male","Female","Other"].map((g) => <option key={g}>{g}</option>)}
            </select>
          </Field>
        </div>

        <div className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Parent / Guardian</div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Parent Name" required>
            <input className={inputClass} value={draft.parentName} onChange={(e) => setDraft({ ...draft, parentName: e.target.value })} required />
          </Field>
          <Field label="Parent Phone" required>
            <input className={inputClass} value={draft.parentPhone} onChange={(e) => setDraft({ ...draft, parentPhone: e.target.value })} required />
          </Field>
          <Field label="Parent Email">
            <input type="email" className={inputClass} value={draft.parentEmail} onChange={(e) => setDraft({ ...draft, parentEmail: e.target.value })} />
          </Field>
          <Field label="Address">
            <input className={inputClass} value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
          </Field>
        </div>

        <div className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Student Fee Structure</div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <FeeBuilder plan={draft.feePlan} onChange={(feePlan) => setDraft({ ...draft, feePlan })} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Field label="Admission Fee Collected at Enrollment (₹)" hint="Set to 0 if collected later via Fees module">
            <input type="number" min={0} className={inputClass} value={draft.admissionFeePaid} onChange={(e) => setDraft({ ...draft, admissionFeePaid: e.target.value })} />
          </Field>
          <label className="mt-7 flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={draft.generateInvoice} onChange={(e) => setDraft({ ...draft, generateInvoice: e.target.checked })} />
            Generate first invoice from this student's fee plan
          </label>
        </div>
      </FormModal>
    </motion.div>
  );
}
