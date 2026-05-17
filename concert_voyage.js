// Concert Voyage — overrides launchTheVoyage (load after app.js)
const CONCERT_VIDEO_ID = 'sj95YLW-7-g';const SWIM_CONCERT_LYRICS = [
  { time: 0, main: "Swim, Swim", sub: "BTS" },
  { time: 12, main: "Yeah, I bet you feel it now, baby", sub: "Especially since we've only known each other one day" },
  { time: 25, main: "But I've got to work shit out, baby", sub: "I'm exorcising demons, got 'em running 'round the block now" },
  { time: 37, main: "Location drop now", sub: "Pedal to the floor like you running from the cops now" },
  { time: 43, main: "Oh, what a cop out", sub: "You picked a dance with the devil and you lucked out" },
  
  // Chorus 1
  { time: 50, main: "The water's getting colder, let me in your ocean", sub: "Swim" },
  { time: 56, main: "Out in California, I've been forward stroking", sub: "Swim" },
  { time: 62, main: "So hard to ignore ya, especially when I'm smoking", sub: "Swim" },
  { time: 68, main: "The world is on my shoulders, keep your body open", sub: "Swim" },
  
  // Verse 2
  { time: 74, main: "Pop a couple pills in the daytime", sub: "Heard you got a friend, what's her head like?" },
  { time: 80, main: "Probably should've fucked on the first night", sub: "Now I gotta wait for the green light" },
  { time: 86, main: "I don't wanna wait for no green light", sub: "Narcolepsy got me feeling stage fright" },
  { time: 92, main: "Luckily I float at insane heights", sub: "Luckily, luckily, luckily, yeah" },
  
  // Pre-Chorus 2
  { time: 99, main: "Location drop now", sub: "Pedal to the floor like you running from the cops now" },
  { time: 105, main: "Oh, what a cop out", sub: "You picked a dance with the devil and you lucked out" },
  
  // Chorus 2
  { time: 111, main: "The water's getting colder, let me in your ocean", sub: "Swim" },
  { time: 117, main: "Out in California, I've been forward stroking", sub: "Swim" },
  { time: 123, main: "So hard to ignore ya, especially when I'm smoking", sub: "Swim" },
  { time: 129, main: "The world is on my shoulders, keep your body open", sub: "Swim" },
  
  // Bridge
  { time: 135, main: "I'm swimming, I'm swimming, I'm swimming, yeah", sub: "I'm swimming, I'm swimming, I'm swimming, yeah" },
  { time: 147, main: "Out in California, I've been forward stroking", sub: "Swim" },
  { time: 153, main: "So hard to ignore ya, keep your body open", sub: "Swim" },
  
  // Verse 3
  { time: 159, main: "Swim", sub: "Push the water to the edge and watch it drip" },
  { time: 165, main: "Check your footing, don't get caught up in the rip, no", sub: "I know I said I'd call, I never did, no" },
  { time: 171, main: "I know I said I'd call, I never did, no", sub: "Swim, swim" },
  { time: 177, main: "I can take you even though I've never been", sub: "The tide has currently been..." },
  
  // Chorus 3
  { time: 184, main: "The water's getting colder, let me in your ocean", sub: "Swim" },
  { time: 190, main: "Out in California, I've been forward stroking", sub: "Swim" },
  { time: 196, main: "So hard to ignore ya, especially when I'm smoking", sub: "Swim" },
  { time: 202, main: "The world is on my shoulders, keep your body open", sub: "Swim" },
  
  // Outro
  { time: 208, main: "Swim, Swim, Swim", sub: "BTS" }
];

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
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        --wave-speed: 4s; 
        transform-origin: bottom center !important;
    }

    .anim-sway { animation: moveSway var(--wave-speed) ease-in-out infinite alternate; }
    .anim-drift { animation: moveDrift var(--wave-speed) linear infinite; }
    .anim-ocean { animation: moveOcean var(--wave-speed) ease-in-out infinite alternate; }
    .anim-stars { animation: moveStars var(--wave-speed) ease-in-out infinite alternate; }
    .anim-flutter { animation: moveFlutter var(--wave-speed) linear infinite; }

    @keyframes moveSway { 
        0% { transform: rotate(-24deg) scale(1); } 
        100% { transform: rotate(24deg) scale(1.03); } 
    }
    @keyframes moveDrift { 
        0%, 100% { transform: translate(0, 0) rotate(0deg); } 
        25% { transform: translate(30px, -15px) rotate(10deg); } 
        50% { transform: translate(-10px, -30px) rotate(-8deg); } 
        75% { transform: translate(-30px, -10px) rotate(6deg); } 
    }
    @keyframes moveOcean { 
        0%, 100% { transform: translateY(0) rotate(0deg); } 
        50% { transform: translateY(-35px) rotate(12deg); } 
    }
    @keyframes moveStars { 
        0%, 100% { transform: translateY(0) rotate(0deg) scale(1); } 
        25% { transform: translateY(-24px) rotate(8deg) scale(1.06); } 
        75% { transform: translateY(-16px) rotate(-8deg) scale(0.94); } 
    }
    @keyframes moveFlutter { 
        0%, 100% { transform: rotate(0); } 
        25% { transform: rotate(-15deg) translate(-6px,-6px); } 
        50% { transform: rotate(0) translate(0,-12px); } 
        75% { transform: rotate(15deg) translate(6px,-6px); } 
    }

    #ambient-glow, #bomb-back-glow { transition: background-color 1s ease; }

    /* --- SOFT GLASSMORPHISM UI --- */
    .soft-controls-panel {
        position: absolute; bottom: 25px; left: 50%; transform: translateX(-50%); 
        z-index: 1000; background: rgba(15, 15, 20, 0.7); backdrop-filter: blur(25px); 
        border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 30px;
        display: flex; flex-direction: column; gap: 12px; padding: 18px 24px;
        width: max-content; max-width: 95vw; transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        overflow: visible !important; /* Ensure the toggle button is not clipped */
    }
    .soft-controls-panel.minimized {
        bottom: -165px; opacity: 0.6; filter: blur(2px) grayscale(1);
    }
    .panel-toggle-btn {
        position: absolute; top: -38px; left: 50%; transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff; border-radius: 15px; padding: 5px 18px; font-size: 10px; 
        font-family: 'Orbitron'; cursor: pointer; backdrop-filter: blur(12px);
        box-shadow: 0 -5px 15px rgba(0,0,0,0.3); transition: all 0.3s;
        display: flex; align-items: center; gap: 6px;
    }
    .panel-toggle-btn:hover { background: rgba(255, 255, 255, 0.3); transform: translateX(-50%) translateY(-2px); }

    .soft-pill-btn {
        background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.6); padding: 6px 12px; border-radius: 12px;
        font-size: 9px; font-family: 'Orbitron', sans-serif; cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .soft-pill-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
    .soft-pill-btn.active {
        background: rgba(255,255,255,0.25); color: #fff; font-weight: bold;
        border-color: rgba(255,255,255,0.5); box-shadow: 0 0 10px rgba(255,255,255,0.2);
    }

    .soft-btn { border: none; outline: none; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .color-btn {
        width: 28px; height: 28px; border-radius: 50%; background: var(--btn-color);
        box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.4), 0 4px 10px rgba(0, 0, 0, 0.4);
    }
    .color-btn:hover { transform: translateY(-3px) scale(1.1); box-shadow: inset 2px 2px 6px rgba(255, 255, 255, 0.6), inset -2px -2px 6px rgba(0, 0, 0, 0.2), 0 8px 15px var(--btn-color); }
    .color-btn:active { transform: translateY(1px) scale(0.95); box-shadow: inset 3px 3px 8px rgba(0, 0, 0, 0.4); }

    .rainbow-btn { background: linear-gradient(135deg, #ef4444, #fbbf24, #22c55e, #3b82f6, #a855f7); }

    .text-btn {
        background: transparent; color: #fff; font-size: 11px; font-weight: 900; 
        font-family: 'Orbitron'; padding: 6px 12px; border-radius: 20px;
    }
    .text-btn:hover { color: #fff; background: rgba(255, 255, 255, 0.1); text-shadow: 0 0 10px rgba(255, 255, 255, 0.8); }

    /* Natural Video Aspect Ratio (Prevents weird cropping) */
    #youtube-player {
        width: 100vw !important; height: 56.25vw !important; min-height: 100vh !important;
        object-fit: cover; opacity: 1 !important; /* CRITICAL: Full quality */
        pointer-events: none;
    }

    /* Magical floating dust */
    .concert-dust {
        background-image: radial-gradient(1px 1px at 20px 30px, #fff, transparent);
        background-repeat: repeat; background-size: 200px 200px;
        animation: magicDrift 20s linear infinite; mix-blend-mode: overlay; opacity: 0.3;
    }

    @keyframes magicDrift {
        0% { transform: translateY(0px) translateX(0px); }
        100% { transform: translateY(-200px) translateX(-50px); }
    }

    /* Mobile Adjustments */
    @media (max-width: 600px) {
        #video-wrapper iframe { transform: scale(4.0) !important; }
        #fan-zone { bottom: 20%; }
    }

    .vy-finale { position:absolute; inset:0; z-index:70; display:flex; flex-direction:column; align-items:center; justify-content:center; pointer-events:none; opacity:0; transition:opacity 1s; }
    .vy-finale--on { opacity:1; }
    .vy-finale__army { font-family:Orbitron; font-size:64px; font-weight:900; color:#fff; text-shadow:0 0 40px #a855f7; }

    /* Magical Interactivity: Stardust Trail */
    .bomb-sparkle {
        position: absolute; width: 4px; height: 4px; border-radius: 50%;
        pointer-events: none; z-index: 15; mix-blend-mode: screen;
        animation: sparkleFade 1s cubic-bezier(0.1, 1, 0.3, 1) forwards;
    }
    @keyframes sparkleFade {
        0% { transform: scale(1) translateY(0); opacity: 0.8; background: #fff; }
        100% { transform: scale(0) translateY(-25px); opacity: 0; }
    }

    /* Cultural Magic: Fanchants */
    .fanchant-word {
        position: absolute; bottom: 5%; left: 50%; transform: translateX(-50%);
        font-family: 'Orbitron', sans-serif; font-size: clamp(32px, 8vw, 80px);
        font-weight: 900; color: transparent; -webkit-text-stroke: 1px rgba(255, 255, 255, 0.6);
        text-shadow: 0 0 30px rgba(168, 85, 247, 0.8); pointer-events: none; z-index: 500;
        animation: fanchantRise 3s ease-out forwards; white-space: nowrap;
    }
    @keyframes fanchantRise {
        0% { transform: translate(-50%, 50px) scale(0.8); opacity: 0; }
        20% { transform: translate(-50%, 0px) scale(1); opacity: 1; }
        80% { transform: translate(-50%, -100px) scale(1.05); opacity: 1; }
        100% { transform: translate(-50%, -160px) scale(1.1); opacity: 0; filter: blur(10px); }
    }

    /* Lore Magic: Whalien 52 */
    .magic-whale {
        position: absolute; left: -20%; font-size: clamp(100px, 15vw, 200px);
        opacity: 0.05; filter: blur(10px) drop-shadow(0 0 40px #a855f7);
        pointer-events: none; z-index: 2; animation: whaleSwim 28s linear forwards;
    }
    @keyframes whaleSwim {
        0% { transform: translateX(0vw) translateY(0px) rotate(-10deg); }
        50% { transform: translateX(60vw) translateY(-40px) rotate(5deg); }
        100% { transform: translateX(125vw) translateY(10px) rotate(-15deg); }
    }
    @keyframes waveFloat {
        0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
        50% { transform: translateY(-6px) scale(1.05) rotate(5deg); }
    }
    @keyframes waveGlowPulse {
        0%, 100% { filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.6)); }
        50% { filter: drop-shadow(0 0 25px rgba(168, 85, 247, 0.9)); }
    }
    @keyframes starTwinkle {
        0% { opacity: 0.15; transform: scale(0.8); }
        100% { opacity: 0.85; transform: scale(1.2); }
    }
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
        <div id="warp-text" style="margin-top: 40px; font-family: 'Orbitron'; font-size: 14px; color: #a855f7; letter-spacing: 4px; text-transform: uppercase; animation: pulse 1s infinite;">Initiating Magic Shop Portal...</div>
    </div>

    <div id="magic-flash" style="position: absolute; inset: 0; background: radial-gradient(circle, #fff 0%, #a855f7 50%, #000 100%); opacity: 0; pointer-events: none; z-index: 50; transition: opacity 2s ease-in;"></div>

    <div id="phase-2-concert" style="position: absolute; inset: 0; opacity: 0; pointer-events: none; z-index: 60; transition: opacity 2s ease-out; background: #000; overflow: hidden;">
        
        <div id="video-wrapper" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 1;">
            <div id="youtube-player"></div>
        </div>

        <!-- 🔮 Ethereal glass filter to morph video into rich ambient light -->
        <div style="position: absolute; inset: 0; z-index: 2; pointer-events: none; background: radial-gradient(circle at 50% 40%, rgba(8, 5, 12, 0.45) 0%, rgba(4, 2, 8, 0.88) 75%, #020205 100%); backdrop-filter: blur(8px) saturate(1.8) brightness(0.65); -webkit-backdrop-filter: blur(8px) saturate(1.8) brightness(0.65);"></div>
        <div id="ambient-glow" style="position: absolute; inset: 0; z-index: 3; background: #a855f7; opacity: 0.12; mix-blend-mode: screen; pointer-events: none;"></div>
        <div class="concert-dust" style="z-index: 4; position: absolute; inset: 0; pointer-events: none;"></div>

        <!-- ✨ Floating Cosmic Stars (Twinkling Foreground) -->
        <div class="star-particles-container" style="position: absolute; inset: 0; z-index: 5; pointer-events: none; overflow: hidden;"></div>

        <!-- 🌸 Magical Song Header & Blossom -->
        <div id="song-header" style="position: absolute; top: 6%; left: 50%; transform: translateX(-50%); z-index: 25; text-align: center; font-family: 'Orbitron', sans-serif; pointer-events: none; width: 90%;">
            <div class="cherry-blossom-glow" style="font-size: 28px; animation: waveFloat 3s ease-in-out infinite, waveGlowPulse 2.5s infinite; color: #ff8da1; display: inline-block;">🌸</div>
            <h2 style="color: #fff; margin: 8px 0 2px; font-size: 24px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; text-shadow: 0 0 15px rgba(255,255,255,0.4);">SWIM</h2>
            <p style="color: rgba(255,255,255,0.6); font-size: 11px; letter-spacing: 1.5px; margin: 0;">BTS • Arirang</p>
        </div>

        <div id="fan-zone" style="position: absolute; bottom: 28%; left: 50%; transform: translateX(-50%); z-index: 10; display: flex; flex-direction: column; align-items: center;">
            <div id="bomb-back-glow" style="position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%); width: 260px; height: 260px; background: #a855f7; filter: blur(90px); opacity: 0.25; pointer-events: none;"></div>
            <div class="cs-bomb anim-sway" id="my-army-bomb" style="--glow-color: #a855f7; --wave-speed: 4s;">
                <!-- 🔮 Premium, highly-translucent glass sphere with back-glow -->
                <div class="cs-sphere" style="width: 105px; height: 105px; box-shadow: 0 0 45px var(--glow-color), inset 0 0 25px var(--glow-color); background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.45), rgba(255,255,255,0.05) 40%, rgba(0,0,0,0.65)); border: 1.5px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; z-index: 2; backdrop-filter: blur(8px) brightness(1.2); mix-blend-mode: hard-light;">
                    <span class="cs-logo" style="text-shadow: 0 0 20px var(--glow-color); color: #fff; font-size: 34px; font-weight: 900; opacity: 0.95;">⟭⟬</span>
                </div>
                <div class="cs-handle" style="width: 22px; height: 85px; background: linear-gradient(90deg, #111, #252525 40%, #0c0c0c); border-radius: 0 0 10px 10px; margin-top: -6px; border: 1px solid rgba(255,255,255,0.1); box-shadow: inset 0 10px 15px rgba(0,0,0,0.9);"></div>
            </div>
        </div>

        <!-- 🎤 Glowing Active Lyrics Display -->
        <div id="lyrics-container" style="position: absolute; bottom: 18%; left: 50%; transform: translateX(-50%); z-index: 20; text-align: center; width: 90%; min-height: 48px; pointer-events: none; font-family: 'Share Tech Mono', monospace; transition: all 0.5s ease;">
            <div id="lyric-main" style="font-size: 18px; font-weight: 800; color: #fff; text-shadow: 0 0 15px var(--glow-color, #a855f7); margin-bottom: 4px; letter-spacing: 0.5px; opacity: 0; transform: translateY(10px); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);">"Swim, Swim"</div>
            <div id="lyric-sub" style="font-size: 11px; color: rgba(255,255,255,0.5); letter-spacing: 1px; opacity: 0; transform: translateY(10px); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);">Water falling off your skin</div>
        </div>

        <div id="lightstick-controls" class="soft-controls-panel">
            <button class="panel-toggle-btn" onclick="toggleControlPanel()">HIDE CONTROLS ▽</button>
            <div style="display: flex; gap: 10px; align-items: center; justify-content: center; flex-wrap: wrap;">
                <button class="soft-pill-btn active" onclick="setWavePattern('sway', this)">SWAY</button>
                <button class="soft-pill-btn" onclick="setWavePattern('drift', this)">DRIFT</button>
                <button class="soft-pill-btn" onclick="setWavePattern('ocean', this)">OCEAN</button>
                <button class="soft-pill-btn" onclick="setWavePattern('stars', this)">STARS</button>
                <button class="soft-pill-btn" onclick="setWavePattern('flutter', this)">FLUTTER</button>
                <div style="width: 1px; height: 14px; background: rgba(255,255,255,0.2);"></div>
                <button class="soft-pill-btn active" onclick="setWaveSpeed(4, this)">2X</button>
            </div>
            <div style="width: 100%; height: 1px; background: rgba(255,255,255,0.1);"></div>
            <div style="display: flex; gap: 15px; align-items: center; justify-content: center;">
                <button class="soft-btn color-btn" style="--btn-color: #a855f7;" onclick="changeBombColor('#a855f7')"></button>
                <button class="soft-btn color-btn" style="--btn-color: #3b82f6;" onclick="changeBombColor('#3b82f6')"></button>
                <button class="soft-btn color-btn" style="--btn-color: #22c55e;" onclick="changeBombColor('#22c55e')"></button>
                <button class="soft-btn color-btn rainbow-btn" onclick="changeBombColor('rainbow')"></button>
                <div style="width: 1px; height: 18px; background: rgba(255,255,255,0.2);"></div>
                <button class="soft-btn text-btn" onclick="triggerFanchant()" style="letter-spacing: 2px;">FANCHANT</button>
                <button class="soft-btn text-btn" onclick="toggleStrobe()">STROBE</button>
            </div>
        </div>

        <div id="concert-finale" class="vy-finale"><div class="vy-finale__army">ARMY</div></div>
        <button onclick="exitConcert()" style="position: absolute; top: 30px; right: 30px; z-index: 50; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-family:'Orbitron'; font-size:10px;">EXIT ARENA ✕</button>
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

      // 1. Magical Twinkling Background Stars
      const starsContainer = phase2.querySelector('.star-particles-container');
      if (starsContainer) {
          starsContainer.innerHTML = '';
          const starCount = 45;
          for (let i = 0; i < starCount; i++) {
              const star = document.createElement('div');
              star.style.position = 'absolute';
              star.style.width = (Math.random() * 2 + 0.8) + 'px';
              star.style.height = star.style.width;
              star.style.background = '#fff';
              star.style.borderRadius = '50%';
              star.style.top = (Math.random() * 85) + '%';
              star.style.left = (Math.random() * 95) + '%';
              star.style.opacity = (Math.random() * 0.5 + 0.25).toFixed(2);
              star.style.boxShadow = '0 0 4px #fff';
              star.style.animation = `starTwinkle ${Math.random() * 4 + 2}s infinite alternate ease-in-out`;
              starsContainer.appendChild(star);
          }
      }

      // 2. Interactive Magic: Stardust Trail (Mouse + Touch)
      const handleMove = (e) => {
          if (Math.random() > 0.4) return;
          const x = e.clientX || (e.touches && e.touches[0].clientX);
          const y = e.clientY || (e.touches && e.touches[0].clientY);
          if (!x || !y) return;

          const bomb = document.getElementById('my-army-bomb');
          const color = bomb ? getComputedStyle(bomb).getPropertyValue('--glow-color').trim() : '#a855f7';
          
          const spark = document.createElement('div');
          spark.className = 'bomb-sparkle';
          spark.style.left = x + 'px';
          spark.style.top = y + 'px';
          spark.style.boxShadow = `0 0 15px ${color}, 0 0 30px ${color}`;
          phase2.appendChild(spark);
          setTimeout(() => spark.remove(), 1000);
      };
      phase2.addEventListener('mousemove', handleMove);
      phase2.addEventListener('touchmove', handleMove);

      // 3. Lore Magic: Whalien 52 (Every 35s)
      setInterval(() => {
          const arena = document.getElementById('phase-2-concert');
          if (!arena) return;
          const whale = document.createElement('div');
          whale.className = 'magic-whale';
          whale.innerText = '🐋';
          whale.style.top = (20 + Math.random() * 40) + '%';
          arena.appendChild(whale);
          setTimeout(() => whale.remove(), 28000);
      }, 35000);
    }
  }, 5000);

  window.triggerFanchant = function() {
      const names = ["KIM NAMJOON", "KIM SEOKJIN", "MIN YOONGI", "JUNG HOSEOK", "PARK JIMIN", "KIM TAEHYUNG", "JEON JUNGKOOK", "BTS!"];
      const arena = document.getElementById('phase-2-concert');
      if (!arena) return;
      if (navigator.vibrate) navigator.vibrate([40, 80, 40]);
      
      names.forEach((name, i) => {
          setTimeout(() => {
              const word = document.createElement('div');
              word.className = 'fanchant-word';
              word.innerText = name;
              arena.appendChild(word);
              setTimeout(() => word.remove(), 3500);
          }, i * 850);
      });
  };

  setTimeout(() => {
    const flash = document.getElementById('magic-flash');
    if (flash) { flash.style.transition = 'opacity 3s'; flash.style.opacity = '0'; }
  }, 6500);
};

