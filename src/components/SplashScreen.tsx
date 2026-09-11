import React, { useEffect, useRef, useState } from 'react';
import { Play, HelpCircle, Volume2, VolumeX, Shield, Sparkles, Settings, X, Sliders, CheckCircle2 } from 'lucide-react';
import { sound } from '../game/sound';

interface SplashScreenProps {
  onStartGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onStartGame,
  isMuted,
  onToggleMute,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolumeState] = useState<number>(() => sound.getVolume());
  const [screenShakeEnabled, setScreenShakeEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('foxwood_screenshake') !== 'false';
    } catch {
      return true;
    }
  });
  const [particlesEnabled, setParticlesEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('foxwood_particles') !== 'false';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    sound.startBGM('menu');
    return () => {
      // Don't kill BGM if switching into level 1
    };
  }, []);

  // Pixel Art Animated Forest Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Background particle entities (leaves, fireflies, birds)
    const leaves: { x: number; y: number; speedX: number; speedY: number; size: number; col: string }[] = [];
    for (let i = 0; i < 35; i++) {
      leaves.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        speedX: 0.3 + Math.random() * 0.8,
        speedY: 0.4 + Math.random() * 0.8,
        size: 2 + Math.floor(Math.random() * 3),
        col: Math.random() > 0.5 ? '#4ade80' : '#86efac',
      });
    }

    const fireflies: { x: number; y: number; baseAngle: number; speed: number; col: string }[] = [];
    for (let i = 0; i < 20; i++) {
      fireflies.push({
        x: 80 + Math.random() * 640,
        y: 200 + Math.random() * 350,
        baseAngle: Math.random() * Math.PI * 2,
        speed: 1 + Math.random() * 2,
        col: Math.random() > 0.3 ? '#fef08a' : '#67e8f9',
      });
    }

    const render = () => {
      time += 0.025;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Sky Gradient (Deep twilight fantasy forest)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#091310');
      skyGrad.addColorStop(0.5, '#12261b');
      skyGrad.addColorStop(1, '#0c1a13');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Distant Mist & Light Rays
      for (let i = 0; i < 4; i++) {
        const rayX = 100 + i * 180 + Math.sin(time + i) * 30;
        const grad = ctx.createLinearGradient(rayX, 0, rayX + 60, h);
        grad.addColorStop(0, 'rgba(254, 240, 138, 0.08)');
        grad.addColorStop(0.7, 'rgba(167, 243, 208, 0.04)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(rayX - 30, 0);
        ctx.lineTo(rayX + 90, 0);
        ctx.lineTo(rayX + 160, h);
        ctx.lineTo(rayX - 90, h);
        ctx.fill();
      }

      // 3. Ancient Castle / Ruins Silhouette in background
      ctx.fillStyle = '#0a1610';
      // Castle spires
      ctx.fillRect(w / 2 - 120, h - 340, 60, 200);
      ctx.fillRect(w / 2 - 140, h - 380, 25, 240);
      ctx.fillRect(w / 2 + 60, h - 360, 70, 220);
      ctx.fillRect(w / 2 + 100, h - 400, 30, 260);
      // Castle battlements
      for (let bx = -130; bx <= 120; bx += 20) {
        ctx.fillRect(w / 2 + bx, h - 350, 12, 12);
      }

      // 4. Distant Trees (Midground)
      ctx.fillStyle = '#102419';
      for (let x = 0; x < w; x += 45) {
        const treeH = 220 + Math.sin(x * 0.05) * 40;
        ctx.fillRect(x, h - treeH, 40, treeH);
        ctx.beginPath();
        ctx.arc(x + 20, h - treeH, 36, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Foreground Giant Ancient Forest Trees
      ctx.fillStyle = '#0b1911';
      // Left Giant Tree
      ctx.fillRect(-20, 0, 140, h);
      ctx.fillRect(100, 180, 80, 20);
      ctx.beginPath();
      ctx.arc(100, 80, 140, 0, Math.PI * 2);
      ctx.fill();

      // Right Giant Tree
      ctx.fillRect(w - 120, 0, 140, h);
      ctx.fillRect(w - 180, 200, 70, 20);
      ctx.beginPath();
      ctx.arc(w - 90, 90, 140, 0, Math.PI * 2);
      ctx.fill();

      // 6. Forest Ground & Grass
      ctx.fillStyle = '#14291c';
      ctx.fillRect(0, h - 110, w, 110);
      ctx.fillStyle = '#1e3d2a';
      ctx.fillRect(0, h - 110, w, 8);

      // Grass tufts
      for (let gx = 0; gx < w; gx += 16) {
        const sway = Math.sin(time * 3 + gx) * 2;
        ctx.fillStyle = '#39784e';
        ctx.fillRect(gx + sway, h - 118, 3, 8);
        ctx.fillRect(gx + 4 + sway, h - 122, 3, 12);
      }

      // 7. Torches with glowing animated fire
      const drawTorch = (tx: number, ty: number) => {
        // Post
        ctx.fillStyle = '#3b2314';
        ctx.fillRect(tx - 3, ty, 6, 40);
        ctx.fillStyle = '#5c3820';
        ctx.fillRect(tx - 6, ty - 6, 12, 8);
        // Flame
        const flick = Math.sin(time * 18 + tx) * 2;
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(tx - 4 + flick * 0.5, ty - 16, 8, 10);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(tx - 3 + flick, ty - 22, 6, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(tx - 1, ty - 24, 2, 4);

        // Glow
        const rad = ctx.createRadialGradient(tx, ty - 14, 2, tx, ty - 14, 70);
        rad.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
        rad.addColorStop(0.6, 'rgba(249, 115, 22, 0.12)');
        rad.addColorStop(1, 'transparent');
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(tx, ty - 14, 70, 0, Math.PI * 2);
        ctx.fill();
      };

      drawTorch(180, h - 110);
      drawTorch(w - 180, h - 110);

      // 8. Flying Birds across the canopy
      const birdCycle = (time * 60) % (w + 160) - 80;
      const birdY = 70 + Math.sin(time * 2) * 15;
      const wingFlap = Math.sin(time * 12) > 0 ? -4 : 3;

      ctx.fillStyle = '#060d09';
      // Bird 1
      ctx.fillRect(birdCycle, birdY, 5, 2);
      ctx.fillRect(birdCycle - 3, birdY + wingFlap, 3, 2);
      ctx.fillRect(birdCycle + 5, birdY + wingFlap, 3, 2);
      // Bird 2
      ctx.fillRect(birdCycle - 35, birdY + 18, 4, 2);
      ctx.fillRect(birdCycle - 38, birdY + 18 + wingFlap, 3, 2);
      ctx.fillRect(birdCycle - 31, birdY + 18 + wingFlap, 3, 2);

      // 9. Drifting Leaves
      leaves.forEach((leaf) => {
        leaf.x += leaf.speedX + Math.sin(time + leaf.y) * 0.5;
        leaf.y += leaf.speedY;
        if (leaf.x > w) leaf.x = -10;
        if (leaf.y > h - 100) leaf.y = 0;

        ctx.fillStyle = leaf.col;
        ctx.fillRect(Math.floor(leaf.x), Math.floor(leaf.y), leaf.size, leaf.size);
      });

      // 10. Fireflies
      fireflies.forEach((ff, idx) => {
        const fx = ff.x + Math.sin(time * ff.speed + ff.baseAngle) * 16;
        const fy = ff.y + Math.cos(time * ff.speed + ff.baseAngle) * 14;
        const pulse = (Math.sin(time * 5 + idx) + 1) / 2;

        ctx.fillStyle = ff.col;
        ctx.fillRect(Math.floor(fx), Math.floor(fy), 3, 3);
        ctx.fillStyle = `rgba(250, 204, 21, ${0.2 + pulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(fx + 1.5, fy + 1.5, 6 + pulse * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleStart = () => {
    sound.playUiClick();
    onStartGame();
  };

  return (
    <div className="relative w-full min-h-[100dvh] h-full flex flex-col items-center justify-between overflow-y-auto overflow-x-hidden select-none bg-emerald-950 p-2 sm:p-4">
      {/* Background Pixel Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="absolute inset-0 w-full h-full object-cover pixelated pointer-events-none"
      />

      {/* Top Header Buttons */}
      <header className="relative z-10 w-full max-w-5xl px-3 sm:px-6 pt-1 sm:pt-4 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-2 px-2.5 py-1 bg-black/60 border-2 border-emerald-800 rounded-sm text-[10px] sm:text-xs text-emerald-300 font-pixel">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
          FOXWOOD TALE v1.5 •
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            id="sound-toggle-btn"
            onClick={() => {
              onToggleMute();
            }}
            className="p-2 sm:p-2.5 bg-emerald-950/80 hover:bg-emerald-900 border-2 border-emerald-700 text-emerald-300 rounded-sm cursor-pointer transition shadow-md"
            title={isMuted ? 'Nyalakan Suara (M)' : 'Matikan Suara (M)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />}
          </button>

          <button
            id="header-settings-btn"
            onClick={() => {
              sound.playUiClick();
              setShowSettings(true);
            }}
            className="p-2 sm:p-2.5 bg-emerald-950/80 hover:bg-emerald-900 border-2 border-emerald-700 text-emerald-300 rounded-sm cursor-pointer transition shadow-md"
            title="Pengaturan"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
          </button>
        </div>
      </header>

      {/* Center Hero Title & Main Menu Buttons */}
      <main className="relative z-10 flex flex-col items-center text-center px-2 sm:px-4 my-auto py-1 sm:py-3 max-w-2xl flex-shrink-0">
        {/* Title Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-1 sm:mb-2 bg-amber-950/80 border-2 border-amber-600/70 text-amber-300 text-[10px] sm:text-xs font-pixel tracking-wider shadow-lg">
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
          PETUALANGAN RUBAH DI HUTAN MONSTER v1.5
        </div>

        {/* Main Pixel Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-pixel tracking-tight text-white drop-shadow-[0_4px_0_#14351b] mb-1">
          FOXWOOD TALE
        </h1>

        <p className="max-w-lg text-emerald-200 text-[11px] sm:text-xs md:text-sm font-silkscreen mb-1 sm:mb-2.5 px-3 py-1 bg-black/40 border border-emerald-900/60 rounded">
          Bimbing <span className="text-orange-400 font-bold">Kiko si Rubah Pemberani</span> menghadapi monster & bos raksasa King Slime di Level 5!
        </p>

        {/* Character Card Preview */}
        <div className="flex items-center gap-2.5 px-3 py-1 mb-2 sm:mb-3 bg-black/60 border-2 border-emerald-800 rounded-sm">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-orange-950 border-2 border-orange-600 rounded">
            <span className="text-base sm:text-lg">🦊</span>
          </div>
          <div className="text-left">
            <div className="text-[10px] sm:text-xs font-pixel text-orange-400">Kiko The Brave Fox</div>
            <div className="text-[9px] sm:text-[10px] text-emerald-300 font-silkscreen">HP: 100 • Pedang Kayu Magis • 6 Dunia</div>
          </div>
        </div>

        {/* MAIN MENU BUTTONS AS REQUESTED: Start Adventure, How to Play, Settings */}
        <div className="flex flex-col gap-2 w-full max-w-xs sm:max-w-sm">
          {/* 1. START ADVENTURE */}
          <button
            id="start-game-btn"
            onClick={handleStart}
            className="pixel-btn-amber py-2.5 sm:py-3 px-6 text-xs sm:text-sm md:text-base font-pixel flex items-center justify-center gap-2 tracking-wider cursor-pointer group shadow-2xl active:scale-95 transition"
          >
            <Play className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
            START ADVENTURE
          </button>

          {/* 2. HOW TO PLAY & 3. SETTINGS in grid / row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              id="how-to-play-btn"
              onClick={() => {
                sound.playUiClick();
                setShowHowToPlay(true);
              }}
              className="pixel-btn py-2 sm:py-2.5 px-2 text-[10px] sm:text-xs font-pixel flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition bg-emerald-950/90 border-emerald-700 text-emerald-200 hover:bg-emerald-900"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              HOW TO PLAY
            </button>

            <button
              id="settings-btn"
              onClick={() => {
                sound.playUiClick();
                setShowSettings(true);
              }}
              className="pixel-btn py-2 sm:py-2.5 px-2 text-[10px] sm:text-xs font-pixel flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition bg-stone-900 border-amber-600/70 text-amber-300 hover:bg-stone-800"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              PENGATURAN
            </button>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full py-1 sm:py-2 text-center text-emerald-300/85 text-[9px] sm:text-[10px] font-pixel bg-black/60 border-t border-emerald-900/60 flex-shrink-0 mt-1">
        WASD/Panah: Jalan • <span className="text-amber-300 font-bold">Tahan SHIFT</span>: Lari • <span className="text-amber-200 font-bold">KLIK KIRI MOUSE / SPASI</span>: Serang • E: Potion • I: Tas
      </footer>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-xs animate-fade-in">
          <div className="pixel-box-dark max-w-md w-full p-5 sm:p-6 text-white relative max-h-[90vh] overflow-y-auto border-4 border-amber-600/80 bg-stone-950/95 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-emerald-800">
              <div className="flex items-center gap-2 text-amber-400 font-pixel text-sm sm:text-base">
                <Sliders className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                <span>PENGATURAN GAME</span>
              </div>
              <button
                id="close-settings-x-btn"
                onClick={() => {
                  sound.playUiClick();
                  setShowSettings(false);
                }}
                className="p-1 hover:bg-emerald-900 text-stone-400 hover:text-white rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-silkscreen text-emerald-100">
              {/* Master Volume */}
              <div className="bg-black/60 p-3.5 border-2 border-emerald-900/80 rounded-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-pixel text-amber-300 flex items-center gap-1.5 text-[11px]">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    VOLUME MASTER
                  </span>
                  <span className="font-pixel text-amber-400 text-xs">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setVolumeState(newVol);
                    sound.setVolume(newVol);
                  }}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-800 rounded"
                />
                <div className="flex justify-between text-[9px] text-stone-400 mt-1">
                  <span>0% (Sunyi)</span>
                  <span>50%</span>
                  <span>100% (Maksimal)</span>
                </div>
              </div>

              {/* Mute Audio Switch */}
              <div className="bg-black/60 p-3.5 border-2 border-emerald-900/80 rounded-sm flex items-center justify-between">
                <div>
                  <div className="font-pixel text-amber-300 text-[11px]">STATUS AUDIO / BGM</div>
                  <div className="text-[10px] text-emerald-300/80">Musik retro dan efek suara pertarungan</div>
                </div>
                <button
                  onClick={() => {
                    onToggleMute();
                    sound.playUiClick();
                  }}
                  className={`px-3 py-1.5 font-pixel text-[10px] rounded cursor-pointer transition ${
                    isMuted
                      ? 'bg-red-950 border-2 border-red-600 text-red-300'
                      : 'bg-emerald-950 border-2 border-emerald-500 text-emerald-300'
                  }`}
                >
                  {isMuted ? '🔇 BISU (MUTED)' : '🔊 SUARA AKTIF'}
                </button>
              </div>

              {/* Screen Shake Toggle */}
              <div className="bg-black/60 p-3.5 border-2 border-emerald-900/80 rounded-sm flex items-center justify-between">
                <div>
                  <div className="font-pixel text-amber-300 text-[11px]">EFEK GOYANG LAYAR</div>
                  <div className="text-[10px] text-emerald-300/80">Goncangan saat terkena pukulan atau serangan bos</div>
                </div>
                <button
                  onClick={() => {
                    sound.playUiClick();
                    const next = !screenShakeEnabled;
                    setScreenShakeEnabled(next);
                    try {
                      localStorage.setItem('foxwood_screenshake', next ? 'true' : 'false');
                    } catch {}
                  }}
                  className={`px-3 py-1.5 font-pixel text-[10px] rounded cursor-pointer transition ${
                    screenShakeEnabled
                      ? 'bg-emerald-950 border-2 border-emerald-500 text-emerald-300'
                      : 'bg-stone-800 border-2 border-stone-600 text-stone-400'
                  }`}
                >
                  {screenShakeEnabled ? 'AKTIF' : 'NONAKTIF'}
                </button>
              </div>

              {/* Ambient Particles Toggle */}
              <div className="bg-black/60 p-3.5 border-2 border-emerald-900/80 rounded-sm flex items-center justify-between">
                <div>
                  <div className="font-pixel text-amber-300 text-[11px]">PARTIKEL ALAM & KUNANG-KUNANG</div>
                  <div className="text-[10px] text-emerald-300/80">Animasi daun gugur dan kilau malam hari</div>
                </div>
                <button
                  onClick={() => {
                    sound.playUiClick();
                    const next = !particlesEnabled;
                    setParticlesEnabled(next);
                    try {
                      localStorage.setItem('foxwood_particles', next ? 'true' : 'false');
                    } catch {}
                  }}
                  className={`px-3 py-1.5 font-pixel text-[10px] rounded cursor-pointer transition ${
                    particlesEnabled
                      ? 'bg-emerald-950 border-2 border-emerald-500 text-emerald-300'
                      : 'bg-stone-800 border-2 border-stone-600 text-stone-400'
                  }`}
                >
                  {particlesEnabled ? 'AKTIF' : 'NONAKTIF'}
                </button>
              </div>

              {/* Version & Credits */}
              <div className="text-center text-[10px] text-stone-400 pt-1">
                Foxwood Tale v1.5 • Pixel Art Action Adventure
              </div>
            </div>

            {/* Save / Close Button */}
            <div className="mt-5 flex justify-end">
              <button
                id="save-settings-btn"
                onClick={() => {
                  sound.playUiClick();
                  setShowSettings(false);
                }}
                className="pixel-btn-amber px-6 py-2.5 font-pixel text-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                SIMPAN & TUTUP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HOW TO PLAY MODAL */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-xs animate-fade-in">
          <div className="pixel-box max-w-lg w-full p-5 sm:p-6 text-white relative max-h-[90vh] overflow-y-auto border-4 border-emerald-700 bg-stone-950/95 shadow-2xl">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b-2 border-emerald-800">
              <h2 className="text-sm sm:text-base font-pixel text-amber-400 flex items-center gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                PANDUAN BERMAIN FOXWOOD TALES
              </h2>
              <button
                id="close-how-to-play-x-btn"
                onClick={() => {
                  sound.playUiClick();
                  setShowHowToPlay(false);
                }}
                className="p-1 hover:bg-emerald-900 text-stone-400 hover:text-white rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs font-silkscreen text-emerald-100">
              {/* Controls */}
              <div className="bg-black/50 p-3 border-2 border-emerald-900 rounded">
                <div className="font-pixel text-amber-300 mb-1.5 text-[11px]">🎮 KONTROL PERMAINAN:</div>
                <ul className="space-y-1 text-[11px]">
                  <li>• <strong className="text-white">W, A, S, D</strong> atau <strong className="text-white">Tombol Panah</strong>: Bergerak bebas di peta</li>
                  <li>• <strong className="text-amber-300">Tahan SHIFT</strong> (atau tombol Lari): Sprint / Lari cepat</li>
                  <li>• <strong className="text-amber-200">Klik Kiri Mouse / SPASI</strong>: Menebas pedang menyerang monster (Desktop)</li>
                  <li>• <strong className="text-white">E</strong>: Meminum Ramuan Health Potion (+50 HP)</li>
                  <li>• <strong className="text-white">I / B</strong>: Buka & Tutup Tas Inventory</li>
                  <li>• Tersedia D-Pad & Tombol Sentuh Virtual untuk HP / Layar Sentuh!</li>
                </ul>
              </div>

              {/* Boss Feature in Level 5 */}
              <div className="bg-amber-950/40 p-3 border-2 border-amber-600/70 rounded">
                <div className="font-pixel text-amber-300 mb-1.5 text-[11px] flex items-center gap-1.5">
                  <span>👑</span>
                  <span>BOS LEVEL 5: KING SLIME & UI HEART BESAR:</span>
                </div>
                <p className="text-[11px] text-amber-100/90 leading-relaxed mb-1">
                  Di Level 5 (Arena King Slime), seekor Raja Lendir raksasa menjaga gerbang benteng kuno!
                </p>
                <ul className="space-y-1 text-[11px] text-amber-200/90">
                  <li>• <strong className="text-white">UI Heart Besar di Tengah Layar</strong>: Memantau kondisi nyawa bos dengan bar persentase dan indikator 10 detak jantung besar di tengah layar.</li>
                  <li>• Serangan King Slime menimbulkan gempa lendir berkekuatan tinggi (25 DMG).</li>
                  <li>• Kalahkan King Slime untuk merebut Kunci Kerajaan dan membuka portal rahasia!</li>
                </ul>
              </div>

              {/* 6 Levels Recap */}
              <div className="bg-black/50 p-3 border-2 border-emerald-900 rounded">
                <div className="font-pixel text-amber-300 mb-1.5 text-[11px]">🗺️ PETUALANGAN 6 DUNIA:</div>
                <ul className="space-y-1 text-[10px] text-emerald-200/90">
                  <li>• <strong className="text-emerald-300">Level 1 (Forest Journey)</strong>: Pelajari dasar permainan & kumpulkan koin.</li>
                  <li>• <strong className="text-purple-300">Level 2 (Monster Forest)</strong>: Hutan gelap berkabut & monster bayangan.</li>
                  <li>• <strong className="text-teal-300">Level 3 (Lembah Kabut Beracun)</strong>: Rawa beracun & monster spora jamur.</li>
                  <li>• <strong className="text-orange-400">Level 4 (Reruntuhan Magma)</strong>: Ngarai lahar membara.</li>
                  <li>• <strong className="text-yellow-300">Level 5 (Arena King Slime)</strong>: Pertarungan bos Raja Lendir raksasa!</li>
                  <li>• <strong className="text-rose-400">Level 6 (Puncak Inti Foxwood)</strong>: Final Showdown! Hadapi Lord of the Void.</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                id="understand-how-to-play-btn"
                onClick={() => {
                  sound.playUiClick();
                  setShowHowToPlay(false);
                }}
                className="pixel-btn-amber px-6 py-2.5 font-pixel text-xs cursor-pointer"
              >
                MENGERTI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
