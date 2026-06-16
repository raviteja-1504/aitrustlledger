import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BentoCard from "../components/BentoCard";
import { Plus, Filter, Phone, Star, Sparkles, X, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import FormModal, { Field, inputClass } from "../components/FormModal";

interface Lead {
  id: string;
  name: string;
  grade: string;
  phone: string;
  strength: number;
  status: 'inquiry' | 'application' | 'visit' | 'test' | 'enrolled' | 'dropped';
  lastContact?: string;
  aiSuggestion?: boolean;
  dropReason?: string;
}

const mockLeads: Lead[] = [
  { id: '1', name: 'Simran Kaur', grade: '9th', phone: '+91 98765-43210', strength: 5, status: 'inquiry', lastContact: '3 days ago', aiSuggestion: true },
  { id: '2', name: 'Arjun Mehta', grade: '6th', phone: '+91 98765-43211', strength: 4, status: 'inquiry', lastContact: '1 day ago' },
  { id: '3', name: 'Ananya Reddy', grade: '10th', phone: '+91 98765-43212', strength: 5, status: 'application', lastContact: '2 hours ago' },
  { id: '4', name: 'Rohan Patel', grade: '7th', phone: '+91 98765-43213', strength: 3, status: 'application', lastContact: '5 days ago', aiSuggestion: true },
  { id: '5', name: 'Kavya Iyer', grade: '8th', phone: '+91 98765-43214', strength: 4, status: 'visit', lastContact: '1 day ago' },
  { id: '6', name: 'Aditya Singh', grade: '9th', phone: '+91 98765-43215', strength: 5, status: 'visit', lastContact: '3 hours ago' },
  { id: '7', name: 'Diya Sharma', grade: '6th', phone: '+91 98765-43216', strength: 4, status: 'test', lastContact: 'Today' },
  { id: '8', name: 'Ishaan Gupta', grade: '11th', phone: '+91 98765-43217', strength: 3, status: 'test', lastContact: 'Yesterday' },
  { id: '9', name: 'Priya Nair', grade: '7th', phone: '+91 98765-43218', strength: 5, status: 'enrolled', lastContact: 'Today' },
  { id: '10', name: 'Karthik Rao', grade: '8th', phone: '+91 98765-43219', strength: 4, status: 'enrolled', lastContact: '2 days ago' },
];

const columns = [
  { id: 'inquiry', title: 'Inquiry', color: '#E3F2FD' },
  { id: 'application', title: 'Application', color: '#FFF3E0' },
  { id: 'visit', title: 'Campus Visit', color: '#F3E5F5' },
  { id: 'test', title: 'Entrance Test', color: '#E8F5E9' },
  { id: 'enrolled', title: 'Enrolled', color: '#E0F2F1' },
];

interface LeadCardProps {
  lead: Lead;
  onDropLead: (leadId: string, reason: string) => void;
}

const DROP_REASONS = ["Not Interested", "Enrolled Elsewhere", "Fee Concerns", "Relocated", "No Response", "Other"];

function LeadCard({ lead, onDropLead }: LeadCardProps) {
  const [showDropMenu, setShowDropMenu] = useState(false);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'LEAD',
    item: { id: lead.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-move border border-gray-100 relative ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {lead.aiSuggestion && (
        <div className="flex items-center gap-1 text-xs bg-[#FFF3E0] text-[#FF9800] px-2 py-1 rounded-md mb-2 w-fit">
          <Sparkles className="w-3 h-3" />
          <span>AI: Follow up needed</span>
        </div>
      )}
      
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-[#1A237E] mb-1">{lead.name}</h3>
          <p className="text-sm text-gray-600 mb-2">Grade {lead.grade}</p>
        </div>
        {lead.status !== 'enrolled' && (
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowDropMenu(!showDropMenu); }}
              className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Close / Drop Lead"
            >
              <X className="w-4 h-4" />
            </button>
            {showDropMenu && (
              <div className="absolute right-0 top-8 z-20 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase">Drop Reason</p>
                {DROP_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={(e) => { e.stopPropagation(); onDropLead(lead.id, reason); setShowDropMenu(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <Phone className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">{lead.phone}</span>
        <a 
          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto"
        >
          <div className="w-6 h-6 bg-[#25D366] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
        </a>
      </div>
      
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < lead.strength ? 'fill-[#FF9800] text-[#FF9800]' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      
      {lead.lastContact && (
        <p className="text-xs text-gray-500 mt-2">Last contact: {lead.lastContact}</p>
      )}
    </div>
  );
}

interface ColumnProps {
  column: typeof columns[0];
  leads: Lead[];
  onDrop: (leadId: string, newStatus: string) => void;
  onDropLead: (leadId: string, reason: string) => void;
}

function Column({ column, leads, onDrop, onDropLead }: ColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'LEAD',
    drop: (item: { id: string }) => onDrop(item.id, column.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[280px] transition-all ${isOver ? 'scale-105' : ''}`}
    >
      <div 
        className="rounded-t-xl p-4 mb-4"
        style={{ backgroundColor: column.color }}
      >
        <h2 className="font-semibold text-[#1A237E] flex items-center justify-between">
          <span>{column.title}</span>
          <span className="bg-white text-[#1A237E] px-3 py-1 rounded-full text-sm">
            {leads.length}
          </span>
        </h2>
      </div>
      <div className="space-y-4 px-2">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onDropLead={onDropLead} />
        ))}
      </div>
    </div>
  );
}

const blankLead = { name: "", grade: "6th", phone: "", strength: "3", source: "Website" };

function AdmissionsContent() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [draft, setDraft] = useState(blankLead);

  // Enrollment confirmation modal
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [pendingEnrollId, setPendingEnrollId] = useState<string | null>(null);
  const [enrollForm, setEnrollForm] = useState({ admissionNo: '', section: 'A', parentEmail: '' });

  const handleDrop = (leadId: string, newStatus: string) => {
    // Intercept enrollment — require confirmation
    if (newStatus === 'enrolled') {
      const lead = leads.find((l) => l.id === leadId);
      if (lead && lead.status !== 'enrolled') {
        setPendingEnrollId(leadId);
        setEnrollForm({ admissionNo: `ADM-${Date.now().toString().slice(-6)}`, section: 'A', parentEmail: '' });
        setEnrollModalOpen(true);
        return; // don't move yet — wait for confirmation
      }
    }
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus as Lead['status'] } : lead
      )
    );
  };

  const handleConfirmEnrollment = () => {
    if (!pendingEnrollId) return;
    const lead = leads.find((l) => l.id === pendingEnrollId);
    if (!lead) return;

    // 1. Move lead to enrolled
    setLeads((prev) =>
      prev.map((l) =>
        l.id === pendingEnrollId ? { ...l, status: 'enrolled' as Lead['status'] } : l
      )
    );

    // 2. Student record creation stub (will call POST /students when backend lands)
    const studentRecord = {
      admissionNo: enrollForm.admissionNo,
      name: lead.name,
      grade: lead.grade,
      section: enrollForm.section,
      parentPhone: lead.phone,
      parentEmail: enrollForm.parentEmail,
      enrolledFrom: 'admission_lead',
      leadId: lead.id,
    };
    console.log('[Enrollment] Student record to create:', studentRecord);

    // 3. Audit log entry stub (will call POST /audit-logs when backend lands)
    const auditEntry = {
      action: 'enrollment.create',
      actor: 'current_user', // replaced by auth context in production
      resource: `admission_lead:${lead.id}`,
      detail: `Enrolled ${lead.name} (${enrollForm.admissionNo}) into Grade ${lead.grade}-${enrollForm.section}`,
      timestamp: new Date().toISOString(),
    };
    console.log('[Audit] Log entry:', auditEntry);

    toast.success(
      `${lead.name} enrolled as ${enrollForm.admissionNo} → Grade ${lead.grade}-${enrollForm.section}`,
      { duration: 5000 }
    );

    // Reset
    setEnrollModalOpen(false);
    setPendingEnrollId(null);
  };

  const handleDropLead = (leadId: string, reason: string) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId ? { ...lead, status: 'dropped' as Lead['status'], dropReason: reason } : lead
      )
    );
    const lead = leads.find((l) => l.id === leadId);
    toast.success(`Lead "${lead?.name}" dropped — ${reason}`);
  };

  const handleCreateLead = () => {
    const created: Lead = {
      id: `lead-${Date.now()}`,
      name: draft.name.trim(),
      grade: draft.grade,
      phone: draft.phone.trim(),
      strength: Number(draft.strength),
      status: "inquiry",
      lastContact: "Just now",
    };
    setLeads((ls) => [created, ...ls]);
    setDraft(blankLead);
    setNewLeadOpen(false);
    toast.success(`Lead "${created.name}" added to Inquiry`);
  };

  const activeLeads = leads.filter((l) => l.status !== 'dropped');
  const droppedLeads = leads.filter((l) => l.status === 'dropped');
  const filteredLeads = filterGrade === 'all' 
    ? activeLeads 
    : activeLeads.filter(lead => lead.grade === filterGrade);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-[#FAFAFA] min-h-screen"
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#1A237E] mb-2">Admissions Management</h1>
          <p className="text-gray-600">Track and manage your admission pipeline</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00897B]"
            >
              <option value="all">All Grades</option>
              <option value="6th">Grade 6</option>
              <option value="7th">Grade 7</option>
              <option value="8th">Grade 8</option>
              <option value="9th">Grade 9</option>
              <option value="10th">Grade 10</option>
              <option value="11th">Grade 11</option>
            </select>
          </div>
          <button
            onClick={() => setNewLeadOpen(true)}
            className="flex items-center gap-2 bg-[#00897B] text-white px-6 py-3 rounded-lg hover:bg-[#00796B] transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {columns.map((column) => {
          const count = filteredLeads.filter(lead => lead.status === column.id).length;
          return (
            <BentoCard key={column.id} className="text-center">
              <div className="text-3xl font-bold text-[#1A237E]">{count}</div>
              <div className="text-sm text-gray-600 mt-1">{column.title}</div>
            </BentoCard>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-8">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            leads={filteredLeads.filter((lead) => lead.status === column.id)}
            onDrop={handleDrop}
            onDropLead={handleDropLead}
          />
        ))}
      </div>

      {/* Dropped Leads Summary */}
      {droppedLeads.length > 0 && (
        <BentoCard className="mt-6">
          <h2 className="text-lg font-semibold text-[#1A237E] mb-3">Dropped Leads ({droppedLeads.length})</h2>
          <div className="space-y-2">
            {droppedLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2 text-sm">
                <span className="font-medium text-gray-700">{lead.name}</span>
                <span className="text-gray-500">Grade {lead.grade}</span>
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">{lead.dropReason}</span>
              </div>
            ))}
          </div>
        </BentoCard>
      )}

      {/* Enrollment Confirmation Modal */}
      <FormModal
        open={enrollModalOpen}
        onClose={() => { setEnrollModalOpen(false); setPendingEnrollId(null); }}
        title="Confirm Enrollment"
        subtitle={pendingEnrollId ? `Enrolling ${leads.find(l => l.id === pendingEnrollId)?.name} — this will create a student record` : ''}
        submitLabel="Enroll & Create Student"
        onSubmit={handleConfirmEnrollment}
        submitDisabled={!enrollForm.admissionNo.trim()}
      >
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 mb-2 flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
          <p className="text-sm text-emerald-800">This action will move the lead to <strong>Enrolled</strong>, create a new student record, and log the enrollment in audit history.</p>
        </div>
        <Field label="Admission Number" required>
          <input
            className={inputClass}
            placeholder="ADM-001234"
            value={enrollForm.admissionNo}
            onChange={(e) => setEnrollForm({ ...enrollForm, admissionNo: e.target.value })}
            required
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Section" required>
            <select
              className={inputClass}
              value={enrollForm.section}
              onChange={(e) => setEnrollForm({ ...enrollForm, section: e.target.value })}
            >
              {['A','B','C','D'].map((s) => <option key={s} value={s}>Section {s}</option>)}
            </select>
          </Field>
          <Field label="Parent Email">
            <input
              className={inputClass}
              type="email"
              placeholder="parent@example.com"
              value={enrollForm.parentEmail}
              onChange={(e) => setEnrollForm({ ...enrollForm, parentEmail: e.target.value })}
            />
          </Field>
        </div>
      </FormModal>

      <FormModal
        open={newLeadOpen}
        onClose={() => setNewLeadOpen(false)}
        title="Add New Lead"
        subtitle="Capture a prospective student inquiry"
        submitLabel="Add Lead"
        onSubmit={handleCreateLead}
        submitDisabled={!draft.name.trim() || !draft.phone.trim()}
      >
        <Field label="Student Name" required>
          <input
            className={inputClass}
            placeholder="e.g. Simran Kaur"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            required
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Grade Applying For" required>
            <select
              className={inputClass}
              value={draft.grade}
              onChange={(e) => setDraft({ ...draft, grade: e.target.value })}
            >
              {["Nursery","KG","1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"].map((g) => (
                <option key={g} value={g}>Grade {g}</option>
              ))}
            </select>
          </Field>
          <Field label="Lead Strength">
            <select
              className={inputClass}
              value={draft.strength}
              onChange={(e) => setDraft({ ...draft, strength: e.target.value })}
            >
              {[1,2,3,4,5].map((n) => <option key={n} value={n}>{"★".repeat(n)} ({n})</option>)}
            </select>
          </Field>
        </div>
        <Field label="Parent Phone" required hint="Used for WhatsApp follow-ups">
          <input
            className={inputClass}
            placeholder="+91 98765-43210"
            value={draft.phone}
            onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
            required
          />
        </Field>
        <Field label="Source">
          <select
            className={inputClass}
            value={draft.source}
            onChange={(e) => setDraft({ ...draft, source: e.target.value })}
          >
            {["Website","Walk-in","Referral","Social Media","Advertisement","Other"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </FormModal>
    </motion.div>
  );
}

export default function Admissions() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AdmissionsContent />
    </DndProvider>
  );
}