window.toggleControlPanel = function() {
    const panel = document.getElementById('lightstick-controls');
    const btn = panel.querySelector('.panel-toggle-btn');
    if (panel.classList.contains('minimized')) {
        panel.classList.remove('minimized');
        btn.innerHTML = 'HIDE CONTROLS ▽';
    } else {
        panel.classList.add('minimized');
        btn.innerHTML = 'SHOW CONTROLS △';
    }
};

let lyricsInterval = null;
function startLyricsSynchronizer() {
  if (lyricsInterval) clearInterval(lyricsInterval);
  lyricsInterval = setInterval(() => {
    const p2 = document.getElementById('phase-2-concert');
    if (!p2) {
      clearInterval(lyricsInterval);
      lyricsInterval = null;
      return;
    }
    if (concertPlayer && typeof concertPlayer.getCurrentTime === 'function') {
      const time = concertPlayer.getCurrentTime();
      let active = SWIM_CONCERT_LYRICS[0];
      for (let i = 0; i < SWIM_CONCERT_LYRICS.length; i++) {
        if (time >= SWIM_CONCERT_LYRICS[i].time) {
          active = SWIM_CONCERT_LYRICS[i];
        } else {
          break;
        }
      }
      
      const mainEl = document.getElementById('lyric-main');
      const subEl = document.getElementById('lyric-sub');
      if (mainEl && subEl) {
        if (mainEl.innerText !== `"${active.main}"`) {
          mainEl.style.opacity = '0';
          mainEl.style.transform = 'translateY(10px)';
          subEl.style.opacity = '0';
          subEl.style.transform = 'translateY(10px)';
          
          setTimeout(() => {
            mainEl.innerText = `"${active.main}"`;
            subEl.innerText = active.sub;
            mainEl.style.opacity = '1';
            mainEl.style.transform = 'translateY(0)';
            subEl.style.opacity = '1';
            subEl.style.transform = 'translateY(0)';
          }, 300);
        }
      }
    }
  }, 250);
}

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
          startLyricsSynchronizer();
      },
      'onStateChange': (event) => {
        if (event.data === YT.PlayerState.PLAYING) {
          startLyricsSynchronizer();
        }
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
  if (lyricsInterval) { clearInterval(lyricsInterval); lyricsInterval = null; }
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
  launchFireworksFallback();
  setTimeout(window.exitConcert, 8000);
};

function launchFireworksFallback() {
  if (!window.confetti) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    script.onload = () => { doFireworksBurst(); };
    document.head.appendChild(script);
  } else {
    doFireworksBurst();
  }
}

function doFireworksBurst() {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 40, spread: 360, ticks: 60, zIndex: 10000 };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 50 * (timeLeft / duration);
    // Multiple explosive bursts
    window.confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#a855f7', '#ffffff'] });
    window.confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#ff00ff', '#ffffff'] });
    window.confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.4, 0.6), y: Math.random() - 0.2 }, colors: ['#3b82f6', '#ffffff'] });
  }, 250);
}
