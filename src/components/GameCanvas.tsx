import React, { useEffect, useRef } from 'react';
import { Player, Enemy, Collectible, Obstacle, Particle, LevelConfig, Direction, InventoryItem } from '../types';
import { SpriteRenderer } from '../game/sprites';
import { sound } from '../game/sound';

interface GameCanvasProps {
  levelConfig: LevelConfig;
  player: Player;
  inventory: InventoryItem[];
  isPaused: boolean;
  virtualDir: Direction | null;
  isMobileSprinting?: boolean;
  onUpdatePlayer: (updater: (prev: Player) => Player) => void;
  onUpdateInventory: (updater: (prev: InventoryItem[]) => InventoryItem[]) => void;
  onLevelComplete: () => void;
  onGameOver: () => void;
  onVictory: () => void;
  onIncrementMonstersDefeated: () => void;
  onIncrementCoins: (amount: number) => void;
  onIncrementCrystals: (amount: number) => void;
  onUpdateBoss?: (boss: { name: string; hp: number; maxHp: number; type: string; isDead: boolean } | null) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  levelConfig,
  player,
  inventory,
  isPaused,
  virtualDir,
  isMobileSprinting = false,
  onUpdatePlayer,
  onUpdateInventory,
  onLevelComplete,
  onGameOver,
  onVictory,
  onIncrementMonstersDefeated,
  onIncrementCoins,
  onIncrementCrystals,
  onUpdateBoss,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mutable Game Simulation References to ensure 60fps locked physics
  const playerRef = useRef<Player>(player);
  playerRef.current = player;

  const enemiesRef = useRef<Enemy[]>([]);
  const collectiblesRef = useRef<Collectible[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const cameraRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const screenShakeRef = useRef<number>(0);
  const isTransitioningRef = useRef<boolean>(false);

  // Initialize Level entities when levelConfig changes
  useEffect(() => {
    enemiesRef.current = JSON.parse(JSON.stringify(levelConfig.enemies));
    collectiblesRef.current = JSON.parse(JSON.stringify(levelConfig.collectibles));
    obstaclesRef.current = JSON.parse(JSON.stringify(levelConfig.obstacles));
    particlesRef.current = [];
    isTransitioningRef.current = false;

    // Ambient floating leaves & fireflies in world
    for (let i = 0; i < 40; i++) {
      particlesRef.current.push({
        id: `ambient-${i}`,
        x: Math.random() * levelConfig.mapWidth,
        y: Math.random() * levelConfig.mapHeight,
        vx: 0.4 + Math.random() * 0.6,
        vy: 0.2 + Math.random() * 0.4,
        color: levelConfig.levelNumber === 2 ? '#c084fc' : '#4ade80',
        size: 3,
        life: 100,
        maxLife: 100,
        type: 'leaf',
      });
    }

    // Play level BGM
    sound.startBGM(levelConfig.levelNumber);

    // Check if level has a boss (Level 5 King Slime)
    const boss = enemiesRef.current.find((e) => e.type === 'giant_slime_boss' && !e.isDead);
    if (boss) {
      onUpdateBoss?.({
        name: boss.name,
        hp: boss.hp,
        maxHp: boss.maxHp,
        type: boss.type,
        isDead: boss.isDead,
      });
      sound.playBossRoar();
    } else {
      onUpdateBoss?.(null);
    }
  }, [levelConfig]);

  // Keyboard and Mouse Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.code;
      keysRef.current[code] = true;

      // Space to Attack
      if (code === 'Space') {
        e.preventDefault();
        triggerAttack();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    // Left-Click (and Right-Click) Attack for Desktop
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 || e.button === 2) {
        // Prevent attacking when clicking interactive UI elements (buttons, inputs, modals)
        const target = e.target as HTMLElement | null;
        if (target && (target.closest('button') || target.closest('header') || target.closest('.pointer-events-auto') || target.closest('[role="dialog"]'))) {
          return;
        }
        triggerAttack();
      }
    };

