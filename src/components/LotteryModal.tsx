import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  Trophy
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Lottery, LotteryImage } from '../types';

interface LotteryModalProps {
  lottery: Lottery;
  onClose: () => void;
  onWinner?: (winner: LotteryImage) => void;
  duration?: number;
  skipSave?: boolean;
}

export const LotteryModal: React.FC<LotteryModalProps> = ({ lottery, onClose, onWinner, duration = 4000, skipSave = false }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [winner, setWinner] = useState<LotteryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Cryptographically secure random number generator
  const getSecureRandomInt = (max: number) => {
    const range = 4294967296; // 2^32
    const limit = range - (range % max);
    let randomValue;
    do {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      randomValue = array[0];
    } while (randomValue >= limit);
    return randomValue % max;
  };

  const startLottery = () => {
    if (isSpinning || isRevealing || lottery.images.length === 0) return;
    setIsSpinning(true);
    setIsRevealing(false);
    setWinner(null);
    setShowCelebration(false);
    
    // Securely select winner at the moment of start
    const winIndex = getSecureRandomInt(lottery.images.length);
    const selectedWinner = lottery.images[winIndex];
    
    let startTime = Date.now();
    
    const spin = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if (elapsed < duration) {
        // Shuffle through all images for visual effect
        const randomIndex = getSecureRandomInt(lottery.images.length);
        setCurrentIndex(randomIndex);
        // Ease out the speed
        const delay = 50 + (Math.pow(progress, 2) * 250);
        setTimeout(spin, delay);
      } else {
        // Start reveal sequence
        setIsSpinning(false);
        setIsRevealing(true);
        setWinner(selectedWinner);
        setCurrentIndex(winIndex); // Ensure it stops exactly on the winner
        
        // Finalize reveal after a short delay for the slide-in
        setTimeout(async () => {
          setShowCelebration(true);
          if (onWinner) onWinner(selectedWinner);
          
          // Save winner to history
          if (!skipSave) {
            try {
              await fetch('/api/winners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  lottery_id: lottery.id,
                  image_id: selectedWinner.id,
                  winner_name: selectedWinner.name,
                  winner_url: selectedWinner.url,
                  lottery_title: lottery.title
                })
              });
            } catch (err) {
              console.error('Error saving winner:', err);
            }
          }
        }, 500);
      }
    };
    
    spin();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-6xl bg-slate-900/50 border border-white/10 rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all z-50"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 md:p-16 flex flex-col items-center min-h-[600px] justify-center">
          <div className="flex flex-col items-center gap-2 mb-12">
            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-black italic tracking-[0.3em] text-white/40"
            >
              {lottery.type === 'vs' ? "ARENA BATTLE" : "PRIZE DRAW"}
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase">Fair Random System Active</span>
            </motion.div>
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 w-full">
            
            {/* Host Side (Left) */}
            {lottery.type === 'vs' && (
              <motion.div 
                animate={isRevealing ? { x: [ -100, 0 ], opacity: [0, 1] } : { x: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="flex flex-col items-center gap-6 relative"
              >
                <div className="relative">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl border-4 border-primary/50 shadow-[0_0_50px_rgba(0,242,255,0.2)] overflow-hidden relative z-10">
                    <img src={lottery.hostImage?.url} alt="Host" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full z-0"
                  />
                </div>
                <div className="px-6 py-2 bg-primary/10 border border-primary/20 rounded-full">
                  <span className="text-sm font-black tracking-widest text-primary">CHAMPION</span>
                </div>
              </motion.div>
            )}

            {/* VS Center Element */}
            {lottery.type === 'vs' && (
              <div className="relative flex items-center justify-center z-20">
                <AnimatePresence>
                  {(isSpinning || isRevealing) && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ 
                        scale: isRevealing ? 1.5 : 1, 
                        rotate: 0,
                        x: isRevealing ? [0, -2, 2, -2, 2, 0] : 0
                      }}
                      transition={{ 
                        scale: { type: "spring", stiffness: 200 },
                        x: { repeat: Infinity, duration: 0.1 }
                      }}
                      className="relative"
                    >
                      <span className="text-7xl md:text-9xl font-black italic text-white neon-text drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                        VS
                      </span>
                      {showCelebration && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ scale: 4, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 bg-white rounded-full blur-xl"
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Challenger Side (Right) */}
            <motion.div 
              animate={isRevealing ? { x: [ 100, 0 ], opacity: [0, 1] } : { x: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="flex flex-col items-center gap-6 relative"
            >
              <div className="relative">
                <motion.div 
                  animate={isSpinning ? { 
                    scale: [1, 1.05, 1],
                    filter: ["blur(0px)", "blur(4px)", "blur(0px)"]
                  } : { 
                    scale: 1,
                    filter: "blur(0px)" 
                  }}
                  transition={isSpinning ? { duration: 0.1, repeat: Infinity } : { duration: 0.3 }}
                  className={cn(
                    "w-48 h-48 md:w-64 md:h-64 rounded-3xl border-4 overflow-hidden shadow-2xl relative z-10 transition-all duration-500",
                    showCelebration ? "border-accent shadow-[0_0_60px_rgba(255,0,200,0.6)] scale-110" : "border-white/10"
                  )}
                >
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={currentIndex}
                      initial={{ y: isSpinning ? 100 : 0, opacity: isSpinning ? 0 : 1 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: isSpinning ? -100 : 0, opacity: isSpinning ? 0 : 1 }}
                      transition={{ duration: 0.05 }}
                      src={lottery.images[currentIndex]?.url} 
                      alt="Target" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>
                </motion.div>
                
                {showCelebration && (
                  <>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -inset-8 bg-accent/30 blur-3xl rounded-full z-0"
                    />
                    {/* Particle Sparks */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: "50%", y: "50%", opacity: 1 }}
                          animate={{ 
                            x: `${50 + (Math.random() - 0.5) * 200}%`, 
                            y: `${50 + (Math.random() - 0.5) * 200}%`,
                            opacity: 0,
                            scale: 0
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="absolute w-2 h-2 bg-accent rounded-full z-20"
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className={cn(
                "px-6 py-2 rounded-full transition-all duration-500",
                showCelebration ? "bg-accent/20 border-accent/30" : "bg-white/5 border-white/10"
              )}>
                <span className={cn(
                  "text-sm font-black tracking-widest",
                  showCelebration ? "text-accent" : "text-white/40"
                )}>
                  {showCelebration ? "WINNER" : "CHALLENGER"}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="mt-16 h-24 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {showCelebration ? (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-center"
                >
                  <h3 className="text-5xl font-black text-accent mb-2 neon-text italic tracking-tighter">VICTORY!</h3>
                  <p className="text-xl font-bold text-white/60 mb-8 uppercase tracking-widest">{winner?.name}</p>
                  <button 
                    onClick={startLottery}
                    className="group relative px-16 py-5 rounded-2xl bg-white text-slate-950 font-black tracking-[0.2em] overflow-hidden transition-all hover:scale-105 active:scale-95"
                  >
                    <span className="relative z-10">BATTLE AGAIN</span>
                    <motion.div 
                      className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                </motion.div>
              ) : !isSpinning && !isRevealing && (
                <motion.button 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startLottery}
                  className="px-20 py-6 rounded-2xl bg-primary text-slate-950 font-black tracking-[0.3em] shadow-[0_0_40px_rgba(0,242,255,0.4)] transition-all"
                >
                  START BATTLE
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
