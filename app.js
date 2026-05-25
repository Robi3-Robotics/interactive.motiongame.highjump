/* ==========================================================================
   ApexReach // High-Reach Jump Tracker Logic
   Author: Antigravity AI Coding Assistant (Google DeepMind Team)
   Core Architecture: Pure JS (ES Modules) + Web Audio + MediaPipe Pose
   ========================================================================== */

// --- 1. Synthesizer for Local Audio Feedback (Web Audio API) ---
class ApexAudioSynth {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported on this browser.", e);
    }
  }

  resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Countdown short tick
  playTick() {
    this.resume();
    if (!this.ctx || this.muted) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Calibration completion chime (Cyber-Synth Triad Chord)
  playChime() {
    this.resume();
    if (!this.ctx || this.muted) return;
    
    const notes = [440, 554.37, 659.25, 880]; // A major triad
    const now = this.ctx.currentTime;
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.04 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.8);
    });
  }

  // Jump takeoff swoop
  playJump() {
    this.resume();
    if (!this.ctx || this.muted) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.25);
    
    // Lowpass filter for smooth sweep
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Hit peak height sound (Sleek high pitch ping)
  playPeak() {
    this.resume();
    if (!this.ctx || this.muted) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // PB broken celebratory arpeggiator cascade
  playRecord() {
    this.resume();
    if (!this.ctx || this.muted) return;
    
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00]; // C major arpeggio
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const delay = this.ctx.createDelay();
      const feedback = this.ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.08 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
      
      delay.delayTime.value = 0.15;
      feedback.gain.value = 0.3;
      
      osc.connect(gain);
      gain.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      
      gain.connect(this.ctx.destination);
      delay.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + idx * 0.08 + 0.5);
    });
  }

  // Reset metrics pitch sweep
  playReset() {
    this.resume();
    if (!this.ctx || this.muted) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }
}

const audioSynth = new ApexAudioSynth();


// --- 2. HTML5 Canvas Glowing Particle System ---
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = (Math.random() - 0.6) * 12 - 2; // general upward blast
    this.radius = Math.random() * 4 + 2;
    this.color = color;
    this.alpha = 1.0;
    this.decay = Math.random() * 0.015 + 0.015;
    this.gravity = 0.25;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity; // falls down over time
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  spawnBurst(x, y, color, count = 60) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    this.particles.forEach(p => p.draw(ctx));
  }

  clear() {
    this.particles = [];
  }
}

const particleSystem = new ParticleSystem();


// --- 3. Main Application State ---
const state = {
  // Measurement
  units: 'cm', // 'cm' or 'in'
  
  // Calibration status
  isCalibrated: false,
  calibrationLocked: false,
  showCalibrationLines: true,
  calibrationCardHidden: false,
  isDragging: null,        // 'y1m', 'y1_5m', 'y2m' or null
  
  // Calibration Y Coordinates (pixels, relative to canvas height)
  y1m: null,               // 1.0m line
  y1_5m: null,             // 1.5m line
  y2m: null,               // 2.0m line
  
  // Player Focus Bounding Box (ROI)
  useROI: false,
  roi: null,               // { x, y, width, height }
  roiDragging: null,       // 'move', 'resize', or null
  roiDragOffset: null,     // offset inside the crop box on click
  
  // Game Play Session
  isJumpingSession: false,  // active gameplay session indicator
  sessionHighestReach: 0,   // stores absolute peak reach during active session
  
  // Calibrated results (pixels)
  scaleFactor: null,     // pixels per cm/inch
  floorY: null,          // baseline floor y coordinate
  standingReachVal: 0,   // standing reach fallback
  
  // Tracking
  jumpState: 'STANDING', // 'STANDING', 'JUMPING', 'PEAK', 'LANDED'
  currentReachVal: null,
  currentLeapVal: null,
  
  // Records
  peakReachVal: 0,
  peakLeapVal: 0,
  personalBestReach: 0,
  personalBestLeap: 0,
  jumpHistory: [], // history log for multi-player games
  
  // Canvas tracking
  activeFingertipX: null,
  activeFingertipY: null,
  lastDrawnPeakY: null,
  trailPoints: [] // trajectories for trailing plots
};


// --- 4. DOM Elements Lookup ---
const el = {
  video: document.getElementById('video-source'),
  canvas: document.getElementById('canvas-hud'),
  unitCm: document.getElementById('unit-cm'),
  unitIn: document.getElementById('unit-in'),
  btnApplyCalibration: document.getElementById('btn-apply-calibration'),
  chkShowLines: document.getElementById('chk-show-lines'),
  btnToggleCalWin: document.getElementById('btn-toggle-cal-win'),
  calibrationCardBody: document.getElementById('calibration-card-body'),
  btnResetPBs: document.getElementById('btn-reset-records'),
  btnAudioTest: document.getElementById('btn-audio-test'),
  hudStatusText: document.getElementById('hud-status-text'),
  
  // Stats Panel Displays
  statLiveReach: document.getElementById('stat-live-reach'),
  statLiveLeap: document.getElementById('stat-live-leap'),
  valCalibratedFloor: document.getElementById('val-calibrated-floor'),
  recordMaxReach: document.getElementById('record-max-reach'),
  recordMaxLeap: document.getElementById('record-max-leap'),
  
  // Units labels
  unitLive: document.getElementById('unit-label-live'),
  unitLeap: document.getElementById('unit-label-leap'),
  unitRecReach: document.getElementById('unit-label-record-reach'),
  unitRecLeap: document.getElementById('unit-label-record-leap'),
  
  // Player Focus Elements
  roiFull: document.getElementById('roi-full'),
  roiFocus: document.getElementById('roi-focus'),
  roiHint: document.getElementById('roi-hint'),

  // Jump Leaderboard & Log
  btnClearHistory: document.getElementById('btn-clear-history'),
  jumpHistoryList: document.getElementById('jump-history-list'),

  // Game Session Toggles
  btnJumpSession: document.getElementById('btn-jump-session'),
  valSessionHighest: document.getElementById('val-session-highest')
};