    // Prevent context menu from popping up during gameplay
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Attack Trigger Helper
  const triggerAttack = () => {
    const p = playerRef.current;
    if (p.isAttacking || p.hp <= 0 || isPaused) return;

    sound.playSwordSlash();

    onUpdatePlayer((prev) => ({
      ...prev,
      isAttacking: true,
      attackTimer: 0,
      attackDuration: 0.22,
      animState: 'attack',
    }));

    // Spawn slash particles
    const slashDist = 32;
    let sx = p.x;
    let sy = p.y;
    if (p.facing === 'right') sx += slashDist;
    if (p.facing === 'left') sx -= slashDist;
    if (p.facing === 'down') sy += slashDist;
    if (p.facing === 'up') sy -= slashDist;

    for (let i = 0; i < 6; i++) {
      particlesRef.current.push({
        id: `slash-${Date.now()}-${i}`,
        x: sx + (Math.random() - 0.5) * 20,
        y: sy + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: '#ffea47',
        size: 2 + Math.random() * 2,
        life: 0.2,
        maxLife: 0.2,
        type: 'spark',
      });
    }

    // Check collision with all alive enemies
    enemiesRef.current.forEach((enemy) => {
      if (enemy.isDead) return;

      const dx = enemy.x - p.x;
      const dy = enemy.y - p.y;
      const dist = Math.hypot(dx, dy);

      // Hit sector cone check in facing direction (boss has larger hit boundary)
      const hitRadius = enemy.type === 'giant_slime_boss' ? 95 : 64;
      const hitSpan = enemy.type === 'giant_slime_boss' ? 60 : 40;
      let inSector = false;
      if (dist < hitRadius) {
        if (p.facing === 'right' && dx > -15 && Math.abs(dy) < hitSpan) inSector = true;
        if (p.facing === 'left' && dx < 15 && Math.abs(dy) < hitSpan) inSector = true;
        if (p.facing === 'down' && dy > -15 && Math.abs(dx) < hitSpan) inSector = true;
        if (p.facing === 'up' && dy < 15 && Math.abs(dx) < hitSpan) inSector = true;
      }

      if (inSector) {
        // Critical hit chance 30%
        const isCrit = Math.random() < 0.3;
        const damage = isCrit ? 24 : 12 + Math.floor(Math.random() * 4);

        enemy.hp -= damage;
        enemy.hurtTimer = 0.25;

        // Knockback (boss is heavier)
        const pushAngle = Math.atan2(enemy.y - p.y, enemy.x - p.x);
        const pushForce = enemy.type === 'giant_slime_boss' ? 2.5 : 6;
        enemy.vx = Math.cos(pushAngle) * pushForce;
        enemy.vy = Math.sin(pushAngle) * pushForce;

        sound.playHit();
        sound.playMonsterHurt();

        // Update Boss UI stats if hitting giant slime boss
        if (enemy.type === 'giant_slime_boss') {
          screenShakeRef.current = Math.max(screenShakeRef.current, 6);
          onUpdateBoss?.({
            name: enemy.name,
            hp: Math.max(0, enemy.hp),
            maxHp: enemy.maxHp,
            type: enemy.type,
            isDead: enemy.hp <= 0,
          });
        }

        // Spawn Damage Number Particle
        particlesRef.current.push({
          id: `dmg-${Date.now()}-${Math.random()}`,
          x: enemy.x - 8,
          y: enemy.y - (enemy.type === 'giant_slime_boss' ? 40 : 20),
          vx: (Math.random() - 0.5) * 1,
          vy: -1.8,
          color: isCrit ? '#f59e0b' : '#f87171',
          size: 0,
          life: 0.7,
          maxLife: 0.7,
          type: 'damage_text',
          text: isCrit ? `-${damage} CRIT!` : `-${damage}`,
        });

        // Check if enemy defeated
        if (enemy.hp <= 0 && !enemy.isDead) {
          enemy.isDead = true;
          enemy.deathTimer = 0;

          if (enemy.type === 'giant_slime_boss') {
            sound.playBossRoar();
            screenShakeRef.current = 18;
            onUpdateBoss?.({
              name: enemy.name,
              hp: 0,
              maxHp: enemy.maxHp,
              type: enemy.type,
              isDead: true,
            });

            // Mega confetti & celebratory fireworks for King Slime defeat
            for (let pIdx = 0; pIdx < 35; pIdx++) {
              particlesRef.current.push({
                id: `boss-death-${Date.now()}-${pIdx}`,
                x: enemy.x,
                y: enemy.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: ['#fbbf24', '#4ade80', '#22c55e', '#ef4444', '#f59e0b', '#ffffff'][pIdx % 6],
                size: 4 + Math.random() * 5,
                life: 1.2,
                maxLife: 1.2,
                type: 'confetti',
              });
            }
          } else {
            sound.playMonsterDefeated();
          }

          onIncrementMonstersDefeated();

          // Spawn Death Dust Particles
          for (let pIdx = 0; pIdx < 12; pIdx++) {
            particlesRef.current.push({
              id: `death-p-${Date.now()}-${pIdx}`,
              x: enemy.x,
              y: enemy.y,
              vx: (Math.random() - 0.5) * 3.5,
              vy: (Math.random() - 0.5) * 3.5,
              color: enemy.type === 'shadow_monster' ? '#a855f7' : enemy.type === 'slime' ? '#4ade80' : '#d97706',
              size: 3 + Math.random() * 3,
              life: 0.45,
              maxLife: 0.45,
              type: 'smoke',
            });
          }

          // Drop item on ground!
          collectiblesRef.current.push({
            id: `drop-${Date.now()}`,
            type: enemy.dropType,
            x: enemy.x,
            y: enemy.y,
            width: 18,
            height: 18,
            collected: false,
            bobOffset: Math.random() * Math.PI,
            value: enemy.dropType === 'potion' ? 50 : enemy.dropType === 'berry' ? 15 : enemy.dropType === 'crystal' ? 1 : 15,
          });
        }
      }
    });
  };

