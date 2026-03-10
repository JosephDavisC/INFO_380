import { useState, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, ClipboardList, UserCheck, Settings, Minus, Plus, Type, Menu, X } from 'lucide-react';
import CourseSearch from './views/CourseSearch';
import RegistrationCart from './views/RegistrationCart';
import WaitlistManagement from './views/WaitlistManagement';
import AdvisorDashboard from './views/AdvisorDashboard';
import AdminDashboard from './views/AdminDashboard';
import { courses } from './data/mockData';
import type { Course } from './data/types';

// Text size context
interface TextSizeContextType { textSize: number; setTextSize: (s: number) => void; }
export const TextSizeContext = createContext<TextSizeContextType>({ textSize: 16, setTextSize: () => {} });
export const useTextSize = () => useContext(TextSizeContext);

// Toast context
export interface Toast { id: string; message: string; detail?: string; type: 'success' | 'info' | 'warning' | 'error'; }
interface ToastContextType { toasts: Toast[]; addToast: (t: Omit<Toast, 'id'>) => void; removeToast: (id: string) => void; }
export const ToastContext = createContext<ToastContextType>({ toasts: [], addToast: () => {}, removeToast: () => {} });
export const useToast = () => useContext(ToastContext);

const TABS = [
  { id: 'search', label: 'Course Search', icon: Search },
  { id: 'cart', label: 'Registration Cart', icon: ShoppingCart },
  { id: 'waitlist', label: 'Waitlist', icon: ClipboardList },
  { id: 'advisor', label: 'Advisor', icon: UserCheck },
  { id: 'admin', label: 'Admin', icon: Settings },
] as const;
type TabId = typeof TABS[number]['id'];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('search');
  const [cart, setCart] = useState<Course[]>(courses.filter(c => ['19', '21'].includes(c.id)));
  const [textSize, setTextSize] = useState(16);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartIds = new Set(cart.map(c => c.id));
  const addToCart = useCallback((course: Course) => {
    setCart(prev => prev.find(c => c.id === course.id) ? prev : [...prev, course]);
  }, []);
  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
  }, []);
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const switchTab = (id: TabId) => { setActiveTab(id); setMobileMenuOpen(false); };

  return (
    <TextSizeContext value={{ textSize, setTextSize }}>
      <ToastContext value={{ toasts, addToast, removeToast }}>
        <div className="min-h-screen bg-page-bg" style={{ fontSize: `${textSize}px` }}>
          {/* Main header */}
          <header className="bg-uw-purple sticky top-0 z-40 shadow-md">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex items-center justify-between h-14">
              {/* Logo + title */}
              <div className="flex items-center gap-4">
                <span className="text-white font-bold text-base tracking-tight">Course Registration</span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-0.5" role="tablist">
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => switchTab(tab.id)}
                      className={`relative px-3.5 py-2 text-[13px] font-semibold transition-colors duration-150 flex items-center gap-1.5 ${
                        isActive ? 'text-white bg-[#152240]' : 'text-[#8ab0c4] hover:text-white hover:bg-[#152240]'
                      } rounded`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                      {tab.id === 'cart' && cart.length > 0 && (
                        <span className="ml-0.5 min-w-[18px] h-[18px] rounded-full bg-uw-gold text-white text-[10px] flex items-center justify-center font-bold px-1">
                          {cart.length}
                        </span>
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="tab-underline"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-uw-gold"
                          transition={{ type: 'spring', duration: 0.3 }}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Right side */}
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#152240] text-xs text-white font-semibold border border-[#2d4a6a]">
                  WI 26
                </span>

                {/* Mobile hamburger */}
                <button
                  className="md:hidden w-10 h-10 flex items-center justify-center text-white rounded-md hover:bg-[#152240]"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden overflow-hidden border-t border-[#2d4a6a]"
                >
                  <div className="px-4 py-3 space-y-1 bg-[#152240]">
                    {TABS.map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => switchTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                            isActive ? 'bg-uw-purple text-white' : 'text-[#8ab0c4] hover:bg-uw-purple hover:text-white'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {tab.label}
                          {tab.id === 'cart' && cart.length > 0 && (
                            <span className="ml-auto w-6 h-6 rounded-full bg-uw-gold text-white text-xs flex items-center justify-center font-bold">
                              {cart.length}
                            </span>
                          )}
                        </button>
                      );
                    })}
                    <div className="flex items-center justify-between pt-2 border-t border-[#2d4a6a] mt-2">
                      <span className="text-sm text-uw-gold font-semibold">Winter 2026</span>
                      <div className="flex items-center gap-1 bg-uw-purple rounded px-1.5 py-0.5">
                        <button onClick={() => setTextSize(s => Math.max(12, s - 2))} className="w-7 h-7 rounded flex items-center justify-center text-[#8ab0c4] hover:text-white" aria-label="Decrease text size">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <Type className="w-3.5 h-3.5 text-[#4a6a8a]" />
                        <button onClick={() => setTextSize(s => Math.min(24, s + 2))} className="w-7 h-7 rounded flex items-center justify-center text-[#8ab0c4] hover:text-white" aria-label="Increase text size">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* Main Content */}
          <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === 'search' && <CourseSearch onAddToCart={addToCart} cartIds={cartIds} cart={cart} />}
                {activeTab === 'cart' && <RegistrationCart cart={cart} onRemove={removeFromCart} />}
                {activeTab === 'waitlist' && <WaitlistManagement />}
                {activeTab === 'advisor' && <AdvisorDashboard />}
                {activeTab === 'admin' && <AdminDashboard />}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Toast Container */}
          <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 max-w-sm">
            <AnimatePresence>
              {toasts.map(toast => (
                <motion.div
                  key={toast.id}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  className="bg-white border border-border rounded-lg p-4 shadow-lg cursor-pointer"
                  onClick={() => removeToast(toast.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                      toast.type === 'success' ? 'bg-success' : toast.type === 'error' ? 'bg-error' : toast.type === 'warning' ? 'bg-warning' : 'bg-uw-purple'
                    }`} />
                    <div>
                      <p className="text-sm font-bold text-text-primary">{toast.message}</p>
                      {toast.detail && <p className="text-xs text-text-secondary mt-0.5">{toast.detail}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </ToastContext>
    </TextSizeContext>
  );
}