// Canvas drawing context
const ctx = el.canvas.getContext('2d');

// Offscreen canvas for Region of Interest (ROI) cropping
const offscreenCanvas = document.createElement('canvas');
const offscreenCtx = offscreenCanvas.getContext('2d');


// --- 5. Unit Conversion Helpers ---
const cmToIn = (val) => val / 2.54;
const inToCm = (val) => val * 2.54;

const formatVal = (val, dec = 1) => {
  if (val === null || isNaN(val) || val === 0) return '--';
  return val.toFixed(dec);
};

// Update active system unit variables
function setUnitSystem(unit) {
  if (state.units === unit) return;
  
  const prevUnit = state.units;
  state.units = unit;
  
  // Save active style highlight
  if (unit === 'cm') {
    el.unitCm.classList.add('active');
    el.unitIn.classList.remove('active');
  } else {
    el.unitIn.classList.add('active');
    el.unitCm.classList.remove('active');
  }

  // Update dynamic metric suffixes
  const unitText = unit === 'cm' ? 'cm' : 'in';
  el.unitLive.textContent = unitText;
  el.unitLeap.textContent = unitText;
  el.unitRecReach.textContent = unitText;
  el.unitRecLeap.textContent = unitText;

  // Convert existing calibrated values if valid
  if (state.isCalibrated) {
    if (unit === 'cm') {
      // Converted from Inch to Cm
      state.scaleFactor = state.scaleFactor / 2.54; // px per inch / 2.54 = px per cm
    } else {
      // Converted from Cm to Inch
      state.scaleFactor = state.scaleFactor * 2.54; // px per cm * 2.54 = px per inch
    }
    
    // Rerender sub values
    el.valCalibratedFloor.textContent = `Y: ${Math.round(state.floorY)}px`;
  }

  // Convert active session records
  if (state.peakReachVal > 0) {
    state.peakReachVal = prevUnit === 'cm' ? cmToIn(state.peakReachVal) : inToCm(state.peakReachVal);
  }
  if (state.peakLeapVal > 0) {
    state.peakLeapVal = prevUnit === 'cm' ? cmToIn(state.peakLeapVal) : inToCm(state.peakLeapVal);
  }
  if (state.personalBestReach > 0) {
    state.personalBestReach = prevUnit === 'cm' ? cmToIn(state.personalBestReach) : inToCm(state.personalBestReach);
  }
  if (state.personalBestLeap > 0) {
    state.personalBestLeap = prevUnit === 'cm' ? cmToIn(state.personalBestLeap) : inToCm(state.personalBestLeap);
  }

  // Convert active jumping session peak reach
  if (state.sessionHighestReach > 0) {
    state.sessionHighestReach = prevUnit === 'cm' ? cmToIn(state.sessionHighestReach) : inToCm(state.sessionHighestReach);
  }

  // Update session highest reach display
  if (state.isJumpingSession && state.sessionHighestReach > 0) {
    el.valSessionHighest.textContent = `${formatVal(state.sessionHighestReach)} ${state.units}`;
  } else {
    el.valSessionHighest.textContent = `-- ${state.units}`;
  }

  updateDashboardUI();
  updateJumpHistoryUI();
}


// --- 6. Local Storage Records persistence ---
function loadRecords() {
  const pbReach = localStorage.getItem('apex_pb_reach_cm');
  const pbLeap = localStorage.getItem('apex_pb_leap_cm');

  if (pbReach) {
    const reachCm = parseFloat(pbReach);
    state.personalBestReach = state.units === 'cm' ? reachCm : cmToIn(reachCm);
  }
  if (pbLeap) {
    const leapCm = parseFloat(pbLeap);
    state.personalBestLeap = state.units === 'cm' ? leapCm : cmToIn(leapCm);
  }
  
  updateDashboardUI();
}

function savePersonalBests() {
  // Always save locally in CM for standard base structure
  const reachCm = state.units === 'cm' ? state.personalBestReach : inToCm(state.personalBestReach);
  localStorage.setItem('apex_pb_reach_cm', reachCm);
}

function resetRecords() {
  audioSynth.playReset();
  state.peakReachVal = 0;
  state.peakLeapVal = 0;
  state.personalBestReach = 0;
  state.personalBestLeap = 0;
  state.trailPoints = [];
  state.lastDrawnPeakY = null;
  
  localStorage.removeItem('apex_pb_reach_cm');
  localStorage.removeItem('apex_pb_leap_cm');
  
  updateDashboardUI();
  flashScreen('yellow');
}

function saveJumpHistory() {
  localStorage.setItem('apex_jump_history_game', JSON.stringify(state.jumpHistory));
}

function loadJumpHistory() {
  const saved = localStorage.getItem('apex_jump_history_game');
  if (saved) {
    try {
      state.jumpHistory = JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing jump history:", e);
      state.jumpHistory = [];
    }
  } else {
    state.jumpHistory = [];
  }
  updateJumpHistoryUI();
}

