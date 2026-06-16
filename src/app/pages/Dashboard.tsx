import BentoCard from "../components/BentoCard";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  UserPlus, 
  DollarSign, 
  ClipboardList, 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  CalendarCheck2,
} from "lucide-react";

// Revenue data — all 12 months of the academic year
const revenueData = [
  { month: 'Apr', expected: 450000, collected: 420000 },
  { month: 'May', expected: 480000, collected: 465000 },
  { month: 'Jun', expected: 490000, collected: 475000 },
  { month: 'Jul', expected: 500000, collected: 485000 },
  { month: 'Aug', expected: 520000, collected: 500000 },
  { month: 'Sep', expected: 510000, collected: 495000 },
  { month: 'Oct', expected: 530000, collected: 510000 },
  { month: 'Nov', expected: 520000, collected: 505000 },
  { month: 'Dec', expected: 540000, collected: 520000 },
  { month: 'Jan', expected: 550000, collected: 535000 },
  { month: 'Feb', expected: 530000, collected: 515000 },
  { month: 'Mar', expected: 560000, collected: 545000 },
];

// Enrollment YoY
const enrollmentYoY = [
  { year: "2022", students: 980 },
  { year: "2023", students: 1080 },
  { year: "2024", students: 1175 },
  { year: "2025", students: 1260 },
  { year: "2026", students: 1342 },
];

// Grade distribution for this year
const gradeDist = [
  { name: "Gr 1-5",  value: 420, color: "#1A237E" },
  { name: "Gr 6-8",  value: 380, color: "#00897B" },
  { name: "Gr 9-10", value: 310, color: "#FF9800" },
  { name: "Gr 11-12", value: 232, color: "#EF5350" },
];

// Admissions pipeline
const admissionStats = [
  { label: 'Inquiries', count: 145 },
  { label: 'Visits', count: 87 },
  { label: 'Enrolled', count: 43 },
];

// Year-over-Year comparison
const thisYearCollected = revenueData.reduce((s, d) => s + d.collected, 0);
const lastYearCollected = 5420000;
const yoyDelta = ((thisYearCollected - lastYearCollected) / lastYearCollected * 100).toFixed(1);
const yoyPositive = thisYearCollected >= lastYearCollected;

