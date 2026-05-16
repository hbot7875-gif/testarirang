// Concert Voyage — overrides launchTheVoyage (load after app.js)
const CONCERT_VIDEO_ID = 'EWVvgYT0Mm8';

let concertPlayer;
let strobeInterval;
let waveInterval;

function injectConcertVoyageCSS() {
  if (document.getElementById('concert-voyage-extra-css')) return;
  const s = document.createElement('style');
  s.id = 'concert-voyage-extra-css';
  s.textContent = `
    .vy-phase1-bg { position:absolute; inset:0; background:radial-gradient(ellipse at 50% 35%, #1a1040, #060612 55%, #000); }
    .vy-portal-ring { position:absolute; width:min(70vw,340px); height:min(70vw,340px); border-radius:50%; border:2px solid rgba(168,85,247,0.45); animation:vySpin 10s linear infinite; opacity:0.5; }
    .vy-portal-ring--2 { width:min(55vw,260px); height:min(55vw,260px); border-color:rgba(255,255,255,0.2); animation-direction:reverse; animation-duration:7s; }
    .vy-portal-core { position:absolute; width:min(30vw,120px); height:min(30vw,120px); border-radius:50%; background:radial-gradient(circle,#fff,rgba(168,85,247,0.7),transparent); animation:vyCorePulse 2s ease-in-out infinite; }
    @keyframes vySpin { to { transform:rotate(360deg); } }
    @keyframes vyCorePulse { 50% { transform:scale(1.15); opacity:1; } }
    .ship-warp-drive { animation:warpSpeed 3s cubic-bezier(0.5,0,0.2,1) forwards !important; }
    @keyframes warpSpeed { 0%{transform:scale(1) translateY(0);filter:blur(0) brightness(1)} 40%{transform:scale(0.9) translateY(10px);filter:blur(1px) brightness(1.5)} 100%{transform:scale(4) translateY(-100px);filter:blur(15px) brightness(5);opacity:0} }
    
    /* --- DYNAMIC MOVEMENT ANIMATIONS --- */
    #my-army-bomb {
        /* Smooth transitions for scaling and color changes */
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        /* Set default speed */
        --wave-speed: 4s; 
    }

    /* The 5 Movement Classes */
    .anim-sway { animation: moveSway var(--wave-speed) ease-in-out infinite alternate; }
    .anim-drift { animation: moveDrift var(--wave-speed) linear infinite; }
    .anim-ocean { animation: moveOcean var(--wave-speed) ease-in-out infinite alternate; }
    .anim-stars { animation: moveStars var(--wave-speed) ease-in-out infinite alternate; }
    .anim-flutter { animation: moveFlutter var(--wave-speed) linear infinite; }

    /* The Keyframes */
    @keyframes moveSway { 
        0% { transform: rotate(-6deg) translateY(0px) scale(1); } 
        100% { transform: rotate(5deg) translateY(-12px) scale(1.03); } 
    }
    @keyframes moveDrift { 
        0%, 100% { transform: translate(0, 0) rotate(0deg); } 
        25% { transform: translate(15px, -10px) rotate(3deg); } 
        50% { transform: translate(-5px, -20px) rotate(-2deg); } 
        75% { transform: translate(-15px, -5px) rotate(1deg); } 
    }
    @keyframes moveOcean { 
        0%, 100% { transform: translateY(0) rotate(0deg); } 
        50% { transform: translateY(-20px) rotate(4deg); } 
    }
    @keyframes moveStars { 
        0%, 100% { transform: translateY(0) rotate(0deg) scale(1); } 
        25% { transform: translateY(-12px) rotate(3deg) scale(1.05); } 
        75% { transform: translateY(-8px) rotate(-3deg) scale(0.95); } 
    }
    @keyframes moveFlutter { 
        0%, 100% { transform: rotate(0); } 
        25% { transform: rotate(-5deg) translate(-3px,-3px); } 
        50% { transform: rotate(0) translate(0,-5px); } 
        75% { transform: rotate(5deg) translate(3px,-3px); } 
    }

    /* Ensure smooth color fading on ambient layers */
    #ambient-glow, #bomb-back-glow {
        transition: background-color 1s ease;
    }

    /* --- SOFT GLASSMORPHISM UI --- */
    .soft-pill-btn {
        background: rgba(255,255,255,0.05); 
        border: 1px solid rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.6); 
        padding: 6px 12px; 
        border-radius: 12px;
        font-size: 9px; 
        font-family: 'Orbitron', sans-serif; 
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .soft-pill-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
    .soft-pill-btn.active {
        background: rgba(255,255,255,0.25); color: #fff; font-weight: bold;
        border-color: rgba(255,255,255,0.5); box-shadow: 0 0 10px rgba(255,255,255,0.2);
    }

    .soft-btn { border: none; outline: none; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .color-btn {
        width: 28px; height: 28px; border-radius: 50%;
        background: var(--btn-color);
        box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.5), inset -2px -2px 6px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.4);
    }
    .color-btn:hover { transform: translateY(-3px) scale(1.1); box-shadow: inset 2px 2px 6px rgba(255, 255, 255, 0.6), inset -2px -2px 6px rgba(0, 0, 0, 0.2), 0 8px 15px var(--btn-color); }
    .color-btn:active { transform: translateY(1px) scale(0.95); box-shadow: inset 3px 3px 8px rgba(0, 0, 0, 0.4); }

    .rainbow-btn { background: linear-gradient(135deg, #ef4444, #fbbf24, #22c55e, #3b82f6, #a855f7); }

    .text-btn {
        background: transparent; color: rgba(255, 255, 255, 0.8); font-size: 11px; font-weight: 900; 
        letter-spacing: 2px; font-family: 'Orbitron', sans-serif; text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        padding: 6px 12px; border-radius: 20px;
    }
    .text-btn:hover { color: #fff; background: rgba(255, 255, 255, 0.1); text-shadow: 0 0 10px rgba(255, 255, 255, 0.8); }

    /* Natural Video Aspect Ratio (Prevents weird cropping) */
    #youtube-player {
        width: 100vw !important;
        height: 56.25vw !important; 
        min-height: 100vh !important;
        object-fit: cover; 
        pointer-events: none;
    }

    /* Magical floating dust */
    .concert-dust {
        background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.6), transparent),
            radial-gradient(3px 3px at 60px 80px, rgba(255,255,255,0.4), transparent),
            radial-gradient(2px 2px at 100px 150px, rgba(255,255,255,0.5), transparent),
            radial-gradient(4px 4px at 150px 40px, rgba(255,255,255,0.2), transparent);
        background-repeat: repeat;
        background-size: 200px 200px;
        animation: magicDrift 20s linear infinite;
        mix-blend-mode: overlay;
    }

    @keyframes magicDrift {
        0% { transform: translateY(0px) translateX(0px); }
        100% { transform: translateY(-200px) translateX(-50px); }
    }

    /* Mobile Adjustments */
    @media (max-width: 600px) {
        #video-wrapper iframe {
            transform: scale(4.0) !important; /* Forces vertical fill on mobile */
        }
        #fan-zone {
            bottom: 22%; /* Raises the bomb slightly on tall screens */
        }
    }

    .vy-finale { position:absolute; inset:0; z-index:70; display:flex; flex-direction:column; align-items:center; justify-content:center; pointer-events:none; opacity:0; transition:opacity 0.5s; }
    .vy-finale--on { opacity:1; }
    .vy-finale__army { font-family:Orbitron,sans-serif; font-size:clamp(40px,10vw,64px); font-weight:900; color:#fff; letter-spacing:12px; text-shadow:0 0 40px #a855f7; }
  `;
  document.head.appendChild(s);
}

