/**
 * Procedural Web Audio API Soundscape & UI Sound Effects Engine for Nebula Deep Focus Environment.
 */

class AmbientAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.volume = 0.3;
    this.masterGain = null;
    this.droneOsc = null;
    this.droneOsc2 = null;
    this.noiseNode = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleAudio() {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.1);
      if (!this.isMuted && !this.droneOsc) {
        this.startCosmicDrone();
      }
    }
    return !this.isMuted;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  // 432Hz Deep Cosmic Focus Drone
  startCosmicDrone() {
    if (!this.ctx || !this.masterGain) return;

    // Main 432Hz sine oscillator
    this.droneOsc = this.ctx.createOscillator();
    this.droneOsc.type = 'sine';
    this.droneOsc.frequency.value = 108; // Sub-harmonic of 432Hz (108Hz)

    // Detuned second oscillator for binaural beat
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.value = 111; // 3Hz binaural theta wave gap

    const droneGain = this.ctx.createGain();
    droneGain.gain.value = 0.15;

    // Lowpass Filter for soft warm ambient feel
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 250;

    this.droneOsc.connect(droneGain);
    this.droneOsc2.connect(droneGain);
    droneGain.connect(filter);
    filter.connect(this.masterGain);

    this.droneOsc.start();
    this.droneOsc2.start();
  }

  // Organic UI Sound Effect: Node Created Chime
  playNodeCreatedSound() {
    if (this.isMuted || !this.ctx) return;
    this.init();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, this.ctx.currentTime + 0.15); // C6

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  // Organic UI Sound Effect: Tether Connected Pulse
  playTetherSound() {
    if (this.isMuted || !this.ctx) return;
    this.init();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime); // E5
    osc.frequency.exponentialRampToValueAtTime(880.00, this.ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Organic UI Sound Effect: Thought Delete Dissolve
  playDeleteSound() {
    if (this.isMuted || !this.ctx) return;
    this.init();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(329.63, this.ctx.currentTime); // E4
    osc.frequency.exponentialRampToValueAtTime(110.00, this.ctx.currentTime + 0.2); // A2

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }
}

export const ambientAudio = new AmbientAudioEngine();
