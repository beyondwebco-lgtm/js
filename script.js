/* ==========================================================================
   SORRY, JIKKI ❤️ — INTERACTIVE LOGIC & ANIMATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE MANAGEMENT ---
  let currentScreen = 1;
  let meterValue = 70;
  let isEnvelopeOpen = false;
  let soundEnabled = true;

  // --- DOM ELEMENTS ---
  const screens = document.querySelectorAll('.screen');
  const dots = document.querySelectorAll('.dot');
  const soundToggleBtn = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');

  // Screen 1 Button
  const btnScreen1 = document.getElementById('btnScreen1');

  // Screen 2 Button
  const btnScreen2 = document.getElementById('btnScreen2');

  // Screen 3 Button
  const btnScreen3 = document.getElementById('btnScreen3');

  // Screen 4 Elements
  const tapHeartBtn = document.getElementById('tapHeartBtn');
  const meterFill = document.getElementById('meterFill');
  const meterPercentage = document.getElementById('meterPercentage');
  const meterMessage = document.getElementById('meterMessage');
  const meterCompletedBox = document.getElementById('meterCompletedBox');
  const btnScreen4 = document.getElementById('btnScreen4');
  const bearEyesGroup = document.getElementById('bearEyesGroup');
  const bearMouth = document.getElementById('bearMouth');

  // Screen 5 Elements
  const interactiveEnvelope = document.getElementById('interactiveEnvelope');
  const btnScreen5 = document.getElementById('btnScreen5');

  // Screen 6 Elements
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const stillMadModal = document.getElementById('stillMadModal');
  const btnRetrySorry = document.getElementById('btnRetrySorry');
  const celebrationOverlay = document.getElementById('celebrationOverlay');
  const btnReplay = document.getElementById('btnReplay');

  // Background Container
  const heartsContainer = document.getElementById('heartsContainer');

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.15) {
    if (!soundEnabled) return;
    try {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignore audio errors if restricted
    }
  }

  function playChimeSequence() {
    if (!soundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'sine', 0.25, 0.2), i * 100);
    });
  }

  function playVictoryFanfare() {
    if (!soundEnabled) return;
    const chord = [523.25, 659.25, 783.99, 987.77, 1046.50];
    chord.forEach((freq) => {
      playTone(freq, 'triangle', 0.6, 0.2);
    });
  }

  // Sound Toggle Handler
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? '🎵' : '🔇';
    if (soundEnabled) {
      playTone(600, 'sine', 0.1, 0.1);
    }
  });

  // --- SCREEN NAVIGATION CONTROLLER ---
  function goToScreen(screenNumber) {
    if (screenNumber < 1 || screenNumber > 6) return;

    playTone(440 + screenNumber * 50, 'sine', 0.1, 0.1);

    screens.forEach((screen) => {
      const num = parseInt(screen.getAttribute('data-screen'));
      if (num === screenNumber) {
        screen.classList.remove('hidden');
        setTimeout(() => screen.classList.add('active'), 20);
      } else {
        screen.classList.remove('active');
        setTimeout(() => screen.classList.add('hidden'), 500);
      }
    });

    // Update Header Dots
    dots.forEach((dot) => {
      const step = parseInt(dot.getAttribute('data-step'));
      if (step === screenNumber) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    currentScreen = screenNumber;

    // Trigger haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }
  }

  // Navigation Event Listeners
  btnScreen1.addEventListener('click', () => goToScreen(2));
  btnScreen2.addEventListener('click', () => goToScreen(3));
  btnScreen3.addEventListener('click', () => goToScreen(4));
  btnScreen4.addEventListener('click', () => goToScreen(5));
  btnScreen5.addEventListener('click', () => goToScreen(6));

  // --- FLOATING HEARTS GENERATOR ---
  function spawnFloatingHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    const heartIcons = ['❤️', '💖', '💕', '💗', '🌸', '✨'];
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    
    heart.style.left = `${Math.random() * 92 + 4}%`;
    heart.style.animationDuration = `${Math.random() * 4 + 6}s`;
    heart.style.fontSize = `${Math.random() * 0.8 + 1}rem`;
    
    heartsContainer.appendChild(heart);
    
    setTimeout(() => {
      heart.remove();
    }, 10000);
  }

  setInterval(spawnFloatingHeart, 1200);
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnFloatingHeart, i * 400);
  }

  // --- METER INTERACTION (SCREEN 4) ---
  const bearFaceStates = {
    70: {
      eyes: '<path d="M 52 78 Q 60 70 68 78" stroke="#4A0E2E" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M 92 78 Q 100 70 108 78" stroke="#4A0E2E" stroke-width="4" stroke-linecap="round" fill="none"/>',
      mouth: 'M 74 102 Q 80 98 86 102',
      msg: 'Tap the heart to heal my heart! ❤️'
    },
    80: {
      eyes: '<path d="M 54 75 Q 60 72 66 75" stroke="#4A0E2E" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M 94 75 Q 100 72 106 75" stroke="#4A0E2E" stroke-width="4" stroke-linecap="round" fill="none"/>',
      mouth: 'M 74 100 Q 80 102 86 100',
      msg: 'Getting warmer... 🥺'
    },
    90: {
      eyes: '<circle cx="60" cy="74" r="5" fill="#2B0814"/><circle cx="100" cy="74" r="5" fill="#2B0814"/>',
      mouth: 'M 72 98 Q 80 106 88 98',
      msg: 'Almost there! 💕'
    },
    100: {
      eyes: '<path d="M 52 75 Q 60 65 68 75 M 52 75 Q 60 85 68 75" fill="#FF4D79"/><path d="M 92 75 Q 100 65 108 75 M 92 75 Q 100 85 108 75" fill="#FF4D79"/>',
      mouth: 'M 70 96 Q 80 110 90 96',
      msg: '100% FORGIVEN ❤️'
    }
  };

  tapHeartBtn.addEventListener('click', (e) => {
    if (meterValue >= 100) return;

    meterValue += 10;
    if (meterValue > 100) meterValue = 100;

    // Audio & Haptic
    playTone(400 + meterValue * 4, 'sine', 0.15, 0.2);
    if (navigator.vibrate) {
      navigator.vibrate([30, 40, 30]);
    }

    // Spawn Burst Hearts at Tap Position
    spawnHeartBurst(e);

    // Update UI
    meterFill.style.width = `${meterValue}%`;
    meterPercentage.textContent = `${meterValue}% FORGIVEN`;

    // Scale Bounce Effect on Badge
    meterPercentage.style.transform = 'scale(1.2)';
    setTimeout(() => meterPercentage.style.transform = 'scale(1)', 200);

    const state = bearFaceStates[meterValue];
    if (state) {
      bearEyesGroup.innerHTML = state.eyes;
      bearMouth.setAttribute('d', state.mouth);
      meterMessage.textContent = state.msg;
    }

    if (meterValue === 100) {
      playChimeSequence();
      triggerConfetti();
      setTimeout(() => {
        meterCompletedBox.classList.remove('hidden');
        meterCompletedBox.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  });

  function spawnHeartBurst(event) {
    const rect = tapHeartBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 6; i++) {
      const pop = document.createElement('div');
      pop.textContent = '💖';
      pop.style.position = 'fixed';
      pop.style.left = `${centerX}px`;
      pop.style.top = `${centerY}px`;
      pop.style.fontSize = '1.2rem';
      pop.style.pointerEvents = 'none';
      pop.style.zIndex = '99';
      pop.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

      document.body.appendChild(pop);

      const angle = (Math.PI * 2 * i) / 6;
      const velocity = 50 + Math.random() * 30;
      const targetX = centerX + Math.cos(angle) * velocity;
      const targetY = centerY + Math.sin(angle) * velocity - 40;

      requestAnimationFrame(() => {
        pop.style.transform = `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(1.4)`;
        pop.style.opacity = '0';
      });

      setTimeout(() => pop.remove(), 850);
    }
  }

  // --- ENVELOPE INTERACTION (SCREEN 5) ---
  interactiveEnvelope.addEventListener('click', () => {
    isEnvelopeOpen = !isEnvelopeOpen;
    if (isEnvelopeOpen) {
      interactiveEnvelope.classList.add('open');
      playTone(550, 'triangle', 0.25, 0.2);
      if (navigator.vibrate) navigator.vibrate(40);
    } else {
      interactiveEnvelope.classList.remove('open');
    }
  });

  // --- SCREEN 6 FINAL DECISION ---
  btnYes.addEventListener('click', () => {
    playVictoryFanfare();
    celebrationOverlay.classList.remove('hidden');
    setTimeout(() => celebrationOverlay.classList.add('active'), 20);
    startContinuousConfetti();
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
  });

  btnNo.addEventListener('click', () => {
    playTone(250, 'sawtooth', 0.2, 0.15);
    stillMadModal.classList.remove('hidden');
    setTimeout(() => stillMadModal.classList.add('active'), 20);
  });

  btnRetrySorry.addEventListener('click', () => {
    stillMadModal.classList.remove('active');
    setTimeout(() => {
      stillMadModal.classList.add('hidden');
      goToScreen(2); // Loop back to apology card
    }, 300);
  });

  btnReplay.addEventListener('click', () => {
    celebrationOverlay.classList.remove('active');
    setTimeout(() => {
      celebrationOverlay.classList.add('hidden');
      // Reset State
      meterValue = 70;
      meterFill.style.width = '70%';
      meterPercentage.textContent = '70% FORGIVEN';
      bearEyesGroup.innerHTML = bearFaceStates[70].eyes;
      bearMouth.setAttribute('d', bearFaceStates[70].mouth);
      meterMessage.textContent = bearFaceStates[70].msg;
      meterCompletedBox.classList.add('hidden');
      interactiveEnvelope.classList.remove('open');
      isEnvelopeOpen = false;
      goToScreen(1);
    }, 400);
  });

  // --- LIGHTWEIGHT CONFETTI SYSTEM ---
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let confettiParticles = [];
  let confettiAnimationId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function createConfettiParticle() {
    const colors = ['#ff4d79', '#ffb7c5', '#ffd166', '#06d6a0', '#118ab2', '#ffffff'];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 4 - 2
    };
  }

  function triggerConfetti() {
    confettiParticles = [];
    for (let i = 0; i < 70; i++) {
      confettiParticles.push(createConfettiParticle());
    }
    animateConfetti(false);
  }

  function startContinuousConfetti() {
    confettiParticles = [];
    for (let i = 0; i < 120; i++) {
      confettiParticles.push(createConfettiParticle());
    }
    animateConfetti(true);
  }

  function animateConfetti(continuous) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiParticles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > canvas.height) {
        if (continuous) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (confettiParticles.some(p => p.y <= canvas.height) || continuous) {
      confettiAnimationId = requestAnimationFrame(() => animateConfetti(continuous));
    }
  }

  // Initialize Screen 1
  goToScreen(1);
});
