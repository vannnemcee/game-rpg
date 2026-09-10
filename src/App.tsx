import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameScreen, Player, InventoryItem, GameStats, Direction, LevelConfig } from './types';
import {
  createLevel1,
  createLevel2,
  createLevel3,
  createLevel4,
  createLevel5,
  createLevel6,
} from './game/levels';
import { sound } from './game/sound';
import { SplashScreen } from './components/SplashScreen';
import { PixelHUD, BossInfo } from './components/PixelHUD';
import { GameCanvas } from './components/GameCanvas';
import { InventoryModal } from './components/InventoryModal';
import { LevelCompleteModal, GameOverModal, VictoryModal } from './components/EndScreens';

export default function App() {
  const [gameScreen, setGameScreen] = useState<GameScreen>('SPLASH');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [levelConfig, setLevelConfig] = useState<LevelConfig>(() => createLevel1());

  // Player State
  const [player, setPlayer] = useState<Player>(() => ({
    x: 120,
    y: 550,
    vx: 0,
    vy: 0,
    width: 32,
    height: 32,
    speed: 3.2,
    hp: 100,
    maxHp: 100,
    facing: 'right',
    animState: 'idle',
    animTimer: 0,
    attackTimer: 0,
    attackDuration: 0.22,
    isAttacking: false,
    hurtTimer: 0,
    coins: 0,
    crystals: 0,
  }));

  // Inventory State (Minimalist RPG Inventory)
  const [inventory, setInventory] = useState<InventoryItem[]>(() => [
    {
      id: 'initial-potion',
      name: 'Ramuan Penyembuh',
      type: 'potion',
      count: 1,
      icon: '🧪',
      description: 'Ramuan herbal hutan dengan ramuan ajaib. Memulihkan 50 HP ketika diminum.',
      healAmount: 50,
    },
    {
      id: 'adventurer-badge',
      name: 'Lencana Hutan Foxwood',
      type: 'key',
      count: 1,
      icon: '🎖️',
      description: 'Bukti petualang pemberani pelindung rimba Foxwood.',
    },
  ]);

  // Game Statistics
  const [stats, setStats] = useState<GameStats>(() => ({
    monstersDefeated: 0,
    coinsCollected: 0,
    crystalsFound: 0,
    potionsUsed: 0,
    timeElapsedSeconds: 0,
  }));

  // UI States
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [virtualDir, setVirtualDir] = useState<Direction | null>(null);
  const [isMobileSprinting, setIsMobileSprinting] = useState<boolean>(false);
  const [activeBoss, setActiveBoss] = useState<BossInfo | null>(null);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      sound.setMuted(next);
      return next;
    });
  }, []);

  // Quick Potion Handler
  const handleQuickUsePotion = useCallback(() => {
    if (player.hp >= player.maxHp) return;

    setInventory((prev) => {
      const potion = prev.find((i) => i.type === 'potion' && i.count > 0);
      if (!potion) return prev;

      sound.playPotion();
      setPlayer((p) => ({
        ...p,
        hp: Math.min(p.maxHp, p.hp + 50),
      }));

      setStats((s) => ({ ...s, potionsUsed: s.potionsUsed + 1 }));

      if (potion.count <= 1) {
        return prev.filter((i) => i.id !== potion.id);
      }
      return prev.map((i) =>
        i.id === potion.id ? { ...i, count: i.count - 1 } : i
      );
    });
  }, [player.hp, player.maxHp]);

  // Inventory Use Item Handler
  const handleUseItem = useCallback((item: InventoryItem) => {
    if (!item.healAmount || player.hp >= player.maxHp) return;

    sound.playPotion();
    setPlayer((p) => ({
      ...p,
      hp: Math.min(p.maxHp, p.hp + (item.healAmount || 0)),
    }));

    setStats((s) => ({ ...s, potionsUsed: s.potionsUsed + 1 }));

    setInventory((prev) => {
      if (item.count <= 1) {
        return prev.filter((i) => i.id !== item.id);
      }
      return prev.map((i) =>
        i.id === item.id ? { ...i, count: i.count - 1 } : i
      );
    });
  }, [player.hp, player.maxHp]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyI' || e.code === 'KeyB') {
        sound.playUiClick();
        setIsInventoryOpen((prev) => !prev);
      } else if (e.code === 'KeyE') {
        handleQuickUsePotion();
      } else if (e.code === 'KeyM') {
        handleToggleMute();
      } else if (e.code === 'Escape') {
        if (isInventoryOpen) {
          setIsInventoryOpen(false);
        } else if (gameScreen === 'PLAYING') {
          setIsPaused((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isInventoryOpen, gameScreen, handleQuickUsePotion, handleToggleMute]);

  // Start Game from Splash
  const handleStartGame = () => {
    setCurrentLevel(1);
    const l1 = createLevel1();
    setLevelConfig(l1);

    setPlayer((prev) => ({
      ...prev,
      x: l1.playerStartX,
      y: l1.playerStartY,
      hp: 100,
      maxHp: 100,
      facing: 'right',
      animState: 'idle',
      isAttacking: false,
      hurtTimer: 0,
      coins: 0,
      crystals: 0,
    }));

    setStats({
      monstersDefeated: 0,
      coinsCollected: 0,
      crystalsFound: 0,
      potionsUsed: 0,
      timeElapsedSeconds: 0,
    });

    setActiveBoss(null);
    setGameScreen('PLAYING');
    setIsPaused(false);
    setIsInventoryOpen(false);
  };

  const getLevelConfig = useCallback((lvl: number): LevelConfig => {
    switch (lvl) {
      case 1: return createLevel1();
      case 2: return createLevel2();
      case 3: return createLevel3();
      case 4: return createLevel4();
      case 5: return createLevel5();
      case 6: return createLevel6();
      default: return createLevel1();
    }
  }, []);

  // Level Complete
  const handleLevelComplete = () => {
    setActiveBoss(null);
    setGameScreen('LEVEL_COMPLETE');
  };

  // Continue to Next Level (Up to Level 6)
  const handleContinueNextLevel = () => {
    const nextLvl = currentLevel + 1;
    if (nextLvl > 6) {
      handleVictory();
      return;
    }

    setCurrentLevel(nextLvl);
    const nextCfg = getLevelConfig(nextLvl);
    setLevelConfig(nextCfg);
    setActiveBoss(null);

    // Reposition player at start of next level with health restore boost
    setPlayer((prev) => ({
      ...prev,
      x: nextCfg.playerStartX,
      y: nextCfg.playerStartY,
      hp: Math.max(prev.hp, 80),
      facing: 'right',
      animState: 'idle',
      isAttacking: false,
      hurtTimer: 0,
    }));

    setGameScreen('PLAYING');
    setIsPaused(false);
  };

  // Game Over
  const handleGameOver = () => {
    setActiveBoss(null);
    setGameScreen('GAME_OVER');
  };

  // Try Again (Restart current level)
  const handleTryAgain = () => {
    const cfg = getLevelConfig(currentLevel);
    setLevelConfig(cfg);
    setActiveBoss(null);

    setPlayer((prev) => ({
      ...prev,
      x: cfg.playerStartX,
      y: cfg.playerStartY,
      hp: prev.maxHp,
      facing: 'right',
      animState: 'idle',
      isAttacking: false,
      hurtTimer: 0,
    }));

    setGameScreen('PLAYING');
    setIsPaused(false);
  };

  // Victory (Reached end of Level 6)
  const handleVictory = () => {
    setActiveBoss(null);
    setGameScreen('VICTORY');
  };

  // Main Menu
  const handleMainMenu = () => {
    setActiveBoss(null);
    setGameScreen('SPLASH');
    setIsPaused(false);
    setIsInventoryOpen(false);
  };

  return (
    <div className={`relative w-full min-h-[100dvh] h-[100dvh] select-none bg-black ${gameScreen === 'SPLASH' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
      {/* 1. Splash Screen / Main Menu */}
      {gameScreen === 'SPLASH' && (
        <SplashScreen
          onStartGame={handleStartGame}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 2. Active Game World & Canvas */}
      {gameScreen !== 'SPLASH' && (
        <>
          <GameCanvas
            levelConfig={levelConfig}
            player={player}
            inventory={inventory}
            isPaused={isPaused}
            virtualDir={virtualDir}
            isMobileSprinting={isMobileSprinting}
            onUpdatePlayer={setPlayer}
            onUpdateInventory={setInventory}
            onUpdateBoss={setActiveBoss}
            onLevelComplete={handleLevelComplete}
            onGameOver={handleGameOver}
            onVictory={handleVictory}
            onIncrementMonstersDefeated={() =>
              setStats((s) => ({ ...s, monstersDefeated: s.monstersDefeated + 1 }))
            }
            onIncrementCoins={(amount) =>
              setStats((s) => ({ ...s, coinsCollected: s.coinsCollected + amount }))
            }
            onIncrementCrystals={(amount) =>
              setStats((s) => ({ ...s, crystalsFound: s.crystalsFound + amount }))
            }
          />

          {/* Pixel Art RPG HUD */}
          <PixelHUD
            player={player}
            levelConfig={levelConfig}
            inventory={inventory}
            isMuted={isMuted}
            isPaused={isPaused}
            isSprinting={isMobileSprinting}
            activeBoss={activeBoss}
            onToggleMute={handleToggleMute}
            onTogglePause={() => setIsPaused((prev) => !prev)}
            onMainMenu={handleMainMenu}
            onOpenInventory={() => setIsInventoryOpen(true)}
            onQuickUsePotion={handleQuickUsePotion}
            onAttackButton={() => {
              // Trigger Space attack via synthetic event
              window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
            }}
            onToggleSprint={setIsMobileSprinting}
            onDirectionInput={setVirtualDir}
          />
        </>
      )}

      {/* 3. Minimalist RPG Inventory Modal */}
      {isInventoryOpen && (
        <InventoryModal
          inventory={inventory}
          playerHp={player.hp}
          maxHp={player.maxHp}
          onClose={() => setIsInventoryOpen(false)}
          onUseItem={handleUseItem}
        />
      )}

      {/* 4. Level Complete Transition Modal */}
      {gameScreen === 'LEVEL_COMPLETE' && (
        <LevelCompleteModal
          onContinue={handleContinueNextLevel}
          stats={stats}
          currentLevel={currentLevel}
        />
      )}

      {/* 5. Game Over Modal */}
      {gameScreen === 'GAME_OVER' && (
        <GameOverModal
          onTryAgain={handleTryAgain}
          onMainMenu={handleMainMenu}
          levelNumber={currentLevel}
        />
      )}

      {/* 6. Victory Screen */}
      {gameScreen === 'VICTORY' && (
        <VictoryModal
          onPlayAgain={handleStartGame}
          onMainMenu={handleMainMenu}
          stats={stats}
        />
      )}
    </div>
  );
}
