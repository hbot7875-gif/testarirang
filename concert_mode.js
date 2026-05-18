// Concert Mode Implementation

let concertPlayer;
let strobeInterval;
let progressInterval;

window.launchTheVoyage = function () {
  const existing = document.getElementById('voyage-overlay');
  if (existing) existing.remove();

  if (typeof ensureVoyageStyles === 'function') {
    ensureVoyageStyles();
  }

  // Inject responsive concert mode styles
  if (!document.getElementById('concert-mode-extra-css')) {
    const s = document.createElement('style');
    s.id = 'concert-mode-extra-css';
    s.textContent = `
      .cm-controls-panel {
          position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); 
          z-index: 20; background: rgba(0,0,0,0.7); padding: 8px 12px; border-radius: 16px; 
          border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); 
          display: flex; gap: 10px; align-items: center; pointer-events: auto;
          transition: all 0.3s ease;
      }
      .cm-color-btn {
          width: 20px; height: 20px; border-radius: 50%; border: 2px solid #fff; cursor: pointer;
          transition: transform 0.2s;
      }
      .cm-color-btn:hover { transform: scale(1.1); }
      .cm-divider {
          width: 1px; height: 14px; background: rgba(255,255,255,0.2);
      }
      .cm-strobe-btn {
          background: transparent; color: #fff; font-size: 9px; font-weight: 900; 
          letter-spacing: 1px; border: none; cursor: pointer; font-family: 'Orbitron', sans-serif;
      }
      @media (max-width: 600px) {
          .cm-controls-panel {
              bottom: 12px;
              padding: 8px 12px;
              gap: 8px;
              border-radius: 16px;
          }
          .cm-color-btn {
              width: 18px;
              height: 18px;
          }
          .cm-strobe-btn {
              font-size: 9px;
          }
          .cm-divider {
              height: 14px;
          }
          #fan-zone {
              bottom: 18% !important;
          }
          #youtube-player {
              aspect-ratio: 16 / 9;
              width: 100vw !important;
              height: auto !important;
              max-height: 100vh !important;
              object-fit: contain !important;
              opacity: 1 !important;
              pointer-events: none;
              z-index: 2;
              transform: scale(1.15) !important;
              transform-origin: center center !important;
          }
          .vy-sky-bg {
              position: absolute;
              inset: 0;
              background: radial-gradient(ellipse at center, #0c0824 0%, #030308 70%, #000 100%) !important;
              z-index: 1;
              pointer-events: none;
              overflow: hidden !important;
          }
          .vy-star {
              position: absolute;
              background: #fff;
              border-radius: 50%;
              box-shadow: 0 0 6px #fff, 0 0 12px rgba(168, 85, 247, 0.6);
              opacity: 0.3;
              pointer-events: none;
              animation: vyStarBlink var(--blink-dur, 3s) ease-in-out infinite;
          }
          @keyframes vyStarBlink {
              0%, 100% { opacity: 0.1; transform: scale(0.6); }
              50% { opacity: 1; transform: scale(1.3); }
          }
          @media (max-width: 600px) {
              #video-wrapper iframe { transform: scale(1.15) !important; width: 100vw !important; height: auto !important; aspect-ratio: 16 / 9 !important; }
          }
      }
    `;
    document.head.appendChild(s);
  }

  const root = document.createElement('div');
  root.id = 'voyage-overlay';
  root.className = 'vy-root';
  
  root.innerHTML = `
    <!-- PHASE 1: THE MAGIC SHIP -->
    <div id="phase-1-ship" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; transition: opacity 1s ease;">
        <div class="vy-arirang-ship" id="sailing-ship">
            <div class="vy-arirang__glow"></div>
            <div class="vy-arirang__sail vy-arirang__sail--g1"></div>
            <div class="vy-arirang__sail vy-arirang__sail--g2"></div>
            <div class="vy-arirang__sail vy-arirang__sail--g3"></div>
            <div class="vy-arirang__hull"><div class="vy-arirang__hull-name">Arirang</div></div>
            <div class="vy-arirang__wake"><div class="vy-arirang__foam"></div></div>
        </div>
        
        <div id="warp-text" style="margin-top: 40px; font-family: 'Orbitron', sans-serif; font-size: 14px; color: var(--purple-mid); letter-spacing: 4px; text-transform: uppercase; animation: pulse 1s infinite;">
            Initiating Magic Shop Portal...
        </div>
    </div>

    <!-- THE TRANSITION FLASH -->
    <div id="magic-flash" style="position: absolute; inset: 0; background: radial-gradient(circle, #fff 0%, #a855f7 50%, #000 100%); opacity: 0; pointer-events: none; z-index: 80; transition: opacity 2s ease-in;"></div>

    <!-- PHASE 2: THE CONCERT ARENA -->
    <div id="phase-2-concert" style="position: absolute; inset: 0; opacity: 0; pointer-events: none; z-index: 60; transition: opacity 2s ease-out; background: #000;">
        
        <div id="video-wrapper" class="vy-sky-bg" style="position: absolute; inset: 0; pointer-events: none;">
            <div class="vy-stars-container" style="position: absolute; inset: 0; z-index: 0; pointer-events: none;"></div>
            <div id="youtube-player" style="position: relative; z-index: 1;"></div>
            <div class="vy-video-shield" style="position: absolute; inset: 0; z-index: 5; pointer-events: auto; background: transparent;"></div>
            <div style="position: absolute; inset: 0; background: radial-gradient(circle at center 60%, transparent 20%, rgba(0,0,0,0.9) 100%); z-index: 2;"></div>
        </div>

        <div id="fan-zone" style="position: absolute; bottom: 12%; left: 50%; transform: translateX(-50%); z-index: 10;">
            <div class="cs-bomb anim-sway" id="my-army-bomb" style="--glow-color: #a855f7; --wave-speed: 4s; transition: all 0.3s ease;">
                <div class="cs-sphere" style="box-shadow: 0 0 50px var(--glow-color), inset 0 0 20px var(--glow-color); background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.2) 40%, rgba(0,0,0,0.6));">
                    <span class="cs-logo" style="text-shadow: 0 0 15px var(--glow-color);">⟭⟬</span>
                </div>
                <div class="cs-handle"></div>
            </div>
        </div>

        <div id="lightstick-controls" class="cm-controls-panel">
            <button onclick="changeBombColor('#a855f7')" class="cm-color-btn" style="background:#a855f7;"></button>
            <button onclick="changeBombColor('#3b82f6')" class="cm-color-btn" style="background:#3b82f6;"></button>
            <button onclick="changeBombColor('#22c55e')" class="cm-color-btn" style="background:#22c55e;"></button>
            <div class="cm-divider"></div>
            <button onclick="toggleStrobe()" class="cm-strobe-btn">STROBE</button>
        </div>

        <button onclick="exitConcert()" style="position: absolute; top: 20px; right: 20px; z-index: 50; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); color: #fff; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-family:'Orbitron', sans-serif; font-size:10px; font-weight:800; backdrop-filter: blur(5px); pointer-events: auto;">EXIT ARENA</button>
    </div>
  `;

  document.body.appendChild(root);

  // Generate magical background stars dynamically
  const starsContainer = root.querySelector('.vy-stars-container');
  if (starsContainer) {
    let starsHtml = '';
    for (let i = 0; i < 45; i++) {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = Math.random() * 2.5 + 1;
      const delay = Math.random() * 4;
      const dur = Math.random() * 3 + 2;
      starsHtml += `<div class="vy-star" style="top: ${top}%; left: ${left}%; width: ${size}px; height: ${size}px; --blink-dur: ${dur}s; animation-delay: ${delay}s;"></div>`;
    }
    starsContainer.innerHTML = starsHtml;
  }

  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('visible')));

  setTimeout(() => {
    const ship = document.getElementById('sailing-ship');
    const text = document.getElementById('warp-text');
    if (ship) ship.classList.add('ship-warp-drive');
    if (text) text.innerText = 'Entering Coordinates...';
  }, 1000);

  setTimeout(() => {
    const flash = document.getElementById('magic-flash');
    if (flash) flash.style.opacity = '1';
    // Start YouTube player loading under cover of full-screen flash transition
    initYouTubePlayer('V-5rR0Q-T-Q');
  }, 3500);

  setTimeout(() => {
    const phase1 = document.getElementById('phase-1-ship');
    if (phase1) phase1.style.display = 'none';

    const phase2 = document.getElementById('phase-2-concert');
    if (phase2) {
      phase2.style.opacity = '1';
      phase2.style.pointerEvents = 'all';
    }
  }, 5000);

  setTimeout(() => {
    const flash = document.getElementById('magic-flash');
    if (flash) {
        flash.style.transition = 'opacity 3s ease-out';
        flash.style.opacity = '0';
    }
  }, 8500);
};

