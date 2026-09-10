/**
 * Web Audio API Sound Synthesizer for 8-bit / 16-bit RPG Retro Sound Effects & Music
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private activeNodes: Set<AudioNode> = new Set();
  private currentBgm: 'menu' | 1 | 2 | 3 | 4 | 5 | 6 | null = null;
  private isBgmPlaying: boolean = false;
  private bgmInterval: number | null = null;

  constructor() {
    try {
      this.isMuted = typeof window !== 'undefined' && localStorage.getItem('foxwood_muted') === 'true';
      const storedVol = typeof window !== 'undefined' ? localStorage.getItem('foxwood_volume') : null;
      if (storedVol !== null) {
        this.volume = parseFloat(storedVol) || 0.8;
      }
    } catch {
      this.isMuted = false;
      this.volume = 0.8;
    }
  }

  private initContext(): AudioContext | null {
    if (this.isMuted) {
      return null;
    }

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx) {
      if (!this.masterGain) {
        this.masterGain = this.ctx.createGain();
        const effectiveGain = this.isMuted ? 0 : this.volume;
        this.masterGain.gain.setValueAtTime(effectiveGain, this.ctx.currentTime);
        this.masterGain.gain.value = effectiveGain;
        this.masterGain.connect(this.ctx.destination);
      }

      if (this.ctx.state === 'suspended' && !this.isMuted) {
        this.ctx.resume().catch(() => {});
      }
    }

    return this.ctx;
  }

  private getMasterNode(): GainNode | null {
    if (this.isMuted) return null;
    const ctx = this.initContext();
    if (!ctx) return null;

    if (!this.masterGain) {
      this.masterGain = ctx.createGain();
      const effectiveGain = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setValueAtTime(effectiveGain, ctx.currentTime);
      this.masterGain.gain.value = effectiveGain;
      this.masterGain.connect(ctx.destination);
    }
    return this.masterGain;
  }

  private registerNode<T extends AudioNode>(node: T): T {
    this.activeNodes.add(node);
    if ('onended' in node) {
      (node as any).onended = () => {
        this.activeNodes.delete(node);
      };
    }
    return node;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('foxwood_muted', muted ? 'true' : 'false');
    } catch {}

    if (muted) {
      // 1. Instantly stop BGM ticker
      this.stopBGM();

      // 2. Clamp master gain to absolute zero immediately
      if (this.masterGain && this.ctx) {
        try {
          this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
          this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
          this.masterGain.gain.value = 0;
        } catch {}
      }

      // 3. Immediately stop and disconnect all active oscillators/sources
      for (const node of this.activeNodes) {
        try {
          if ('stop' in node && typeof (node as any).stop === 'function') {
            (node as any).stop();
          }
          node.disconnect();
        } catch {}
      }
      this.activeNodes.clear();

      // 4. Suspend audio context hardware processing
      if (this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend().catch(() => {});
      }
    } else {
      // Unmute
      if (this.ctx) {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        if (this.masterGain) {
          try {
            this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
            this.masterGain.gain.value = this.volume;
          } catch {}
        }
      }

      if (this.currentBgm) {
        this.startBGM(this.currentBgm);
      }
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('foxwood_volume', this.volume.toString());
    } catch {}

    if (!this.isMuted && this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.gain.value = this.volume;
      } catch {}
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Boss King Slime Sounds
  public playBossRoar() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      // Heavy deep rumble / roar oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(70, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.8);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

      osc.connect(gain);
      gain.connect(master);
      this.registerNode(osc);
      osc.start(now);
      osc.stop(now + 0.85);
    } catch {}
  }

  public playBossSlam() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.45);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc.connect(gain);
      gain.connect(master);
      this.registerNode(osc);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {}
  }

  // --- Sound Effects ---

  public playSwordSlash() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      // White noise buffer for swish
      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.registerNode(ctx.createBufferSource());
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.12);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      noise.start(now);

      // Pitch swoosh tone
      const osc = this.registerNode(ctx.createOscillator());
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
      oscGain.gain.setValueAtTime(0.15, now);
      oscGain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.connect(oscGain);
      oscGain.connect(master);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio fallback safe
    }
  }

  public playHit() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const osc = this.registerNode(ctx.createOscillator());
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(master);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  public playMonsterHurt() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const osc = this.registerNode(ctx.createOscillator());
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(master);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  public playMonsterDefeated() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const freqs = [300, 220, 160, 90];
      freqs.forEach((freq, idx) => {
        const osc = this.registerNode(ctx.createOscillator());
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.12, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.08);
        osc.connect(gain);
        gain.connect(master);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.08);
      });
    } catch {}
  }

  public playPlayerHurt() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const osc = this.registerNode(ctx.createOscillator());
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.2);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(master);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  public playCoin() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      // High bright bell chord
      [987.77, 1318.51].forEach((freq, i) => {
        const osc = this.registerNode(ctx.createOscillator());
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);

        gain.gain.setValueAtTime(0.15, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.005, now + i * 0.07 + 0.15);

        osc.connect(gain);
        gain.connect(master);

        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.15);
      });
    } catch {}
  }

  public playCrystal() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.registerNode(ctx.createOscillator());
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.12, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.005, now + i * 0.05 + 0.18);

        osc.connect(gain);
        gain.connect(master);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.18);
      });
    } catch {}
  }

  public playPotion() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      // Bubbling glug-glug sound
      [330, 440, 554, 660, 880].forEach((freq, i) => {
        const osc = this.registerNode(ctx.createOscillator());
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.15, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.1);

        osc.connect(gain);
        gain.connect(master);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.1);
      });
    } catch {}
  }

  public playLevelComplete() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      // Triumphant RPG level clear fanfare
      const notes = [440, 554.37, 659.25, 880, 880, 1108.73];
      const durations = [0.12, 0.12, 0.12, 0.25, 0.12, 0.4];

      let time = now;
      notes.forEach((freq, i) => {
        const osc = this.registerNode(ctx.createOscillator());
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.18, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + durations[i]);

        osc.connect(gain);
        gain.connect(master);

        osc.start(time);
        osc.stop(time + durations[i]);
        time += durations[i] * 0.85;
      });
    } catch {}
  }

  public playGameOver() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      // Sad descending melody
      const notes = [392.0, 370.0, 349.23, 311.13, 261.63];
      let time = now;
      notes.forEach((freq) => {
        const osc = this.registerNode(ctx.createOscillator());
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.16, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.28);

        osc.connect(gain);
        gain.connect(master);

        osc.start(time);
        osc.stop(time + 0.3);
        time += 0.22;
      });
    } catch {}
  }

  public playVictory() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51];
      let time = now;
      notes.forEach((freq) => {
        const osc = this.registerNode(ctx.createOscillator());
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

        osc.connect(gain);
        gain.connect(master);

        osc.start(time);
        osc.stop(time + 0.32);
        time += 0.18;
      });
    } catch {}
  }

  public playUiClick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const osc = this.registerNode(ctx.createOscillator());
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.05);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  // --- Dynamic Procedural RPG Background Music ---

  public startBGM(track: 'menu' | 1 | 2 | 3 | 4 | 5 | 6) {
    this.currentBgm = track;
    if (this.isMuted) return;
    if (this.isBgmPlaying && this.currentBgm === track && this.bgmInterval !== null) return;

    this.stopBGM();

    const ctx = this.initContext();
    const master = this.getMasterNode();
    if (!ctx || !master) return;

    this.isBgmPlaying = true;

    // Track melodies:
    // Level 1 / Menu: Peaceful forest in G major / E minor
    const l1Notes = [
      392.0, 440.0, 493.88, 587.33, 493.88, 440.0, 392.0, 329.63, 349.23, 392.0, 440.0, 523.25,
      440.0, 392.0, 329.63, 293.66,
    ];

    // Level 2: Dark eerie pulse in D minor
    const l2Notes = [
      293.66, 311.13, 349.23, 293.66, 261.63, 293.66, 349.23, 392.0, 440.0, 392.0, 349.23, 311.13,
      293.66, 220.0, 246.94, 261.63,
    ];

    // Level 3: Swamp / mysterious mist hollows (pentatonic minor)
    const l3Notes = [
      261.63, 311.13, 349.23, 392.0, 466.16, 392.0, 349.23, 311.13,
      293.66, 349.23, 392.0, 440.0, 523.25, 440.0, 392.0, 349.23,
    ];

    // Level 4: Volcanic magma chasm (fast, chromatic drive)
    const l4Notes = [
      220.0, 246.94, 261.63, 329.63, 311.13, 261.63, 246.94, 220.0,
      329.63, 349.23, 392.0, 440.0, 415.3, 392.0, 329.63, 293.66,
    ];

    // Level 5: Shadow citadel (gothic cadence)
    const l5Notes = [
      196.0, 246.94, 293.66, 392.0, 369.99, 293.66, 246.94, 196.0,
      220.0, 261.63, 329.63, 440.0, 392.0, 329.63, 261.63, 220.0,
    ];

    // Level 6: Void Core Sanctuary (heroic climactic boss theme)
    const l6Notes = [
      293.66, 349.23, 440.0, 587.33, 523.25, 440.0, 493.88, 587.33,
      659.25, 587.33, 523.25, 440.0, 392.0, 440.0, 493.88, 587.33,
    ];

    const menuNotes = [329.63, 392.0, 493.88, 587.33, 659.25, 587.33, 493.88, 392.0];

    let melody = menuNotes;
    let tempo = 360;
    let waveType: OscillatorType = 'triangle';

    if (track === 'menu') {
      melody = menuNotes;
      tempo = 360;
      waveType = 'triangle';
    } else if (track === 1) {
      melody = l1Notes;
      tempo = 340;
      waveType = 'triangle';
    } else if (track === 2) {
      melody = l2Notes;
      tempo = 270;
      waveType = 'sawtooth';
    } else if (track === 3) {
      melody = l3Notes;
      tempo = 310;
      waveType = 'triangle';
    } else if (track === 4) {
      melody = l4Notes;
      tempo = 240;
      waveType = 'sawtooth';
    } else if (track === 5) {
      melody = l5Notes;
      tempo = 280;
      waveType = 'square';
    } else if (track === 6) {
      melody = l6Notes;
      tempo = 230;
      waveType = 'sawtooth';
    }

    let step = 0;

    const tick = () => {
      if (!this.isBgmPlaying || !this.ctx || this.isMuted) return;
      const currentMaster = this.getMasterNode();
      if (!currentMaster) return;

      const now = this.ctx.currentTime;
      const freq = melody[step % melody.length];

      // Lead melodic note
      const osc = this.registerNode(this.ctx.createOscillator());
      const gain = this.ctx.createGain();
      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, now);

      const vol = track === 1 || track === 'menu' ? 0.06 : 0.045;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (tempo / 1000) * 0.9);

      // Low pass filter for soft fantasy feel
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(track === 1 || track === 'menu' ? 1400 : 1000, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(currentMaster);

      osc.start(now);
      osc.stop(now + tempo / 1000);

      // Bass note on every 4th step
      if (step % 4 === 0) {
        const bassOsc = this.registerNode(this.ctx.createOscillator());
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(freq / 2, now);
        bassGain.gain.setValueAtTime(0.08, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + (tempo / 1000) * 3);
        bassOsc.connect(bassGain);
        bassGain.connect(currentMaster);
        bassOsc.start(now);
        bassOsc.stop(now + (tempo / 1000) * 3);
      }

      step++;
    };

    tick();
    this.bgmInterval = window.setInterval(tick, tempo);
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const sound = new SoundSystem();