function updateJumpHistoryUI() {
  if (!el.jumpHistoryList) return;
  
  if (state.jumpHistory.length === 0) {
    el.jumpHistoryList.innerHTML = `
      <tr>
        <td colspan="3" style="padding: 1.5rem 0; text-align: center; color: var(--text-secondary); font-style: italic;">
          No jumps logged yet. Jump to begin!
        </td>
      </tr>
    `;
    return;
  }
  
  el.jumpHistoryList.innerHTML = state.jumpHistory.map((jump, idx) => {
    // Determine unit presentation (converting base CM reach to active display system units)
    const reachVal = state.units === 'cm' ? jump.reach : cmToIn(jump.reach);
    const rowClass = idx === 0 ? 'class="new-jump-row"' : '';
    
    return `
      <tr ${rowClass}>
        <td style="padding: 0.6rem 0.25rem; font-weight: bold; color: var(--text-secondary);">#${jump.jumpNum}</td>
        <td style="padding: 0.6rem 0.25rem; text-align: right; font-weight: bold; color: var(--accent-cyan);" class="text-glow-cyan">
          ${reachVal.toFixed(1)} ${state.units}
        </td>
        <td style="padding: 0.6rem 0.25rem; text-align: right; color: var(--text-secondary); font-size: 0.75rem;">${jump.timestamp}</td>
      </tr>
    `;
  }).join('');
}

function clearJumpHistory() {
  audioSynth.playReset();
  state.jumpHistory = [];
  localStorage.removeItem('apex_jump_history_game');
  updateJumpHistoryUI();
  flashScreen('yellow');
}


// --- 7. View Update Renderer ---
function updateDashboardUI() {
  el.statLiveReach.textContent = formatVal(state.currentReachVal);
  el.statLiveLeap.textContent = formatVal(state.isJumpingSession ? state.sessionHighestReach : state.peakReachVal);
  
  el.recordMaxReach.textContent = formatVal(state.peakReachVal);
  el.recordMaxLeap.textContent = formatVal(state.personalBestReach);
  
  // Set glow indicators based on session record heights
  el.recordMaxReach.className = state.peakReachVal >= state.personalBestReach && state.personalBestReach > 0 
    ? 'record-value text-glow-cyan' 
    : 'record-value';
  el.recordMaxLeap.className = 'record-value text-glow-pink';
}


// --- 8. Flash Screen Neon Highlights ---
function flashScreen(color) {
  const flashClass = color === 'cyan' ? 'screen-flash-cyan' : color === 'pink' ? 'screen-flash-pink' : 'screen-flash-cyan';
  document.body.classList.remove('screen-flash-cyan', 'screen-flash-pink');
  void document.body.offsetWidth; // trigger reflow
  document.body.classList.add(flashClass);
  setTimeout(() => {
    document.body.classList.remove('screen-flash-cyan', 'screen-flash-pink');
  }, 600);
}


// --- 9. Collapsible Manual 3-Line Calibration Controller ---
function applyCalibration() {
  const h = el.canvas.height || 720;
  if (state.y1m === null) state.y1m = h * 0.65;
  if (state.y1_5m === null) state.y1_5m = h * 0.45;
  if (state.y2m === null) state.y2m = h * 0.25;

  // The distance between 2.0m and 1.0m is 1 meter physically.
  // Y coordinates: smaller Y = higher up. So y2m is smaller than y1m.
  const scaleFactorMeter = state.y1m - state.y2m;
  
  if (scaleFactorMeter <= 20) {
    alert("Calibration Error: Distance between 1m and 2m lines is too small. Please position them correctly.");
    return false;
  }

  // Pixels per centimeter
  state.scaleFactor = scaleFactorMeter / 100;
  
  // Floor Y position (0m) corresponds to 1m Y plus 1 meter in pixels
  state.floorY = state.y1m + scaleFactorMeter * 1.0;

  // Lock calibration states
  state.isCalibrated = true;
  state.calibrationLocked = true;
  
  // Update HUD text
  el.hudStatusText.textContent = "CALIBRATION LOCKED // READY TO JUMP";
  
  // Rerender calibrated stats
  el.valCalibratedFloor.textContent = `Y: ${Math.round(state.floorY)}px`;
  
  savePersonalBests();
  updateDashboardUI();
  flashScreen('cyan');
  return true;
}

function toggleCalibrationLock() {
  audioSynth.resume();
  if (!state.calibrationLocked) {
    // LOCK
    if (applyCalibration()) {
      el.btnApplyCalibration.style.background = "linear-gradient(135deg, #ffe600, #ffb300)";
      el.btnApplyCalibration.querySelector('.btn-text').textContent = "Unlock Calibration";
      el.btnApplyCalibration.querySelector('.btn-icon').textContent = "🔓";
    }
  } else {
    // UNLOCK
    state.calibrationLocked = false;
    state.isCalibrated = false; // suspend tracking active reach
    el.btnApplyCalibration.style.background = "linear-gradient(135deg, #00b0ff, var(--accent-cyan))";
    el.btnApplyCalibration.querySelector('.btn-text').textContent = "Lock Calibration";
    el.btnApplyCalibration.querySelector('.btn-icon').textContent = "🔒";
    el.hudStatusText.textContent = "CALIBRATION UNLOCKED // ADJUST LINES";
    audioSynth.playReset();
  }
}

function setROIMode(focusMode) {
  if (focusMode === 'full') {
    state.useROI = false;
    state.roi = null;
    el.roiFull.classList.add('active');
    el.roiFocus.classList.remove('active');
    el.roiHint.textContent = "Tracking all motions in the full camera feed. Ideal for single-athlete setups.";
  } else {
    state.useROI = true;
    el.roiFocus.classList.add('active');
    el.roiFull.classList.remove('active');
    el.roiHint.textContent = "Focusing webcam sensors on the cropped bounding box. Drag and resize the box to target a player.";
    
    // Initialize default crop box in the center of the viewport
    const w = el.canvas.width || 1280;
    const h = el.canvas.height || 720;
    state.roi = {
      x: Math.round(w * 0.35),
      y: Math.round(h * 0.15),
      width: Math.round(w * 0.30),
      height: Math.round(h * 0.70)
    };
  }
}

