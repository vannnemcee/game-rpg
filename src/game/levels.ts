/**
 * Level Configurations for Foxwood Tale
 * Level 1: Forest Journey (Peaceful forest with winding path, stream, bridge, slimes, collectibles)
 * Level 2: Monster Forest (Darker, ominous mist, ruins, immediate monster packs, thorns, torches)
 */

import { LevelConfig, Enemy, Collectible, Obstacle } from '../types';

export function createLevel1(): LevelConfig {
  const mapWidth = 2000;
  const mapHeight = 1200;

  // Obstacles
  const obstacles: Obstacle[] = [];

  // Boundary trees (top & bottom edges)
  for (let x = 0; x < mapWidth; x += 70) {
    obstacles.push({
      id: `border-top-${x}`,
      type: 'tree_large',
      x,
      y: 0,
      width: 64,
      height: 72,
      isSolid: true,
    });
    obstacles.push({
      id: `border-bot-${x}`,
      type: 'tree_large',
      x,
      y: mapHeight - 80,
      width: 64,
      height: 72,
      isSolid: true,
    });
  }

  // Left & Right boundary trees
  for (let y = 80; y < mapHeight - 80; y += 70) {
    obstacles.push({
      id: `border-left-${y}`,
      type: 'tree_large',
      x: 0,
      y,
      width: 64,
      height: 72,
      isSolid: true,
    });
    if (y < 460 || y > 640) {
      // Leave gap on right for portal area
      obstacles.push({
        id: `border-right-${y}`,
        type: 'tree_large',
        x: mapWidth - 70,
        y,
        width: 64,
        height: 72,
        isSolid: true,
      });
    }
  }

  // River crossing the map around x = 950 to 1010
  const riverX = 960;
  const riverW = 60;
  // River segments above and below the bridge
  // Bridge is at y = 520 to 620
  obstacles.push({
    id: 'river-top',
    type: 'river',
    x: riverX,
    y: 60,
    width: riverW,
    height: 460,
    isSolid: true,
  });
  // Wooden bridge to cross safely
  obstacles.push({
    id: 'bridge-center',
    type: 'bridge',
    x: riverX - 8,
    y: 520,
    width: riverW + 16,
    height: 100,
    isSolid: false, // Walkable!
  });
  obstacles.push({
    id: 'river-bot',
    type: 'river',
    x: riverX,
    y: 620,
    width: riverW,
    height: mapHeight - 700,
    isSolid: true,
  });

  // Trees, Rocks, Bushes clusters creating natural forest corridors
  const forestDecors: { type: Obstacle['type']; x: number; y: number; w: number; h: number; solid: boolean }[] = [
    // Starting clearing decors
    { type: 'tree_small', x: 180, y: 180, w: 48, h: 56, solid: true },
    { type: 'bush', x: 220, y: 380, w: 40, h: 32, solid: false },
    { type: 'rock', x: 280, y: 220, w: 40, h: 36, solid: true },
    { type: 'flower', x: 140, y: 440, w: 32, h: 28, solid: false },

    // Path to river grove
    { type: 'tree_large', x: 420, y: 150, w: 64, h: 72, solid: true },
    { type: 'tree_large', x: 480, y: 180, w: 64, h: 72, solid: true },
    { type: 'bush', x: 390, y: 340, w: 42, h: 32, solid: false },
    { type: 'rock', x: 520, y: 410, w: 44, h: 36, solid: true },
    { type: 'tree_small', x: 380, y: 700, w: 48, h: 56, solid: true },
    { type: 'tree_large', x: 450, y: 740, w: 64, h: 72, solid: true },
    { type: 'tree_small', x: 530, y: 780, w: 48, h: 56, solid: true },
    { type: 'rock', x: 460, y: 640, w: 38, h: 32, solid: true },

    // Near the bridge
    { type: 'torch', x: 910, y: 500, w: 24, h: 36, solid: true },
    { type: 'torch', x: 910, y: 630, w: 24, h: 36, solid: true },
    { type: 'bush', x: 860, y: 420, w: 44, h: 32, solid: false },
    { type: 'rock', x: 870, y: 680, w: 42, h: 36, solid: true },

    // East side of the river (exploration area)
    { type: 'torch', x: 1050, y: 500, w: 24, h: 36, solid: true },
    { type: 'torch', x: 1050, y: 630, w: 24, h: 36, solid: true },
    { type: 'tree_large', x: 1180, y: 260, w: 64, h: 72, solid: true },
    { type: 'tree_small', x: 1250, y: 220, w: 48, h: 56, solid: true },
    { type: 'rock', x: 1150, y: 420, w: 42, h: 36, solid: true },
    { type: 'bush', x: 1240, y: 450, w: 40, h: 32, solid: false },

    // Ancient Ruins cluster before portal
    { type: 'ruins_pillar', x: 1440, y: 380, w: 36, h: 52, solid: true },
    { type: 'ruins_pillar', x: 1440, y: 680, w: 36, h: 52, solid: true },
    { type: 'tree_large', x: 1540, y: 190, w: 64, h: 72, solid: true },
    { type: 'tree_small', x: 1620, y: 240, w: 48, h: 56, solid: true },
    { type: 'rock', x: 1560, y: 460, w: 44, h: 36, solid: true },
    { type: 'bush', x: 1490, y: 600, w: 42, h: 32, solid: false },
    { type: 'tree_large', x: 1680, y: 720, w: 64, h: 72, solid: true },
    { type: 'torch', x: 1740, y: 460, w: 24, h: 36, solid: true },
    { type: 'torch', x: 1740, y: 620, w: 24, h: 36, solid: true },
  ];

  forestDecors.forEach((d, idx) => {
    obstacles.push({
      id: `decor-${idx}`,
      type: d.type,
      x: d.x,
      y: d.y,
      width: d.w,
      height: d.h,
      isSolid: d.solid,
    });
  });

  // End Portal to Level 2
  obstacles.push({
    id: 'exit-portal-l1',
    type: 'portal',
    x: 1820,
    y: 500,
    width: 72,
    height: 90,
    isSolid: false,
  });

  // Collectibles
  const collectibles: Collectible[] = [
    // Near start
    { id: 'c-coin-1', type: 'coin', x: 260, y: 320, width: 16, height: 16, collected: false, bobOffset: 0.1, value: 10 },
    { id: 'c-berry-1', type: 'berry', x: 310, y: 420, width: 16, height: 16, collected: false, bobOffset: 0.5, value: 15 },
    { id: 'c-coin-2', type: 'coin', x: 440, y: 480, width: 16, height: 16, collected: false, bobOffset: 0.9, value: 10 },

    // Middle area
    { id: 'c-pot-1', type: 'potion', x: 620, y: 350, width: 18, height: 18, collected: false, bobOffset: 1.2, value: 50 },
    { id: 'c-crys-1', type: 'crystal', x: 740, y: 560, width: 18, height: 18, collected: false, bobOffset: 1.8, value: 1 },
    { id: 'c-coin-3', type: 'coin', x: 800, y: 480, width: 16, height: 16, collected: false, bobOffset: 2.1, value: 10 },

    // Beyond Bridge
    { id: 'c-berry-2', type: 'berry', x: 1120, y: 390, width: 16, height: 16, collected: false, bobOffset: 2.4, value: 15 },
    { id: 'c-coin-4', type: 'coin', x: 1220, y: 550, width: 16, height: 16, collected: false, bobOffset: 2.9, value: 10 },
    { id: 'c-crys-2', type: 'crystal', x: 1360, y: 340, width: 18, height: 18, collected: false, bobOffset: 3.3, value: 1 },
    { id: 'c-pot-2', type: 'potion', x: 1480, y: 520, width: 18, height: 18, collected: false, bobOffset: 3.8, value: 50 },
    { id: 'c-coin-5', type: 'coin', x: 1640, y: 540, width: 16, height: 16, collected: false, bobOffset: 4.2, value: 10 },
  ];

  // Enemies (A modest amount of gentle Slimes and a wandering Shroom)
  const enemies: Enemy[] = [
    // Slime 1 (introductory)
    {
      id: 'e-slime-1',
      type: 'slime',
      name: 'Forest Slime',
      x: 580,
      y: 530,
      vx: 0,
      vy: 0,
      width: 28,
      height: 24,
      hp: 18,
      maxHp: 18,
      speed: 1.1,
      damage: 8,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 180,
      patrolStartX: 580,
      patrolStartY: 530,
      isDead: false,
      deathTimer: 0,
      dropType: 'coin',
    },
    // Slime 2 (near bridge approach)
    {
      id: 'e-slime-2',
      type: 'slime',
      name: 'Forest Slime',
      x: 760,
      y: 420,
      vx: 0,
      vy: 0,
      width: 28,
      height: 24,
      hp: 18,
      maxHp: 18,
      speed: 1.1,
      damage: 8,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 190,
      patrolStartX: 760,
      patrolStartY: 420,
      isDead: false,
      deathTimer: 0,
      dropType: 'berry',
    },
    // Slime 3 (across river)
    {
      id: 'e-slime-3',
      type: 'slime',
      name: 'Forest Slime',
      x: 1200,
      y: 480,
      vx: 0,
      vy: 0,
      width: 28,
      height: 24,
      hp: 20,
      maxHp: 20,
      speed: 1.2,
      damage: 9,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 200,
      patrolStartX: 1200,
      patrolStartY: 480,
      isDead: false,
      deathTimer: 0,
      dropType: 'coin',
    },
    // Mushroom Monster (near ruins)
    {
      id: 'e-shroom-1',
      type: 'mushroom_monster',
      name: 'Spore Jamur',
      x: 1380,
      y: 560,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 24,
      maxHp: 24,
      speed: 1.3,
      damage: 11,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 220,
      patrolStartX: 1380,
      patrolStartY: 560,
      isDead: false,
      deathTimer: 0,
      dropType: 'potion',
    },
    // Slime 4 guarding gateway approach
    {
      id: 'e-slime-4',
      type: 'slime',
      name: 'Forest Slime',
      x: 1600,
      y: 570,
      vx: 0,
      vy: 0,
      width: 28,
      height: 24,
      hp: 22,
      maxHp: 22,
      speed: 1.2,
      damage: 10,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 210,
      patrolStartX: 1600,
      patrolStartY: 570,
      isDead: false,
      deathTimer: 0,
      dropType: 'crystal',
    },
  ];

  return {
    levelNumber: 1,
    title: 'LEVEL 1: FOREST JOURNEY',
    subtitle: 'Perjalanan Awal Menuju Jantung Hutan',
    description: 'Jelajahi jalan setapak hutan, kumpulkan buah dan kristal, lewati jembatan sungai, dan temukan portal kuno.',
    mapWidth,
    mapHeight,
    playerStartX: 120,
    playerStartY: 550,
    portalX: 1820,
    portalY: 500,
    ambientLight: 'rgba(255, 255, 255, 0.02)',
    hasFog: false,
    enemies,
    collectibles,
    obstacles,
  };
}