  // Main 60 FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    let animTimer = 0;

    const gameLoop = (currentTime: number) => {
      const dt = Math.min(0.1, (currentTime - lastTime) / 1000);
      lastTime = currentTime;
      animTimer += dt;

      // Handle Canvas Sizing
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      const p = playerRef.current;

      // ==========================================
      // UPDATE SIMULATION (IF NOT PAUSED)
      // ==========================================
      if (!isPaused && p.hp > 0 && !isTransitioningRef.current) {
        // 1. Player Attack Timer
        if (p.isAttacking) {
          p.attackTimer += dt;
          if (p.attackTimer >= p.attackDuration) {
            p.isAttacking = false;
            p.attackTimer = 0;
            p.animState = 'idle';
          }
        }

        // 2. Player Hurt Timer
        if (p.hurtTimer > 0) {
          p.hurtTimer -= dt;
        }

        // 3. Player Movement Inputs (WASD, Arrows, or Virtual Joystick)
        let moveX = 0;
        let moveY = 0;

        const keys = keysRef.current;
        if (keys['KeyW'] || keys['ArrowUp'] || virtualDir === 'up') moveY -= 1;
        if (keys['KeyS'] || keys['ArrowDown'] || virtualDir === 'down') moveY += 1;
        if (keys['KeyA'] || keys['ArrowLeft'] || virtualDir === 'left') moveX -= 1;
        if (keys['KeyD'] || keys['ArrowRight'] || virtualDir === 'right') moveX += 1;

        // Move Player with solid obstacle collision checks (with sprint support)
        const isSprinting = Boolean(keys['ShiftLeft'] || keys['ShiftRight'] || isMobileSprinting);
        const currentSpeed = isSprinting ? p.speed * 1.6 : p.speed;

        // Determine facing & animation state
        if (!p.isAttacking) {
          if (moveX !== 0 || moveY !== 0) {
            p.animState = isSprinting ? 'run' : 'walk';
            if (moveX > 0) p.facing = 'right';
            else if (moveX < 0) p.facing = 'left';
            else if (moveY > 0) p.facing = 'down';
            else if (moveY < 0) p.facing = 'up';

            // Spawn running dust puff particles behind Kiko
            if (isSprinting && Math.random() < 0.28) {
              particlesRef.current.push({
                id: `dust-${Date.now()}-${Math.random()}`,
                x: p.x + (Math.random() - 0.5) * 10,
                y: p.y + 12,
                vx: -moveX * 0.7 + (Math.random() - 0.5) * 0.3,
                vy: -moveY * 0.7 - Math.random() * 0.3,
                color: levelConfig.levelNumber === 4 ? '#fb923c' : '#86efac',
                size: 2.5,
                life: 0.22,
                maxLife: 0.22,
                type: 'smoke',
              });
            }
          } else {
            p.animState = 'idle';
          }
        }

        // Normalize diagonal speed
        if (moveX !== 0 && moveY !== 0) {
          moveX *= 0.7071;
          moveY *= 0.7071;
        }

        const nextX = p.x + moveX * currentSpeed;
        const nextY = p.y + moveY * currentSpeed;

        // Check horizontal collision
        let canMoveX = true;
        let canMoveY = true;
        const pRadius = 14;

        obstaclesRef.current.forEach((obs) => {
          if (!obs.isSolid) return;

          // Box collision against player circle
          if (
            nextX + pRadius > obs.x &&
            nextX - pRadius < obs.x + obs.width &&
            p.y + pRadius > obs.y &&
            p.y - pRadius < obs.y + obs.height
          ) {
            canMoveX = false;
          }

          if (
            p.x + pRadius > obs.x &&
            p.x - pRadius < obs.x + obs.width &&
            nextY + pRadius > obs.y &&
            nextY - pRadius < obs.y + obs.height
          ) {
            canMoveY = false;
          }
        });

        // Clamp to map boundaries
        if (canMoveX) {
          p.x = Math.max(30, Math.min(levelConfig.mapWidth - 30, nextX));
        }
        if (canMoveY) {
          p.y = Math.max(50, Math.min(levelConfig.mapHeight - 80, nextY));
        }

        // 4. Enemy AI & Movement
        enemiesRef.current.forEach((enemy) => {
          if (enemy.isDead) {
            enemy.deathTimer += dt;
            return;
          }

          if (enemy.hurtTimer > 0) {
            enemy.hurtTimer -= dt;
            // Apply knockback
            enemy.x += enemy.vx;
            enemy.y += enemy.vy;
            enemy.vx *= 0.85;
            enemy.vy *= 0.85;
            return;
          }

          if (enemy.attackCooldown > 0) {
            enemy.attackCooldown -= dt;
          }

          const dx = p.x - enemy.x;
          const dy = p.y - enemy.y;
          const dist = Math.hypot(dx, dy);

          // Aggro pursuit
          if (dist < enemy.aggroRadius && p.hp > 0) {
            const angle = Math.atan2(dy, dx);
            enemy.vx = Math.cos(angle) * enemy.speed;
            enemy.vy = Math.sin(angle) * enemy.speed;
            enemy.facing = enemy.vx > 0 ? 'right' : 'left';

            enemy.x += enemy.vx;
            enemy.y += enemy.vy;

            // Melee Attack Player if in contact range
            const isBoss = enemy.type === 'giant_slime_boss';
            const contactDist = isBoss ? 52 : 26;
            if (dist < contactDist && enemy.attackCooldown <= 0 && p.hurtTimer <= 0) {
              enemy.attackCooldown = isBoss ? 1.3 : 1.0;
              p.hp = Math.max(0, p.hp - enemy.damage);
              p.hurtTimer = 0.55;
              screenShakeRef.current = isBoss ? 14 : 8;
              if (isBoss) {
                sound.playBossSlam();
              }
              sound.playPlayerHurt();

              // Spawn Damage text at player
              particlesRef.current.push({
                id: `player-dmg-${Date.now()}`,
                x: p.x - 8,
                y: p.y - 20,
                vx: 0,
                vy: -1.5,
                color: '#ef4444',
                size: 0,
                life: 0.8,
                maxLife: 0.8,
                type: 'damage_text',
                text: `-${enemy.damage}`,
              });

              // Check Player Defeat
              if (p.hp <= 0) {
                p.animState = 'dead';
                sound.playGameOver();
                setTimeout(() => {
                  onGameOver();
                }, 1200);
              }
            }
          }
        });

        // 5. Collectible Pickup Detection
        collectiblesRef.current.forEach((item) => {
          if (item.collected) return;

          const dx = item.x - p.x;
          const dy = item.y - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 32) {
            item.collected = true;

            let pickupText = '';
            let textColor = '#ffd700';

            if (item.type === 'coin') {
              p.coins += item.value;
              onIncrementCoins(item.value);
              sound.playCoin();
              pickupText = `+${item.value} Koin`;
              textColor = '#facc15';
            } else if (item.type === 'crystal') {
              p.crystals += item.value;
              onIncrementCrystals(item.value);
              sound.playCrystal();
              pickupText = `+${item.value} Kristal`;
              textColor = '#38bdf8';
            } else if (item.type === 'potion') {
              sound.playPotion();
              pickupText = '+1 Potion';
              textColor = '#f43f5e';
              onUpdateInventory((prev) => {
                const existing = prev.find((i) => i.type === 'potion');
                if (existing) {
                  return prev.map((i) =>
                    i.type === 'potion' ? { ...i, count: i.count + 1 } : i
                  );
                }
                return [
                  ...prev,
                  {
                    id: 'potion-heal',
                    name: 'Ramuan Penyembuh',
                    type: 'potion',
                    count: 1,
                    icon: '🧪',
                    description: 'Ramuan herba hutan beraroma manis. Memulihkan 50 HP seketika.',
                    healAmount: 50,
                  },
                ];
              });
            } else if (item.type === 'berry') {
              sound.playPotion();
              pickupText = '+1 Buah Hutan';
              textColor = '#fb7185';
              onUpdateInventory((prev) => {
                const existing = prev.find((i) => i.type === 'berry');
                if (existing) {
                  return prev.map((i) =>
                    i.type === 'berry' ? { ...i, count: i.count + 1 } : i
                  );
                }
                return [
                  ...prev,
                  {
                    id: 'wild-berries',
                    name: 'Buah Rimba Segar',
                    type: 'berry',
                    count: 1,
                    icon: '🍓',
                    description: 'Buah berry manis dari belukar hutan. Memulihkan 15 HP.',
                    healAmount: 15,
                  },
                ];
              });
            }

            // Pickup floating text
            particlesRef.current.push({
              id: `loot-${Date.now()}`,
              x: item.x - 12,
              y: item.y - 10,
              vx: 0,
              vy: -1.2,
              color: textColor,
              size: 0,
              life: 0.9,
              maxLife: 0.9,
              type: 'damage_text',
              text: pickupText,
            });
          }
        });

        // 6. Portal Check
        const portalDx = levelConfig.portalX + 36 - p.x;
        const portalDy = levelConfig.portalY + 45 - p.y;
        const portalDist = Math.hypot(portalDx, portalDy);

        if (portalDist < 48 && !isTransitioningRef.current) {
          isTransitioningRef.current = true;
          if (levelConfig.levelNumber < 6) {
            sound.playLevelComplete();
            onLevelComplete();
          } else {
            sound.playVictory();
            onVictory();
          }
        }
      }

