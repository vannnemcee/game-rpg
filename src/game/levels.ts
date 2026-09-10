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
  const riverW = 68;
  const bridgeY = 480;
  const bridgeH = 150;

  // River segments above and below the bridge
  obstacles.push({
    id: 'river-top',
    type: 'river',
    x: riverX,
    y: 0,
    width: riverW,
    height: bridgeY,
    isSolid: true,
  });
  // Wooden bridge to cross safely
  obstacles.push({
    id: 'bridge-center',
    type: 'bridge',
    x: riverX - 16,
    y: bridgeY,
    width: riverW + 32,
    height: bridgeH,
    isSolid: false, // Walkable!
  });
  obstacles.push({
    id: 'river-bot',
    type: 'river',
    x: riverX,
    y: bridgeY + bridgeH,
    width: riverW,
    height: mapHeight - (bridgeY + bridgeH),
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

    // Near the bridge (framing the entrance on north and south sides)
    { type: 'torch', x: 910, y: 430, w: 24, h: 36, solid: true },
    { type: 'torch', x: 910, y: 650, w: 24, h: 36, solid: true },
    { type: 'bush', x: 860, y: 390, w: 44, h: 32, solid: false },
    { type: 'rock', x: 870, y: 710, w: 42, h: 36, solid: true },

    // East side of the river (exploration area)
    { type: 'torch', x: 1040, y: 430, w: 24, h: 36, solid: true },
    { type: 'torch', x: 1040, y: 650, w: 24, h: 36, solid: true },
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
    theme: 'forest',
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
    theme: 'dark',
    enemies,
    collectibles,
    obstacles,
  };
}