function toggleJumpingSession() {
  audioSynth.resume();
  if (!state.isCalibrated) {
    alert("Please calibrate the system first by locking the 3-line calibration console before starting a jump challenge.");
    return;
  }

  if (!state.isJumpingSession) {
    // START JUMPING (Toggle ON)
    state.isJumpingSession = true;
    state.sessionHighestReach = 0;
    state.lastDrawnPeakY = null; // Clear previous peak line on canvas
    
    // Update UI button state
    el.btnJumpSession.style.background = "linear-gradient(135deg, #ff3333, #ff0055)";
    el.btnJumpSession.querySelector('.btn-text').textContent = "Stop & Log Jump";
    el.btnJumpSession.querySelector('.btn-icon').textContent = "🛑";
    el.btnJumpSession.classList.add('pulse-button'); // add custom class for flashing
    
    el.valSessionHighest.textContent = `-- ${state.units}`;
    el.hudStatusText.textContent = "SESSION ACTIVE // JUMP NOW!";
    audioSynth.playJump();
    flashScreen('pink');
  } else {
    // STOP JUMPING (Toggle OFF)
    state.isJumpingSession = false;
    
    // Update UI button state
    el.btnJumpSession.style.background = "linear-gradient(135deg, #ff007f, #ff00cc)";
    el.btnJumpSession.querySelector('.btn-text').textContent = "Start Jumping";
    el.btnJumpSession.querySelector('.btn-icon').textContent = "🚀";
    el.btnJumpSession.classList.remove('pulse-button');
    
    el.hudStatusText.textContent = "SESSION ENDED // RECORD LOGGED";

    if (state.sessionHighestReach > 0) {
      // Record the highest reach in the game history log (Always save in CM internally)
      const reachCm = state.units === 'cm' ? state.sessionHighestReach : inToCm(state.sessionHighestReach);
      
      // Log to session history
      const jumpRecord = {
        id: Date.now(),
        jumpNum: state.jumpHistory.length + 1,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        reach: reachCm
      };
      state.jumpHistory.unshift(jumpRecord);
      saveJumpHistory();
      updateJumpHistoryUI();
      
      // Check personal bests
      const rawPeakReach = state.sessionHighestReach;
      let brokePB = false;
      if (rawPeakReach > state.personalBestReach) {
        state.personalBestReach = rawPeakReach;
        brokePB = true;
      }

      state.peakReachVal = Math.max(state.peakReachVal, rawPeakReach);

      if (brokePB) {
        audioSynth.playRecord();
        flashScreen('cyan');
        // Spawn particle burst at fingertip position
        particleSystem.spawnBurst(state.activeFingertipX || (el.canvas.width * 0.5), state.lastDrawnPeakY || (el.canvas.height * 0.3), state.units === 'cm' ? '#ff007f' : '#00f0ff', 80);
        el.hudStatusText.textContent = "NEW PERSONAL BEST! OUTSTANDING!";
        savePersonalBests();
      } else {
        audioSynth.playPeak();
        flashScreen('cyan');
      }
      
      updateDashboardUI();
    } else {
      alert("No reach recorded during session. Make sure you are in camera view.");
    }
  }
}


