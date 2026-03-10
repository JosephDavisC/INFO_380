import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, AlertTriangle, Plus, Clock, Link2 } from 'lucide-react';
import { courses, subjects, instructors, waitlistEntries } from '../data/mockData';
import type { Course, DayOfWeek, PrereqStatus } from '../data/types';

const DAYS: DayOfWeek[] = ['M', 'T', 'W', 'Th', 'F', 'Sat'];

function PrereqBadge({ status }: { status: PrereqStatus }) {
  const config = {
    'met': { label: 'Met', bg: 'bg-success-bg', text: 'text-success', border: 'border-success/30' },
    'in-progress': { label: 'In Progress', bg: 'bg-warning-bg', text: 'text-[#92400e]', border: 'border-warning/30' },
    'not-met': { label: 'Not Met', bg: 'bg-error-bg', text: 'text-error', border: 'border-error/30' },
  };
  const c = config[status];
  return <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${c.bg} ${c.text} border ${c.border}`}>{c.label}</span>;
}

function FormatBadge({ format }: { format: string }) {
  const cls = format === 'In-Person' ? 'bg-[#e1e8ef] text-[#1B2A4A] border-[#1B2A4A]/20'
    : format === 'Online' ? 'bg-[#ccfbf1] text-[#0f766e] border-[#0f766e]/20'
    : 'bg-info-bg text-[#1e40af] border-[#1e40af]/20';
  return <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${cls}`}>{format}</span>;
}

function SeatsBadge({ enrolled, capacity }: { enrolled: number; capacity: number }) {
  const avail = capacity - enrolled;
  if (avail <= 0) return <span className="text-error font-bold text-xs">FULL</span>;
  const cls = avail <= 5 ? 'text-[#92400e] font-semibold' : 'text-success font-medium';
  return <span className={`text-xs ${cls}`}>{enrolled}/{capacity}</span>;
}

function hasConflictWithCart(course: Course, cart: Course[]): string | null {
  for (const c of cart) {
    if (course.days.some(d => c.days.includes(d)) && course.startTime < c.endTime && c.startTime < course.endTime) return c.code;
  }
  return null;
}

interface Props { onAddToCart: (c: Course) => void; cartIds: Set<string>; cart: Course[]; }

const waitlistCourseIds = new Set(waitlistEntries.map(w => w.course.id));