const formatINR = (v: number) => `₹${(v / 100000).toFixed(1)}L`;

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-[#FAFAFA] min-h-screen"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1A237E] mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back. Here's your school overview for this academic year.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={Users} tone="indigo" label="Total Students" value="1,342" delta="+6.5%" positive />
        <KpiCard icon={DollarSign} tone="emerald" label="Fee Collected (YTD)" value={formatINR(thisYearCollected)} delta={`${yoyPositive ? '+' : ''}${yoyDelta}%`} positive={yoyPositive} />
        <KpiCard icon={CalendarCheck2} tone="amber" label="Avg Attendance" value="93%" delta="+1.1%" positive />
        <KpiCard icon={GraduationCap} tone="rose" label="Admissions (This Year)" value="43" delta="+8 vs last yr" positive />
      </div>

      <motion.div 
        className="grid grid-cols-12 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Revenue — Full Width, All 12 months */}
        <BentoCard className="col-span-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1A237E]">Monthly Revenue Overview</h2>
              <p className="text-sm text-gray-600 mt-1">Expected vs Collected — Full Academic Year</p>
            </div>
            <div className={`flex items-center gap-2 ${yoyPositive ? 'bg-[#E8F5E9] text-[#4CAF50]' : 'bg-[#FFEBEE] text-[#EF5350]'} px-4 py-2 rounded-lg`}>
              {yoyPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-semibold">{yoyPositive ? '+' : ''}{yoyDelta}% vs last year</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="month" stroke="#616161" />
              <YAxis stroke="#616161" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, undefined]}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #E0E0E0', borderRadius: '8px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="expected" stroke="#1A237E" strokeWidth={3} name="Expected Fees" />
              <Line type="monotone" dataKey="collected" stroke="#00897B" strokeWidth={3} name="Collected Fees" />
            </LineChart>
          </ResponsiveContainer>
        </BentoCard>

        {/* Enrollment YoY — Left */}
        <BentoCard className="col-span-12 lg:col-span-5">
          <h2 className="text-lg font-semibold text-[#1A237E] mb-4">Enrollment — Year over Year</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={enrollmentYoY}>
              <defs>
                <linearGradient id="gAreaDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00897B" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#00897B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="year" stroke="#616161" />
              <YAxis stroke="#616161" />
              <Tooltip />
              <Area dataKey="students" stroke="#00897B" strokeWidth={2.5} fill="url(#gAreaDash)" />
            </AreaChart>
          </ResponsiveContainer>
        </BentoCard>

        {/* Grade Distribution — Right */}
        <BentoCard className="col-span-12 lg:col-span-3">
          <h2 className="text-lg font-semibold text-[#1A237E] mb-4">Grade Distribution</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={gradeDist} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={2}>
                {gradeDist.map((g) => <Cell key={g.name} fill={g.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {gradeDist.map((g) => (
              <div key={g.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: g.color }} />
                <span className="flex-1 text-gray-700">{g.name}</span>
                <span className="font-semibold text-[#1A237E]">{g.value}</span>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Quick Actions + Admissions Pipeline — Right */}
        <BentoCard className="col-span-12 lg:col-span-4">
          <h2 className="text-lg font-semibold text-[#1A237E] mb-4">Admissions Pipeline</h2>
          <div className="flex justify-between items-center gap-4 mb-5">
            {admissionStats.map((stat, index) => (
              <div key={index} className="flex-1 text-center">
                <div className="text-2xl font-bold text-[#1A237E]">{stat.count}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-sm mb-6">
            <span className="text-gray-600">Conversion Rate</span>
            <span className="font-semibold text-[#00897B]">29.7%</span>
          </div>

          <h2 className="text-lg font-semibold text-[#1A237E] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate('/students')} className="flex flex-col items-center justify-center p-4 bg-[#E3F2FD] hover:bg-[#BBDEFB] rounded-xl transition-colors group">
              <div className="w-10 h-10 bg-[#00897B] rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-[#1A237E]">Add Student</span>
            </button>
            <button onClick={() => navigate('/fees')} className="flex flex-col items-center justify-center p-4 bg-[#E8F5E9] hover:bg-[#C8E6C9] rounded-xl transition-colors group">
              <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-[#1A237E]">Collect Fee</span>
            </button>
            <button onClick={() => navigate('/attendance')} className="flex flex-col items-center justify-center p-4 bg-[#FFF3E0] hover:bg-[#FFE0B2] rounded-xl transition-colors group">
              <div className="w-10 h-10 bg-[#FF9800] rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-[#1A237E]">Attendance</span>
            </button>
            <button onClick={() => navigate('/admissions')} className="flex flex-col items-center justify-center p-4 bg-[#F3E5F5] hover:bg-[#E1BEE7] rounded-xl transition-colors group">
              <div className="w-10 h-10 bg-[#9C27B0] rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-[#1A237E]">Admissions</span>
            </button>
          </div>
        </BentoCard>
      </motion.div>
    </motion.div>
  );
}

function KpiCard({ icon: Icon, tone, label, value, delta, positive }: { icon: any; tone: "indigo"|"emerald"|"amber"|"rose"; label: string; value: string; delta: string; positive: boolean }) {
  const tones = {
    indigo:  "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber:   "bg-amber-50 text-amber-600",
    rose:    "bg-rose-50 text-rose-600",
  } as const;
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <BentoCard>
        <div className="flex items-start justify-between">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tones[tone]}`}><Icon className="h-5 w-5" /></div>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{delta}</span>
        </div>
        <div className="mt-3 text-xs text-gray-500">{label}</div>
        <div className="text-2xl font-semibold text-[#1A237E]">{value}</div>
      </BentoCard>
    </motion.div>
  );
}