window.launchTheVoyage = function () {
  const existing = document.getElementById('voyage-overlay');
  if (existing) existing.remove();

  if (typeof ensureVoyageStyles === 'function') {
    ensureVoyageStyles();
  }
  injectConcertVoyageCSS();

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
    <div id="magic-flash" style="position: absolute; inset: 0; background: radial-gradient(circle, #fff 0%, #a855f7 50%, #000 100%); opacity: 0; pointer-events: none; z-index: 50; transition: opacity 2s ease-in;"></div>

    <!-- PHASE 2: THE CONCERT ARENA -->
    <div id="phase-2-concert" style="position: absolute; inset: 0; opacity: 0; pointer-events: none; z-index: 60; transition: opacity 2s ease-out; background: #020202; overflow: hidden;">
        
        <div id="video-wrapper" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 1;">
            <div id="youtube-player" style="width: 100vw; height: 56.25vw; min-height: 100vh; transform: scale(1.35); opacity: 0.85;"></div>
        </div>

        <div style="position: absolute; inset: 0; z-index: 2; pointer-events: none; background: radial-gradient(circle at 50% 60%, transparent 20%, rgba(0,0,0,0.6) 70%, #000 100%);"></div>
        
        <div id="ambient-glow" style="position: absolute; inset: 0; z-index: 3; background: var(--ambient-color, #a855f7); opacity: 0.15; mix-blend-mode: screen; pointer-events: none; transition: background 0.8s ease;"></div>

        <div class="concert-dust" style="position: absolute; inset: 0; z-index: 4; pointer-events: none;"></div>

        <div id="fan-zone" style="position: absolute; bottom: 12%; left: 50%; transform: translateX(-50%); z-index: 10; display: flex; flex-direction: column; align-items: center;">
            
            <div id="bomb-back-glow" style="position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 200px; background: var(--ambient-color, #a855f7); filter: blur(60px); opacity: 0.3; pointer-events: none; transition: background 0.8s ease;"></div>
            
            <div class="cs-bomb anim-sway" id="my-army-bomb" style="--glow-color: #a855f7; --wave-speed: 4s;">
                
                <div class="cs-sphere" style="
                    width: 100px; height: 100px; 
                    box-shadow: 0 0 50px var(--glow-color), inset 0 0 30px var(--glow-color); 
                    background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.1) 40%, rgba(0,0,0,0.5)); 
                    backdrop-filter: blur(8px) brightness(1.2); 
                    mix-blend-mode: hard-light; 
                    border: 1.5px solid rgba(255,255,255,0.4);
                    border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; z-index: 2;">
                    
                    <span class="cs-logo" style="text-shadow: 0 0 20px var(--glow-color); color: #fff; font-size: 36px; font-weight: 900; opacity: 0.95;">⟭⟬</span>
                </div>
                
                <div class="cs-handle" style="width: 22px; height: 90px; background: linear-gradient(90deg, #050505, #222, #050505); border-radius: 0 0 10px 10px; margin-top: -6px; z-index: 1; border: 1px solid rgba(255,255,255,0.15); box-shadow: inset 0 20px 20px rgba(0,0,0,0.9);"></div>
            </div>
        </div>

        <div id="lightstick-controls" class="soft-controls-panel" style="flex-direction: column; gap: 12px; padding: 16px 24px; position: absolute; bottom: 35px; left: 50%; transform: translateX(-50%); z-index: 20; background: rgba(20, 20, 25, 0.4); backdrop-filter: blur(16px) saturate(1.2); border: 1px solid rgba(255, 255, 255, 0.1); border-top: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), inset 0 -2px 10px rgba(0, 0, 0, 0.2); border-radius: 30px; display: flex; align-items: center; width: max-content; max-width: 95vw;">
            
            <div style="display: flex; gap: 12px; align-items: center; justify-content: center; flex-wrap: wrap;">
                <div style="display: flex; gap: 6px;">
                    <button class="soft-pill-btn active" onclick="setWavePattern('sway', this)">〰️ SWAY</button>
                    <button class="soft-pill-btn" onclick="setWavePattern('drift', this)">🪐 DRIFT</button>
                    <button class="soft-pill-btn" onclick="setWavePattern('ocean', this)">🌊 OCEAN</button>
                    <button class="soft-pill-btn" onclick="setWavePattern('stars', this)">✨ STARS</button>
                    <button class="soft-pill-btn" onclick="setWavePattern('flutter', this)">🦋 FLUTTER</button>
                </div>
                <div style="width: 1px; height: 14px; background: rgba(255,255,255,0.2);"></div>
                <div style="display: flex; gap: 6px;">
                    <button class="soft-pill-btn" onclick="setWaveSpeed(8, this)">1X</button>
                    <button class="soft-pill-btn active" onclick="setWaveSpeed(4, this)">2X</button>
                    <button class="soft-pill-btn" onclick="setWaveSpeed(2, this)">3X</button>
                </div>
            </div>

            <div style="width: 100%; height: 1px; background: rgba(255,255,255,0.08); border-radius: 2px;"></div>

            <div style="display: flex; gap: 14px; align-items: center; justify-content: center; flex-wrap: wrap;">
                <button class="soft-btn color-btn" style="--btn-color: #a855f7;" onclick="changeBombColor('#a855f7')"></button>
                <button class="soft-btn color-btn" style="--btn-color: #e879f9;" onclick="changeBombColor('#e879f9')"></button>
                <button class="soft-btn color-btn" style="--btn-color: #6366f1;" onclick="changeBombColor('#6366f1')"></button>
                <button class="soft-btn color-btn" style="--btn-color: #22c55e;" onclick="changeBombColor('#22c55e')"></button>
                <button class="soft-btn color-btn" style="--btn-color: #fbbf24;" onclick="changeBombColor('#fbbf24')"></button>
                <button class="soft-btn color-btn rainbow-btn" onclick="changeBombColor('rainbow')"></button>
                <div style="width: 1px; height: 18px; background: rgba(255,255,255,0.2); margin: 0 4px;"></div>
                <button class="soft-btn text-btn" onclick="toggleStrobe()">STROBE</button>
            </div>
        </div>

        <div id="concert-finale" class="vy-finale"><div class="vy-finale__army">ARMY</div></div>
        <button onclick="exitConcert()" style="position: absolute; top: 30px; right: 30px; z-index: 50; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); padding: 8px 16px; border-radius: 20px; cursor: pointer; font-family:'Orbitron', sans-serif; font-size:9px; font-weight:800; backdrop-filter: blur(5px); transition: all 0.2s; pointer-events: auto;">EXIT ARENA ✕</button>
    </div>
  `;

  document.body.appendChild(root);

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
  }, 3500);

  setTimeout(() => {
    initYouTubePlayer(CONCERT_VIDEO_ID);
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
  }, 6500);
};

function initYouTubePlayer(videoId) {
  if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
      setTimeout(() => initYouTubePlayer(videoId), 500);
      return;
  }
  concertPlayer = new YT.Player('youtube-player', {
    height: '100%',
    width: '100%',
    videoId: videoId, 
    playerVars: {
      'autoplay': 1, 'controls': 0, 'disablekb': 1, 'fs': 0, 'modestbranding': 1, 'rel': 0, 'showinfo': 0, 'playsinline': 1
    },
    events: {
      'onReady': (event) => { 
          event.target.playVideo(); 
          // Suggest maximum quality (Best effort as YT often ignores this on modern browsers)
          if (typeof event.target.setPlaybackQuality === 'function') {
              event.target.setPlaybackQuality('highres'); 
          }
      },
      'onStateChange': (event) => {
        if (event.data === YT.PlayerState.ENDED) {
          if (typeof triggerGrandFinale === 'function') triggerGrandFinale();
        }
      }
    }
  });
}

let strobeInterval = null;
let rainbowInterval = null;

// 1. Smooth Color Transition (Now with Rainbow Mode!)
window.changeBombColor = function(color) {
    const bomb = document.getElementById('my-army-bomb');
    const ambient = document.getElementById('ambient-glow');
    const backGlow = document.getElementById('bomb-back-glow');
    const crowd = document.querySelector('.virtual-crowd');
    
    // Stop the strobe or existing rainbow if running
    if (strobeInterval) { clearInterval(strobeInterval); strobeInterval = null; if (bomb) bomb.style.opacity = '1'; }
    if (rainbowInterval) { clearInterval(rainbowInterval); rainbowInterval = null; }

    const applyColor = (c) => {
        if (bomb) bomb.style.setProperty('--glow-color', c);
        if (ambient) ambient.style.backgroundColor = c;
        if (backGlow) backGlow.style.backgroundColor = c;
        if (crowd) crowd.style.setProperty('--ambient-color', c);
    };

    if (color === 'rainbow') {
        const colors = ['#a855f7','#e879f9','#6366f1','#22c55e','#fbbf24','#ef4444','#3b82f6'];
        let idx = 0;
        rainbowInterval = setInterval(() => {
            applyColor(colors[idx]);
            idx = (idx + 1) % colors.length;
        }, 1000); // 1-second smooth fade between colors
    } else {
        applyColor(color);
    }
    
    // Satisfying bump animation
    if (bomb) {
        bomb.style.transform = 'scale(1.1)';
        setTimeout(() => { bomb.style.transform = 'scale(1)'; }, 150);
        if (navigator.vibrate) navigator.vibrate(15);
    }
    
    // Auto-unmute the video on the first interaction
    if (concertPlayer && typeof concertPlayer.unMute === 'function') {
        concertPlayer.unMute();
        concertPlayer.setVolume(100);
    }
};

window.setWavePattern = function(pattern, btn) {
    const bomb = document.getElementById('my-army-bomb');
    if (bomb) {
        bomb.classList.remove('anim-sway', 'anim-drift', 'anim-ocean', 'anim-stars', 'anim-flutter');
        bomb.classList.add('anim-' + pattern);
    }
    
    // UI Toggle
    document.querySelectorAll('.soft-pill-btn').forEach(b => {
        if (['〰️ SWAY', '🪐 DRIFT', '🌊 OCEAN', '✨ STARS', '🦋 FLUTTER'].includes(b.innerText)) {
            b.classList.remove('active');
        }
    });
    if (btn) btn.classList.add('active');
    if (navigator.vibrate) navigator.vibrate(10);
};

window.setWaveSpeed = function(seconds, btn) {
    const bomb = document.getElementById('my-army-bomb');
    if (bomb) {
        bomb.style.setProperty('--wave-speed', seconds + 's');
    }
    
    // UI Toggle
    document.querySelectorAll('.soft-pill-btn').forEach(b => {
        if (['1X', '2X', '3X'].includes(b.innerText)) b.classList.remove('active');
    });
    if (btn) btn.classList.add('active');
    if (navigator.vibrate) navigator.vibrate(10);
};

// 2. The Strobe Effect
window.toggleStrobe = function() {
    const bomb = document.getElementById('my-army-bomb');
    if (!bomb) return;
    if (navigator.vibrate) navigator.vibrate(30);
    
    // Auto-unmute the video on the first interaction
    if (concertPlayer && typeof concertPlayer.unMute === 'function') {
        concertPlayer.unMute();
        concertPlayer.setVolume(100);
    }
    
    if (strobeInterval) {
        // Turn Strobe OFF
        clearInterval(strobeInterval);
        strobeInterval = null;
        bomb.style.opacity = '1';
    } else {
        // Turn Strobe ON
        strobeInterval = setInterval(() => {
            bomb.style.opacity = bomb.style.opacity === '1' ? '0.1' : '1';
        }, 100); // 100ms creates a fast, rave-like flash
    }
};

window.exitConcert = function() {
  const arena = document.getElementById('voyage-overlay');
  if (strobeInterval) clearInterval(strobeInterval);
  if (rainbowInterval) clearInterval(rainbowInterval);
  if (concertPlayer && typeof concertPlayer.destroy === 'function') {
      concertPlayer.destroy();
  }
  if (arena) {
      arena.style.opacity = '0';
      setTimeout(() => arena.remove(), 1000);
  }
};

window.triggerGrandFinale = function() {
  const wrapper = document.getElementById('video-wrapper');
  if (wrapper) wrapper.style.opacity = '0';
  const finale = document.getElementById('concert-finale');
  if (finale) finale.classList.add('vy-finale--on');

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
