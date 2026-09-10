/**
 * Procedural Pixel Art Sprite Renderer
 * Renders authentic, crisp 16-bit style RPG pixel graphics directly to Canvas.
 */

import { Direction, Player, Enemy, Collectible, Obstacle, Particle } from '../types';

export class SpriteRenderer {
  // Helper to draw a pixel rect aligned to pixel grid
  private static px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  }

  // ==========================================
  // PLAYER: KIKO THE BRAVE FOX (RUBAH PETUALANG)
  // ==========================================
  public static drawPlayer(ctx: CanvasRenderingContext2D, player: Player, time: number) {
    ctx.save();
    ctx.translate(Math.floor(player.x), Math.floor(player.y));

    // Hurt blinking effect
    if (player.hurtTimer > 0 && Math.floor(time * 25) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    const s = 2; // Pixel scale factor (each logical pixel is 2x2 on canvas)
    const isAttacking = player.isAttacking;
    const isRunning = player.animState === 'run';
    const isWalking = player.animState === 'walk' || isRunning;
    const isDead = player.hp <= 0;

    // Bobbing offset for walking, running & breathing
    const animRate = isRunning ? 20 : 12;
    const bob = isWalking ? Math.sin(time * animRate) * (isRunning ? 2.2 : 1.5) : Math.sin(time * 3) * 0.8;
    const stepOffset = isWalking ? Math.sin(time * animRate) * (isRunning ? 3.5 : 2) : 0;
    const tailWag = Math.sin(time * (isRunning ? 24 : isWalking ? 14 : 5)) * (isRunning ? 4.5 : 3);

    if (isDead) {
      // Dead fox lying down
      ctx.translate(0, 8);
      ctx.rotate(Math.PI / 2);
      this.drawFoxBody(ctx, s, 0, 0, 'down', false, 0, 0, true);
      // Spinning stars above
      for (let i = 0; i < 3; i++) {
        const starAngle = time * 4 + (i * Math.PI * 2) / 3;
        const starX = Math.cos(starAngle) * 14;
        const starY = -18 + Math.sin(starAngle) * 6;
        this.px(ctx, starX - 2, starY - 2, 4, 4, '#ffea47');
      }
      ctx.restore();
      return;
    }

    // Mirror for left facing
    if (player.facing === 'left') {
      ctx.scale(-1, 1);
    }

    // Render Fox Sprite
    this.drawFoxBody(ctx, s, bob, stepOffset, player.facing === 'up' ? 'up' : 'side', isWalking, tailWag, time, false);

    // Sword & Slash Arc
    if (isAttacking) {
      this.drawSwordSlash(ctx, player.facing, player.attackTimer / player.attackDuration, s);
    }

    ctx.restore();
  }

  private static drawFoxBody(
    ctx: CanvasRenderingContext2D,
    s: number,
    bob: number,
    step: number,
    view: 'up' | 'side' | 'down',
    isWalking: boolean,
    tailWag: number,
    time: number,
    isDefeated: boolean
  ) {
    const P = (x: number, y: number, w: number, h: number, col: string) => {
      this.px(ctx, x * s, (y + bob) * s, w * s, h * s, col);
    };

    // Color Palette for Fox
    const ORANGE_MAIN = '#e65c00';
    const ORANGE_SHADOW = '#ba4300';
    const ORANGE_LIGHT = '#ff7b1a';
    const WHITE_FUR = '#fff4e6';
    const WHITE_SHADOW = '#d8c2aa';
    const BLACK_EAR = '#261b17';
    const NOSE = '#140c09';
    const EYE = '#1f1610';
    const EYE_SPARKLE = '#ffffff';
    const SCARF = '#28a745';
    const SCARF_SHADOW = '#1b6b2c';

    // 1. Shadow beneath fox
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(0, 11 * s, 9 * s, 4 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Tail (behind body)
    const tailX = view === 'side' ? -7 + tailWag * 0.3 : (view === 'up' ? 0 + tailWag * 0.4 : -6 + tailWag * 0.2);
    const tailY = 2 + (isWalking ? Math.sin(time * 12) * 1 : 0);

    // Tail Base (Orange)
    P(tailX - 2, tailY, 4, 5, ORANGE_SHADOW);
    P(tailX - 3, tailY - 3, 5, 4, ORANGE_MAIN);
    P(tailX - 2, tailY - 5, 4, 3, ORANGE_LIGHT);
    // Tail White Fluffy Tip
    P(tailX - 2, tailY - 8, 4, 4, WHITE_FUR);
    P(tailX - 1, tailY - 10, 2, 2, WHITE_SHADOW);

    // 3. Paws / Legs
    const leg1 = step;
    const leg2 = -step;
    P(-4, 7 + leg1, 3, 4, ORANGE_SHADOW); // Back leg
    P(-4, 10 + leg1, 3, 2, WHITE_FUR);
    P(2, 7 + leg2, 3, 4, ORANGE_MAIN);    // Front leg
    P(2, 10 + leg2, 3, 2, WHITE_FUR);

    // 4. Fox Torso
    P(-4, 0, 8, 8, ORANGE_MAIN);
    P(-3, 0, 6, 7, ORANGE_LIGHT);
    // White chest fur
    P(-2, 2, 4, 5, WHITE_FUR);
    P(-1, 3, 2, 4, WHITE_SHADOW);

    // 5. Green Adventurer Scarf
    P(-5, -1, 10, 3, SCARF);
    P(-4, -1, 8, 2, '#48c765');
    // Scarf fluttering tail
    const scarfFlutter = Math.sin(time * 16) * 2;
    P(-7 + scarfFlutter * 0.5, 0, 3, 4, SCARF);
    P(-8 + scarfFlutter, 2, 2, 3, SCARF_SHADOW);

    // 6. Fox Head & Face
    P(-5, -8, 10, 7, ORANGE_MAIN);
    P(-4, -7, 8, 6, ORANGE_LIGHT);

    // Ears
    // Left ear
    P(-5, -13, 3, 5, ORANGE_MAIN);
    P(-4, -14, 2, 2, BLACK_EAR);
    P(-4, -11, 2, 3, WHITE_FUR);
    // Right ear
    P(2, -13, 3, 5, ORANGE_MAIN);
    P(2, -14, 2, 2, BLACK_EAR);
    P(2, -11, 2, 3, WHITE_FUR);

    if (view === 'up') {
      // Back of head
      P(-4, -7, 8, 5, ORANGE_MAIN);
      P(-2, -6, 4, 3, ORANGE_SHADOW);
    } else {
      // Front / Side view face
      // White muzzle cheeks
      P(-4, -4, 4, 4, WHITE_FUR);
      P(0, -4, 4, 4, WHITE_FUR);

      // Cute black nose
      P(view === 'side' ? 2 : -1, -3, 2, 2, NOSE);

      if (isDefeated) {
        // X X eyes
        P(-3, -6, 2, 1, EYE);
        P(1, -6, 2, 1, EYE);
      } else {
        // Large expressive eyes
        P(-3, -7, 2, 3, EYE);
        P(-3, -7, 1, 1, EYE_SPARKLE);

        if (view !== 'side') {
          P(1, -7, 2, 3, EYE);
          P(1, -7, 1, 1, EYE_SPARKLE);
        }
      }
    }
  }

  // Draw dynamic sword slash trail
  private static drawSwordSlash(ctx: CanvasRenderingContext2D, facing: Direction, progress: number, s: number) {
    const angle = progress * Math.PI;
    const radius = 24 * s;

    ctx.save();
    let baseAngle = 0;
    if (facing === 'right') baseAngle = 0;
    if (facing === 'down') baseAngle = Math.PI / 2;
    if (facing === 'left') baseAngle = Math.PI;
    if (facing === 'up') baseAngle = -Math.PI / 2;

    ctx.rotate(baseAngle);

    // Glowing energy slash arc
    ctx.strokeStyle = '#fff8b3';
    ctx.lineWidth = 4 * s;
    ctx.beginPath();
    ctx.arc(0, 0, radius, -Math.PI / 4 + angle * 0.8, Math.PI / 4 + angle * 0.8);
    ctx.stroke();

    ctx.strokeStyle = '#ffd000';
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.arc(0, 0, radius - 2 * s, -Math.PI / 4 + angle * 0.8, Math.PI / 4 + angle * 0.8);
    ctx.stroke();

    // Sparkle at tip of blade
    const tipX = Math.cos(Math.PI / 4 + angle * 0.8) * radius;
    const tipY = Math.sin(Math.PI / 4 + angle * 0.8) * radius;
    this.px(ctx, tipX - 2 * s, tipY - 2 * s, 4 * s, 4 * s, '#ffffff');

    ctx.restore();
  }

  // ==========================================
  // ENEMIES: SLIME, FOREST MONSTER, MUSHROOM, SHADOW
  // ==========================================
  public static drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy, time: number) {
    if (enemy.isDead && enemy.deathTimer > 0.4) return;

    ctx.save();
    ctx.translate(Math.floor(enemy.x), Math.floor(enemy.y));

    // Death fade & shrink
    if (enemy.isDead) {
      const deathProgress = enemy.deathTimer / 0.4;
      ctx.globalAlpha = Math.max(0, 1 - deathProgress);
      ctx.scale(1 - deathProgress * 0.5, 1 - deathProgress * 0.5);
    }

    // Hurt red flash
    if (enemy.hurtTimer > 0 && Math.floor(time * 25) % 2 === 0) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#ff3333';
    }

    const s = 2;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 8 * s, (enemy.width / 2.5), (enemy.height / 5), 0, 0, Math.PI * 2);
    ctx.fill();

    switch (enemy.type) {
      case 'slime':
        this.drawSlime(ctx, s, time, enemy);
        break;
      case 'forest_monster':
        this.drawForestMonster(ctx, s, time, enemy);
        break;
      case 'mushroom_monster':
        this.drawMushroomMonster(ctx, s, time, enemy);
        break;
      case 'shadow_monster':
        this.drawShadowMonster(ctx, s, time, enemy);
        break;
    }

    // Draw HP Bar above enemy head
    if (enemy.hp < enemy.maxHp && !enemy.isDead) {
      const barW = 28;
      const barH = 5;
      const barY = -enemy.height / 2 - 12;
      const hpPct = Math.max(0, enemy.hp / enemy.maxHp);

      // Frame
      ctx.fillStyle = '#0a100a';
      ctx.fillRect(-barW / 2 - 1, barY - 1, barW + 2, barH + 2);
      // Background red
      ctx.fillStyle = '#781c1c';
      ctx.fillRect(-barW / 2, barY, barW, barH);
      // Green HP
      ctx.fillStyle = hpPct > 0.4 ? '#38b000' : '#ffaa00';
      ctx.fillRect(-barW / 2, barY, Math.floor(barW * hpPct), barH);
    }

    ctx.restore();
  }

  // 1. Green Jelly Slime
  private static drawSlime(ctx: CanvasRenderingContext2D, s: number, time: number, enemy: Enemy) {
    const bounce = Math.abs(Math.sin(time * 7 + Number(enemy.id.slice(-2) || 0)));
    const squashX = 1 + bounce * 0.25;
    const squashY = 1 - bounce * 0.25;

    ctx.scale(squashX, squashY);

    const P = (x: number, y: number, w: number, h: number, col: string) => {
      this.px(ctx, x * s, y * s, w * s, h * s, col);
    };

    const SLIME_DARK = '#246b2a';
    const SLIME_MID = '#40a049';
    const SLIME_LIGHT = '#6ee379';
    const SLIME_HIGHLIGHT = '#baffc1';

    // Slime body
    P(-7, 2, 14, 5, SLIME_DARK);
    P(-8, 0, 16, 4, SLIME_MID);
    P(-7, -4, 14, 5, SLIME_MID);
    P(-5, -7, 10, 4, SLIME_LIGHT);
    P(-3, -8, 6, 2, SLIME_HIGHLIGHT);

    // Cute jelly highlight
    P(-4, -5, 3, 2, SLIME_HIGHLIGHT);

    // Black eyes with white spark
    P(-4, -2, 2, 3, '#102213');
    P(-4, -2, 1, 1, '#ffffff');
    P(2, -2, 2, 3, '#102213');
    P(2, -2, 1, 1, '#ffffff');

    // Cheerful mouth
    P(-1, 0, 2, 1, '#102213');
  }

  // 2. Monster Hutan (Horned Forest Beast / Wild Bramble Goblin)
  private static drawForestMonster(ctx: CanvasRenderingContext2D, s: number, time: number, enemy: Enemy) {
    const P = (x: number, y: number, w: number, h: number, col: string) => {
      this.px(ctx, x * s, y * s, w * s, h * s, col);
    };

    const stomp = Math.sin(time * 8) * 1.5;

    // Dark bark & moss palette
    const BARK = '#3d2817';
    const BARK_SHADOW = '#26180c';
    const MOSS = '#447029';
    const MOSS_LIGHT = '#6b9e38';
    const EYE_GLOW = '#ffcc00';

    // Legs
    P(-6, 4 + stomp, 4, 6, BARK_SHADOW);
    P(2, 4 - stomp, 4, 6, BARK);

    // Torso (mossy bark)
    P(-8, -6, 16, 11, BARK);
    P(-7, -5, 14, 9, MOSS);
    P(-5, -3, 10, 6, MOSS_LIGHT);

    // Monster head
    P(-7, -13, 14, 8, BARK);
    P(-6, -12, 12, 6, MOSS);

    // Curved Wooden Horns
    P(-10, -17, 4, 6, '#805b3b');
    P(-9, -19, 3, 3, '#ba8a5b');
    P(6, -17, 4, 6, '#805b3b');
    P(6, -19, 3, 3, '#ba8a5b');

    // Menacing glowing yellow eyes
    P(-5, -10, 3, 2, EYE_GLOW);
    P(-4, -10, 1, 1, '#ffffff');
    P(2, -10, 3, 2, EYE_GLOW);
    P(3, -10, 1, 1, '#ffffff');

    // Sharp fangs
    P(-3, -6, 2, 2, '#ffffff');
    P(1, -6, 2, 2, '#ffffff');

    // Claws
    P(-11, -2 + stomp, 4, 5, BARK_SHADOW);
    P(7, -2 - stomp, 4, 5, BARK);
  }

  // 3. Monster Jamur (Spore Shroom)
  private static drawMushroomMonster(ctx: CanvasRenderingContext2D, s: number, time: number, enemy: Enemy) {
    const P = (x: number, y: number, w: number, h: number, col: string) => {
      this.px(ctx, x * s, y * s, w * s, h * s, col);
    };

    const wobble = Math.sin(time * 6) * 1;

    // Red mushroom with white spots & root feet
    const CAP_RED = '#d92525';
    const CAP_DARK = '#8a1111';
    const CAP_LIGHT = '#ff4d4d';
    const STEM = '#e8d8b7';

    // Root feet
    P(-5, 5 + wobble, 3, 3, STEM);
    P(2, 5 - wobble, 3, 3, STEM);

    // Stem body
    P(-5, -1, 10, 7, STEM);

    // Angry little mushroom eyes
    P(-3, 1, 2, 2, '#3a1e0b');
    P(1, 1, 2, 2, '#3a1e0b');
    // Brow
    P(-4, 0, 8, 1, '#3a1e0b');

    // Giant Mushroom Cap
    P(-11, -7, 22, 5, CAP_DARK);
    P(-10, -11, 20, 6, CAP_RED);
    P(-8, -14, 16, 4, CAP_LIGHT);
    P(-5, -16, 10, 3, CAP_LIGHT);

    // White polka dots
    P(-6, -11, 3, 3, '#ffffff');
    P(3, -12, 3, 3, '#ffffff');
    P(-2, -14, 3, 2, '#ffffff');
  }

  // 4. Monster Bayangan (Shadow Fiend)
  private static drawShadowMonster(ctx: CanvasRenderingContext2D, s: number, time: number, enemy: Enemy) {
    const P = (x: number, y: number, w: number, h: number, col: string) => {
      this.px(ctx, x * s, y * s, w * s, h * s, col);
    };

    // Wispy floating motion
    const hover = Math.sin(time * 7) * 3;
    ctx.translate(0, hover);

    const SHADOW_DEEP = '#0f081c';
    const SHADOW_MID = '#291745';
    const SHADOW_VIOLET = '#532c85';
    const EYE_CYAN = '#00f7ff';

    // Smoky trailing tendrils below
    for (let i = -6; i <= 6; i += 3) {
      const tendrilWave = Math.sin(time * 10 + i) * 3;
      P(i, 4 + tendrilWave, 2, 5, SHADOW_VIOLET);
    }

    // Shadow blob body
    P(-8, -8, 16, 13, SHADOW_DEEP);
    P(-7, -7, 14, 11, SHADOW_MID);
    P(-5, -12, 10, 6, SHADOW_DEEP);

    // Crown / Spikes of darkness
    P(-6, -15, 3, 4, SHADOW_VIOLET);
    P(-1, -17, 3, 6, SHADOW_DEEP);
    P(3, -15, 3, 4, SHADOW_VIOLET);

    // Glowing cyan/violet eyes
    P(-4, -5, 3, 2, EYE_CYAN);
    P(-3, -5, 1, 1, '#ffffff');
    P(2, -5, 3, 2, EYE_CYAN);
    P(3, -5, 1, 1, '#ffffff');

    // Ambient shadow aura
    ctx.fillStyle = 'rgba(120, 40, 200, 0.15)';
    ctx.beginPath();
    ctx.arc(0, -4, 18 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // ==========================================
  // ENVIRONMENT & OBSTACLES
  // ==========================================
  public static drawObstacle(ctx: CanvasRenderingContext2D, obs: Obstacle, time: number) {
    ctx.save();
    ctx.translate(Math.floor(obs.x), Math.floor(obs.y));
    const s = 2;

    const P = (x: number, y: number, w: number, h: number, col: string) => {
      this.px(ctx, x * s, y * s, w * s, h * s, col);
    };

    switch (obs.type) {
      case 'tree_large': {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(obs.width / 2, obs.height - 8, obs.width * 0.45, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Thick textured trunk
        const trunkX = (obs.width / 2) / s - 6;
        const trunkY = (obs.height) / s - 24;
        P(trunkX, trunkY, 12, 22, '#3b2413');
        P(trunkX + 2, trunkY + 2, 8, 20, '#4e331c');
        P(trunkX + 4, trunkY + 4, 3, 16, '#28170a');

        // Multi-layered lush leafy canopy
        const leafW = (obs.width / s);
        const sway = Math.sin(time * 2 + obs.x) * 1.5;

        // Bottom darker foliage layer
        P(sway, 0, leafW, 32, '#1b4a24');
        // Middle rich green
        P(sway + 2, -10, leafW - 4, 28, '#266934');
        // Top highlight canopy
        P(sway + 5, -20, leafW - 10, 24, '#398f4c');
        P(sway + 9, -28, leafW - 18, 16, '#56b86e');
        P(sway + 13, -32, leafW - 26, 8, '#7ad48e');
        break;
      }

      case 'tree_small': {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(obs.width / 2, obs.height - 4, 18, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        const trunkX = (obs.width / 2) / s - 3;
        P(trunkX, obs.height / s - 14, 6, 14, '#3b2413');

        // Pine/cone leafy shape
        P(0, 0, obs.width / s, 16, '#184720');
        P(3, -8, (obs.width / s) - 6, 14, '#24632f');
        P(6, -16, (obs.width / s) - 12, 12, '#378744');
        P(9, -22, (obs.width / s) - 18, 8, '#52aa61');
        break;
      }

      case 'rock': {
        // Mossy Boulder
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.ellipse(obs.width / 2, obs.height / 2 + 4, obs.width / 2, obs.height / 3, 0, 0, Math.PI * 2);
        ctx.fill();

        P(2, 2, obs.width / s - 4, obs.height / s - 4, '#474d49');
        P(4, 0, obs.width / s - 8, obs.height / s - 4, '#5e6661');
        P(6, 2, obs.width / s - 12, obs.height / s - 8, '#7a857e');
        // Moss patch
        P(4, 0, 6, 4, '#3a6632');
        P(8, 2, 4, 3, '#58914d');
        break;
      }

      case 'bush': {
        const sway = Math.sin(time * 3 + obs.y) * 1;
        P(2 + sway, 2, obs.width / s - 4, obs.height / s - 4, '#1b4a24');
        P(4 + sway, 0, obs.width / s - 8, obs.height / s - 4, '#2f753d');
        P(6 + sway, 2, obs.width / s - 12, obs.height / s - 8, '#439e55');
        // Wild flowers on bush
        P(5 + sway, 3, 2, 2, '#ff69b4');
        P(11 + sway, 5, 2, 2, '#ffd700');
        P(16 + sway, 3, 2, 2, '#ff69b4');
        break;
      }

      case 'thorn_bush': {
        // Dark dangerous thorn briars
        P(0, 2, obs.width / s, obs.height / s - 4, '#2b1b22');
        P(3, 0, obs.width / s - 6, obs.height / s - 2, '#452634');
        // Purple thorns
        P(2, -2, 2, 4, '#8a3d60');
        P(8, -3, 2, 4, '#ba5282');
        P(14, -2, 2, 4, '#8a3d60');
        break;
      }

      case 'river': {
        // Flowing Water or Magma tile
        const waterW = obs.width;
        const waterH = obs.height;
        const variant = obs.variant || 0;

        if (variant === 2) {
          // Molten Magma River (Level 4 & 6)
          ctx.fillStyle = '#6b1408';
          ctx.fillRect(0, 0, waterW, waterH);
          for (let y = 4; y < waterH; y += 14) {
            const shift = (time * 18 + y * 4) % (waterW + 20) - 10;
            ctx.fillStyle = '#b83014';
            ctx.fillRect(shift, y, 20, 4);
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(shift + 4, y + 1, 10, 2);
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(shift + 7, y + 1.5, 4, 1);
          }
        } else if (variant === 1) {
          // Murky Swamp River (Level 3)
          ctx.fillStyle = '#16382b';
          ctx.fillRect(0, 0, waterW, waterH);
          for (let y = 4; y < waterH; y += 14) {
            const shift = (time * 15 + y * 4) % (waterW + 20) - 10;
            ctx.fillStyle = '#235944';
            ctx.fillRect(shift, y, 16, 3);
            ctx.fillStyle = '#34d399';
            ctx.fillRect(shift + 3, y + 1, 6, 1);
          }
        } else {
          // Clear Forest River (Level 1)
          ctx.fillStyle = '#1e5f7a';
          ctx.fillRect(0, 0, waterW, waterH);
          for (let y = 4; y < waterH; y += 14) {
            const shift = (time * 25 + y * 4) % (waterW + 20) - 10;
            ctx.fillStyle = '#2d84a8';
            ctx.fillRect(shift, y, 16, 3);
            ctx.fillStyle = '#5ac3e8';
            ctx.fillRect(shift + 3, y + 1, 8, 1);
          }
        }
        break;
      }

      case 'bridge': {
        // Robust Pixel Art Bridge (Walkable Wooden & Stone Deck)
        const bw = obs.width;
        const bh = obs.height;
        const isHorizontal = bw >= bh;

        // Shadow cast on water beneath bridge
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(2, bh - 2, bw - 4, 6);

        // Foundation support beams
        ctx.fillStyle = '#261408';
        ctx.fillRect(0, 0, bw, bh);

        if (isHorizontal) {
          // Horizontal bridge crossing north-south river
          // Vertical planks
          for (let x = 2; x < bw - 2; x += 10) {
            const isAlt = (Math.floor(x / 10) % 2) === 0;
            ctx.fillStyle = isAlt ? '#58341e' : '#683d23';
            ctx.fillRect(x, 4, 8, bh - 8);
            // Wood grain highlight
            ctx.fillStyle = '#7a4a2b';
            ctx.fillRect(x + 1, 6, 6, 2);
            // Iron nails near top and bottom edges
            ctx.fillStyle = '#1c0f06';
            ctx.fillRect(x + 3, 7, 2, 2);
            ctx.fillRect(x + 3, bh - 9, 2, 2);
          }

          // Top protective wooden railing along north riverbank
          ctx.fillStyle = '#381f10';
          ctx.fillRect(0, 0, bw, 6);
          ctx.fillStyle = '#4f2b16';
          ctx.fillRect(0, 1, bw, 3);
          for (let px = 2; px < bw; px += 24) {
            ctx.fillStyle = '#261408';
            ctx.fillRect(px, 0, 6, 8);
            ctx.fillStyle = '#6a3b20';
            ctx.fillRect(px + 1, 0, 4, 6);
          }

          // Bottom protective wooden railing along south riverbank
          ctx.fillStyle = '#381f10';
          ctx.fillRect(0, bh - 6, bw, 6);
          ctx.fillStyle = '#4f2b16';
          ctx.fillRect(0, bh - 5, bw, 3);
          for (let px = 2; px < bw; px += 24) {
            ctx.fillStyle = '#261408';
            ctx.fillRect(px, bh - 8, 6, 8);
            ctx.fillStyle = '#6a3b20';
            ctx.fillRect(px + 1, bh - 7, 4, 6);
          }
        } else {
          // Vertical bridge crossing east-west river
          for (let y = 2; y < bh - 2; y += 10) {
            const isAlt = (Math.floor(y / 10) % 2) === 0;
            ctx.fillStyle = isAlt ? '#58341e' : '#683d23';
            ctx.fillRect(4, y, bw - 8, 8);
            ctx.fillStyle = '#7a4a2b';
            ctx.fillRect(6, y + 1, 2, 6);
            ctx.fillStyle = '#1c0f06';
            ctx.fillRect(7, y + 3, 2, 2);
            ctx.fillRect(bw - 9, y + 3, 2, 2);
          }
          // Left railing
          ctx.fillStyle = '#381f10';
          ctx.fillRect(0, 0, 6, bh);
          ctx.fillStyle = '#4f2b16';
          ctx.fillRect(1, 0, 3, bh);
          // Right railing
          ctx.fillStyle = '#381f10';
          ctx.fillRect(bw - 6, 0, 6, bh);
          ctx.fillStyle = '#4f2b16';
          ctx.fillRect(bw - 5, 0, 3, bh);
        }
        break;
      }

      case 'ruins_pillar': {
        // Ancient Stone Pillar
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(obs.width / 2, obs.height - 4, obs.width / 2, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        P(2, 0, obs.width / s - 4, obs.height / s, '#3e4542');
        P(4, -obs.height / s + 6, obs.width / s - 8, obs.height / s - 4, '#5d6662');
        P(2, -obs.height / s, obs.width / s - 4, 6, '#798580');

        // Glowing magical rune carved into pillar
        const runeGlow = (Math.sin(time * 4) + 1) / 2;
        ctx.fillStyle = `rgba(147, 51, 234, ${0.4 + runeGlow * 0.5})`;
        ctx.fillRect(6 * s, -14 * s, 4 * s, 10 * s);
        break;
      }

      case 'torch': {
        // Wooden torch post
        P(4, 4, 4, 16, '#3d2516');
        P(2, 0, 8, 6, '#5e3a24');
        P(3, 1, 6, 4, '#7a4d31');

        // Animated torch fire
        const flick = Math.sin(time * 20 + obs.x) * 1.5;
        const flick2 = Math.cos(time * 16 + obs.y) * 1;

        P(3 + flick * 0.5, -6, 6, 6, '#d9381e');
        P(4 + flick, -9, 4, 5, '#ff8800');
        P(4 + flick2, -12, 3, 4, '#ffe135');
        P(5, -13, 1, 2, '#ffffff');

        // Warm radial light glow
        const gradient = ctx.createRadialGradient(6 * s, -6 * s, 2, 6 * s, -6 * s, 50);
        gradient.addColorStop(0, 'rgba(255, 170, 40, 0.25)');
        gradient.addColorStop(0.5, 'rgba(255, 120, 20, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(6 * s, -6 * s, 50, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'portal': {
        // Mystical Ancient Gateway / Portal
        const pw = obs.width;
        const ph = obs.height;

        // Archway pillars
        ctx.fillStyle = '#2c332e';
        ctx.fillRect(0, 0, 10, ph);
        ctx.fillRect(pw - 10, 0, 10, ph);
        ctx.fillStyle = '#48544c';
        ctx.fillRect(0, 0, pw, 12);

        // Swirling vortex inside
        const swirlRadius = Math.min(pw, ph) * 0.42;
        const centerX = pw / 2;
        const centerY = ph / 2 + 6;

        for (let ring = 3; ring >= 1; ring--) {
          const r = swirlRadius * (ring / 3);
          const rot = time * (ring * 1.5);
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(rot);

          ctx.fillStyle = ring === 3 ? 'rgba(76, 29, 149, 0.6)' : ring === 2 ? 'rgba(126, 34, 206, 0.8)' : 'rgba(216, 180, 254, 0.95)';
          ctx.beginPath();
          ctx.ellipse(0, 0, r, r * 0.8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Swirling star particles inside portal
        for (let i = 0; i < 6; i++) {
          const pAngle = time * 3 + (i * Math.PI) / 3;
          const dist = 8 + (Math.sin(time * 5 + i) * 8);
          const px = centerX + Math.cos(pAngle) * dist;
          const py = centerY + Math.sin(pAngle) * dist;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
        }
        break;
      }
    }

    ctx.restore();
  }

  // ==========================================
  // COLLECTIBLES
  // ==========================================
  public static drawCollectible(ctx: CanvasRenderingContext2D, item: Collectible, time: number) {
    if (item.collected) return;

    ctx.save();
    const bob = Math.sin(time * 5 + item.bobOffset) * 3;
    ctx.translate(Math.floor(item.x), Math.floor(item.y + bob));
    const s = 2;

    const P = (x: number, y: number, w: number, h: number, col: string) => {
      this.px(ctx, x * s, y * s, w * s, h * s, col);
    };

    // Shadow on ground
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(item.width / 2, item.height / 2 + 10 - bob, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    switch (item.type) {
      case 'coin': {
        // Rotating Gold Coin
        const spin = Math.abs(Math.sin(time * 4 + item.bobOffset));
        const coinW = Math.max(2, Math.floor(6 * spin));
        const ox = 3 - coinW / 2;

        P(ox, -3, coinW, 8, '#b8860b');
        P(ox, -2, coinW, 6, '#ffd700');
        P(ox + 1, -1, Math.max(1, coinW - 2), 4, '#fff385');
        break;
      }

      case 'crystal': {
        // Glowing Mana Crystal
        const glow = (Math.sin(time * 4) + 1) / 2;
        P(2, -6, 4, 12, '#38bdf8');
        P(0, -3, 8, 6, '#0284c7');
        P(3, -5, 2, 10, '#e0f2fe');

        // Sparkle
        ctx.fillStyle = `rgba(186, 230, 253, ${0.4 + glow * 0.4})`;
        ctx.beginPath();
        ctx.arc(4 * s, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'berry': {
        // Red Forest Berries cluster
        P(0, 0, 4, 4, '#c9184a');
        P(3, -2, 4, 4, '#ff4d6d');
        P(-2, 1, 4, 4, '#800f2f');
        // Tiny green leaf
        P(2, -4, 3, 2, '#38b000');
        break;
      }

      case 'potion': {
        // Red Healing Potion
        P(2, -6, 4, 3, '#d4a373'); // Cork
        P(1, -3, 6, 2, '#ccd5ae'); // Glass neck
        P(-1, -1, 10, 9, '#ccd5ae'); // Flask glass
        P(0, 0, 8, 7, '#e63946');  // Red potion liquid
        P(1, 2, 4, 4, '#ff758f');  // Highlight
        P(3, 1, 2, 2, '#ffffff');  // Bubble
        break;
      }

      case 'key': {
        // Ancient Gate Key
        P(0, -6, 6, 6, '#eab308');
        P(1, -5, 4, 4, '#fde047');
        P(2, 0, 2, 8, '#ca8a04');
        P(4, 3, 2, 2, '#ca8a04');
        P(4, 6, 2, 2, '#ca8a04');
        break;
      }
    }

    ctx.restore();
  }

  // ==========================================
  // PARTICLES
  // ==========================================
  public static drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);

    if (p.type === 'damage_text' && p.text) {
      ctx.font = 'bold 12px "Press Start 2P", monospace';
      ctx.fillStyle = '#000000';
      ctx.fillText(p.text, Math.floor(p.x) + 1, Math.floor(p.y) + 1);
      ctx.fillStyle = p.color || '#ff4444';
      ctx.fillText(p.text, Math.floor(p.x), Math.floor(p.y));
    } else if (p.type === 'leaf') {
      ctx.fillStyle = p.color || '#4ade80';
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    }

    ctx.restore();
  }
}
