import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, CheckCircle, XCircle, MessageSquare, Shield, AlertTriangle } from 'lucide-react';
import { students, courses, overrideRequests, waitlistEntries } from '../data/mockData';
import type { Student, OverrideRequest } from '../data/types';

const TABS = ['Current Schedule', 'Waitlists', 'Degree Progress', 'Overrides'] as const;
type Tab = typeof TABS[number];

export default function AdvisorDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student>(students[0]);
  const [activeTab, setActiveTab] = useState<Tab>('Current Schedule');
  const [overrides, setOverrides] = useState<OverrideRequest[]>(overrideRequests);
  const [showExport, setShowExport] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleOverride = (id: string, action: 'approved' | 'denied') => setOverrides(prev => prev.map(o => o.id === id ? { ...o, status: action } : o));
  const studentCourses = courses.slice(0, 4);
  const fmtTime = (t: string) => { const h = parseInt(t.split(':')[0]); const m = t.split(':')[1]; return `${h > 12 ? h - 12 : h}:${m}`; };

  const degreeProgress = [
    { category: 'Core CS', completed: 8, required: 10 },
    { category: 'Mathematics', completed: 4, required: 4 },
    { category: 'Electives', completed: 3, required: 5 },
    { category: 'General Ed', completed: 10, required: 12 },
    { category: 'Lab/Research', completed: 1, required: 2 },
  ];

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-bold text-text-primary">Advisor Dashboard</h2><p className="text-sm text-text-secondary mt-1">Manage student registrations and approvals</p></div>
      <hr className="border-border" />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input type="text" placeholder="Search students by name or ID..." value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
          onFocus={() => setShowSearch(true)} onBlur={() => setTimeout(() => setShowSearch(false), 200)}
          className="w-full bg-card-bg border border-border rounded-md pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-uw-purple" />
        <AnimatePresence>
          {showSearch && searchQuery && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="absolute top-full mt-1 left-0 right-0 bg-card-bg border border-border rounded-lg shadow-lg z-10">
              {filteredStudents.map(s => (
                <button key={s.id} onClick={() => { setSelectedStudent(s); setSearchQuery(''); setShowSearch(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-section-bg transition-colors flex justify-between cursor-pointer">
                  <div><p className="text-sm font-medium text-text-primary">{s.name}</p><p className="text-xs text-text-secondary">{s.id} · {s.major}</p></div>
                  <span className="text-xs text-text-muted">{s.standing}</span>
                </button>
              ))}
              {filteredStudents.length === 0 && <p className="px-4 py-3 text-sm text-text-muted">No students found</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Student Card */}
      <div className="bg-card-bg border border-border rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-uw-purple flex items-center justify-center text-white text-xl font-bold shrink-0">
            {selectedStudent.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div><h3 className="text-xl font-bold text-text-primary">{selectedStudent.name}</h3><p className="text-sm text-text-secondary">{selectedStudent.email}</p></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {[
            { label: 'Student ID', value: selectedStudent.id },
            { label: 'Major', value: selectedStudent.major },
            { label: 'GPA', value: selectedStudent.gpa.toFixed(2) },
            { label: 'Standing', value: selectedStudent.standing },
            { label: 'Status', value: selectedStudent.academicStatus },
          ].map(item => (
            <div key={item.label} className="border border-border rounded-md p-3">
              <p className="text-xs text-text-muted mb-0.5">{item.label}</p>
              <p className={`text-sm font-bold ${item.label === 'GPA' ? 'text-uw-purple' : 'text-text-primary'}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
            selectedStudent.academicStatus === 'Good Standing' ? 'bg-success-bg text-success border-success/30' :
            selectedStudent.academicStatus === 'Warning' ? 'bg-warning-bg text-[#92400e] border-warning/30' : 'bg-error-bg text-error border-error/30'
          }`}>Academic Status: {selectedStudent.academicStatus}</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
            selectedStudent.holds.length === 0 ? 'bg-section-bg text-text-secondary border-border' : 'bg-error-bg text-error border-error/30'
          }`}>Holds: {selectedStudent.holds.length === 0 ? 'None' : selectedStudent.holds.join(', ')}</span>
        </div>
      </div>

      {/* Tabs + Export */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex border border-border rounded-md overflow-hidden">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer ${activeTab === tab ? 'bg-uw-purple text-white' : 'bg-card-bg text-text-primary hover:bg-section-bg border-l border-border first:border-l-0'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="relative">
          <button onClick={() => setShowExport(!showExport)} className="px-4 py-2.5 border border-border rounded-md text-sm text-text-secondary hover:bg-section-bg flex items-center gap-2 cursor-pointer">
            <Download className="w-4 h-4" />Export ▾
          </button>
          <AnimatePresence>
            {showExport && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="absolute right-0 mt-1 bg-card-bg border border-border rounded-md shadow-lg z-10 overflow-hidden">
                {['PDF Transcript', 'CSV Data', 'Print View'].map(opt => (
                  <button key={opt} onClick={() => setShowExport(false)} className="w-full px-4 py-2 text-sm text-text-primary hover:bg-section-bg text-left whitespace-nowrap cursor-pointer">{opt}</button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>

          {activeTab === 'Current Schedule' && (
            <div className="bg-card-bg border border-border rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-uw-purple-50 border-b border-border">
                  {['Code', 'Title', 'Instructor', 'Schedule', 'Cr', 'St'].map(h => <th key={h} className="text-left px-4 py-3 text-text-secondary font-semibold">{h}</th>)}
                </tr></thead>
                <tbody>{studentCourses.map((c, i) => (
                  <tr key={c.id} className={`border-t border-border hover:bg-section-bg ${i % 2 ? 'bg-[#fafafa]' : ''}`}>
                    <td className="px-4 py-3 font-mono font-bold text-uw-purple">{c.code}</td>
                    <td className="px-4 py-3 text-text-primary">{c.title}</td>
                    <td className="px-4 py-3 text-text-secondary">{c.instructor}</td>
                    <td className="px-4 py-3 text-text-secondary">{c.days.join('')} {fmtTime(c.startTime)}</td>
                    <td className="px-4 py-3 text-text-primary font-bold text-center">{c.credits}</td>
                    <td className="px-4 py-3"><CheckCircle className="w-5 h-5 text-success" /></td>
                  </tr>
                ))}</tbody>
              </table>
              <div className="px-4 py-3 border-t border-border text-sm text-right font-bold text-text-primary">
                Total Credits: {studentCourses.reduce((s, c) => s + c.credits, 0)}
              </div>
            </div>
          )}

          {activeTab === 'Waitlists' && (
            <div className="bg-card-bg border border-border rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-uw-purple-50 border-b border-border">
                  {['Course', 'Position', 'Est. Wait', 'Probability', 'Date Joined'].map(h => <th key={h} className="text-left px-4 py-3 text-text-secondary font-semibold">{h}</th>)}
                </tr></thead>
                <tbody>{waitlistEntries.slice(0, 4).map((w, i) => (
                  <tr key={w.id} className={`border-t border-border hover:bg-section-bg ${i % 2 ? 'bg-[#fafafa]' : ''}`}>
                    <td className="px-4 py-3 font-mono font-bold text-uw-purple">{w.course.code} — <span className="font-normal text-text-secondary">{w.course.title}</span></td>
                    <td className="px-4 py-3"><span className="font-bold">{w.position}</span> of {w.totalWaitlisted}</td>
                    <td className="px-4 py-3 text-text-secondary">{w.estimatedWait}</td>
                    <td className="px-4 py-3"><span className={`px-3 py-1 rounded-xl text-xs font-semibold border ${
                      w.probability === 'High' ? 'bg-success-bg text-success border-success/30' : w.probability === 'Medium' ? 'bg-warning-bg text-[#92400e] border-warning/30' : 'bg-error-bg text-error border-error/30'
                    }`}>{w.probability}</span></td>
                    <td className="px-4 py-3 text-text-secondary">{w.dateJoined}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}

          {activeTab === 'Degree Progress' && (
            <div className="space-y-4">
              <div className="bg-card-bg border border-border rounded-lg shadow-sm p-5 space-y-4">
                {degreeProgress.map(dp => {
                  const pct = Math.round((dp.completed / dp.required) * 100);
                  return (
                    <div key={dp.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-text-primary">{dp.category}</span>
                        <span className="text-text-secondary">{dp.completed}/{dp.required} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2.5">
                        <motion.div className={`h-2.5 rounded-full ${pct >= 100 ? 'bg-success' : 'bg-uw-purple'}`} initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.5 }} />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-3 border-t border-border text-sm flex justify-between">
                  <span className="font-semibold">Overall Progress</span>
                  <span className="font-bold text-uw-purple">{degreeProgress.reduce((s, d) => s + d.completed, 0)}/{degreeProgress.reduce((s, d) => s + d.required, 0)} courses (79%)</span>
                </div>
              </div>
              <div className="bg-warning-bg border border-warning/30 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div><p className="text-sm font-semibold text-[#92400e]">Co-requisite Warning</p><p className="text-xs text-[#92400e]/80 mt-1">CS 350 requires co-enrollment in CS 261 lab section. Student is not currently enrolled in the lab.</p></div>
              </div>
            </div>
          )}

          {activeTab === 'Overrides' && (
            <div className="space-y-3">
              <h4 className="font-bold text-text-primary">Pending Override Requests ({overrides.filter(o => o.status === 'pending').length})</h4>
              {overrides.map(o => (
                <div key={o.id} className="bg-card-bg border border-border rounded-lg shadow-sm p-5">
                  <p className="text-sm font-bold text-text-primary">{o.student.name} → <span className="font-mono text-uw-purple">{o.course.code}</span> {o.course.title}</p>
                  <p className="text-xs text-text-secondary mt-1">Type: {o.course.prereqStatus === 'not-met' ? 'Prerequisite Override' : 'Capacity Override'}</p>
                  <p className="text-xs text-text-secondary">Reason: {o.reason}</p>
                  <p className="text-xs text-text-muted mt-0.5">Submitted: {o.date}</p>
                  {o.course.prereqStatus === 'not-met' && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-warning"><Shield className="w-3.5 h-3.5" />Prerequisites not met — manual verification required</div>
                  )}
                  <div className="flex gap-3 mt-4">
                    {o.status === 'pending' ? (<>
                      <button onClick={() => handleOverride(o.id, 'denied')} className="px-4 py-2 rounded-md text-sm border border-error text-error hover:bg-error hover:text-white cursor-pointer font-medium flex items-center gap-1"><XCircle className="w-4 h-4" />Deny</button>
                      <button className="px-4 py-2 rounded-md text-sm border border-border text-text-secondary hover:bg-section-bg cursor-pointer font-medium flex items-center gap-1"><MessageSquare className="w-4 h-4" />Request More Info</button>
                      <button onClick={() => handleOverride(o.id, 'approved')} className="px-4 py-2 rounded-md text-sm bg-success text-white hover:bg-green-700 cursor-pointer font-medium flex items-center gap-1 ml-auto"><CheckCircle className="w-4 h-4" />Approve ✓</button>
                    </>) : (
                      <span className={`px-4 py-2 rounded-md text-sm font-medium ${o.status === 'approved' ? 'bg-success-bg text-success' : 'bg-error-bg text-error'}`}>
                        {o.status === 'approved' ? '✓ Approved' : '✗ Denied'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
