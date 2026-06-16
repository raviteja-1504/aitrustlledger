import { useState } from "react";
import BentoCard from "../components/BentoCard";
import { Search, Send, DollarSign, Download, X, CreditCard, Wallet, Building2 } from "lucide-react";
import { Progress } from "../components/ui/progress";
import { motion, AnimatePresence } from "motion/react";

interface Student {
  id: string;
  studentId: string;
  name: string;
  class: string;
  section: string;
  totalFee: number;
  paidAmount: number;
  balanceDue: number;
  lastPaymentDate: string;
  status: 'paid' | 'partial' | 'overdue';
}

const grade1AStudents: Student[] = [
  { id: '1a-1', studentId: 'STU2026101', name: 'Aarav Sharma', class: '1', section: 'A', totalFee: 42000, paidAmount: 42000, balanceDue: 0, lastPaymentDate: '02-Apr-2026', status: 'paid' },
  { id: '1a-2', studentId: 'STU2026102', name: 'Diya Mehta', class: '1', section: 'A', totalFee: 42000, paidAmount: 30000, balanceDue: 12000, lastPaymentDate: '08-Apr-2026', status: 'partial' },
  { id: '1a-3', studentId: 'STU2026103', name: 'Vivaan Singh', class: '1', section: 'A', totalFee: 42000, paidAmount: 18000, balanceDue: 24000, lastPaymentDate: '16-Mar-2026', status: 'overdue' },
  { id: '1a-4', studentId: 'STU2026104', name: 'Ananya Iyer', class: '1', section: 'A', totalFee: 42000, paidAmount: 42000, balanceDue: 0, lastPaymentDate: '01-Apr-2026', status: 'paid' },
  { id: '1a-5', studentId: 'STU2026105', name: 'Ishaan Rao', class: '1', section: 'A', totalFee: 42000, paidAmount: 21000, balanceDue: 21000, lastPaymentDate: '25-Mar-2026', status: 'partial' },
  { id: '1a-6', studentId: 'STU2026106', name: 'Kiara Sharma', class: '1', section: 'A', totalFee: 42000, paidAmount: 10000, balanceDue: 32000, lastPaymentDate: '12-Feb-2026', status: 'overdue' },
  { id: '1a-7', studentId: 'STU2026107', name: 'Sai Reddy', class: '1', section: 'A', totalFee: 42000, paidAmount: 42000, balanceDue: 0, lastPaymentDate: '04-Apr-2026', status: 'paid' },
  { id: '1a-8', studentId: 'STU2026108', name: 'Aadhya Nair', class: '1', section: 'A', totalFee: 42000, paidAmount: 28000, balanceDue: 14000, lastPaymentDate: '28-Mar-2026', status: 'partial' },
  { id: '1a-9', studentId: 'STU2026109', name: 'Aditya Kumar', class: '1', section: 'A', totalFee: 42000, paidAmount: 42000, balanceDue: 0, lastPaymentDate: '05-Apr-2026', status: 'paid' },
  { id: '1a-10', studentId: 'STU2026110', name: 'Myra Patel', class: '1', section: 'A', totalFee: 42000, paidAmount: 14000, balanceDue: 28000, lastPaymentDate: '20-Jan-2026', status: 'overdue' },
  { id: '1a-11', studentId: 'STU2026111', name: 'Krishna Verma', class: '1', section: 'A', totalFee: 42000, paidAmount: 35000, balanceDue: 7000, lastPaymentDate: '11-Apr-2026', status: 'partial' },
  { id: '1a-12', studentId: 'STU2026112', name: 'Saanvi Kumar', class: '1', section: 'A', totalFee: 42000, paidAmount: 42000, balanceDue: 0, lastPaymentDate: '03-Apr-2026', status: 'paid' },
];