// --- 10. Core MediaPipe Frame Processing Loop ---
function onPoseResults(results) {
  // 1. Establish high-performance canvas sizing relative to video stream
  if (el.video.videoWidth) {
    if (el.canvas.width !== el.video.videoWidth || el.canvas.height !== el.video.videoHeight) {
      el.canvas.width = el.video.videoWidth;
      el.canvas.height = el.video.videoHeight;
    }
  } else if (results.image) {
    if (el.canvas.width !== results.image.width || el.canvas.height !== results.image.height) {
      el.canvas.width = results.image.width;
      el.canvas.height = results.image.height;
    }
  }

  ctx.save();
  ctx.clearRect(0, 0, el.canvas.width, el.canvas.height);

  // 2. Render Mirrored Camera Feed Frame (Using el.video directly so the full feed stays visible in ROI crop mode)
  ctx.translate(el.canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(el.video, 0, 0, el.canvas.width, el.canvas.height);
  ctx.restore(); // return to normal coordinate space for texts

  // 3. Process Skeletal Coordinate Points
  if (results.poseLandmarks) {
    const l = results.poseLandmarks;
    
    // Format coordinate indexes
    const leftHeel = l[29], rightHeel = l[30];
    const leftAnkle = l[27], rightAnkle = l[28];
    const leftIndex = l[19], rightIndex = l[20];
    const leftWrist = l[15], rightWrist = l[16];
    const leftElbow = l[13], rightElbow = l[14];
    const leftShoulder = l[11], rightShoulder = l[12];
    const leftHip = l[23], rightHip = l[24];
    const nose = l[0];
    const leftEye = l[1], rightEye = l[2];

    // Reverse map coordinates from cropped frame if Focus mode is active
    const getScreenCoord = (landmark) => {
      if (state.useROI && state.roi) {
        const x_full = state.roi.x + landmark.x * state.roi.width;
        const y_full = state.roi.y + landmark.y * state.roi.height;
        return {
          x: el.canvas.width - x_full, // Mirror x coordinate on screen
          y: y_full,
          z: landmark.z,
          v: landmark.visibility
        };
      } else {
        return {
          x: (1.0 - landmark.x) * el.canvas.width,
          y: landmark.y * el.canvas.height,
          z: landmark.z,
          v: landmark.visibility
        };
      }
    };

    const lIndexSc = getScreenCoord(leftIndex);
    const rIndexSc = getScreenCoord(rightIndex);

    // Determine the highest visible hand fingertip
    let activeFingertip = null;
    if (lIndexSc.v > 0.5 && rIndexSc.v > 0.5) {
      activeFingertip = lIndexSc.y < rIndexSc.y ? lIndexSc : rIndexSc; // smaller y is higher
    } else if (lIndexSc.v > 0.5) {
      activeFingertip = lIndexSc;
    } else if (rIndexSc.v > 0.5) {
      activeFingertip = rIndexSc;
    }

    if (activeFingertip) {
      state.activeFingertipX = activeFingertip.x;
      state.activeFingertipY = activeFingertip.y;
    }

    // Draw Skeletal Overlay
    drawSkeleton(ctx, l, getScreenCoord);

    // --- 4. Main Jump Analysis ---
    if (state.isCalibrated && activeFingertip) {
      // Calculate fingertip distance relative to floor baseline
      const currentReachPx = state.floorY - activeFingertip.y;
      state.currentReachVal = Math.max(0, currentReachPx / state.scaleFactor);
      
      // Net reach represented
      state.currentLeapVal = state.isJumpingSession ? state.sessionHighestReach : state.peakReachVal;

      // Track the live peak reach dynamically if a gameplay session is active
      if (state.isJumpingSession) {
        if (state.currentReachVal > state.sessionHighestReach) {
          state.sessionHighestReach = state.currentReachVal;
          state.lastDrawnPeakY = activeFingertip.y; // render the highest peak line in real-time!
          el.valSessionHighest.textContent = `${formatVal(state.sessionHighestReach)} ${state.units}`;
        }
      }
    } else {
      state.currentReachVal = 0;
      state.currentLeapVal = 0;
    }
  }

  // 5. Draw Canvas Overlay Graphics (Heights, HUD metrics, Rulers)
  drawHUDOverlays();

  // 6. Draw dynamic burst particles
  particleSystem.update();
  particleSystem.draw(ctx);

  ctx.restore();
}


// --- 11. Custom Skeletal Drawer ---
function drawSkeleton(ctx, landmarks, getScreenCoord) {
  const bones = [
    [11, 12], // shoulders
    [11, 13], [13, 15], // left arm
    [12, 14], [14, 16], // right arm
    [11, 23], [12, 24], [23, 24], // torso/hips
    [23, 25], [25, 27], [27, 29], // left leg/heel
    [24, 26], [26, 28], [28, 30]  // right leg/heel
  ];

  // Draw bone lines with clean neon cyan drop glows
  ctx.save();
  ctx.lineWidth = 4;
  ctx.shadowBlur = 8;
  ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';

  bones.forEach(([i, j]) => {
    const ptA = getScreenCoord(landmarks[i]);
    const ptB = getScreenCoord(landmarks[j]);

    if (ptA.v > 0.45 && ptB.v > 0.45) {
      ctx.beginPath();
      ctx.moveTo(ptA.x, ptA.y);
      ctx.lineTo(ptB.x, ptB.y);
      ctx.stroke();
    }
  });
  ctx.restore();

  // Draw critical point joints as colorful glowing nodes
  ctx.save();
  const joints = [15, 16, 19, 20, 23, 24, 29, 30]; // wrists, fingertips, hips, heels
  joints.forEach(idx => {
    const pt = getScreenCoord(landmarks[idx]);
    if (pt.v > 0.55) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      
      if (idx === 19 || idx === 20) {
        // Fingertips (glowing yellow)
        ctx.fillStyle = '#ffe600';
        ctx.shadowColor = '#ffe600';
      } else if (idx === 29 || idx === 30) {
        // Heels (glowing green)
        ctx.fillStyle = '#00ff88';
        ctx.shadowColor = '#00ff88';
      } else {
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
      }
      
      ctx.shadowBlur = 10;
      ctx.fill();
    }
  });
  ctx.restore();
}


