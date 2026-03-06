import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Menu, 
  X, 
  LayoutDashboard, 
  History, 
  Users, 
  BookOpen, 
  Home,
  Gamepad2
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Navbar = ({ showAdminLink = false }: { showAdminLink?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Winner History', path: '/winners', icon: History },
    { name: 'Participants', path: '/participants', icon: Users },
    { name: 'Host Tournament', path: '/host-tournament', icon: Gamepad2 },
    { name: 'Rules', path: '/rules', icon: BookOpen },
  ];

  // Disable body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] glass border-b border-white/10 h-16 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-primary">
          <Trophy className="w-8 h-8" />
          <span>LOTTO<span className="text-white">ARENA</span></span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="ml-auto hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={cn(
                "text-sm font-bold tracking-widest uppercase transition-all hover:text-primary",
                location.pathname === link.path ? "text-primary" : "text-white/40"
              )}
            >
              {link.name}
            </Link>
          ))}
          {showAdminLink ? (
            <Link to="/admin" className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-white/40 hover:text-primary transition-all">
              <LayoutDashboard className="w-4 h-4" />
              Admin
            </Link>
          ) : (
            <Link to="/admin" className="text-sm font-bold tracking-widest uppercase text-white/40 hover:text-primary transition-all">Login</Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto md:hidden p-2 text-white/60 hover:text-white transition-colors relative z-[70]"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay & Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Backdrop with Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[65] md:hidden"
            />

            {/* Side Panel - Slide from Left */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-xs bg-slate-950/95 backdrop-blur-2xl border-r border-white/10 z-[70] md:hidden flex flex-col p-8"
            >
              <div className="mb-12">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-primary">
                  <Trophy className="w-8 h-8" />
                  <span>LOTTO<span className="text-white">ARENA</span></span>
                </Link>
              </div>

              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-4 text-lg font-black tracking-widest uppercase p-4 rounded-2xl transition-all border border-transparent",
                      location.pathname === link.path 
                        ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_20px_rgba(0,242,255,0.1)]" 
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <link.icon className={cn("w-5 h-5", location.pathname === link.path ? "text-primary" : "text-white/20")} />
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-white/5">
                <Link 
                  to="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 text-lg font-black tracking-widest uppercase p-4 rounded-2xl text-white/40 hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <LayoutDashboard className="w-5 h-5 text-white/20" />
                  {showAdminLink ? 'Admin Panel' : 'Admin Login'}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
