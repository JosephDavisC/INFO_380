import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Plus, ShieldCheck, AlertTriangle, Clock, RefreshCw, Shield } from 'lucide-react';
import { currentStudent } from '../data/mockData';
import type { Course, DayOfWeek, CourseSection } from '../data/types';

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8);
const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'M', label: 'MON' }, { key: 'T', label: 'TUE' }, { key: 'W', label: 'WED' }, { key: 'Th', label: 'THU' }, { key: 'F', label: 'FRI' },
];

function timeToRow(time: string): number { const [h, m] = time.split(':').map(Number); return (h - 8) * 60 + m; }

function hasConflict(a: Course, b: Course): boolean {
  return a.days.some(d => b.days.includes(d)) && a.startTime < b.endTime && b.startTime < a.endTime;
}
function getConflicts(cart: Course[]): Map<string, string[]> {
  const m = new Map<string, string[]>();
  for (let i = 0; i < cart.length; i++) for (let j = i + 1; j < cart.length; j++) if (hasConflict(cart[i], cart[j])) {
    m.set(cart[i].id, [...(m.get(cart[i].id) || []), cart[j].code]);
    m.set(cart[j].id, [...(m.get(cart[j].id) || []), cart[i].code]);
  }
  return m;
}

const fmtTime = (t: string) => { const h = parseInt(t); const m = t.split(':')[1]; return `${h > 12 ? h - 12 : h}:${m}`; };

// Course block colors (muted tones)
const COURSE_COLORS = [
  { bg: '#d4e6f1', border: '#5b9bd5', text: '#2c5f8a' },  // blue
  { bg: '#d5ece9', border: '#0f766e', text: '#0d5f59' },  // teal
  { bg: '#dde5ed', border: '#3B6B8A', text: '#1B2A4A' },  // navy
  { bg: '#d4e8ee', border: '#4A90A4', text: '#2a5f6e' },  // steel
  { bg: '#e0e7ef', border: '#4a6a8a', text: '#2d4a6a' },  // slate
  { bg: '#d1ecf1', border: '#17a2b8', text: '#0c5460' },  // cyan
];

interface Props { cart: Course[]; onRemove: (id: string) => void; }