// --- 12. Graphic Rulers and Height Indicators ---
function drawHUDOverlays() {
  const w = el.canvas.width;
  const h = el.canvas.height;

  // Initialize manual lines Y coordinates if they are null
  if (state.y1m === null) state.y1m = h * 0.65;
  if (state.y1_5m === null) state.y1_5m = h * 0.45;
  if (state.y2m === null) state.y2m = h * 0.25;

  // 1. Draw 3-Line Manual Calibration guides if enabled
  if (state.showCalibrationLines) {
    const dragHint = !state.calibrationLocked ? " (DRAG TO ALIGN)" : "";

    // 2.0m Calibration Line (Neon Pink)
    ctx.save();
    ctx.strokeStyle = '#ff007f';
    ctx.lineWidth = state.calibrationLocked ? 1.5 : 3;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff007f';
    if (state.calibrationLocked) ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, state.y2m);
    ctx.lineTo(w, state.y2m);
    ctx.stroke();

    ctx.fillStyle = '#ff007f';
    ctx.font = "bold 12px 'Outfit'";
    ctx.fillText(`2.0m PHYSICAL HEIGHT${dragHint}`, 15, state.y2m - 8);
    ctx.restore();

    // 1.5m Calibration Line (Neon Yellow)
    ctx.save();
    ctx.strokeStyle = '#ffe600';
    ctx.lineWidth = state.calibrationLocked ? 1.5 : 3;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ffe600';
    if (state.calibrationLocked) ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, state.y1_5m);
    ctx.lineTo(w, state.y1_5m);
    ctx.stroke();

    ctx.fillStyle = '#ffe600';
    ctx.font = "bold 12px 'Outfit'";
    ctx.fillText(`1.5m PHYSICAL HEIGHT${dragHint}`, 15, state.y1_5m - 8);
    ctx.restore();

    // 1.0m Calibration Line (Neon Cyan)
    ctx.save();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = state.calibrationLocked ? 1.5 : 3;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00f0ff';
    if (state.calibrationLocked) ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, state.y1m);
    ctx.lineTo(w, state.y1m);
    ctx.stroke();

    ctx.fillStyle = '#00f0ff';
    ctx.font = "bold 12px 'Outfit'";
    ctx.fillText(`1.0m PHYSICAL HEIGHT${dragHint}`, 15, state.y1m - 8);
    ctx.restore();
  }

  // 2. Draw Computed Floor Line (0m) (Glowing Neon Green)
  if (state.isCalibrated && state.floorY) {
    ctx.save();
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff88';
    ctx.beginPath();
    ctx.moveTo(0, state.floorY);
    ctx.lineTo(w, state.floorY);
    ctx.stroke();

    // Floor Text label
    ctx.fillStyle = '#00ff88';
    ctx.font = "bold 12px 'Outfit'";
    ctx.fillText("COMPUTED FLOOR LEVEL (0.0m)", 15, state.floorY - 8);
    ctx.restore();
  }

  // 3. Draw Peak Reach Line (Glowing Neon Pink)
  if (state.lastDrawnPeakY) {
    ctx.save();
    ctx.strokeStyle = '#ff007f';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ff007f';
    ctx.beginPath();
    ctx.moveTo(0, state.lastDrawnPeakY);
    ctx.lineTo(w, state.lastDrawnPeakY);
    ctx.stroke();

    // Label Text
    ctx.fillStyle = '#ff007f';
    ctx.font = "bold 14px 'Outfit'";
    const peakReachVal = (state.floorY - state.lastDrawnPeakY) / state.scaleFactor;
    ctx.fillText(`APEX REACH: ${formatVal(peakReachVal)} ${state.units}`, 15, state.lastDrawnPeakY - 8);
    ctx.restore();
  }

  // 4. Render Jump Trajectory Curves
  if (state.jumpState === 'JUMPING' && state.trailPoints.length > 1) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(state.trailPoints[0].x, state.trailPoints[0].y);
    for (let i = 1; i < state.trailPoints.length; i++) {
      ctx.lineTo(state.trailPoints[i].x, state.trailPoints[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // 5. Draw Digital Height Tape Measure Ruler on the Right Side
  if (state.isCalibrated && state.scaleFactor) {
    ctx.save();
    const rulerX = w - 60;
    
    // Vertical backing line
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rulerX, 0);
    ctx.lineTo(rulerX, h);
    ctx.stroke();

    // Determine scale markers to draw based on active unit
    const startVal = state.units === 'cm' ? 100 : 40;  // 100cm or 40inches
    const endVal = state.units === 'cm' ? 360 : 140;   // 360cm or 140inches
    const step = state.units === 'cm' ? 10 : 5;        // increments of 10cm or 5in

    ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.font = "9px 'Inter'";
    ctx.textAlign = 'right';

    for (let val = startVal; val <= endVal; val += step) {
      // Coordinate y position: y = floorY - val * scaleFactor
      const yPos = state.floorY - (val * state.scaleFactor);
      
      // Keep inside bounds
      if (yPos > 0 && yPos < h) {
        ctx.beginPath();
        ctx.moveTo(rulerX, yPos);
        
        // Major / Minor tick mark lengths
        const isMajor = val % (state.units === 'cm' ? 50 : 20) === 0;
        const tickLength = isMajor ? 12 : 6;
        ctx.lineTo(rulerX + tickLength, yPos);
        ctx.strokeStyle = isMajor ? 'rgba(0, 240, 255, 0.6)' : 'rgba(0, 240, 255, 0.3)';
        ctx.stroke();

        if (isMajor || val % (state.units === 'cm' ? 20 : 10) === 0) {
          ctx.fillText(`${val}`, rulerX - 6, yPos + 3);
        }
      }
    }
    
    // Label ruler units
    ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
    ctx.font = "bold 9px 'Outfit'";
    ctx.fillText(state.units.toUpperCase(), rulerX - 6, 20);
    ctx.restore();
  }

  // 6. Draw real-time hand cursor pointer height indicator
  if (state.isCalibrated && state.activeFingertipY) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 230, 0, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, state.activeFingertipY);
    ctx.lineTo(w, state.activeFingertipY);
    ctx.stroke();
    
    // Cursor tag bubble
    ctx.fillStyle = '#ffe600';
    ctx.beginPath();
    ctx.arc(state.activeFingertipX, state.activeFingertipY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 7. Draw Player Focus Bounding Box (ROI Crop Box)
  if (state.useROI && state.roi) {
    ctx.save();
    // Bounding Box stroke with neon pink glow
    ctx.strokeStyle = '#ff007f';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff007f';
    ctx.strokeRect(state.roi.x, state.roi.y, state.roi.width, state.roi.height);

    // Label tab at the top-left corner
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ff007f';
    ctx.font = "bold 9px 'Outfit'";
    ctx.textAlign = 'left';
    
    // Draw label tab background block
    ctx.fillRect(state.roi.x, state.roi.y - 18, 140, 18);
    ctx.fillStyle = '#050a17';
    ctx.fillText("TARGET ATHLETE FOCUS", state.roi.x + 8, state.roi.y - 6);

    // Draw bottom-right resize handle
    ctx.fillStyle = '#ff007f';
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#ff007f';
    ctx.fillRect(state.roi.x + state.roi.width - 10, state.roi.y + state.roi.height - 10, 10, 10);
    ctx.restore();
  }
}


// --- 13. Event Listeners Setup ---
function setupEventListeners() {
  // Units Selection Buttons
  el.unitCm.addEventListener('click', () => setUnitSystem('cm'));
  el.unitIn.addEventListener('click', () => setUnitSystem('in'));

  // Lock Calibration Button
  el.btnApplyCalibration.addEventListener('click', toggleCalibrationLock);

  // Show/Hide Guide Lines Checkbox
  el.chkShowLines.addEventListener('change', (e) => {
    state.showCalibrationLines = e.target.checked;
  });

  // Hidable Calibration Console Window Toggle
  el.btnToggleCalWin.addEventListener('click', () => {
    state.calibrationCardHidden = !state.calibrationCardHidden;
    if (state.calibrationCardHidden) {
      el.calibrationCardBody.classList.add('collapsed');
      el.btnToggleCalWin.textContent = "Show Console";
    } else {
      el.calibrationCardBody.classList.remove('collapsed');
      el.btnToggleCalWin.textContent = "Hide Console";
    }
  });

  // Player Focus Bounding Box Selection
  el.roiFull.addEventListener('click', () => setROIMode('full'));
  el.roiFocus.addEventListener('click', () => setROIMode('focus'));

  // Game Play Session toggle button
  el.btnJumpSession.addEventListener('click', toggleJumpingSession);

  // PB Reset button
  el.btnResetPBs.addEventListener('click', () => {
    if (confirm("Are you sure you want to reset all personal best heights and peaks?")) {
      resetRecords();
    }
  });

  // Clear Session Log button
  el.btnClearHistory.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear all jumps in the session log?")) {
      clearJumpHistory();
    }
  });

  // Audio Testing synth trigger
  el.btnAudioTest.addEventListener('click', () => {
    audioSynth.playChime();
    setTimeout(() => audioSynth.playJump(), 400);
    setTimeout(() => audioSynth.playPeak(), 750);
    setTimeout(() => audioSynth.playRecord(), 1000);
  });
}

