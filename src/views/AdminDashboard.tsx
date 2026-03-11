import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, CheckCircle, XCircle, Bell, Activity, Users, Link2, X, FileText, Download } from 'lucide-react';
import { courses as initialCourses, enrollmentData, auditLog, systemAlerts, atRiskIndicators } from '../data/mockData';
import type { Course } from '../data/types';

function BarChart({ data }: { data: { department: string; enrolled: number; capacity: number }[] }) {
  const maxCap = Math.max(...data.map(d => d.capacity));
  return (
    <div className="space-y-3">
      {data.map(d => {
        const pct = Math.round((d.enrolled / d.capacity) * 100);
        const color = pct >= 90 ? 'bg-error' : pct >= 70 ? 'bg-warning' : 'bg-success';
        return (
          <div key={d.department}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-text-primary">{d.department}</span>
              <span className="text-text-secondary">{d.enrolled}/{d.capacity} ({pct}%)</span>
            </div>
            <div className="w-full bg-border rounded-full h-3">
              <motion.div className={`h-3 rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${(d.enrolled / maxCap) * 100}%` }} transition={{ duration: 0.5 }} />
            </div>
          </div>
        );
      })}
      <div className="flex gap-4 text-xs text-text-muted pt-1">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success inline-block" /> &lt;70%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-warning inline-block" /> 70-90%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-error inline-block" /> &gt;90%</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [courseList, setCourseList] = useState<Course[]>(initialCourses);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [department, setDepartment] = useState('All');
  const [term, setTerm] = useState('Winter 2026');
  const [level, setLevel] = useState('All');
  const [showGenerated, setShowGenerated] = useState(false);
  const [crossListModal, setCrossListModal] = useState<Course | null>(null);
  const [alerts, setAlerts] = useState(systemAlerts);

  const startEdit = (c: Course) => { setEditingId(c.id); setEditValue(String(c.capacity)); };
  const saveEdit = (id: string) => { const n = parseInt(editValue); if (!isNaN(n) && n > 0) setCourseList(p => p.map(c => c.id === id ? { ...c, capacity: n } : c)); setEditingId(null); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-text-primary">Admin Capacity & Reports</h2><p className="text-sm text-text-secondary mt-1">Manage course capacity and view enrollment analytics</p></div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card-bg">
          <Bell className="w-4 h-4 text-warning" /><span className="text-sm text-text-primary">Alerts: <span className="text-warning font-bold">{alerts.length}</span></span>
        </div>
      </div>
      <hr className="border-border" />

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-card-bg border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-warning" /><h3 className="font-bold text-text-primary text-sm">ACTIVE ALERTS</h3></div>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-warning-bg text-[#92400e]">{alerts.length}</span>
          </div>
          <div className="divide-y divide-border">
            {alerts.map(a => (
              <div key={a.id} className={`px-4 py-3 flex items-center justify-between border-l-4 ${
                a.level === 'critical' ? 'bg-error-bg border-error' : a.level === 'warning' ? 'bg-warning-bg border-warning' : 'bg-info-bg border-info'
              }`}>
                <div className="flex items-center gap-3">
                  {a.level === 'critical' && <AlertCircle className="w-4 h-4 text-error" />}
                  {a.level === 'warning' && <AlertTriangle className="w-4 h-4 text-warning" />}
                  {a.level === 'info' && <Info className="w-4 h-4 text-info" />}
                  <span className={`text-xs font-bold uppercase mr-1 ${a.level === 'critical' ? 'text-error' : a.level === 'warning' ? 'text-[#92400e]' : 'text-info'}`}>{a.level}:</span>
                  <span className="text-sm text-text-primary">{a.message}</span>
                </div>
                <button onClick={() => setAlerts(p => p.filter(x => x.id !== a.id))} className="text-text-muted hover:text-text-primary cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two column: Capacity + Enrollment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card-bg border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border font-bold text-text-primary text-sm">COURSE CAPACITY MANAGEMENT</div>
          <div className="overflow-y-auto max-h-[420px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card-bg"><tr className="border-b border-border">
                <th className="text-left px-4 py-2 text-text-secondary font-semibold">Course</th>
                <th className="text-left px-3 py-2 text-text-secondary font-semibold">Enrolled</th>
                <th className="text-left px-3 py-2 text-text-secondary font-semibold">Cap</th>
                <th className="text-left px-3 py-2 text-text-secondary font-semibold">%</th>
                <th className="px-2 py-2"></th>
              </tr></thead>
              <tbody>{courseList.map((c, i) => {
                const pct = Math.round((c.enrolled / c.capacity) * 100);
                return (
                  <tr key={c.id} className={`border-t border-border hover:bg-section-bg ${i % 2 ? 'bg-[#fafafa]' : ''}`}>
                    <td className="px-4 py-2.5"><p className="font-mono font-bold text-uw-purple">{c.code}</p><p className="text-xs text-text-muted truncate max-w-[130px]">{c.title}</p></td>
                    <td className="px-3 py-2.5 font-bold text-text-primary">{c.enrolled}</td>
                    <td className="px-3 py-2.5">
                      {editingId === c.id ? (
                        <div className="flex items-center gap-1">
                          <input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') saveEdit(c.id); if (e.key === 'Escape') setEditingId(null); }}
                            className="w-14 border border-uw-purple rounded px-2 py-1 text-sm text-text-primary focus:outline-none text-center" autoFocus />
                          <button onClick={() => saveEdit(c.id)} className="text-success cursor-pointer"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => setEditingId(null)} className="text-error cursor-pointer"><XCircle className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(c)} className="font-medium text-text-primary hover:text-uw-purple underline decoration-dashed underline-offset-2 cursor-pointer">{c.capacity}</button>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${pct >= 90 ? 'bg-error-bg text-error' : pct >= 70 ? 'bg-warning-bg text-[#92400e]' : 'bg-success-bg text-success'}`}>{pct}%</span>
                    </td>
                    <td className="px-2 py-2.5">{c.crossListed && (
                      <button onClick={() => setCrossListModal(c)} className="text-uw-gold hover:text-uw-gold-hover cursor-pointer" title="Cross-listed"><Link2 className="w-4 h-4" /></button>
                    )}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-border">
            <button onClick={() => setCrossListModal(courseList.find(c => c.crossListed) || null)} className="text-sm text-uw-gold border border-uw-gold rounded-md px-3 py-1.5 hover:bg-uw-gold-light cursor-pointer font-medium">Manage Cross-Listed Courses</button>
          </div>
        </div>

        <div className="bg-card-bg border border-border rounded-lg shadow-sm p-5">
          <h3 className="font-bold text-text-primary text-sm mb-4">ENROLLMENT BY DEPARTMENT</h3>
          <BarChart data={enrollmentData} />
        </div>
      </div>

      {/* Report Builder */}
      <div className="bg-card-bg border border-border rounded-lg shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4"><FileText className="w-4 h-4 text-uw-purple" /><h3 className="font-bold text-text-primary text-sm">REPORT BUILDER</h3></div>
        <div className="flex flex-wrap gap-4 items-end">
          <div><label className="text-xs text-text-muted block mb-1">Department:</label>
            <select value={department} onChange={e => setDepartment(e.target.value)} className="bg-card-bg border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-uw-purple cursor-pointer">
              <option>All</option><option>Computer Science</option><option>Mathematics</option><option>Statistics</option><option>English</option><option>Philosophy</option><option>Informatics</option>
            </select></div>
          <div><label className="text-xs text-text-muted block mb-1">Term:</label>
            <select value={term} onChange={e => setTerm(e.target.value)} className="bg-card-bg border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-uw-purple cursor-pointer">
              <option>Winter 2026</option><option>Winter 2026</option><option>Fall 2025</option>
            </select></div>
          <div><label className="text-xs text-text-muted block mb-1">Level:</label>
            <select value={level} onChange={e => setLevel(e.target.value)} className="bg-card-bg border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-uw-purple cursor-pointer">
              <option>All</option><option>100-level</option><option>200-level</option><option>300-level</option><option>400-level</option>
            </select></div>
          <button onClick={() => setShowGenerated(true)} className="px-5 py-2 rounded-md text-sm font-medium bg-uw-purple text-white hover:bg-uw-purple-hover cursor-pointer">Generate Report</button>
          <button className="px-4 py-2 rounded-md text-sm border border-border text-text-secondary hover:bg-section-bg cursor-pointer flex items-center gap-1"><Download className="w-4 h-4" />Export ▾</button>
        </div>
        <AnimatePresence>
          {showGenerated && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 p-4 bg-success-bg border border-success rounded-md">
              <div className="flex items-center gap-2 text-success mb-1"><CheckCircle className="w-5 h-5" /><span className="text-sm font-semibold">Report Generated Successfully</span></div>
              <p className="text-xs text-text-secondary">{department === 'All' ? 'All Departments' : department} · {term} · {level === 'All' ? 'All Levels' : level}</p>
              <div className="flex gap-2 mt-2">
                <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-uw-purple/10 text-uw-purple hover:bg-uw-purple/20 cursor-pointer">Download PDF</button>
                <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-uw-purple/10 text-uw-purple hover:bg-uw-purple/20 cursor-pointer">Download CSV</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Audit Log + At-Risk + System Perf */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Audit Log */}
        <div className="bg-card-bg border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border font-bold text-text-primary text-sm">RECENT AUDIT LOG</div>
          <div className="divide-y divide-border max-h-[360px] overflow-y-auto">
            {auditLog.map(e => (
              <div key={e.id} className="px-4 py-3 hover:bg-section-bg transition-colors flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                  e.type === 'override-approved' ? 'bg-success' : e.type === 'override-denied' ? 'bg-error' : e.type === 'capacity' ? 'bg-info' : e.type === 'section' ? 'bg-uw-purple' : e.type === 'cancellation' ? 'bg-error' : e.type === 'notification' ? 'bg-[#06b6d4]' : 'bg-uw-gold'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary"><span className="font-bold">{e.action}</span></p>
                  <p className="text-xs text-text-secondary">{e.details}</p>
                  <p className="text-xs text-text-muted">{e.user} · {e.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {/* At-Risk Students */}
          <div className="bg-card-bg border border-border rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-warning" /><h3 className="font-bold text-text-primary text-sm">AT-RISK STUDENTS</h3></div>
            </div>
            <p className="text-3xl font-bold text-warning mb-3">{atRiskIndicators.reduce((s, i) => s + i.count, 0)}</p>
            <p className="text-xs text-text-muted mb-3">students flagged for attention</p>
            <div className="space-y-1.5">
              {atRiskIndicators.map(ind => <p key={ind.category} className="text-sm text-text-primary">• {ind.count} {ind.description}</p>)}
            </div>
            <button className="mt-3 w-full py-2 rounded-md text-sm border border-uw-purple text-uw-purple hover:bg-uw-purple-50 cursor-pointer font-medium">View All Students</button>
          </div>

          {/* System Performance */}
          <div className="bg-card-bg border border-border rounded-lg shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-uw-purple" /><h3 className="font-bold text-text-primary text-sm">SYSTEM PERFORMANCE</h3></div>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-text-muted">Peak Users</p><p className="text-lg font-bold text-text-primary">2,847 <span className="text-xs font-normal text-text-muted">(8:00 AM)</span></p></div>
              <div><p className="text-xs text-text-muted">Avg Response</p><p className="text-lg font-bold text-success">0.8s</p></div>
              <div><p className="text-xs text-text-muted">Uptime</p><p className="text-lg font-bold text-success">99.99%</p></div>
              <div><p className="text-xs text-text-muted">Transactions</p><p className="text-lg font-bold text-text-primary">12,456</p><p className="text-xs text-text-muted">Error Rate: <span className="text-success font-medium">0.3%</span></p></div>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-List Modal */}
      <AnimatePresence>
        {crossListModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setCrossListModal(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-card-bg rounded-lg shadow-xl p-6 max-w-md w-full border border-border">
              <div className="flex justify-between mb-3"><h3 className="font-bold text-text-primary">Manage Cross-Listed Course</h3><button onClick={() => setCrossListModal(null)} className="text-text-muted hover:text-text-primary cursor-pointer"><X className="w-5 h-5" /></button></div>
              <p className="text-sm text-text-secondary mb-3">Primary: <span className="font-mono font-bold text-uw-purple">{crossListModal.code}</span> — {crossListModal.title}</p>
              <p className="text-sm text-text-secondary mb-3">Cross-listed as: <span className="font-bold text-uw-gold">{crossListModal.crossListed?.join(', ')}</span></p>
              <div className="bg-section-bg border border-border rounded-md p-4 mb-4">
                <div className="flex justify-between mb-2"><span className="text-sm text-text-secondary">Shared Capacity:</span><span className="font-bold text-text-primary">{crossListModal.capacity} seats</span></div>
                <p className="text-xs font-semibold text-text-muted mb-2">Current Enrollment:</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm"><span>{crossListModal.code}:</span><span className="text-text-secondary">15 students</span></div>
                  {crossListModal.crossListed?.map((cl, i) => <div key={cl} className="flex justify-between text-sm"><span>{cl}:</span><span className="text-text-secondary">{i === 0 ? 7 : 3} students</span></div>)}
                  <div className="flex justify-between text-sm pt-2 border-t border-border font-bold"><span>Total:</span><span className={crossListModal.enrolled >= crossListModal.capacity ? 'text-error' : 'text-uw-purple'}>{crossListModal.enrolled}/{crossListModal.capacity} ({Math.round((crossListModal.enrolled / crossListModal.capacity) * 100)}%)</span></div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setCrossListModal(null)} className="flex-1 py-2.5 rounded-md text-sm border border-border text-text-primary hover:bg-section-bg cursor-pointer">Cancel</button>
                <button onClick={() => setCrossListModal(null)} className="flex-1 py-2.5 rounded-md text-sm bg-uw-purple text-white hover:bg-uw-purple-hover cursor-pointer">Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
