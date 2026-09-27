/**
 * FOR AARTI ❤️ | ULTRA-FAST PERFORMANCE CLIENT SUITE
 */

(function () {
  'use strict';

  // Mark JS active for progressive animation enhancement
  document.documentElement.classList.add('js-loaded');

  // ==========================================
  // 1. SCROLL REVEALS (FAST INTERSECTION OBSERVER)
  // ==========================================
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '60px 0px 60px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: immediately show all elements
    reveals.forEach(el => el.classList.add('active'));
  }

  // ==========================================
  // 2. SCROLL PROGRESS BAR
  // ==========================================
  const scrollProgressBar = document.getElementById('scrollProgress');
  if (scrollProgressBar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgressBar.style.width = `${progress}%`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ==========================================
  // 3. CURSOR GLOW (DESKTOP ONLY)
  // ==========================================
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function renderCursorGlow() {
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      cursorGlow.style.left = `${cursorX}px`;
      cursorGlow.style.top = `${cursorY}px`;
      requestAnimationFrame(renderCursorGlow);
    }
    renderCursorGlow();
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  // ==========================================
  // 4. FLOATING PETALS & STARDUST CANVAS
  // ==========================================
  const canvas = document.getElementById('ambientCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    }, { passive: true });

    const particleCount = window.innerWidth < 768 ? 16 : 28;
    const particles = [];

    class AmbientParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -20;
        this.size = Math.random() * 3.5 + 2;
        this.speedY = Math.random() * 0.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.015;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.isPetal = Math.random() > 0.45;
        this.color = this.isPetal 
          ? `rgba(244, 114, 182, ${this.opacity})` 
          : `rgba(251, 191, 36, ${this.opacity * 0.75})`;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.006) * 0.3;
        this.rotation += this.rotSpeed;

        if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;

        if (this.isPetal) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(this.size, -this.size, this.size * 2, 0);
          ctx.quadraticCurveTo(this.size, this.size, 0, 0);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new AmbientParticle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ==========================================
  // 5. GENERATIVE AMBIENT AUDIO SYNTHESIZER
  // ==========================================
  const audioBtn = document.getElementById('audioToggle');
  const audioStatusText = document.getElementById('audioStatusText');
  let audioCtx = null;
  let isPlaying = false;
  let synthInterval = null;

  const baseChords = [
    [146.83, 220.00, 293.66, 369.99, 440.00], // D, A, D4, F#4, A4
    [164.81, 246.94, 329.63, 392.00, 493.88], // E, B, E4, G4, B4
    [185.00, 277.18, 369.99, 440.00, 554.37], // F#, C#, F#4, A4, C#5
    [196.00, 293.66, 392.00, 493.88, 587.33]  // G, D, G4, B4, D5
  ];

  function playAmbientPad(chord) {
    if (!audioCtx || !isPlaying) return;

    chord.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      const duration = 6.0;
      const now = audioCtx.currentTime;
      const maxVol = 0.035 / (idx + 1);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(maxVol, now + 1.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  function startAmbientAtmosphere() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    let chordIdx = 0;
    playAmbientPad(baseChords[chordIdx]);

    synthInterval = setInterval(() => {
      chordIdx = (chordIdx + 1) % baseChords.length;
      playAmbientPad(baseChords[chordIdx]);
    }, 4500);
  }

  function stopAmbientAtmosphere() {
    if (synthInterval) clearInterval(synthInterval);
    synthInterval = null;
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        audioBtn.classList.add('playing');
        if (audioStatusText) audioStatusText.textContent = 'Playing';
        startAmbientAtmosphere();
      } else {
        audioBtn.classList.remove('playing');
        if (audioStatusText) audioStatusText.textContent = 'Atmosphere';
        stopAmbientAtmosphere();
      }
    });
  }

  // ==========================================
  // 6. 3D TILT EFFECT ON MEMORY CARDS
  // ==========================================
  function setupTilt(elementId, maxTilt = 8) {
    const card = document.getElementById(elementId);
    if (!card || !window.matchMedia('(hover: hover)').matches) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const tiltX = ((y - centerY) / centerY) * -maxTilt;
      const tiltY = ((x - centerX) / centerX) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  setupTilt('tiltMemoryCard', 6);
  setupTilt('tiltPolaroid', 8);

  // ==========================================
  // 7. WAX SEAL INTERACTION
  // ==========================================
  const waxSealBtn = document.getElementById('waxSealBtn');
  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', () => {
      waxSealBtn.style.transform = 'scale(1.2) rotate(15deg)';
      const label = waxSealBtn.querySelector('.wax-label');
      if (label) label.textContent = 'Unsealed ♡';
      setTimeout(() => {
        waxSealBtn.style.transform = 'scale(1) rotate(0deg)';
      }, 400);
    });
  }

  // ==========================================
  // 8. PRIVATE SILENT REACTION WIDGET
  // ==========================================
  const reactionChips = document.querySelectorAll('.reaction-chip');
  const reactionFeedback = document.getElementById('reactionFeedback');
  const savedReact = localStorage.getItem('aarti_reaction');

  if (savedReact) {
    reactionChips.forEach(chip => {
      if (chip.getAttribute('data-react') === savedReact) {
        chip.classList.add('selected');
        if (reactionFeedback) reactionFeedback.textContent = "Thank you for reading peacefully. ♡";
      }
    });
  }

  reactionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      reactionChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const val = chip.getAttribute('data-react');
      localStorage.setItem('aarti_reaction', val);
      if (reactionFeedback) {
        reactionFeedback.textContent = "Saved silently. Take all the time and peace you need. ♡";
      }
    });
  });

})();
