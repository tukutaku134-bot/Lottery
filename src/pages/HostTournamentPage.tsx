import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Gamepad2, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Info,
  ShieldCheck,
  Sword,
  Layout,
  Settings,
  Play,
  History,
  Image as ImageIcon,
  UserPlus,
  Clock,
  Star,
  Zap,
  RotateCcw,
  BarChart3,
  Calendar,
  Edit2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Tournament, TournamentParticipant, TournamentMatch, TournamentGroup, Lottery } from '../types';
import { Navbar } from '../components/Navbar';
import { LotteryModal } from '../components/LotteryModal';

const HostTournamentPage = () => {
  const [step, setStep] = useState(1);
  const [tournament, setTournament] = useState<Partial<Tournament>>({
    title: 'Arena Boss Championship',
    types: ['single'],
    participantCount: 8,
    participants: [],
    structure: 'knockout',
    groupCount: 0,
    advanceCount: 2,
    spinTime: 3,
    groupSettings: {
      stages: ['Round 1', 'Quarter Final', 'Semi Final', 'Final'],
      points: { win: 3, loss: 0, draw: 1 }
    },
    groups: [],
    matches: [],
    status: 'setup'
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Type tournament={tournament} setTournament={setTournament} onNext={nextStep} />;
      case 2: return <Step2Count tournament={tournament} setTournament={setTournament} onNext={nextStep} onBack={prevStep} />;
      case 3: return <Step3Participants tournament={tournament} setTournament={setTournament} onNext={nextStep} onBack={prevStep} />;
      case 4: return <Step4Structure tournament={tournament} setTournament={setTournament} onNext={nextStep} onBack={prevStep} />;
      case 5: return <Step5GroupConfig tournament={tournament} setTournament={setTournament} onNext={nextStep} onBack={prevStep} />;
      case 6: return <Step6Advance tournament={tournament} setTournament={setTournament} onNext={nextStep} onBack={prevStep} />;
      case 7: return <Step7Customization tournament={tournament} setTournament={setTournament} onNext={nextStep} onBack={prevStep} />;
      case 8: return <TournamentDashboard tournament={tournament as Tournament} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <Navbar />
      
      <div className="pt-24 px-6 max-w-6xl mx-auto">
        {step < 8 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-black italic tracking-tighter">HOST TOURNAMENT</h1>
                <p className="text-white/40 uppercase tracking-widest text-xs font-bold mt-1">Guided Arena Setup</p>
              </div>
              <div className="text-right">
                <span className="text-primary font-black text-4xl italic">0{step}</span>
                <span className="text-white/20 font-black text-xl italic">/07</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(step / 7) * 100}%` }}
                className="h-full bg-primary shadow-[0_0_15px_rgba(0,242,255,0.5)]"
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const Step1Type = ({ tournament, setTournament, onNext }: any) => {
  const types: ('single' | 'vs')[] = ['single', 'vs'];
  
  const toggleType = (type: 'single' | 'vs') => {
    const current = tournament.types || [];
    const updated = current.includes(type) 
      ? current.filter((t: string) => t !== type) 
      : [...current, type];
    
    if (updated.length > 0) {
      setTournament({ ...tournament, types: updated });
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {types.map(type => (
          <button 
            key={type}
            onClick={() => toggleType(type)}
            className={cn(
              "glass p-10 rounded-[40px] border-2 transition-all text-left group relative overflow-hidden",
              tournament.types?.includes(type) ? "border-primary bg-primary/5" : "border-white/5 hover:border-white/20"
            )}
          >
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all",
              tournament.types?.includes(type) ? "bg-primary text-slate-950 shadow-[0_0_20px_rgba(0,242,255,0.4)]" : "bg-white/5 text-white/40"
            )}>
              {type === 'single' ? <Trophy className="w-8 h-8" /> : <Sword className="w-8 h-8" />}
            </div>
            <h3 className="text-3xl font-black italic mb-3 uppercase tracking-tighter">
              {type === 'single' ? 'Single Lottery' : 'VS Lottery'}
            </h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-[240px]">
              {type === 'single' ? 'Classic draw where one winner is picked from the pool.' : 'Head-to-head battle between two participants.'}
            </p>
            {tournament.types?.includes(type) && (
              <div className="absolute top-8 right-8 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-slate-950" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex justify-end pt-8">
        <button 
          onClick={onNext}
          disabled={!tournament.types || tournament.types.length === 0}
          className="px-12 py-5 bg-primary text-slate-950 font-black italic tracking-widest rounded-2xl glowing-button flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          NEXT STEP <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const Step2Count = ({ tournament, setTournament, onNext, onBack }: any) => {
  const counts = [4, 8, 16, 32];
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {counts.map(count => (
          <button 
            key={count}
            onClick={() => setTournament({ ...tournament, participantCount: count })}
            className={cn(
              "glass p-10 rounded-[40px] border-2 transition-all flex flex-col items-center justify-center gap-4",
              tournament.participantCount === count ? "border-primary bg-primary/5 scale-105" : "border-white/5 hover:border-white/20"
            )}
          >
            <span className={cn("text-6xl font-black italic", tournament.participantCount === count ? "text-primary" : "text-white/20")}>
              {count}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Participants</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-8">
        <button onClick={onBack} className="px-8 py-4 text-white/40 font-bold flex items-center gap-2 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" /> BACK
        </button>
        <button 
          onClick={onNext}
          className="px-12 py-5 bg-primary text-slate-950 font-black italic tracking-widest rounded-2xl glowing-button flex items-center gap-3"
        >
          NEXT STEP <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const Step3Participants = ({ tournament, setTournament, onNext, onBack }: any) => {
  const [localParticipants, setLocalParticipants] = useState<TournamentParticipant[]>(
    Array.from({ length: tournament.participantCount || 8 }).map((_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: `Participant ${i + 1}`,
      image: `https://picsum.photos/seed/p${i}/400/400`,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      points: 0
    }))
  );

  const updateParticipant = (index: number, data: Partial<TournamentParticipant>) => {
    const updated = [...localParticipants];
    updated[index] = { ...updated[index], ...data };
    setLocalParticipants(updated);
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateParticipant(index, { image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setTournament({ ...tournament, participants: localParticipants });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localParticipants.map((p, i) => (
          <div key={p.id} className="glass p-6 rounded-[32px] border border-white/10 flex items-center gap-6">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 bg-slate-900">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                <ImageIcon className="w-6 h-6 text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(i, e)} />
              </label>
            </div>
            <div className="flex-1 space-y-2">
              <input 
                type="text" 
                value={p.name}
                onChange={(e) => updateParticipant(i, { name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-primary"
              />
              <div className="flex gap-2">
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Slot {i + 1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-8">
        <button onClick={onBack} className="px-8 py-4 text-white/40 font-bold flex items-center gap-2 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" /> BACK
        </button>
        <button 
          onClick={handleSave}
          className="px-12 py-5 bg-primary text-slate-950 font-black italic tracking-widest rounded-2xl glowing-button flex items-center gap-3"
        >
          NEXT STEP <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const Step4Structure = ({ tournament, setTournament, onNext, onBack }: any) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => setTournament({ ...tournament, structure: 'group' })}
          className={cn(
            "glass p-10 rounded-[40px] border-2 transition-all text-left group relative",
            tournament.structure === 'group' ? "border-primary bg-primary/5" : "border-white/5 hover:border-white/20"
          )}
        >
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8", tournament.structure === 'group' ? "bg-primary text-slate-950" : "bg-white/5 text-white/40")}>
            <Layout className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-black italic mb-3 uppercase tracking-tighter">GROUP STAGE</h3>
          <p className="text-white/40 text-sm leading-relaxed max-w-[280px]">Participants are split into groups, top players advance to knockouts.</p>
          {tournament.structure === 'group' && <Check className="absolute top-10 right-10 text-primary w-8 h-8" />}
        </button>

        <button 
          onClick={() => setTournament({ ...tournament, structure: 'knockout', groupCount: 0 })}
          className={cn(
            "glass p-10 rounded-[40px] border-2 transition-all text-left group relative",
            tournament.structure === 'knockout' ? "border-primary bg-primary/5" : "border-white/5 hover:border-white/20"
          )}
        >
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8", tournament.structure === 'knockout' ? "bg-primary text-slate-950" : "bg-white/5 text-white/40")}>
            <Sword className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-black italic mb-3 uppercase tracking-tighter">DIRECT KNOCKOUT</h3>
          <p className="text-white/40 text-sm leading-relaxed max-w-[280px]">Single elimination bracket. Lose once and you are out.</p>
          {tournament.structure === 'knockout' && <Check className="absolute top-10 right-10 text-primary w-8 h-8" />}
        </button>
      </div>

      <div className="flex justify-between pt-8">
        <button onClick={onBack} className="px-8 py-4 text-white/40 font-bold flex items-center gap-2 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" /> BACK
        </button>
        <button 
          onClick={onNext}
          className="px-12 py-5 bg-primary text-slate-950 font-black italic tracking-widest rounded-2xl glowing-button flex items-center gap-3"
        >
          NEXT STEP <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const Step5GroupConfig = ({ tournament, setTournament, onNext, onBack }: any) => {
  const options = [0, 2, 4, 8];
  
  if (tournament.structure === 'knockout') {
    return (
      <div className="space-y-8 text-center py-20">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8">
          <Zap className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black italic mb-4 uppercase tracking-tighter">DIRECT TOURNAMENT</h2>
        <p className="text-white/40 max-w-md mx-auto text-lg">You've selected a direct knockout tournament. No group configuration needed.</p>
        <div className="flex justify-center gap-6 pt-12">
          <button onClick={onBack} className="px-8 py-4 text-white/40 font-bold flex items-center gap-2 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" /> BACK
          </button>
          <button 
            onClick={onNext}
            className="px-12 py-5 bg-primary text-slate-950 font-black italic tracking-widest rounded-2xl glowing-button flex items-center gap-3"
          >
            NEXT STEP <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black italic mb-2 uppercase tracking-tighter">GROUP CONFIGURATION</h2>
        <p className="text-white/40">Choose how many groups will exist in your tournament.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {options.filter(o => o > 0).map(count => (
          <button 
            key={count}
            onClick={() => setTournament({ ...tournament, groupCount: count })}
            className={cn(
              "glass p-12 rounded-[40px] border-2 transition-all flex flex-col items-center justify-center gap-4",
              tournament.groupCount === count ? "border-primary bg-primary/5 scale-105" : "border-white/5 hover:border-white/20"
            )}
          >
            <span className={cn("text-6xl font-black italic", tournament.groupCount === count ? "text-primary" : "text-white/20")}>
              {count}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">
              {count} Groups
            </span>
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-8">
        <button onClick={onBack} className="px-8 py-4 text-white/40 font-bold flex items-center gap-2 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" /> BACK
        </button>
        <button 
          onClick={onNext}
          disabled={!tournament.groupCount}
          className="px-12 py-5 bg-primary text-slate-950 font-black italic tracking-widest rounded-2xl glowing-button flex items-center gap-3 disabled:opacity-50"
        >
          NEXT STEP <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const Step6Advance = ({ tournament, setTournament, onNext, onBack }: any) => {
  const options = [1, 2, 4];
  
  if (tournament.structure === 'knockout') {
    return (
      <div className="space-y-8 text-center py-20">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8">
          <Star className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black italic mb-4 uppercase tracking-tighter">READY FOR BATTLE</h2>
        <p className="text-white/40 max-w-md mx-auto text-lg">Direct knockout structure is selected. No advancement rules needed.</p>
        <div className="flex justify-center gap-6 pt-12">
          <button onClick={onBack} className="px-8 py-4 text-white/40 font-bold flex items-center gap-2 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" /> BACK
          </button>
          <button 
            onClick={onNext}
            className="px-12 py-5 bg-primary text-slate-950 font-black italic tracking-widest rounded-2xl glowing-button flex items-center gap-3"
          >
            NEXT STEP <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black italic mb-2 uppercase tracking-tighter">ADVANCING PARTICIPANTS</h2>
        <p className="text-white/40">Choose how many participants from each group will advance to the knockout stage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map(count => (
          <button 
            key={count}
            onClick={() => setTournament({ ...tournament, advanceCount: count })}
            className={cn(
              "glass p-12 rounded-[40px] border-2 transition-all flex flex-col items-center justify-center gap-4",
              tournament.advanceCount === count ? "border-primary bg-primary/5 scale-105" : "border-white/5 hover:border-white/20"
            )}
          >
            <span className={cn("text-6xl font-black italic", tournament.advanceCount === count ? "text-primary" : "text-white/20")}>
              {count}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">
              Top {count} Advance
            </span>
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-8">
        <button onClick={onBack} className="px-8 py-4 text-white/40 font-bold flex items-center gap-2 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" /> BACK
        </button>
        <button 
          onClick={onNext}
          className="px-12 py-5 bg-primary text-slate-950 font-black italic tracking-widest rounded-2xl glowing-button flex items-center gap-3"
        >
          NEXT STEP <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const Step7Customization = ({ tournament, setTournament, onNext, onBack }: any) => {
  const spinOptions = [2, 3, 5, 8];
  
  return (
    <div className="space-y-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black italic mb-2 uppercase tracking-tighter">ARENA CUSTOMIZATION</h2>
        <p className="text-white/40">Finalize your tournament's look and feel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-xl font-black italic flex items-center gap-2 uppercase tracking-widest">
            <Edit2 className="w-5 h-5 text-primary" /> Tournament Name
          </h3>
          <div className="glass p-10 rounded-[40px] border border-white/10">
            <input 
              type="text" 
              value={tournament.title}
              onChange={(e) => setTournament({ ...tournament, title: e.target.value })}
              placeholder="Enter tournament name..."
              className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-5 text-2xl font-black italic focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black italic flex items-center gap-2 uppercase tracking-widest">
            <Clock className="w-5 h-5 text-primary" /> Lottery Spin Time
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {spinOptions.map(time => (
              <button 
                key={time}
                onClick={() => setTournament({ ...tournament, spinTime: time })}
                className={cn(
                  "glass p-8 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2",
                  tournament.spinTime === time ? "border-primary bg-primary/5" : "border-white/5 hover:border-white/20"
                )}
              >
                <span className={cn("text-3xl font-black italic", tournament.spinTime === time ? "text-primary" : "text-white/20")}>
                  {time}s
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Duration</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-8">
        <button onClick={onBack} className="px-8 py-4 text-white/40 font-bold flex items-center gap-2 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" /> BACK
        </button>
        <button 
          onClick={onNext}
          className="px-12 py-5 bg-primary text-slate-950 font-black italic tracking-widest rounded-2xl glowing-button flex items-center gap-3"
        >
          FINALIZE ARENA <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const TournamentDashboard = ({ tournament: initialTournament }: { tournament: Tournament }) => {
  const [tournament, setTournament] = useState<Tournament>(() => {
    // Initialize participants with stats
    const participants = initialTournament.participants.map(p => ({
      ...p,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      points: 0
    }));

    const groups: TournamentGroup[] = [];
    const matches: TournamentMatch[] = [];

    if (initialTournament.groupCount > 0) {
      const perGroup = Math.ceil(participants.length / initialTournament.groupCount);
      for (let i = 0; i < initialTournament.groupCount; i++) {
        const groupParticipants = participants.slice(i * perGroup, (i + 1) * perGroup);
        const groupMatches: TournamentMatch[] = [];
        
        // Round Robin pairings
        for (let j = 0; j < groupParticipants.length; j++) {
          for (let k = j + 1; k < groupParticipants.length; k++) {
            groupMatches.push({
              id: Math.random().toString(36).substr(2, 9),
              p1: groupParticipants[j],
              p2: groupParticipants[k],
              stage: `Group ${String.fromCharCode(65 + i)}`,
              type: initialTournament.types[0],
              timestamp: new Date().toISOString()
            });
          }
        }
        
        groups.push({
          id: `group-${i}`,
          name: `Group ${String.fromCharCode(65 + i)}`,
          participants: groupParticipants,
          matches: groupMatches
        });
        matches.push(...groupMatches);
      }
    } else {
      // Direct Knockout
      for (let i = 0; i < participants.length; i += 2) {
        if (participants[i] && participants[i+1]) {
          matches.push({
            id: Math.random().toString(36).substr(2, 9),
            p1: participants[i],
            p2: participants[i+1],
            stage: 'Round 1',
            type: initialTournament.types[0],
            timestamp: new Date().toISOString()
          });
        }
      }
    }

    return {
      ...initialTournament,
      participants,
      groups,
      matches,
      status: 'active'
    };
  });

  const [activeTab, setActiveTab] = useState<'leaderboard' | 'groups' | 'bracket' | 'matches'>('leaderboard');
  const [selectedMatch, setSelectedMatch] = useState<TournamentMatch | null>(null);

  const handleMatchResult = (winner: any) => {
    if (!selectedMatch) return;

    const updatedParticipants = tournament.participants.map(p => {
      if (p.id === selectedMatch.p1.id || p.id === selectedMatch.p2.id) {
        const isWinner = p.id === winner.id;
        return {
          ...p,
          matchesPlayed: p.matchesPlayed + 1,
          wins: isWinner ? p.wins + 1 : p.wins,
          losses: isWinner ? p.losses : p.losses + 1,
          points: isWinner ? p.points + (tournament.groupSettings?.points.win || 3) : p.points
        };
      }
      return p;
    });

    const updatedMatches = tournament.matches.map(m => {
      if (m.id === selectedMatch.id) {
        return { ...m, winnerId: winner.id };
      }
      return m;
    });

    // Update groups if applicable
    const updatedGroups = tournament.groups.map(g => ({
      ...g,
      participants: g.participants.map(gp => updatedParticipants.find(up => up.id === gp.id) || gp),
      matches: g.matches.map(gm => updatedMatches.find(um => um.id === gm.id) || gm)
    }));

    setTournament({
      ...tournament,
      participants: updatedParticipants,
      matches: updatedMatches,
      groups: updatedGroups
    });
    
    setSelectedMatch(null);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Aesthetic Banner */}
      <div className="relative h-72 rounded-[50px] overflow-hidden flex items-center justify-center border border-white/10 shadow-2xl group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-slate-950 to-secondary/30 animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-primary/10 blur-[100px]" 
        />
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-[0.4em] mb-6 border border-primary/20 uppercase"
          >
            <Star className="w-3 h-3 fill-current" /> Arena Championship Series
          </motion.div>
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl md:text-8xl font-black italic tracking-tighter text-white neon-text uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            {tournament.title}
          </motion.h1>
          <div className="mt-6 flex items-center justify-center gap-8">
             <div className="flex flex-col items-center">
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Participants</span>
               <span className="text-2xl font-black italic text-primary">{tournament.participantCount}</span>
             </div>
             <div className="w-[1px] h-8 bg-white/10" />
             <div className="flex flex-col items-center">
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Status</span>
               <span className="text-2xl font-black italic text-emerald-500">ACTIVE</span>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex gap-2 p-1.5 bg-white/5 rounded-[24px] border border-white/10 overflow-x-auto no-scrollbar">
          {[
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { id: 'groups', label: 'Groups', icon: Layout, show: tournament.groupCount > 0 },
            { id: 'bracket', label: 'Bracket', icon: Sword },
            { id: 'matches', label: 'Matches', icon: Gamepad2 },
          ].map(tab => tab.show !== false && (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all whitespace-nowrap",
                activeTab === tab.id ? "bg-primary text-slate-950 shadow-[0_0_25px_rgba(0,242,255,0.4)] scale-105" : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          {activeTab === 'leaderboard' && (
            <motion.div 
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-[40px] border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/10">
                      <th className="px-10 py-8">Rank</th>
                      <th className="px-10 py-8">Participant</th>
                      <th className="px-10 py-8 text-center">MP</th>
                      <th className="px-10 py-8 text-center">W</th>
                      <th className="px-10 py-8 text-center">L</th>
                      <th className="px-10 py-8 text-center text-primary">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[...tournament.participants].sort((a, b) => b.points - a.points).map((p, i) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-10 py-8">
                          <span className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-lg",
                            i === 0 ? "bg-primary text-slate-950 shadow-[0_0_15px_rgba(0,242,255,0.4)]" : 
                            i === 1 ? "bg-slate-300 text-slate-950" : 
                            i === 2 ? "bg-amber-600 text-white" : "text-white/20"
                          )}>
                            {i + 1}
                          </span>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-primary/40 transition-all">
                              <img src={p.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <span className="text-lg font-black italic uppercase tracking-tighter">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-center font-bold text-white/40">{p.matchesPlayed}</td>
                        <td className="px-10 py-8 text-center font-bold text-emerald-500">{p.wins}</td>
                        <td className="px-10 py-8 text-center font-bold text-red-500">{p.losses}</td>
                        <td className="px-10 py-8 text-center text-3xl font-black text-primary italic">{p.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'groups' && (
            <motion.div 
              key="groups"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10"
            >
              {tournament.groups.map(group => (
                <GroupTable 
                  key={group.id} 
                  name={group.name} 
                  participants={group.participants} 
                />
              ))}
            </motion.div>
          )}

          {activeTab === 'matches' && (
            <motion.div 
              key="matches"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {tournament.matches.map(match => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onPlay={() => setSelectedMatch(match)}
                />
              ))}
            </motion.div>
          )}

          {activeTab === 'bracket' && (
            <motion.div 
              key="bracket"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <TournamentBracket matches={tournament.matches.filter(m => !m.stage.startsWith('Group'))} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedMatch && (
        <LotteryModal 
          lottery={{
            id: 999,
            title: `${selectedMatch.p1.name} VS ${selectedMatch.p2.name}`,
            type: selectedMatch.type,
            images: [
              { id: 1, name: selectedMatch.p1.name, url: selectedMatch.p1.image, created_at: '' },
              { id: 2, name: selectedMatch.p2.name, url: selectedMatch.p2.image, created_at: '' }
            ],
            hostImage: { id: 1, name: selectedMatch.p1.name, url: selectedMatch.p1.image, created_at: '' },
            is_active: 1,
            created_at: ''
          }}
          onClose={() => setSelectedMatch(null)}
          onWinner={handleMatchResult}
          duration={tournament.spinTime * 1000}
          skipSave={true}
        />
      )}
    </div>
  );
};

const MatchCard = ({ match, onPlay }: any) => {
  return (
    <div className="glass p-8 rounded-[40px] border border-white/10 hover:border-primary/30 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <div className={cn(
          "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border",
          match.winnerId ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20"
        )}>
          {match.winnerId ? 'Finished' : 'Upcoming'}
        </div>
      </div>

      <div className="mb-8">
        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/20">{match.stage}</span>
      </div>
      
      <div className="flex items-center gap-6 justify-between mb-10">
        <div className="flex flex-col items-center gap-4 flex-1">
          <div className={cn(
            "w-20 h-20 rounded-3xl overflow-hidden border-4 transition-all duration-500",
            match.winnerId === match.p1.id ? "border-emerald-500 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "border-white/10"
          )}>
            <img src={match.p1.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <span className="text-xs font-black italic uppercase tracking-tighter text-center truncate w-full">{match.p1.name}</span>
        </div>
        
        <div className="text-3xl font-black italic text-white/10">VS</div>
        
        <div className="flex flex-col items-center gap-4 flex-1">
          <div className={cn(
            "w-20 h-20 rounded-3xl overflow-hidden border-4 transition-all duration-500",
            match.winnerId === match.p2.id ? "border-emerald-500 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "border-white/10"
          )}>
            <img src={match.p2.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <span className="text-xs font-black italic uppercase tracking-tighter text-center truncate w-full">{match.p2.name}</span>
        </div>
      </div>

      {!match.winnerId ? (
        <button 
          onClick={onPlay}
          className="w-full py-4 rounded-2xl bg-primary text-slate-950 font-black text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 glowing-button uppercase italic"
        >
          <Play className="w-4 h-4 fill-current" /> Play Battle
        </button>
      ) : (
        <div className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-black text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 uppercase italic">
          <Check className="w-4 h-4" /> Match Over
        </div>
      )}
    </div>
  );
};

const TournamentBracket = ({ matches }: { matches: TournamentMatch[] }) => {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-8">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Sword className="w-12 h-12" />
        </div>
        <div>
          <h3 className="text-3xl font-black italic uppercase tracking-tighter">KNOCKOUT BRACKET</h3>
          <p className="text-white/40 max-w-md mx-auto mt-3 text-lg">The knockout stage will be generated automatically after the group stage concludes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {matches.map(m => <MatchCard key={m.id} match={m} onPlay={() => {}} />)}
    </div>
  );
};

const GroupTable = ({ name, participants }: any) => {
  return (
    <div className="glass rounded-[40px] border border-white/10 overflow-hidden shadow-xl">
      <div className="bg-white/5 p-8 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-2xl font-black italic tracking-tighter uppercase">{name}</h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-widest text-white/20 border-b border-white/5">
              <th className="px-8 py-5">Participant</th>
              <th className="px-6 py-5 text-center">MP</th>
              <th className="px-6 py-5 text-center">W</th>
              <th className="px-6 py-5 text-center text-primary">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[...participants].sort((a, b) => b.points - a.points).map((p, i) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-5">
                    <span className="text-[10px] font-black text-white/10">{i + 1}</span>
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 group-hover:border-primary/40 transition-all">
                      <img src={p.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-center text-xs font-bold text-white/40">{p.matchesPlayed}</td>
                <td className="px-6 py-6 text-center text-xs font-bold text-emerald-500">{p.wins}</td>
                <td className="px-6 py-6 text-center text-lg font-black text-primary italic">{p.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HostTournamentPage;