export function createLevel3(): LevelConfig {
  const mapWidth = 2200;
  const mapHeight = 1200;
  const obstacles: Obstacle[] = [];

  // Top & Bottom boundary
  for (let x = 0; x < mapWidth; x += 70) {
    obstacles.push({ id: `l3-bt-${x}`, type: 'tree_large', x, y: 0, width: 64, height: 72, isSolid: true });
    obstacles.push({ id: `l3-bb-${x}`, type: 'tree_large', x, y: mapHeight - 80, width: 64, height: 72, isSolid: true });
  }

  // Left & Right boundary
  for (let y = 80; y < mapHeight - 80; y += 70) {
    obstacles.push({ id: `l3-bl-${y}`, type: 'tree_large', x: 0, y, width: 64, height: 72, isSolid: true });
    if (y < 460 || y > 640) {
      obstacles.push({ id: `l3-br-${y}`, type: 'tree_large', x: mapWidth - 70, y, width: 64, height: 72, isSolid: true });
    }
  }

  // Swamp Murky River with wooden bridge crossing at x = 1050
  const riverX = 1050;
  const riverW = 70;
  const bridgeY = 480;
  const bridgeH = 150;

  obstacles.push({
    id: 'l3-river-top',
    type: 'river',
    x: riverX,
    y: 0,
    width: riverW,
    height: bridgeY,
    isSolid: true,
    variant: 1, // Swamp green water
  });
  obstacles.push({
    id: 'l3-bridge',
    type: 'bridge',
    x: riverX - 16,
    y: bridgeY,
    width: riverW + 32,
    height: bridgeH,
    isSolid: false,
  });
  obstacles.push({
    id: 'l3-river-bot',
    type: 'river',
    x: riverX,
    y: bridgeY + bridgeH,
    width: riverW,
    height: mapHeight - (bridgeY + bridgeH),
    isSolid: true,
    variant: 1,
  });

  // Swamp Thorns & Ruins
  const l3Decors: { type: Obstacle['type']; x: number; y: number; w: number; h: number; solid: boolean }[] = [
    { type: 'thorn_bush', x: 260, y: 380, w: 46, h: 36, solid: true },
    { type: 'torch', x: 200, y: 440, w: 24, h: 36, solid: true },
    { type: 'torch', x: 200, y: 660, w: 24, h: 36, solid: true },
    { type: 'rock', x: 380, y: 680, w: 48, h: 40, solid: true },
    { type: 'ruins_pillar', x: 550, y: 340, w: 38, h: 54, solid: true },
    { type: 'ruins_pillar', x: 550, y: 720, w: 38, h: 54, solid: true },
    { type: 'thorn_bush', x: 700, y: 440, w: 46, h: 36, solid: true },
    { type: 'torch', x: 800, y: 360, w: 24, h: 36, solid: true },
    { type: 'torch', x: 800, y: 720, w: 24, h: 36, solid: true },
    // Framing bridge
    { type: 'torch', x: riverX - 50, y: 430, w: 24, h: 36, solid: true },
    { type: 'torch', x: riverX - 50, y: 650, w: 24, h: 36, solid: true },
    { type: 'torch', x: riverX + 90, y: 430, w: 24, h: 36, solid: true },
    { type: 'torch', x: riverX + 90, y: 650, w: 24, h: 36, solid: true },
    // East side
    { type: 'ruins_pillar', x: 1350, y: 380, w: 38, h: 54, solid: true },
    { type: 'ruins_pillar', x: 1350, y: 680, w: 38, h: 54, solid: true },
    { type: 'thorn_bush', x: 1520, y: 520, w: 46, h: 36, solid: true },
    { type: 'torch', x: 1700, y: 380, w: 24, h: 36, solid: true },
    { type: 'torch', x: 1700, y: 700, w: 24, h: 36, solid: true },
    { type: 'rock', x: 1850, y: 420, w: 48, h: 40, solid: true },
  ];

  l3Decors.forEach((d, idx) => {
    obstacles.push({
      id: `l3-decor-${idx}`,
      type: d.type,
      x: d.x,
      y: d.y,
      width: d.w,
      height: d.h,
      isSolid: d.solid,
    });
  });

  // Portal
  obstacles.push({
    id: 'exit-portal-l3',
    type: 'portal',
    x: 2000,
    y: 500,
    width: 76,
    height: 96,
    isSolid: false,
  });

  const collectibles: Collectible[] = [
    { id: 'l3-c1', type: 'coin', x: 260, y: 520, width: 16, height: 16, collected: false, bobOffset: 0.1, value: 20 },
    { id: 'l3-c2', type: 'berry', x: 420, y: 500, width: 18, height: 18, collected: false, bobOffset: 0.4, value: 20 },
    { id: 'l3-c3', type: 'crystal', x: 620, y: 400, width: 16, height: 20, collected: false, bobOffset: 0.7, value: 1 },
    { id: 'l3-c4', type: 'potion', x: 820, y: 540, width: 20, height: 20, collected: false, bobOffset: 0.2, value: 50 },
    // On the bridge
    { id: 'l3-c5', type: 'coin', x: 1085, y: 550, width: 16, height: 16, collected: false, bobOffset: 0.5, value: 25 },
    { id: 'l3-c6', type: 'crystal', x: 1400, y: 520, width: 16, height: 20, collected: false, bobOffset: 0.9, value: 1 },
    { id: 'l3-c7', type: 'potion', x: 1650, y: 460, width: 20, height: 20, collected: false, bobOffset: 0.3, value: 50 },
    { id: 'l3-c8', type: 'coin', x: 1880, y: 560, width: 16, height: 16, collected: false, bobOffset: 0.8, value: 30 },
  ];

  const enemies: Enemy[] = [
    {
      id: 'l3-e1',
      type: 'slime',
      name: 'Toxic Slime',
      x: 320,
      y: 520,
      vx: 0,
      vy: 0,
      width: 28,
      height: 24,
      hp: 30,
      maxHp: 30,
      speed: 1.4,
      damage: 14,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 260,
      patrolStartX: 320,
      patrolStartY: 520,
      isDead: false,
      deathTimer: 0,
      dropType: 'berry',
    },
    {
      id: 'l3-e2',
      type: 'mushroom_monster',
      name: 'Spore Fiend',
      x: 650,
      y: 530,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 40,
      maxHp: 40,
      speed: 1.3,
      damage: 16,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 270,
      patrolStartX: 650,
      patrolStartY: 530,
      isDead: false,
      deathTimer: 0,
      dropType: 'potion',
    },
    {
      id: 'l3-e3',
      type: 'shadow_monster',
      name: 'Bog Lurker',
      x: 920,
      y: 540,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 38,
      maxHp: 38,
      speed: 2.1,
      damage: 18,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 300,
      patrolStartX: 920,
      patrolStartY: 540,
      isDead: false,
      deathTimer: 0,
      dropType: 'crystal',
    },
    {
      id: 'l3-e4',
      type: 'forest_monster',
      name: 'Swamp Goblin',
      x: 1300,
      y: 550,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 36,
      maxHp: 36,
      speed: 1.6,
      damage: 15,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 260,
      patrolStartX: 1300,
      patrolStartY: 550,
      isDead: false,
      deathTimer: 0,
      dropType: 'coin',
    },
    {
      id: 'l3-e5',
      type: 'shadow_monster',
      name: 'Mire Phantom',
      x: 1720,
      y: 530,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 44,
      maxHp: 44,
      speed: 2.2,
      damage: 20,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 310,
      patrolStartX: 1720,
      patrolStartY: 530,
      isDead: false,
      deathTimer: 0,
      dropType: 'crystal',
    },
  ];

  return {
    levelNumber: 3,
    title: 'LEVEL 3: LEMBAH KABUT BERACUN',
    subtitle: 'Rawa Misterius Berisi Spora Beracun',
    description: 'Menyeberangi jembatan rawa berkabut hijau! Waspadai jamur spora dan monster bayangan yang berpatroli cepat.',
    mapWidth,
    mapHeight,
    playerStartX: 100,
    playerStartY: 550,
    portalX: 2000,
    portalY: 500,
    ambientLight: 'rgba(10, 25, 18, 0.42)',
    hasFog: true,
    theme: 'swamp',
    enemies,
    collectibles,
    obstacles,
  };
}