export default function RegistrationCart({ cart, onRemove }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [backupModal, setBackupModal] = useState<Course | null>(null);
  const [backups, setBackups] = useState<Record<string, string[]>>({});
  const [selectedBackups, setSelectedBackups] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [showAutoSwitch, setShowAutoSwitch] = useState(false);

  const totalCredits = cart.reduce((s, c) => s + c.credits, 0);
  const conflicts = getConflicts(cart);
  const hasAnyConflict = conflicts.size > 0;
  const confirmationNumber = 'REG-2026-0304-' + Math.random().toString(36).substring(2, 6).toUpperCase();

  // TB1-44: Registration blockers
  const hasHolds = currentStudent.holds.length > 0;
  const missingCoreqs = cart.filter(c => c.corequisites?.some(cr => !cart.some(x => x.code === cr)));
  const hasBlockers = hasHolds || hasAnyConflict || totalCredits > 18 || missingCoreqs.length > 0;

  // TB1-49: Schedule validation
  const validationResults = cart.length > 0 ? {
    conflicts: hasAnyConflict,
    credits: totalCredits <= 18,
    prerequisites: cart.every(c => c.prereqStatus !== 'not-met'),
    corequisites: missingCoreqs.length === 0,
    backups: Object.keys(backups).length > 0,
  } : null;

  const openBackupModal = (c: Course) => { setBackupModal(c); setSelectedBackups(backups[c.id] || []); };
  const saveBackups = () => { if (backupModal) { setBackups(p => ({ ...p, [backupModal.id]: selectedBackups })); setBackupModal(null); } };
  const toggleBackup = (s: string) => setSelectedBackups(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-text-primary">Registration Cart</h2>
        <p className="text-xs text-text-secondary mt-0.5">Review and submit your course selections</p>
      </div>

      {/* TB1-44: Deadline Reminder Banner */}
      <div className="bg-warning-bg border border-warning/30 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-warning shrink-0" />
          <div>
            <p className="text-xs font-bold text-[#92400e]">Registration Deadline: March 6, 2026 at 11:59 PM</p>
            <p className="text-[11px] text-[#92400e]">2 days remaining — submit before the window closes</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-warning text-white shrink-0">2 days left</span>
      </div>

      {/* TB1-44: Registration Blocker Alerts */}
      {cart.length > 0 && hasBlockers && (
        <div className="bg-error-bg border border-error/30 rounded-lg p-3 space-y-1.5">
          <p className="text-xs font-bold text-error flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" />Registration Blockers Detected</p>
          {hasHolds && <p className="text-[11px] text-error ml-5">• Financial hold on account — <span className="underline cursor-pointer">resolve hold</span></p>}
          {hasAnyConflict && <p className="text-[11px] text-error ml-5">• Schedule time conflicts found — resolve before submitting</p>}
          {totalCredits > 18 && <p className="text-[11px] text-error ml-5">• Credit limit exceeded ({totalCredits}/18 max) — remove a course</p>}
          {missingCoreqs.map(c => <p key={c.id} className="text-[11px] text-error ml-5">• {c.code} requires co-enrollment in {c.corequisites?.filter(cr => !cart.some(x => x.code === cr)).join(', ')}</p>)}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left - Cart List */}
        <div className="lg:w-[320px] shrink-0 space-y-4">
          <div className="bg-card-bg border border-border rounded-lg overflow-hidden">
            <div className="bg-section-bg border-b border-border px-4 py-2.5">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Selected Courses</h3>
            </div>
            <div className="p-4">
              {cart.length === 0 ? (
                <p className="text-text-muted text-xs py-8 text-center">No courses added yet.<br/>Search and add courses to get started.</p>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {cart.map((c, idx) => {
                      const isConflict = conflicts.has(c.id);
                      const hasBackup = backups[c.id]?.length > 0;
                      const color = COURSE_COLORS[idx % COURSE_COLORS.length];
                      return (
                        <motion.div key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                          className={`p-3 rounded border-l-4 ${isConflict ? 'border-error bg-error-bg' : 'bg-white'}`}
                          style={!isConflict ? { borderLeftColor: color.border, backgroundColor: color.bg + '40' } : {}}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-mono font-bold text-xs" style={{ color: isConflict ? undefined : color.text }}>{c.code}</p>
                              <p className="text-xs text-text-primary mt-0.5">{c.title}</p>
                              <p className="text-[11px] text-text-secondary mt-1">{c.days.join('')} {fmtTime(c.startTime)}-{fmtTime(c.endTime)} · {c.credits} cr</p>
                              {isConflict && <p className="text-[11px] text-error mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Conflicts with {conflicts.get(c.id)!.join(', ')}</p>}
                              {hasBackup && <p className="text-[11px] text-success mt-0.5 flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Backup: Sec {backups[c.id].join(', ')}</p>}
                            </div>
                            <button onClick={() => onRemove(c.id)} className="text-text-muted hover:text-error transition-colors p-0.5"><X className="w-4 h-4" /></button>
                          </div>
                          {c.sections && c.sections.length > 1 && (
                            <button onClick={() => openBackupModal(c)} className="mt-2 w-full text-[11px] py-1.5 rounded border border-border text-text-secondary hover:bg-section-bg transition-colors flex items-center justify-center gap-1">
                              <Plus className="w-3 h-3" />{hasBackup ? 'Edit Backup' : 'Add Backup'}
                            </button>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Summary footer */}
            <div className="border-t border-border px-4 py-3 bg-section-bg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-text-primary">Total Credits</span>
                <span className={`text-sm font-bold ${totalCredits > 18 ? 'text-error' : 'text-text-primary'}`}>{totalCredits} / 18</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 mb-3">
                <motion.div className={`h-1.5 rounded-full ${totalCredits > 18 ? 'bg-error' : 'bg-uw-purple'}`} initial={{ width: 0 }} animate={{ width: `${Math.min((totalCredits / 18) * 100, 100)}%` }} />
              </div>
              {/* TB1-49: Validate Schedule */}
              <button onClick={() => setShowValidation(!showValidation)} disabled={cart.length === 0}
                className="w-full py-2 rounded text-xs font-bold transition-colors border border-uw-purple text-uw-purple hover:bg-uw-purple-50 disabled:bg-border disabled:text-text-muted disabled:border-border disabled:cursor-not-allowed mb-2 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />Validate Schedule
              </button>
              <button onClick={() => setShowModal(true)} disabled={cart.length === 0 || hasBlockers}
                className="w-full py-2.5 rounded font-bold text-xs uppercase tracking-wide transition-colors bg-uw-gold text-white hover:bg-uw-gold-hover disabled:bg-border disabled:text-text-muted disabled:cursor-not-allowed">
                Submit Registration
              </button>
              {hasBlockers && cart.length > 0 && <p className="text-[11px] text-error mt-1.5 text-center">Resolve all blockers before submitting</p>}
            </div>
          </div>

          {/* Validation Results */}
          <AnimatePresence>
            {showValidation && validationResults && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-card-bg border border-border rounded-lg overflow-hidden">
                <div className="bg-section-bg border-b border-border px-4 py-2"><p className="text-xs font-bold text-text-primary uppercase tracking-wider">Schedule Validation</p></div>
                <div className="p-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2">{!validationResults.conflicts ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <AlertTriangle className="w-3.5 h-3.5 text-error" />}<span className={!validationResults.conflicts ? 'text-success' : 'text-error'}>{!validationResults.conflicts ? 'No time conflicts' : 'Time conflicts detected'}</span></div>
                  <div className="flex items-center gap-2">{validationResults.credits ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <AlertTriangle className="w-3.5 h-3.5 text-error" />}<span className={validationResults.credits ? 'text-success' : 'text-error'}>{validationResults.credits ? `Credits within limit (${totalCredits}/18)` : `Over credit limit (${totalCredits}/18)`}</span></div>
                  <div className="flex items-center gap-2">{validationResults.prerequisites ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <AlertTriangle className="w-3.5 h-3.5 text-warning" />}<span className={validationResults.prerequisites ? 'text-success' : 'text-[#92400e]'}>{validationResults.prerequisites ? 'All prerequisites met' : 'Some prerequisites unmet'}</span></div>
                  <div className="flex items-center gap-2">{validationResults.corequisites ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <AlertTriangle className="w-3.5 h-3.5 text-warning" />}<span className={validationResults.corequisites ? 'text-success' : 'text-[#92400e]'}>{validationResults.corequisites ? 'Co-requisites satisfied' : 'Missing co-requisites'}</span></div>
                  <div className="flex items-center gap-2">{validationResults.backups ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <Shield className="w-3.5 h-3.5 text-text-muted" />}<span className={validationResults.backups ? 'text-success' : 'text-text-muted'}>{validationResults.backups ? 'Backup sections configured' : 'No backup sections (optional)'}</span></div>
                  <div className="pt-2 border-t border-border">
                    <p className={`font-bold text-xs ${!hasBlockers ? 'text-success' : 'text-error'}`}>{!hasBlockers ? 'Schedule is valid — ready to submit' : 'Issues found — resolve before submitting'}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TB1-50: Auto-Switch Demo */}
          {Object.keys(backups).length > 0 && (
            <div>
              <button onClick={() => setShowAutoSwitch(!showAutoSwitch)}
                className="w-full text-[11px] py-2 rounded border border-uw-gold text-uw-gold hover:bg-uw-gold-light transition-colors flex items-center justify-center gap-1">
                <RefreshCw className="w-3 h-3" />Demo: Simulate Auto-Switch to Backup
              </button>
              <AnimatePresence>
                {showAutoSwitch && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-2 bg-info-bg border border-info/30 rounded-lg p-3">
                    <p className="text-xs font-bold text-info flex items-center gap-1"><RefreshCw className="w-3 h-3" />Auto-Switch Triggered</p>
                    <p className="text-[11px] text-info mt-1">Primary section full. System switched to backup.</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => setShowAutoSwitch(false)} className="px-3 py-1 rounded text-[11px] bg-info text-white font-medium">Confirm</button>
                      <button onClick={() => setShowAutoSwitch(false)} className="px-3 py-1 rounded text-[11px] border border-info text-info font-medium">Cancel</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right - Calendar — styled like MyUW schedule */}
        <div className="flex-1 bg-card-bg border border-border rounded-lg overflow-hidden">
          <div className="bg-section-bg border-b border-border px-4 py-2.5 flex items-center justify-between">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Weekly Schedule</h3>
            {!hasAnyConflict && cart.length > 0 && <span className="text-[11px] text-success flex items-center gap-1"><CheckCircle className="w-3 h-3" />No conflicts</span>}
          </div>
          <div className="p-4 overflow-auto">
            {/* Day headers */}
            <div className="grid grid-cols-[60px_repeat(5,1fr)] min-w-[500px]">
              <div className="border-b-2 border-uw-purple pb-1"></div>
              {DAYS.map(d => (
                <div key={d.key} className="border-b-2 border-uw-purple pb-1 text-center text-[11px] font-bold text-text-primary">{d.label}</div>
              ))}
            </div>
            {/* Time grid with course overlays */}
            <div className="relative grid grid-cols-[60px_repeat(5,1fr)] min-w-[500px]">
              {HOURS.map(h => (
                <div key={h} className="contents">
                  <div className="h-14 border-b border-border text-[10px] text-text-muted px-1 pt-0.5 font-medium text-right pr-2">{h > 12 ? h - 12 : h}{h >= 12 ? 'pm' : 'am'}</div>
                  {DAYS.map(d => <div key={d.key} className="h-14 border-b border-l border-border bg-white" />)}
                </div>
              ))}
              {/* Course blocks — positioned absolutely over the grid */}
              {cart.map((course, idx) => course.days.map(day => {
                const dayIndex = DAYS.findIndex(d => d.key === day);
                if (dayIndex === -1) return null;
                const topMin = timeToRow(course.startTime);
                const heightMin = timeToRow(course.endTime) - topMin;
                const isConflict = conflicts.has(course.id);
                const color = COURSE_COLORS[idx % COURSE_COLORS.length];
                // Each hour row is 56px. 5 day columns start after 60px time label.
                // Day columns are equal width: each is (100% - 60px) / 5
                const topPx = (topMin / 60) * 56;
                const heightPx = (heightMin / 60) * 56;
                return (
                  <motion.div key={`${course.id}-${day}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`absolute rounded-sm text-[10px] overflow-hidden z-10 ${isConflict ? 'ring-2 ring-error' : ''}`}
                    style={{
                      top: `${topPx}px`,
                      height: `${heightPx}px`,
                      left: `calc(60px + ${dayIndex} * ((100% - 60px) / 5) + 2px)`,
                      width: `calc((100% - 60px) / 5 - 4px)`,
                      backgroundColor: color.bg,
                      borderTop: `3px solid ${color.border}`,
                    }}>
                    <div className="px-1.5 py-1">
                      <p className="font-mono font-bold leading-tight" style={{ color: color.text }}>{course.code}</p>
                      <p className="text-[9px] mt-0.5" style={{ color: color.text + '99' }}>{course.location}</p>
                    </div>
                  </motion.div>
                );
              }))}
            </div>
          </div>
        </div>
      </div>

      {/* Backup Modal */}
      <AnimatePresence>
        {backupModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setBackupModal(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-card-bg rounded-lg shadow-xl max-w-md w-full border border-border">
              <div className="px-5 py-3 border-b border-border flex justify-between items-center">
                <h3 className="text-sm font-bold text-text-primary">Backup Sections: <span className="font-mono">{backupModal.code}</span></h3>
                <button onClick={() => setBackupModal(null)} className="text-text-muted hover:text-text-primary"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4">
                <p className="text-xs text-text-secondary mb-3">Select backup sections in case your primary is unavailable:</p>
                <div className="space-y-2">
                  {(backupModal.sections || []).filter(s => s.section !== '001').map((s: CourseSection) => (
                    <label key={s.section} className="flex items-center gap-3 p-2.5 rounded border border-border hover:bg-section-bg">
                      <input type="checkbox" checked={selectedBackups.includes(s.section)} onChange={() => toggleBackup(s.section)} className="w-3.5 h-3.5 accent-[#1B2A4A]" />
                      <div><p className="text-xs text-text-primary font-medium">Section {s.section} — {s.days.length > 0 ? `${s.days.join('')} ${fmtTime(s.startTime)}-${fmtTime(s.endTime)}` : 'Online Async'}</p>
                        <p className="text-[11px] text-text-secondary">{s.enrolled}/{s.capacity} seats · {s.format}</p></div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 px-4 py-3 border-t border-border bg-section-bg rounded-b-lg">
                <button onClick={() => setBackupModal(null)} className="flex-1 py-2 rounded text-xs font-semibold bg-white border border-border text-text-primary hover:bg-page-bg">Cancel</button>
                <button onClick={saveBackups} className="flex-1 py-2 rounded text-xs font-semibold bg-uw-purple text-white hover:bg-uw-purple-hover">Save Backups</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-card-bg rounded-lg shadow-xl max-w-md w-full border border-border text-center">
              <div className="p-6">
                <div className="w-14 h-14 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-7 h-7 text-success" /></div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Registration Successful!</h3>
                <p className="text-xs text-text-secondary">Confirmation #: <span className="font-mono font-bold text-uw-purple">{confirmationNumber}</span></p>
                <div className="text-left my-4 bg-section-bg rounded p-3 space-y-1">
                  <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide mb-1">Enrolled Courses</p>
                  {cart.map(c => <p key={c.id} className="text-xs text-text-primary">• <span className="font-mono font-semibold">{c.code}</span> — {c.title} ({c.credits} cr)</p>)}
                </div>
                <p className="text-sm text-text-primary font-bold">Total Credits: {totalCredits}</p>
                <p className="text-[11px] text-text-secondary mt-1">Confirmation email sent to {currentStudent.email}</p>
              </div>
              <div className="flex gap-3 px-5 py-4 border-t border-border bg-section-bg rounded-b-lg">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded text-xs font-bold border border-uw-gold text-uw-gold hover:bg-uw-gold-light">View Full Schedule</button>
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded text-xs font-bold bg-uw-purple text-white hover:bg-uw-purple-hover">Done</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