export default function CourseSearch({ onAddToCart, cartIds, cart }: Props) {
  const [search, setSearch] = useState('');
  const [selectedDays, setSelectedDays] = useState<Set<DayOfWeek>>(new Set());
  const [timePeriod, setTimePeriod] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState('All Subjects');
  const [instructor, setInstructor] = useState('All Instructors');
  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(new Set());
  const [openOnly, setOpenOnly] = useState(false);
  const [hideConflicts, setHideConflicts] = useState(false);
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'code' | 'title' | 'credits' | 'seats' | 'waitlist'>('relevance');

  const toggleDay = (d: DayOfWeek) => { const n = new Set(selectedDays); n.has(d) ? n.delete(d) : n.add(d); setSelectedDays(n); };
  const toggleTime = (t: string) => { const n = new Set(timePeriod); n.has(t) ? n.delete(t) : n.add(t); setTimePeriod(n); };
  const toggleFormat = (f: string) => { const n = new Set(selectedFormats); n.has(f) ? n.delete(f) : n.add(f); setSelectedFormats(n); };

  const activeFilterCount = (selectedDays.size > 0 ? 1 : 0) + timePeriod.size + (subject !== 'All Subjects' ? 1 : 0) +
    (instructor !== 'All Instructors' ? 1 : 0) + selectedFormats.size + (openOnly ? 1 : 0) + (hideConflicts ? 1 : 0);

  const clearAll = () => { setSelectedDays(new Set()); setTimePeriod(new Set()); setSubject('All Subjects'); setInstructor('All Instructors'); setSelectedFormats(new Set()); setOpenOnly(false); setHideConflicts(false); };

  const filtered = useMemo(() => {
    const list = courses.filter(c => {
      const q = search.toLowerCase();
      if (q && !c.code.toLowerCase().includes(q) && !c.title.toLowerCase().includes(q) && !c.instructor.toLowerCase().includes(q)) return false;
      if (selectedDays.size > 0 && !c.days.some(d => selectedDays.has(d))) return false;
      if (timePeriod.has('Morning') && parseInt(c.startTime) >= 12) return false;
      if (timePeriod.has('Afternoon') && (parseInt(c.startTime) < 12 || parseInt(c.startTime) >= 17)) return false;
      if (timePeriod.has('Evening') && parseInt(c.startTime) < 17) return false;
      if (subject !== 'All Subjects' && c.subject !== subject) return false;
      if (instructor !== 'All Instructors' && c.instructor !== instructor) return false;
      if (selectedFormats.size > 0 && !selectedFormats.has(c.format)) return false;
      if (openOnly && c.enrolled >= c.capacity) return false;
      if (hideConflicts && hasConflictWithCart(c, cart)) return false;
      return true;
    });
    if (sortBy === 'code') list.sort((a, b) => a.code.localeCompare(b.code));
    else if (sortBy === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === 'credits') list.sort((a, b) => b.credits - a.credits);
    else if (sortBy === 'seats') list.sort((a, b) => (b.capacity - b.enrolled) - (a.capacity - a.enrolled));
    else if (sortBy === 'waitlist') list.sort((a, b) => b.waitlistCount - a.waitlistCount);
    return list;
  }, [search, selectedDays, timePeriod, subject, instructor, selectedFormats, openOnly, hideConflicts, cart, sortBy]);

  const fmtTime = (t: string) => { const h = parseInt(t.split(':')[0]); const m = t.split(':')[1]; return `${h > 12 ? h - 12 : h}:${m} ${h >= 12 ? 'PM' : 'AM'}`; };

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h2 className="text-xl font-bold text-text-primary">Find Courses</h2>
        <p className="text-xs text-text-secondary mt-0.5">Search Winter 2026 courses by code, title, or instructor</p>
      </div>

      {/* Search bar — like MyPlan */}
      <div className="bg-card-bg border border-border rounded-lg p-4">
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-2 block">Course search by:</label>
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Try: course code, title, instructor name, or keyword" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-border rounded px-3 pl-9 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-uw-purple focus:border-uw-purple" />
          </div>
          <button onClick={() => {}} className="px-6 py-2.5 rounded bg-uw-gold text-white text-sm font-bold hover:bg-uw-gold-hover transition-colors">
            Update
          </button>
          {search && (
            <button onClick={() => setSearch('')} className="text-sm text-uw-purple hover:underline font-medium">
              Clear Search
            </button>
          )}
        </div>
        {/* Meeting days checkboxes inline — like MyPlan */}
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-xs font-bold text-text-secondary">Meeting days:</span>
          {DAYS.map(d => (
            <label key={d} className="flex items-center gap-1.5 text-xs text-text-primary">
              <input type="checkbox" checked={selectedDays.has(d)} onChange={() => toggleDay(d)} className="w-3.5 h-3.5 accent-[#1B2A4A]" />
              {d}
            </label>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm font-bold text-text-primary">{filtered.length} of {courses.length} results{search ? ` for '${search}'` : ''}</p>

      {/* Two-column: Sidebar Filters + Results Table — like MyPlan */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left Sidebar Filters */}
        <div className="lg:w-[240px] shrink-0">
          <div className="bg-card-bg border border-border rounded-lg overflow-hidden sticky top-20">
            <div className="bg-section-bg border-b border-border px-4 py-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Filters</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearAll} className="text-[11px] text-uw-purple hover:underline font-medium">Clear All</button>
              )}
            </div>
            <div className="p-4 space-y-5 text-xs max-h-[calc(100vh-160px)] overflow-y-auto">
              {/* Subject */}
              <div>
                <label className="font-bold text-text-primary block mb-1.5">Subject</label>
                <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-white border border-border rounded px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-uw-purple">
                  {subjects.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Instructor */}
              <div>
                <label className="font-bold text-text-primary block mb-1.5">Instructor</label>
                <select value={instructor} onChange={e => setInstructor(e.target.value)} className="w-full bg-white border border-border rounded px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-uw-purple">
                  {instructors.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>

              {/* Time Range */}
              <div>
                <label className="font-bold text-text-primary block mb-1.5">Time of Day</label>
                <div className="space-y-1.5">
                  {['Morning', 'Afternoon', 'Evening'].map(t => (
                    <label key={t} className="flex items-center gap-2 text-text-primary">
                      <input type="checkbox" checked={timePeriod.has(t)} onChange={() => toggleTime(t)} className="w-3.5 h-3.5 accent-[#1B2A4A]" />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="font-bold text-text-primary block mb-1.5">Format</label>
                <div className="space-y-1.5">
                  {['In-Person', 'Online', 'Hybrid'].map(f => (
                    <label key={f} className="flex items-center gap-2 text-text-primary">
                      <input type="checkbox" checked={selectedFormats.has(f)} onChange={() => toggleFormat(f)} className="w-3.5 h-3.5 accent-[#1B2A4A]" />
                      {f}
                    </label>
                  ))}
                </div>
              </div>

              {/* Exclude options — like MyPlan */}
              <div>
                <label className="font-bold text-text-primary block mb-1.5">Options</label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-text-primary">
                    <input type="checkbox" checked={openOnly} onChange={() => setOpenOnly(!openOnly)} className="w-3.5 h-3.5 accent-[#1B2A4A]" />
                    Open seats only
                  </label>
                  <label className="flex items-center gap-2 text-text-primary">
                    <input type="checkbox" checked={hideConflicts} onChange={() => setHideConflicts(!hideConflicts)} className="w-3.5 h-3.5 accent-[#1B2A4A]" />
                    Hide conflicts
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Results Table */}
        <div className="flex-1 min-w-0">
          <div className="bg-card-bg border border-border rounded-lg overflow-hidden">
            {/* Table header bar */}
            <div className="bg-section-bg border-b border-border px-4 py-2.5 flex items-center justify-between">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Courses</h3>
              <label className="text-[11px] text-text-secondary flex items-center gap-1">Sort By:
                <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="text-[11px] font-semibold text-text-primary bg-transparent border-none focus:outline-none cursor-pointer">
                  <option value="relevance">Relevance</option>
                  <option value="code">Course Code</option>
                  <option value="title">Title</option>
                  <option value="credits">Credits</option>
                  <option value="seats">Open Seats</option>
                  <option value="waitlist">Waitlist Size</option>
                </select>
              </label>
            </div>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-white">
                    <th className="text-left px-3 py-2.5 text-text-secondary font-bold whitespace-nowrap">Course Code</th>
                    <th className="text-left px-3 py-2.5 text-text-secondary font-bold whitespace-nowrap">Course Title</th>
                    <th className="text-left px-3 py-2.5 text-text-secondary font-bold whitespace-nowrap">Schedule</th>
                    <th className="text-left px-3 py-2.5 text-text-secondary font-bold whitespace-nowrap">Format</th>
                    <th className="text-center px-3 py-2.5 text-text-secondary font-bold whitespace-nowrap">Credits</th>
                    <th className="text-center px-3 py-2.5 text-text-secondary font-bold whitespace-nowrap">Seats</th>
                    <th className="text-center px-3 py-2.5 text-text-secondary font-bold whitespace-nowrap">Prereqs</th>
                    <th className="px-3 py-2.5 whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => {
                    const conflict = hasConflictWithCart(c, cart);
                    const isFull = c.enrolled >= c.capacity;
                    return (
                      <tr key={c.id}
                        className={`border-t border-border hover:bg-uw-purple-50 transition-colors cursor-pointer ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}
                        onClick={() => setDetailCourse(c)}>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {conflict && !cartIds.has(c.id) && <AlertTriangle className="w-3 h-3 text-warning shrink-0" />}
                            <span className="font-mono font-bold text-uw-purple">{c.code}</span>
                          </div>
                          {c.waitlistCount > 0 && <p className="text-[10px] text-text-muted mt-0.5">{c.waitlistCount} waitlist</p>}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <p className="text-text-primary font-medium">{c.title}</p>
                          <p className="text-[10px] text-text-muted mt-0.5">{c.instructor} · {c.location}</p>
                        </td>
                        <td className="px-3 py-2.5 text-text-secondary whitespace-nowrap">
                          <span className="font-medium">{c.days.join('')}</span> {fmtTime(c.startTime)}-{fmtTime(c.endTime)}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap"><FormatBadge format={c.format} /></td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-center font-bold text-text-primary">{c.credits}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-center"><SeatsBadge enrolled={c.enrolled} capacity={c.capacity} /></td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-center"><PrereqBadge status={c.prereqStatus} /></td>
                        <td className="px-3 py-2.5 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          {c.prereqStatus === 'not-met' ? (
                            <button disabled className="px-3 py-1 rounded text-[11px] font-medium bg-border text-text-muted cursor-not-allowed">Blocked</button>
                          ) : waitlistCourseIds.has(c.id) ? (
                            <button disabled className="px-3 py-1 rounded text-[11px] font-bold bg-warning-bg text-[#92400e] border border-warning/30 cursor-not-allowed flex items-center gap-1">
                              <Clock className="w-3 h-3" />Waitlisted
                            </button>
                          ) : cartIds.has(c.id) ? (
                            <button disabled className="px-3 py-1 rounded text-[11px] font-bold bg-border text-text-muted cursor-not-allowed">Added</button>
                          ) : isFull ? (
                            <button className="px-3 py-1 rounded text-[11px] font-bold bg-uw-gold text-white hover:bg-uw-gold-hover transition-colors flex items-center gap-1">
                              <Clock className="w-3 h-3" />Waitlist
                            </button>
                          ) : (
                            <button onClick={() => onAddToCart(c)}
                              className="px-3 py-1 rounded text-[11px] font-bold transition-colors bg-uw-purple text-white hover:bg-uw-purple-hover">
                              <Plus className="w-3 h-3 inline mr-0.5" />Add
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Mobile card layout */}
            <div className="md:hidden divide-y divide-border">
              {filtered.map(c => {
                const conflict = hasConflictWithCart(c, cart);
                const isFull = c.enrolled >= c.capacity;
                return (
                  <div key={c.id} className="p-3 bg-white hover:bg-uw-purple-50 transition-colors cursor-pointer" onClick={() => setDetailCourse(c)}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {conflict && !cartIds.has(c.id) && <AlertTriangle className="w-3 h-3 text-warning shrink-0" />}
                          <span className="font-mono font-bold text-uw-purple text-xs">{c.code}</span>
                          <FormatBadge format={c.format} />
                          <PrereqBadge status={c.prereqStatus} />
                        </div>
                        <p className="text-xs font-medium text-text-primary mt-1">{c.title}</p>
                        <p className="text-[11px] text-text-muted mt-0.5">{c.instructor} · {c.location}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 text-[11px] text-text-secondary">
                          <span><span className="font-medium">{c.days.join('')}</span> {fmtTime(c.startTime)}-{fmtTime(c.endTime)}</span>
                          <span>{c.credits} cr</span>
                          <span><SeatsBadge enrolled={c.enrolled} capacity={c.capacity} /></span>
                          {c.waitlistCount > 0 && <span className="text-text-muted">{c.waitlistCount} waitlist</span>}
                        </div>
                      </div>
                      <div className="shrink-0 pt-0.5" onClick={e => e.stopPropagation()}>
                        {c.prereqStatus === 'not-met' ? (
                          <button disabled className="px-3 py-1.5 rounded text-[11px] font-medium bg-border text-text-muted cursor-not-allowed">Blocked</button>
                        ) : waitlistCourseIds.has(c.id) ? (
                          <button disabled className="px-3 py-1.5 rounded text-[11px] font-bold bg-warning-bg text-[#92400e] border border-warning/30 cursor-not-allowed flex items-center gap-1">
                            <Clock className="w-3 h-3" />Waitlisted
                          </button>
                        ) : cartIds.has(c.id) ? (
                          <button disabled className="px-3 py-1.5 rounded text-[11px] font-bold bg-border text-text-muted cursor-not-allowed">Added</button>
                        ) : isFull ? (
                          <button className="px-3 py-1.5 rounded text-[11px] font-bold bg-uw-gold text-white hover:bg-uw-gold-hover transition-colors flex items-center gap-1">
                            <Clock className="w-3 h-3" />Waitlist
                          </button>
                        ) : (
                          <button onClick={() => onAddToCart(c)}
                            className="px-3 py-1.5 rounded text-[11px] font-bold transition-colors bg-uw-purple text-white hover:bg-uw-purple-hover">
                            <Plus className="w-3 h-3 inline mr-0.5" />Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filtered.length === 0 && <div className="text-center py-12 text-text-muted text-sm">No courses match your filters.</div>}
            <div className="px-4 py-2 border-t border-border text-[11px] text-text-muted flex justify-between bg-section-bg">
              <span>Showing {filtered.length} of {courses.length} courses</span>
              <span>Last updated: Mar 4, 9:30 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Detail Modal */}
      <AnimatePresence>
        {detailCourse && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDetailCourse(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()} className="bg-card-bg rounded-lg shadow-xl max-w-lg w-full border border-border max-h-[80vh] overflow-y-auto">
              {/* Modal header */}
              <div className="bg-uw-purple px-5 py-4 rounded-t-lg flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white"><span className="font-mono">{detailCourse.code}</span></h3>
                  <p className="text-sm text-[#8ab0c4] mt-0.5">{detailCourse.title}</p>
                  {detailCourse.crossListed && <p className="text-xs text-uw-gold mt-1">Cross-listed: {detailCourse.crossListed.join(', ')}</p>}
                </div>
                <button onClick={() => setDetailCourse(null)} className="text-[#8ab0c4] hover:text-white p-1"><X className="w-5 h-5" /></button>
              </div>
              {/* Modal body */}
              <div className="p-5 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-text-secondary text-xs block">Instructor</span><span className="text-text-primary font-semibold">{detailCourse.instructor}</span></div>
                  <div><span className="text-text-secondary text-xs block">Credits</span><span className="text-text-primary font-bold text-lg">{detailCourse.credits}</span></div>
                  <div><span className="text-text-secondary text-xs block">Schedule</span><span className="text-text-primary">{detailCourse.days.join('')} {fmtTime(detailCourse.startTime)}-{fmtTime(detailCourse.endTime)}</span></div>
                  <div><span className="text-text-secondary text-xs block">Location</span><span className="text-text-primary">{detailCourse.location}</span></div>
                  <div><span className="text-text-secondary text-xs block">Format</span><FormatBadge format={detailCourse.format} /></div>
                  <div><span className="text-text-secondary text-xs block">Enrollment</span><SeatsBadge enrolled={detailCourse.enrolled} capacity={detailCourse.capacity} /></div>
                </div>
                {detailCourse.waitlistCount > 0 && <p className="text-xs text-text-secondary">Waitlist: <span className="text-warning font-bold">{detailCourse.waitlistCount} students</span></p>}
                {detailCourse.prerequisites.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="font-bold text-text-primary text-xs uppercase tracking-wide mb-2">Prerequisites</p>
                    <div className="space-y-1.5">{detailCourse.prerequisites.map(p => (
                      <div key={p.code} className="flex items-center justify-between text-xs"><span className="text-text-secondary font-mono">{p.code}</span><span className="text-text-secondary mx-2 flex-1">{p.title}</span><PrereqBadge status={p.status} /></div>
                    ))}</div>
                  </div>
                )}
                {detailCourse.corequisites && detailCourse.corequisites.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="font-bold text-text-primary text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5" />Co-requisites</p>
                    <div className="space-y-1.5">{detailCourse.corequisites.map(cr => {
                      const enrolled = cart.some(c => c.code === cr);
                      return (
                        <div key={cr} className="flex items-center justify-between text-xs">
                          <span className="font-mono text-text-secondary">{cr}</span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${enrolled ? 'bg-success-bg text-success border-success/30' : 'bg-warning-bg text-[#92400e] border-warning/30'}`}>
                            {enrolled ? 'Enrolled' : 'Not Enrolled'}
                          </span>
                        </div>
                      );
                    })}</div>
                    {detailCourse.corequisites.some(cr => !cart.some(c => c.code === cr)) && (
                      <p className="text-[11px] text-warning mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Must be co-enrolled to complete registration</p>
                    )}
                  </div>
                )}
                <div className="pt-3 border-t border-border">
                  <p className="font-bold text-text-primary text-xs uppercase tracking-wide mb-1">Description</p>
                  <p className="text-text-secondary text-xs leading-relaxed">{detailCourse.description}</p>
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex gap-3 px-5 py-4 border-t border-border bg-section-bg rounded-b-lg">
                <button onClick={() => setDetailCourse(null)} className="flex-1 py-2.5 rounded font-semibold text-sm bg-white border border-border text-text-primary hover:bg-page-bg transition-colors">Close</button>
                <button onClick={() => { onAddToCart(detailCourse); setDetailCourse(null); }} disabled={cartIds.has(detailCourse.id)}
                  className={`flex-1 py-2.5 rounded font-semibold text-sm transition-colors ${cartIds.has(detailCourse.id) ? 'bg-border text-text-muted cursor-not-allowed' : 'bg-uw-purple text-white hover:bg-uw-purple-hover'}`}>
                  {cartIds.has(detailCourse.id) ? 'Already in Cart' : '+ Add to Cart'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
