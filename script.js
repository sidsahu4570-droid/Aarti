/**
 * FOR AARTI ❤️ | LIGHTWEIGHT ULTRA-FAST CLIENT LOGIC
 */

(function () {
  'use strict';

  // ==========================================
  // 1. SCROLL PROGRESS BAR
  // ==========================================
  const scrollProgressBar = document.getElementById('scrollProgress');
  if (scrollProgressBar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            scrollProgressBar.style.width = `${(window.scrollY / totalHeight) * 100}%`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ==========================================
  // 2. ULTRA-LIGHT FLOATING PARTICLES CANVAS
  // ==========================================
  const canvas = document.getElementById('ambientCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    const particles = [];
    const count = window.innerWidth < 768 ? 10 : 18;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.5 + 1,
        sy: Math.random() * 0.4 + 0.2,
        sx: (Math.random() - 0.5) * 0.2,
        c: Math.random() > 0.4 ? 'rgba(244, 114, 182, 0.35)' : 'rgba(251, 191, 36, 0.3)'
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.sy;
        p.x += p.sx;
        if (p.y > height) { p.y = -10; p.x = Math.random() * width; }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.28);
        ctx.fillStyle = p.c;
        ctx.fill();
      }
      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }

  // ==========================================
  // 3. GENERATIVE AMBIENT AUDIO SYNTHESIZER
  // ==========================================
  const audioBtn = document.getElementById('audioToggle');
  const audioStatusText = document.getElementById('audioStatusText');
  let audioCtx = null;
  let isPlaying = false;
  let synthInterval = null;

  const baseChords = [
    [146.83, 220.00, 293.66, 369.99, 440.00],
    [164.81, 246.94, 329.63, 392.00, 493.88],
    [185.00, 277.18, 369.99, 440.00, 554.37],
    [196.00, 293.66, 392.00, 493.88, 587.33]
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
      const maxVol = 0.03 / (idx + 1);

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
  // 4. WAX SEAL INTERACTION
  // ==========================================
  const waxSealBtn = document.getElementById('waxSealBtn');
  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', () => {
      waxSealBtn.style.transform = 'scale(1.15) rotate(10deg)';
      const label = waxSealBtn.querySelector('.wax-label');
      if (label) label.textContent = 'Unsealed ♡';
      setTimeout(() => {
        waxSealBtn.style.transform = 'scale(1) rotate(0deg)';
      }, 400);
    });
  }

  // ==========================================
  // 5. PRIVATE SILENT REACTION WIDGET
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