const mockStudents: Student[] = [
  ...grade1AStudents,
  { 
    id: '1', 
    studentId: 'STU2024001', 
    name: 'Rahul Kumar', 
    class: '10', 
    section: 'A', 
    totalFee: 50000, 
    paidAmount: 50000, 
    balanceDue: 0, 
    lastPaymentDate: '15-Mar-2026',
    status: 'paid'
  },
  { 
    id: '2', 
    studentId: 'STU2024002', 
    name: 'Priya Sharma', 
    class: '8', 
    section: 'B', 
    totalFee: 45000, 
    paidAmount: 30000, 
    balanceDue: 15000, 
    lastPaymentDate: '10-Feb-2026',
    status: 'partial'
  },
  { 
    id: '3', 
    studentId: 'STU2024003', 
    name: 'Amit Singh', 
    class: '9', 
    section: 'A', 
    totalFee: 48000, 
    paidAmount: 20000, 
    balanceDue: 28000, 
    lastPaymentDate: '05-Jan-2026',
    status: 'overdue'
  },
  { 
    id: '4', 
    studentId: 'STU2024004', 
    name: 'Sneha Reddy', 
    class: '11', 
    section: 'C', 
    totalFee: 55000, 
    paidAmount: 55000, 
    balanceDue: 0, 
    lastPaymentDate: '20-Mar-2026',
    status: 'paid'
  },
  { 
    id: '5', 
    studentId: 'STU2024005', 
    name: 'Arjun Patel', 
    class: '7', 
    section: 'B', 
    totalFee: 42000, 
    paidAmount: 35000, 
    balanceDue: 7000, 
    lastPaymentDate: '25-Feb-2026',
    status: 'partial'
  },
  { 
    id: '6', 
    studentId: 'STU2024006', 
    name: 'Kavya Iyer', 
    class: '10', 
    section: 'B', 
    totalFee: 50000, 
    paidAmount: 15000, 
    balanceDue: 35000, 
    lastPaymentDate: '15-Dec-2025',
    status: 'overdue'
  },
  { 
    id: '7', 
    studentId: 'STU2024007', 
    name: 'Rohan Mehta', 
    class: '6', 
    section: 'A', 
    totalFee: 40000, 
    paidAmount: 40000, 
    balanceDue: 0, 
    lastPaymentDate: '01-Apr-2026',
    status: 'paid'
  },
  { 
    id: '8', 
    studentId: 'STU2024008', 
    name: 'Ananya Gupta', 
    class: '9', 
    section: 'C', 
    totalFee: 48000, 
    paidAmount: 48000, 
    balanceDue: 0, 
    lastPaymentDate: '28-Mar-2026',
    status: 'paid'
  },
  { 
    id: '9', 
    studentId: 'STU2024009', 
    name: 'Karthik Rao', 
    class: '8', 
    section: 'A', 
    totalFee: 45000, 
    paidAmount: 25000, 
    balanceDue: 20000, 
    lastPaymentDate: '20-Jan-2026',
    status: 'overdue'
  },
  { 
    id: '10', 
    studentId: 'STU2024010', 
    name: 'Diya Nair', 
    class: '12', 
    section: 'A', 
    totalFee: 60000, 
    paidAmount: 45000, 
    balanceDue: 15000, 
    lastPaymentDate: '15-Mar-2026',
    status: 'partial'
  },
];