      // Update Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx;
        pt.y += pt.vy;

        if (pt.type === 'leaf') {
          pt.x += Math.sin(animTimer + pt.y) * 0.4;
          if (pt.x > levelConfig.mapWidth) pt.x = 0;
          if (pt.y > levelConfig.mapHeight) pt.y = 0;
        } else {
          pt.life -= dt;
          if (pt.life <= 0) {
            particlesRef.current.splice(i, 1);
          }
        }
      }

      // Screen Shake Dampening
      if (screenShakeRef.current > 0) {
        screenShakeRef.current = Math.max(0, screenShakeRef.current - dt * 25);
      }

      // ==========================================
      // CAMERA TRACKING
      // ==========================================
      const targetCamX = p.x - canvas.width / 2;
      const targetCamY = p.y - canvas.height / 2;

      // Smooth Camera LERP
      cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.12;
      cameraRef.current.y += (targetCamY - cameraRef.current.y) * 0.12;

      // Clamp camera to map bounds
      cameraRef.current.x = Math.max(0, Math.min(levelConfig.mapWidth - canvas.width, cameraRef.current.x));
      cameraRef.current.y = Math.max(0, Math.min(levelConfig.mapHeight - canvas.height, cameraRef.current.y));

      // ==========================================
      // CANVAS RENDERING
      // ==========================================
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply screen shake
      const shakeX = screenShakeRef.current > 0 ? (Math.random() - 0.5) * screenShakeRef.current : 0;
      const shakeY = screenShakeRef.current > 0 ? (Math.random() - 0.5) * screenShakeRef.current : 0;

      ctx.translate(-Math.floor(cameraRef.current.x + shakeX), -Math.floor(cameraRef.current.y + shakeY));

      // 1. Terrain Base & Theme
      let bgCol = '#183820';
      let pathCol = '#2b4d2e';
      let pebbleCol = '#3a663d';

      if (levelConfig.levelNumber === 2) {
        bgCol = '#0e1814';
        pathCol = '#1a2920';
        pebbleCol = '#273d30';
      } else if (levelConfig.levelNumber === 3) {
        bgCol = '#102219'; // Swamp Moss
        pathCol = '#1b3829';
        pebbleCol = '#235944';
      } else if (levelConfig.levelNumber === 4) {
        bgCol = '#1a0d0b'; // Obsidian Volcanic Rock
        pathCol = '#2d1814';
        pebbleCol = '#47211b';
      } else if (levelConfig.levelNumber === 5) {
        bgCol = '#0f111a'; // Shadow Citadel Floor
        pathCol = '#1d2133';
        pebbleCol = '#2e354f';
      } else if (levelConfig.levelNumber === 6) {
        bgCol = '#0a0817'; // Void Sanctuary Obsidian
        pathCol = '#191538';
        pebbleCol = '#2b2357';
      }

      ctx.fillStyle = bgCol;
      ctx.fillRect(0, 0, levelConfig.mapWidth, levelConfig.mapHeight);

      // 2. Dirt Trails & Pathways (Aligned with bridge deck at Y ~ 555)
      ctx.fillStyle = pathCol;
      ctx.beginPath();
      ctx.ellipse(levelConfig.mapWidth / 2, 555, levelConfig.mapWidth / 2 - 60, 75, 0, 0, Math.PI * 2);
      ctx.fill();

      // Earth path pebbles & detail dots
      for (let px = 80; px < levelConfig.mapWidth; px += 45) {
        ctx.fillStyle = pebbleCol;
        ctx.fillRect(px, 535 + Math.sin(px * 0.02) * 20, 4, 3);
        ctx.fillRect(px + 12, 565 + Math.cos(px * 0.03) * 15, 3, 2);
      }

      // 3. Draw Obstacles (Sorted by Y for correct isometric depth layering)
      // Note: Bridges are walkable platforms rendered at y: -50 (above river -100, but below player and monsters)
      const renderables: ({ y: number; render: () => void })[] = [];

      // Add Obstacles
      obstaclesRef.current.forEach((obs) => {
        renderables.push({
          y: obs.type === 'river' ? -100 : obs.type === 'bridge' ? -50 : obs.y + obs.height,
          render: () => SpriteRenderer.drawObstacle(ctx, obs, animTimer),
        });
      });

      // Add Collectibles
      collectiblesRef.current.forEach((col) => {
        if (!col.collected) {
          renderables.push({
            y: col.y + col.height,
            render: () => SpriteRenderer.drawCollectible(ctx, col, animTimer),
          });
        }
      });

      // Add Enemies
      enemiesRef.current.forEach((en) => {
        renderables.push({
          y: en.y + en.height / 2,
          render: () => SpriteRenderer.drawEnemy(ctx, en, animTimer),
        });
      });

      // Add Player
      renderables.push({
        y: p.y + p.height / 2,
        render: () => SpriteRenderer.drawPlayer(ctx, p, animTimer),
      });

      // Sort & Render everything in back-to-front depth order!
      renderables.sort((a, b) => a.y - b.y);
      renderables.forEach((r) => r.render());

      // 4. Particles (Drawn on top)
      particlesRef.current.forEach((pt) => {
        SpriteRenderer.drawParticle(ctx, pt);
      });

      // 5. Ambient Vignette & Mist (Especially Level 2 Monster Forest)
      if (levelConfig.hasFog) {
        // Mysterious drifting fog layers
        ctx.fillStyle = 'rgba(74, 28, 110, 0.18)';
        ctx.fillRect(0, 0, levelConfig.mapWidth, levelConfig.mapHeight);

        // Soft fog clouds
        for (let fi = 0; fi < 6; fi++) {
          const fogX = (animTimer * 20 + fi * 400) % (levelConfig.mapWidth + 400) - 200;
          const fogY = 200 + fi * 150;
          const fogGrad = ctx.createRadialGradient(fogX, fogY, 20, fogX, fogY, 240);
          fogGrad.addColorStop(0, 'rgba(126, 34, 206, 0.12)');
          fogGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = fogGrad;
          ctx.beginPath();
          ctx.arc(fogX, fogY, 240, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      // Mini-map Radar in Top-Right
      drawMiniMap(ctx, canvas, p, levelConfig, enemiesRef.current, collectiblesRef.current);

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [levelConfig, isPaused, virtualDir]);

  // Minimap Radar Drawing Helper
  const drawMiniMap = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    p: Player,
    cfg: LevelConfig,
    enemies: Enemy[],
    collectibles: Collectible[]
  ) => {
    const mw = 120;
    const mh = 75;
    const mx = canvas.width - mw - 14;
    const my = 68;

    // Minimap Background
    ctx.fillStyle = 'rgba(10, 18, 12, 0.85)';
    ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = '#2e5734';
    ctx.lineWidth = 2;
    ctx.strokeRect(mx, my, mw, mh);

    const scaleX = mw / cfg.mapWidth;
    const scaleY = mh / cfg.mapHeight;

    // Portal Marker
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(mx + cfg.portalX * scaleX - 2, my + cfg.portalY * scaleY - 2, 5, 5);

    // Collectibles (Gold dots)
    ctx.fillStyle = '#facc15';
    collectibles.forEach((c) => {
      if (!c.collected) {
        ctx.fillRect(mx + c.x * scaleX, my + c.y * scaleY, 2, 2);
      }
    });

    // Enemies (Red dots)
    ctx.fillStyle = '#ef4444';
    enemies.forEach((e) => {
      if (!e.isDead) {
        ctx.fillRect(mx + e.x * scaleX - 1, my + e.y * scaleY - 1, 3, 3);
      }
    });

    // Player Marker (Bright Orange Fox with pulse ring)
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(mx + p.x * scaleX - 2, my + p.y * scaleY - 2, 5, 5);
  };

  return (
    <div className="relative w-full h-full min-h-[100dvh] overflow-hidden select-none bg-black">
      <canvas
        ref={canvasRef}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        onPointerDown={(e) => {
          if (e.button === 0 || e.button === 2) {
            triggerAttack();
          }
        }}
        className="w-full h-full block pixelated cursor-crosshair"
      />
    </div>
  );
};