function initYouTubePlayer(videoId) {
  if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
      setTimeout(() => initYouTubePlayer(videoId), 500);
      return;
  }

  if (progressInterval) clearInterval(progressInterval);

  concertPlayer = new YT.Player('youtube-player', {
    height: '100%',
    width: '100%',
    videoId: videoId, 
    playerVars: {
      'autoplay': 1, 'controls': 0, 'disablekb': 1, 'fs': 0, 'modestbranding': 1, 'rel': 0, 'showinfo': 0, 'playsinline': 1, 'iv_load_policy': 3
    },
    events: {
      'onReady': (event) => { 
        event.target.playVideo(); 

        // Monitor play duration to trigger Grand Finale early to preempt creator's End Screen cards (usually last 10-20 seconds)
        progressInterval = setInterval(() => {
            if (concertPlayer && typeof concertPlayer.getCurrentTime === 'function' && typeof concertPlayer.getDuration === 'function') {
                const currentTime = concertPlayer.getCurrentTime();
                const duration = concertPlayer.getDuration();
                if (duration > 0 && (duration - currentTime <= 11)) {
                    clearInterval(progressInterval);
                    if (typeof triggerGrandFinale === 'function') {
                        triggerGrandFinale();
                    }
                }
            }
        }, 1000);
      },
      'onStateChange': (event) => {
        if (event.data === YT.PlayerState.ENDED) {
          if (typeof triggerGrandFinale === 'function') triggerGrandFinale();
        }
      }
    }
  });
}

