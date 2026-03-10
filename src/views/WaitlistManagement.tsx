import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle, Mail, Smartphone, Bell, X, Trash2, XCircle } from 'lucide-react';
import { waitlistEntries as initialEntries, currentStudent } from '../data/mockData';
import { useToast } from '../App';
import type { WaitlistEntry, WaitlistProbability } from '../data/types';

function ProbBadge({ prob }: { prob: WaitlistProbability }) {
  const cls = { High: 'bg-success-bg text-success border-success/30', Medium: 'bg-warning-bg text-[#92400e] border-warning/30', Low: 'bg-error-bg text-error border-error/30' }[prob];
  return <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${cls}`}>{prob}</span>;
}

export default function WaitlistManagement() {
  const [entries, setEntries] = useState<WaitlistEntry[]>(initialEntries);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState({ email: true, sms: true, push: true, dailyDigest: false });
  const [showSeatToast, setShowSeatToast] = useState(false);
  const [showCancelToast, setShowCancelToast] = useState(false);

  const toggleAutoEnroll = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    const newAutoEnroll = !entry.autoEnroll;
    setEntries(prev => prev.map(e => e.id !== id ? e : { ...e, autoEnroll: newAutoEnroll }));
    addToast({ type: 'info', message: newAutoEnroll ? 'Auto-enroll enabled' : 'Auto-enroll disabled', detail: `${entry.course.code} — ${newAutoEnroll ? "Auto-enroll when seat opens" : "Notify only"}` });
  };

  const confirmDrop = () => {
    if (!dropTarget) return;
    const entry = entries.find(e => e.id === dropTarget);
    setEntries(prev => prev.filter(e => e.id !== dropTarget));
    setDropTarget(null);
    if (entry) addToast({ type: 'warning', message: 'Dropped from waitlist', detail: `${entry.course.code}` });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-text-primary">Waitlist Management</h2>
        <p className="text-xs text-text-secondary mt-0.5">Track and manage your course waitlist positions</p>
      </div>

      {/* Header Card */}
      <div className="bg-uw-purple rounded-lg p-4 text-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-bold">{currentStudent.name}'s Waitlist Dashboard</h3>
            <p className="text-[11px] text-[#8ab0c4] mt-0.5">{currentStudent.id} · {currentStudent.major} · {currentStudent.standing}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button onClick={() => { setShowSeatToast(true); setTimeout(() => setShowSeatToast(false), 6000); }}
              className="px-2.5 py-1 rounded text-[11px] font-medium border border-[#2d4a6a] text-[#8ab0c4] hover:bg-[#152240] hover:text-white">Demo: Seat Available</button>
            <button onClick={() => { setShowCancelToast(true); setTimeout(() => setShowCancelToast(false), 6000); }}
              className="px-2.5 py-1 rounded text-[11px] font-medium border border-[#2d4a6a] text-[#8ab0c4] hover:bg-[#152240] hover:text-white">Demo: Course Cancelled</button>
            <div className="flex items-center gap-1.5 ml-2">
              <div className="w-2 h-2 rounded-full bg-uw-gold" />
              <span className="text-xs font-medium">{entries.length} active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Table */}
      <div className="bg-card-bg border border-border rounded-lg overflow-hidden">
        <div className="bg-section-bg border-b border-border px-4 py-2.5 flex items-center justify-between">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Active Waitlists</h3>
          <span className="text-[11px] text-text-muted">{entries.length}/5 slots used</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-border bg-white">
              <th className="text-left px-4 py-2.5 text-text-secondary font-bold whitespace-nowrap">Course</th>
              <th className="text-left px-4 py-2.5 text-text-secondary font-bold whitespace-nowrap">Section</th>
              <th className="text-center px-4 py-2.5 text-text-secondary font-bold whitespace-nowrap">Position</th>
              <th className="text-left px-4 py-2.5 text-text-secondary font-bold whitespace-nowrap">Est. Wait</th>
              <th className="text-center px-4 py-2.5 text-text-secondary font-bold whitespace-nowrap">Probability</th>
              <th className="text-center px-4 py-2.5 text-text-secondary font-bold whitespace-nowrap">Auto-Enroll</th>
              <th className="px-4 py-2.5"></th>
            </tr></thead>
            <tbody>
              <AnimatePresence>
                {entries.map((e, i) => (
                  <motion.tr key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className={`border-t border-border hover:bg-uw-purple-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                    <td className="px-4 py-2.5">
                      <p className="font-mono font-bold text-uw-purple">{e.course.code}</p>
                      <p className="text-[11px] text-text-secondary mt-0.5">{e.course.title}</p>
                    </td>
                    <td className="px-4 py-2.5 text-text-secondary">Sec {e.section}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="font-bold text-text-primary text-sm">{e.position}</span>
                      <span className="text-text-muted"> / {e.totalWaitlisted}</span>
                    </td>
                    <td className="px-4 py-2.5"><span className="flex items-center gap-1 text-text-secondary"><Clock className="w-3 h-3" />{e.estimatedWait}</span></td>
                    <td className="px-4 py-2.5 text-center"><ProbBadge prob={e.probability} /></td>
                    <td className="px-4 py-2.5 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => toggleAutoEnroll(e.id)} className="relative" aria-label={`Auto-enroll ${e.autoEnroll ? 'on' : 'off'}`}>
                          <div className={`w-9 h-5 rounded-full transition-colors ${e.autoEnroll ? 'bg-uw-purple' : 'bg-border-strong'}`} />
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${e.autoEnroll ? 'translate-x-4' : ''}`} />
                        </button>
                        <span className="text-[11px] text-text-muted font-medium">{e.autoEnroll ? 'ON' : 'OFF'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => setDropTarget(e.id)} className="px-2.5 py-1 rounded text-[11px] font-medium border border-error text-error hover:bg-error hover:text-white transition-colors flex items-center gap-1">
                        <Trash2 className="w-3 h-3" />Drop
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {entries.length === 0 && <div className="text-center py-12 text-text-muted text-xs">You are not on any waitlists.</div>}
      </div>

      {/* Notification Preferences */}
      <div className="bg-card-bg border border-border rounded-lg overflow-hidden">
        <div className="bg-section-bg border-b border-border px-4 py-2.5">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Notification Preferences</h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={notifications.email} onChange={() => setNotifications(p => ({ ...p, email: !p.email }))} className="w-3.5 h-3.5 accent-[#1B2A4A]" />
              <Mail className="w-4 h-4 text-text-secondary" />
              <div><p className="text-xs font-medium text-text-primary">Email Notifications</p><p className="text-[11px] text-text-secondary">{currentStudent.email}</p></div>
            </label>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-success-bg text-success border border-success/30">Verified</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={notifications.sms} onChange={() => setNotifications(p => ({ ...p, sms: !p.sms }))} className="w-3.5 h-3.5 accent-[#1B2A4A]" />
              <Smartphone className="w-4 h-4 text-text-secondary" />
              <div><p className="text-xs font-medium text-text-primary">SMS Notifications</p><p className="text-[11px] text-text-secondary">+1 (206) 555-0123</p></div>
            </label>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-success-bg text-success border border-success/30">Verified</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={notifications.push} onChange={() => setNotifications(p => ({ ...p, push: !p.push }))} className="w-3.5 h-3.5 accent-[#1B2A4A]" />
              <Bell className="w-4 h-4 text-text-secondary" />
              <span className="text-xs font-medium text-text-primary">Push Notifications</span>
            </label>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-section-bg text-text-secondary border border-border">Enabled</span>
          </div>
          <label className="flex items-center gap-3 py-2">
            <input type="checkbox" checked={notifications.dailyDigest} onChange={() => setNotifications(p => ({ ...p, dailyDigest: !p.dailyDigest }))} className="w-3.5 h-3.5 accent-[#1B2A4A]" />
            <Mail className="w-4 h-4 text-text-secondary" />
            <span className="text-xs font-medium text-text-primary">Daily Digest Email</span>
          </label>
        </div>
        <div className="px-4 py-3 border-t border-border bg-section-bg">
          <button className="w-full py-2 rounded text-xs border border-border text-text-secondary hover:bg-white font-medium">Manage Contact Information</button>
        </div>
      </div>

      {/* Seat Toast */}
      <AnimatePresence>
        {showSeatToast && (
          <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }} className="fixed bottom-6 right-6 z-50 max-w-sm bg-card-bg border border-success/30 rounded-lg p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-success-bg flex items-center justify-center shrink-0"><CheckCircle className="w-4 h-4 text-success" /></div>
              <div className="flex-1"><p className="text-xs font-bold text-text-primary">Seat Available!</p><p className="text-[11px] text-text-secondary mt-0.5">A seat opened in CS 415 Section 001</p><p className="text-[11px] text-success mt-0.5">You have been auto-enrolled.</p>
                <button className="text-[11px] text-uw-purple hover:underline mt-1.5 font-medium">View Details</button></div>
              <button onClick={() => setShowSeatToast(false)} className="text-text-muted hover:text-text-primary"><X className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TB1-45: Course Cancellation Toast */}
      <AnimatePresence>
        {showCancelToast && (
          <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }} className="fixed bottom-6 right-6 z-50 max-w-sm bg-card-bg border border-error/30 rounded-lg p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-error-bg flex items-center justify-center shrink-0"><XCircle className="w-4 h-4 text-error" /></div>
              <div className="flex-1">
                <p className="text-xs font-bold text-text-primary">Course Section Cancelled</p>
                <p className="text-[11px] text-text-secondary mt-0.5">MATH 310 Section 001 has been cancelled due to low enrollment.</p>
                <p className="text-[11px] text-text-secondary mt-0.5">Effective: March 10, 2026</p>
                <p className="text-[11px] text-error mt-1 font-medium">Action Required: Choose an alternate section or contact your advisor.</p>
                <div className="flex gap-2 mt-1.5">
                  <button className="text-[11px] text-uw-purple hover:underline font-medium">View Alternate Sections</button>
                  <button className="text-[11px] text-text-secondary hover:underline">Contact Advisor</button>
                </div>
              </div>
              <button onClick={() => setShowCancelToast(false)} className="text-text-muted hover:text-text-primary"><X className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop Modal */}
      <AnimatePresence>
        {dropTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDropTarget(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-card-bg rounded-lg shadow-xl max-w-sm w-full border border-border">
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-error-bg flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-6 h-6 text-error" /></div>
                <h3 className="text-sm font-bold text-text-primary mb-1">Drop from Waitlist?</h3>
                <p className="text-xs text-text-secondary">You will lose your position for <span className="font-bold font-mono text-text-primary">{entries.find(e => e.id === dropTarget)?.course.code}</span>.</p>
                <p className="text-[11px] text-text-muted mt-0.5">This action cannot be undone.</p>
              </div>
              <div className="flex gap-3 px-5 py-4 border-t border-border bg-section-bg rounded-b-lg">
                <button onClick={() => setDropTarget(null)} className="flex-1 py-2 rounded text-xs font-semibold bg-white border border-border text-text-primary hover:bg-page-bg">Cancel</button>
                <button onClick={confirmDrop} className="flex-1 py-2 rounded text-xs font-semibold bg-error text-white hover:bg-red-700">Drop</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
