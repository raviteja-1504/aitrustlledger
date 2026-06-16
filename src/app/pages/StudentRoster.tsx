import { useParams, Link, useNavigate } from "react-router";
import BentoCard from "../components/BentoCard";
import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

interface Student {
  id: string;
  rollNo: number;
  name: string;
  section: string;
  attendance: number;
  photo: string;
}

// Mock data generator
const generateStudents = (grade: string): Student[] => {
  const sections = parseInt(grade) <= 4 ? ['A', 'B', 'C'] : parseInt(grade) <= 10 ? ['A', 'B', 'C'] : ['A', 'B'];
  const students: Student[] = [];
  
  const names = [
    'Aarav Sharma', 'Vivaan Singh', 'Aditya Kumar', 'Vihaan Patel', 'Arjun Gupta',
    'Sai Reddy', 'Diya Mehta', 'Ananya Iyer', 'Aadhya Nair', 'Ishaan Rao',
    'Krishna Verma', 'Shaurya Joshi', 'Atharv Shah', 'Advait Desai', 'Dhruv Malhotra',
    'Kavya Singh', 'Kiara Sharma', 'Myra Patel', 'Saanvi Kumar', 'Aarohi Gupta',
    'Navya Reddy', 'Riya Mehta', 'Sara Iyer', 'Pari Nair', 'Ira Rao'
  ];

  let studentId = 1;
  sections.forEach((section) => {
    const studentsPerSection = Math.floor(Math.random() * 5) + 25; // 25-30 students per section
    for (let i = 0; i < studentsPerSection; i++) {
      students.push({
        id: `${grade}-${section}-${studentId}`,
        rollNo: i + 1,
        name: names[Math.floor(Math.random() * names.length)] + ` (${Math.floor(Math.random() * 100)})`,
        section: section,
        attendance: Math.floor(Math.random() * 15) + 85, // 85-100% attendance
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${grade}-${section}-${studentId}`
      });
      studentId++;
    }
  });

  return students;
};

export default function StudentRoster() {
  const { grade } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('A');

  const students = generateStudents(grade || '1');
  const sections = [...new Set(students.map(s => s.section))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.rollNo.toString().includes(searchQuery);
    const matchesSection = selectedSection === 'all' || student.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  // Sort by section and roll number
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a.section !== b.section) {
      return a.section.localeCompare(b.section);
    }
    return a.rollNo - b.rollNo;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-[#FAFAFA] min-h-screen"
    >
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/students')}
          className="flex items-center gap-2 text-[#00897B] hover:text-[#00796B] mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to All Grades</span>
        </button>
        <h1 className="text-3xl font-semibold text-[#1A237E] mb-2">Grade {grade} - Class Roster</h1>
        <p className="text-gray-600">Select a student to view their complete profile</p>
      </div>

      {/* Filters */}
      <BentoCard className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00897B]"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Section:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedSection('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSection === 'all'
                    ? 'bg-[#00897B] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {sections.map(section => (
                <button
                  key={section}
                  onClick={() => setSelectedSection(section)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedSection === section
                      ? 'bg-[#00897B] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Student List */}
      <BentoCard padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-[#F5F5F5]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#1A237E]">Roll No.</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#1A237E]">Photo</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#1A237E]">Student Name</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-[#1A237E]">Section</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[#1A237E]">Attendance %</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-[#1A237E]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-100 hover:bg-[#F5F5F5] transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-[#1A237E]">{student.rollNo}</span>
                  </td>
                  <td className="px-6 py-4">
                    <img 
                      src={student.photo} 
                      alt={student.name}
                      className="w-10 h-10 rounded-full border-2 border-gray-200"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#1A237E]">{student.name}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-[#E3F2FD] text-[#1A237E] rounded-full text-sm font-medium">
                      {student.section}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-semibold ${
                      student.attendance >= 90 ? 'text-[#4CAF50]' :
                      student.attendance >= 75 ? 'text-[#FF9800]' :
                      'text-[#EF5350]'
                    }`}>
                      {student.attendance}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/students/${grade}/${student.id}`}
                      className="inline-block px-4 py-2 bg-[#00897B] text-white rounded-lg hover:bg-[#00796B] transition-colors text-sm"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BentoCard>

      {sortedStudents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No students found matching your criteria.</p>
        </div>
      )}
    </motion.div>
  );
}