export function createLevel4(): LevelConfig {
  const mapWidth = 2300;
  const mapHeight = 1200;
  const obstacles: Obstacle[] = [];

  // Top & Bottom boundary (scorched trees)
  for (let x = 0; x < mapWidth; x += 70) {
    obstacles.push({ id: `l4-bt-${x}`, type: 'tree_large', x, y: 0, width: 64, height: 72, isSolid: true });
    obstacles.push({ id: `l4-bb-${x}`, type: 'tree_large', x, y: mapHeight - 80, width: 64, height: 72, isSolid: true });
  }

  // Left & Right boundary
  for (let y = 80; y < mapHeight - 80; y += 70) {
    obstacles.push({ id: `l4-bl-${y}`, type: 'tree_large', x: 0, y, width: 64, height: 72, isSolid: true });
    if (y < 460 || y > 640) {
      obstacles.push({ id: `l4-br-${y}`, type: 'tree_large', x: mapWidth - 70, y, width: 64, height: 72, isSolid: true });
    }
  }

  // Molten Magma Chasm crossing at x = 1100
  const riverX = 1100;
  const riverW = 76;
  const bridgeY = 480;
  const bridgeH = 150;

  obstacles.push({
    id: 'l4-lava-top',
    type: 'river',
    x: riverX,
    y: 0,
    width: riverW,
    height: bridgeY,
    isSolid: true,
    variant: 2, // Molten Lava!
  });
  obstacles.push({
    id: 'l4-bridge',
    type: 'bridge',
    x: riverX - 16,
    y: bridgeY,
    width: riverW + 32,
    height: bridgeH,
    isSolid: false,
  });
  obstacles.push({
    id: 'l4-lava-bot',
    type: 'river',
    x: riverX,
    y: bridgeY + bridgeH,
    width: riverW,
    height: mapHeight - (bridgeY + bridgeH),
    isSolid: true,
    variant: 2,
  });

  // Volcanic Decors & Pillars
  const l4Decors: { type: Obstacle['type']; x: number; y: number; w: number; h: number; solid: boolean }[] = [
    { type: 'torch', x: 180, y: 440, w: 24, h: 36, solid: true },
    { type: 'torch', x: 180, y: 660, w: 24, h: 36, solid: true },
    { type: 'rock', x: 340, y: 400, w: 48, h: 40, solid: true },
    { type: 'rock', x: 340, y: 680, w: 48, h: 40, solid: true },
    { type: 'ruins_pillar', x: 560, y: 360, w: 38, h: 54, solid: true },
    { type: 'ruins_pillar', x: 560, y: 720, w: 38, h: 54, solid: true },
    { type: 'thorn_bush', x: 740, y: 500, w: 46, h: 36, solid: true },
    { type: 'torch', x: 860, y: 380, w: 24, h: 36, solid: true },
    { type: 'torch', x: 860, y: 700, w: 24, h: 36, solid: true },
    // Magma bridge torches
    { type: 'torch', x: riverX - 50, y: 430, w: 24, h: 36, solid: true },
    { type: 'torch', x: riverX - 50, y: 650, w: 24, h: 36, solid: true },
    { type: 'torch', x: riverX + 96, y: 430, w: 24, h: 36, solid: true },
    { type: 'torch', x: riverX + 96, y: 650, w: 24, h: 36, solid: true },
    // Beyond the chasm
    { type: 'ruins_pillar', x: 1400, y: 360, w: 38, h: 54, solid: true },
    { type: 'ruins_pillar', x: 1400, y: 720, w: 38, h: 54, solid: true },
    { type: 'thorn_bush', x: 1600, y: 450, w: 46, h: 36, solid: true },
    { type: 'rock', x: 1750, y: 650, w: 48, h: 40, solid: true },
    { type: 'torch', x: 1900, y: 420, w: 24, h: 36, solid: true },
    { type: 'torch', x: 1900, y: 680, w: 24, h: 36, solid: true },
  ];

  l4Decors.forEach((d, idx) => {
    obstacles.push({
      id: `l4-decor-${idx}`,
      type: d.type,
      x: d.x,
      y: d.y,
      width: d.w,
      height: d.h,
      isSolid: d.solid,
    });
  });

  // Portal
  obstacles.push({
    id: 'exit-portal-l4',
    type: 'portal',
    x: 2100,
    y: 500,
    width: 76,
    height: 96,
    isSolid: false,
  });

  const collectibles: Collectible[] = [
    { id: 'l4-c1', type: 'coin', x: 260, y: 540, width: 16, height: 16, collected: false, bobOffset: 0.1, value: 25 },
    { id: 'l4-c2', type: 'crystal', x: 500, y: 440, width: 16, height: 20, collected: false, bobOffset: 0.5, value: 1 },
    { id: 'l4-c3', type: 'potion', x: 740, y: 600, width: 20, height: 20, collected: false, bobOffset: 0.2, value: 50 },
    // On the magma bridge
    { id: 'l4-c4', type: 'coin', x: 1138, y: 555, width: 16, height: 16, collected: false, bobOffset: 0.6, value: 30 },
    { id: 'l4-c5', type: 'crystal', x: 1450, y: 530, width: 16, height: 20, collected: false, bobOffset: 0.8, value: 1 },
    { id: 'l4-c6', type: 'potion', x: 1700, y: 480, width: 20, height: 20, collected: false, bobOffset: 0.3, value: 50 },
    { id: 'l4-c7', type: 'coin', x: 1950, y: 550, width: 16, height: 16, collected: false, bobOffset: 0.4, value: 35 },
  ];

  const enemies: Enemy[] = [
    {
      id: 'l4-e1',
      type: 'slime',
      name: 'Magma Slime',
      x: 350,
      y: 530,
      vx: 0,
      vy: 0,
      width: 28,
      height: 24,
      hp: 35,
      maxHp: 35,
      speed: 1.5,
      damage: 16,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 280,
      patrolStartX: 350,
      patrolStartY: 530,
      isDead: false,
      deathTimer: 0,
      dropType: 'coin',
    },
    {
      id: 'l4-e2',
      type: 'shadow_monster',
      name: 'Obsidian Stalker',
      x: 680,
      y: 540,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 46,
      maxHp: 46,
      speed: 2.3,
      damage: 22,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 320,
      patrolStartX: 680,
      patrolStartY: 540,
      isDead: false,
      deathTimer: 0,
      dropType: 'crystal',
    },
    {
      id: 'l4-e3',
      type: 'mushroom_monster',
      name: 'Flame Spore',
      x: 960,
      y: 520,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 45,
      maxHp: 45,
      speed: 1.4,
      damage: 18,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 280,
      patrolStartX: 960,
      patrolStartY: 520,
      isDead: false,
      deathTimer: 0,
      dropType: 'potion',
    },
    {
      id: 'l4-e4',
      type: 'shadow_monster',
      name: 'Lava Fiend',
      x: 1450,
      y: 540,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 50,
      maxHp: 50,
      speed: 2.4,
      damage: 24,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 320,
      patrolStartX: 1450,
      patrolStartY: 540,
      isDead: false,
      deathTimer: 0,
      dropType: 'crystal',
    },
    {
      id: 'l4-e5',
      type: 'forest_monster',
      name: 'Firebrand Goblin',
      x: 1800,
      y: 530,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 42,
      maxHp: 42,
      speed: 1.7,
      damage: 18,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 280,
      patrolStartX: 1800,
      patrolStartY: 530,
      isDead: false,
      deathTimer: 0,
      dropType: 'coin',
    },
  ];

  return {
    levelNumber: 4,
    title: 'LEVEL 4: RERUNTUHAN OBSIDIAN & MAGMA',
    subtitle: 'Ngarai Lahar Membara & Bebatuan Hangus',
    description: 'Hawa panas menyengat! Seberangi jembatan di atas sungai lahar cair dan hadapi Shadow Monster yang ganas.',
    mapWidth,
    mapHeight,
    playerStartX: 100,
    playerStartY: 550,
    portalX: 2100,
    portalY: 500,
    ambientLight: 'rgba(35, 10, 8, 0.4)',
    hasFog: true,
    theme: 'volcano',
    enemies,
    collectibles,
    obstacles,
  };
}