export default function Fees() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<string>('1');
  const [sectionFilter, setSectionFilter] = useState<string>('A');
  
  // Payment Modal State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'bank'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCollectPaymentClick = (student: Student) => {
    setSelectedStudent(student);
    setPaymentAmount(student.balanceDue.toString());
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Simulate success
      setIsProcessing(false);
      setStudents(prev => prev.map(s => {
        if (s.id === selectedStudent?.id) {
          const amountPaid = parseFloat(paymentAmount) || 0;
          return {
            ...s,
            paidAmount: s.paidAmount + amountPaid,
            balanceDue: Math.max(0, s.balanceDue - amountPaid),
            status: s.balanceDue - amountPaid <= 0 ? 'paid' : 'partial',
            lastPaymentDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
          };
        }
        return s;
      }));
      setSelectedStudent(null);
    }, 1500);
  };

  const allClasses = Array.from(new Set(students.map((s) => s.class))).sort((a, b) => Number(a) - Number(b));
  const allSections = Array.from(
    new Set(
      students
        .filter((s) => classFilter === "all" || s.class === classFilter)
        .map((s) => s.section)
    )
  ).sort();

  const filteredStudents = students.filter((student) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      student.name.toLowerCase().includes(q) ||
      student.studentId.toLowerCase().includes(q) ||
      student.class.includes(searchQuery);
    const matchesClass = classFilter === "all" || student.class === classFilter;
    const matchesSection = sectionFilter === "all" || student.section === sectionFilter;
    return matchesSearch && matchesClass && matchesSection;
  });

  const totalExpected = students.reduce((sum, s) => sum + s.totalFee, 0);
  const totalCollected = students.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalOutstanding = students.reduce((sum, s) => sum + s.balanceDue, 0);
  const overdueCount = students.filter(s => s.status === 'overdue').length;

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-[#FAFAFA] min-h-screen"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1A237E] mb-2">Fees & Finance</h1>
        <p className="text-gray-600">Manage fee collection and payment tracking</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <BentoCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Expected</p>
              <p className="text-2xl font-bold text-[#1A237E]">{formatCurrency(totalExpected)}</p>
            </div>
            <div className="w-10 h-10 bg-[#E3F2FD] rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#1A237E]" />
            </div>
          </div>
        </BentoCard>

        <BentoCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Collected</p>
              <p className="text-2xl font-bold text-[#4CAF50]">{formatCurrency(totalCollected)}</p>
            </div>
            <div className="w-10 h-10 bg-[#E8F5E9] rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#4CAF50]" />
            </div>
          </div>
        </BentoCard>

        <BentoCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Outstanding</p>
              <p className="text-2xl font-bold text-[#EF5350]">{formatCurrency(totalOutstanding)}</p>
            </div>
            <div className="w-10 h-10 bg-[#FFEBEE] rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#EF5350]" />
            </div>
          </div>
        </BentoCard>

        <BentoCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Overdue Payments</p>
              <p className="text-2xl font-bold text-[#FF9800]">{overdueCount}</p>
              <p className="text-xs text-gray-500 mt-1">Students</p>
            </div>
            <div className="w-10 h-10 bg-[#FFF3E0] rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-[#FF9800]" />
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Class & Section Filter */}
      <BentoCard className="mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Class:</label>
            <select
              value={classFilter}
              onChange={(e) => { setClassFilter(e.target.value); setSectionFilter("all"); }}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00897B]"
            >
              <option value="all">All Classes</option>
              {allClasses.map((c) => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Section:</label>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00897B]"
            >
              <option value="all">All Sections</option>
              {allSections.map((s) => (
                <option key={s} value={s}>Section {s}</option>
              ))}
            </select>
          </div>
          <span className="text-sm text-gray-500 ml-auto">{filteredStudents.length} students</span>
        </div>
      </BentoCard>

      {/* Search and Actions Bar */}
      <BentoCard className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, student ID, or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00897B]"
            />
          </div>
          <button className="flex items-center gap-2 bg-[#EF5350] text-white px-6 py-2 rounded-lg hover:bg-[#E53935] transition-colors">
            <Send className="w-4 h-4" />
            <span>Send Overdue SMS to All</span>
          </button>
          <button className="flex items-center gap-2 bg-[#00897B] text-white px-6 py-2 rounded-lg hover:bg-[#00796B] transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </BentoCard>

      {/* Fee Table */}
      <BentoCard padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-[#F5F5F5]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#1A237E]">Student ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#1A237E]">Student Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#1A237E]">Class/Section</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[#1A237E]">Total Annual Fee</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#1A237E]">Amount Paid</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[#1A237E]">Balance Due</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#1A237E]">Last Payment</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-[#1A237E]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-100 hover:bg-[#F5F5F5] transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-600">{student.studentId}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#1A237E]">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.class}-{student.section}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-600">{formatCurrency(student.totalFee)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[150px]">
                        <Progress 
                          value={(student.paidAmount / student.totalFee) * 100} 
                          className="h-2"
                        />
                      </div>
                      <span className="text-sm text-gray-600 min-w-[80px]">
                        {formatCurrency(student.paidAmount)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold text-sm ${
                      student.balanceDue === 0 ? 'text-[#4CAF50]' : 'text-[#EF5350]'
                    }`}>
                      {formatCurrency(student.balanceDue)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.lastPaymentDate}</td>
                  <td className="px-6 py-4">
                    {student.balanceDue > 0 ? (
                      <div className="flex items-center justify-center gap-2">
                        <button className="px-3 py-1 bg-[#FF9800] text-white text-xs rounded-md hover:bg-[#F57C00] transition-colors">
                          Remind
                        </button>
                        <button 
                          onClick={() => handleCollectPaymentClick(student)}
                          className="px-3 py-1 bg-[#00897B] text-white text-xs rounded-md hover:bg-[#00796B] transition-colors"
                        >
                          Collect
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="px-3 py-1 bg-[#E8F5E9] text-[#4CAF50] text-xs rounded-md font-medium">
                          Paid
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BentoCard>

      {/* Payment Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#FAFAFA]">
                <h3 className="text-xl font-semibold text-[#1A237E]">Collect Payment</h3>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6 p-4 bg-[#E3F2FD] rounded-lg border border-[#BBDEFB]">
                  <p className="text-sm text-gray-600 mb-1">Student Details</p>
                  <p className="font-semibold text-[#1A237E]">{selectedStudent.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedStudent.studentId} • Class {selectedStudent.class}-{selectedStudent.section}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount (₹)</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00897B] text-lg font-medium"
                    placeholder="Enter amount"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">Balance Due: {formatCurrency(selectedStudent.balanceDue)}</span>
                    <button 
                      onClick={() => setPaymentAmount(selectedStudent.balanceDue.toString())}
                      className="text-xs text-[#00897B] font-medium hover:underline"
                    >
                      Pay Full Amount
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                        paymentMethod === 'card' 
                          ? 'border-[#00897B] bg-[#E0F2F1] text-[#00897B]' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="text-xs font-medium">Card</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('bank')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                        paymentMethod === 'bank' 
                          ? 'border-[#00897B] bg-[#E0F2F1] text-[#00897B]' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                      <span className="text-xs font-medium">Bank Transfer</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                        paymentMethod === 'cash' 
                          ? 'border-[#00897B] bg-[#E0F2F1] text-[#00897B]' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Wallet className="w-5 h-5" />
                      <span className="text-xs font-medium">Cash</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleProcessPayment}
                  disabled={isProcessing || !paymentAmount || parseFloat(paymentAmount) <= 0}
                  className="w-full py-3 bg-[#00897B] text-white font-medium rounded-lg hover:bg-[#00796B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    `Process Payment of ${formatCurrency(parseFloat(paymentAmount) || 0)}`
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