// Bind mouse and touch dragging canvas event handlers
function setupCanvasDragEvents() {
  const threshold = 15; // drag proximity threshold in pixels

  function getCanvasY(e) {
    const rect = el.canvas.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return ((clientY - rect.top) / rect.height) * el.canvas.height;
  }

  function getCanvasX(e) {
    const rect = el.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rawX = ((clientX - rect.left) / rect.width) * el.canvas.width;
    return el.canvas.width - rawX; // Mirror x coordinate due to CSS transform: scaleX(-1) on canvas-hud
  }

  el.canvas.addEventListener('mousedown', onStart);
  el.canvas.addEventListener('touchstart', onStart, { passive: false });

  el.canvas.addEventListener('mousemove', onMove);
  el.canvas.addEventListener('touchmove', onMove, { passive: false });

  window.addEventListener('mouseup', onEnd);
  window.addEventListener('touchend', onEnd);
  el.canvas.addEventListener('mouseleave', onEnd);

  function onStart(e) {
    const mouseX = getCanvasX(e);
    const mouseY = getCanvasY(e);
    const w = el.canvas.width || 1280;
    const h = el.canvas.height || 720;

    // 1. Check ROI box dragging/resizing if enabled
    if (state.useROI && state.roi) {
      // Proximity to bottom-right corner resize handle
      const rx = state.roi.x + state.roi.width;
      const ry = state.roi.y + state.roi.height;
      if (Math.abs(mouseX - rx) < threshold && Math.abs(mouseY - ry) < threshold) {
        state.roiDragging = 'resize';
        e.preventDefault();
        return;
      }
      
      // Proximity to drag move region (inside box)
      if (mouseX >= state.roi.x && mouseX <= state.roi.x + state.roi.width &&
          mouseY >= state.roi.y && mouseY <= state.roi.y + state.roi.height) {
        state.roiDragging = 'move';
        state.roiDragOffset = {
          x: mouseX - state.roi.x,
          y: mouseY - state.roi.y
        };
        e.preventDefault();
        return;
      }
    }

    // 2. Check Manual Calibration lines drag action if NOT locked and show lines is enabled
    if (!state.calibrationLocked && state.showCalibrationLines) {
      if (state.y1m === null) state.y1m = h * 0.65;
      if (state.y1_5m === null) state.y1_5m = h * 0.45;
      if (state.y2m === null) state.y2m = h * 0.25;

      if (Math.abs(mouseY - state.y1m) < threshold) {
        state.isDragging = 'y1m';
        e.preventDefault();
      } else if (Math.abs(mouseY - state.y1_5m) < threshold) {
        state.isDragging = 'y1_5m';
        e.preventDefault();
      } else if (Math.abs(mouseY - state.y2m) < threshold) {
        state.isDragging = 'y2m';
        e.preventDefault();
      }
    }
  }

  function onMove(e) {
    const mouseX = getCanvasX(e);
    const mouseY = getCanvasY(e);
    const w = el.canvas.width || 1280;
    const h = el.canvas.height || 720;

    // 1. Check ROI drag actions
    if (state.roiDragging) {
      e.preventDefault();
      if (state.roiDragging === 'resize') {
        const newWidth = Math.max(100, mouseX - state.roi.x);
        const newHeight = Math.max(150, mouseY - state.roi.y);
        // Clamp to screen boundaries
        state.roi.width = Math.min(w - state.roi.x, newWidth);
        state.roi.height = Math.min(h - state.roi.y, newHeight);
      } else if (state.roiDragging === 'move') {
        const targetX = mouseX - state.roiDragOffset.x;
        const targetY = mouseY - state.roiDragOffset.y;
        // Clamp bounds to prevent moving box outside viewport
        state.roi.x = Math.max(0, Math.min(w - state.roi.width, targetX));
        state.roi.y = Math.max(0, Math.min(h - state.roi.height, targetY));
      }
      return;
    }

    // 2. Check Calibration lines drag action
    if (state.isDragging) {
      e.preventDefault();
      if (state.y1m === null) state.y1m = h * 0.65;
      if (state.y1_5m === null) state.y1_5m = h * 0.45;
      if (state.y2m === null) state.y2m = h * 0.25;

      const gap = 20; // prevent overlap gap

      if (state.isDragging === 'y2m') {
        // Must stay above y1_5m
        state.y2m = Math.min(state.y1_5m - gap, Math.max(0, mouseY));
      } else if (state.isDragging === 'y1_5m') {
        // Must stay between y2m and y1m
        state.y1_5m = Math.min(state.y1m - gap, Math.max(state.y2m + gap, mouseY));
      } else if (state.isDragging === 'y1m') {
        // Must stay below y1_5m and not go off bottom of canvas
        state.y1m = Math.min(h, Math.max(state.y1_5m + gap, mouseY));
      }
      return;
    }

    // 3. Set custom cursor styles based on proximity hover states
    let cursorSet = false;
    
    // Check ROI focus box corners and region
    if (state.useROI && state.roi) {
      const rx = state.roi.x + state.roi.width;
      const ry = state.roi.y + state.roi.height;
      if (Math.abs(mouseX - rx) < threshold && Math.abs(mouseY - ry) < threshold) {
        el.canvas.style.cursor = 'se-resize';
        cursorSet = true;
      } else if (mouseX >= state.roi.x && mouseX <= state.roi.x + state.roi.width &&
                 mouseY >= state.roi.y && mouseY <= state.roi.y + state.roi.height) {
        el.canvas.style.cursor = 'move';
        cursorSet = true;
      }
    }

    // Check Calibration Lines hover if active, not locked, and not already set by ROI
    if (!cursorSet && !state.calibrationLocked && state.showCalibrationLines) {
      if (state.y1m === null) state.y1m = h * 0.65;
      if (state.y1_5m === null) state.y1_5m = h * 0.45;
      if (state.y2m === null) state.y2m = h * 0.25;

      if (Math.abs(mouseY - state.y1m) < threshold ||
          Math.abs(mouseY - state.y1_5m) < threshold ||
          Math.abs(mouseY - state.y2m) < threshold) {
        el.canvas.style.cursor = 'ns-resize';
        cursorSet = true;
      }
    }

    if (!cursorSet) {
      el.canvas.style.cursor = 'default';
    }
  }

  function onEnd() {
    if (state.isDragging) {
      state.isDragging = null;
      savePersonalBests(); // save metric modifications to local storage
    }
    if (state.roiDragging) {
      state.roiDragging = null;
      savePersonalBests();
    }
  }
}