export function createLevel5(): LevelConfig {
  const mapWidth = 2400;
  const mapHeight = 1200;
  const obstacles: Obstacle[] = [];

  // Top & Bottom boundary
  for (let x = 0; x < mapWidth; x += 70) {
    obstacles.push({ id: `l5-bt-${x}`, type: 'tree_large', x, y: 0, width: 64, height: 72, isSolid: true });
    obstacles.push({ id: `l5-bb-${x}`, type: 'tree_large', x, y: mapHeight - 80, width: 64, height: 72, isSolid: true });
  }

  // Left & Right boundary
  for (let y = 80; y < mapHeight - 80; y += 70) {
    obstacles.push({ id: `l5-bl-${y}`, type: 'tree_large', x: 0, y, width: 64, height: 72, isSolid: true });
    if (y < 460 || y > 640) {
      obstacles.push({ id: `l5-br-${y}`, type: 'tree_large', x: mapWidth - 70, y, width: 64, height: 72, isSolid: true });
    }
  }

  // Ancient Citadel Corridors (Dense Ruins Pillars & Torches)
  const l5Decors: { type: Obstacle['type']; x: number; y: number; w: number; h: number; solid: boolean }[] = [
    { type: 'torch', x: 180, y: 440, w: 24, h: 36, solid: true },
    { type: 'torch', x: 180, y: 660, w: 24, h: 36, solid: true },
    { type: 'ruins_pillar', x: 320, y: 360, w: 38, h: 54, solid: true },
    { type: 'ruins_pillar', x: 320, y: 720, w: 38, h: 54, solid: true },
    { type: 'thorn_bush', x: 480, y: 480, w: 46, h: 36, solid: true },
    // Citadel Gate 1
    { type: 'ruins_pillar', x: 680, y: 340, w: 38, h: 54, solid: true },
    { type: 'ruins_pillar', x: 680, y: 740, w: 38, h: 54, solid: true },
    { type: 'torch', x: 720, y: 440, w: 24, h: 36, solid: true },
    { type: 'torch', x: 720, y: 640, w: 24, h: 36, solid: true },
    // Hallway of Shadows
    { type: 'ruins_pillar', x: 1020, y: 380, w: 38, h: 54, solid: true },
    { type: 'ruins_pillar', x: 1020, y: 700, w: 38, h: 54, solid: true },
    { type: 'thorn_bush', x: 1180, y: 520, w: 46, h: 36, solid: true },
    { type: 'torch', x: 1320, y: 360, w: 24, h: 36, solid: true },
    { type: 'torch', x: 1320, y: 720, w: 24, h: 36, solid: true },
    // Inner Sanctum
    { type: 'ruins_pillar', x: 1560, y: 340, w: 38, h: 54, solid: true },
    { type: 'ruins_pillar', x: 1560, y: 740, w: 38, h: 54, solid: true },
    { type: 'torch', x: 1720, y: 430, w: 24, h: 36, solid: true },
    { type: 'torch', x: 1720, y: 650, w: 24, h: 36, solid: true },
    { type: 'rock', x: 1880, y: 400, w: 48, h: 40, solid: true },
    { type: 'rock', x: 1880, y: 680, w: 48, h: 40, solid: true },
    { type: 'torch', x: 2020, y: 440, w: 24, h: 36, solid: true },
    { type: 'torch', x: 2020, y: 640, w: 24, h: 36, solid: true },
  ];

  l5Decors.forEach((d, idx) => {
    obstacles.push({
      id: `l5-decor-${idx}`,
      type: d.type,
      x: d.x,
      y: d.y,
      width: d.w,
      height: d.h,
      isSolid: d.solid,
    });
  });

  // Portal to Final Core
  obstacles.push({
    id: 'exit-portal-l5',
    type: 'portal',
    x: 2200,
    y: 500,
    width: 76,
    height: 96,
    isSolid: false,
  });

  const collectibles: Collectible[] = [
    { id: 'l5-c1', type: 'coin', x: 260, y: 550, width: 16, height: 16, collected: false, bobOffset: 0.1, value: 30 },
    { id: 'l5-c2', type: 'potion', x: 500, y: 520, width: 20, height: 20, collected: false, bobOffset: 0.3, value: 50 },
    { id: 'l5-c3', type: 'crystal', x: 780, y: 540, width: 16, height: 20, collected: false, bobOffset: 0.7, value: 1 },
    { id: 'l5-c4', type: 'coin', x: 1100, y: 530, width: 16, height: 16, collected: false, bobOffset: 0.5, value: 35 },
    { id: 'l5-c5', type: 'potion', x: 1400, y: 550, width: 20, height: 20, collected: false, bobOffset: 0.2, value: 50 },
    { id: 'l5-c6', type: 'crystal', x: 1650, y: 500, width: 16, height: 20, collected: false, bobOffset: 0.8, value: 1 },
    { id: 'l5-c7', type: 'coin', x: 1950, y: 550, width: 16, height: 16, collected: false, bobOffset: 0.4, value: 40 },
  ];

  const enemies: Enemy[] = [
    {
      id: 'l5-e1',
      type: 'shadow_monster',
      name: 'Citadel Shadow',
      x: 400,
      y: 540,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 50,
      maxHp: 50,
      speed: 2.4,
      damage: 24,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 320,
      patrolStartX: 400,
      patrolStartY: 540,
      isDead: false,
      deathTimer: 0,
      dropType: 'crystal',
    },
    {
      id: 'l5-e2',
      type: 'mushroom_monster',
      name: 'Citadel Spore Fiend',
      x: 850,
      y: 530,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 52,
      maxHp: 52,
      speed: 1.5,
      damage: 20,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 290,
      patrolStartX: 850,
      patrolStartY: 530,
      isDead: false,
      deathTimer: 0,
      dropType: 'potion',
    },
    {
      id: 'l5-e3',
      type: 'shadow_monster',
      name: 'Dread Sentinel',
      x: 1250,
      y: 550,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 55,
      maxHp: 55,
      speed: 2.5,
      damage: 26,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 340,
      patrolStartX: 1250,
      patrolStartY: 550,
      isDead: false,
      deathTimer: 0,
      dropType: 'crystal',
    },
    {
      id: 'l5-e4',
      type: 'forest_monster',
      name: 'Citadel Goblin Champion',
      x: 1600,
      y: 540,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 48,
      maxHp: 48,
      speed: 1.8,
      damage: 22,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 300,
      patrolStartX: 1600,
      patrolStartY: 540,
      isDead: false,
      deathTimer: 0,
      dropType: 'coin',
    },
    {
      id: 'l5-e5',
      type: 'shadow_monster',
      name: 'Abyssal Knight',
      x: 1850,
      y: 540,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 60,
      maxHp: 60,
      speed: 2.6,
      damage: 28,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 350,
      patrolStartX: 1850,
      patrolStartY: 540,
      isDead: false,
      deathTimer: 0,
      dropType: 'potion',
    },
  ];

  return {
    levelNumber: 5,
    title: 'LEVEL 5: BENTENG BAYANGAN KUNO',
    subtitle: 'Reruntuhan Benteng Kegelapan Para Monster',
    description: 'Benteng kuno yang dihuni oleh para penjaga bayangan elit! Terobos barisan pilar kuno dan kumpulkan perbekalan terakhir.',
    mapWidth,
    mapHeight,
    playerStartX: 100,
    playerStartY: 550,
    portalX: 2200,
    portalY: 500,
    ambientLight: 'rgba(12, 10, 24, 0.48)',
    hasFog: true,
    theme: 'citadel',
    enemies,
    collectibles,
    obstacles,
  };
}

