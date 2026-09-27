/**
 * AARTI - HIGH PERFORMANCE JAVASCRIPT
 * Ambient Audio Synthesizer, Optimized Canvas Particle Engine & Scroll Triggers
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initIntersectionObserver();
  initAmbientAudio();

  // Defer canvas animation to idle callback for instantaneous page paint
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initAmbientCanvas, { timeout: 1000 });
  } else {
    setTimeout(initAmbientCanvas, 100);
  }
});

/* ==========================================================
   1. SCROLL PROGRESS BAR (Passive Event Listener)
   ========================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${scrollPercent}%`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================
   2. INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
   ========================================================== */
function initIntersectionObserver() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target); // Unobserve once revealed to save CPU cycles
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================
   3. HIGH PERFORMANCE AMBIENT CANVAS PARTICLES
   ========================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particleCount = Math.min(Math.floor(window.innerWidth / 25), 45);
  const particles = [];

  const colors = [
    'rgba(255, 255, 255, ', // pure white light
    'rgba(255, 244, 240, ', // warm pale cream
    'rgba(217, 79, 120, ',  // romantic rose
    'rgba(184, 137, 53, '   // subtle gold
  ];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.0 + 0.8;
      this.speedY = -(Math.random() * 0.28 + 0.05);
      this.speedX = (Math.random() - 0.5) * 0.18;
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.35 + 0.12;
      this.alphaSpeed = Math.random() * 0.005 + 0.002;
      this.alphaDirection = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      this.alpha += this.alphaSpeed * this.alphaDirection;
      if (this.alpha > 0.42) {
        this.alpha = 0.42;
        this.alphaDirection = -1;
      } else if (this.alpha < 0.08) {
        this.alpha = 0.08;
        this.alphaDirection = 1;
      }

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.y = height + 10;
        this.x = Math.random() * width;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.colorBase + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let animationId = null;
  let isTabActive = true;

  function animate() {
    if (!isTabActive) return;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animationId = requestAnimationFrame(animate);
  }

  animate();

  // Pause rendering when user switches tabs to save 100% CPU/battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isTabActive = false;
      if (animationId) cancelAnimationFrame(animationId);
    } else {
      isTabActive = true;
      animate();
    }
  });

  // Debounced resize listener
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, 200);
  }, { passive: true });
}

/* ==========================================================
   4. AMBIENT SOUNDSCAPE SYNTHESIZER (Web Audio API)
   Generates a warm, nostalgic, calming lo-fi chord progression
   ========================================================== */
function initAmbientAudio() {
  const audioBtn = document.getElementById('audioToggle');
  const audioLabel = document.getElementById('audioLabel');
  if (!audioBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let synthInterval = null;
  let masterGain = null;

  // Chord frequencies (Nostalgic progression: Fmaj7 -> G6 -> Em7 -> Am7)
  const chords = [
    [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
    [196.00, 246.94, 293.66, 392.00], // G6 (G3, B3, D4, G4)
    [164.81, 196.00, 246.94, 329.63], // Em7 (E3, G3, B3, E4)
    [220.00, 261.63, 329.63, 392.00]  // Am7 (A3, C4, E4, G4)
  ];

  let currentChordIndex = 0;

  function createAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.24, audioCtx.currentTime + 3);

    // Warm Lowpass Filter for lo-fi cinematic feeling
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, audioCtx.currentTime);
    filter.Q.setValueAtTime(1.5, audioCtx.currentTime);

    masterGain.connect(filter);
    filter.connect(audioCtx.destination);
  }

  function playWarmNote(freq, time, duration, isHighAccent = false) {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    osc.type = isHighAccent ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.linearRampToValueAtTime(freq * 1.002, time + duration);

    noteGain.gain.setValueAtTime(0, time);
    noteGain.gain.linearRampToValueAtTime(isHighAccent ? 0.05 : 0.10, time + 0.8);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  function playNextChord() {
    if (!isPlaying || !audioCtx) return;

    const now = audioCtx.currentTime;
    const chord = chords[currentChordIndex];

    chord.forEach((freq, idx) => {
      playWarmNote(freq, now + idx * 0.25, 6.5, false);
    });

    const melodyFreq = chord[Math.floor(Math.random() * chord.length)] * 2;
    playWarmNote(melodyFreq, now + 1.2, 5.0, true);

    currentChordIndex = (currentChordIndex + 1) % chords.length;
  }

  function startMusic() {
    if (!audioCtx) {
      createAudioContext();
    } else if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = true;
    audioBtn.classList.add('playing');
    audioLabel.textContent = 'Pause Ambient Music';

    playNextChord();
    synthInterval = setInterval(playNextChord, 4500);
  }

  function stopMusic() {
    isPlaying = false;
    audioBtn.classList.remove('playing');
    audioLabel.textContent = 'Play Ambient Music';

    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  audioBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });
}