// --- 14. Application Initialization ---
function initApp() {
  setupEventListeners();
  setupCanvasDragEvents();
  loadRecords();
  loadJumpHistory();

  // Instantiate Pose Tracking Instance
  const pose = new Pose({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: false,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
  });

  pose.onResults(onPoseResults);

  // Initialize camera tracking stream
  navigator.mediaDevices.getUserMedia({ 
    video: { 
      width: { ideal: 1280 },
      height: { ideal: 720 },
      facingMode: 'user'
    } 
  })
  .then(stream => {
    el.video.srcObject = stream;
    el.video.play()
      .then(() => {
        el.hudStatusText.textContent = "LOADING DETECTOR MODELS...";
        
        // Setup MediaPipe camera capture loop helper
        const camera = new Camera(el.video, {
          onFrame: async () => {
            if (state.useROI && state.roi) {
              // Ensure offscreen canvas dimensions match the crop box
              offscreenCanvas.width = state.roi.width;
              offscreenCanvas.height = state.roi.height;
              
              // Clear context and draw cropped video slice
              offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
              offscreenCtx.drawImage(
                el.video,
                state.roi.x, state.roi.y, state.roi.width, state.roi.height, // source crop
                0, 0, state.roi.width, state.roi.height // destination draw
              );
              
              await pose.send({ image: offscreenCanvas });
            } else {
              await pose.send({ image: el.video });
            }
          },
          width: 1280,
          height: 720
        });
        
        camera.start()
          .then(() => {
            el.hudStatusText.textContent = "SYSTEM READY // STAND IN VIEW";
          })
          .catch(err => {
            console.error("Camera loop launch error:", err);
            el.hudStatusText.textContent = "SENSOR ERROR: LOOP FAILURE";
          });
      })
      .catch(err => {
        console.error("Video play execution error:", err);
        el.hudStatusText.textContent = "SENSOR ERROR: PLAYBACK FAILURE";
      });
  })
  .catch(err => {
    console.error("Webcam video stream permission denied:", err);
    el.hudStatusText.textContent = "CAMERA ACCESS DENIED // ALLOW CAMERA";
    alert("Camera permission denied. To use this program, please grant camera access in your browser settings and refresh.");
  });
}

// Kickstart the application on DOM Content Loaded
window.addEventListener('DOMContentLoaded', initApp);