export function createLevel6(): LevelConfig {
  const mapWidth = 2500;
  const mapHeight = 1200;
  const obstacles: Obstacle[] = [];

  // Top & Bottom boundary
  for (let x = 0; x < mapWidth; x += 70) {
    obstacles.push({ id: `l6-bt-${x}`, type: 'tree_large', x, y: 0, width: 64, height: 72, isSolid: true });
    obstacles.push({ id: `l6-bb-${x}`, type: 'tree_large', x, y: mapHeight - 80, width: 64, height: 72, isSolid: true });
  }

  // Left & Right boundary
  for (let y = 80; y < mapHeight - 80; y += 70) {
    obstacles.push({ id: `l6-bl-${y}`, type: 'tree_large', x: 0, y, width: 64, height: 72, isSolid: true });
    if (y < 460 || y > 640) {
      obstacles.push({ id: `l6-br-${y}`, type: 'tree_large', x: mapWidth - 70, y, width: 64, height: 72, isSolid: true });
    }
  }

  // Chasm & Grand Sanctuary Bridge at x = 1150
  const riverX = 1150;
  const riverW = 80;
  const bridgeY = 480;
  const bridgeH = 150;

  obstacles.push({
    id: 'l6-void-top',
    type: 'river',
    x: riverX,
    y: 0,
    width: riverW,
    height: bridgeY,
    isSolid: true,
    variant: 2, // Molten Void Lava
  });
  obstacles.push({
    id: 'l6-bridge',
    type: 'bridge',
    x: riverX - 16,
    y: bridgeY,
    width: riverW + 32,
    height: bridgeH,
    isSolid: false,
  });
  obstacles.push({
    id: 'l6-void-bot',
    type: 'river',
    x: riverX,
    y: bridgeY + bridgeH,
    width: riverW,
    height: mapHeight - (bridgeY + bridgeH),
    isSolid: true,
    variant: 2,
  });

  // Grand Cosmic Pillars & Torches
  const l6Decors: { type: Obstacle['type']; x: number; y: number; w: number; h: number; solid: boolean }[] = [
    { type: 'torch', x: 180, y: 440, w: 24, h: 36, solid: true },
    { type: 'torch', x: 180, y: 660, w: 24, h: 36, solid: true },
    { type: 'ruins_pillar', x: 380, y: 360, w: 38, h: 54, solid: true },
    { type: 'ruins_pillar', x: 380, y: 720, w: 38, h: 54, solid: true },
    { type: 'thorn_bush', x: 560, y: 490, w: 46, h: 36, solid: true },
    { type: 'torch', x: 740, y: 380, w: 24, h: 36, solid: true },
    { type: 'torch', x: 740, y: 700, w: 24, h: 36, solid: true },
    { type: 'ruins_pillar', x: 920, y: 360, w: 38, h: 54, solid: true },
    { type: 'ruins_pillar', x: 920, y: 720, w: 38, h: 54, solid: true },
    // Bridge Torches
    { type: 'torch', x: riverX - 50, y: 430, w: 24, h: 36, solid: true },
    { type: 'torch', x: riverX - 50, y: 650, w: 24, h: 36, solid: true },
    { type: 'torch', x: riverX + 100, y: 430, w: 24, h: 36, solid: true },
    { type: 'torch', x: riverX + 100, y: 650, w: 24, h: 36, solid: true },
    // Final Grand Sanctuary Courtyard
    { type: 'ruins_pillar', x: 1450, y: 340, w: 38, h: 54, solid: true },
    { type: 'ruins_pillar', x: 1450, y: 740, w: 38, h: 54, solid: true },
    { type: 'torch', x: 1650, y: 400, w: 24, h: 36, solid: true },
    { type: 'torch', x: 1650, y: 680, w: 24, h: 36, solid: true },
    { type: 'ruins_pillar', x: 1850, y: 340, w: 38, h: 54, solid: true },
    { type: 'ruins_pillar', x: 1850, y: 740, w: 38, h: 54, solid: true },
    { type: 'torch', x: 2050, y: 430, w: 24, h: 36, solid: true },
    { type: 'torch', x: 2050, y: 650, w: 24, h: 36, solid: true },
  ];

  l6Decors.forEach((d, idx) => {
    obstacles.push({
      id: `l6-decor-${idx}`,
      type: d.type,
      x: d.x,
      y: d.y,
      width: d.w,
      height: d.h,
      isSolid: d.solid,
    });
  });

  // GRAND SACRED VICTORY PORTAL
  obstacles.push({
    id: 'exit-portal-l6',
    type: 'portal',
    x: 2300,
    y: 500,
    width: 76,
    height: 96,
    isSolid: false,
  });

  const collectibles: Collectible[] = [
    { id: 'l6-c1', type: 'coin', x: 280, y: 550, width: 16, height: 16, collected: false, bobOffset: 0.1, value: 50 },
    { id: 'l6-c2', type: 'potion', x: 500, y: 550, width: 20, height: 20, collected: false, bobOffset: 0.3, value: 50 },
    { id: 'l6-c3', type: 'crystal', x: 750, y: 540, width: 16, height: 20, collected: false, bobOffset: 0.6, value: 1 },
    // On the Bridge
    { id: 'l6-c4', type: 'coin', x: 1190, y: 555, width: 16, height: 16, collected: false, bobOffset: 0.2, value: 50 },
    { id: 'l6-c5', type: 'potion', x: 1550, y: 540, width: 20, height: 20, collected: false, bobOffset: 0.5, value: 50 },
    { id: 'l6-c6', type: 'crystal', x: 1800, y: 530, width: 16, height: 20, collected: false, bobOffset: 0.8, value: 1 },
    { id: 'l6-c7', type: 'coin', x: 2150, y: 550, width: 16, height: 16, collected: false, bobOffset: 0.4, value: 100 },
  ];

  const enemies: Enemy[] = [
    {
      id: 'l6-e1',
      type: 'shadow_monster',
      name: 'Void Shadow',
      x: 420,
      y: 540,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 55,
      maxHp: 55,
      speed: 2.5,
      damage: 26,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 330,
      patrolStartX: 420,
      patrolStartY: 540,
      isDead: false,
      deathTimer: 0,
      dropType: 'crystal',
    },
    {
      id: 'l6-e2',
      type: 'mushroom_monster',
      name: 'Void Spore Sovereign',
      x: 820,
      y: 530,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 58,
      maxHp: 58,
      speed: 1.6,
      damage: 24,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 300,
      patrolStartX: 820,
      patrolStartY: 530,
      isDead: false,
      deathTimer: 0,
      dropType: 'potion',
    },
    {
      id: 'l6-e3',
      type: 'shadow_monster',
      name: 'Void Behemoth',
      x: 1350,
      y: 550,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 65,
      maxHp: 65,
      speed: 2.7,
      damage: 30,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 360,
      patrolStartX: 1350,
      patrolStartY: 550,
      isDead: false,
      deathTimer: 0,
      dropType: 'crystal',
    },
    {
      id: 'l6-e4',
      type: 'forest_monster',
      name: 'Elder Void Fiend',
      x: 1720,
      y: 540,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 55,
      maxHp: 55,
      speed: 2.0,
      damage: 25,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 320,
      patrolStartX: 1720,
      patrolStartY: 540,
      isDead: false,
      deathTimer: 0,
      dropType: 'coin',
    },
    {
      id: 'l6-e5',
      type: 'shadow_monster',
      name: 'Lord of the Void Core',
      x: 2050,
      y: 540,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      hp: 75,
      maxHp: 75,
      speed: 2.8,
      damage: 32,
      facing: 'left',
      animTimer: 0,
      hurtTimer: 0,
      attackCooldown: 0,
      aggroRadius: 380,
      patrolStartX: 2050,
      patrolStartY: 540,
      isDead: false,
      deathTimer: 0,
      dropType: 'potion',
    },
  ];

  return {
    levelNumber: 6,
    title: 'LEVEL 6: PUNCAK INTI FOXWOOD',
    subtitle: 'Pertarungan Terakhir di Gerbang Suci Kosmik',
    description: 'Puncak petualangan Foxwood! Tembus penjagaan Lord of the Void Core dan capai Gerbang Suci Terakhir untuk menyelamatkan hutan!',
    mapWidth,
    mapHeight,
    playerStartX: 100,
    playerStartY: 550,
    portalX: 2300,
    portalY: 500,
    ambientLight: 'rgba(16, 8, 30, 0.45)',
    hasFog: true,
    theme: 'sanctuary',
    enemies,
    collectibles,
    obstacles,
  };
}
