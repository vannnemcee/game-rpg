import React from 'react';
import { Volume2, VolumeX, Pause, Play, Backpack, Heart, Shield, Sparkles, Sword } from 'lucide-react';
import { Player, LevelConfig, InventoryItem } from '../types';

interface PixelHUDProps {
  player: Player;
  levelConfig: LevelConfig;
  inventory: InventoryItem[];
  isMuted: boolean;
  isPaused: boolean;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onOpenInventory: () => void;
  onQuickUsePotion: () => void;
  onAttackButton: () => void;
  onDirectionInput: (dir: 'up' | 'down' | 'left' | 'right' | null) => void;
}

export const PixelHUD: React.FC<PixelHUDProps> = ({
  player,
  levelConfig,
  inventory,
  isMuted,
  isPaused,
  onToggleMute,
  onTogglePause,
  onOpenInventory,
  onQuickUsePotion,
  onAttackButton,
  onDirectionInput,
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

        {/* Center: Current Level Badge */}
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
        <div className="self-center my-auto pointer-events-auto pixel-box p-6 text-center max-w-sm">
          <h2 className="text-xl font-pixel text-amber-400 mb-2">GAME DIJEDA</h2>
          <p className="text-xs font-silkscreen text-emerald-200 mb-4">
            Beristirahat sejenak di bawah naungan pohon hutan.
          </p>
          <button
            onClick={onTogglePause}
            className="pixel-btn-amber px-6 py-2.5 text-xs font-pixel cursor-pointer"
          >
            LANJUTKAN
          </button>
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

        {/* Action Controls on Bottom Right (Sword Attack, Drink Potion) */}
        <div className="pointer-events-auto flex items-end gap-3 select-none">
          {/* Potion Quick Button */}
          <button
            onClick={onQuickUsePotion}
            className="w-14 h-14 pixel-btn-red flex flex-col items-center justify-center cursor-pointer active:scale-95 relative"
            title="Minum Potion (+50 HP)"
          >
            <span className="text-xl">🧪</span>
            <span className="text-[9px] font-pixel text-white">E</span>
            {potionCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-amber-400 text-black text-[9px] font-pixel font-bold rounded-full border border-black">
                {potionCount}
              </span>
            )}
          </button>

          {/* Large Sword Attack Button */}
          <button
            id="attack-btn"
            onClick={onAttackButton}
            className="w-18 h-18 pixel-btn-amber flex flex-col items-center justify-center cursor-pointer active:scale-95 shadow-xl"
            title="Tebas Pedang (SPASI)"
          >
            <Sword className="w-8 h-8 text-amber-200" />
            <span className="text-[10px] font-pixel text-amber-100 tracking-wider">
              SPASI
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
};