window.changeBombColor = function(color) {
  const bomb = document.getElementById('my-army-bomb');
  if (bomb) {
    bomb.style.setProperty('--glow-color', color);
    if(navigator.vibrate) navigator.vibrate(15);
  }
};

window.toggleStrobe = function() {
  const bomb = document.getElementById('my-army-bomb');
  if (!bomb) return;
  if(navigator.vibrate) navigator.vibrate(30);
  
  if (strobeInterval) {
    clearInterval(strobeInterval);
    strobeInterval = null;
    bomb.style.transform = 'scale(1)';
    bomb.style.opacity = '1';
  } else {
    strobeInterval = setInterval(() => {
      bomb.style.opacity = bomb.style.opacity === '1' ? '0.3' : '1';
      bomb.style.transform = bomb.style.transform === 'scale(1)' ? 'scale(1.05)' : 'scale(1)';
    }, 120);
  }
};

window.exitConcert = function() {
  const arena = document.getElementById('voyage-overlay');
  if (strobeInterval) clearInterval(strobeInterval);
  if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
  }
  if (concertPlayer && typeof concertPlayer.destroy === 'function') {
      concertPlayer.destroy();
  }
  if (arena) {
      arena.style.opacity = '0';
      setTimeout(() => arena.remove(), 1000);
  }
  
  // Stop the high-intensity waving animation of the main page lightstick
  const mainVessel = document.querySelector('.army-bomb-vessel');
  if (mainVessel) {
    mainVessel.classList.remove('army-bomb-launch-wave');
  }
};

window.triggerGrandFinale = function() {
  const wrapper = document.getElementById('video-wrapper');
  if (wrapper) wrapper.style.opacity = '0';
  
  if (typeof fireConfetti === 'function') {
      fireConfetti();
      setTimeout(fireConfetti, 1000);
  } else {
      launchFireworksFallback();
  }
  
  setTimeout(window.exitConcert, 6000);
};

function launchFireworksFallback() {
  if (!window.confetti) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    script.onload = () => {
      var end = Date.now() + 4000;
      (function frame() {
        window.confetti({ particleCount: 8, angle: 60, spread: 70, origin: { x: 0, y: 0.8 }, colors: ['#a855f7', '#fff'] });
        window.confetti({ particleCount: 8, angle: 120, spread: 70, origin: { x: 1, y: 0.8 }, colors: ['#a855f7', '#fff'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      }());
    };
    document.head.appendChild(script);
  } else {
    window.confetti({ particleCount: 150, spread: 100, origin: { y: 0.7 } });
  }
}