export function createLevel2(): LevelConfig {
  const mapWidth = 2200;
  const mapHeight = 1200;

  const obstacles: Obstacle[] = [];

  // Top & Bottom boundary
  for (let x = 0; x < mapWidth; x += 70) {
    obstacles.push({
      id: `l2-bt-${x}`,
      type: 'tree_large',
      x,
      y: 0,
      width: 64,
      height: 72,
      isSolid: true,
    });
    obstacles.push({
      id: `l2-bb-${x}`,
      type: 'tree_large',
      x,
      y: mapHeight - 80,
      width: 64,
      height: 72,
      isSolid: true,
    });
  }

  // Left & Right boundary
  for (let y = 80; y < mapHeight - 80; y += 70) {
    obstacles.push({
      id: `l2-bl-${y}`,
      type: 'tree_large',
      x: 0,
      y,
      width: 64,
      height: 72,
      isSolid: true,
    });
    if (y < 460 || y > 640) {
      obstacles.push({
        id: `l2-br-${y}`,
        type: 'tree_large',
        x: mapWidth - 70,
        y,
        width: 64,
        height: 72,
        isSolid: true,
      });
    }
  }

  // Dangerous Thorn briars, ancient ruins columns, torches, mysterious purple crystals
  const l2Decors: { type: Obstacle['type']; x: number; y: number; w: number; h: number; solid: boolean }[] = [
    // Area Awal (Dimana Monster Langsung Muncul!)
    { type: 'thorn_bush', x: 260, y: 360, w: 46, h: 36, solid: true },
    { type: 'torch', x: 180, y: 440, w: 24, h: 36, solid: true },
    { type: 'torch', x: 180, y: 660, w: 24, h: 36, solid: true },
    { type: 'rock', x: 320, y: 680, w: 48, h: 40, solid: true },
    { type: 'thorn_bush', x: 380, y: 420, w: 46, h: 36, solid: true },

    // Middle Combat Arena with Ancient Ruins
    { type: 'ruins_pillar', x: 620, y: 340, w: 38, h: 54, solid: true },
    { type: 'ruins_pillar', x: 620, y: 720, w: 38, h: 54, solid: true },
    { type: 'tree_large', x: 740, y: 220, w: 64, h: 72, solid: true },
    { type: 'thorn_bush', x: 800, y: 440, w: 46, h: 36, solid: true },
    { type: 'torch', x: 850, y: 380, w: 24, h: 36, solid: true },
    { type: 'torch', x: 850, y: 700, w: 24, h: 36, solid: true },
    { type: 'rock', x: 920, y: 580, w: 48, h: 40, solid: true },

    // Shadow Grove
    { type: 'tree_large', x: 1100, y: 260, w: 64, h: 72, solid: true },
    { type: 'tree_large', x: 1180, y: 700, w: 64, h: 72, solid: true },
    { type: 'ruins_pillar', x: 1260, y: 420, w: 38, h: 54, solid: true },
    { type: 'ruins_pillar', x: 1260, y: 640, w: 38, h: 54, solid: true },
    { type: 'thorn_bush', x: 1340, y: 520, w: 46, h: 36, solid: true },
    { type: 'torch', x: 1400, y: 360, w: 24, h: 36, solid: true },
    { type: 'torch', x: 1400, y: 720, w: 24, h: 36, solid: true },

    // Final Gatekeeper Sanctum
    { type: 'ruins_pillar', x: 1650, y: 340, w: 38, h: 54, solid: true },
    { type: 'ruins_pillar', x: 1650, y: 720, w: 38, h: 54, solid: true },
    { type: 'torch', x: 1780, y: 440, w: 24, h: 36, solid: true },
    { type: 'torch', x: 1780, y: 640, w: 24, h: 36, solid: true },
    { type: 'rock', x: 1820, y: 350, w: 48, h: 40, solid: true },
    { type: 'rock', x: 1820, y: 720, w: 48, h: 40, solid: true },
  ];

  l2Decors.forEach((d, idx) => {
    obstacles.push({
      id: `l2-decor-${idx}`,
      type: d.type,
      x: d.x,
      y: d.y,
      width: d.w,
      height: d.h,
      isSolid: d.solid,
    });
  });

  // Finish Sacred Portal
  obstacles.push({
    id: 'exit-portal-l2',
    type: 'portal',
    x: 2000,
    y: 500,
    width: 76,
    height: 96,
    isSolid: false,
  });

  // Level 2 Collectibles
  const collectibles: Collectible[] = [
    { id: 'l2-c-coin-1', type: 'coin', x: 280, y: 500, width: 16, height: 16, collected: false, bobOffset: 0.2, value: 15 },
    { id: 'l2-c-pot-1', type: 'potion', x: 420, y: 320, width: 18, height: 18, collected: false, bobOffset: 0.6, value: 50 },
    { id: 'l2-c-crys-1', type: 'crystal', x: 500, y: 650, width: 18, height: 18, collected: false, bobOffset: 1.1, value: 1 },

    { id: 'l2-c-coin-2', type: 'coin', x: 700, y: 480, width: 16, height: 16, collected: false, bobOffset: 1.5, value: 15 },
    { id: 'l2-c-berry-1', type: 'berry', x: 890, y: 340, width: 16, height: 16, collected: false, bobOffset: 1.9, value: 20 },
    { id: 'l2-c-pot-2', type: 'potion', x: 960, y: 680, width: 18, height: 18, collected: false, bobOffset: 2.3, value: 50 },

    { id: 'l2-c-crys-2', type: 'crystal', x: 1200, y: 450, width: 18, height: 18, collected: false, bobOffset: 2.7, value: 1 },
    { id: 'l2-c-coin-3', type: 'coin', x: 1300, y: 600, width: 16, height: 16, collected: false, bobOffset: 3.1, value: 20 },
    { id: 'l2-c-pot-3', type: 'potion', x: 1520, y: 400, width: 18, height: 18, collected: false, bobOffset: 3.5, value: 50 },
    { id: 'l2-c-crys-3', type: 'crystal', x: 1740, y: 540, width: 18, height: 18, collected: false, bobOffset: 4.0, value: 1 },
  ];

  // LEVEL 2 ENEMIES: "Ketika Level 2 dimulai, pemain LANGSUNG bertemu beberapa musuh! Beberapa slime dan monster langsung berada di area awal."
  const enemies: Enemy[] = [
    // --- IMMEDIATE SPAWN ENEMIES RIGHT AT START ---
    {
      id: 'l2-e-slime-start1',
      type: 'slime',
      name: 'Dark Slime',
      x: 240,
      y: 480,
      vx: 0,
      vy: 0,
      width: 28,
      height: 24,
      hp: 22,
      maxHp: 22,
      speed: 1.3,
      damage: 10,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 240,
      patrolStartX: 240,
      patrolStartY: 480,
      isDead: false,
      deathTimer: 0,
      dropType: 'coin',
    },
    {
      id: 'l2-e-beast-start2',
      type: 'forest_monster',
      name: 'Monster Hutan Liar',
      x: 320,
      y: 560,
      vx: 0,
      vy: 0,
      width: 36,
      height: 36,
      hp: 34,
      maxHp: 34,
      speed: 1.4,
      damage: 14,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 260,
      patrolStartX: 320,
      patrolStartY: 560,
      isDead: false,
      deathTimer: 0,
      dropType: 'potion',
    },

    // --- MID SECTOR: SHROOMS & SLIMES ---
    {
      id: 'l2-e-shroom-1',
      type: 'mushroom_monster',
      name: 'Spore Jamur Beracun',
      x: 680,
      y: 420,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 26,
      maxHp: 26,
      speed: 1.35,
      damage: 12,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 240,
      patrolStartX: 680,
      patrolStartY: 420,
      isDead: false,
      deathTimer: 0,
      dropType: 'berry',
    },
    {
      id: 'l2-e-slime-2',
      type: 'slime',
      name: 'Shadow Slime',
      x: 740,
      y: 620,
      vx: 0,
      vy: 0,
      width: 28,
      height: 24,
      hp: 24,
      maxHp: 24,
      speed: 1.3,
      damage: 11,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 220,
      patrolStartX: 740,
      patrolStartY: 620,
      isDead: false,
      deathTimer: 0,
      dropType: 'coin',
    },

    // --- SHADOW MONSTER (FAST & DANGEROUS) ---
    {
      id: 'l2-e-shadow-1',
      type: 'shadow_monster',
      name: 'Monster Bayangan',
      x: 1060,
      y: 520,
      vx: 0,
      vy: 0,
      width: 34,
      height: 34,
      hp: 30,
      maxHp: 30,
      speed: 1.7,
      damage: 16,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 280,
      patrolStartX: 1060,
      patrolStartY: 520,
      isDead: false,
      deathTimer: 0,
      dropType: 'crystal',
    },
    {
      id: 'l2-e-beast-2',
      type: 'forest_monster',
      name: 'Monster Hutan Liar',
      x: 1350,
      y: 440,
      vx: 0,
      vy: 0,
      width: 36,
      height: 36,
      hp: 36,
      maxHp: 36,
      speed: 1.45,
      damage: 15,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 260,
      patrolStartX: 1350,
      patrolStartY: 440,
      isDead: false,
      deathTimer: 0,
      dropType: 'potion',
    },

    // --- GATEKEEPER ELITE SHADOW & BEAST DUO ---
    {
      id: 'l2-e-shadow-gate',
      type: 'shadow_monster',
      name: 'Penjaga Bayangan Kuno',
      x: 1720,
      y: 480,
      vx: 0,
      vy: 0,
      width: 36,
      height: 36,
      hp: 38,
      maxHp: 38,
      speed: 1.8,
      damage: 18,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 300,
      patrolStartX: 1720,
      patrolStartY: 480,
      isDead: false,
      deathTimer: 0,
      dropType: 'crystal',
    },
    {
      id: 'l2-e-slime-gate',
      type: 'slime',
      name: 'Dark Slime',
      x: 1760,
      y: 600,
      vx: 0,
      vy: 0,
      width: 28,
      height: 24,
      hp: 25,
      maxHp: 25,
      speed: 1.3,
      damage: 12,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 240,
      patrolStartX: 1760,
      patrolStartY: 600,
      isDead: false,
      deathTimer: 0,
      dropType: 'coin',
    },
  ];

  return {
    levelNumber: 2,
    title: 'LEVEL 2: MONSTER FOREST',
    subtitle: 'Hutan Kegelapan Penuh Monster Liar',
    description: 'Bahaya mengintai di setiap sudut! Hadapi monster yang langsung menyerang, waspadai Monster Bayangan yang lincah, dan capai Portal Kemenangan!',
    mapWidth,
    mapHeight,
    playerStartX: 100,
    playerStartY: 550,
    portalX: 2000,
    portalY: 500,
    ambientLight: 'rgba(15, 8, 25, 0.45)', // Dark purple mystery vignette
    hasFog: true,
    enemies,
    collectibles,
    obstacles,
  };
}
