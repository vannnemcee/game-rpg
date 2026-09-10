import React from 'react';
import { Trophy, RefreshCw, Home, ArrowRight, Skull, Sparkles } from 'lucide-react';
import { GameStats } from '../types';
import { sound } from '../game/sound';

// --- Level Complete Transition Screen ---
interface LevelCompleteModalProps {
  onContinue: () => void;
  stats: GameStats;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({ onContinue, stats }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 select-none animate-fade-in">
      <div className="pixel-box-gold max-w-md w-full p-6 text-center text-white relative">
        <div className="w-16 h-16 mx-auto mb-3 bg-amber-900/60 border-2 border-amber-500 rounded-full flex items-center justify-center text-3xl">
          🌟
        </div>

        <h2 className="text-2xl font-pixel text-amber-300 mb-1 drop-shadow">
          LEVEL COMPLETE!
        </h2>
        <p className="text-xs font-silkscreen text-emerald-200 mb-5">
          Kiko berhasil menyeberangi sungai dan mencapai portal kuno menuju hutan bagian dalam!
        </p>

        {/* Level 1 Recap */}
        <div className="bg-black/50 p-4 border-2 border-amber-800/80 rounded mb-6 text-xs font-pixel space-y-2 text-left">
          <div className="flex justify-between text-amber-200">
            <span>🪙 KOIN DIKUMPULKAN:</span>
            <span className="text-white">{stats.coinsCollected}</span>
          </div>
          <div className="flex justify-between text-sky-300">
            <span>💎 KRISTAL DITEMUKAN:</span>
            <span className="text-white">{stats.crystalsFound}</span>
          </div>
          <div className="flex justify-between text-rose-300">
            <span>⚔️ MONSTER DIKALAHKAN:</span>
            <span className="text-white">{stats.monstersDefeated}</span>
          </div>
        </div>

        <div className="p-2.5 mb-5 bg-purple-950/80 border border-purple-600/80 rounded text-[11px] font-silkscreen text-purple-200">
          ⚠️ PERINGATAN: Di Level 2 (Monster Forest), monster akan langsung menyerang di area awal!
        </div>

        <button
          onClick={() => {
            sound.playUiClick();
            onContinue();
          }}
          className="w-full pixel-btn-amber py-3.5 text-xs md:text-sm font-pixel flex items-center justify-center gap-2 tracking-wider cursor-pointer"
        >
          <span>MASUK LEVEL 2 (MONSTER FOREST)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// --- Game Over Screen ---
interface GameOverModalProps {
  onTryAgain: () => void;
  onMainMenu: () => void;
  levelNumber: 1 | 2;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  onTryAgain,
  onMainMenu,
  levelNumber,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 select-none animate-fade-in">
      <div className="pixel-box-dark max-w-sm w-full p-6 text-center text-white border-red-800">
        <div className="w-16 h-16 mx-auto mb-3 bg-red-950 border-2 border-red-600 rounded-full flex items-center justify-center">
          <Skull className="w-8 h-8 text-red-400" />
        </div>

        <h2 className="text-2xl md:text-3xl font-pixel text-red-500 mb-2 drop-shadow">
          GAME OVER
        </h2>
        <p className="text-xs font-silkscreen text-rose-200/80 mb-6">
          Kiko kehabisan tenaga dan terjatuh di dalam hutan yang lebat...
        </p>

        <div className="space-y-3">
          <button
            id="try-again-btn"
            onClick={() => {
              sound.playUiClick();
              onTryAgain();
            }}
            className="w-full pixel-btn-amber py-3 text-xs font-pixel flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            TRY AGAIN (LEVEL {levelNumber})
          </button>

          <button
            id="main-menu-btn"
            onClick={() => {
              sound.playUiClick();
              onMainMenu();
            }}
            className="w-full pixel-btn py-3 text-xs font-pixel flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Victory Screen ---
interface VictoryModalProps {
  onPlayAgain: () => void;
  onMainMenu: () => void;
  stats: GameStats;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  onPlayAgain,
  onMainMenu,
  stats,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 select-none animate-fade-in">
      <div className="pixel-box-gold max-w-md w-full p-6 text-center text-white relative">
        <div className="w-20 h-20 mx-auto mb-3 bg-amber-900/60 border-4 border-amber-400 rounded-full flex items-center justify-center text-4xl shadow-xl">
          🦊🏆
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 bg-amber-950 border border-amber-500 rounded text-[10px] font-pixel text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          FOREST SAVED!
        </div>

        <h2 className="text-2xl md:text-3xl font-pixel text-amber-300 mb-2 drop-shadow">
          ADVENTURE COMPLETE!
        </h2>

        <p className="text-xs font-silkscreen text-emerald-200 mb-6 leading-relaxed">
          Selamat! Berkat keberanian Kiko si Rubah, monster hutan kegelapan berhasil dipukul mundur dan kedamaian kembali ke Foxwood!
        </p>

        {/* Final Stats Summary */}
        <div className="bg-black/60 p-4 border-2 border-amber-700/80 rounded mb-6 text-xs font-pixel space-y-2 text-left">
          <div className="flex justify-between text-amber-200 pb-1 border-b border-amber-950">
            <span>🪙 TOTAL KOIN:</span>
            <span className="text-white font-bold">{stats.coinsCollected}</span>
          </div>
          <div className="flex justify-between text-sky-300 pb-1 border-b border-amber-950">
            <span>💎 TOTAL KRISTAL:</span>
            <span className="text-white font-bold">{stats.crystalsFound}</span>
          </div>
          <div className="flex justify-between text-rose-300 pb-1 border-b border-amber-950">
            <span>⚔️ MONSTER DIKALAHKAN:</span>
            <span className="text-white font-bold">{stats.monstersDefeated}</span>
          </div>
          <div className="flex justify-between text-emerald-300">
            <span>🧪 POTION DIMINUM:</span>
            <span className="text-white font-bold">{stats.potionsUsed}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            id="play-again-btn"
            onClick={() => {
              sound.playUiClick();
              onPlayAgain();
            }}
            className="pixel-btn-amber py-3 text-xs font-pixel flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            PLAY AGAIN
          </button>

          <button
            id="victory-menu-btn"
            onClick={() => {
              sound.playUiClick();
              onMainMenu();
            }}
            className="pixel-btn py-3 text-xs font-pixel flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};
