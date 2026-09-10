import React from 'react';
import { Volume2, VolumeX, Pause, Play, Backpack, Heart, Shield, Sparkles, Sword, Home } from 'lucide-react';
import { Player, LevelConfig, InventoryItem } from '../types';

export interface BossInfo {
  name: string;
  hp: number;
  maxHp: number;
  type: string;
  isDead: boolean;
}

interface PixelHUDProps {
  player: Player;
  levelConfig: LevelConfig;
  inventory: InventoryItem[];
  isMuted: boolean;
  isPaused: boolean;
  isSprinting: boolean;
  activeBoss?: BossInfo | null;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onOpenInventory: () => void;
  onQuickUsePotion: () => void;
  onAttackButton: () => void;
  onToggleSprint: (sprinting: boolean) => void;
  onDirectionInput: (dir: 'up' | 'down' | 'left' | 'right' | null) => void;
  onMainMenu: () => void;
}

export const PixelHUD: React.FC<PixelHUDProps> = ({
  player,
  levelConfig,
  inventory,
  isMuted,
  isPaused,
  isSprinting,
  activeBoss,
  onToggleMute,
  onTogglePause,
  onOpenInventory,
  onQuickUsePotion,
  onAttackButton,
  onToggleSprint,
  onDirectionInput,
  onMainMenu,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const potionItem = inventory.find((i) => i.type === 'potion');
  const potionCount = potionItem ? potionItem.count : 0;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 md:p-5 select-none">
      {/* Top Bar */}
      <header className="w-full flex items-start justify-between gap-3">
        {/* Left: Player Profile & Health Bar */}
        <div className="pixel-box pointer-events-auto p-2.5 flex items-center gap-3 bg-emerald-950/90 border-2 border-emerald-700">
          {/* Fox Portrait */}
          <div className="w-12 h-12 flex-shrink-0 bg-orange-950 border-2 border-orange-500 rounded flex items-center justify-center relative overflow-hidden">
            <span className="text-2xl">🦊</span>
            {player.hurtTimer > 0 && (
              <div className="absolute inset-0 bg-red-600/60 animate-ping" />
            )}
          </div>

          {/* Health Bar Details */}
          <div className="flex flex-col gap-1 min-w-[140px] md:min-w-[180px]">
            <div className="flex items-center justify-between text-[11px] font-pixel text-emerald-200">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                HP
              </span>
              <span className="text-white font-bold">
                {Math.max(0, Math.floor(player.hp))} / {player.maxHp}
              </span>
            </div>

            {/* Custom Pixel Health Bar Container */}
            <div className="w-full h-4 bg-black/80 border-2 border-emerald-900 rounded-xs p-0.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-150 ${
                  hpPercent > 50
                    ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                    : hpPercent > 25
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    : 'bg-gradient-to-r from-red-600 to-rose-400 animate-pulse'
                }`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Boss Big Heart UI (or Level Badge) */}
        <div className="flex flex-col items-center max-w-[220px] sm:max-w-xs md:max-w-md w-full mx-2 pointer-events-auto">
          {activeBoss && !activeBoss.isDead ? (
            <div className="pixel-box-gold w-full px-3 py-1.5 sm:px-4 sm:py-2 flex flex-col items-center bg-black/85 border-2 border-amber-400 shadow-2xl animate-fade-in">
              {/* Boss Name Header */}
              <div className="flex items-center gap-1.5 text-[9px] sm:text-xs font-pixel text-amber-300 tracking-wider text-center drop-shadow">
                <span>👑</span>
                <span>{activeBoss.name}</span>
              </div>

              {/* BIG HEART UI DI TENGAH-TENGAH */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 my-0.5 sm:my-1">
                {/* Big Pulsating Center Heart */}
                <div className="relative flex items-center justify-center">
                  <Heart
                    className={`w-7 h-7 sm:w-9 sm:h-9 text-red-500 fill-red-500 transition-transform ${
                      activeBoss.hp < activeBoss.maxHp * 0.3 ? 'animate-bounce' : 'animate-pulse'
                    }`}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] sm:text-[9px] font-pixel font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    {Math.round((activeBoss.hp / activeBoss.maxHp) * 100)}%
                  </span>
                </div>

                {/* 10 Hearts Gauge Bar */}
                <div className="hidden xs:flex items-center gap-0.5 sm:gap-1">
                  {Array.from({ length: 10 }).map((_, hIdx) => {
                    const threshold = (hIdx + 1) * (activeBoss.maxHp / 10);
                    const isFull = activeBoss.hp >= threshold;
                    const isHalf = !isFull && activeBoss.hp >= threshold - activeBoss.maxHp / 20;
                    return (
                      <span
                        key={hIdx}
                        className={`text-xs sm:text-sm transition-all ${
                          isFull
                            ? 'text-red-500 scale-100 drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]'
                            : isHalf
                            ? 'text-rose-400 opacity-90'
                            : 'text-stone-700 opacity-40 scale-75'
                        }`}
                      >
                        ❤️
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Boss Health Bar & HP Count */}
              <div className="w-full flex items-center justify-between text-[8px] sm:text-[10px] font-pixel text-emerald-200 px-0.5 mb-0.5">
                <span className="text-amber-300">RAJA LENDIR</span>
                <span className="text-white font-bold">
                  {Math.max(0, Math.floor(activeBoss.hp))} / {activeBoss.maxHp} HP
                </span>
              </div>
              <div className="w-full h-2.5 sm:h-3.5 bg-black/90 border border-emerald-700 rounded-xs p-0.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-lime-300 transition-all duration-150"
                  style={{ width: `${Math.max(0, Math.min(100, (activeBoss.hp / activeBoss.maxHp) * 100))}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex flex-col items-center">
              <div className="pixel-box-dark px-4 py-1.5 border-2 border-emerald-600/80 text-center">
                <div className="text-[11px] font-pixel text-amber-300 tracking-wider">
                  {levelConfig.title}
                </div>
                <div className="text-[9px] font-silkscreen text-emerald-300/80">
                  {levelConfig.subtitle}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Currency & Control Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Coins & Crystals Counter */}
          <div className="pixel-box px-3 py-2 flex items-center gap-3 bg-emerald-950/90 border-2 border-emerald-700 text-xs font-pixel">
            <div className="flex items-center gap-1 text-amber-300">
              <span className="text-sm">🪙</span>
              <span>{player.coins}</span>
            </div>
            <div className="flex items-center gap-1 text-sky-300">
              <span className="text-sm">💎</span>
              <span>{player.crystals}</span>
            </div>
          </div>

          {/* Quick Potion Button */}
          <button
            id="quick-potion-btn"
            onClick={onQuickUsePotion}
            className={`relative p-2.5 pixel-btn-red text-white flex items-center justify-center cursor-pointer ${
              potionCount === 0 ? 'opacity-50 grayscale' : ''
            }`}
            title="Gunakan Potion (E)"
          >
            <span className="text-lg">🧪</span>
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 bg-amber-400 text-black text-[9px] font-pixel font-bold rounded-full border border-black">
              {potionCount}
            </span>
          </button>

          {/* Inventory Button */}
          <button
            id="inventory-btn"
            onClick={onOpenInventory}
            className="p-2.5 pixel-btn text-white flex items-center justify-center cursor-pointer"
            title="Buka Tas Inventory (I)"
          >
            <Backpack className="w-5 h-5 text-emerald-300" />
          </button>

          {/* Audio Mute Button */}
          <button
            id="hud-sound-toggle-btn"
            onClick={onToggleMute}
            className="p-2.5 pixel-box-dark text-emerald-300 hover:text-white cursor-pointer"
            title={isMuted ? 'Nyalakan Suara (M)' : 'Matikan Suara (M)'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          {/* Pause Button */}
          <button
            id="pause-game-btn"
            onClick={onTogglePause}
            className="p-2.5 pixel-box-dark text-amber-300 hover:text-white cursor-pointer"
            title="Jeda Permainan"
          >
            {isPaused ? <Play className="w-5 h-5 fill-current text-green-400" /> : <Pause className="w-5 h-5 fill-current" />}
          </button>
        </div>
      </header>

      {/* Center Toast / Paused Overlay if paused */}
      {isPaused && (
        <div className="self-center my-auto pointer-events-auto pixel-box-dark p-6 sm:p-7 text-center max-w-sm w-full shadow-2xl border-4 border-amber-600/80 bg-black/95 animate-fade-in">
          <div className="w-12 h-12 mx-auto mb-3 bg-amber-950/80 border-2 border-amber-500 rounded-full flex items-center justify-center text-2xl">
            ⏸️
          </div>
          <h2 className="text-xl sm:text-2xl font-pixel text-amber-400 mb-1">GAME DIJEDA</h2>
          <p className="text-xs font-silkscreen text-emerald-200/90 mb-5">
            Beristirahat sejenak di bawah naungan pohon hutan.
          </p>

          {/* TWO PAUSE BUTTONS AS REQUESTED: 1. Lanjutkan, 2. Kembali ke menu */}
          <div className="flex flex-col gap-2.5">
            <button
              id="pause-continue-btn"
              onClick={onTogglePause}
              className="pixel-btn-amber py-3 px-6 text-xs sm:text-sm font-pixel flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition tracking-wider"
            >
              <Play className="w-4 h-4 fill-current" />
              LANJUTKAN
            </button>

            <button
              id="pause-main-menu-btn"
              onClick={onMainMenu}
              className="pixel-btn py-3 px-6 text-xs sm:text-sm font-pixel flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition tracking-wider bg-stone-800 border-stone-600 hover:bg-stone-700"
            >
              <Home className="w-4 h-4" />
              KEMBALI KE MENU
            </button>
          </div>
        </div>
      )}

      {/* Bottom Controls Area (Virtual Touch Controls for Mobile & Desktop clickers) */}
      <footer className="w-full flex items-end justify-between pointer-events-none pb-2">
        {/* Virtual D-Pad / Arrow keys for Touch / Mobile users */}
        <div className="pointer-events-auto flex flex-col items-center gap-1 select-none bg-black/40 p-2 border-2 border-emerald-900/60 rounded-md backdrop-blur-xs">
          <button
            onPointerDown={() => onDirectionInput('up')}
            onPointerUp={() => onDirectionInput(null)}
            onPointerLeave={() => onDirectionInput(null)}
            className="w-11 h-11 pixel-box flex items-center justify-center text-emerald-300 active:scale-95 cursor-pointer"
          >
            ▲
          </button>
          <div className="flex gap-2">
            <button
              onPointerDown={() => onDirectionInput('left')}
              onPointerUp={() => onDirectionInput(null)}
              onPointerLeave={() => onDirectionInput(null)}
              className="w-11 h-11 pixel-box flex items-center justify-center text-emerald-300 active:scale-95 cursor-pointer"
            >
              ◀
            </button>
            <div className="w-11 h-11 flex items-center justify-center text-[10px] text-emerald-500 font-pixel">
              PAD
            </div>
            <button
              onPointerDown={() => onDirectionInput('right')}
              onPointerUp={() => onDirectionInput(null)}
              onPointerLeave={() => onDirectionInput(null)}
              className="w-11 h-11 pixel-box flex items-center justify-center text-emerald-300 active:scale-95 cursor-pointer"
            >
              ▶
            </button>
          </div>
          <button
            onPointerDown={() => onDirectionInput('down')}
            onPointerUp={() => onDirectionInput(null)}
            onPointerLeave={() => onDirectionInput(null)}
            className="w-11 h-11 pixel-box flex items-center justify-center text-emerald-300 active:scale-95 cursor-pointer"
          >
            ▼
          </button>
        </div>

        {/* Action Controls on Bottom Right (Sprint, Potion, Sword Attack) */}
        <div className="pointer-events-auto flex items-end gap-2 sm:gap-3 select-none">
          {/* Sprint / Lari Cepat Button (Shift) */}
          <button
            id="sprint-btn"
            onPointerDown={() => onToggleSprint(true)}
            onPointerUp={() => onToggleSprint(false)}
            onPointerLeave={() => onToggleSprint(false)}
            onClick={() => onToggleSprint(!isSprinting)}
            className={`w-11 h-11 sm:w-13 sm:h-13 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all rounded-xs ${
              isSprinting ? 'pixel-btn-amber ring-2 ring-amber-300' : 'pixel-box-dark text-emerald-300 hover:text-white'
            }`}
            title="Lari Cepat / Sprint (Tahan SHIFT)"
          >
            <span className="text-sm sm:text-base">⚡</span>
            <span className="text-[7px] sm:text-[8px] font-pixel text-amber-200">
              {isSprinting ? 'LARI ON' : 'LARI'}
            </span>
          </button>

          {/* Potion Quick Button */}
          <button
            onClick={onQuickUsePotion}
            className="w-11 h-11 sm:w-13 sm:h-13 pixel-btn-red flex flex-col items-center justify-center cursor-pointer active:scale-95 relative rounded-xs"
            title="Minum Potion (+50 HP) [E]"
          >
            <span className="text-base sm:text-lg">🧪</span>
            <span className="text-[7px] sm:text-[8px] font-pixel text-white">E</span>
            {potionCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1 py-0.1 bg-amber-400 text-black text-[8px] font-pixel font-bold rounded-full border border-black">
                {potionCount}
              </span>
            )}
          </button>

          {/* Large Sword Attack Button */}
          <button
            id="attack-btn"
            onClick={onAttackButton}
            className="w-14 h-14 sm:w-16 sm:h-16 pixel-btn-amber flex flex-col items-center justify-center cursor-pointer active:scale-95 shadow-xl rounded-xs"
            title="Tebas Pedang (Klik Kiri Mouse / SPASI)"
          >
            <Sword className="w-6 h-6 sm:w-7 sm:h-7 text-amber-200" />
            <span className="text-[8px] sm:text-[9px] font-pixel text-amber-100 tracking-wider">
              SERANG
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
};
