import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  LayoutDashboard,
  Eye,
  EyeOff,
  X,
  Edit2,
  Menu,
  History,
  Users,
  BookOpen,
  Home,
  ShieldCheck,
  Gamepad2,
  ChevronLeft,
  Check,
  Info
} from 'lucide-react';
import { cn } from './lib/utils';
import { Lottery, LotteryImage } from './types';

import { Navbar } from './components/Navbar';
import { LotteryModal } from './components/LotteryModal';
import HostTournamentPage from './pages/HostTournamentPage';

// --- Components ---

const LotteryCard: React.FC<{ lottery: Lottery; onPlay: (l: Lottery) => void }> = ({ lottery, onPlay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass rounded-2xl overflow-hidden group border border-white/5 hover:border-primary/30 transition-all duration-500"
    >
      <div className="relative h-48 bg-slate-900 flex items-center justify-center overflow-hidden">
        {lottery.type === 'vs' ? (
          <div className="flex items-center gap-4 w-full px-6">
            <div className="flex-1 aspect-square rounded-xl overflow-hidden border-2 border-primary/50 shadow-[0_0_15px_rgba(0,242,255,0.3)]">
              <img src={lottery.hostImage?.url} alt="Host" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="text-2xl font-black italic text-primary neon-text">VS</div>
            <div className="flex-1 aspect-square rounded-xl overflow-hidden border-2 border-secondary/50 flex items-center justify-center bg-slate-800">
              <ImageIcon className="w-8 h-8 text-white/20" />
            </div>
          </div>
        ) : (
          <div className="flex -space-x-4">
            {lottery.images.slice(0, 3).map((img, i) => (
              <div key={img.id} className="w-24 h-24 rounded-full border-4 border-slate-900 overflow-hidden shadow-xl" style={{ zIndex: 3-i }}>
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className={cn(
            "text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded",
            lottery.type === 'vs' ? "bg-secondary/20 text-secondary" : "bg-primary/20 text-primary"
          )}>
            {lottery.type} Lottery
          </span>
          <span className="text-xs text-white/40">{lottery.images.length} Options</span>
        </div>
        <h3 className="text-xl font-bold mb-4">{lottery.title}</h3>
        <button 
          onClick={() => onPlay(lottery)}
          className="w-full py-3 rounded-xl bg-primary text-slate-950 font-bold flex items-center justify-center gap-2 glowing-button"
        >
          <Play className="w-4 h-4 fill-current" />
          PLAY NOW
        </button>
      </div>
    </motion.div>
  );
};


const WinnerHistoryPage = () => {
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/winners')
      .then(res => res.json())
      .then(data => {
        setWinners(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-6">
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/20"
          >
            <History className="w-10 h-10 text-accent" />
          </motion.div>
          <h1 className="text-5xl font-black italic mb-4 tracking-tighter">
            WINNER <span className="text-accent neon-text">HISTORY</span>
          </h1>
          <p className="text-white/40">The hall of fame for our legendary champions</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : winners.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border-dashed border-2 border-white/10">
            <Trophy className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white/40">No winners yet.</h3>
            <p className="text-white/20">Be the first one to claim victory!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {winners.map((winner, i) => (
              <motion.div
                key={winner.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-6 group hover:border-accent/30 transition-all"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-accent/50 shadow-[0_0_20px_rgba(255,0,200,0.2)]">
                    <img src={winner.winner_url} alt={winner.winner_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="absolute -top-3 -left-3 bg-accent text-white p-1.5 rounded-lg shadow-lg">
                    <Trophy className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black tracking-widest text-accent uppercase mb-1">CHAMPION</div>
                  <h3 className="text-xl font-bold truncate mb-1">{winner.winner_name}</h3>
                  <div className="text-xs text-white/40 flex items-center gap-2">
                    <Gamepad2 className="w-3 h-3" />
                    {winner.lottery_title}
                  </div>
                  <div className="mt-3 text-[10px] text-white/20 font-mono">
                    {new Date(winner.won_at).toLocaleString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ParticipantsPage = () => {
  const [images, setImages] = useState<LotteryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/images')
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-6">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20"
          >
            <Users className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-5xl font-black italic mb-4 tracking-tighter">
            ARENA <span className="text-primary neon-text">PARTICIPANTS</span>
          </h1>
          <p className="text-white/40">Meet the contenders ready for battle</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                <div className="aspect-[4/5] rounded-[32px] overflow-hidden border border-white/5 bg-slate-900 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-primary/30">
                  <img 
                    src={img.url} 
                    alt={img.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <div className="w-8 h-1 bg-primary mb-3 rounded-full" />
                    <h3 className="text-xl font-black italic text-white tracking-tight uppercase">{img.name}</h3>
                    <p className="text-[10px] font-bold text-white/40 tracking-[0.2em] mt-1">ARENA CONTENDER</p>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -inset-2 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const RulesPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <Navbar />
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 bg-primary/5 rounded-full border-2 border-dashed border-primary/20 flex items-center justify-center mx-auto mb-8"
        >
          <BookOpen className="w-12 h-12 text-primary/40" />
        </motion.div>
        <h1 className="text-6xl font-black italic mb-4 tracking-tighter opacity-20">COMING SOON</h1>
        <p className="text-primary font-bold tracking-[0.5em] uppercase">Arena Rules are being drafted</p>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [selectedLottery, setSelectedLottery] = useState<Lottery | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        const res = await fetch('/api/lotteries');
        if (!res.ok) throw new Error('Failed to fetch lotteries');
        const data = await res.json();
        console.log('Fetched lotteries:', data);
        setLotteries(data);
      } catch (err) {
        console.error('Error fetching lotteries:', err);
      }
    };

    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/admin/check');
        const data = await res.json();
        setIsAdmin(data.authenticated);
      } catch (err) {
        console.error('Error checking admin:', err);
      }
    };

    fetchLotteries();
    checkAdmin();
  }, []);

  const activeLotteries = lotteries.filter(l => l.is_active);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <Navbar showAdminLink={isAdmin} />
      
      <header className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest mb-6 border border-primary/20"
        >
          LIVE COMPETITIONS
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-6 leading-none">
          ENTER THE <span className="text-primary neon-text">ARENA</span>
        </h1>
        <p className="text-white/40 max-w-2xl mx-auto text-lg">
          Experience the most thrilling online lottery platform. Choose your battle, spin the wheel, and claim your victory in our high-stakes gaming arena.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeLotteries.map(lottery => (
          <LotteryCard key={lottery.id} lottery={lottery} onPlay={setSelectedLottery} />
        ))}
      </div>

      {activeLotteries.length === 0 && (
        <div className="text-center py-20 glass rounded-3xl border-dashed border-2 border-white/10">
          <Gamepad2 className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white/40">No active lotteries at the moment.</h3>
          <p className="text-white/20">Check back later for new battles!</p>
        </div>
      )}

      {selectedLottery && (
        <LotteryModal lottery={selectedLottery} onClose={() => setSelectedLottery(null)} />
      )}

      <footer className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
          <Trophy className="w-6 h-6" />
          <span>LOTTOARENA</span>
        </div>
        <div className="flex gap-8 text-xs font-medium">
          <Link to="/admin" className="hover:text-primary transition-colors">Admin Portal</Link>
          <span>&copy; 2026 LottoArena. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

const AdminLoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      onLogin();
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 rounded-3xl border border-white/10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Admin Portal</h2>
          <p className="text-white/40 text-sm">Enter password to access dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
            />
            {error && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
          </div>
          <button className="w-full py-3 bg-primary text-slate-950 font-bold rounded-xl glowing-button">
            LOGIN
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [images, setImages] = useState<LotteryImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageName, setNewImageName] = useState('');
  const [editingImageId, setEditingImageId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newLotteryTitle, setNewLotteryTitle] = useState('');
  const [newLotteryType, setNewLotteryType] = useState<'single' | 'vs'>('single');
  const [selectedHostId, setSelectedHostId] = useState<number | null>(null);
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
  const [editingLotteryId, setEditingLotteryId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'lotteries' | 'images'>('lotteries');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [lRes, iRes] = await Promise.all([
      fetch('/api/lotteries'),
      fetch('/api/images')
    ]);
    setLotteries(await lRes.json());
    setImages(await iRes.json());
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImageId && !newImageUrl && !selectedFile) return;
    setIsUploading(true);

    try {
      if (editingImageId) {
        await fetch(`/api/images/${editingImageId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: newImageUrl, name: newImageName })
        });
      } else if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('name', newImageName || selectedFile.name);
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        if (!res.ok) throw new Error('Upload failed');
      } else {
        await fetch('/api/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: newImageUrl, name: newImageName || 'Untitled' })
        });
      }
      
      setNewImageUrl('');
      setNewImageName('');
      setSelectedFile(null);
      setEditingImageId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to save image');
    } finally {
      setIsUploading(false);
    }
  };

  const startEditingImage = (img: LotteryImage) => {
    setEditingImageId(img.id);
    setNewImageUrl(img.url);
    setNewImageName(img.name);
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteImage = async (id: number) => {
    try {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete image');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting image');
    }
  };

  const handleCreateLottery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLotteryTitle || selectedImageIds.length === 0) return;
    if (newLotteryType === 'vs' && !selectedHostId) return;

    const url = editingLotteryId ? `/api/lotteries/${editingLotteryId}` : '/api/lotteries';
    const method = editingLotteryId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newLotteryTitle,
          type: newLotteryType,
          host_image_id: selectedHostId,
          image_ids: selectedImageIds
        })
      });
      
      if (!res.ok) throw new Error('Failed to save lottery');

      setNewLotteryTitle('');
      setSelectedImageIds([]);
      setSelectedHostId(null);
      setEditingLotteryId(null);
      setNewLotteryType('single');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to save lottery');
    }
  };

  const startEditingLottery = (l: Lottery) => {
    setEditingLotteryId(l.id);
    setNewLotteryTitle(l.title);
    setNewLotteryType(l.type);
    setSelectedHostId(l.host_image_id || null);
    setSelectedImageIds(l.images.map(img => img.id));
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingLotteryId(null);
    setNewLotteryTitle('');
    setSelectedImageIds([]);
    setSelectedHostId(null);
    setNewLotteryType('single');
  };

  const toggleLotteryStatus = async (id: number, currentStatus: number) => {
    await fetch(`/api/lotteries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !currentStatus })
    });
    fetchData();
  };

  const deleteLottery = async (id: number) => {
    await fetch(`/api/lotteries/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-6">
      <Navbar showAdminLink={true} />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black italic">ADMIN DASHBOARD</h1>
            <p className="text-white/40">Manage your lottery arena</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-all">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button 
            onClick={() => setActiveTab('lotteries')}
            className={cn("pb-4 px-4 font-bold transition-all", activeTab === 'lotteries' ? "text-primary border-b-2 border-primary" : "text-white/40 hover:text-white")}
          >
            Lotteries
          </button>
          <button 
            onClick={() => setActiveTab('images')}
            className={cn("pb-4 px-4 font-bold transition-all", activeTab === 'images' ? "text-primary border-b-2 border-primary" : "text-white/40 hover:text-white")}
          >
            Image Library
          </button>
        </div>

        {activeTab === 'images' ? (
          <div className="space-y-8">
            <div className="glass p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                {editingImageId ? <Edit2 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5" />} 
                {editingImageId ? 'Edit Image' : 'Add New Image'}
              </h3>
              <form onSubmit={handleAddImage} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Image URL</label>
                    <input 
                      type="text" 
                      placeholder="https://example.com/image.jpg" 
                      value={newImageUrl}
                      onChange={e => {
                        setNewImageUrl(e.target.value);
                        if (e.target.value) setSelectedFile(null);
                      }}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-primary"
                    />
                  </div>
                  {!editingImageId && (
                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Or Upload File</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => {
                          if (e.target.files?.[0]) {
                            setSelectedFile(e.target.files[0]);
                            setNewImageUrl('');
                          }
                        }}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-primary file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Display Name</label>
                    <input 
                      type="text" 
                      placeholder="Image Name" 
                      value={newImageName}
                      onChange={e => setNewImageName(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      disabled={isUploading}
                      className="bg-primary text-slate-950 px-8 py-2 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? 'SAVING...' : editingImageId ? 'UPDATE IMAGE' : 'ADD IMAGE'}
                    </button>
                    {editingImageId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingImageId(null);
                          setNewImageUrl('');
                          setNewImageName('');
                        }}
                        className="bg-white/5 text-white px-6 py-2 rounded-xl font-bold border border-white/10"
                      >
                        CANCEL
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map(img => (
                <div key={img.id} className="group relative aspect-square glass rounded-xl overflow-hidden border border-white/10">
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  
                  {/* Mobile-friendly controls: visible on touch or hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => startEditingImage(img)} 
                      className="p-3 bg-primary rounded-xl text-slate-950 shadow-lg hover:scale-110 transition-transform"
                      title="Edit Image"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteImage(img.id)} 
                      className="p-3 bg-red-500 rounded-xl text-white shadow-lg hover:scale-110 transition-transform"
                      title="Delete Image"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Always visible delete button for mobile (top right) */}
                  <div className="md:hidden absolute top-2 right-2 flex gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteImage(img.id); }}
                      className="p-1.5 bg-red-500/80 backdrop-blur-sm rounded-lg text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-[10px] truncate font-bold">{img.name}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="glass p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                {editingLotteryId ? <Settings className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5" />} 
                {editingLotteryId ? 'Edit Lottery' : 'Create New Lottery'}
              </h3>
              <form onSubmit={handleCreateLottery} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">Lottery Title</label>
                    <input 
                      type="text" 
                      placeholder="Enter lottery title..." 
                      value={newLotteryTitle}
                      onChange={e => setNewLotteryTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">Lottery Type</label>
                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setNewLotteryType('single')}
                        className={cn("flex-1 py-2 rounded-xl font-bold border transition-all", newLotteryType === 'single' ? "bg-primary/20 border-primary text-primary" : "bg-slate-900 border-white/10 text-white/40")}
                      >
                        Single
                      </button>
                      <button 
                        type="button"
                        onClick={() => setNewLotteryType('vs')}
                        className={cn("flex-1 py-2 rounded-xl font-bold border transition-all", newLotteryType === 'vs' ? "bg-secondary/20 border-secondary text-secondary" : "bg-slate-900 border-white/10 text-white/40")}
                      >
                        VS Battle
                      </button>
                    </div>
                  </div>
                </div>

                {newLotteryType === 'vs' && (
                  <div>
                    <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">Select Host Image</label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {images.map(img => (
                        <button 
                          key={img.id}
                          type="button"
                          onClick={() => setSelectedHostId(img.id)}
                          className={cn("flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all", selectedHostId === img.id ? "border-primary scale-110" : "border-transparent opacity-50")}
                        >
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">Select Lottery Options ({selectedImageIds.length})</label>
                  <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2">
                    {images.map(img => (
                      <button 
                        key={img.id}
                        type="button"
                        onClick={() => {
                          if (selectedImageIds.includes(img.id)) {
                            setSelectedImageIds(selectedImageIds.filter(id => id !== img.id));
                          } else {
                            setSelectedImageIds([...selectedImageIds, img.id]);
                          }
                        }}
                        className={cn("aspect-square rounded-lg overflow-hidden border-2 transition-all relative", selectedImageIds.includes(img.id) ? "border-primary" : "border-transparent opacity-50")}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        {selectedImageIds.includes(img.id) && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-primary text-slate-950 font-black tracking-widest rounded-xl glowing-button"
                  >
                    {editingLotteryId ? 'UPDATE LOTTERY' : 'CREATE LOTTERY'}
                  </button>
                  {editingLotteryId && (
                    <button 
                      type="button"
                      onClick={cancelEditing}
                      className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                    >
                      CANCEL
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Current Lotteries</h3>
              <div className="grid grid-cols-1 gap-4">
                {lotteries.map(l => (
                  <div key={l.id} className="glass p-4 rounded-2xl border border-white/10 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden border border-white/10">
                      {l.type === 'vs' ? (
                        <img src={l.hostImage?.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <ImageIcon className="text-white/20" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold">{l.title}</h4>
                        <span className={cn("text-[8px] uppercase font-bold px-1.5 py-0.5 rounded", l.type === 'vs' ? "bg-secondary/20 text-secondary" : "bg-primary/20 text-primary")}>
                          {l.type}
                        </span>
                      </div>
                      <p className="text-xs text-white/40">{l.images.length} images • Created {new Date(l.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => startEditingLottery(l)}
                        className="p-2 rounded-lg text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => toggleLotteryStatus(l.id, l.is_active)}
                        className={cn("p-2 rounded-lg transition-colors", l.is_active ? "text-green-500 bg-green-500/10" : "text-white/20 bg-white/5")}
                      >
                        {l.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                      <button onClick={() => deleteLottery(l.id)} className="p-2 rounded-lg text-red-500 bg-red-500/10">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminWrapper = () => {
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  
  useEffect(() => {
    fetch('/api/admin/check')
      .then(res => res.json())
      .then(data => {
        setAuthStatus(data.authenticated ? 'authenticated' : 'unauthenticated');
      });
  }, []);

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-primary animate-pulse font-bold tracking-widest">LOADING ARENA...</div>
      </div>
    );
  }
  
  if (authStatus === 'unauthenticated') {
    return <AdminLoginPage onLogin={() => setAuthStatus('authenticated')} />;
  }
  
  return <AdminDashboard onLogout={() => setAuthStatus('unauthenticated')} />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/winners" element={<WinnerHistoryPage />} />
        <Route path="/participants" element={<ParticipantsPage />} />
        <Route path="/host-tournament" element={<HostTournamentPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/admin" element={<AdminWrapper />} />
      </Routes>
    </Router>
  );
}
