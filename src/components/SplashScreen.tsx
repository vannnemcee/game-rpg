import React, { useEffect, useRef, useState } from 'react';
import { Play, HelpCircle, Volume2, VolumeX, Shield, Sparkles } from 'lucide-react';
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
    <div className="relative w-full h-screen flex flex-col items-center justify-between overflow-hidden select-none bg-emerald-950">
      {/* Background Pixel Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="absolute inset-0 w-full h-full object-cover pixelated"
      />

      {/* Top Header Buttons */}
      <header className="relative z-10 w-full max-w-5xl px-6 pt-6 flex justify-between items-center">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 border-2 border-emerald-800 rounded-sm text-xs text-emerald-300 font-pixel">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          FOXWOOD TALE v1.2 • 6 LEVELS
        </div>

        <div className="flex items-center gap-3">
          <button
            id="sound-toggle-btn"
            onClick={() => {
              onToggleMute();
            }}
            className="p-2.5 bg-emerald-950/80 hover:bg-emerald-900 border-2 border-emerald-700 text-emerald-300 rounded-sm cursor-pointer transition shadow-md"
            title={isMuted ? 'Nyalakan Suara (M)' : 'Matikan Suara (M)'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          <button
            id="help-btn"
            onClick={() => {
              sound.playUiClick();
              setShowHowToPlay(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-900 border-2 border-emerald-700 text-emerald-200 text-xs font-pixel rounded-sm cursor-pointer transition shadow-md"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            KONTROL
          </button>
        </div>
      </header>

      {/* Center Hero Title & Start Button */}
      <main className="relative z-10 flex flex-col items-center text-center px-4 my-auto">
        {/* Title Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-3 bg-amber-950/80 border-2 border-amber-600/70 text-amber-300 text-xs font-pixel tracking-wider shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          PETUALANGAN RUBAH DI HUTAN MONSTER
        </div>

        {/* Main Pixel Title */}
        <h1 className="text-4xl md:text-6xl font-bold font-pixel tracking-tight text-white drop-shadow-[0_6px_0_#14351b] mb-3">
          FOXWOOD TALE
        </h1>

        <p className="max-w-md text-emerald-200 text-sm md:text-base font-silkscreen mb-8 px-4 py-1.5 bg-black/40 border border-emerald-900/60 rounded">
          Bimbing <span className="text-orange-400 font-bold">Kiko si Rubah Pemberani</span> melewati hutan berbahaya, basmi monster, dan temukan jalan keluar!
        </p>

        {/* Character Card Preview */}
        <div className="flex items-center gap-3 px-4 py-2 mb-8 bg-black/60 border-2 border-emerald-800 rounded-sm">
          <div className="w-10 h-10 flex items-center justify-center bg-orange-950 border-2 border-orange-600 rounded">
            <span className="text-2xl">🦊</span>
          </div>
          <div className="text-left">
            <div className="text-xs font-pixel text-orange-400">Kiko The Brave Fox</div>
            <div className="text-[11px] text-emerald-300 font-silkscreen">HP: 100 • Pedang Kayu Magis</div>
          </div>
        </div>

        {/* Start Game Button */}
        <button
          id="start-game-btn"
          onClick={handleStart}
          className="pixel-btn-amber px-10 py-5 text-lg md:text-xl font-pixel flex items-center gap-3 tracking-widest cursor-pointer group"
        >
          <Play className="w-6 h-6 fill-current group-hover:translate-x-1 transition-transform" />
          START ADVENTURE
        </button>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full py-4 text-center text-emerald-400/80 text-[11px] font-pixel bg-black/50 border-t border-emerald-900/50">
        Tekan <kbd className="px-1.5 py-0.5 bg-emerald-900 border border-emerald-600 rounded text-white">WASD</kbd> / <kbd className="px-1.5 py-0.5 bg-emerald-900 border border-emerald-600 rounded text-white">Panah</kbd> Bergerak • Tahan <kbd className="px-1.5 py-0.5 bg-amber-900 border border-amber-600 rounded text-amber-200">SHIFT</kbd> Lari Cepat • <kbd className="px-1.5 py-0.5 bg-emerald-900 border border-emerald-600 rounded text-white">SPASI</kbd> Serang • <kbd className="px-1.5 py-0.5 bg-emerald-900 border border-emerald-600 rounded text-white">E</kbd> Potion • <kbd className="px-1.5 py-0.5 bg-emerald-900 border border-emerald-600 rounded text-white">I</kbd> Tas
      </footer>

      {/* How To Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="pixel-box max-w-lg w-full p-6 text-white relative">
            <h2 className="text-lg font-pixel text-amber-400 mb-4 pb-2 border-b-2 border-emerald-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              PANDUAN BERMAIN v1.2
            </h2>

            <div className="space-y-4 text-xs font-silkscreen text-emerald-100">
              <div className="bg-black/40 p-3 border border-emerald-900 rounded">
                <div className="font-pixel text-amber-300 mb-2">🎮 KONTROL PERMAINAN:</div>
                <ul className="space-y-1.5">
                  <li>• <strong className="text-white">W, A, S, D</strong> atau <strong className="text-white">Tombol Panah</strong>: Menggerakkan Rubah</li>
                  <li>• <strong className="text-amber-300">SHIFT</strong>: Lari Cepat / Sprint (+50% kecepatan gerak)</li>
                  <li>• <strong className="text-white">SPASI / Klik Mouse</strong>: Menebas pedang menyerang monster</li>
                  <li>• <strong className="text-white">E</strong>: Meminum Ramuan Health Potion (+50 HP)</li>
                  <li>• <strong className="text-white">I / B</strong>: Buka & Tutup Tas Inventory</li>
                  <li>• Tersedia tombol sentuh Virtual di layar untuk perangkat HP / Layar Sentuh!</li>
                </ul>
              </div>

              <div className="bg-black/40 p-3 border border-emerald-900 rounded">
                <div className="font-pixel text-amber-300 mb-2">🗺️ PETUALANGAN 6 LEVEL:</div>
                <ul className="space-y-1.5">
                  <li>• <strong className="text-emerald-300">Level 1 (Forest Journey)</strong>: Pelajari dasar permainan, kumpulkan koin & kristal, lewati jembatan sungai, dan capai portal.</li>
                  <li>• <strong className="text-purple-300">Level 2 (Monster Forest)</strong>: Hutan gelap berkabut dengan monster bayangan yang lincah.</li>
                  <li>• <strong className="text-teal-300">Level 3 (Lembah Kabut Beracun)</strong>: Rawa beracun, jembatan rawa hijau, dan monster jamur berspora.</li>
                  <li>• <strong className="text-orange-400">Level 4 (Reruntuhan Obsidian & Magma)</strong>: Ngarai lahar membara dan monster api.</li>
                  <li>• <strong className="text-indigo-300">Level 5 (Benteng Bayangan Kuno)</strong>: Benteng pilar kuno dengan monster ksatria bayangan elit.</li>
                  <li>• <strong className="text-rose-400">Level 6 (Puncak Inti Foxwood)</strong>: Final Showdown! Hadapi Lord of the Void Core dan selamatkan rimba!</li>
                </ul>
              </div>

              <div className="bg-black/40 p-3 border border-emerald-900 rounded">
                <div className="font-pixel text-amber-300 mb-2">🎒 INVENTORY & JARAHAN:</div>
                <p>Kumpulkan Koin, Kristal, Buah Liar, dan Potion dari tanah atau kalahkan monster. Buka inventory kapan saja untuk melihat jarahan dan memakai item penyembuh.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  sound.playUiClick();
                  setShowHowToPlay(false);
                }}
                className="pixel-btn px-6 py-2.5 font-pixel text-xs cursor-pointer"
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
