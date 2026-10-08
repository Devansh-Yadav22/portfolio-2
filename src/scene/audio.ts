// Web Audio synthesizer for ambient pentatonic hex resonance
// Off by default. Session-only memory.

class AudioManager {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private delayNode: DelayNode | null = null;
  private feedbackNode: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private listeners: Set<(enabled: boolean) => void> = new Set();

  // D minor pentatonic scale frequencies (D3 to D5)
  private readonly notes: number[] = [
    146.83, // D3
    174.61, // F3
    196.00, // G3
    220.00, // A3
    261.63, // C4
    293.66, // D4
    349.23, // F4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
  ];

  constructor() {
    this.isEnabled = false;
  }

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.04, this.ctx.currentTime); // very soft
      this.masterGain.connect(this.ctx.destination);

      // Simple delay line with feedback for gentle acoustic tail
      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.24, this.ctx.currentTime);

      this.feedbackNode = this.ctx.createGain();
      this.feedbackNode.gain.setValueAtTime(0.25, this.ctx.currentTime);

      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);

      this.delayNode.connect(delayFilter);
      delayFilter.connect(this.feedbackNode);
      this.feedbackNode.connect(this.delayNode);
      this.feedbackNode.connect(this.masterGain);
    } catch {
      // Audio context not available or disabled
    }
  }

  public isSoundOn(): boolean {
    return this.isEnabled;
  }

  public setSound(enabled: boolean): boolean {
    this.isEnabled = enabled;
    if (this.isEnabled) {
      this.initContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }
    this.notify();
    return this.isEnabled;
  }

  public toggleSound(): boolean {
    return this.setSound(!this.isEnabled);
  }

  public subscribe(cb: (enabled: boolean) => void): () => void {
    this.listeners.add(cb);
    cb(this.isEnabled);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isEnabled));
  }

  /**
   * Play a subtle resonance tone when hovering active or pulsing cells
   */
  public playHexTone(index?: number) {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const noteIdx = index !== undefined 
      ? Math.abs(index) % this.notes.length 
      : Math.floor(Math.random() * this.notes.length);
    const freq = this.notes[noteIdx];

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm low-pass
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);

    // Gentle attack and exponential decay
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.06, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.00001, now + 0.85);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    if (this.delayNode) {
      noteGain.connect(this.delayNode);
    }

    osc.start(now);
    osc.stop(now + 0.9);
  }
}

export const audioManager = new AudioManager();
