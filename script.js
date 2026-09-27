/**
 * AARTI APOLOGY & MEMORY TRIBUTE - JAVASCRIPT
 * Interactive Canvas, Ambient Audio Synthesizer, Scroll Observers & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initIntersectionObserver();
  initSideNav();
  initAmbientCanvas();
  initAmbientAudio();
  initHeartInteraction();
});

/* ==========================================================
   1. SCROLL PROGRESS BAR
   ========================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercent}%`;
  }, { passive: true });
}

/* ==========================================================
   2. INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
   ========================================================== */
function initIntersectionObserver() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================
   3. SIDE NAVIGATION ACTIVE STATE
   ========================================================== */
function initSideNav() {
  const navDots = document.querySelectorAll('.nav-dot');
  if (!navDots.length) return;

  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    let currentId = '';
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navDots.forEach(dot => {
      dot.classList.remove('active');
      if (dot.getAttribute('data-section') === currentId) {
        dot.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

/* ==========================================================
   4. AMBIENT BACKGROUND CANVAS (Soft Embers & Stardust)
   ========================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 70);

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
      this.size = Math.random() * 2.2 + 0.8;
      this.speedY = -(Math.random() * 0.3 + 0.06);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.35 + 0.15;
      this.alphaSpeed = Math.random() * 0.005 + 0.002;
      this.alphaDirection = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      this.alpha += this.alphaSpeed * this.alphaDirection;
      if (this.alpha > 0.45) {
        this.alpha = 0.45;
        this.alphaDirection = -1;
      } else if (this.alpha < 0.1) {
        this.alpha = 0.1;
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
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.colorBase + '0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* ==========================================================
   5. AMBIENT SOUNDSCAPE SYNTHESIZER (Web Audio API)
   Generates a warm, nostalgic, calming chord progression
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
    masterGain.gain.linearRampToValueAtTime(0.28, audioCtx.currentTime + 3);

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

    // Subtle gentle pitch drift for vintage nostalgia
    osc.frequency.linearRampToValueAtTime(freq * 1.002, time + duration);

    noteGain.gain.setValueAtTime(0, time);
    noteGain.gain.linearRampToValueAtTime(isHighAccent ? 0.06 : 0.12, time + 0.8);
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

    // Play base chord tones with gentle arpeggio offset
    chord.forEach((freq, idx) => {
      playWarmNote(freq, now + idx * 0.25, 6.5, false);
    });

    // Gentle high octave melody note
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

/* ==========================================================
   6. INTERACTIVE HEART CELEBRATION
   ========================================================== */
function initHeartInteraction() {
  const heartBtn = document.getElementById('finalHeartBtn');
  const instruction = document.getElementById('heartInstruction');
  if (!heartBtn) return;

  const heartIcons = ['❤️', '✨', '🌸', '💫', '🤍', '✦'];

  heartBtn.addEventListener('click', (e) => {
    const rect = heartBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Spawn 12 floating particle hearts
    for (let i = 0; i < 12; i++) {
      createFloatingHeart(centerX, centerY, heartIcons[Math.floor(Math.random() * heartIcons.length)]);
    }

    if (instruction) {
      instruction.textContent = 'Sincere warmth and respect sent ❤️';
      instruction.style.color = '#f5c8cb';
      instruction.style.opacity = '1';

      setTimeout(() => {
        instruction.textContent = 'Click the heart to leave warmth';
        instruction.style.opacity = '0.8';
      }, 4000);
    }
  });

  function createFloatingHeart(x, y, char) {
    const heart = document.createElement('div');
    heart.className = 'floating-click-heart';
    heart.textContent = char;

    const randX = (Math.random() - 0.5) * 160 + 'px';
    const randRot = (Math.random() - 0.5) * 60 + 'deg';

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty('--rand-x', randX);
    heart.style.setProperty('--rand-rot', randRot);

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1800);
  }
}
