/**
 * Core types for Foxwood Tale: Petualangan Hutan Monster
 */

export type GameScreen = 
  | 'SPLASH' 
  | 'PLAYING' 
  | 'LEVEL_COMPLETE' 
  | 'GAME_OVER' 
  | 'VICTORY';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type PlayerAnimationState = 'idle' | 'walk' | 'run' | 'attack' | 'hurt' | 'dead';

export type EnemyType = 
  | 'slime' 
  | 'forest_monster' 
  | 'mushroom_monster' 
  | 'shadow_monster';

export type CollectibleType = 'coin' | 'crystal' | 'berry' | 'potion' | 'key';

export interface InventoryItem {
  id: string;
  name: string;
  type: CollectibleType;
  count: number;
  icon: string;
  description: string;
  healAmount?: number;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  speed: number;
  hp: number;
  maxHp: number;
  facing: Direction;
  animState: PlayerAnimationState;
  animTimer: number;
  attackTimer: number;
  attackDuration: number;
  isAttacking: boolean;
  hurtTimer: number;
  coins: number;
  crystals: number;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  facing: Direction;
  animTimer: number;
  hurtTimer: number;
  attackCooldown: number;
  aggroRadius: number;
  patrolStartX: number;
  patrolStartY: number;
  isDead: boolean;
  deathTimer: number;
  dropType: CollectibleType;
}

export type ObstacleType = 
  | 'tree_large' 
  | 'tree_small' 
  | 'rock' 
  | 'bush' 
  | 'flower' 
  | 'ruins_pillar' 
  | 'ruins_wall' 
  | 'torch' 
  | 'bridge' 
  | 'river' 
  | 'portal'
  | 'thorn_bush';

export interface Obstacle {
  id: string;
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
  isSolid: boolean;
  variant?: number;
}

export interface Collectible {
  id: string;
  type: CollectibleType;
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  bobOffset: number;
  value: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  type: 'spark' | 'leaf' | 'smoke' | 'damage_text' | 'torch_fire' | 'portal_swirl' | 'confetti';
  text?: string;
  alpha?: number;
}

export interface LevelConfig {
  levelNumber: 1 | 2;
  title: string;
  subtitle: string;
  description: string;
  mapWidth: number;
  mapHeight: number;
  playerStartX: number;
  playerStartY: number;
  portalX: number;
  portalY: number;
  ambientLight: string;
  hasFog: boolean;
  enemies: Enemy[];
  collectibles: Collectible[];
  obstacles: Obstacle[];
}

export interface GameStats {
  monstersDefeated: number;
  coinsCollected: number;
  crystalsFound: number;
  potionsUsed: number;
  timeElapsedSeconds: number;
}
