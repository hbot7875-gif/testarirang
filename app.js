// =============================================
// ██████  BTS COMEBACK MISSION — ARIRANG EDITION
// ██████  Frontend v2.0 — Optimized & Refactored
// =============================================
//
// KEY IMPROVEMENTS OVER v1.0:
// ───────────────────────────────────────────────
// ✅ ApiClient with smart caching (3-5x fewer API calls)
// ✅ Request deduplication (no duplicate in-flight requests)f
// ✅ 15s request timeout via AbortControllerf
// ✅ Timers manager (prevents interval stacking / memory leaks)
// ✅ Visibility-aware polling (pauses when tab is hidden)
// ✅ Debounced sync & notification checks
// ✅ Proper loading overlay with guaranteed dismiss
// ✅ Clean auth flow with session validationf
// ✅ Removed fragile _baseGoTo override pattern
// ✅ Added JSDoc for all public functions
// =============================================



// ==================== CONFIG ====================
const CONFIG = {
  API_URL: 'https://xyivyebbafqwthvlwzlm.supabase.co/functions/v1/arirang-btsbackend',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5aXZ5ZWJiYWZxd3Rodmx3emxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NDY0MTUsImV4cCI6MjA4ODUyMjQxNX0.K-ysUclHXprTAtsW6bp6HoVcq4tSr1m-4xiZXkrIpn4',
  ADMIN_AGENT_NO: 'AGENT000',

  // ═══════════════════════════════════════════════════
  // TEAMS — Colors matched to team profile pictures
  // ═══════════════════════════════════════════════════
  //
  // Team MONO:      PFP is a dark silhouette with silver/grey tones
  // Team Happy:     PFP is bright neon pink/magenta "HAPPY" text on teal
  // Team D-Day:     PFP is dark red/crimson military aesthetic
  // Team Hopeworld: PFP is vibrant coral/orange psychedelic art
  // Team Muse:      PFP is deep pink/magenta with purple undertones
  // Team Layover:   PFP is cool blue with artistic brush strokes
  // Team Golden:    PFP is warm gold/amber with dark figure
  //
  TEAMS: {
    'Team MONO':      { color: '#b8c5d6', emoji: '', ref: 'RM — mono.' },
    'Team Happy':     { color: '#ff2d78', emoji: '', ref: 'Jin — Happy' },
    'Team D-Day':     { color: '#c62828', emoji: '', ref: 'Agust D — D-DAY' },
    'Team Hopeworld': { color: '#ff6d3a', emoji: '', ref: 'J-Hope — Hope World' },
    'Team Muse':      { color: '#d946a8', emoji: '', ref: 'Jimin — MUSE' },
    'Team Layover':   { color: '#42a5f5', emoji: '', ref: 'V — Layover' },
    'Team Golden':    { color: '#e5a528', emoji: '', ref: 'Jungkook — GOLDEN' },
  },

  TEAM_PFPS: {
    'Team MONO':      'https://raw.githubusercontent.com/hbot7875-gif/bts-arirang-site/2cb644455395a199506344a5fb1a94bb1ff71604/7team%20pfps/teammono.jpeg',
    'Team Happy':     'https://raw.githubusercontent.com/hbot7875-gif/bts-arirang-site/2cb644455395a199506344a5fb1a94bb1ff71604/7team%20pfps/teamhappy.jpg',
    'Team D-Day':     'https://raw.githubusercontent.com/hbot7875-gif/bts-arirang-site/2cb644455395a199506344a5fb1a94bb1ff71604/7team%20pfps/teamdday.jpg',
    'Team Hopeworld': 'https://raw.githubusercontent.com/hbot7875-gif/bts-arirang-site/2cb644455395a199506344a5fb1a94bb1ff71604/7team%20pfps/teamhopeworld.jpg',
    'Team Muse':      'https://raw.githubusercontent.com/hbot7875-gif/bts-arirang-site/2cb644455395a199506344a5fb1a94bb1ff71604/7team%20pfps/teammuse.jpg',
    'Team Layover':   'https://raw.githubusercontent.com/hbot7875-gif/bts-arirang-site/2cb644455395a199506344a5fb1a94bb1ff71604/7team%20pfps/teamlayover.jpg',
    'Team Golden':    'https://raw.githubusercontent.com/hbot7875-gif/bts-arirang-site/2cb644455395a199506344a5fb1a94bb1ff71604/7team%20pfps/teamgolden.jpg',
  },
 
 GC_LINKS: {
    main: "https://ig.me/j/AbYKU2kWlAPh2ORh/",
    playlist: "https://www.instagram.com/channel/AbajsdwblYDVcZ41/?igsh=ZzRuc2FrenlzdHM5",
    teams: {
      'Team MONO':      'https://ig.me/j/Abb_PCXJ-2nX7TEl/',
      'Team Happy':     'https://ig.me/j/Aba2IYzGYrnUS4fG/',
      'Team D-Day':     'https://ig.me/j/AbYVGQ1IqPRxWTfh/',
      'Team Hopeworld': 'https://ig.me/j/Aba0JfNTWjVLymch/',
      'Team Muse':      'https://ig.me/j/AbZPkazSbkvRaRED/',
      'Team Layover':   'https://ig.me/j/Abb-9beEsolxN9u3/',
      'Team Golden':    'https://ig.me/j/AbZeh2wCVARX3oVt/',
    }
  },

  ARIRANG_TRACKS: [
    'Swim',
    'Body to Body',
    'Hooligan',
    'Aliens',
    'FYA',
    'Merry Go Round',
    'One More Night',
    'Please',
    'Into the Sun',
    'No. 29',
    'Normal',
    'they don’t know ’bout us',
    '2.0',
    'Like Animals'
  ],

  SIDE_MISSION_TRACKS: [
    { name: 'Wild Flower',                          artist: 'RM',      weeklyReq: 20 },
    { name: "Don't Say You Love Me",                artist: 'BTS',     weeklyReq: 20 },
    { name: 'Haegeum',                              artist: 'Agust D', weeklyReq: 20 },
    { name: "Killin' It Girl (feat. GloRilla)",     artist: 'BTS',     weeklyReq: 20 },
  ],

  // Requirements
  ALBUM_2X_DAILY:         2,
  UNIT_WEEKLY:            25,
  SIDE_MISSION_WEEKLY:    20,
  SIDE_MISSION_MIN_DAILY: 1,
  MAX_POLICE_REPORTS:     3,

  // Badge system
  BADGE_REPO_URL: 'https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/main/lvl1badges/',
  TOTAL_BADGE_IMAGES: 64,
  EXCLUDE_BADGES: [],

  get BADGE_POOL() {
    if (this._badgePoolCache) return this._badgePoolCache;
    const pool = [];
    for (let i = 1; i <= this.TOTAL_BADGE_IMAGES; i++) {
      if (!this.EXCLUDE_BADGES.includes(i)) {
        pool.push(`${this.BADGE_REPO_URL}BTS%20(${i}).jpg`);
      }
    }
    this._badgePoolCache = pool;
    return pool;
  },

  // Battle dates
  BATTLE_START:    '2026-03-22T00:00:00+05:30',
  BATTLE_END:      '2026-07-22T23:59:59+05:30',
  SHOW_COUNTDOWN:  false,

  WEEK_DATES: {
    'Week 1':  '2026-03-22', 'Week 2':  '2026-03-29',
    'Week 3':  '2026-04-05', 'Week 4':  '2026-04-12',
    'Week 5':  '2026-04-19', 'Week 6':  '2026-04-26',
    'Week 7':  '2026-05-03', 'Week 8':  '2026-05-10',
    'Week 9':  '2026-05-17', 'Week 10': '2026-05-24',
    'Week 11': '2026-05-31', 'Week 12': '2026-06-07',
    'Week 13': '2026-06-14', 'Week 14': '2026-06-21',
    'Week 15': '2026-06-28', 'Week 16': '2026-07-05',
    'Week 17': '2026-07-12', 'Week 18': '2026-07-19',
  },

  ALBUM_CHALLENGE: {
    REQUIRED_STREAMS:  2,
    CHALLENGE_NAME:    'Arirang 2X',
    BADGE_NAME:        '2X Master',
    BADGE_DESCRIPTION: 'Completed Daily Arirang 2X Challenge',
  },

  SECRET_MISSIONS: {
    xpPerMission:      5,
    maxMissionsPerTeam: 5,
    maxTeamBonus:      25,
  },

  MISSION_TYPES: {
    'switch_app':   { name: 'Switch App',   icon: '🔄', description: 'Switch to YouTube/Apple Music for 1 hour.' },
    'filler_mode':  { name: 'Filler Mode',  icon: '🧬', description: 'Stream 1 BTS Song + 2 Non-Kpop songs.' },
    'old_songs':    { name: 'Old Songs',    icon: '🕰️', description: 'Stream tracks older than 2 years.' },
    'stream_party': { name: 'Stream Party', icon: '🎉', description: 'Everyone streams the exact same playlist NOW.' },
    'custom':       { name: 'Custom Task',  icon: '⭐', description: 'Special instruction from Admin.' },
  },

  ACTIVITY_TYPES: {
    'streak_update':      { icon: '🔥', color: '#ff6b35',  template: d => `<strong>${d.name}</strong> hit a <strong class="hl">${d.streak}-day</strong> streak!` },
    'team_surge':         { icon: '⚡', color: '#ff0000',  template: d => `<strong style="color:${teamColor(d.team)}">${d.team}</strong> surged with <strong class="hl">${d.streams}</strong> streams!` },
    'results_release':    { icon: '🏆', color: '#ffd700',  template: d => d.message || 'Results released!' },
    'team_dissolved':     { icon: '💀', color: '#ff0000',  template: d => `<strong>${d.team}</strong> has been dissolved!` },
    'leader_update':      { icon: '📈', color: '#00ff66',  template: d => d.message || `${d.team} leveled up!` },
    'new_agent':          { icon: '🆕', color: '#60a5fa',  template: d => d.message || 'New agent enlisted!' },
    'secret_mission':     { icon: '🕵️', color: '#a855f7',  template: d => {
      const title = d.title || 'Secret Mission';
      const isFail = title.includes('(Failed)');
      return `<strong style="color:${teamColor(d.team)}">${d.team}</strong> ${isFail ? 'failed' : 'completed'}: <strong style="color:${isFail ? '#ff0000' : '#00ff66'}">${title}</strong> (+${d.xp || 0} XP)`;
    }},
    'side_mission_alert': { icon: '⚠️', color: '#ff0000',  template: d => d.message || 'Side mission alert!' },
    'unit_completed':     { icon: '✨', color: '#00ff66',  template: d => d.message || 'Unit completed!' },
    'agent_retired':      { icon: '👋', color: '#888',     template: d => d.message || 'An agent has retired.' },
    'sotd_winner':        { icon: '🎵', color: '#ffd700',  template: d => `${d.team} won Song of the Day!` },
    'album2x_completed':  { icon: '💿', color: '#c56cf0',  template: d => `<strong>${d.name}</strong> completed Album 2X!` },
    'goal_completed':     { icon: '🎯', color: '#00ff66',  template: d => `<strong style="color:${teamColor(d.team)}">${d.team}</strong> completed <strong class="hl">${d.goal}</strong>!` },
  },

  GUIDES: {
    'home':          { icon: '🏠', title: 'Mission HQ',       text: '7 teams. 17 weeks. Stream BTS ARIRANG daily. Complete all missions to win!' },
    'profile':       { icon: '📋', title: 'Agent Dossier',     text: 'Your stats, contributions, streak, and leave status.' },
    'goals':         { icon: '🎯', title: 'Team Goals',        text: 'Hit the team streaming targets for tracks and albums.' },
    'album2x':       { icon: '💿', title: 'Arirang 2X',        text: 'Stream every ARIRANG track 2x PER DAY. 14 tracks × 2 = 28 streams daily.' },
    'unit':          { icon: '⚡', title: 'Arirang Unit',       text: 'Your team gets 2 tracks each week. Stream each 25x. All members must complete for +25 XP bonus.' },
    'sidemissions':  { icon: '🛡️', title: 'Side Missions',     text: '4 tracks × 20x/week. Must stream every day. Team fails = WARNING → DISSOLUTION.' },
    'rankings':      { icon: '🏆', title: 'Global Rankings',   text: 'Top agents across all teams. Friendly competition — we are ONE ARMY! 💜' },
    'teams':         { icon: '⚔️', title: 'Team Battle',       text: 'All 7 teams ranked by XP. Complete all 7 badges to activate the Army Bomb.' },
    'chat':          { icon: '💬', title: 'Secret Comms',       text: 'Chat with fellow agents. Be kind — we are ONE ARMY! 💜' },
    'announcements': { icon: '📢', title: 'Announcements',     text: 'Important news from HQ. Check regularly!' },
    'protocol148':   { icon: '🧠', title: '148 Protocol',      text: "RM's strategic analysis. Your personal daily streaming plan with exact numbers." },
    'guide':         { icon: '📚', title: 'Agent Manual',       text: 'Everything you need to know about the ARIRANG MISSION.' },
  },
};

const MISSION_NARRATIVES = {
  trackGoals: {
    member: '🐨', memberName: 'Namjoon', meaning: 'Strategy', icon: '🎯', color: '#b8c5d6',
    bridge: "In a vast ocean, the one who knows where to swim reaches shore first. Don't scatter your energy — focus streams on your priority tracks and hit the targets that matter most.",
  },
  albumGoals: {
    member: '🐿️', memberName: 'Hobi', meaning: 'Energy', icon: '💿', color: '#ff6d3a',
    bridge: "14 tracks need sustained energy, not bursts. Stream the full ARIRANG album top-to-bottom — Hobi poured his brightness into every line, so don't skip a single one.",
  },
  album2x: {
    member: '🐥', memberName: 'Jimin', meaning: 'Rhythm', icon: '🔁', color: '#d946a8',
    bridge: "The ocean doesn't stop between waves — neither should you. Stream every ARIRANG track at least twice today. Morning and night, keep the current flowing.",
  },
  arirangUnit: {
    member: '🐻', memberName: 'Taehyung', meaning: 'Unity', icon: '⚡', color: '#42a5f5',
    bridge: "You're never swimming alone. Your unit has assigned tracks that only your team covers — stream them hard to keep each other afloat.",
  },
  sideMission: {
    member: '🐰', memberName: 'Jungkook', meaning: 'Survival', icon: '🛡️', color: '#e5a528',
    bridge: "Main missions drain energy, but survival means covering all fronts. Don't skip your 4 side tracks this week — push through the fatigue.",
  },
  attendance: {
    member: '🐹', memberName: 'Jin', meaning: 'Duty', icon: '📋', color: '#ff2d78',
    bridge: "A ship cannot sail if the crew is missing. Finding balance means showing up for your members. Upload your Spotify Recents to prove you are on board every week.",
  },
  police: {
    member: '🐱', memberName: 'Yoongi', meaning: 'Discipline', icon: '👮', color: '#c62828',
    bridge: "No shortcuts, no cheating. Taking the easy way would ruin everything we built.",
  },
};

const renderHeader = (icon, title, color) => `
  <div style="display:flex; align-items:center; gap:12px; margin:32px 0 20px 0;">
    <div style="font-size:18px;">${icon}</div>
    <div style="font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:4px; color:${color};">${title}</div>
    <div style="flex:1; height:1px; background:linear-gradient(90deg, ${color}66, transparent);"></div>
  </div>
`;

// ==================== CONSTANTS ====================
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const STREAK_CONFIG = {
  THRESHOLD:   10,
  MAX_FREEZES: 2,
  RISK_HOURS:  4,
};

const ARMY_BOMB_BADGES = [
  { 
    member: '🐨 Namjoon', memberName: 'Namjoon', mission: 'Track Goals', icon: '🎯', 
    key: 'trackGoalPassed', color: '#b8c5d6', 
    req: 'Team must reach 100% on all priority Track Targets.',
    importance: 'Direction gives purpose — this badge means the team moved with intention.' 
  },
  { 
    member: '🐹 Jin', memberName: 'Jin', mission: 'Attendance', icon: '📋', 
    key: 'attendanceConfirmed', color: '#ff2d78', 
    req: 'Every agent in the squad must submit their weekend check-in.',
    importance: 'Presence is love in action — this badge honors showing up for each other.' 
  },
  { 
    member: '🐱 Yoongi', memberName: 'Yoongi', mission: 'Police Reports', icon: '👮', 
    key: 'policeConfirmed', color: '#c62828', 
    req: 'Team must have 3 or fewer confirmed integrity violations.',
    importance: 'Discipline protects the mission — staying focused under pressure.' 
  },
  { 
    member: '🐿️ Hobi', memberName: 'Hobi', mission: 'Album Goals', icon: '💿', 
    key: 'albumGoalPassed', color: '#ff6d3a', 
    req: 'Team must complete the total Arirang Album streaming target.',
    importance: 'Momentum creates belief — the spark that keeps the ship moving.' 
  },
  { 
    member: '🐥 Jimin', memberName: 'Jimin', mission: 'Album 2X', icon: '🔁', 
    key: 'album2xPassed', color: '#d946a8', 
    req: 'Every squad member must complete the Arirang 2X daily challenge.',
    importance: 'Consistency turns effort into results — celebrating daily dedication.' 
  },
  { 
    member: '🐻 Taehyung', memberName: 'Taehyung', mission: 'Arirang Units', icon: '⚡', 
    key: 'arirangUnitPassed', color: '#42a5f5', 
    req: 'All unit members must secure their assigned tracks (25x each).',
    importance: 'Uniqueness wins difficult battles — courage in special assignments.' 
  },
  { 
    member: '🐰 Jungkook', memberName: 'Jungkook', mission: 'Side Missions', icon: '🛡️', 
    key: 'sideMissionPassed', color: '#e5a528', 
    req: 'Survival Protocol: No member can fail the 7-day side mission streak.',
    importance: 'Balance prevents blind spots — ensuring nothing is neglected.' 
  },
];

  // ==================== ROUTER & STATE ====================
  // Used to map page names to rendering functions later
  const PAGE_RENDERERS = {};
  
  const STATE = {
    agentNo:      null,
    week:         'Week 1',
    weeks:        [],
    data:         null,
    page:         'home',
    isAdmin:      false,
    adminSession: null,
    lastUpdated:  null,
  
    // Notification tracking
    notifications: [],
    isCheckingNotifications: false,
    hasShownPopupThisSession: false,
    lastChecked: {
      badges: 0,
      _badgesInitialized: false,
      songOfDay: null,
      seenAnnouncementIds: [],
      seenMissionIds: [],
      _missionBaselineSet: false,
      weekResults: [],
    },
  };
  
  
  // ==================== DOM HELPER ====================
  /** @param {string} id @returns {HTMLElement|null} */
  const $ = id => document.getElementById(id);
  
  
  // ==================== TEAM HELPERS ====================
  const teamColor = team => CONFIG.TEAMS[team]?.color || '#ff0000';
  
  const teamPfp = team => CONFIG.TEAM_PFPS[team] || '';
  
  // If emoji is empty, we return an image tag pointing to the PFP!
  const teamEmoji = team => {
      const emoji = CONFIG.TEAMS[team]?.emoji;
      if (emoji) return emoji;
      
      const pfp = teamPfp(team);
      if (pfp) return `<img src="${pfp}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" alt="${team}">`;
      
      return '🎵'; // Ultimate fallback
  };
  
  /**
   * Sanitize string to prevent XSS
   * v2.0: Added backtick escaping
   */
  function sanitize(str) {
    if (!str) return '';
    const map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;', '`': '&#96;' };
    return String(str).replace(/[<>"'&`]/g, c => map[c] || c);
  }
  
  
  // ==================== DATE HELPERS ====================
  /** Get current date string in KST timezone (YYYY-MM-DD) */
  function getKSTDateString() {
    const kst = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    return `${kst.getFullYear()}-${String(kst.getMonth() + 1).padStart(2, '0')}-${String(kst.getDate()).padStart(2, '0')}`;
  }
  
  /** Format ISO date to readable "Mar 22, 3:45 PM IST" */
  /** 
 * Formats a date string to a readable "Mar 22, 3:45 PM IST" 
 * v2.0: Supports both names to prevent ReferenceErrors
 */
function timeAgo(dateStr) {
  if (!dateStr) return 'Unknown';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata', // Matches your config
      month: 'short', 
      day: 'numeric',
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true
    }) + ' IST';
  } catch (e) { 
    return dateStr; 
  }
}

// Create the alias so pages calling "formatTimeAgo" don't crash
const formatTimeAgo = timeAgo;
  
  /** Get remaining days for a given week label */
  function getDaysRemaining(weekLabel) {
    const startStr = CONFIG.WEEK_DATES?.[weekLabel];
    if (!startStr) return 7;
    const [y, m, d] = startStr.split('-').map(Number);
    const end = new Date(y, m - 1, d + 7);
    return Math.max(0, Math.ceil((end - Date.now()) / 86_400_000));
  }
  
  /** Check if a week's end date has passed */
  function isWeekCompleted(weekLabel) {
    const startStr = CONFIG.WEEK_DATES?.[weekLabel];
    if (!startStr) return false;
    const [y, m, d] = startStr.split('-').map(Number);
    return Date.now() >= new Date(y, m - 1, d + 7).getTime();
  }
  /** Get array of 7 date strings (YYYY-MM-DD) for a specific week */
function getWeekDates(weekLabel) {
  const startStr = CONFIG.WEEK_DATES?.[weekLabel];
  const dates =[];
  
  if (startStr) {
    // Parse safely as UTC to prevent local timezone shifts
    const start = new Date(startStr + 'T00:00:00Z');
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(start.getTime() + i * 86400000).toISOString().split('T')[0]);
    }
  } else {
    // Fallback: Generate current Sun-Sat week if missing
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - d.getDay() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
  }
  return dates;
}
  
  // =============================================
  // ██████  NEW IN v2.0: TIMER MANAGER
  // =============================================
  const Timers = {
    _intervals: new Map(),
    _timeouts:  new Map(),
  
    setInterval(name, fn, ms) {
      this.clearInterval(name);
      this._intervals.set(name, window.setInterval(fn, ms));
    },
  
    clearInterval(name) {
      if (this._intervals.has(name)) {
        window.clearInterval(this._intervals.get(name));
        this._intervals.delete(name);
      }
    },
  
    setTimeout(name, fn, ms) {
      this.clearTimeout(name);
      this._timeouts.set(name, window.setTimeout(() => {
        this._timeouts.delete(name);
        fn();
      }, ms));
    },
  
    clearTimeout(name) {
      if (this._timeouts.has(name)) {
        window.clearTimeout(this._timeouts.get(name));
        this._timeouts.delete(name);
      }
    },
  
    clearAll() {
      this._intervals.forEach(id => window.clearInterval(id));
      this._intervals.clear();
      this._timeouts.forEach(id => window.clearTimeout(id));
      this._timeouts.clear();
    },
  };
  // ↑↑↑ Timers object CLOSED here — nothing else inside it ↑↑↑
  
  
  // ── Loading Screen Quote Rotation ──
  (function initLoadingQuotes() {
    const quotes = document.querySelectorAll('.wisdom-quote');
    if (quotes.length === 0) return;
  
    let currentIndex = 0;
  
    Timers.setInterval('loading-quotes', () => {
      const loading = document.getElementById('loading');
      if (!loading || loading.style.display === 'none' || loading.style.opacity === '0') {
        Timers.clearInterval('loading-quotes');
        return;
      }
  
      quotes[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % quotes.length;
      quotes[currentIndex].classList.add('active');
    }, 3500);
  })();
  
  
  // ── Hide Loading Screen ──
  function hideLoadingScreen() {
    Timers.clearInterval('loading-quotes');
  
    const loading = document.getElementById('loading');
    if (!loading) return;
  
    const fill = loading.querySelector('.loading-progress-fill');
    if (fill) {
      fill.style.animation = 'none';
      fill.style.width = '100%';
      fill.style.transition = 'width 0.3s ease';
    }
  
    const status = loading.querySelector('.loading-status');
    if (status) status.textContent = 'Mission Dashboard Ready';
  
    setTimeout(() => {
      loading.style.opacity = '0';
      loading.addEventListener('transitionend', () => {
        loading.style.display = 'none';
      }, { once: true });
  
      setTimeout(() => {
        if (loading.parentNode) loading.style.display = 'none';
      }, 1000);
    }, 400);
  }
  // =============================================
  // ██████  NEW IN v2.0: API CLIENT
  // =============================================
  // Features:
  //  • Response caching with configurable TTL
  //  • In-flight request deduplication
  //  • 15s timeout via AbortController
  //  • Selective cache invalidation
  //  • Silent mode for background requests
  // =============================================
  const Api = {
    _cache:   new Map(),
    _pending: new Map(),
  
    /**
     * Make an API call with optional caching and dedup.
     *
     * @param {string} action — API action name
     * @param {object} [params={}] — Additional payload
     * @param {object} [opts={}] — Options
     * @param {boolean} [opts.cache=false] — Cache the response
     * @param {number}  [opts.ttl=30000] — Cache TTL in ms
     * @param {boolean} [opts.dedupe=true] — Deduplicate in-flight requests
     * @param {boolean} [opts.silent=false] — Suppress console errors
     * @returns {Promise<object>}
     *
     * @example
     * // Normal call
     * const data = await Api.call('getDashboardData');
     *
     * // Cached for 60s, deduped
     * const feed = await Api.call('getActivityFeed', { limit: 5 }, { cache: true, ttl: 60000 });
     *
     * // Silent background call
     * await Api.call('heartbeat', {}, { silent: true, dedupe: false });
     */
    async call(action, params = {}, opts = {}) {
      const { cache = false, ttl = 30_000, dedupe = true, silent = false } = opts;
      const key = this._key(action, params);
  
      // 1) Check cache
      if (cache) {
        const hit = this._cache.get(key);
        if (hit && (Date.now() - hit.ts < ttl)) {
          return hit.data;
        }
      }
  
      // 2) Deduplicate in-flight requests
      //    If another caller already fired the same request, piggyback on it
      if (dedupe && this._pending.has(key)) {
        return this._pending.get(key);
      }
  
      // 3) Fire the request
      const promise = this._request(action, params, silent);
  
      if (dedupe) {
        this._pending.set(key, promise);
      }
  
      try {
        const data = await promise;
  
        // 4) Cache successful responses
        if (cache && data) {
          this._cache.set(key, { data, ts: Date.now() });
        }
  
        return data;
      } finally {
        this._pending.delete(key);
      }
    },
  
    /** Internal fetch with AbortController timeout */
    /** Internal fetch with AbortController timeout */
    async _request(action, params, silent) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15_000);
  
      try {
        const res = await fetch(CONFIG.API_URL, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}` // <--- ADD THIS LINE
          },
          signal: controller.signal,
          body: JSON.stringify({
            action,
            agentNo: STATE.agentNo,
            week: STATE.week,
            ...params,
          }),
        });
  
        if (!res.ok) throw new Error(`Server Error: ${res.status}`);
  
        const data = await res.json();
        if (data.error && !data.success) throw new Error(data.error);
  
        return data;
      } catch (err) {
        if (err.name === 'AbortError') {
          const timeoutErr = new Error('Request timed out (15s)');
          if (!silent) console.warn(`API [${action}]: timed out`);
          throw timeoutErr;
        }
        if (!silent) console.error(`API [${action}]:`, err.message);
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
    },
  
    /** Build a cache key from action + params */
    _key(action, params) {
      // Exclude agentNo/week from key since they come from STATE
      return `${action}::${JSON.stringify(params)}`;
    },
  
    /**
     * Invalidate cache entries.
     * @param {string} [pattern] — If provided, only invalidate keys containing this string.
     *                              If omitted, clears entire cache.
     */
    invalidate(pattern) {
      if (!pattern) {
        this._cache.clear();
        return;
      }
      for (const key of this._cache.keys()) {
        if (key.includes(pattern)) this._cache.delete(key);
      }
    },
  };
  
  // Legacy alias — old code uses `api('action', params)`
  // v2.0: Wraps new ApiClient for backward compatibility
  async function api(action, params = {}) {
    return Api.call(action, params);
  }
  
  
  // ==================== TOAST SYSTEM ====================
  // v2.0: Queue-based, prevents toast stacking, guaranteed cleanup
  const Toast = {
    _current: null,
    _queue: [],
  
    /**
     * Show a toast notification
     * @param {string} msg
     * @param {'success'|'error'|'info'} [type='info']
     */
    show(msg, type = 'info') {
      // If a toast is already showing, replace it immediately
      if (this._current) {
        this._current.remove();
        this._current = null;
      }
  
      const colors = {
        success: { bg: 'rgba(0,40,0,0.95)',  border: '#00ff66', icon: '✅' },
        error:   { bg: 'rgba(40,0,0,0.95)',  border: '#ff0000', icon: '⚠️' },
        info:    { bg: 'rgba(20,20,20,0.95)', border: '#ff0000', icon: 'ℹ️' },
      };
      const c = colors[type] || colors.info;
  
      const el = document.createElement('div');
      el.className = 'toast-mini';
      el.innerHTML = `<span>${c.icon}</span><span>${sanitize(msg)}</span>`;
      el.style.cssText = `
        position:fixed;top:16px;left:50%;transform:translateX(-50%) translateY(-80px);
        padding:10px 18px;background:${c.bg};border:1px solid ${c.border};
        color:#fff;display:inline-flex;align-items:center;gap:8px;font-size:12px;
        z-index:999999;opacity:0;transition:all 0.3s ease;
        box-shadow:0 4px 20px rgba(0,0,0,0.5);
        font-weight:700;text-transform:uppercase;letter-spacing:1px;
        border-radius:4px;max-width:90vw;
      `;
      document.body.appendChild(el);
      this._current = el;
  
      // Animate in
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateX(-50%) translateY(0)';
      });
  
      // Auto-dismiss
      Timers.setTimeout('toast-dismiss', () => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-50%) translateY(-80px)';
        Timers.setTimeout('toast-remove', () => {
          el.remove();
          if (this._current === el) this._current = null;
        }, 300);
      }, 4000);
    },
  };
  
  // Global alias for backward compatibility
  function showToast(msg, type = 'info') {
    Toast.show(msg, type);
  }
  
  
  // ==================== LOADING OVERLAY ====================
  const Loading = {
    _visible: false,
  
    show() {
      if (this._visible) return;
      this._visible = true;
      const el = $('loading');
      if (el) {
        el.style.display = 'flex'; 
        el.style.opacity = '1';
        el.style.pointerEvents = 'all';
      }
      Timers.setTimeout('loading-safety', () => this.hide(), 15_000);
    },
  
    hide() {
      this._visible = false;
      Timers.clearTimeout('loading-safety');
      Timers.clearInterval('loading-quotes'); // Stop the quotes
      
      const el = $('loading');
      if (!el) return;
  
      // Fill progress bar to 100%
      const fill = el.querySelector('.loading-progress-fill');
      if (fill) {
        fill.style.animation = 'none';
        fill.style.width = '100%';
        fill.style.transition = 'width 0.4s ease';
      }
  
      // Update status text
      const status = el.querySelector('.loading-status');
      if (status) status.textContent = 'Mission Dashboard Ready';
  
      // Fade out
      Timers.setTimeout('loading-fadeout', () => {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        Timers.setTimeout('loading-none', () => {
          if (!this._visible) el.style.display = 'none';
        }, 600);
      }, 500);
    },
  
    get isVisible() { return this._visible; },
  };
  
  // Legacy alias
  function loading(show) {
    show ? Loading.show() : Loading.hide();
  }
  // Add to your Part 1 after the loading system
  
  const MEMBER_QUOTES = [
    { member: 'rm', text: '"Love for life... at your own pace"', author: 'RM' },
    { member: 'jin', text: '"Finding balance was precious and happy"', author: 'Jin' },
    { member: 'suga', text: '"The groove of this track is a kick"', author: 'SUGA' },
    { member: 'jhope', text: '"We poured all our positive energy"', author: 'j-hope' },
    { member: 'jimin', text: '"Like a current that never stops"', author: 'Jimin' },
    { member: 'v', text: '"We\'re swimming right next to you"', author: 'V' },
    { member: 'jk', text: '"I hope this feels like a gift"', author: 'Jung Kook' },
  ];
  
  let currentQuoteIndex = 0;
  
  function rotateLoadingQuotes() {
    const quotes = document.querySelectorAll('.wisdom-quote');
    if (quotes.length === 0) return;
  
    quotes[currentQuoteIndex].classList.remove('active');
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    quotes[currentQuoteIndex].classList.add('active');
  }
  
  // Start rotation when loading appears
  const loadingEl = document.getElementById('loading');
  if (loadingEl) {
    const quoteInterval = setInterval(rotateLoadingQuotes, 3000);
    
    // Stop rotation when loading completes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.style.opacity === '0') {
          clearInterval(quoteInterval);
        }
      });
    });
    
    observer.observe(loadingEl, { attributes: true, attributeFilter: ['style'] });
  }
  // ==================== COUNTDOWN ====================
  // v2.0: Uses Timers manager, no global window._cdInterval
  function renderCountdown() {
    if (!CONFIG.SHOW_COUNTDOWN) return '';
  
    const diff = new Date(CONFIG.BATTLE_START).getTime() - Date.now();
    if (diff <= 0) {
      return `<div class="countdown-bar"><span class="cd-live">● BATTLE ACTIVE</span></div>`;
    }
  
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1_000);
  
    return `
      <div class="countdown-bar" id="countdownBar">
        <span class="cd-label">BATTLE BEGINS</span>
        <div class="cd-blocks">
          <div class="cd-block"><span class="cd-num" id="cdD">${String(d).padStart(2,'0')}</span><span class="cd-lbl">D</span></div>
          <div class="cd-block"><span class="cd-num" id="cdH">${String(h).padStart(2,'0')}</span><span class="cd-lbl">H</span></div>
          <div class="cd-block"><span class="cd-num" id="cdM">${String(m).padStart(2,'0')}</span><span class="cd-lbl">M</span></div>
          <div class="cd-block"><span class="cd-num" id="cdS">${String(s).padStart(2,'0')}</span><span class="cd-lbl">S</span></div>
        </div>
      </div>
    `;
  }
  
  function startCountdown() {
    Timers.setInterval('countdown', () => {
      const diff = new Date(CONFIG.BATTLE_START).getTime() - Date.now();
  
      if (diff <= 0) {
        Timers.clearInterval('countdown');
        const bar = $('countdownBar');
        if (bar) bar.innerHTML = '<span class="cd-live">● BATTLE ACTIVE</span>';
        return;
      }
  
      const d = Math.floor(diff / 86_400_000);
      const h = Math.floor((diff % 86_400_000) / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
  
      const dE = $('cdD'), hE = $('cdH'), mE = $('cdM'), sE = $('cdS');
      if (dE) dE.textContent = String(d).padStart(2, '0');
      if (hE) hE.textContent = String(h).padStart(2, '0');
      if (mE) mE.textContent = String(m).padStart(2, '0');
      if (sE) sE.textContent = String(s).padStart(2, '0');
    }, 1000);
  }
  
  
  // ==================== AUTH ====================
  // v2.0: Cleaner session management, proper cleanup on logout
  
  function checkAuth() {
    const saved = localStorage.getItem('arirang_agent');
    
    if (!saved) {
      // If no user is saved, we are on the login screen.
      // Hide loading screen so user can see the login form.
      Loading.hide(); 
      return; 
    }
  
    try {
      const agent = JSON.parse(saved);
      STATE.agentNo = agent.agentNo || agent.agent_no;
      STATE.isAdmin = STATE.agentNo === CONFIG.ADMIN_AGENT_NO;
      restoreAdminSession();
      
      // Logged in! Now go to app/lock logic
      initApp();
    } catch (e) {
      localStorage.removeItem('arirang_agent');
      Loading.hide();
    }
  }
  
  async function doLogin() {
    const id = $('loginId')?.value?.trim().toUpperCase();
    const pw = $('loginPw')?.value;
    const err = $('loginErr');
  
    if (!id || !pw) {
      if (err) err.textContent = 'Enter Agent ID and password';
      return;
    }
  
    if (err) err.textContent = 'Authenticating...';
  
    try {
      const d = await Api.call('loginAgent', { agentNo: id, password: pw }, { dedupe: false });
  
      if (d.success) {
        const agent = d.agent;
        STATE.agentNo = agent.agentNo || agent.agent_no;
        STATE.isAdmin = STATE.agentNo === CONFIG.ADMIN_AGENT_NO;
        localStorage.setItem('arirang_agent', JSON.stringify(agent));
        if (err) err.textContent = '';
        initApp();
      } else {
        if (err) err.textContent = d.error || 'Access denied';
      }
    } catch (e) {
      if (err) err.textContent = 'Connection failed — try again';
    }
  }
  
  // ==================== AUTH FUNCTIONS ====================
  function doLogout() {
    // Fire-and-forget cleanup
    Api.call('removeOnlineUser', { agentNo: STATE.agentNo }, { silent: true, dedupe: false }).catch(() => {});
  
    // Clear all state
    STATE.agentNo = null;
    STATE.data = null;
    STATE.isAdmin = false;
    STATE.adminSession = null;
  
    localStorage.removeItem('arirang_agent');
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminExpiry');
  
    // Clear all timers
    Timers.clearAll();
  
    // Clear API cache
    Api.invalidate();
  
    // ✅ Hide lock screen if showing
    const lockEl = document.getElementById('missionLock');
    if (lockEl) lockEl.style.display = 'none';
  
    location.reload();
  }
  // NO EXTRA BRACKET HERE
  /** Restore admin session from localStorage if still valid */
  function restoreAdminSession() {
    if (STATE.agentNo !== CONFIG.ADMIN_AGENT_NO) return;
  
    const session = localStorage.getItem('adminSession');
    const expiry  = localStorage.getItem('adminExpiry');
  
    if (session && expiry && Date.now() < parseInt(expiry, 10)) {
      STATE.isAdmin = true;
      STATE.adminSession = session;
    }
  }
  
  
  // ==================== MISSION LOCK SYSTEM ====================
  const MISSION_CONFIG = {
    // Set to true to lock dashboard for all non-admins
    LOCKED: false,
    
    // Launch date (KST)
    LAUNCH_DATE: '2026-03-22T00:00:00+09:00',
    
    // Admins who can bypass (add your agent IDs)
    BYPASS_AGENTS: ['AGENT000', ''], 
  };
  
  function checkMissionLock() {
    // Always allow admins to bypass the lock screen
    if (MISSION_CONFIG.BYPASS_AGENTS.includes(STATE.agentNo)) {
      hideMissionLock();
      return;
    }
    
    // Check if mission is manually locked via config
    if (MISSION_CONFIG.LOCKED) {
      showMissionLock();
      return;
    }
    
    // Check if launch date has passed
    const now = Date.now();
    const launchTime = new Date(MISSION_CONFIG.LAUNCH_DATE).getTime();
    
    if (now < launchTime) {
      showMissionLock();
    } else {
      hideMissionLock();
    }
  }
  
  function showMissionLock() {
    const lockEl = document.getElementById('missionLock');
    if (lockEl) {
      lockEl.style.display = 'flex';
      
      // 1. Fill the Agent ID on the lock screen
      const displayEl = document.getElementById('lockAgentNo');
      if (displayEl) {
        displayEl.textContent = STATE.agentNo || "Agent";
      }
      
      // 2. Start the countdown
      startLaunchCountdown();
      
      // 3. Hide the actual app UI
      const appEl = document.getElementById('app');
      if (appEl) appEl.style.display = 'none';
  
      // 4. IMPORTANT: Force hide the loading screen so the lock screen is visible
      if (typeof Loading !== 'undefined') {
         Loading.hide();
      } else {
         const loadEl = document.getElementById('loading');
         if (loadEl) loadEl.style.opacity = '0';
      }
    }
  }
  
  function hideMissionLock() {
    const lockEl = document.getElementById('missionLock');
    if (lockEl) lockEl.style.display = 'none';
    
    // Show main app UI
    const appEl = document.getElementById('app');
    if (appEl) appEl.style.display = 'flex';
  }
  
  function startLaunchCountdown() {
    const container = document.getElementById('launchCountdown');
    if (!container) return;
    
    function updateCountdown() {
      const now = Date.now();
      const launchTime = new Date(MISSION_CONFIG.LAUNCH_DATE).getTime();
      const diff = launchTime - now;
      
      if (diff <= 0) {
        container.innerHTML = '<div style="font-size:1.5rem;color:var(--courage-amber);font-weight:900;">🔒 AWAITING HQ CLEARANCE</div>';
        
        // Stop the timer
        Timers.clearInterval('launchCountdown');
        
       
        return;
      }
      
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      
      container.innerHTML = `
        <div class="launch-timer">
          <div class="timer-block"><div class="timer-num">${String(days).padStart(2, '0')}</div><div class="timer-label">DAYS</div></div>
          <div class="timer-sep">:</div>
          <div class="timer-block"><div class="timer-num">${String(hours).padStart(2, '0')}</div><div class="timer-label">HRS</div></div>
          <div class="timer-sep">:</div>
          <div class="timer-block"><div class="timer-num">${String(mins).padStart(2, '0')}</div><div class="timer-label">MIN</div></div>
          <div class="timer-sep">:</div>
          <div class="timer-block"><div class="timer-num">${String(secs).padStart(2, '0')}</div><div class="timer-label">SEC</div></div>
        </div>
      `;
    }
    
    updateCountdown();
    Timers.setInterval('launchCountdown', updateCountdown, 1000);
  }
  
  // ==================== INIT APP ====================
  // v2.0: Clean startup sequence with visibility handling
  function initApp() {
    // 1. MUST hide the login overlay
    const loginEl = document.getElementById('loginOverlay');
    if (loginEl) loginEl.style.display = 'none'; 
  
    // 2. Show admin nav if applicable
    if (STATE.isAdmin || STATE.agentNo === CONFIG.ADMIN_AGENT_NO) {
      const adminNav = document.getElementById('adminNav');
      if (adminNav) adminNav.style.display = 'block';
    }
  
    // 3. CHECK MISSION LOCK FIRST
    checkMissionLock();
    
    // 4. If mission is locked for non-admins, STOP here 
    // (The countdown screen is now safely showing)
    if (MISSION_CONFIG.LOCKED && !MISSION_CONFIG.BYPASS_AGENTS.includes(STATE.agentNo)) {
      return; 
    }
  
    // 5. If unlocked or bypassed -> Start the main application
    const appEl = document.getElementById('app');
    if (appEl) appEl.style.display = 'flex';
  
    startHeartbeat();
    startOnlinePolling();
    loadDashboard();
    setupVisibilityHandler();
setTimeout(checkHTOnboarding, 2500); // Show popup after dash loads
}
  
  
  // ==================== HEARTBEAT & ONLINE ====================
  // v2.0: Uses Timers manager, visibility-aware, silent API calls
  
  function startHeartbeat() {
    sendHeartbeat(); // Immediate first call
    Timers.setInterval('heartbeat', sendHeartbeat, 30_000);
  }
  
  async function sendHeartbeat() {
    try {
      await Api.call('heartbeat', { agentNo: STATE.agentNo }, { silent: true, dedupe: false, cache: false });
    } catch { /* silent */ }
  }
  
  function startOnlinePolling() {
    loadOnlineCount(); // Immediate
    Timers.setInterval('online', loadOnlineCount, 60_000);
  }
  
  async function loadOnlineCount() {
    try {
      const d = await Api.call('getOnlineCount', {}, { cache: true, ttl: 45_000, silent: true });
      if (d.success) {
        const el = $('onlineCount');
        if (el) el.textContent = d.online || 0;
      }
    } catch { /* silent */ }
  }
  
  /**
   * v2.0: Pause all polling when tab is hidden, resume when visible.
   * This saves significant bandwidth and API quota.
   */
  function setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause expensive polling
        Timers.clearInterval('heartbeat');
        Timers.clearInterval('online');
        Timers.clearInterval('chat');
      } else {
        // Resume with immediate execution
        if (!STATE.agentNo) return;
  
        sendHeartbeat();
        Timers.setInterval('heartbeat', sendHeartbeat, 30_000);
  
        loadOnlineCount();
        Timers.setInterval('online', loadOnlineCount, 60_000);
  
        // Resume chat polling only if on chat 
        if (STATE.page === 'chat') {
          loadChat();
          Timers.setInterval('chat', loadChat, 10_000);
        }
  
        // Refresh notifications on tab return
        Timers.setTimeout('notif-resume', () => {
          if (typeof checkNotifications === 'function') checkNotifications();
        }, 1500);
      }
    });
  }
  
  
  // ==================== NAVIGATION ====================
  // v2.0: Combined goTo +  renderer in one function.
  //        Removed the fragile _baseGoTo override pattern.
  //        Added closeSidebar() integration for mobile.
  
  /**  → render function mapping (populated as render functions are defined) */
  const _RENDERERS = {};
  
  /**
   * Navigate to a , update nav highlight, render content.
   * @param {string}  —  name (matches id="page-{name}")
   */
  function goTo(page) {
    // Close sidebar on navigation (mobile)
    if (typeof closeSidebar === 'function') {
      closeSidebar();
    }
  
    STATE.page = page;
  
    // Hide all pages, show target
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pageEl = $('page-' + page);
    if (pageEl) pageEl.classList.add('active');
  
    // Update sidebar nav highlights
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.remove('active');
      if (n.getAttribute('onclick')?.includes(`'${page}'`)) {
        n.classList.add('active');
      }
    });
  
    // Close mobile sidebar (legacy support)
    $('sidebar')?.classList.remove('open');
    const overlay = $('sidebarOverlay');
    if (overlay) overlay.style.display = 'none';
  
    // Scroll content to top
    document.querySelector('.pages-wrapper')?.scrollTo({ top: 0, behavior: 'instant' });
  
    // Stop chat polling when leaving chat
    if (page !== 'chat') {
      Timers.clearInterval('chat');
    }
  
    // Call the page's render function if one exists
    const renderer = PAGE_RENDERERS[page];
    if (renderer) {
      try { renderer(); }
      catch (e) { console.error(`Render error [${page}]:`, e); }
    }
  }
  
  
  
  // ==================== LOAD DASHBOARD ====================
  // v2.0: Parallel data fetching where possible, proper error recovery
  
  /** Track if a dashboard load is already in progress */
  let _dashboardLoading = false;
  
  async function loadDashboard() {
    // Prevent overlapping dashboard loads
    if (_dashboardLoading) return;
    _dashboardLoading = true;
  
    Loading.show();
  
    try {
      const d = await Api.call('getDashboardData', { agentNo: STATE.agentNo });
  
      if (!d.success) {
        showToast(d.error || 'Failed to load dashboard', 'error');
        return;
      }
  
      // Update state
      STATE.data = d;
      STATE.week = d.week;
      STATE.weeks = d.availableWeeks || [];
      STATE.lastUpdated = d.lastUpdated;
  
      // Update sidebar agent info
      updateSidebarAgent(d.agent);
  
      // Setup week selector
      setupWeekSelector();
  
      // Render home page
      renderHome();
  
      // Start countdown
      startCountdown();
  
      // Check notifications after a short delay (non-blocking)
      Timers.setTimeout('notif-check', () => {
        if (typeof checkNotifications === 'function') checkNotifications();
      }, 2000);
  
    } catch (e) {
      showToast('Failed to connect to HQ', 'error');
      console.error('Dashboard load error:', e);
    } finally {
      Loading.hide();
      _dashboardLoading = false;
    }
  }
  
  /** Update sidebar with agent info from dashboard data */
  /** Update sidebar with agent info from dashboard data */
  /** Update sidebar with agent info from dashboard data */
  function updateSidebarAgent(agent) {
  if (!agent?.profile) return;

  const { name, team } = agent.profile;
  const tColor = teamColor(team);

  if ($('sbName')) $('sbName').textContent = name;
  if ($('sbTeam')) $('sbTeam').textContent = team;
  if ($('sbId'))   $('sbId').textContent = STATE.agentNo;

  const sbPfp = $('sbPfp');
  if (sbPfp) {
    sbPfp.style.setProperty('--team-color', tColor);
    
    const pfpUrl = teamPfp(team);
    // Add the online dot back in since we are overwriting innerHTML
    const onlineDot = '<div class="online-dot"></div>';
    
    if (pfpUrl) {
      sbPfp.innerHTML = `<img src="${pfpUrl}" alt="${team}">${onlineDot}`;
    } else {
      sbPfp.innerHTML = `<span>${teamEmoji(team)}</span>${onlineDot}`;
    }
  }
}
  /** Populate the week dropdown in sidebar */
  function setupWeekSelector() {
  const select = $('weekSelect');
  if (!select) return;
  
  // 1. Force the active week into the array, even if the DB is empty
  if (STATE.week && !STATE.weeks.includes(STATE.week)) {
     STATE.weeks.push(STATE.week);
  }

  // 2. Erase "Pre Season" from the dropdown permanently
  const cleanWeeks = STATE.weeks.filter(w => !w.toLowerCase().includes('pre'));

  select.innerHTML = cleanWeeks.map(w =>
    `<option value="${w}" ${w === STATE.week ? 'selected' : ''}>${w}</option>`
  ).join('');

  select.onchange = function() {
    STATE.week = this.value;
    Api.invalidate(); 
    loadDashboard();
  };
}
  
  
  // ==================== SYNC ====================
  // v2.0: Debounced, prevents double-clicks, invalidates cache after sync
  
  let _syncInProgress = false;
  
  async function syncData() {
    if (_syncInProgress) return;
    _syncInProgress = true;
  
    const btn = $('syncBtn');
    if (btn) { btn.textContent = '⟳ SYNCING...'; btn.disabled = true; }
  
    try {
      const d = await Api.call('refreshAgentStats', { agentNo: STATE.agentNo }, { dedupe: false, cache: false });
  
      if (d.success) {
        if (d.alreadySynced) {
          if (btn) btn.textContent = `⏱ ${d.message}`;
        } else {
          if (btn) btn.textContent = '✓ SYNCED';
          showToast('Data synced!', 'success');
  
          // Invalidate cache so dashboard reloads fresh data
          Api.invalidate();
  
          // Reload dashboard after short delay
          Timers.setTimeout('post-sync-reload', () => loadDashboard(), 800);
        }
      } else {
        if (btn) btn.textContent = '✗ FAILED';
        showToast(d.error || 'Sync failed', 'error');
      }
    } catch (e) {
      if (btn) btn.textContent = '✗ ERROR';
      showToast('Sync failed', 'error');
    }
  
    // Reset button after 5s
    Timers.setTimeout('sync-btn-reset', () => {
      _syncInProgress = false;
      if (btn) { btn.textContent = '⟳ Sync Last.fm'; btn.disabled = false; }
    }, 5000);
  }
  
  // Alias
  function handleManualSync() { syncData(); }
  
  
  // =============================================
  // END OF PART 1
  // =============================================
  // Part 2 will define all render/page functions
  // and register them in PAGE_RENDERERS.
  //
  // Part 3 will define features (chat, SOTD, admin,
  // 148 protocol, badges) + final initialization
  // + window exports.
  // =============================================
  // ██████  PART 2: ALL RENDER FUNCTIONS
  // ██████  v2.0 — Cached, DRY, Error-Resilient
  // =============================================
  //
  // KEY IMPROVEMENTS OVER v1.0:
  // ───────────────────────────────────────────────
  // ✅ buildRankRow / displayName / buildMissionRow — DRY helpers
  // ✅ Parallel async fetches in renderHome (streak + activity)
  // ✅ Cached API calls for rankings, goals, album2x, feed, streak
  // ✅ Error boundaries with retry buttons on every API page
  // ✅ Army Bomb CSS injected once (not per-render)
  // ✅ Loading states for all async pages
  // ✅ warnBanner/leaveBanner use style.display (fixes v1 bug)
  // ✅ Chat uses Timers manager (no interval stacking)
  // ✅ Consistent null-safe DOM access
  // =============================================
  
  'use strict';
  
  // ==================== REUSABLE HELPERS ====================
  
  /**
   * Sanitize a display name. Hides raw Agent IDs as "Secret Agent".
   * @param {string} name
   * @returns {string}
   */
  function displayName(name) {
    const n = sanitize(name || 'Agent');
    return n.toUpperCase().startsWith('AGENT') ? 'Secret Agent' : n;
  }
  
  /**
   * Build a ranking row — reused in home top agents + both ranking tabs.
   * v2.0: Extracted from 3 duplicate implementations.
   *
   * @param {object} agent — { agentNo, name, team, totalXP }
   * @param {number} index — 0-based rank position
   * @param {object} [opts]
   * @param {boolean} [opts.showTeam=true]
   * @returns {string} HTML
   */
  function buildRankRow(agent, index, opts = {}) {
    const { showTeam = true } = opts;
    const isMe = agent.agentNo === STATE.agentNo;
    const medals = ['🥇', '🥈', '🥉'];
    const icon = index < 3 ? medals[index] : index + 1;
  
    return `<div class="r-row" style="border-left:3px solid ${teamColor(agent.team)}">
      <div class="r-num ${index < 3 ? 'top' : ''}">${icon}</div>
      <div class="r-name ${isMe ? 'me' : ''}">${displayName(agent.name)}${isMe
        ? ' <span style="font-size:7px;color:var(--red-main);border:1px solid var(--red-main);padding:1px 4px;margin-left:3px;">YOU</span>'
        : ''}</div>
      ${showTeam ? `<div class="r-team">${(agent.team || '').replace('Team ', '')}</div>` : ''}
      <div class="r-xp">${fmt(agent.totalXP)}</div>
    </div>`;
  }
/**
 * Fetches and renders global rankings
 */
async function renderOverallRankings() {
    const list = $('rankList');
    if (!list) return;
    showPageLoading(list);
    try {
        const d = await Api.call('getRankings', { week: STATE.week, limit: 100 }, { cache: true, ttl: 30000 });
        if (d.success) {
            list.innerHTML = d.rankings.map((agent, i) => buildRankCard(agent, i, { showTeam: true })).join('');
        }
    } catch (e) { showPageError(list, 'renderOverallRankings'); }
}

/**
 * Fetches and renders team-specific rankings
 */
async function renderTeamRankings() {
    const list = $('rankList');
    if (!list) return;
    const team = STATE.data?.agent?.profile?.team;
    showPageLoading(list);
    try {
        const d = await Api.call('getTeamRankings', { week: STATE.week, team: team }, { cache: true, ttl: 30000 });
        if (d.success) {
            list.innerHTML = d.rankings.map((agent, i) => buildRankCard(agent, i, { showTeam: false })).join('');
        }
    } catch (e) { showPageError(list, 'renderTeamRankings'); }
}
  
  /**
   * Build a pass/fail mission row.
   * @param {string} name — Mission label with emoji
   * @param {boolean} passed
   * @returns {string} HTML
   */
  function buildMissionRow(name, passed) {
    return `<div class="m-row">
      <span>${name}</span>
      <span class="${passed ? 'm-pass' : 'm-fail'}">${passed ? '✓ PASS' : '✗ FAIL'}</span>
    </div>`;
  }
  
  /**
   * Render a unit track with progress bar.
   * Handles exempt (on-leave) state.
   */
  function renderUnitTrack(name, count, req) {
    const isExempt = typeof count === 'string';
    const pct = isExempt ? 100 : Math.min(100, ((count || 0) / req) * 100);
    const done = isExempt || (typeof count === 'number' && count >= req);
    return `
      <div class="unit-box">
        <div class="ub-hdr">
          <span class="ub-name">${sanitize(name)}</span>
          <span class="ub-count ${done ? 'done' : 'wip'}">${isExempt ? 'Exempt' : `${count || 0}/${req}`}</span>
        </div>
        <div class="pbar"><div class="pfill ${done ? 'green' : ''}" style="width:${pct}%"></div></div>
      </div>`;
  }
  
  /**
   * Render a side-mission track with 7-day grid.
   * @param {object} track — { name, daily, weeklyTotal, weeklyRequired }
   * @param {string[]} weekDates — Array of 7 date strings
   * @param {string} today — Current KST date string
   */
  function renderSMTrack(track, weekDates, today) {
    const daysHtml = (weekDates || []).map((date, i) => {
      const d = track.daily?.[date];
      const count = d?.count ?? 0;
      const passed = d?.passed ?? false;
      const isFuture = date > today;
      const cls = isFuture ? 'future' : (passed ? 'pass' : 'fail');
      return `<div class="sm-cell ${cls}"><div class="sc-day">${DAYS[i]}</div><div class="sc-val">${isFuture ? '—' : count}</div></div>`;
    }).join('');
  
    const wDone = (track.weeklyTotal || 0) >= (track.weeklyRequired || 20);
    return `
      <div class="sm-track">
        <div class="sm-hdr">
          <span class="sm-n">${sanitize(track.name)}</span>
          <span class="sm-w ${wDone ? 'done' : ''}">${track.weeklyTotal || 0}/${track.weeklyRequired || 20}</span>
        </div>
        <div class="sm-grid">${daysHtml}</div>
      </div>`;
  }
  
  /**
   * Render a goal progress bar with remaining count.
   * @param {string} name — Goal name
   * @param {number} current — Current count
   * @param {number} goal — Target count
   * @param {string} [status] — 'completed' or other
   */
  function renderGoalBar(name, current, goal, status) {
    const pct = goal > 0 ? Math.min(100, (current / goal) * 100) : 0;
    const done = status === 'completed' || current >= goal;
    const remaining = Math.max(0, goal - current);
    return `
      <div style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
          <span style="font-weight:700">${sanitize(name)}</span>
          <span style="font-family:monospace;font-weight:700;color:${done ? 'var(--green)' : 'var(--text-muted)'}">${fmt(current)}/${fmt(goal)}</span>
        </div>
        <div class="pbar"><div class="pfill ${done ? 'green' : ''}" style="width:${pct}%"></div></div>
        ${remaining > 0 ? `<div style="font-size:9px;color:var(--text-muted);margin-top:2px;">${fmt(remaining)} more needed</div>` : ''}
      </div>`;
  }
  
  /**
   * Build a member pill for album2x team lists.
   * @param {object} m — { name, passed }
   * @param {boolean} passed
   */
  function buildMemberPill(m, passed) {
    const n = displayName(m.name);
    const icon = passed ? '✨' : '❌';
    const bg = passed ? 'rgba(0,255,102,0.05)' : 'rgba(255,0,0,0.05)';
    return `<span style="font-size:9px;padding:3px 8px;background:${bg};color:var(--text-muted);">${icon} ${n}</span>`;
  }
  
  /**
   * Show a loading spinner inside a container, or an error with retry.
   */
  function showPageLoading(container) {
    if (container) container.innerHTML = '<div class="page-loading"><div class="spinner"></div></div>';
  }
  
  function showPageError(container, retryFn) {
    if (!container) return;
    const fnName = typeof retryFn === 'string' ? retryFn : 'loadDashboard';
    container.innerHTML = `
      <div style="text-align:center;padding:30px;">
        <div style="font-size:28px;margin-bottom:10px;">⚠️</div>
        <div style="font-size:13px;color:var(--red-main);margin-bottom:12px;">Failed to load</div>
        <button onclick="${fnName}()" class="btn-outline">🔄 Retry</button>
      </div>`;
  }
  
  
async function renderHome() {
  const content = $('homeContent');
  if (!content) return;

  try {
    const D = STATE.data;
    if (!D) return;

    // ─── Fetch detailed goals for the bars ───
    let trackGoals = {};
    let albumGoals = {};
    try {
      const goalsData = await Api.call('getGoalsProgress', { week: STATE.week }, { cache: true, ttl: 60000 });
      if (goalsData.success) {
        trackGoals = goalsData.trackGoals || {};
        albumGoals = goalsData.albumGoals || {};
      }
    } catch (gErr) {
      console.warn("Goals fetch failed, using fallback:", gErr);
      trackGoals = D.trackGoals || {};
      albumGoals = D.albumGoals || {};
    }

    const a = D.agent || {};
    const team = a.profile?.team || 'Unknown';
    const tColor = teamColor(team);
    const stats = a.stats || {};
    const today = a.sideMissions?.today || getKSTDateString();

    content.style.display = 'block';
    if ($('homeLoading')) $('homeLoading').style.display = 'none';

    let html = '';

    // ═══════════════════════════════════════
    // 1. WELCOME IDENTITY CARD
    // ═══════════════════════════════════════
    html += `
      <div class="glass-card" style="padding:20px; margin-bottom:20px; border-left:4px solid ${tColor}; background:linear-gradient(90deg, ${tColor}11, transparent);">
        <div style="display:flex; align-items:center; gap:15px;">
          <div class="battle-pfp-mid" style="--team-color:${tColor}; width:50px; height:50px; border-color:${tColor};">
            <img src="${teamPfp(team)}" alt="${sanitize(team)}">
          </div>
          <div>
            <div style="font-size:14px; color:var(--text-muted); font-family:var(--font-ui);">Welcome back,</div>
            <div style="font-size:18px; font-weight:900; color:#fff; font-family:var(--font-display);">Agent ${sanitize(a.profile?.name || 'Unknown')}</div>
            <div style="font-size:10px; color:${tColor}; font-weight:800; margin-top:2px;">${sanitize(team).toUpperCase()} • RANK #${a.rank || '—'}</div>
          </div>
        </div>
      </div>
    `;

    // ═══════════════════════════════════════
    // 2. LIVE TICKER
    // ═══════════════════════════════════════
    html += `
      <div class="agency-ticker-wrap">
        <div class="ticker-label">Live Broadcast</div>
        <div class="ticker-content" id="liveTicker">
          <span class="ticker-item">● System Online: Monitoring all agent scrobbles...</span>
          <span class="ticker-item">🔥 Agent Dossiers updated for ${STATE.week}...</span>
          <span class="ticker-item">⚡ 148 Protocol recalculating strategic scrobble share...</span>
        </div>
      </div>
    `;

    // ═══════════════════════════════════════
    // 3. STREAK BANNER
    // ═══════════════════════════════════════
    html += `<div id="streakWidget" style="margin-bottom: 24px;"></div>`;

    // ═══════════════════════════════════════
    // 4. STATS HERO GRID
    // ═══════════════════════════════════════
    html += `
      <div class="hero-stats-grid">
        <div class="hero-stat-card xp">
          <div class="h-stat-val red">${fmt(stats.totalXP || 0)}</div>
          <div class="h-stat-lbl">XP Earned</div>
        </div>
        <div class="hero-stat-card streams">
          <div class="h-stat-val blue">${fmt(stats.trackScrobbles || 0)}</div>
          <div class="h-stat-lbl">Total Streams</div>
        </div>
        <div class="hero-stat-card rank">
          <div class="h-stat-val gold">#${a.rank || '—'}</div>
          <div class="h-stat-lbl">Global Rank</div>
        </div>
      </div>
    `;

    // ═══════════════════════════════════════
    // 5. GLOBAL GOAL
    // ═══════════════════════════════════════
    const gg = D.globalArirangGoal || {};
    const ggPct = Math.min(100, gg.percentage || 0);
    html += `
      <div class="archive-card" style="margin-bottom:24px; background:radial-gradient(circle at top right, rgba(74,144,164,0.1), transparent);">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:10px;">
          <div>
            <div style="font-size:10px; font-weight:900; color:var(--wave-foam); text-transform:uppercase; letter-spacing:2px;">🌊 Global Scrobble Current</div>
          </div>
          <div style="text-align:right;">
            <span style="font-family:var(--font-mono); font-size:14px; font-weight:900; color:var(--wave-foam);">${fmt(gg.total || 0)}</span>
            <span style="font-size:10px; color:var(--text-muted);"> / ${fmt(gg.target || 0)}</span>
          </div>
        </div>
        <div class="pbar" style="height:8px;">
          <div class="pfill" style="width:${ggPct}%; background:var(--wave-foam); box-shadow:0 0 10px var(--wave-foam);"></div>
        </div>
      </div>
    `;

    // ═══════════════════════════════════════
    // 6. TEAM OBJECTIVES (Track & Album Goals)
    //    Uses goalsData fetched at the top
    // ═══════════════════════════════════════
    const trackEntries = Object.entries(trackGoals);
    const albumEntries = Object.entries(albumGoals);

    if (trackEntries.length || albumEntries.length) {
      html += `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px;">

          <div class="glass-card" style="padding:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <span style="font-size:10px; font-weight:900; color:#c4b5fd; text-transform:uppercase; letter-spacing:1px;">🎯 Track Targets</span>
              <span style="font-family:var(--font-mono); font-size:9px; color:var(--text-ghost);">${sanitize(team.replace('Team ', ''))}</span>
            </div>
            ${trackEntries.length ? trackEntries.slice(0, 3).map(([name, goalInfo]) => {
              const prog = goalInfo.teams?.[team] || { current: 0 };
              const goal = goalInfo.goal || 1;
              const cur = prog.current || 0;
              const pct = Math.min(100, Math.round((cur / goal) * 100));
              const done = pct >= 100;
              return `
                <div style="margin-bottom:8px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
                    <span style="font-size:10px; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:55%;">${sanitize(name)}</span>
                    <span style="font-family:var(--font-mono); font-size:9px; font-weight:700; color:${done ? 'var(--green)' : 'var(--text-muted)'};">${fmt(cur)}/${fmt(goal)}</span>
                  </div>
                  <div class="pbar" style="height:3px;">
                    <div class="pfill" style="width:${pct}%; background:${done ? 'var(--green)' : tColor};"></div>
                  </div>
                </div>
              `;
            }).join('') : '<div style="font-size:10px; color:var(--text-ghost);">No track targets set</div>'}
            <div style="text-align:center; margin-top:8px;">
              <span onclick="goTo('trackgoals')" style="font-size:9px; color:var(--wave-foam); cursor:pointer; font-weight:700;">
                ${trackEntries.length > 3 ? `View All ${trackEntries.length} →` : 'Details →'}
              </span>
            </div>
          </div>

          <div class="glass-card" style="padding:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <span style="font-size:10px; font-weight:900; color:#34d399; text-transform:uppercase; letter-spacing:1px;">📀 Album Targets</span>
              <span style="font-family:var(--font-mono); font-size:9px; color:var(--text-ghost);">${sanitize(team.replace('Team ', ''))}</span>
            </div>
            ${albumEntries.length ? albumEntries.slice(0, 3).map(([name, goalInfo]) => {
              const prog = goalInfo.teams?.[team] || { current: 0 };
              const goal = goalInfo.goal || 1;
              const cur = prog.current || 0;
              const pct = Math.min(100, Math.round((cur / goal) * 100));
              const done = pct >= 100;
              return `
                <div style="margin-bottom:8px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
                    <span style="font-size:10px; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:55%;">${sanitize(name)}</span>
                    <span style="font-family:var(--font-mono); font-size:9px; font-weight:700; color:${done ? 'var(--green)' : 'var(--text-muted)'};">${fmt(cur)}/${fmt(goal)}</span>
                  </div>
                  <div class="pbar" style="height:3px;">
                    <div class="pfill" style="width:${pct}%; background:${done ? 'var(--green)' : '#34d399'};"></div>
                  </div>
                </div>
              `;
            }).join('') : '<div style="font-size:10px; color:var(--text-ghost);">No album targets set</div>'}
            <div style="text-align:center; margin-top:8px;">
              <span onclick="goTo('albumgoals')" style="font-size:9px; color:var(--wave-foam); cursor:pointer; font-weight:700;">
                ${albumEntries.length > 3 ? `View All ${albumEntries.length} →` : 'Details →'}
              </span>
            </div>
          </div>

        </div>
      `;
    }

    // ═══════════════════════════════════════
    // 7. DAILY DIRECTIVES
    // ═══════════════════════════════════════
    const a2xData = a.album2xStatus || {};
    const dailyGrid = a2xData.dailyGrid?.[today] || {};
    const a2xPassedCount = Object.values(dailyGrid).filter(c => c?.passed).length;

    html += `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px;">
        <div onclick="goTo('album2x')" class="glass-card" style="padding:15px; border-top:3px solid var(--red-core); cursor:pointer;">
          <div style="font-size:11px; font-weight:800; color:#fff;">ARIRANG 2X</div>
          <div style="font-family:var(--font-mono); font-size:22px; font-weight:900; color:var(--red-core); margin:5px 0;">${a2xPassedCount}/14</div>
          <div style="font-size:8px; color:var(--text-muted); text-transform:uppercase;">Daily Directive</div>
        </div>
        <div onclick="goTo('sidemissions')" class="glass-card" style="padding:15px; border-top:3px solid var(--courage-amber); cursor:pointer;">
          <div style="font-size:11px; font-weight:800; color:#fff;">SURVIVAL</div>
          <div style="font-family:var(--font-mono); font-size:14px; font-weight:900; color:var(--courage-amber); margin:10px 0;">
            ${a.sideMissions?.todayAllPassed ? '✓ SECURED' : '⚠️ PENDING'}
          </div>
          <div style="font-size:8px; color:var(--text-muted); text-transform:uppercase;">Side Missions</div>
        </div>
      </div>
    `;

    // ═══════════════════════════════════════
    // 8. LIVE BATTLEFIELD
    // ═══════════════════════════════════════
    const tc = D.teamComparison || [];

    if (tc.length) {
      html += renderHeader('⚔️', 'Live Battlefield', '#fff');
      html += `<div class="battlefield-list">`;

      tc.forEach((tm, i) => {
        const isMe = tm.team === team;
        const tmColor = teamColor(tm.team);
        const pfpUrl = teamPfp(tm.team);

        const missions = [
          { icon: '🎵', key: 'trackGoalPassed' },
          { icon: '📀', key: 'albumGoalPassed' },
          { icon: '🔁', key: 'album2xPassed' },
          { icon: '⚡', key: 'arirangUnitPassed' },
          { icon: '🛡️', key: 'sideMissionPassed' }
        ];

        const missionHtml = missions.map(m => {
          const passed = tm[m.key];
          return `
            <div class="ms-pill">
              <span class="ms-icon">${m.icon}</span>
              <span class="ms-check ${passed ? 'pass' : 'fail'}">${passed ? '✓' : '✕'}</span>
            </div>
          `;
        }).join('');

        html += `
          <div class="battle-card" style="--team-color:${tmColor}; ${isMe ? 'background:rgba(255,255,255,0.06);' : ''}">
            <div class="battle-rank-big">${i + 1}</div>
            <div class="battle-pfp-mid" style="border-color:${tmColor}">
              <img src="${pfpUrl}" alt="${sanitize(tm.team)}">
            </div>
            <div class="battle-main-info">
              <div class="team-title-row">
                <div class="team-name-text" style="color:${tmColor}">
                  ${sanitize(tm.team.replace('Team ', ''))}
                  ${isMe ? '<span style="font-size:7px; color:#fff; background:var(--red-core); padding:1px 4px; border-radius:3px; margin-left:4px; vertical-align:middle;">YOU</span>' : ''}
                </div>
                <div class="agent-count">👥 ${tm.agentCount ?? 0} agents</div>
              </div>
              <div class="mission-status-strip">${missionHtml}</div>
            </div>
            <div class="xp-display">
              <div class="xp-val">${fmt(tm.teamXP || 0)}</div>
              <div class="xp-lbl">XP</div>
            </div>
          </div>
        `;
      });

      html += `</div>`;
      html += `<button onclick="goTo('teams')" class="btn-outline" style="width:100%; margin-top:16px;">Detailed Standings →</button>`;
    }

    // ═══════════════════════════════════════
    // 9. TOP AGENTS LEADERBOARD
    // ═══════════════════════════════════════
    const rankings = D.rankings || [];
    if (rankings.length) {
      html += renderHeader('🏆', 'Top Agents', 'var(--courage-amber)');
      const medals = ['🥇', '🥈', '🥉'];
      html += `<div class="glass-card" style="padding:14px; margin-bottom:24px;">`;
      html += rankings.slice(0, 5).map((ag, i) => {
        const isMe = ag.agentId === a.profile?.agentId;
        const agColor = teamColor(ag.team);
        return `
          <div style="display:flex; align-items:center; gap:8px; padding:8px 6px; border-bottom:1px solid var(--glass-border); ${isMe ? 'background:' + agColor + '11; margin:0 -6px; padding-left:12px; padding-right:12px; border-radius:6px;' : ''}">
            <span style="font-size:14px; width:22px; text-align:center;">${medals[i] || '#' + (i + 1)}</span>
            <div style="flex:1; min-width:0;">
              <div style="font-size:11px; font-weight:${isMe ? '900' : '600'}; color:${isMe ? agColor : '#fff'}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${sanitize(ag.name || ag.agentId)}${isMe ? ' (You)' : ''}
              </div>
              <div style="font-size:8px; color:var(--text-ghost);">${sanitize(ag.team || '')}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-family:var(--font-mono); font-size:11px; font-weight:900; color:var(--courage-amber);">${fmt(ag.totalXP || 0)}</div>
              <div style="font-size:7px; color:var(--text-ghost);">XP</div>
            </div>
          </div>
        `;
      }).join('');
      html += `
        <div style="text-align:center; margin-top:10px;">
          <span onclick="goTo('rankings')" style="font-size:9px; color:var(--wave-foam); cursor:pointer; font-weight:700;">Full Rankings →</span>
        </div>
      </div>`;
    }

    // ═══════════════════════════════════════
    // 10. LATEST ANNOUNCEMENTS
    // ═══════════════════════════════════════
    const anns = D.announcements || [];
    if (anns.length) {
      html += renderHeader('📢', 'Latest Intel', 'var(--text-secondary)');
      html += `<div class="glass-card" style="padding:14px; margin-bottom:24px;">`;
      html += anns.slice(0, 3).map(an => `
        <div style="padding:8px 0; border-bottom:1px solid var(--glass-border);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
            <span style="font-size:11px; font-weight:800; color:#fff;">${sanitize(an.title || 'Untitled')}</span>
            <span style="font-size:9px; color:var(--text-ghost);">${timeAgo(an.timestamp)}</span>
          </div>
          <div style="font-size:10px; color:var(--text-muted); line-height:1.4;">${sanitize((an.body || '').substring(0, 120))}${(an.body || '').length > 120 ? '...' : ''}</div>
        </div>
      `).join('');
      html += `
        <div style="text-align:center; margin-top:10px;">
          <span onclick="goTo('announcements')" style="font-size:9px; color:var(--wave-foam); cursor:pointer; font-weight:700;">All Announcements →</span>
        </div>
      </div>`;
    }

    // ═══════════════════════════════════════
    // 11. WIDGET SLOTS (async post-render)
    // ═══════════════════════════════════════
    html += `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px;">
        <div class="glass-card" style="padding:14px;">
          <div style="font-size:10px; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">🔥 Streak</div>
          <div id="homeStreakWidget"></div>
        </div>
        <div class="glass-card" style="padding:14px;">
          <div style="font-size:10px; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">📡 Live Feed</div>
          <div id="homeActivityWidget" style="font-size:10px; color:var(--text-ghost);">Loading...</div>
        </div>
      </div>
    `;

    // ═══════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════
    content.innerHTML = html;

    // Post-render: fill async widgets
    renderStreakWidget();
    renderHomeStreakWidget(stats);
    loadHomeActivityWidget();
    updateTickerWithActivity();

  } catch (error) {
    console.error("Home render failed:", error);
    if (content) {
      content.style.display = 'block';
      if ($('homeLoading')) $('homeLoading').style.display = 'none';
      content.innerHTML = `
        <div style="text-align:center; padding:40px; color:var(--text-muted);">
          <div style="font-size:24px; margin-bottom:12px;">⚠️</div>
          <div style="font-size:12px; font-weight:700;">Dashboard Error</div>
          <div style="font-size:11px; margin-top:8px;">${sanitize(error.message || 'Unknown error')}</div>
          <button class="btn-outline" onclick="loadDashboard()" style="margin-top:16px;">Retry</button>
        </div>
      `;
    }
  }
}


/* ═══════════════════════════════════════════
   POST-RENDER WIDGETS
   ═══════════════════════════════════════════ */

async function renderHomeStreakWidget(stats) {
  const el = $('homeStreakWidget');
  if (!el) return;
  
  try {
    // Fetch live streak data to get accurate 'todayCompleted' status
    const d = await Api.call('getStreakData', { agentNo: STATE.agentNo }, { cache: true, ttl: 30000, silent: true });
    
    let streak = stats.streak || 0;
    let best = stats.bestStreak || streak;
    let statusText = streak > 0 ? '✓ ACTIVE' : '✗ BROKEN';
    let statusColor = streak > 0 ? 'var(--green)' : 'var(--fail)';

    if (d.success && d.streak) {
      streak = d.streak.current || 0;
      best = d.streak.best || best;
      
      // True Logic: Only "Secured" if they streamed today
      if (d.streak.todayCompleted) {
        statusText = '✓ SECURED';
        statusColor = 'var(--green)';
      } else if (streak > 0) {
        statusText = '⚠ STANDBY';
        statusColor = 'var(--courage-amber)';
      } else {
        statusText = '✗ BROKEN';
        statusColor = 'var(--fail)';
      }
    }

    el.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-family:var(--font-mono); font-size:18px; font-weight:900; color:#fff;">${streak}</div>
          <div style="font-size:8px; color:var(--text-ghost);">Day${streak !== 1 ? 's' : ''} Active</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:10px; font-weight:800; color:var(--courage-amber);">Best: ${best}</div>
          <div style="font-size:8px; font-weight:900; color:${statusColor};">${statusText}</div>
        </div>
      </div>
    `;
  } catch (e) {
    // Fallback if API fails
    const streak = stats.streak || 0;
    const best = stats.bestStreak || streak;
    el.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-family:var(--font-mono); font-size:18px; font-weight:900; color:#fff;">${streak}</div>
          <div style="font-size:8px; color:var(--text-ghost);">Day${streak !== 1 ? 's' : ''} Active</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:10px; font-weight:800; color:var(--courage-amber);">Best: ${best}</div>
        </div>
      </div>
    `;
  }
}
async function loadHomeActivityWidget() {
  const el = $('homeActivityWidget');
  if (!el) return;
  try {
    const d = await Api.call('getActivityFeed', { limit: 5 }, { cache: true, ttl: 60000 });
    if (d.success && d.activities?.length) {
      el.innerHTML = d.activities.slice(0, 4).map(act => {
        const msg = act.data?.message || act.type.replace(/_/g, ' ');
        return `
          <div style="display:flex; align-items:flex-start; gap:6px; padding:4px 0; border-bottom:1px solid var(--glass-border);">
            <span style="font-size:8px; color:var(--text-ghost); min-width:24px; flex-shrink:0;">${timeAgo(act.timestamp)}</span>
            <span style="font-size:9px; color:var(--text-muted); line-height:1.3;">${sanitize(msg)}</span>
          </div>
        `;
      }).join('');
    } else {
      el.innerHTML = '<div style="font-size:9px; color:var(--text-ghost);">No activity yet</div>';
    }
  } catch (e) {
    el.innerHTML = '<div style="font-size:9px; color:var(--text-ghost);">Feed unavailable</div>';
  }
}

async function updateTickerWithActivity() {
  const ticker = $('liveTicker');
  if (!ticker) return;
  try {
    const d = await Api.call('getActivityFeed', { limit: 10 }, { cache: true, ttl: 60000 });
    if (d.success && d.activities?.length) {
      ticker.innerHTML = d.activities.map(act => {
        const text = act.data?.message || act.type.replace(/_/g, ' ');
        return `<span class="ticker-item">● ${sanitize(text)}</span>`;
      }).join('');
    }
  } catch (e) {}
}



/* ═══════════════════════════════════════════
   HELPER — Mission row for home page
   ═══════════════════════════════════════════ */
function missionRow(icon, label, pct, page, color) {
  pct = Math.min(100, Math.max(0, pct || 0));
  const done = pct >= 100;
  return `
    <div onclick="goTo('${page}')" style="cursor:pointer;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:0.75rem;">${icon}</span>
          <span style="font-size:0.6875rem; font-weight:700; color:#fff;">${label}</span>
        </div>
        <span style="font-family:var(--font-mono); font-size:0.625rem; font-weight:800; color:${done ? 'var(--green)' : color};">${done ? '✓ DONE' : pct + '%'}</span>
      </div>
      <div class="pbar" style="height:4px;">
        <div class="pfill" style="width:${pct}%; background:${done ? 'var(--green)' : color};"></div>
      </div>
    </div>
  `;
}


/* ═══════════════════════════════════════════
   HELPER — Load activity feed widget
   ═══════════════════════════════════════════ */
async function loadActivityWidget(el) {
  try {
    const d = await Api.call('getActivityFeed', { limit: 5 }, { cache: true, ttl: 60000 });
    if (d.success && d.activities?.length) {
      el.innerHTML = d.activities.slice(0, 5).map(act => {
        const msg = act.data?.message || act.type.replace(/_/g, ' ');
        return `
          <div style="display:flex; align-items:flex-start; gap:6px; padding:5px 0; border-bottom:1px solid var(--glass-border);">
            <span style="font-size:0.5625rem; color:var(--text-ghost); min-width:32px;">${timeAgo(act.timestamp)}</span>
            <span style="font-size:0.625rem; color:var(--text-muted); line-height:1.3;">${esc(msg)}</span>
          </div>
        `;
      }).join('');
    } else {
      el.innerHTML = '<div style="font-size:0.625rem; color:var(--text-ghost);">No activity yet</div>';
    }
  } catch (e) {
    el.innerHTML = '<div style="font-size:0.625rem; color:var(--text-ghost);">Feed unavailable</div>';
  }
}


/* ═══════════════════════════════════════════
   HELPER — fmt / esc / timeAgo
   ═══════════════════════════════════════════ */
function fmt(n) {
  if (n == null) return '0';
  n = Number(n);
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString();
}

function esc(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function timeAgo(ts) {
  if (!ts) return '';
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return mins + 'm';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h';
  return Math.floor(hrs / 24) + 'd';
}


// ═══════════════════════════════════════════
// HELPER: Build expandable mission card
// ═══════════════════════════════════════════
function buildMissionCard(icon, title, passed, goalsList, targetPage) {
  const hasGoals = goalsList && goalsList.length > 0;

  return `
    <div onclick="goTo('${targetPage}')" style="
      padding:16px; background:var(--panel-bg, rgba(255,255,255,0.02)); border:1px solid var(--border-light, rgba(255,255,255,0.06));
      border-radius:10px; margin-bottom:10px; cursor:pointer; transition:border-color 0.2s;
    " onmouseover="this.style.borderColor='rgba(255,255,255,0.12)'" onmouseout="this.style.borderColor='var(--border-light, rgba(255,255,255,0.06))'">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:${hasGoals ? '12px' : '0'};">
        <span style="font-size:20px;">${icon}</span>
        <div style="flex:1;">
          <div style="font-size:13px; font-weight:700; color:#fff;">${title}</div>
        </div>
        <span style="padding:4px 10px; border-radius:12px; font-size:10px; font-weight:700;
          background:${passed ? 'rgba(0,255,102,0.08)' : 'rgba(255,165,0,0.08)'};
          color:${passed ? 'var(--green, #00ff66)' : '#ffa500'};">
          ${passed ? '✅ Complete' : '⏳ In Progress'}
        </span>
      </div>
      ${hasGoals ? `
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${goalsList.map(g => {
            const pct = g.goal > 0 ? Math.min(100, (g.current / g.goal) * 100) : 0;
            return `
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:10px; color:${g.done ? 'var(--green, #00ff66)' : 'var(--text-muted)'}; width:14px;">${g.done ? '✅' : '⏳'}</span>
                <span style="flex:1; font-size:11px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${sanitize(g.name)}</span>
                <span style="font-size:10px; font-family:monospace; font-weight:700; color:${g.done ? 'var(--green, #00ff66)' : 'var(--text-muted)'};">
                  ${fmt(g.current)}/${fmt(g.goal)}
                </span>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}


/**
 * Shared attendance/police widget — used on home + profile.
 *
 * @param {string} containerId — DOM id to render into
 * @param {object} agent — STATE.data.agent
 */
function renderAttendancePoliceWidget(containerId, agent) {
  const el = $(containerId);
  if (!el) return;

  const att = agent.attendance || {};
  const pol = agent.policeStatus || {};

  el.innerHTML = `
    <div class="ap-grid">
      <div class="ap-box">
        <div class="ap-label">Attendance</div>
        <div style="font-size:14px; font-weight:900; color:${att.submitted ? 'var(--green)' : 'var(--red-main)'};">
          ${att.submitted ? '✓' : '✗'}
        </div>
        <div style="font-size:9px; color:var(--text-muted); margin-top:2px;">
          Team: ${att.teamStats?.percentage || 0}%
        </div>
      </div>
      <div class="ap-box">
        <div class="ap-label">Police</div>
        <div style="font-size:14px; font-weight:900; color:${pol.passed ? 'var(--green)' : 'var(--red-main)'};">
          ${pol.confirmedReports || 0}/${pol.maxAllowed || 3}
        </div>
        <div style="font-size:9px; color:var(--text-muted); margin-top:2px;">
          ${pol.passed ? 'CLEAR' : 'EXCEEDED'}
        </div>
      </div>
    </div>
  `;
}


/**
 * Build team battle comparison rows — reused on home + teams page.
 */
function renderTeamBattleRows(teams, myTeamName) {
  return teams.map((team, i) => {
    const isMe = team.team === myTeamName;
    const dots = [
      team.trackGoalPassed,
      team.albumGoalPassed,
      team.album2xPassed,
      team.arirangUnitPassed,
      team.sideMissionPassed
    ].map(p => `<div class="tc-dot ${p ? 'on' : 'off'}"></div>`).join('');

    return `
      <div class="tc-row" style="border-left:3px solid ${teamColor(team.team)}">
        <div class="tc-rank ${i === 0 ? 'first' : ''}">${i + 1}</div>
        <div class="tc-info">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="tc-name ${isMe ? 'mine' : ''}">${teamEmoji(team.team)} ${sanitize(team.team.replace('Team ', ''))} ${team.isWinner ? '🏆' : ''}</span>
            <span class="tc-xp">${fmt(team.teamXP)}</span>
          </div>
          <div class="tc-dots">${dots}</div>
        </div>
      </div>
    `;
  }).join('');
}


// ═══════════════════════════════════════════
// HOME SUB-WIDGETS (Async)
// ═══════════════════════════════════════════

/**
 * Render streak widget — fetches data with 30s cache.
 */
async function renderStreakWidget() {
  const container = $('streakWidget');
  if (!container) return;

  try {
    const d = await Api.call('getStreakData', { agentNo: STATE.agentNo }, { cache: true, ttl: 30000, silent: true });
    if (!d.success) return;

    const s = d.streak;
    let statusColor = 'rgba(255,255,255,0.3)';
    let statusText = 'STANDBY';
    let icon = '⚪';

    if (s.todayCompleted) {
      statusColor = 'var(--green)';
      statusText = 'SECURED';
      icon = '✅';
    } else if (s.current > 0) {
      statusColor = 'var(--courage-amber)';
      statusText = 'ACTIVE';
      icon = '🔥';
    }

    container.innerHTML = `
      <div style="display:flex; align-items:center; gap:16px; padding:16px 20px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.05); border-radius:12px; position:relative; overflow:hidden;">
        
        <!-- Glowing Ring Indicator -->
        <div style="position:relative; width:48px; height:48px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <svg viewBox="0 0 50 50" style="position:absolute; inset:0; width:100%; height:100%; transform:rotate(-90deg);">
            <circle cx="25" cy="25" r="22" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="4"/>
            <circle cx="25" cy="25" r="22" fill="none" stroke="${statusColor}" stroke-width="4"
                    stroke-dasharray="138" stroke-dashoffset="${s.todayCompleted ? 0 : 138}"
                    style="transition:stroke-dashoffset 1s ease-in-out; filter:drop-shadow(0 0 4px ${statusColor});"/>
          </svg>
          <span style="font-size:20px; position:relative; z-index:2;">${icon}</span>
        </div>

        <div style="flex:1;">
          <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:2px; margin-bottom:2px;">Mission Streak</div>
          <div style="display:flex; align-items:baseline; gap:6px;">
            <span style="font-size:24px; font-weight:900; font-family:'Share Tech Mono', monospace; color:#fff;">${s.current}</span>
            <span style="font-size:11px; color:var(--text-muted);">Days</span>
          </div>
        </div>

        <div style="text-align:right; border-left:1px solid rgba(255,255,255,0.1); padding-left:16px;">
          <div style="font-size:9px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Status</div>
          <div style="font-size:11px; font-weight:800; color:${statusColor}; letter-spacing:1px;">${statusText}</div>
        </div>
      </div>
    `;

    // Animate the circle fill if not completed today
    if (!s.todayCompleted && s.current > 0) {
      setTimeout(() => {
        const circle = container.querySelector('circle:nth-child(2)');
        if (circle) {
          circle.style.strokeDashoffset = 138 - (138 * 0.5);
        }
      }, 100);
    }
  } catch (e) {
    // silent
  }
}


/**
 * Render live activity widget — fetches with 30s cache.
 */
async function updateActivityWidget() {
  const container = $('activityWidget');
  if (!container) return;

  try {
    const d = await Api.call('getActivityFeed', { limit: 5 }, { cache: true, ttl: 30000, silent: true });

    if (!d.success || !d.activities?.length) {
      container.innerHTML = '<div style="font-size:11px; color:var(--text-muted); text-align:center; padding:10px;">No activity yet</div>';
      return;
    }

    container.innerHTML = d.activities.slice(0, 3).map(a => {
      const type = CONFIG.ACTIVITY_TYPES[a.type];
      const data = a.data || {};
      let msg = '';
      try {
        msg = type?.template(data) || data.message || a.type;
      } catch (e) {
        msg = a.type;
      }

      return `
        <div style="display:flex; gap:8px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.03); font-size:10px;">
          <span>${type?.icon || '📡'}</span>
          <span style="color:var(--text-muted); flex:1; line-height:1.4;">${msg}</span>
        </div>
      `;
    }).join('');
  } catch (e) {
    // silent
  }
}
  
  
  // =============================================
  // ██████  PROFILE PAGE
  // =============================================
  
  // =============================================
  // ██████  PROFILE PAGE (Arirang Theme)
  // =============================================
  
 function renderProfile() {
    const container = $('profileContent');
    if (!container) return;

    try {
        const a = STATE.data?.agent || {};
        const p = a.profile || {};
        const stats = a.stats || {};
        const album2xStatus = a.album2xStatus || {};
        const trackContributions = a.trackContributions || {};
        const albumContributions = a.albumContributions || {};
        const currentWeekXP = parseInt(stats.totalXP) || 0;
        const team = p.team || 'Unknown';
        const tColor = teamColor(team);

        const isExempt = album2xStatus.passed === true &&
            Object.values(album2xStatus.tracks || {}).some(v => v === 'Exempt');

        const xpBadges = getLevelBadges(STATE.agentNo, currentWeekXP) || [];
        const album2xBadge = getAlbum2xBadge(STATE.agentNo, STATE.week);
        const currentWeekBadges = [];
        if (album2xBadge) currentWeekBadges.push(album2xBadge);
        currentWeekBadges.push(...xpBadges);

        // ✅ CATCH-ALL LAST.FM LOGIC: checks a.lastfms, a.lastfm, p.lastfms, p.lastfm
        const rawLastfm = a.lastfms || a.lastfm || p.lastfms || p.lastfm;
        const lastfmUsernames = Array.isArray(rawLastfm)
            ? rawLastfm
            : (rawLastfm ? [rawLastfm] : []);
        const hasLastfm = lastfmUsernames.length > 0;

        // ✅ SAFE week dates
        const daysArray = getWeekDates(STATE.week);
        const weekDates = {
            start: daysArray[0],
            end: daysArray[6]
        };

        let html = '';

        // --- 0. PROFILE AGENT CARD ---
        html += `
            <div class="profile-agent-card" style="--team-color: ${tColor}">
                <div style="display: flex; align-items: center; gap: 20px; position: relative; z-index: 5;">
                    <div class="profile-pfp-large" style="--team-color: ${tColor};">
                        <img src="${teamPfp(team)}" alt="Agent">
                        <div class="online-dot"></div>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); letter-spacing: 2px;">FILE # ${a.agentNo || STATE.agentNo}</div>
                        <div style="font-size: 22px; font-weight: 900; color: #fff; font-family: var(--font-display); line-height: 1.1; margin: 4px 0;">${sanitize(p.name || 'Agent')}</div>
                        <div style="display: flex; gap: 10px; margin-top: 8px;">
                            <span class="micro-tag" style="color: ${tColor}; border-color: ${tColor}">${team.toUpperCase()}</span>
                            <span class="micro-tag" style="color: var(--wave-foam); border-color: var(--wave-foam)">RANK #${a.rank || '—'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // --- 1. STATS GRID ---
        html += `
            <div class="grid-3" style="margin-bottom:24px;">
                <div class="stat-box" style="border-top:2px solid var(--red-core);">
                    <div class="sv red" style="font-size:20px;">${fmt(stats.totalXP)}</div>
                    <div class="sl">XP (${STATE.week})</div>
                </div>
                <div class="stat-box" style="border-top:2px solid var(--wave-foam);">
                    <div class="sv white" style="font-size:20px;">#${a.rank || '—'}</div>
                    <div class="sl">Global Rank</div>
                </div>
                <div class="stat-box" style="border-top:2px solid var(--gold-core);">
                    <div class="sv gold" style="font-size:20px;">#${a.teamRank || '—'}</div>
                    <div class="sl">Team Rank</div>
                </div>
                <div class="stat-box">
                    <div class="sv white">${fmt(stats.trackScrobbles)}</div>
                    <div class="sl">Track Streams</div>
                </div>
                <div class="stat-box">
                    <div class="sv white">${fmt(stats.albumScrobbles)}</div>
                    <div class="sl">Album Streams</div>
                </div>
                <div class="stat-box">
                    <div class="sv ${album2xStatus.passed ? 'green' : 'red'}">${album2xStatus.passed ? '✓' : '✗'}</div>
                    <div class="sl">2X Status</div>
                </div>
            </div>
        `;

        // --- 2. CONTRIBUTIONS ---
        html += `
            <div style="display:flex; align-items:center; gap:12px; margin:0 0 16px 0;">
                <div style="font-size:16px;">🎧</div>
                <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:3px; color:var(--wave-foam);">Agent Contributions</div>
                <div style="flex:1; height:1px; background:linear-gradient(90deg, rgba(74,144,164,0.3), transparent);"></div>
            </div>

            <div class="layered-grid" style="margin-bottom:24px;">
                <div class="glass-card" style="padding:16px;">
                    <div style="font-size:10px; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Top Tracks</div>
                    <div style="max-height:150px; overflow-y:auto; padding-right:4px;">
                        ${Object.entries(trackContributions).length > 0
                            ? Object.entries(trackContributions).sort((x, y) => y[1] - x[1]).map(([n, c]) => `
                                <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border-subtle); font-size:11px;">
                                    <span style="color:#fff;">${sanitize(n)}</span>
                                    <span style="font-family:'Share Tech Mono', monospace; color:var(--wave-foam);">${fmt(c)}</span>
                                </div>`).join('')
                            : '<div style="font-size:11px; color:var(--text-muted); text-align:center; padding:10px;">No track data yet</div>'
                        }
                    </div>
                </div>
                <div class="glass-card" style="padding:16px;">
                    <div style="font-size:10px; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Top Albums</div>
                    <div style="max-height:150px; overflow-y:auto; padding-right:4px;">
                        ${Object.entries(albumContributions).length > 0
                            ? Object.entries(albumContributions).sort((x, y) => y[1] - x[1]).map(([n, c]) => `
                                <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border-subtle); font-size:11px;">
                                    <span style="color:#fff;">${sanitize(n)}</span>
                                    <span style="font-family:'Share Tech Mono', monospace; color:var(--wave-foam);">${fmt(c)}</span>
                                </div>`).join('')
                            : '<div style="font-size:11px; color:var(--text-muted); text-align:center; padding:10px;">No album data yet</div>'
                        }
                    </div>
                </div>
            </div>
        `;

        // --- 2.5. LAST.FM VERIFICATION ---
        html += `
            <div style="display:flex; align-items:center; gap:12px; margin:0 0 16px 0;">
                <div style="font-size:16px;">🎵</div>
                <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:3px; color:var(--wave-foam);">Last.fm Account</div>
                <div style="flex:1; height:1px; background:linear-gradient(90deg, rgba(74,144,164,0.3), transparent);"></div>
            </div>

            <div class="glass-card" style="padding:16px; margin-bottom:24px;">
                ${hasLastfm ? `
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        ${lastfmUsernames.map((u, i) => `
                            <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px;">
                                <div>
                                    <div style="font-size:10px; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:3px;">
                                        ${lastfmUsernames.length > 1 ? `Account ${i + 1}` : 'Linked Account'}
                                    </div>
                                    <div style="font-family:var(--font-mono); font-size:13px; color:#fff; font-weight:700;">
                                        ${sanitize(u)}
                                    </div>
                                </div>
                                <div style="display:flex; gap:6px; flex-shrink:0; margin-left:12px;">
                                    <a href="https://www.last.fm/user/${encodeURIComponent(u)}" 
                                       target="_blank" rel="noopener"
                                       style="display:inline-flex; align-items:center; gap:5px; padding:7px 12px; background:var(--red-whisper); border:1px solid var(--red-border); border-radius:7px; color:var(--red-core); font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:1px; text-decoration:none; transition:all 0.2s; white-space:nowrap;"
                                       onmouseover="this.style.background='rgba(255,20,95,0.15)'; this.style.borderColor='var(--red-core)'"
                                       onmouseout="this.style.background='var(--red-whisper)'; this.style.borderColor='var(--red-border)'">
                                        🔗 Profile
                                    </a>
                                    ${weekDates ? `
                                    <a href="https://www.last.fm/user/${encodeURIComponent(u)}/library?from=${weekDates.start}&to=${weekDates.end}" 
                                       target="_blank" rel="noopener"
                                       style="display:inline-flex; align-items:center; gap:5px; padding:7px 12px; background:rgba(74,144,164,0.08); border:1px solid rgba(74,144,164,0.25); border-radius:7px; color:var(--wave-foam); font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:1px; text-decoration:none; transition:all 0.2s; white-space:nowrap;"
                                       onmouseover="this.style.background='rgba(74,144,164,0.15)'"
                                       onmouseout="this.style.background='rgba(74,144,164,0.08)'">
                                        📊 This Week
                                    </a>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top:12px; padding:10px 14px; background:rgba(74,144,164,0.05); border:1px solid rgba(74,144,164,0.15); border-radius:8px; display:flex; align-items:flex-start; gap:10px;">
                        <span style="font-size:14px; flex-shrink:0;">ℹ️</span>
                        <span style="font-size:10px; color:var(--text-muted); line-height:1.5;">
                            This is the Last.fm account your streams are tracked from. Use <strong style="color:var(--wave-foam);">This Week</strong> to verify your scrobbles are counting. If something looks wrong, contact your team admin.
                        </span>
                    </div>
                ` : `
                    <div style="text-align:center; padding:20px 0;">
                        <div style="font-size:28px; margin-bottom:10px; opacity:0.4;">🎵</div>
                        <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">No Last.fm account linked</div>
                        <div style="font-size:10px; color:var(--text-ghost);">Contact your team admin to link your account</div>
                    </div>
                `}
            </div>
        `;

        // --- 3. BADGES ---
        html += `
            <div style="display:flex; align-items:center; gap:12px; margin:0 0 16px 0;">
                <div style="font-size:16px;">🎖️</div>
                <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:3px; color:var(--vinyl-gold);">Recent Honors</div>
                <div style="flex:1; height:1px; background:linear-gradient(90deg, rgba(212,175,55,0.3), transparent);"></div>
            </div>
        `;

        if (currentWeekBadges.length > 0) {
            html += `
                <div class="glass-card" style="padding:16px; margin-bottom:24px;">
                    <div class="badge-grid">
                        ${currentWeekBadges.map(b => `
                            <div class="holo-badge-container">
                                <div class="holo-circle">
                                    <div class="holo-inner">
                                        <img src="${b.imageUrl}" alt="${sanitize(b.name)}" onerror="this.style.display='none'">
                                        <div class="holo-shine"></div>
                                    </div>
                                </div>
                                <div class="badge-label">${sanitize(b.name)}</div>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="goTo('badges')" class="btn-outline" style="width:100%; margin-top:15px; font-size:10px;">
                        🎒 View Full Archive →
                    </button>
                </div>
            `;
        } else {
            html += `
                <div class="glass-card" style="padding:30px 20px; text-align:center; margin-bottom:24px;">
                    <div style="font-size:32px; margin-bottom:12px; opacity:0.5;">🔒</div>
                    <p style="font-size:12px; color:var(--text-muted); margin:0;">Earn <strong style="color:var(--vinyl-gold);">50 XP</strong> this week to unlock an honor badge.</p>
                    <button onclick="goTo('badges')" class="btn-outline" style="margin-top:16px; font-size:10px;">🎒 View Badge Drawer</button>
                </div>
            `;
        }

        // --- 4. GHOST PROTOCOL (LEAVE) ---
        html += `
            <div class="archive-card" style="margin-bottom:24px; border-color:${isExempt ? 'var(--text-muted)' : 'var(--courage-amber)'}; background:${isExempt ? 'var(--bg-panel)' : 'rgba(255,149,0,0.03)'};">
                <div style="display:flex; flex-wrap:wrap; gap:16px; align-items:center; justify-content:space-between;">
                    <div style="flex:1; min-width:200px;">
                        <div style="font-size:13px; font-weight:800; color:${isExempt ? 'var(--text-muted)' : 'var(--courage-amber)'}; letter-spacing:1px; display:flex; align-items:center; gap:8px;">
                            <span>${isExempt ? '💤' : '📝'}</span>
                            ${isExempt ? 'GHOST PROTOCOL: ACTIVE' : 'REQUEST LEAVE OF ABSENCE'}
                        </div>
                        <div style="font-size:10px; color:var(--text-secondary); margin-top:6px; line-height:1.5;">
                            ${isExempt
                                ? 'You are exempt from missions this week. No XP awarded. Rest well, Agent.'
                                : "Can't stream this week? Apply for leave to protect your team stats. (0 XP earned)"}
                        </div>
                    </div>
                    <div>
                        ${!isExempt ? `
                        <button onclick="openLeaveModal()" class="btn-outline" style="border-color:var(--courage-amber); color:var(--courage-amber); white-space:nowrap;">
                            Apply Leave
                        </button>
                        ` : `
                        <button onclick="cancelLeaveRequest()" class="btn-outline" style="border-color:var(--fail); color:var(--fail); white-space:nowrap;">
                            Cancel Leave
                        </button>
                        `}
                    </div>
                </div>
            </div>
        `;

        // --- 5. RETIREMENT ---
        html += `
            <div style="text-align:center; padding-top:20px; border-top:1px dashed rgba(255,59,92,0.3);">
                <p style="font-size:10px; color:var(--text-muted); margin-bottom:12px;">Leaving permanently? This action cannot be undone.</p>
                <button onclick="promptDeleteAccount()" style="background:transparent; border:1px solid var(--fail); color:var(--fail); padding:10px 24px; border-radius:8px; font-size:10px; font-weight:800; cursor:pointer; text-transform:uppercase; letter-spacing:1px; transition:all 0.3s;"
                    onmouseover="this.style.background='rgba(255,59,92,0.1)'"
                    onmouseout="this.style.background='transparent'">
                    ⚠️ Retire From Mission
                </button>
            </div>
        `;

        container.innerHTML = html;

        if (typeof loadCareerHistory === 'function') loadCareerHistory();
        if (typeof loadProfileStreak === 'function') loadProfileStreak();

    } catch (err) {
        console.error('renderProfile crashed:', err);
        container.innerHTML = `
            <div class="glass-card" style="padding:24px; border-left:3px solid var(--fail); margin-bottom:16px;">
                <div style="font-size:13px; font-weight:800; color:var(--fail); margin-bottom:8px;">⚠️ Profile Failed To Load</div>
                <div style="font-size:11px; color:var(--text-muted); font-family:var(--font-mono); line-height:1.6;">
                    ${err.message}
                </div>
                <button onclick="renderProfile()" class="btn-outline" style="margin-top:16px; font-size:10px;">
                    ↺ Retry
                </button>
            </div>
        `;
    }
}
// =============================================
// ██████  LEAVE SYSTEM
// =============================================

async function confirmLeaveApplication() {
    document.querySelector('.spy-modal-overlay')?.remove();
    Loading.show();
    try {
        const result = await Api.call('applyLeave', { agentNo: STATE.agentNo, week: STATE.week });
        if (result.success) {
            showToast('Application received! Status updates in ~1 hr.', 'success');
            setTimeout(() => { loadDashboard(); }, 1500);
        } else {
            showToast(result.error || 'Failed to update status', 'error');
        }
    } catch (e) {
        showToast('Network Error', 'error');
    } finally {
        Loading.hide();
    }
}

async function cancelLeaveRequest() {
    if (!confirm("⚠️ REACTIVATE STATUS?\n\nAre you sure you want to cancel your leave?\nYou will be required to complete missions again.")) return;
    Loading.show();
    try {
        const result = await Api.call('cancelLeave', { agentNo: STATE.agentNo, week: STATE.week });
        if (result.success) {
            showToast('Welcome back, Agent. Leave cancelled.', 'success');
            setTimeout(() => { loadDashboard(); }, 1500);
        } else {
            showToast(result.error || 'Failed to cancel', 'error');
        }
    } catch (e) {
        showToast('Network Error', 'error');
    } finally {
        Loading.hide();
    }
}
  function promptDeleteAccount() {
      document.querySelectorAll('.spy-modal-overlay').forEach(e => e.remove());
      const modal = document.createElement('div');
      modal.className = 'spy-modal-overlay';
      modal.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.95); z-index:100000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(8px); animation:fadeIn 0.3s ease;`;
  
      modal.innerHTML = `
          <div style="background:var(--bg-panel); border:1px solid var(--fail); border-radius:16px; width:100%; max-width:380px; box-shadow:0 0 60px rgba(255,59,92,0.2); overflow:hidden;">
              <div style="background:rgba(255,59,92,0.15); padding:24px; border-bottom:1px solid rgba(255,59,92,0.3); text-align:center;">
                  <div style="font-size:40px; margin-bottom:12px;">⚠️</div>
                  <div style="color:var(--fail); font-weight:900; font-size:16px; letter-spacing:1px;">RETIRE FROM MISSION?</div>
              </div>
              <div style="padding:24px;">
                  <p style="color:#fff; font-size:13px; margin:0 0 16px 0; line-height:1.6; text-align:center;">This action will <strong style="color:var(--fail);">permanently delete</strong> your account and all data.</p>
                  <div style="background:rgba(255,59,92,0.05); padding:16px; border-radius:8px; border:1px solid rgba(255,59,92,0.2);">
                      <div style="color:var(--fail); font-size:10px; font-weight:800; letter-spacing:1px; margin-bottom:8px;">⚠️ THIS WILL DELETE:</div>
                      <ul style="margin:0; padding-left:20px; color:var(--text-secondary); font-size:12px; line-height:1.7;">
                          <li>All streaming stats & XP</li>
                          <li>Your badges and achievements</li>
                          <li>Your streak history</li>
                          <li>Team contributions data</li>
                      </ul>
                  </div>
                  <div style="margin-top:20px;">
                      <label class="label-tag" style="display:block; margin-bottom:6px; text-align:center;">Enter password to confirm</label>
                      <input type="password" id="deleteConfirmPassword" placeholder="Your password" class="input-field" style="text-align:center;">
                  </div>
              </div>
              <div style="padding:16px 24px; border-top:1px solid var(--border-subtle); display:flex; gap:12px;">
                  <button onclick="document.querySelector('.spy-modal-overlay').remove()" class="btn-outline" style="flex:1;">Cancel</button>
                  <button onclick="confirmDeleteAccount()" class="btn-red" style="flex:1;">ERASE DATA</button>
              </div>
          </div>
      `;
      document.body.appendChild(modal);
      setTimeout(() => { document.getElementById('deleteConfirmPassword')?.focus(); }, 100);
  }
  
  async function confirmDeleteAccount() {
      const input = document.getElementById('deleteConfirmPassword');
      const password = input?.value?.trim();
      if (!password) {
          showToast('Please enter your password', 'error');
          input?.focus();
          return;
      }
  
      document.querySelector('.spy-modal-overlay')?.remove();
      Loading.show();
      
      try {
          const result = await Api.call('deleteAccount', { agentNo: STATE.agentNo, password: password });
          if (result.success) {
              showToast('Account deleted. Thank you for your service.', 'success');
              setTimeout(() => { doLogout(); }, 2000);
          } else {
              showToast(result.error || 'Failed to delete account', 'error');
          }
      } catch (e) {
          showToast('Network Error', 'error');
      } finally {
          Loading.hide();
      }
  }
  // =============================================
  // ██████  GOALS PAGE
  // =============================================
  
  /**
   * Render goals with cached API call (60s TTL).
   * v2.0: Cache shared with 148 Protocol page.
   */
 // =============================================
// ██████  TRACK GOALS PAGE
// =============================================
// =============================================
// ██████  TRACK GOALS PAGE
// =============================================
async function renderTrackGoals() {
    const container = $('trackGoalsContent');
    if (!container) return;

    const team = STATE.data?.agent?.profile?.team || 'Unknown';
    const tColor = teamColor(team);

    showPageLoading(container);

    try {
        const data = await Api.call('getGoalsProgress', { week: STATE.week }, { cache: true, ttl: 60_000 });
        if (data.lastUpdated) STATE.lastUpdated = data.lastUpdated;

        const trackGoals = data.trackGoals || {};

        let html = '';

        // ★ INJECT NARRATIVE LORE BOX
        if (Object.keys(trackGoals).length > 0) {
            html += renderNarrativeCard('trackGoals');
        }

        // Targets header + 148 Protocol
        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div class="section-label" style="margin:0; border:none; padding:0;">🎯 Targets</div>
                <div style="font-family:'Share Tech Mono', monospace; font-size:10px; color:var(--red-core); padding:3px 10px; background:rgba(255,20,95,0.1); border:1px solid rgba(255,20,95,0.3); border-radius:12px;">
                    ${STATE.week}
                </div>
            </div>

            <div style="margin-bottom:16px;">
                <button onclick="goTo('protocol148')" class="btn-outline" style="width:100%; border-color:var(--wave-foam); color:var(--wave-foam);">
                    <span style="font-size:16px;">🧠</span> OPEN 148 PROTOCOL ANALYSIS
                </button>
            </div>

            <div style="font-family:'Share Tech Mono', monospace; font-size:9px; color:var(--text-muted); text-align:right; margin-bottom:14px;">
                UPDATED: ${formatTimeAgo(STATE.lastUpdated || new Date())}
            </div>
        `;

        // Track Goals
        if (Object.keys(trackGoals).length > 0) {
            html += `
                <div class="archive-card" style="border-top:3px solid ${tColor};">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                        <h3 style="font-size:13px; font-weight:800; color:#fff; margin:0; display:flex; align-items:center; gap:8px;">
                            <span>🎵</span> Track Goals
                        </h3>
                        <span style="font-size:9px; font-weight:800; padding:2px 8px; border-radius:12px; background:${tColor}22; color:${tColor};">${team.replace('Team ', '')}</span>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:12px;">
            `;

            for (const [track, info] of Object.entries(trackGoals)) {
                const tp = info.teams?.[team] || {};
                const current = tp.current || 0;
                const goal = info.goal || 0;
                const done = tp.status === 'Completed' || current >= goal;
                const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

                html += `
                    <div style="padding:12px; background:rgba(255,255,255,0.02); border-radius:8px; border-left:2px solid ${done ? 'var(--green)' : 'var(--text-muted)'};">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="font-size:12px; color:${done ? 'var(--green)' : 'var(--text-muted)'}">${done ? '✓' : '⏳'}</span>
                                <span style="font-size:12px; font-weight:700; color:${done ? '#fff' : 'var(--text-secondary)'};">${sanitize(track)}</span>
                            </div>
                            <span style="font-family:'Share Tech Mono', monospace; font-size:11px; font-weight:800; color:${done ? 'var(--green)' : 'var(--text-muted)'};">
                                ${fmt(current)} / ${fmt(goal)}
                            </span>
                        </div>
                        <div class="pbar">
                            <div class="pfill ${done ? 'green' : ''}" style="width:${pct}%; ${!done ? 'background:'+tColor : ''}"></div>
                        </div>
                    </div>
                `;
            }
            html += '</div></div>';
        } else {
            html += '<div class="glass-card" style="padding:40px; text-align:center; color:var(--text-muted);">No track goals set for this week</div>';
        }

        container.innerHTML = html;

    } catch (e) {
        console.error('Track Goals error:', e);
        showPageError(container, 'renderTrackGoals');
    }
}


// =============================================
// ██████  ALBUM GOALS PAGE
// =============================================
async function renderAlbumGoals() {
    const container = $('albumGoalsContent');
    if (!container) return;

    const team = STATE.data?.agent?.profile?.team || 'Unknown';
    const tColor = teamColor(team);

    showPageLoading(container);

    try {
        const data = await Api.call('getGoalsProgress', { week: STATE.week }, { cache: true, ttl: 60_000 });
        if (data.lastUpdated) STATE.lastUpdated = data.lastUpdated;

        const albumGoals = data.albumGoals || {};

        let html = '';

        // ★ INJECT NARRATIVE LORE BOX
        if (Object.keys(albumGoals).length > 0) {
            html += renderNarrativeCard('albumGoals');
        }

        // Targets header + 148 Protocol
        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div class="section-label" style="margin:0; border:none; padding:0;">📀 Targets</div>
                <div style="font-family:'Share Tech Mono', monospace; font-size:10px; color:var(--red-core); padding:3px 10px; background:rgba(255,20,95,0.1); border:1px solid rgba(255,20,95,0.3); border-radius:12px;">
                    ${STATE.week}
                </div>
            </div>

            <div style="margin-bottom:16px;">
                <button onclick="goTo('protocol148')" class="btn-outline" style="width:100%; border-color:var(--wave-foam); color:var(--wave-foam);">
                    <span style="font-size:16px;">🧠</span> OPEN 148 PROTOCOL ANALYSIS
                </button>
            </div>

            <div style="font-family:'Share Tech Mono', monospace; font-size:9px; color:var(--text-muted); text-align:right; margin-bottom:14px;">
                UPDATED: ${formatTimeAgo(STATE.lastUpdated || new Date())}
            </div>
        `;

        // Album Goals
        if (Object.keys(albumGoals).length > 0) {
            html += `
                <div class="archive-card" style="border-top:3px solid var(--vinyl-gold);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                        <h3 style="font-size:13px; font-weight:800; color:#fff; margin:0; display:flex; align-items:center; gap:8px;">
                            <span>💿</span> Album Goals
                        </h3>
                        <span style="font-size:9px; font-weight:800; padding:2px 8px; border-radius:12px; background:${tColor}22; color:${tColor};">${team.replace('Team ', '')}</span>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:12px;">
            `;

            for (const [album, info] of Object.entries(albumGoals)) {
                const ap = info.teams?.[team] || {};
                const current = ap.current || 0;
                const goal = info.goal || 0;
                const done = ap.status === 'Completed' || current >= goal;
                const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

                html += `
                    <div style="padding:12px; background:rgba(255,255,255,0.02); border-radius:8px; border-left:2px solid ${done ? 'var(--green)' : 'var(--text-muted)'};">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="font-size:12px; color:${done ? 'var(--green)' : 'var(--text-muted)'}">${done ? '✓' : '⏳'}</span>
                                <span style="font-size:12px; font-weight:700; color:${done ? '#fff' : 'var(--text-secondary)'};">${sanitize(album)}</span>
                            </div>
                            <span style="font-family:'Share Tech Mono', monospace; font-size:11px; font-weight:800; color:${done ? 'var(--green)' : 'var(--text-muted)'};">
                                ${fmt(current)} / ${fmt(goal)}
                            </span>
                        </div>
                        <div class="pbar">
                            <div class="pfill ${done ? 'green' : ''}" style="width:${pct}%; ${!done ? 'background:var(--vinyl-gold)' : ''}"></div>
                        </div>
                    </div>
                `;
            }
            html += '</div></div>';
        } else {
            html += '<div class="glass-card" style="padding:40px; text-align:center; color:var(--text-muted);">No album goals set for this week</div>';
        }

        container.innerHTML = html;

    } catch (e) {
        console.error('Album Goals error:', e);
        showPageError(container, 'renderAlbumGoals');
    }
}
  
  // =============================================
  // ██████  ALBUM 2X PAGE
  // =============================================
  
  /**
   * Render Album 2X status with daily grid + team completion.
   * v2.0: Cached team data (60s TTL), uses buildMemberPill helper.
   */
  // =============================================
  // ██████  ALBUM 2X PAGE (7-Day Dopamine Grid)
  // =============================================
async function renderAlbum2x() {
    const container = $('album2xContent');
    if (!container) return;

    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const team = STATE.data?.agent?.profile?.team || 'Unknown';
    const currentWeek = STATE.week || 'Week 1';

    const REQUIRED = CONFIG.ALBUM_CHALLENGE?.REQUIRED_STREAMS || 2;
    const CHALLENGE_NAME = 'ARIRANG 2X';
    const BADGE_NAME = CONFIG.ALBUM_CHALLENGE?.BADGE_NAME || '2X Master';

    const teamTracks = CONFIG.ARIRANG_TRACKS || [];
    const currentTeamColor = teamColor(team);
    const today = STATE.data?.agent?.sideMissions?.today || getKSTDateString();

    showPageLoading(container);

    let a2xData = {};
    let allMembers = [];
    let passedMembers = [];
    let failedMembers = [];
    let totalMembers = 0;
    let weekDates = getWeekDates(currentWeek);

    try {
        const res = await Api.call('getAlbum2xStatus', {
            week: currentWeek,
            team: team,
            agentNo: STATE.agentNo
        }, { cache: true, ttl: 60_000 });

        a2xData = res || {};

        const teamData = res.teams?.[team] || {};
        allMembers = teamData.members || [];

        window._a2xMembers = allMembers;
        window._a2xToday = res.today || today;

        passedMembers = allMembers.filter(m => m.passed === true);
        failedMembers = allMembers.filter(m => m.passed !== true);
        totalMembers = allMembers.length;

        // Use server-provided dates if available
        if (res.weekDates) weekDates = res.weekDates;

    } catch (e) {
        a2xData = { dailyGrid: STATE.data?.agent?.album2xStatus?.dailyGrid || {} };
    }

    const isUserExempt = STATE.data?.agent?.onLeave || false;
    const isWeekComplete = STATE.data?.agent?.album2xStatus?.weeklyPassed || false;

    // Calculate today's progress (personal)
    let todayPassedCount = 0;
    teamTracks.forEach(track => {
        const cell = STATE.data?.agent?.album2xStatus?.dailyGrid?.[today]?.[track];
        if (cell?.passed || String(cell?.count).toLowerCase() === 'exempt') {
            todayPassedCount++;
        }
    });

    const todayPct = teamTracks.length ? Math.round((todayPassedCount / teamTracks.length) * 100) : 0;
    const isTodayComplete = todayPassedCount >= teamTracks.length;

    let html = `
        ${renderGuide('album2x') || ''}
        ${renderNarrativeCard('album2x')}`;

    const teamAllComplete = totalMembers > 0 && passedMembers.length === totalMembers;

    // ═══════════════════════════════
    // 1. TODAY'S TARGET (Personal)
    // ═══════════════════════════════
    html += `
        <div class="archive-card" style="padding:24px; text-align:center; margin-bottom:24px; border-top:4px solid ${isUserExempt ? 'var(--text-muted)' : (isTodayComplete ? 'var(--green)' : 'var(--red-core)')};">
            <div style="font-size:10px; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:3px; margin-bottom:12px;">Today's Target</div>

            <div style="font-size:48px; margin-bottom:12px; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.5));">
                ${isUserExempt ? '👻' : (isTodayComplete ? '🎉' : '💿')}
            </div>

            <div style="font-size:40px; font-weight:900; font-family:'Share Tech Mono', monospace; color:${isUserExempt ? 'var(--text-muted)' : (isTodayComplete ? 'var(--green)' : '#fff')}; line-height:1; text-shadow:0 0 20px ${isUserExempt ? 'transparent' : (isTodayComplete ? 'rgba(0,255,102,0.4)' : 'rgba(255,255,255,0.2)')};">
                ${todayPassedCount}/${teamTracks.length}
            </div>
            <p style="color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:2px; margin:8px 0 20px;">Tracks Streamed Today</p>

            <div class="pbar" style="height:12px; max-width:260px; margin:0 auto; background:rgba(255,255,255,0.05);">
                <div class="pfill ${isTodayComplete ? 'green' : ''}" style="width:${todayPct}%; ${!isTodayComplete && !isUserExempt ? 'background:var(--red-core)' : ''}; box-shadow:0 0 10px ${isTodayComplete ? 'var(--green)' : 'var(--red-core)'};"></div>
            </div>

            ${isUserExempt ? `
                <div style="margin-top:20px; font-size:11px; color:var(--text-secondary); font-weight:700; letter-spacing:1px;">GHOST PROTOCOL: EXEMPT</div>
            ` : isTodayComplete ? `
                <div style="margin-top:20px; font-size:11px; color:var(--green); font-weight:800; letter-spacing:1px;">✓ DAILY TARGET SECURED</div>
            ` : `
                <div style="margin-top:20px; font-size:11px; color:var(--red-core); font-weight:700; letter-spacing:1px; animation:pulse-dot 2s infinite;">ACTION REQUIRED</div>
            `}
        </div>
    `;

    // ═══════════════════════════════
    // 2. WEEKLY HEATMAP (Personal)
    // ═══════════════════════════════
    html += `
        <div class="glass-card" style="padding:20px 16px; margin-bottom:24px; overflow-x:auto;">
            <div style="font-size:12px; font-weight:900; color:#fff; text-transform:uppercase; letter-spacing:2px; margin-bottom:16px;">📅 Weekly Heatmap</div>

            <div style="display:grid; grid-template-columns:120px repeat(7, minmax(36px, 1fr)); gap:4px; min-width:400px;">
                <div style="padding:8px; font-size:9px; color:var(--text-ghost); font-weight:800; text-transform:uppercase; letter-spacing:1px; display:flex; align-items:flex-end;">Track</div>
                ${weekDates.map((d, i) => {
                    const isToday = d === today;
                    return `
                        <div style="text-align:center; padding:8px 0; background:${isToday ? 'rgba(255,20,95,0.1)' : 'var(--bg-lifted)'}; border-radius:6px; border:1px solid ${isToday ? 'var(--red-core)' : 'transparent'};">
                            <div style="font-size:8px; font-weight:900; color:${isToday ? 'var(--red-core)' : 'var(--text-muted)'}; text-transform:uppercase; margin-bottom:4px;">${DAYS[new Date(d).getDay()] || 'D' + (i + 1)}</div>
                        </div>
                    `;
                }).join('')}

                ${teamTracks.map(track => {
                    let rowHtml = `
                        <div style="padding:8px; font-size:10px; font-weight:700; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex; align-items:center; border-bottom:1px solid var(--border-subtle);">
                            ${sanitize(track)}
                        </div>
                    `;

                    weekDates.forEach(d => {
                        const cell = STATE.data?.agent?.album2xStatus?.dailyGrid?.[d]?.[track];
                        const isFuture = d > today;
                        const isExemptCell = String(cell?.count).toLowerCase() === 'exempt';

                        let bg = 'rgba(255,255,255,0.02)';
                        let border = 'var(--border-subtle)';
                        let color = 'var(--text-muted)';
                        let text = cell?.count || '0';
                        let opacity = '1';

                        if (isFuture) {
                            bg = 'transparent'; border = 'transparent'; text = '—'; opacity = '0.3';
                        } else if (isExemptCell) {
                            bg = 'rgba(255,255,255,0.05)'; border = 'rgba(255,255,255,0.1)'; color = 'var(--text-ghost)'; text = '-';
                        } else if (cell?.passed) {
                            bg = 'var(--green-soft)'; border = 'var(--green-border)'; color = 'var(--green)'; text = '✓';
                        } else if (d === today && cell?.count > 0) {
                            bg = 'var(--red-whisper)'; border = 'var(--red-border)'; color = 'var(--red-core)'; text = cell.count;
                        }

                        rowHtml += `
                            <div style="display:flex; align-items:center; justify-content:center; background:${bg}; border:1px solid ${border}; border-radius:4px; font-family:'Share Tech Mono', monospace; font-size:10px; font-weight:800; color:${color}; margin-bottom:4px; opacity:${opacity};">
                                ${text}
                            </div>
                        `;
                    });
                    return rowHtml;
                }).join('')}
            </div>

            ${isWeekComplete ? `
                <div style="margin-top:20px; padding:12px; background:var(--green-soft); border:1px solid var(--green-border); border-radius:8px; text-align:center;">
                    <div style="font-size:20px; margin-bottom:4px;">🎖️</div>
                    <div style="color:var(--green); font-size:12px; font-weight:900; letter-spacing:2px; text-transform:uppercase;">${BADGE_NAME} EARNED</div>
                </div>
            ` : ''}
        </div>
    `;

    // ═══════════════════════════════════════════
    // 3. ✅ NEW: DAILY TEAM MONITOR (Day Picker)
    // ═══════════════════════════════════════════
    if (allMembers.length > 0 && allMembers[0]?.daily) {

        // Calculate daily team stats
        const dailyTeamStats = weekDates.map(date => {
            const isFuture = date > today;
            let completed = 0;
            let exempt = 0;
            let active = 0;

            if (!isFuture) {
                allMembers.forEach(m => {
                    const dayStatus = m.daily?.[date];
                    if (!dayStatus) return;
                    if (dayStatus.exempt || m.onLeave) { exempt++; }
                    else if (dayStatus.passed) { completed++; }
                    active++;
                });
            }

            return { date, completed, exempt, active, isFuture };
        });

        html += `
            <div class="glass-card" style="padding:20px; margin-bottom:24px; border-top:3px solid ${currentTeamColor};">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <h3 style="margin:0; font-size:13px; font-weight:800; color:#fff; display:flex; align-items:center; gap:8px;">
                        <span style="font-size:16px;">📊</span> Daily Team Monitor
                    </h3>
                    <span style="font-size:9px; color:var(--text-muted); font-family:var(--font-mono);">
                        Tap a day to inspect
                    </span>
                </div>

                <!-- Day Selector Tabs -->
                <div style="display:flex; gap:4px; margin-bottom:16px; overflow-x:auto; padding-bottom:4px;">
                    ${weekDates.map((date, i) => {
                        const isToday = date === today;
                        const isFuture = date > today;
                        const ds = dailyTeamStats[i];
                        const allDone = !isFuture && ds.active > 0 && (ds.completed + ds.exempt) >= ds.active;

                        return `
                            <button onclick="showAlbum2xDay('${date}')"
                                class="a2x-day-tab${isToday ? ' a2x-day-tab--active' : ''}"
                                data-date="${date}"
                                ${isFuture ? 'disabled' : ''}
                                style="
                                    flex:1; min-width:44px; padding:8px 4px; border-radius:8px; border:1px solid ${isToday ? currentTeamColor : 'var(--border-light)'};
                                    background:${isToday ? currentTeamColor + '15' : 'var(--bg-lifted)'};
                                    color:${isFuture ? 'var(--text-ghost)' : '#fff'};
                                    cursor:${isFuture ? 'not-allowed' : 'pointer'};
                                    text-align:center; font-size:9px; font-weight:800; text-transform:uppercase;
                                    opacity:${isFuture ? '0.35' : '1'}; transition:all 0.2s;
                                ">
                                <div>${DAYS[new Date(date).getDay()]}</div>
                                <div style="font-size:7px; color:var(--text-muted); margin-top:2px;">${date.slice(5)}</div>
                                ${!isFuture ? `
                                    <div style="margin-top:4px; font-size:10px;">
                                        ${allDone ? '<span style="color:var(--green);">✓</span>' : `<span style="color:var(--red-core);">${ds.completed}/${ds.active - ds.exempt}</span>`}
                                    </div>
                                ` : ''}
                            </button>
                        `;
                    }).join('')}
                </div>

                <!-- Daily Members List (default: today) -->
                <div id="a2xDailyView">
                    ${renderAlbum2xDayMembers(allMembers, today, today)}
                </div>
            </div>
        `;
    }

    // ═══════════════════════════════════════
    // 4. TEAM WEEKLY INTELLIGENCE (existing)
    // ═══════════════════════════════════════
    html += `
        <div class="glass-card" style="padding:20px; border-top:3px solid ${teamAllComplete ? 'var(--green)' : currentTeamColor};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="margin:0; font-size:13px; font-weight:800; color:#fff; display:flex; align-items:center; gap:8px;">
                    <span style="font-size:16px;">👥</span> Team ${sanitize(team).replace('Team ', '')} — Weekly
                </h3>
                <span style="padding:4px 10px; border-radius:12px; font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:1px; background:${teamAllComplete ? 'var(--green-soft)' : 'rgba(255,255,255,0.05)'}; color:${teamAllComplete ? 'var(--green)' : 'var(--text-secondary)'};">
                    ${totalMembers === 0 ? 'Loading' : teamAllComplete ? 'All Passed ✓' : failedMembers.length + ' Pending'}
                </span>
            </div>

            ${totalMembers === 0 ? `
                <div style="text-align:center; padding:20px; color:var(--text-muted); font-size:11px;">Loading team intelligence...</div>
            ` : `
                <div style="margin-bottom:20px;">
                    <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">
                        <span>Team Weekly Completion</span>
                        <span style="color:#fff; font-family:'Share Tech Mono', monospace;">${passedMembers.length}/${totalMembers}</span>
                    </div>
                    <div class="pbar" style="height:6px;">
                        <div class="pfill ${teamAllComplete ? 'green' : ''}" style="width:${totalMembers ? (passedMembers.length / totalMembers) * 100 : 0}%; ${!teamAllComplete ? 'background:' + currentTeamColor : ''}"></div>
                    </div>
                </div>

                ${failedMembers.length > 0 ? `
                    <div style="background:var(--red-whisper); border:1px solid var(--red-border); border-radius:8px; padding:12px; margin-bottom:12px;">
                        <div style="color:var(--red-core); font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">
                            🚨 Agents Action Required (${failedMembers.length})
                        </div>
                        <div style="display:flex; flex-wrap:wrap; gap:6px; max-height:150px; overflow-y:auto;">
                            ${failedMembers.slice(0, 50).map(m => `
                                <span style="display:inline-flex; align-items:center; gap:6px; padding:4px 10px; background:rgba(255,20,95,0.1); border:1px solid rgba(255,20,95,0.2); border-radius:6px; font-size:10px; color:#fff;">
                                    ✗ ${displayName(m.name)}
                                </span>
                            `).join('')}
                            ${failedMembers.length > 50 ? '<span style="font-size:10px; color:var(--text-muted); padding:4px;">+' + (failedMembers.length - 50) + ' more</span>' : ''}
                        </div>
                    </div>
                ` : ''}

                ${passedMembers.length > 0 ? `
                    <div style="background:var(--green-soft); border:1px solid var(--green-border); border-radius:8px; padding:12px;">
                        <div style="color:var(--green); font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">
                            ✅ Secured Agents (${passedMembers.length})
                        </div>
                        <div style="display:flex; flex-wrap:wrap; gap:6px; max-height:150px; overflow-y:auto;">
                            ${passedMembers.slice(0, 50).map(m => `
                                <span style="display:inline-flex; align-items:center; gap:6px; padding:4px 10px; background:rgba(0,255,102,0.05); border:1px solid rgba(0,255,102,0.15); border-radius:6px; font-size:10px; color:#fff;">
                                    ✓ ${displayName(m.name)}
                                </span>
                            `).join('')}
                            ${passedMembers.length > 50 ? '<span style="font-size:10px; color:var(--text-muted); padding:4px;">+' + (passedMembers.length - 50) + ' more</span>' : ''}
                        </div>
                    </div>
                ` : ''}
            `}
        </div>
    `;

    container.innerHTML = html;
}
// ═══ Render a single day's member status ═══
function renderAlbum2xDayMembers(allMembers, date, today) {
    const isFuture = date > today;
    if (isFuture) {
        return `<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:11px;">Future date — no data yet</div>`;
    }

    const dayCompleted = [];
    const dayFailed = [];
    const dayExempt = [];

    allMembers.forEach(m => {
        const dayStatus = m.daily?.[date];
        if (!dayStatus) {
            dayFailed.push({ name: m.name, tracksDone: 0, totalTracks: dayStatus?.totalTracks || 0 });
            return;
        }
        if (dayStatus.exempt || m.onLeave) {
            dayExempt.push({ name: m.name });
        } else if (dayStatus.passed) {
            dayCompleted.push({ name: m.name });
        } else {
            dayFailed.push({ name: m.name, tracksDone: dayStatus.tracksDone, totalTracks: dayStatus.totalTracks });
        }
    });

    const activeCount = allMembers.length - dayExempt.length;
    const completionPct = activeCount > 0 ? Math.round((dayCompleted.length / activeCount) * 100) : 0;

    const isToday = date === today;
    const dayLabel = isToday ? 'Today' : new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return `
        <div style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">
                <span>${dayLabel} — ${date}</span>
                <span style="color:#fff; font-family:var(--font-mono);">${dayCompleted.length}/${activeCount} active</span>
            </div>
            <div class="pbar" style="height:5px; margin-bottom:4px;">
                <div class="pfill" style="width:${completionPct}%; background:${completionPct === 100 ? 'var(--green)' : 'var(--red-core)'}; box-shadow:0 0 8px ${completionPct === 100 ? 'var(--green)' : 'var(--red-core)'};"></div>
            </div>
            ${dayExempt.length > 0 ? `
                <div style="font-size:9px; color:var(--text-ghost); margin-bottom:4px;">${dayExempt.length} on leave (exempt)</div>
            ` : ''}
        </div>

        ${dayFailed.length > 0 ? `
            <div style="background:var(--red-whisper); border:1px solid var(--red-border); border-radius:8px; padding:12px; margin-bottom:10px;">
                <div style="color:var(--red-core); font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">
                    ${isToday ? '🚨 Not Yet Completed Today' : '✗ Did Not Complete'} (${dayFailed.length})
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:6px; max-height:150px; overflow-y:auto;">
                    ${dayFailed.slice(0, 50).map(m => `
                        <span style="display:inline-flex; align-items:center; gap:4px; padding:4px 10px; background:rgba(255,20,95,0.1); border:1px solid rgba(255,20,95,0.2); border-radius:6px; font-size:10px; color:#fff;">
                            ✗ ${displayName(m.name)}
                            ${m.totalTracks > 0 ? `<span style="font-size:8px; color:var(--text-muted); font-family:var(--font-mono);">${m.tracksDone}/${m.totalTracks}</span>` : ''}
                        </span>
                    `).join('')}
                    ${dayFailed.length > 50 ? `<span style="font-size:10px; color:var(--text-muted); padding:4px;">+${dayFailed.length - 50} more</span>` : ''}
                </div>
            </div>
        ` : ''}

        ${dayCompleted.length > 0 ? `
            <div style="background:var(--green-soft); border:1px solid var(--green-border); border-radius:8px; padding:12px;">
                <div style="color:var(--green); font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">
                    ✅ Completed (${dayCompleted.length})
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:6px; max-height:150px; overflow-y:auto;">
                    ${dayCompleted.slice(0, 50).map(m => `
                        <span style="display:inline-flex; align-items:center; gap:4px; padding:4px 10px; background:rgba(0,255,102,0.05); border:1px solid rgba(0,255,102,0.15); border-radius:6px; font-size:10px; color:#fff;">
                            ✓ ${displayName(m.name)}
                        </span>
                    `).join('')}
                    ${dayCompleted.length > 50 ? `<span style="font-size:10px; color:var(--text-muted); padding:4px;">+${dayCompleted.length - 50} more</span>` : ''}
                </div>
            </div>
        ` : ''}

        ${dayExempt.length > 0 ? `
            <div style="margin-top:10px; background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px; padding:10px;">
                <div style="color:var(--text-muted); font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">
                    💤 Exempt / On Leave (${dayExempt.length})
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:6px;">
                    ${dayExempt.map(m => `
                        <span style="display:inline-flex; align-items:center; gap:4px; padding:3px 8px; background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:6px; font-size:9px; color:var(--text-ghost);">
                            — ${displayName(m.name)}
                        </span>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;
}

// ═══ Day tab click handler ═══
// Store members data globally for tab switching
window._a2xMembers = null;
window._a2xToday = null;

function showAlbum2xDay(date) {
    const container = document.getElementById('a2xDailyView');
    if (!container) return;

    const members = window._a2xMembers;
    const today = window._a2xToday;
    if (!members) {
        console.error("No member data found for Album 2X click");
        return;
    }

    // Update active tab styling
    document.querySelectorAll('.a2x-day-tab').forEach(tab => {
        const tabDate = tab.getAttribute('data-date');
        const isActive = tabDate === date;
        tab.classList.toggle('a2x-day-tab--active', isActive);
        tab.style.borderColor = isActive ? (teamColor(STATE.data?.agent?.profile?.team) || 'var(--red-core)') : 'var(--border-light)';
        tab.style.background = isActive ? (teamColor(STATE.data?.agent?.profile?.team) || 'var(--red-core)') + '15' : 'var(--bg-lifted)';
    });

    container.innerHTML = renderAlbum2xDayMembers(members, date, today);
}
  
  // =============================================
  // ██████  SIDE MISSIONS PAGE
  // =============================================
  // ═══════════════════════════════════════════
// SIDE MISSION TEAM MONITOR — Helpers
// ═══════════════════════════════════════════

window._smTeamMembers = null;
window._smTeamToday = null;
window._smTrackNames = null;

async function loadSideMissionTeamMonitor(teamName, weekDates, today) {
    const box = document.getElementById('smTeamMonitor');
    if (!box || !teamName) return;

    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const res = await Api.call('getSideMissionTeamStatus', {
        week: STATE.week,
        team: teamName,
    }, { cache: true, ttl: 60000 });

    if (!res?.success || !res.members) {
        box.innerHTML = `<div style="text-align:center; padding:14px; color:var(--text-muted); font-size:11px;">No data available.</div>`;
        return;
    }

    const members = res.members;
    const totalTracks = res.totalTracks || 4;
    const dates = res.weekDates || weekDates;
    const serverToday = res.today || today;

    window._smTeamMembers = members;
    window._smTeamToday = serverToday;
    window._smTrackNames = res.trackNames || [];

    const dailyStats = dates.map(date => {
        const isFuture = date > serverToday;
        let completed = 0, exempt = 0, active = 0;

        if (!isFuture) {
            members.forEach(m => {
                const ds = m.daily?.[date];
                if (!ds) return;
                if (ds.exempt || m.onLeave) { exempt++; }
                else if (ds.passed) { completed++; }
                active++;
            });
        }

        return { date, completed, exempt, active, isFuture };
    });

    const weeklyPassed = members.filter(m => m.weekPassed).length;
    const weeklyFailed = members.filter(m => !m.weekPassed).length;
    const tColor = teamColor(teamName);

    box.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="margin:0; font-size:13px; font-weight:800; color:#fff; display:flex; align-items:center; gap:8px;">
                <span style="font-size:16px;">👥</span> Squad Side Mission Monitor
            </h3>
            <span style="padding:4px 10px; border-radius:12px; font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:1px;
                background:${weeklyFailed === 0 ? 'var(--green-soft)' : 'rgba(255,255,255,0.05)'};
                color:${weeklyFailed === 0 ? 'var(--green)' : 'var(--text-secondary)'};">
                ${weeklyFailed === 0 ? 'All Clear ✓' : weeklyFailed + ' at risk'}
            </span>
        </div>

        <div style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">
                <span>Weekly Chain Intact</span>
                <span style="color:#fff; font-family:var(--font-mono);">${weeklyPassed}/${members.length}</span>
            </div>
            <div class="pbar" style="height:5px;">
                <div class="pfill" style="width:${members.length ? (weeklyPassed / members.length) * 100 : 0}%; background:${weeklyFailed === 0 ? 'var(--green)' : tColor};"></div>
            </div>
        </div>

        <div style="font-size:9px; color:var(--text-muted); margin-bottom:8px; font-weight:700;">Tap a day to inspect:</div>
        <div style="display:flex; gap:4px; margin-bottom:16px; overflow-x:auto; padding-bottom:4px;">
            ${dates.map((date, i) => {
                const isToday = date === serverToday;
                const isFuture = date > serverToday;
                const ds = dailyStats[i];
                const activeNonExempt = ds.active - ds.exempt;
                const allDone = !isFuture && activeNonExempt > 0 && ds.completed >= activeNonExempt;

                return `
                    <button onclick="showSmDay('${date}')"
                        class="sm-day-tab${isToday ? ' sm-day-tab--active' : ''}"
                        data-date="${date}"
                        ${isFuture ? 'disabled' : ''}
                        style="
                            flex:1; min-width:44px; padding:8px 4px; border-radius:8px;
                            border:1px solid ${isToday ? tColor : 'var(--border-light)'};
                            background:${isToday ? tColor + '15' : 'var(--bg-lifted)'};
                            color:${isFuture ? 'var(--text-ghost)' : '#fff'};
                            cursor:${isFuture ? 'not-allowed' : 'pointer'};
                            text-align:center; font-size:9px; font-weight:800; text-transform:uppercase;
                            opacity:${isFuture ? '0.35' : '1'}; transition:all 0.2s;
                        ">
                        <div>${DAYS[new Date(date).getDay()]}</div>
                        <div style="font-size:7px; color:var(--text-muted); margin-top:2px;">${date.slice(5)}</div>
                        ${!isFuture ? `
                            <div style="margin-top:4px; font-size:10px;">
                                ${allDone
                                    ? '<span style="color:var(--green);">✓</span>'
                                    : `<span style="color:var(--red-core);">${ds.completed}/${activeNonExempt}</span>`
                                }
                            </div>
                        ` : ''}
                    </button>
                `;
            }).join('')}
        </div>

        <div id="smDailyView">
            ${renderSmDayMembers(members, serverToday, serverToday, totalTracks)}
        </div>
    `;
}

function renderSmDayMembers(members, date, today, totalTracks) {
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const isFuture = date > today;
    if (isFuture) {
        return `<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:11px;">Future date — no data yet</div>`;
    }

    const dayCompleted = [];
    const dayFailed = [];
    const dayExempt = [];

    members.forEach(m => {
        const ds = m.daily?.[date];
        if (!ds) {
            dayFailed.push({ name: m.name, tracksDone: 0, totalTracks, missingTracks: [] });
            return;
        }
        if (ds.exempt || m.onLeave) {
            dayExempt.push({ name: m.name });
        } else if (ds.passed) {
            dayCompleted.push({ name: m.name, tracksDone: ds.tracksDone });
        } else {
            dayFailed.push({
                name: m.name,
                tracksDone: ds.tracksDone,
                totalTracks: ds.totalTracks,
                missingTracks: ds.missingTracks || [],
            });
        }
    });

    const activeCount = members.length - dayExempt.length;
    const completionPct = activeCount > 0 ? Math.round((dayCompleted.length / activeCount) * 100) : 0;
    const isToday = date === today;
    const dayLabel = isToday ? 'Today' : `${DAYS[new Date(date).getDay()]} ${date.slice(5)}`;

    return `
        <div style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">
                <span>${dayLabel}</span>
                <span style="color:#fff; font-family:var(--font-mono);">${dayCompleted.length}/${activeCount} active</span>
            </div>
            <div class="pbar" style="height:5px; margin-bottom:4px;">
                <div class="pfill" style="width:${completionPct}%; background:${completionPct === 100 ? 'var(--green)' : 'var(--red-core)'};"></div>
            </div>
            ${dayExempt.length > 0 ? `<div style="font-size:9px; color:var(--text-ghost); margin-bottom:4px;">${dayExempt.length} on leave (exempt)</div>` : ''}
        </div>

        ${dayFailed.length > 0 ? `
            <div style="background:var(--red-whisper); border:1px solid var(--red-border); border-radius:8px; padding:12px; margin-bottom:10px;">
                <div style="color:var(--red-core); font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">
                    ${isToday ? '🚨 Not Yet Completed Today' : '✗ Missed This Day'} (${dayFailed.length})
                </div>
                <div style="display:flex; flex-direction:column; gap:6px; max-height:200px; overflow-y:auto;">
                    ${dayFailed.slice(0, 50).map(m => `
                        <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 10px; background:rgba(255,20,95,0.06); border:1px solid rgba(255,20,95,0.12); border-radius:6px;">
                            <div style="display:flex; align-items:center; gap:6px;">
                                <span style="font-size:10px; color:var(--red-core);">✗</span>
                                <span style="font-size:10px; color:#fff; font-weight:700;">${displayName(m.name)}</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:6px;">
                                <span style="font-size:9px; color:var(--text-muted); font-family:var(--font-mono);">${m.tracksDone}/${m.totalTracks}</span>
                                ${m.missingTracks.length > 0 && m.missingTracks.length <= 3 ? `
                                    <span style="font-size:8px; color:var(--red-core); max-width:120px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${m.missingTracks.join(', ')}">
                                        Missing: ${m.missingTracks.join(', ')}
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                    ${dayFailed.length > 50 ? `<span style="font-size:10px; color:var(--text-muted); padding:4px;">+${dayFailed.length - 50} more</span>` : ''}
                </div>
            </div>
        ` : ''}

        ${dayCompleted.length > 0 ? `
            <div style="background:var(--green-soft); border:1px solid var(--green-border); border-radius:8px; padding:12px; margin-bottom:10px;">
                <div style="color:var(--green); font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">
                    ✅ All ${totalTracks} Tracks Done (${dayCompleted.length})
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:6px; max-height:150px; overflow-y:auto;">
                    ${dayCompleted.slice(0, 50).map(m => `
                        <span style="display:inline-flex; align-items:center; gap:4px; padding:4px 10px; background:rgba(0,255,102,0.05); border:1px solid rgba(0,255,102,0.15); border-radius:6px; font-size:10px; color:#fff;">
                            ✓ ${displayName(m.name)}
                        </span>
                    `).join('')}
                    ${dayCompleted.length > 50 ? `<span style="font-size:10px; color:var(--text-muted); padding:4px;">+${dayCompleted.length - 50} more</span>` : ''}
                </div>
            </div>
        ` : ''}

        ${dayExempt.length > 0 ? `
            <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px; padding:10px;">
                <div style="color:var(--text-muted); font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">
                    💤 Exempt (${dayExempt.length})
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:6px;">
                    ${dayExempt.map(m => `
                        <span style="display:inline-flex; align-items:center; gap:4px; padding:3px 8px; background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:6px; font-size:9px; color:var(--text-ghost);">
                            — ${displayName(m.name)}
                        </span>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;
}

function showSmDay(date) {
    const container = document.getElementById('smDailyView');
    if (!container) return;

    const members = window._smTeamMembers;
    const today = window._smTeamToday;
    if (!members) {
        console.error("No member data found for Side Mission click");
        return;
    }

    const totalTracks = window._smTrackNames?.length || 4;
    const tColor = teamColor(STATE.data?.agent?.profile?.team);

    document.querySelectorAll('.sm-day-tab').forEach(tab => {
        const tabDate = tab.getAttribute('data-date');
        const isActive = tabDate === date;
        tab.classList.toggle('sm-day-tab--active', isActive);
        tab.style.borderColor = isActive ? tColor : 'var(--border-light)';
        tab.style.background = isActive ? tColor + '15' : 'var(--bg-lifted)';
    });

    container.innerHTML = renderSmDayMembers(members, date, today, totalTracks);
}
  function renderSideMissions() {
    if (!STATE.data) return;
    const container = $('smContent');
    if (!container) return;

    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const sm = STATE.data.agent.sideMissions;
    const today = sm?.today || getKSTDateString();
    const isOnLeave = STATE.data.agent.onLeave || false;
    const teamName = STATE.data?.agent?.profile?.team;

    let html = renderGuide('sidemissions') || '';
    html += renderNarrativeCard('sideMission');

    if (!sm?.tracks || sm.tracks.length === 0) {
        html += `<div class="glass-card" style="padding:40px; text-align:center; color:var(--text-muted); font-size:12px;">No side missions assigned this week.</div>`;
        container.innerHTML = html;
        return;
    }

    const weekDates = sm.weekDates || [];
    const todayIndex = weekDates.indexOf(today);
    const daysElapsed = todayIndex >= 0 ? todayIndex + 1 : weekDates.filter(d => d <= today).length;
    const daysTotal = weekDates.length;

    // ═══════════════════════════════════
    // 1. HEADER STATUS
    // ═══════════════════════════════════
    html += `
        <div class="archive-card" style="padding:20px; text-align:center; margin-bottom:24px; border-top:4px solid ${sm.weekFullyPassed ? 'var(--green)' : 'var(--courage-amber)'}; background:linear-gradient(135deg, rgba(255,149,0,0.05), var(--bg-panel));">
            <div style="font-size:32px; margin-bottom:12px; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.5));">🛡️</div>
            <div style="font-size:14px; font-weight:900; color:#fff; text-transform:uppercase; letter-spacing:2px; margin-bottom:12px; font-family:'Orbitron', sans-serif;">Survival Protocol</div>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; max-width:300px; margin:0 auto;">
                <div style="padding:12px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.05); border-radius:8px;">
                    <div style="font-size:9px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Today</div>
                    <div style="font-size:11px; font-weight:800; color:${isOnLeave ? 'var(--text-muted)' : (sm.todayAllPassed ? 'var(--green)' : 'var(--courage-amber)')};">
                        ${isOnLeave ? 'EXEMPT' : (sm.todayAllPassed ? '✓ SECURED' : '⚠️ PENDING')}
                    </div>
                </div>
                <div style="padding:12px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.05); border-radius:8px;">
                    <div style="font-size:9px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Week</div>
                    <div style="font-size:11px; font-weight:800; color:${sm.weekFullyPassed ? 'var(--green)' : 'var(--red-core)'};">
                        ${sm.weekFullyPassed ? '✓ ON TRACK' : '🚨 GAPS'}
                    </div>
                </div>
            </div>
            
            <p style="color:var(--text-muted); font-size:10px; margin:16px 0 0; line-height:1.5;">
                Each track: <strong style="color:#fff;">1+ daily</strong> + <strong style="color:#fff;">${sm.tracks[0]?.weeklyRequired || 20} weekly</strong>. No exceptions.
            </p>
        </div>
    `;

    // ═══════════════════════════════════
    // 2. TODAY'S CHECKLIST
    // ═══════════════════════════════════
    const todayTracks = sm.tracks.map(t => {
        const d = t.daily?.[today];
        const count = d?.count ?? 0;
        const passed = d?.passed ?? false;
        return { name: t.name, artist: t.artist, count, passed };
    });
    const todayDoneCount = todayTracks.filter(t => t.passed).length;
    const todayTotal = todayTracks.length;

    if (!isOnLeave) {
        html += `
            <div class="glass-card" style="padding:16px; margin-bottom:24px; border-top:3px solid ${todayDoneCount === todayTotal ? 'var(--green)' : 'var(--courage-amber)'};">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                    <div style="font-size:12px; font-weight:900; color:#fff; text-transform:uppercase; letter-spacing:2px; display:flex; align-items:center; gap:8px;">
                        <span style="font-size:16px;">🎯</span> Today's Checklist
                    </div>
                    <span style="font-family:var(--font-mono); font-size:11px; font-weight:800; color:${todayDoneCount === todayTotal ? 'var(--green)' : 'var(--courage-amber)'};">
                        ${todayDoneCount}/${todayTotal}
                    </span>
                </div>

                <div style="display:flex; flex-direction:column; gap:6px;">
                    ${todayTracks.map(t => `
                        <div style="display:flex; align-items:center; gap:10px; padding:10px 12px; background:${t.passed ? 'rgba(0,255,102,0.04)' : 'rgba(255,149,0,0.04)'}; border:1px solid ${t.passed ? 'var(--green-border)' : 'rgba(255,149,0,0.15)'}; border-radius:8px;">
                            <div style="font-size:14px; flex-shrink:0;">
                                ${t.passed
                                    ? '<span style="color:var(--green);">✓</span>'
                                    : '<span style="color:var(--courage-amber); animation:pulse-dot 2s infinite;">○</span>'
                                }
                            </div>
                            <div style="flex:1; min-width:0;">
                                <div style="font-size:12px; font-weight:700; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                    ${sanitize(t.name)}
                                </div>
                                <div style="font-size:9px; color:var(--text-muted);">${sanitize(t.artist)}</div>
                            </div>
                            <div style="font-family:var(--font-mono); font-size:11px; font-weight:800; color:${t.passed ? 'var(--green)' : (t.count > 0 ? 'var(--courage-amber)' : 'var(--text-ghost)')}; flex-shrink:0;">
                                ${t.count} ${t.count === 1 ? 'stream' : 'streams'}
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${todayDoneCount < todayTotal ? `
                    <div style="margin-top:12px; text-align:center; font-size:10px; color:var(--courage-amber); font-weight:700; animation:pulse-dot 2s infinite;">
                        ${todayTotal - todayDoneCount} track${todayTotal - todayDoneCount > 1 ? 's' : ''} need at least 1 stream today
                    </div>
                ` : `
                    <div style="margin-top:12px; text-align:center; font-size:10px; color:var(--green); font-weight:800;">
                        ✓ All tracks streamed today — chain intact
                    </div>
                `}
            </div>
        `;
    }

    // ═══════════════════════════════════
    // 3. PER-TRACK CARDS
    //    Daily Chain + Weekly Total + Streak + Pace
    // ═══════════════════════════════════
    html += `
        <div style="font-size:10px; color:var(--text-ghost); font-weight:900; letter-spacing:4px; text-transform:uppercase; margin-bottom:12px; margin-left:4px;">
            [ // Track Dossiers ]
        </div>
        <div style="display:flex; flex-direction:column; gap:16px; margin-bottom:24px;">
    `;

    sm.tracks.forEach(track => {
        const weeklyReq = track.weeklyRequired || 20;
        const weeklyTotal = track.weeklyTotal || 0;
        const weeklyPct = Math.min(100, (weeklyTotal / weeklyReq) * 100);
        const weeklyDone = weeklyTotal >= weeklyReq;
        const remaining = Math.max(0, weeklyReq - weeklyTotal);

        // Streak calculation
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        let chainBroken = false;

        for (const date of weekDates) {
            if (date > today) continue;
            const d = track.daily?.[date];
            const passed = d?.passed ?? false;

            if (passed) {
                tempStreak++;
                if (tempStreak > longestStreak) longestStreak = tempStreak;
            } else {
                if (tempStreak > 0) chainBroken = true;
                tempStreak = 0;
            }
        }
        currentStreak = tempStreak;

        // Pace
        const expectedByNow = daysElapsed > 0 ? Math.round((weeklyReq / daysTotal) * daysElapsed) : 0;
        const paceStatus = weeklyTotal >= expectedByNow ? 'ahead' : 'behind';
        const paceDiff = Math.abs(weeklyTotal - expectedByNow);
        const daysRemaining = daysTotal - daysElapsed;
        const neededPerDay = daysRemaining > 0 ? Math.ceil(remaining / daysRemaining) : remaining;

        // Streak display
        let streakHtml;
        if (isOnLeave) {
            streakHtml = `<span style="font-size:9px; color:var(--text-muted);">Exempt</span>`;
        } else if (currentStreak > 0) {
            streakHtml = `<span style="font-size:10px; color:var(--green); font-weight:800;">🔥 ${currentStreak}-day streak</span>`;
        } else if (chainBroken) {
            streakHtml = `<span style="font-size:10px; color:var(--red-core); font-weight:700;">💀 Chain broken</span>`;
        } else {
            streakHtml = `<span style="font-size:10px; color:var(--text-muted);">⏳ Not started</span>`;
        }

        html += `
            <div class="glass-card" style="padding:16px; border-left:3px solid ${track.weekPassed ? 'var(--green)' : 'var(--courage-amber)'};">

                <!-- Track Header -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                    <div>
                        <div style="font-size:13px; font-weight:800; color:#fff;">${sanitize(track.name)}</div>
                        <div style="font-size:9px; color:var(--text-muted); margin-top:2px;">${sanitize(track.artist)}</div>
                    </div>
                    ${streakHtml}
                </div>

                <!-- DAILY CHAIN -->
                <div style="margin-bottom:16px;">
                    <div style="font-size:9px; color:var(--text-muted); font-weight:800; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:8px;">
                        📅 Daily Chain · 1+ per day
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px;">
                        ${weekDates.map(date => {
                            const d = track.daily?.[date];
                            const count = d?.count ?? 0;
                            const passed = d?.passed ?? false;
                            const isFuture = date > today;
                            const isToday = date === today;

                            let bg, border, color, text, opacity = '1', extraStyle = '';

                            if (isFuture) {
                                bg = 'rgba(255,255,255,0.02)'; border = 'var(--border-subtle)';
                                color = 'var(--text-ghost)'; text = '·'; opacity = '0.4';
                            } else if (isOnLeave) {
                                bg = 'rgba(255,255,255,0.03)'; border = 'rgba(255,255,255,0.08)';
                                color = 'var(--text-ghost)'; text = '—';
                            } else if (passed) {
                                bg = 'var(--green-soft)'; border = 'var(--green-border)';
                                color = 'var(--green)'; text = '✓';
                            } else if (isToday) {
                                bg = 'rgba(255,149,0,0.1)'; border = 'rgba(255,149,0,0.35)';
                                color = 'var(--courage-amber)'; text = count > 0 ? count : '!';
                                extraStyle = 'box-shadow:0 0 8px rgba(255,149,0,0.15);';
                            } else {
                                // Past failed — dimmed
                                bg = 'rgba(255,20,95,0.06)'; border = 'rgba(255,20,95,0.12)';
                                color = 'rgba(255,20,95,0.5)'; text = '✗'; opacity = '0.6';
                            }

                            return `
                                <div style="text-align:center; padding:8px 2px; background:${bg}; border:1px solid ${border}; border-radius:6px; opacity:${opacity}; ${extraStyle}">
                                    <div style="font-size:7px; font-weight:900; color:var(--text-ghost); text-transform:uppercase; margin-bottom:3px;">
                                        ${DAYS[new Date(date).getDay()]}
                                    </div>
                                    <div style="font-family:var(--font-mono); font-size:11px; font-weight:900; color:${color};">
                                        ${text}
                                    </div>
                                    ${!isFuture && !isOnLeave && passed ? `<div style="font-size:7px; color:var(--text-ghost); margin-top:2px;">${count}</div>` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- WEEKLY TOTAL -->
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <div style="font-size:9px; color:var(--text-muted); font-weight:800; text-transform:uppercase; letter-spacing:1.5px;">
                            📊 Weekly Total · ${weeklyReq} required
                        </div>
                        <span style="font-family:var(--font-mono); font-size:11px; font-weight:900; color:${weeklyDone ? 'var(--green)' : '#fff'};">
                            ${weeklyTotal}/${weeklyReq}
                        </span>
                    </div>

                    <div class="pbar" style="height:6px; margin-bottom:6px;">
                        <div class="pfill" style="width:${weeklyPct}%; background:${weeklyDone ? 'var(--green)' : 'var(--courage-amber)'}; box-shadow:0 0 6px ${weeklyDone ? 'var(--green)' : 'var(--courage-amber)'};"></div>
                    </div>

                    ${!isOnLeave && !weeklyDone ? `
                        <div style="font-size:9px; color:${paceStatus === 'ahead' ? 'var(--green)' : 'var(--courage-amber)'}; font-weight:700;">
                            ${paceStatus === 'ahead'
                                ? `↑ ${paceDiff} ahead of pace`
                                : `↓ ${paceDiff} behind — need ~${neededPerDay}/day for ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`
                            }
                        </div>
                    ` : ''}
                    ${weeklyDone ? `<div style="font-size:9px; color:var(--green); font-weight:800;">✓ Weekly target reached</div>` : ''}
                    ${isOnLeave ? `<div style="font-size:9px; color:var(--text-muted); font-weight:700;">Exempt — on leave</div>` : ''}
                </div>
            </div>
        `;
    });

    html += `</div>`;

    // ═══════════════════════════════════
    // 4. OVERVIEW MATRIX
    // ═══════════════════════════════════
    html += `
        <div class="glass-card" style="padding:16px; margin-bottom:24px; overflow-x:auto;">
            <div style="font-size:12px; font-weight:900; color:#fff; text-transform:uppercase; letter-spacing:2px; margin-bottom:14px;">
                📋 Overview Matrix
            </div>
            <div style="display:grid; grid-template-columns:1fr repeat(7, minmax(32px, 1fr)) 60px; gap:3px; min-width:400px;">
                
                <!-- Header -->
                <div style="font-size:8px; color:var(--text-ghost); font-weight:800; padding:6px 4px; display:flex; align-items:flex-end;">Track</div>
                ${weekDates.map(d => {
                    const isToday = d === today;
                    return `<div style="text-align:center; font-size:7px; font-weight:900; color:${isToday ? 'var(--red-core)' : 'var(--text-ghost)'}; padding:6px 0; text-transform:uppercase; ${isToday ? 'background:rgba(255,20,95,0.08); border-radius:4px;' : ''}">
                        ${DAYS[new Date(d).getDay()]}<br><span style="font-size:6px; color:var(--text-ghost);">${d.slice(8)}</span>
                    </div>`;
                }).join('')}
                <div style="text-align:center; font-size:7px; font-weight:900; color:var(--text-ghost); padding:6px 0; text-transform:uppercase;">Total</div>

                <!-- Rows -->
                ${sm.tracks.map(track => {
                    const weeklyReq = track.weeklyRequired || 20;
                    const weeklyDone = (track.weeklyTotal || 0) >= weeklyReq;

                    let rowHtml = `
                        <div style="font-size:9px; font-weight:700; color:var(--text-secondary); padding:6px 4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center;" title="${sanitize(track.name)} — ${sanitize(track.artist)}">
                            ${sanitize(track.name)}
                        </div>
                    `;

                    weekDates.forEach(date => {
                        const d = track.daily?.[date];
                        const count = d?.count ?? 0;
                        const passed = d?.passed ?? false;
                        const isFuture = date > today;
                        const isToday = date === today;

                        let cellBg, cellColor, cellText;

                        if (isFuture) {
                            cellBg = 'transparent'; cellColor = 'var(--text-ghost)'; cellText = '·';
                        } else if (isOnLeave) {
                            cellBg = 'rgba(255,255,255,0.02)'; cellColor = 'var(--text-ghost)'; cellText = '—';
                        } else if (passed) {
                            cellBg = 'rgba(0,255,102,0.08)'; cellColor = 'var(--green)'; cellText = count;
                        } else if (isToday) {
                            cellBg = 'rgba(255,149,0,0.08)'; cellColor = 'var(--courage-amber)'; cellText = count || '!';
                        } else {
                            cellBg = 'rgba(255,20,95,0.05)'; cellColor = 'rgba(255,20,95,0.5)'; cellText = count || '✗';
                        }

                        rowHtml += `
                            <div style="text-align:center; font-family:var(--font-mono); font-size:9px; font-weight:800; color:${cellColor}; background:${cellBg}; border-radius:3px; padding:6px 0; border-bottom:1px solid var(--border-subtle);">
                                ${cellText}
                            </div>
                        `;
                    });

                    rowHtml += `
                        <div style="text-align:center; font-family:var(--font-mono); font-size:10px; font-weight:900; color:${weeklyDone ? 'var(--green)' : '#fff'}; padding:6px 0; border-bottom:1px solid var(--border-subtle);">
                            ${track.weeklyTotal || 0}<span style="color:var(--text-ghost);">/${weeklyReq}</span>
                        </div>
                    `;

                    return rowHtml;
                }).join('')}
            </div>
        </div>
    `;

    // ═══════════════════════════════════════════
    // 5. TEAM DAILY MONITOR (async loaded)
    // ═══════════════════════════════════════════
    html += `
        <div id="smTeamMonitor" class="glass-card" style="padding:20px; margin-bottom:24px; border-top:3px solid ${teamColor(teamName)};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <h3 style="margin:0; font-size:13px; font-weight:800; color:#fff; display:flex; align-items:center; gap:8px;">
                    <span style="font-size:16px;">👥</span> Squad Side Mission Monitor
                </h3>
                <span style="font-size:9px; color:var(--text-muted); font-family:var(--font-mono);">
                    Loading...
                </span>
            </div>
            <div style="text-align:center; padding:16px; color:var(--text-muted); font-size:11px;">
                Fetching team status...
            </div>
        </div>
    `;

    container.innerHTML = html;

    // ── Async: Load team monitor ──
    loadSideMissionTeamMonitor(teamName, weekDates, today).catch(() => {
        const box = document.getElementById('smTeamMonitor');
        if (box) {
            box.innerHTML = `
                <div style="text-align:center; color:var(--fail); font-size:11px; padding:14px;">
                    Failed to load team side mission data.
                </div>
            `;
        }
    });
}
  
  
  // =============================================
  // ██████  RANKINGS
  // =============================================
  // v2.0: Cached API calls (30s TTL), buildRankRow helper.
  
  // =============================================
  // ██████  RANKINGS PAGE
  // =============================================
  async function loadRankings() {
    const container = $('rankContent');
    if (!container) return;
  
    const myTeam = STATE.data?.agent?.profile?.team || '';
    const myRank = STATE.data?.agent?.rank || '—';
    const myTeamRank = STATE.data?.agent?.teamRank || '—';
  
    container.innerHTML = `
      ${renderGuide('rankings') || ''}
      
      <!-- Your Rank Summary -->
      <div class="archive-card" style="margin-bottom:20px; display:flex; justify-content:space-around; padding:16px;">
          <div style="text-align:center;">
              <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:2px; margin-bottom:4px;">Global Rank</div>
              <div style="font-size:24px; font-weight:900; color:var(--wave-foam); font-family:'Share Tech Mono', monospace;">#${myRank}</div>
          </div>
          <div style="width:1px; background:var(--border-subtle);"></div>
          <div style="text-align:center;">
              <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:2px; margin-bottom:4px;">Team Rank</div>
              <div style="font-size:24px; font-weight:900; color:${teamColor(myTeam)}; font-family:'Share Tech Mono', monospace;">#${myTeamRank}</div>
          </div>
      </div>
  
      <!-- Toggle Tabs -->
      <div style="display:flex; gap:8px; margin-bottom:20px; background:rgba(0,0,0,0.5); padding:6px; border-radius:12px; border:1px solid var(--border-light);">
        <button id="rankTabAll" onclick="switchRankTab('all')" style="flex:1; padding:12px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1px; border-radius:8px; border:none; background:var(--red-core); color:#fff; cursor:pointer; transition:all 0.3s;">🌍 Global Network</button>
        <button id="rankTabTeam" onclick="switchRankTab('team')" style="flex:1; padding:12px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1px; border-radius:8px; border:none; background:transparent; color:var(--text-muted); cursor:pointer; transition:all 0.3s;">👥 ${sanitize(myTeam).replace('Team ', '')} Squad</button>
      </div>
      
      <div id="rankList" style="display:flex; flex-direction:column; gap:8px;"></div>
    `;
  
    await renderOverallRankings();
  }
  
  function switchRankTab(tab) {
    const allBtn  = $('rankTabAll');
    const teamBtn = $('rankTabTeam');
  
    const activeStyle  = 'background:var(--red-core); color:#fff;';
    const defaultStyle = 'background:transparent; color:var(--text-muted);';
  
    if (tab === 'all') {
      if (allBtn)  allBtn.style.cssText  = `flex:1; padding:12px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1px; border-radius:8px; border:none; cursor:pointer; transition:all 0.3s; ${activeStyle}`;
      if (teamBtn) teamBtn.style.cssText = `flex:1; padding:12px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1px; border-radius:8px; border:none; cursor:pointer; transition:all 0.3s; ${defaultStyle}`;
      renderOverallRankings();
    } else {
      if (teamBtn) teamBtn.style.cssText = `flex:1; padding:12px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1px; border-radius:8px; border:none; cursor:pointer; transition:all 0.3s; ${activeStyle}`;
      if (allBtn)  allBtn.style.cssText  = `flex:1; padding:12px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1px; border-radius:8px; border:none; cursor:pointer; transition:all 0.3s; ${defaultStyle}`;
      renderTeamRankings();
    }
  }
  
  // Update your buildRankRow function to use the Arirang theme
  function buildRankCard(agent, index, opts = {}) {
    const { showTeam = true } = opts;
    const isMe = agent.agentNo === STATE.agentNo;
    const tColor = teamColor(agent.team);
    const pfpUrl = teamPfp(agent.team);
    
    // Top 3 Medals
    const medals = ['🥇', '🥈', '🥉'];
    const rankDisplay = index < 3 ? medals[index] : index + 1;

    return `
      <div class="rank-card ${isMe ? 'is-me' : ''} top-${index}" style="--team-color: ${tColor}">
        <!-- Rank -->
        <div class="rank-badge">${rankDisplay}</div>
        
        <!-- Scifi Oval PFP -->
        <div class="rank-pfp-oval">
          <img src="${pfpUrl}" alt="${agent.team}" onerror="this.src='https://i.pravatar.cc/100?u=${agent.agentNo}'">
        </div>
        
        <!-- Info Block -->
        <div class="rank-info">
          <div class="rank-name">
            ${displayName(agent.name)} 
            ${isMe ? '<span style="font-size:7px; background:var(--red-core); color:#fff; padding:1px 4px; border-radius:3px; margin-left:5px; vertical-align:middle;">YOU</span>' : ''}
          </div>
          <div class="rank-team-tag">${(agent.team || '').replace('Team ', '')}</div>
        </div>
        
        <!-- XP Block -->
        <div class="rank-xp-box">
          <div class="rank-xp-val">${fmt(agent.totalXP)}</div>
          <div class="rank-xp-label">Total XP</div>
        </div>
      </div>
    `;
}
  
  // =============================================
  // ██████  TEAMS PAGE (Army Bomb)
  // =============================================
  // =============================================
  // ██████  TEAMS PAGE (Full Standings)
  // =============================================
  
  function renderTeams() {
  if (!STATE.data) return;

  const container = $('teamsContent');
  if (!container) {
    console.warn('teamsContent container not found');
    return;
  }

  const teams = (STATE.data.teamComparison || [])
    .sort((a, b) => (b.teamXP || 0) - (a.teamXP || 0));

  const myTeam = STATE.data.agent?.profile?.team;

  if (teams.length === 0) {
    container.innerHTML = `
      ${renderGuide('teams')}
      <div class="glass-card" style="padding:40px; text-align:center;">
        <div style="font-size:48px; margin-bottom:16px; opacity:0.3;">🏆</div>
        <div style="color:var(--text-muted); font-size:14px;">No team data available yet</div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    ${renderGuide('teams')}

    <div style="margin-bottom:20px;">
      <h2 style="font-family:'Orbitron', sans-serif; font-size:14px; font-weight:900; color:#fff; margin:0;">
        🏆 SQUAD STANDINGS
      </h2>
      <div style="font-size:10px; color:var(--text-muted); margin-top:4px; text-transform:uppercase; letter-spacing:1px;">
        Global Team Rankings · ${teams.length} squads
      </div>
    </div>

    <div style="display:flex; flex-direction:column; gap:10px;">
      ${teams.map((tm, i) => {
        const isMe = tm.team === myTeam;
        const tColor = teamColor(tm.team);
        const badgeCount = ARMY_BOMB_BADGES.filter(b => tm[b.key]).length;
        const rankDisplay = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;

        return `
          <div class="team-group-container" onclick="goTo('hangar')"
            style="cursor:pointer; padding:12px; ${isMe ? `background:${tColor}11; border:1px solid ${tColor}33;` : ''} border-radius:10px;">

            <div style="display:flex; align-items:center; gap:12px;">

              <!-- Rank -->
              <div style="width:28px; text-align:center; font-size:${i < 3 ? '18px' : '13px'}; font-weight:900; font-family:var(--font-mono); color:var(--text-ghost); flex-shrink:0;">
                ${rankDisplay}
              </div>

              <!-- Team Info -->
              <div style="flex:1; min-width:0;">

                <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                  <span style="font-family:'Orbitron', sans-serif; font-size:12px; font-weight:900; color:${tColor}; letter-spacing:0.5px; text-transform:uppercase;">
                    ${sanitize(tm.team.replace('Team ', ''))}
                  </span>
                  ${tm.isWinner ? '<span style="font-size:12px; filter:drop-shadow(0 0 4px rgba(255,215,0,0.5));">🏆</span>' : ''}
                  ${isMe ? '<span style="font-size:7px; color:#fff; background:var(--red-core); padding:1px 5px; border-radius:4px; font-weight:800; letter-spacing:1px;">YOU</span>' : ''}
                  <span style="font-size:9px; color:var(--text-muted); font-family:var(--font-mono);">
                    👥 ${tm.agentCount || tm.memberCount || '—'}
                  </span>
                </div>

                <!-- Badge Progress -->
                <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
                  <div style="flex:1; height:3px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden;">
                    <div style="width:${(badgeCount / 7) * 100}%; height:100%; background:${tColor}; box-shadow:0 0 6px ${tColor}66; border-radius:3px;"></div>
                  </div>
                  <span style="font-size:9px; font-weight:800; color:var(--text-muted); font-family:var(--font-mono);">${badgeCount}/7</span>
                </div>

                <!-- Mission Status -->
                <div style="display:flex; gap:4px; margin-top:6px; flex-wrap:wrap;">
                  ${[
                    { icon: '🎵', key: 'trackGoalPassed' },
                    { icon: '📀', key: 'albumGoalPassed' },
                    { icon: '🔁', key: 'album2xPassed' },
                    { icon: '⚡', key: 'arirangUnitPassed' },
                    { icon: '🛡️', key: 'sideMissionPassed' },
                    { icon: '📋', key: 'attendanceConfirmed' },
                    { icon: '👮', key: 'policeConfirmed' }
                  ].map(m => {
                    const passed = tm[m.key];
                    return `
                      <div style="display:flex; align-items:center; gap:2px; padding:2px 5px; background:rgba(255,255,255,0.04); border-radius:6px;">
                        <span style="font-size:10px;">${m.icon}</span>
                        <span style="font-size:9px; font-weight:900; color:${passed ? 'var(--green)' : 'var(--text-ghost)'};">
                          ${passed ? '✓' : '✕'}
                        </span>
                      </div>
                    `;
                  }).join('')}
                </div>

              </div>

              <!-- XP -->
              <div style="text-align:right; flex-shrink:0; padding-left:8px;">
                <div style="font-size:15px; font-weight:900; color:${tColor}; font-family:'Orbitron', sans-serif; text-shadow:0 0 8px ${tColor}44;">
                  ${fmt(tm.teamXP || 0)}
                </div>
                <div style="font-size:8px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-top:2px;">XP</div>
              </div>

            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
  
  
  // =============================================
  // ██████  ACTIVITY FEED PAGE
  // =============================================
  
  /**
   * Full activity feed page — cached 30s.
   */
  async function loadFeed() {
    const container = $('feedContent');
    if (!container) return;
    showPageLoading(container);
  
    try {
      const d = await Api.call('getActivityFeed', { limit: 40 }, { cache: true, ttl: 30_000 });
      const activities = d.activities || [];
  
      container.innerHTML = activities.length === 0
        ? '<div style="color:var(--text-muted);font-size:12px;text-align:center;padding:30px;">No activity yet</div>'
        : activities.map(a => {
            const type = CONFIG.ACTIVITY_TYPES[a.type];
            const data = a.data || {};
            let msg = '';
            try { msg = type?.template(data) || data.message || JSON.stringify(data); }
            catch { msg = data.message || a.type; }
  
            return `<div class="feed-item">
              <div class="feed-type" style="color:${type?.color || 'var(--red-main)'}">${type?.icon || '📡'} ${a.type.replace(/_/g, ' ')}</div>
              <div class="feed-msg">${msg}</div>
              <div class="feed-time">${new Date(a.timestamp).toLocaleString()}</div>
            </div>`;
          }).join('');
    } catch (e) {
      showPageError(container, 'loadFeed');
    }
  }
  
  
  // =============================================
  // ██████  CHAT
  // =============================================
  // v2.0: Uses Timers manager for polling, short-lived cache.
  
  async function loadChat() {
    try {
      // 5s cache — feels real-time but prevents hammering during rapid calls
      const d = await Api.call('getChatMessages', { limit: 50 }, { cache: true, ttl: 5_000, silent: true });
      if (!d.success) return;
  
      const box = $('chatBox');
      if (!box) return;
  
      box.innerHTML = (d.messages || []).map(m =>
        `<div class="chat-msg">
          <span class="cm-name">${sanitize(m.username)}</span>
          <span class="cm-team">[${(m.team || '').replace('Team ', '')}]</span>
          <div class="cm-text">${sanitize(m.message)}</div>
        </div>`
      ).join('');
  
      box.scrollTop = box.scrollHeight;
  
      // v2.0: Uses Timers — auto-clears previous interval
      if (STATE.page === 'chat') {
        Timers.setInterval('chat', loadChat, 10_000);
      }
    } catch { /* silent */ }
  }
  
  async function sendChat() {
    const input = $('chatInput');
    if (!input) return;
  
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
  
    try {
      await Api.call('sendChatMessage', { agentNo: STATE.agentNo, message: msg }, { dedupe: false, cache: false });
      // Invalidate chat cache so next load is fresh
      Api.invalidate('getChatMessages');
      loadChat();
    } catch {
      showToast('Failed to send', 'error');
    }
  }
  
  
  // =============================================
  // ██████  ANNOUNCEMENTS
  // =============================================
  
  function renderAnnouncements() {
    if (!STATE.data) return;
    const container = $('annsContent');
    if (!container) return;
  
    const anns = STATE.data.announcements || [];
  
    container.innerHTML = `
      ${renderGuide('announcements') || ''}
      ${anns.length === 0
        ? '<div style="color:var(--text-muted);font-size:12px">No announcements</div>'
        : anns.map(a => `<div class="ann">
            <div class="ann-t">${sanitize(a.title)}</div>
            <div class="ann-m">${sanitize(a.message)}</div>
            ${a.link ? `<a href="${sanitize(a.link)}" target="_blank" rel="noopener" style="color:var(--red-main);font-size:10px;text-decoration:none;">${sanitize(a.linkText || 'Link →')}</a>` : ''}
            <div class="ann-d">${new Date(a.created).toLocaleDateString()}</div>
          </div>`).join('')
      }
    `;
  }
  
  
  // =============================================
  // ██████  LEAVE / ATTENDANCE ACTIONS
  // =============================================
  // v2.0: Cache invalidation after each action ensures fresh data.
  
  /**
   * Wrapper for leave/attendance API actions.
   * Handles confirmation, API call, toast, and dashboard reload.
   */
  async function performAction(actionName, opts = {}) {
    const { confirmMsg, successMsg, errorMsg } = opts;
  
    if (confirmMsg && !confirm(confirmMsg)) return;
  
    try {
      const d = await Api.call(actionName, { agentNo: STATE.agentNo }, { dedupe: false, cache: false });
  
      if (d.success) {
        showToast(successMsg || 'Done!', 'success');
        Api.invalidate(); // Fresh data on next load
        loadDashboard();
      } else {
        showToast(d.error || errorMsg || 'Failed', 'error');
      }
    } catch {
      showToast(errorMsg || 'Action failed', 'error');
    }
  }
  
  function applyLeave() {
    performAction('applyLeave', {
      confirmMsg: 'Apply leave? You earn 0 XP but team is unaffected.',
      successMsg: 'Leave applied!',
      errorMsg: 'Failed to apply leave',
    });
  }
  
  function cancelLeave() {
    performAction('cancelLeave', {
      confirmMsg: 'Cancel leave? You will be back on duty.',
      successMsg: 'Leave cancelled!',
      errorMsg: 'Failed to cancel leave',
    });
  }
  
  function submitAttendance() {
    performAction('submitAttendance', {
      successMsg: 'Attendance submitted! 📸',
      errorMsg: 'Failed to submit',
    });
  }
  
  
  // =============================================
  // ██████  BADGE SYSTEM
  // =============================================
  
  /**
   * Deterministic badge selection from seed.
   * Same agent + same milestone → always same badge.
   */
  function getBadgeForSeed(seed) {
    const pool = CONFIG.BADGE_POOL;
    if (!pool || pool.length === 0) return '';
    return pool[Math.abs(seed) % pool.length];
  }
  
  /**
   * Get all level badges an agent has earned (1 per 50 XP).
   * @returns {Array<{name: string, description: string, imageUrl: string, type: string}>}
   */
  function getLevelBadges(agentNo, totalXP) {
    const badges = [];
    const xp = parseInt(totalXP) || 0;
    const count = Math.floor(xp / 50);
  
    for (let i = 1; i <= count; i++) {
      // Generate deterministic seed from agent ID + badge index
      let seed = 0;
      const str = String(agentNo).toUpperCase();
      for (let c = 0; c < str.length; c++) seed += str.charCodeAt(c);
      seed += i * 137;
  
      badges.push({
        name: `${i * 50} XP`,
        description: `Earned at ${i * 50} XP`,
        imageUrl: getBadgeForSeed(seed),
        type: 'xp',
      });
    }
  
    return badges.reverse(); // Most recent first
  }
  
  /**
   * Get Album 2X achievement badge if earned this week.
   * @returns {object|null}
   */
  function getAlbum2xBadge(agentNo, weekName) {
    const pool = CONFIG.BADGE_POOL;
    if (!pool?.length) return null;
    if (!STATE.data?.agent?.album2xStatus?.weeklyPassed) return null;
  
    let seed = 0;
    const str = String(agentNo).toUpperCase() + '_ALBUM_' + weekName;
    for (let i = 0; i < str.length; i++) seed += str.charCodeAt(i);
  
    return {
      name: CONFIG.ALBUM_CHALLENGE.BADGE_NAME,
      description: `${CONFIG.ALBUM_CHALLENGE.BADGE_DESCRIPTION} (${weekName})`,
      imageUrl: pool[Math.abs(seed) % pool.length],
      type: 'achievement',
      icon: '✨',
    };
  }
  
  
  // =============================================
  // ██████  NOTIFICATIONS
  // =============================================
  // v2.0: Debounced, won't stack, visibility-aware.
  
  /** Minimum ms between notification checks */
  const NOTIF_COOLDOWN = 60_000;
  let _lastNotifCheckTime = 0;
  
  async function checkNotifications() {
    // Guards
    if (STATE.isCheckingNotifications) return;
    if (!STATE.agentNo || !STATE.data) return;
    if (Date.now() - _lastNotifCheckTime < NOTIF_COOLDOWN) return;
  
    STATE.isCheckingNotifications = true;
    _lastNotifCheckTime = Date.now();
  
    try {
      const notifications = [];
  
      // ── 1. Badge check ──
      const xp = parseInt(STATE.data.agent?.stats?.totalXP) || 0;
      const currentBadges = Math.floor(xp / 50);
  
      if (!STATE.lastChecked._badgesInitialized) {
        STATE.lastChecked.badges = currentBadges;
        STATE.lastChecked._badgesInitialized = true;
      } else if (currentBadges > (STATE.lastChecked.badges || 0)) {
        notifications.push({
          type: 'badge', icon: '🎖️',
          title: 'New Badge!',
          message: `You reached ${currentBadges * 50} XP!`,
          priority: 'high',
        });
        STATE.lastChecked.badges = currentBadges;
      }
  
      // ── 2. SOTD check ──
      const todayKST = getKSTDateString();
      if (STATE.lastChecked.songOfDay !== todayKST) {
        try {
          const sotd = await Api.call('getSongOfDay', {}, { cache: true, ttl: 300_000, silent: true });
          if (sotd.success) {
            const answered = localStorage.getItem(`sotd_answered_${STATE.agentNo}_${todayKST}`);
            if (!answered) {
              notifications.push({
                type: 'sotd', icon: '🎬',
                title: 'Song of the Day!',
                message: 'New puzzle available!',
              });
            }
          }
        } catch { /* silent */ }
      }
  
      // ── 3. Warning check ──
      if (STATE.data.team?.warningStatus?.hasWarning) {
        notifications.push({
          type: 'warning', icon: '⚠️',
          title: 'Team At Risk!',
          message: `Recovery: ${STATE.data.team.warningStatus.daysAchieved}/${STATE.data.team.warningStatus.daysRequired} days`,
          priority: 'high',
        });
      }
  
      // ── 4. ATTENDANCE WINDOW REMINDER (NEW) ──
      const kstNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
      const kstDay = kstNow.getDay(); 
      const kstHour = kstNow.getHours();
      const kstMin = kstNow.getMinutes();
  
      let isWindowOpen = false;
      if (kstDay === 6 && (kstHour > 18 || (kstHour === 18 && kstMin >= 30))) isWindowOpen = true; // Sat after 6:30 PM
      if (kstDay === 0 && (kstHour < 18 || (kstHour === 18 && kstMin < 30))) isWindowOpen = true; // Sun before 6:30 PM
  
      const hasSubmitted = STATE.data?.agent?.attendance?.submitted;
  
      if (isWindowOpen && !hasSubmitted) {
        notifications.push({
          type: 'attendance', icon: '📸',
          title: 'Attendance Required',
          message: 'The 24hr window is open. Drop your screenshot in the GC!',
          priority: 'high',
        });
      }
  
      STATE.notifications = notifications;
      updateNotificationUI();
  
      // Show popup toast for first notification (once per session)
      if (notifications.length > 0 && !STATE.hasShownPopupThisSession) {
        // Prioritize high-priority alerts like Attendance
        const topNotif = notifications.find(n => n.priority === 'high') || notifications[0];
        showToast(`${topNotif.icon || '🔔'} ${topNotif.title}`, topNotif.type === 'attendance' ? 'error' : 'info');
        STATE.hasShownPopupThisSession = true;
      }
    } catch (e) {
      console.error('Notification check error:', e);
    } finally {
      STATE.isCheckingNotifications = false;
    }
  }
  
  function updateNotificationUI() {
    const count = (STATE.notifications || []).length;
    let badge = $('notifBadge');
  
    if (count > 0) {
      if (!badge) {
        badge = document.createElement('div');
        badge.id = 'notifBadge';
        badge.onclick = () => showNotificationCenter();
        document.body.appendChild(badge);
      }
      badge.innerHTML = `🔔 ${count}`;
      badge.style.cssText = `
        position:fixed;top:12px;right:60px;z-index:9999;
        background:var(--red-main);color:#fff;padding:6px 12px;
        font-size:11px;font-weight:900;cursor:pointer;
        border-radius:4px;animation:pulseBorder 2s infinite;
      `;
      badge.style.display = 'block';
    } else if (badge) {
      badge.style.display = 'none';
    }
  }
  
  function showNotificationCenter() {
    const notifs = STATE.notifications || [];
  
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:flex-start;justify-content:center;padding:60px 16px;';
    overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
  
    overlay.innerHTML = `
      <div style="background:var(--panel-bg);border:1px solid var(--border-light);max-width:380px;width:100%;max-height:70vh;overflow-y:auto;border-radius:8px;" onclick="event.stopPropagation()">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:14px;background:var(--red-main);border-radius:8px 8px 0 0;">
          <span style="font-weight:900;font-size:13px;">🔔 Notifications</span>
          <button onclick="this.closest('div[style]').parentElement.remove()" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">×</button>
        </div>
        <div style="padding:8px;">
          ${notifs.length === 0
            ? '<div style="text-align:center;padding:30px;color:var(--text-muted);">✨ All caught up!</div>'
            : notifs.map(n => `
              <div style="padding:12px;border-bottom:1px solid var(--border-light);display:flex;gap:10px;align-items:flex-start;">
                <span style="font-size:20px;">${n.icon || '🔔'}</span>
                <div>
                  <div style="font-weight:700;font-size:12px;">${sanitize(n.title)}</div>
                  <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">${sanitize(n.message)}</div>
                </div>
              </div>`).join('')
          }
        </div>
        ${notifs.length > 0 ? `
          <div style="padding:10px;border-top:1px solid var(--border-light);">
            <button onclick="STATE.notifications=[];updateNotificationUI();this.closest('div[style]').parentElement.remove();showToast('Cleared','success')" style="width:100%;padding:10px;background:none;border:1px solid var(--red-main);color:var(--red-main);cursor:pointer;font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:1px;border-radius:4px;">Clear All</button>
          </div>
        ` : ''}
      </div>
    `;
  
    document.body.appendChild(overlay);
  }
  function saveNotificationState() {
      localStorage.setItem('arirang_notif_state_' + STATE.agentNo, JSON.stringify(STATE.lastChecked));
  }
  /**
   * Setup notification triggers.
   * v2.0: Uses the debounce cooldown, won't fire redundantly.
   */
  function setupNotificationChecks() {
    // Check on tab return
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        Timers.setTimeout('notif-visibility', checkNotifications, 1000);
      }
    });
  
    // Check on reconnect
    window.addEventListener('online', () => {
      Timers.setTimeout('notif-online', checkNotifications, 2000);
    });
  
    // Check on focus (with cooldown guard inside checkNotifications)
    window.addEventListener('focus', () => {
      checkNotifications();
    });
  }
  
  
  // =============================================
  // ██████  REGISTER PAGE RENDERERS
  // =============================================
  // Connects page names to their render functions.
  // goTo() in Part 1 looks up PAGE_RENDERERS[page] to call.
  // =============================================
  // END OF PART 2
  // =============================================
  // Part 3 will define:
  //  • findAgent, password, delete account
  //  • Song of the Day, Secret Missions
  //  • Badges page, Weekly Summary, Confetti
  //  • Admin Panel, 148 Protocol, Guide Page
  //  • Final initialization + window exports
  // =============================================
  // =============================================
  // ██████  PART 3: FEATURES + ADMIN + INIT
  // ██████  v2.0 — Final
  // =============================================
  //
  // KEY IMPROVEMENTS OVER v1.0:
  // ───────────────────────────────────────────────
  // ✅ findAgent debounced, login form cleaned
  // ✅ Password modal uses safe DOM refs (no stale closures)
  // ✅ Delete account has loading guard
  // ✅ SOTD uses 5-minute cache for song data
  // ✅ Secret missions: renderMissionCard extracted
  // ✅ Badges page renders all types uniformly
  // ✅ Weekly summary with cached API + confetti once-only
  // ✅ Confetti: pooled elements, auto-cleanup, CSS injected once
  // ✅ Admin panel: single-instance guard, session validation
  // ✅ 148 Protocol: parallel API, shared goal/album2x cache
  // ✅ Guide page: accessible accordion with proper state
  // ✅ PAGE_RENDERERS fully registered
  // ✅ Window exports consolidated, no duplicates
  // ✅ Keyboard shortcuts use Map for clarity
  // ✅ Single DOMContentLoaded / checkAuth entry point
  // ✅ beforeunload cleanup
  // =============================================
  
  'use strict';
  
  
  // =============================================
  // ██████  FIND AGENT (Login Page)
  // =============================================
  
  async function findAgent() {
    const input = $('findIG');
    const result = $('findResult');
    if (!input || !result) return;
  
    const ig = input.value.trim().replace(/@/g, '');
    if (!ig) {
      result.innerHTML = '<span style="color:var(--red-main)">Enter Instagram username</span>';
      return;
    }
  
    result.innerHTML = '<span style="color:var(--text-muted)">Searching...</span>';
  
    try {
      const d = await Api.call('getAgentByInstagram', { instagram: ig }, { dedupe: false });
  
      if (d.success && d.result) {
        result.innerHTML = `<span style="color:var(--green)">✓ Your Agent ID: <strong style="font-family:monospace;font-size:14px;">${sanitize(d.result)}</strong></span>`;
      } else {
        result.innerHTML = `<span style="color:var(--red-main)">✗ No agent found for @${sanitize(ig)}</span>`;
      }
    } catch (e) {
      result.innerHTML = `<span style="color:var(--red-main)">Error: ${sanitize(e.message)}</span>`;
    }
  }
  
  
  // =============================================
  // ██████  PASSWORD CHANGE
  // =============================================
  
  function openPasswordModal() {
    const modal = $('passwordModal');
    if (modal) modal.hidden = false;
  }
  
  function closePasswordModal() {
    const modal = $('passwordModal');
    if (modal) modal.hidden = true;
  
    // Clear fields safely
    const fields = ['currentPw', 'newPw', 'confirmNewPw'];
    fields.forEach(id => {
      const el = $(id);
      if (el) el.value = '';
    });
  
    const errEl = $('pwError');
    if (errEl) errEl.textContent = '';
  }
  
  async function changePassword() {
    const current   = $('currentPw')?.value;
    const newPw     = $('newPw')?.value;
    const confirmPw = $('confirmNewPw')?.value;
    const errEl     = $('pwError');
  
    // Validation
    if (!current || !newPw || !confirmPw) {
      if (errEl) errEl.textContent = 'Fill all fields';
      return;
    }
    if (newPw.length < 4) {
      if (errEl) errEl.textContent = 'Min 4 characters';
      return;
    }
    if (newPw !== confirmPw) {
      if (errEl) errEl.textContent = 'Passwords do not match';
      return;
    }
  
    try {
      const d = await Api.call('updatePassword', {
        agentNo: STATE.agentNo,
        oldPassword: current,
        newPassword: newPw,
      }, { dedupe: false, cache: false });
  
      if (d.success) {
        showToast('Password updated!', 'success');
        closePasswordModal();
      } else {
        if (errEl) errEl.textContent = d.error || 'Failed';
      }
    } catch (e) {
      if (errEl) errEl.textContent = 'Error: ' + e.message;
    }
  }
  
  
  // =============================================
  // ██████  DELETE ACCOUNT
  // =============================================
  
  let _deleteInProgress = false;
  
  async function deleteAccountConfirm() {
    if (_deleteInProgress) return;
  
    const pw = prompt('⚠️ DELETE ACCOUNT?\n\nThis is PERMANENT. Enter your password to confirm:');
    if (!pw) return;
    if (!confirm('FINAL WARNING: All your data will be erased. Continue?')) return;
  
    _deleteInProgress = true;
    Loading.show();
  
    try {
      const d = await Api.call('deleteAccount', {
        agentNo: STATE.agentNo,
        password: pw,
      }, { dedupe: false, cache: false });
  
      if (d.success) {
        showToast('Account deleted', 'info');
        doLogout();
      } else {
        showToast(d.error || 'Failed', 'error');
      }
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    } finally {
      Loading.hide();
      _deleteInProgress = false;
    }
  }
  
  
  // =============================================
  // ██████  SONG OF THE DAY PAGE
  // =============================================
  
  async function renderSongOfDay() {
      const container = $('sotdContent');
      if (!container) return;
  
      showPageLoading(container);
  
      try {
          const d = await Api.call('getSongOfDay', {}, { cache: true, ttl: 300_000 });
          const song = d.song;
          const todayKST = getKSTDateString();
          const answered = localStorage.getItem(`sotd_answered_${STATE.agentNo}_${todayKST}`);
          
          let html = `
              <div class="archive-card" style="text-align:center; padding:30px 20px; border-top:3px solid var(--wave-foam); background:linear-gradient(135deg, rgba(74, 144, 164, 0.05), var(--bg-panel)); margin-bottom:24px;">
                  <div style="font-size:48px; margin-bottom:16px; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.5));">🎬</div>
                  <div style="font-size:14px; font-weight:900; color:#fff; text-transform:uppercase; letter-spacing:2px; font-family:'Orbitron', sans-serif; margin-bottom:8px;">Audio Intelligence Unit</div>
                  <div style="font-size:11px; color:var(--wave-foam); letter-spacing:2px; font-family:'Share Tech Mono', monospace;">KST: ${todayKST}</div>
              </div>
          `;
  
          if (!d.success || !song) {
              html += `<div class="glass-card" style="text-align:center; padding:40px; color:var(--text-muted); font-size:12px;">No audio intercepted today. Stand by.</div>`;
              container.innerHTML = html;
              return;
          }
  
          if (song.hint) {
              html += `
                  <div class="glass-card" style="padding:20px; text-align:center; margin-bottom:24px; border-color:var(--vinyl-gold); box-shadow:inset 0 0 30px rgba(212,175,55,0.05);">
                      <div style="font-size:10px; color:var(--vinyl-gold); font-weight:900; letter-spacing:2px; text-transform:uppercase; margin-bottom:12px;">Intercepted Clue</div>
                      <div style="font-size:14px; color:#fff; font-style:italic; line-height:1.6; text-shadow:0 2px 4px rgba(0,0,0,0.8);">"${sanitize(song.hint)}"</div>
                      <div style="margin-top:16px; display:inline-block; padding:4px 12px; background:rgba(212,175,55,0.1); border:1px solid rgba(212,175,55,0.3); border-radius:12px; color:var(--vinyl-gold); font-size:10px; font-weight:800;">
                          REWARD: +${song.xpReward || 1} XP
                      </div>
                  </div>
              `;
          }
  
          if (answered) {
              html += `
                  <div class="glass-card" style="padding:30px 20px; text-align:center; border-left:4px solid var(--green);">
                      <div style="font-size:40px; margin-bottom:12px;">✅</div>
                      <div style="font-size:14px; font-weight:900; color:var(--green); letter-spacing:1px; text-transform:uppercase; margin-bottom:8px;">Decryption Successful</div>
                      <div style="font-size:12px; color:var(--text-secondary);">You have successfully identified the track today.</div>
                  </div>
              `;
          } else {
              html += `
                  <div class="glass-card" style="padding:24px;">
                      <label class="label-tag" style="display:block; margin-bottom:12px;">Submit YouTube URL</label>
                      <input type="text" id="sotdAnswer" class="input-field" placeholder="https://youtube.com/watch?v=..." style="margin-bottom:16px;">
                      
                      <button class="btn-red" onclick="submitSongAnswer()" style="padding:16px; background:linear-gradient(135deg, var(--wave-foam), #1a4d60);">
                          VERIFY DECRYPTION
                      </button>
                      
                      <div id="sotdResult" style="margin-top:16px; text-align:center; font-size:12px; font-weight:700; min-height:20px;"></div>
                      
                      <div style="margin-top:20px; font-size:10px; color:var(--text-muted); text-align:center;">
                          Max 2 attempts allowed. Enter the official MV or Audio link.
                      </div>
                  </div>
              `;
          }
  
          container.innerHTML = html;
          
          // Clear notif state
          if (STATE.lastChecked) {
              STATE.lastChecked.songOfDay = todayKST;
              saveNotificationState();
          }
          
      } catch (e) {
          showPageError(container, 'renderSongOfDay');
      }
  }
  
  async function submitSongAnswer() {
    const answer = $('sotdAnswer')?.value?.trim();
    const resultEl = $('sotdResult');
  
    if (!answer) {
      if (resultEl) resultEl.innerHTML = '<span style="color:var(--red-main)">Paste a YouTube URL</span>';
      return;
    }
  
    if (resultEl) resultEl.innerHTML = '<span style="color:var(--text-muted)">Checking...</span>';
  
    try {
      const d = await Api.call('submitSongAnswer', {
        agentNo: STATE.agentNo,
        answer,
      }, { dedupe: false, cache: false });
  
      if (d.correct) {
        const todayKST = getKSTDateString();
        localStorage.setItem(`sotd_answered_${STATE.agentNo}_${todayKST}`, 'true');
        if (STATE.lastChecked) STATE.lastChecked.songOfDay = todayKST;
  
        if (resultEl) resultEl.innerHTML = `<span style="color:var(--green)">${sanitize(d.message)}</span>`;
        showToast(d.message, 'success');
  
        // Invalidate SOTD cache and re-render
        Api.invalidate('getSongOfDay');
        Timers.setTimeout('sotd-rerender', renderSongOfDay, 1500);
      } else {
        if (resultEl) resultEl.innerHTML = `<span style="color:var(--red-main)">${sanitize(d.message || d.error)}</span>`;
      }
    } catch (e) {
      if (resultEl) resultEl.innerHTML = `<span style="color:var(--red-main)">${sanitize(e.message)}</span>`;
    }
  }
  
  
  // =============================================
  // ██████  SECRET MISSIONS (User View)
  // =============================================
  
  // =============================================
  // ██████  SECRET MISSIONS PAGE
  // =============================================
  
  async function renderSecretMissions() {
      const container = $('secretMissionsContent');
      if (!container) return;
      
      const myTeam = STATE.data?.agent?.profile?.team;
      if (!myTeam) return;
      
      showPageLoading(container);
      
      try {
          const [missionsData, statsData] = await Promise.all([
              Api.call('getTeamSecretMissions', { team: myTeam, agentNo: STATE.agentNo, week: STATE.week }).catch(() => ({ active: [], completed: [], myAssigned: [] })), 
              Api.call('getTeamSecretStats', { week: STATE.week }).catch(() => ({ teams: {} }))
          ]);
          
          const activeMissions = missionsData.active || [];
          const completedMissions = missionsData.completed || [];
          const myAssigned = missionsData.myAssigned || [];
          const myStats = statsData.teams?.[myTeam] || {};
          
          let html = renderGuide('secretmissions') || '';
  
          // Status Header Card
          html += `
              <div class="archive-card" style="margin-bottom:24px; border-top:3px solid var(--purple-core); background:linear-gradient(135deg, rgba(167, 139, 250, 0.05), var(--bg-panel));">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
                      <div>
                          <div style="font-size:14px; font-weight:900; color:#fff; font-family:'Orbitron', sans-serif;">CLASSIFIED OPS</div>
                          <div style="font-size:10px; color:${teamColor(myTeam)}; font-weight:800; letter-spacing:1px; margin-top:4px;">TEAM ${myTeam.replace('Team ', '').toUpperCase()}</div>
                      </div>
                      <div style="text-align:right;">
                          <div style="font-size:20px; font-weight:900; font-family:'Share Tech Mono', monospace; color:var(--purple-mid); line-height:1;">+${myStats.secretXP || 0}</div>
                          <div style="font-size:8px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-top:4px;">BONUS XP SECURED</div>
                      </div>
                  </div>
  
                  <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px;">
                      <div style="background:rgba(0,0,0,0.4); padding:12px; border:1px solid var(--border-subtle); border-radius:8px; text-align:center;">
                          <div style="font-size:16px; font-weight:900; font-family:'Share Tech Mono', monospace; color:var(--green);">${myStats.completed || 0}</div>
                          <div style="font-size:9px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-top:4px;">COMPLETED</div>
                      </div>
                      <div style="background:rgba(0,0,0,0.4); padding:12px; border:1px solid var(--border-subtle); border-radius:8px; text-align:center;">
                          <div style="font-size:16px; font-weight:900; font-family:'Share Tech Mono', monospace; color:var(--courage-amber);">${activeMissions.length}</div>
                          <div style="font-size:9px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-top:4px;">ACTIVE</div>
                      </div>
                      <div style="background:rgba(0,0,0,0.4); padding:12px; border:1px solid var(--border-subtle); border-radius:8px; text-align:center;">
                          <div style="font-size:16px; font-weight:900; font-family:'Share Tech Mono', monospace; color:#fff;">${CONFIG.SECRET_MISSIONS?.maxMissionsPerTeam || 5}</div>
                          <div style="font-size:9px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-top:4px;">MAX / WEEK</div>
                      </div>
                  </div>
              </div>
          `;
          
          // Assigned Missions (Urgent)
          if (myAssigned.length > 0) {
              html += `
                  <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                      <span style="font-size:16px;">🎯</span>
                      <div style="font-size:11px; font-weight:900; color:var(--courage-amber); text-transform:uppercase; letter-spacing:2px;">ACTION REQUIRED</div>
                      <div style="flex:1; height:1px; background:linear-gradient(90deg, rgba(255,149,0,0.3), transparent);"></div>
                  </div>
                  ${myAssigned.map(m => renderSecretMissionCard(m, myTeam, true)).join('')}
              `;
          }
          
          // Active Missions
          html += `
              <div style="display:flex; align-items:center; gap:12px; margin:24px 0 16px;">
                  <span style="font-size:16px;">🔓</span>
                  <div style="font-size:11px; font-weight:900; color:#fff; text-transform:uppercase; letter-spacing:2px;">ACTIVE TEAM MISSIONS</div>
                  <div style="flex:1; height:1px; background:linear-gradient(90deg, var(--border-light), transparent);"></div>
              </div>
          `;
  
          if (activeMissions.length > 0) {
              html += activeMissions.map(m => renderSecretMissionCard(m, myTeam, false)).join('');
          } else {
              html += `<div class="glass-card" style="padding:40px; text-align:center; color:var(--text-muted); font-size:11px;">No active secret missions right now. Keep an eye on the radar.</div>`;
          }
          
          // Clear notifications logic
          STATE.lastChecked.missionCount = activeMissions.length;
          STATE.lastChecked.seenMissionIds = [...activeMissions.map(m=>m.id), ...myAssigned.map(m=>m.id)].filter(Boolean);
          STATE.lastChecked._missionBaselineSet = true;
          
          container.innerHTML = html;
          
      } catch (e) {
          showPageError(container, 'renderSecretMissions');
      }
  }
  
  function renderSecretMissionCard(mission, team, isAssigned = false) {
      const mType = CONFIG.MISSION_TYPES?.[mission.type] || { icon: '🕵️', name: 'Classified Op' };
      const xp = mission.xpReward || 5;
      
      return `
          <div class="glass-card" style="margin-bottom:16px; border-left:4px solid ${isAssigned ? 'var(--courage-amber)' : 'var(--purple-core)'}; padding:20px;">
              
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
                  <div style="display:flex; gap:12px; align-items:center;">
                      <div style="width:40px; height:40px; border-radius:10px; background:rgba(255,255,255,0.05); border:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0;">
                          ${mType.icon}
                      </div>
                      <div>
                          <div style="font-size:9px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px; display:flex; gap:8px;">
                              ${mType.name} 
                              ${isAssigned ? '<span style="color:var(--courage-amber); font-weight:800;">[ ASSIGNED TO YOU ]</span>' : ''}
                          </div>
                          <div style="font-size:14px; font-weight:800; color:#fff; line-height:1.3;">${sanitize(mission.title)}</div>
                      </div>
                  </div>
                  
                  <div style="background:rgba(212,175,55,0.1); border:1px solid rgba(212,175,55,0.3); padding:6px 12px; border-radius:8px; text-align:center;">
                      <div style="font-size:14px; font-weight:900; color:var(--vinyl-gold); font-family:'Share Tech Mono', monospace;">+${xp}</div>
                      <div style="font-size:8px; color:var(--text-secondary); text-transform:uppercase;">XP</div>
                  </div>
              </div>
              
              <div style="font-size:12px; color:var(--text-secondary); line-height:1.6; padding:12px; background:rgba(0,0,0,0.3); border-radius:8px; border:1px solid var(--border-subtle);">
                  ${sanitize(mission.briefing || mission.description || 'Proceed with mission parameters.')}
              </div>
  
              ${mission.goalTarget ? `
                  <div style="margin-top:16px;">
                      <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); margin-bottom:6px; text-transform:uppercase; letter-spacing:1px;">
                          <span>Target Progress</span>
                          <span style="color:#fff; font-weight:800;">${mission.progress?.[team] || 0} / ${mission.goalTarget}</span>
                      </div>
                      <div class="pbar" style="height:6px; background:rgba(255,255,255,0.05);">
                          <div class="pfill purple" style="width:${Math.min(100, ((mission.progress?.[team] || 0) / mission.goalTarget) * 100)}%;"></div>
                      </div>
                  </div>
              ` : ''}
  
              ${isAssigned ? `
                  <button onclick="markMissionComplete('${mission.id}')" class="btn-red" style="margin-top:20px; width:100%; font-size:12px; padding:14px; background:linear-gradient(135deg, var(--green), #00b34a); box-shadow:0 10px 20px rgba(0,255,102,0.2);">
                      ✓ MARK MISSION COMPLETE
                  </button>
              ` : ''}
          </div>
      `;
  }
  
  // =============================================
  // ██████  BADGES PAGE
  // =============================================
  
  function renderBadgesPage() {
    const container = $('badgesContent');
    if (!container) return;
  
    const xp = parseInt(STATE.data?.agent?.stats?.totalXP) || 0;
    const levelBadges = getLevelBadges(STATE.agentNo, xp);
    const album2xBadge = getAlbum2xBadge(STATE.agentNo, STATE.week);
  
    const allBadges = [];
    if (album2xBadge) allBadges.push(album2xBadge);
    allBadges.push(...levelBadges);
  
    if (allBadges.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:30px;">
          <div style="font-size:36px;margin-bottom:10px;">🎖️</div>
          <p style="color:var(--text-muted);font-size:12px;">Earn 50 XP to get your first badge!</p>
          <p style="color:var(--text-muted);font-size:10px;margin-top:6px;">Current: ${fmt(xp)} XP</p>
        </div>`;
      return;
    }
  
    container.innerHTML = `
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">
        You have <strong>${allBadges.length}</strong> badge${allBadges.length !== 1 ? 's' : ''} • ${fmt(xp)} XP total
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:10px;">
        ${allBadges.map(b => {
          const borderColor = b.type === 'achievement' ? '#ffd700' : 'var(--border-light)';
          return `
            <div style="text-align:center;padding:8px;background:var(--panel-bg);border:1px solid ${borderColor};border-radius:6px;">
              <img src="${b.imageUrl}" style="width:60px;height:60px;border-radius:8px;border:2px solid ${borderColor};"
                onerror="this.style.display='none'" loading="lazy" alt="${sanitize(b.name)}">
              <div style="font-size:9px;color:var(--text-muted);margin-top:4px;">${b.type === 'achievement' ? '✨ ' : ''}${b.name}</div>
            </div>`;
        }).join('')}
      </div>
    `;
  }
  
  
  // =============================================
  // ██████  WEEKLY SUMMARY
  // =============================================
  // v2.0: Cached API, confetti fires only once per week.
  
  /** Track which weeks we already fired confetti for */
  const _confettiFiredForWeek = new Set();
  
  // =============================================
  // ██████  WEEKLY SUMMARY PAGE (ARIRANG THEME)
  // =============================================
  
  // =============================================
  // ██████  WEEKLY SUMMARY PAGE (7 Missions)
  // =============================================
  
  async function renderSummary() {
      const container = document.getElementById('summaryContent');
      if (!container) return;
  
      const selectedWeek = STATE.week;
      const isCompleted = isWeekCompleted(selectedWeek);
  
      // --- 1. LOCKED VIEW (week still running) ---
      if (!isCompleted) {
          container.innerHTML = `
              <div class="glass-card" style="text-align:center; padding:60px 20px;">
                  <div style="font-size:48px; margin-bottom:16px; opacity:0.5; filter:grayscale(1);">⏳</div>
                  <div style="font-size:16px; font-weight:800; color:#fff; letter-spacing:1px; margin-bottom:8px;">MISSION IN PROGRESS</div>
                  <div style="font-size:11px; color:var(--text-muted);">Intel report pending end of week operations.</div>
              </div>`;
          return;
      }
  
      // --- 2. LOADING SKELETON ---
      showPageLoading(container);
  
      try {
          const [summary, goals, rankings] = await Promise.all([
              Api.call('getWeeklySummary', { week: selectedWeek }),
              Api.call('getGoalsProgress', { week: selectedWeek }),
              Api.call('getRankings', { week: selectedWeek, limit: 10 })
          ]);
  
          const isReleased = summary.resultsReleased === true;
  
          if (!isReleased) {
              container.innerHTML = `
                  <div class="archive-card" style="text-align:center; padding:60px 20px; border-color:var(--courage-amber); background:rgba(255,149,0,0.03);">
                      <div style="font-size:48px; margin-bottom:16px; opacity:0.8;">🔒</div>
                      <div style="font-size:14px; font-weight:900; color:var(--courage-amber); text-transform:uppercase; letter-spacing:2px; margin-bottom:8px;">Verification in Progress</div>
                      <div style="font-size:11px; color:var(--text-secondary); line-height:1.6;">HQ is currently verifying Attendance & Police Reports.<br>Results will be broadcasted shortly.</div>
                  </div>`;
              return;
          }
  
          const teams = summary.teams || {};
          const trackGoals = goals.trackGoals || {};
          const albumGoals = goals.albumGoals || {};
          const topAgents = rankings.rankings || [];
  
          const sortedTeams = Object.entries(teams).sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0));
          const winnerEntry = sortedTeams.find(([t, info]) => info.isWinner === true);
          const winner = winnerEntry ? winnerEntry[0] : null;
  
          // Calculate stream totals
          let totalTrackStreams = 0;
          let totalAlbumStreams = 0;
  
          Object.entries(trackGoals).forEach(([name, info]) => {
              let t = 0;
              Object.values(info.teams || {}).forEach(s => t += (s.current || 0));
              totalTrackStreams += t;
          });
          Object.entries(albumGoals).forEach(([name, info]) => {
              let t = 0;
              Object.values(info.teams || {}).forEach(s => t += (s.current || 0));
              totalAlbumStreams += t;
          });
  
          const dateStr = CONFIG.WEEK_DATES[selectedWeek]
              ? new Date(CONFIG.WEEK_DATES[selectedWeek]).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              : '';
  
          const qualificationLabels = sortedTeams.map(([t, info]) => {
              const checks = [
                  { label: 'Tracks', passed: info.trackGoalPassed },
                  { label: 'Albums', passed: info.albumGoalPassed },
                  { label: '2X', passed: info.album2xPassed },
                  { label: 'Unit', passed: info.arirangUnitPassed },
                  { label: 'Side', passed: info.sideMissionPassed },
                  { label: 'Attend', passed: info.attendanceConfirmed },
                  { label: 'Police', passed: info.policeConfirmed }
              ];
              const passedCount = checks.filter(c => c.passed).length;
              const failedNames = checks.filter(c => !c.passed).map(c => c.label);
              return { team: t, info, checks, passedCount, failedNames, allPassed: passedCount === 7 };
          });
  
          const teamsDataForShare = JSON.stringify(sortedTeams.map(([t, info]) => ({ t, xp: info.teamXP }))).replace(/"/g, '&quot;');
  
          let html = `
              <!-- WINNER OR NO WINNER -->
              ${winner ? `
                  <div class="archive-card" style="text-align:center; margin-bottom:24px; border-color:var(--vinyl-gold); background:radial-gradient(ellipse at top, rgba(212,175,55,0.1), transparent 70%);">
                      <div style="font-size:48px; margin-bottom:12px; filter:drop-shadow(0 0 10px rgba(212,175,55,0.4));">🏆</div>
                      <div style="font-size:10px; color:var(--vinyl-gold); font-weight:900; letter-spacing:4px; margin-bottom:6px;">MISSION SECURED BY</div>
                      <div style="font-size:28px; font-weight:900; color:#fff; font-family:'Orbitron', sans-serif; letter-spacing:2px; text-shadow:0 0 20px rgba(212,175,55,0.4);">${winner.toUpperCase()}</div>
                  </div>
              ` : `
                  <div class="archive-card" style="text-align:center; margin-bottom:24px; border-color:var(--fail); background:radial-gradient(ellipse at top, rgba(255,59,92,0.1), transparent 70%);">
                      <div style="font-size:48px; margin-bottom:12px; opacity:0.8;">⬡</div>
                      <div style="font-size:12px; color:var(--fail); font-weight:900; letter-spacing:4px; margin-bottom:8px;">EXTRACTION FAILED</div>
                      <div style="font-size:11px; color:var(--text-secondary); line-height:1.6; margin-bottom:16px;">No team successfully cleared all 7 checkpoints.<br><span style="color:var(--text-muted);">The trophy remains secured at HQ.</span></div>
                      <div style="display:flex; justify-content:center; gap:6px; flex-wrap:wrap;">
                          ${['Tracks', 'Albums', '2X', 'Unit', 'Side', 'Attend', 'Police'].map(m =>
                              `<span style="font-size:8px; font-weight:700; padding:4px 8px; background:rgba(255,255,255,0.05); border:1px solid var(--border-light); border-radius:6px; color:var(--text-muted);">${m}</span>`
                          ).join('')}
                      </div>
                  </div>
              `}
  
              <!-- POSTER FOR SHARING -->
              <div style="text-align:center; margin-bottom:12px;">
                  <span style="color:var(--text-muted); font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase;">📸 Screenshot to share intel</span>
              </div>
  
              <div id="shareable-stats-card" style="background:#0a0a0f; border:1px solid var(--border-mid); border-radius:16px; overflow:hidden; margin:0 auto 24px; max-width:380px;">
                  <!-- Poster Header -->
                  <div style="background:linear-gradient(135deg, var(--red-core), #b30033); padding:24px 16px; text-align:center; position:relative; overflow:hidden;">
                      <div style="position:absolute; inset:0; background:repeating-radial-gradient(circle, transparent 0, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 12px);"></div>
                      <div style="position:relative; z-index:2;">
                          <div style="color:rgba(255,255,255,0.7); font-size:9px; font-weight:900; letter-spacing:4px;">INTELLIGENCE REPORT</div>
                          <div style="color:#fff; font-family:'Orbitron', sans-serif; font-size:18px; font-weight:900; margin-top:6px; letter-spacing:1px;">ARIRANG MISSION</div>
                          <div style="color:rgba(255,255,255,0.6); font-size:10px; font-family:'Share Tech Mono', monospace; margin-top:8px;">${selectedWeek}${dateStr ? ' // ' + dateStr : ''}</div>
                      </div>
                  </div>
  
                  <!-- Total Streams -->
                  <div style="padding:24px 16px; text-align:center; border-bottom:1px solid var(--border-subtle);">
                      <div style="color:var(--text-muted); font-size:9px; font-weight:800; letter-spacing:3px; margin-bottom:8px;">TOTAL STREAMS</div>
                      <div style="color:var(--vinyl-gold); font-size:42px; font-weight:900; font-family:'Share Tech Mono', monospace; line-height:1; text-shadow:0 0 20px rgba(212,175,55,0.3);">${fmt(totalTrackStreams + totalAlbumStreams)}</div>
                      <div style="display:flex; justify-content:center; gap:20px; margin-top:16px;">
                          <div style="display:flex; align-items:center; gap:6px;">
                              <span style="font-size:14px;">🎵</span>
                              <span style="color:var(--wave-foam); font-size:11px; font-weight:800; font-family:monospace;">${fmt(totalTrackStreams)}</span>
                          </div>
                          <div style="width:1px; background:var(--border-subtle);"></div>
                          <div style="display:flex; align-items:center; gap:6px;">
                              <span style="font-size:14px;">💿</span>
                              <span style="color:var(--purple-mid); font-size:11px; font-weight:800; font-family:monospace;">${fmt(totalAlbumStreams)}</span>
                          </div>
                      </div>
                  </div>
  
                  <!-- Standings -->
                  <div style="padding:16px;">
                      <div style="color:var(--red-core); font-size:9px; font-weight:900; letter-spacing:2px; margin-bottom:12px; text-align:center;">SQUAD STANDINGS</div>
                      <div style="display:flex; flex-direction:column; gap:8px;">
                          ${sortedTeams.map(([t, info], i) => `
                              <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:rgba(255,255,255,0.02); border-radius:6px;">
                                  <div style="display:flex; align-items:center; gap:10px;">
                                      <span style="font-size:14px; width:16px; text-align:center;">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '<span style="color:var(--text-ghost); font-size:10px; font-weight:900;">' + (i + 1) + '</span>'}</span>
                                      <span style="color:${teamColor(t)}; font-size:11px; font-weight:800;">${t.toUpperCase()}</span>
                                  </div>
                                  <span style="color:#fff; font-size:11px; font-weight:900; font-family:monospace;">${fmt(info.teamXP || 0)} XP</span>
                              </div>
                          `).join('')}
                      </div>
                  </div>
  
                  <!-- Watermark -->
                  <div style="background:#050508; padding:12px; text-align:center; border-top:1px solid #111;">
                      <div style="color:var(--text-muted); font-size:9px; font-weight:800; letter-spacing:4px;">HOPETRACKER AGENCY</div>
                  </div>
              </div>
  
              <!-- Copy Caption Button -->
              <button onclick="copyShareText('${selectedWeek}', ${totalTrackStreams + totalAlbumStreams}, '${winner || ''}', '${teamsDataForShare}')" style="width:100%; max-width:380px; margin:0 auto 35px; display:flex; height:46px; border-radius:12px; font-size:12px; font-weight:700; background:linear-gradient(135deg, var(--red-core), #b30033); border:none; color:#fff; cursor:pointer; align-items:center; justify-content:center; gap:8px;">
                  📋 Copy Caption to Share
              </button>
  
              <!-- Section: Team Intel -->
              <div style="display:flex; align-items:center; gap:15px; margin-bottom:20px;">
                  <div style="flex:1; height:1px; background:var(--border-subtle);"></div>
                  <div style="color:var(--text-muted); font-size:10px; font-weight:900; letter-spacing:3px;">TEAM INTEL</div>
                  <div style="flex:1; height:1px; background:var(--border-subtle);"></div>
              </div>
  
              <!-- TEAM STANDINGS with 7-checkpoint detail -->
              <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:35px;">
                  ${qualificationLabels.map((q, i) => {
                      const isWinner = q.info.isWinner === true;
                      const isQualified = q.allPassed;
  
                      return `
                          <div class="glass-card" style="padding:16px; border-left:4px solid ${isWinner ? 'var(--vinyl-gold)' : (isQualified ? 'var(--green)' : 'var(--fail)')};">
                              <div style="display:flex; align-items:center; gap:12px;">
                                  <div style="width:28px; height:28px; border-radius:8px; background:${isWinner ? 'var(--vinyl-gold)' : 'var(--bg-deep)'}; color:${isWinner ? '#000' : 'var(--text-muted)'}; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:12px; flex-shrink:0;">
                                      ${i + 1}
                                  </div>
                                  <div style="flex:1; min-width:0;">
                                      <div style="display:flex; align-items:center; gap:8px;">
                                          <span style="color:${teamColor(q.team)}; font-weight:800; font-size:14px;">${q.team.replace('Team ', '')}</span>
                                          ${isWinner ? '<span style="font-size:14px;">🏆</span>' : ''}
                                      </div>
                                  </div>
                                  <div style="text-align:right; flex-shrink:0;">
                                      <div style="color:#fff; font-size:16px; font-weight:900; font-family:monospace;">${fmt(q.info.teamXP || 0)}</div>
                                      <div style="color:var(--text-muted); font-size:8px; font-weight:800; letter-spacing:1px;">XP</div>
                                  </div>
                              </div>
  
                              <!-- 7 Checkpoint Pills -->
                              <div style="display:flex; gap:4px; margin-top:12px; flex-wrap:wrap;">
                                  ${q.checks.map(c => `
                                      <span style="font-size:8px; font-weight:700; padding:4px 6px; border-radius:4px; letter-spacing:0.5px;
                                          background:${c.passed ? 'var(--green-soft)' : 'var(--red-whisper)'};
                                          color:${c.passed ? 'var(--green)' : 'var(--fail)'};
                                          border:1px solid ${c.passed ? 'var(--green-border)' : 'var(--red-border)'};">
                                          ${c.passed ? '✓' : '✗'} ${c.label}
                                      </span>
                                  `).join('')}
                              </div>
  
                              <!-- Status line -->
                              <div style="margin-top:10px;">
                                  ${isQualified
                                      ? '<span style="color:var(--green); font-size:10px; font-weight:800;">✓ ALL 7 PROTOCOLS CLEARED</span>'
                                      : '<span style="color:var(--fail); font-size:9px; font-weight:700;">✗ ' + q.passedCount + '/7 CLEARED — Failed: ' + q.failedNames.join(', ') + '</span>'
                                  }
                              </div>
                          </div>
                      `;
                  }).join('')}
              </div>
  
              <!-- Section: Elite Agents -->
              <div style="display:flex; align-items:center; gap:15px; margin-bottom:20px;">
                  <div style="flex:1; height:1px; background:var(--border-subtle);"></div>
                  <div style="color:var(--text-muted); font-size:10px; font-weight:900; letter-spacing:3px;">ELITE AGENTS</div>
                  <div style="flex:1; height:1px; background:var(--border-subtle);"></div>
              </div>
  
              <div class="archive-card" style="padding:0; margin-bottom:30px;">
                  ${topAgents.slice(0, 5).map((agent, i) => {
                      const agentTeam = agent.team || 'Unknown';
                      const agentName = agent.name || 'Agent';
                      const agentXP = agent.totalXP || 0;
  
                      return `
                          <div style="display:flex; align-items:center; gap:12px; padding:16px; border-bottom:1px solid var(--border-subtle);">
                              <div style="font-size:18px; width:28px; text-align:center;">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '<span style="color:var(--text-ghost); font-weight:900; font-family:monospace;">' + (i + 1) + '</span>'}</div>
                              <div style="flex:1; min-width:0;">
                                  <div style="color:#fff; font-weight:800; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${sanitize(agentName)}</div>
                                  <div style="color:${teamColor(agentTeam)}; font-size:10px; font-weight:700; margin-top:2px;">${agentTeam.replace('Team ', '')}</div>
                              </div>
                              <div style="text-align:right;">
                                  <div style="color:var(--red-core); font-weight:900; font-size:16px; font-family:monospace;">${fmt(agentXP)}</div>
                              </div>
                          </div>
                      `;
                  }).join('')}
              </div>
  
              <!-- Back Button -->
              <button onclick="goTo('home')" class="btn-outline" style="width:100%; height:50px; font-size:12px;">
                  ← Return to Mission Control
              </button>
          `;
  
          container.innerHTML = html;
  
      } catch (e) {
          console.error('Summary error:', e);
          showPageError(container, 'renderSummary');
      }
  }
  // =============================================
  // ██████  CONFETTI
  // =============================================
  // v2.0: Injected CSS once, guaranteed cleanup,
  //        uses documentFragment for batch DOM insertion.
  
  /** Inject confetti keyframes once */
  function ensureConfettiStyles() {
    if (document.getElementById('confetti-styles')) return;
    const style = document.createElement('style');
    style.id = 'confetti-styles';
    style.textContent = `
      @keyframes confettiFall {
        0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      .confetti-piece {
        position: fixed;
        top: -10px;
        z-index: 999999;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }
  
  function fireConfetti() {
    ensureConfettiStyles();
  
    const colors = ['#ff0000', '#ffffff', '#ffd700', '#00ff66', '#c4b5fd'];
    const fragment = document.createDocumentFragment();
    const pieces = [];
  
    for (let i = 0; i < 60; i++) {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      const size = 4 + Math.random() * 6;
      const duration = 2 + Math.random() * 2;
      c.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px; height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        opacity: ${0.6 + Math.random() * 0.4};
        transform: rotate(${Math.random() * 360}deg);
        animation: confettiFall ${duration}s ease-out forwards;
      `;
      fragment.appendChild(c);
      pieces.push(c);
    }
  
    document.body.appendChild(fragment);
  
    // Cleanup all pieces after longest animation
    Timers.setTimeout('confetti-cleanup', () => {
      pieces.forEach(p => p.remove());
    }, 4500);
  }
  
  
  // =============================================
  // ██████  ADMIN PANEL (Arirang Theme) — CLEANED
  // =============================================
  const NOTIFICATION_SYSTEM_VERSION = 4;
  
  // ==================== HELPERS ====================
  
  function isAdminAgent() {
      return String(STATE.agentNo).toUpperCase() === String(CONFIG.ADMIN_AGENT_NO).toUpperCase();
  }
  
  function getMissionId(mission) {
      return mission.mission_id || mission.id;
  }
  
  function extractYouTubeId(url) {
      const match = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
      return (match && match[2].length === 11) ? match[2] : null;
  }
  
  function showCreateResult(msg, isError) {
      const el = document.getElementById('create-result');
      if (!el) return;
      el.innerHTML = `<div style="padding:12px; border-radius:8px; font-size:11px; font-weight:700;
          background:${isError ? 'rgba(255,59,92,0.1)' : 'rgba(0,255,102,0.1)'};
          color:${isError ? 'var(--fail)' : 'var(--green)'};
          border:1px solid ${isError ? 'var(--fail)' : 'var(--green)'};">${msg}</div>`;
      setTimeout(() => el.innerHTML = '', 4000);
  }
  
  // ==================== SESSION MANAGEMENT ====================
  
  function checkAdminStatus() {
      if (!isAdminAgent()) {
          STATE.isAdmin = false;
          return;
      }
  
      const savedSession = localStorage.getItem('adminSession');
      const savedExpiry = localStorage.getItem('adminExpiry');
  
      if (savedSession && savedExpiry && Date.now() < parseInt(savedExpiry)) {
          STATE.isAdmin = true;
          STATE.adminSession = savedSession;
          addAdminIndicator();
      } else {
          STATE.isAdmin = false;
          STATE.adminSession = null;
      }
  }
  
  function exitAdminMode() {
      STATE.isAdmin = false;
      STATE.adminSession = null;
      localStorage.removeItem('adminSession');
      localStorage.removeItem('adminExpiry');
      document.querySelectorAll('.admin-nav-link').forEach(el => el.remove());
      closeAdminPanel();
      showToast('Admin mode deactivated', 'info');
      goTo('home');
  }
  window.adminExitMode = exitAdminMode;
  
  function addAdminIndicator() {
      if (!isAdminAgent()) return;
      document.querySelectorAll('.admin-nav-link').forEach(el => el.remove());
  
      const nav = document.querySelector('.nav-links') || $('sidebar');
      if (!nav) return;
  
      const link = document.createElement('a');
      link.href = '#';
      link.className = 'nav-link admin-nav-link';
      link.style.cssText = 'margin-top:auto; border-top:1px solid var(--border-subtle); padding-top:15px; color:var(--red-core); font-weight:800;';
      link.innerHTML = '<span class="nav-icon">🎛️</span><span>Mission Control</span>';
      link.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          STATE.isAdmin ? showAdminPanel() : showAdminLogin();
          closeSidebar();
      };
      nav.appendChild(link);
  }
  
  // ==================== LOGIN MODAL ====================
  
  function showAdminLogin() {
      if (!isAdminAgent()) { showToast('Access denied.', 'error'); return; }
      closeSidebar();
      document.querySelectorAll('.admin-modal-overlay, #admin-modal').forEach(m => m.remove());
  
      const modal = document.createElement('div');
      modal.className = 'admin-modal-overlay spy-modal-overlay';
      modal.id = 'admin-modal';
      modal.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.9); z-index:100000;
          display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px); animation:fadeIn 0.3s ease;`;
      modal.onclick = (e) => { if (e.target === modal) closeAdminModal(); };
  
      modal.innerHTML = `
          <div class="glass-card" style="width:100%; max-width:360px; border:1px solid var(--red-core);
              box-shadow:0 0 40px rgba(255,20,95,0.2); overflow:hidden;" onclick="event.stopPropagation();">
              <div style="padding:20px; background:var(--red-whisper); border-bottom:1px solid var(--red-border);
                  display:flex; justify-content:space-between; align-items:center;">
                  <div style="font-size:13px; font-weight:900; color:var(--red-core);
                      font-family:'Orbitron',sans-serif; letter-spacing:2px;">🔐 CLEARANCE REQUIRED</div>
                  <button type="button" onclick="closeAdminModal();"
                      style="background:none; border:none; color:var(--text-muted); font-size:24px; cursor:pointer;">×</button>
              </div>
              <div style="padding:24px;">
                  <label style="font-size:10px; color:var(--text-ghost); font-weight:800;
                      text-transform:uppercase; letter-spacing:2px; margin-bottom:8px; display:block;">Enter Passcode</label>
                  <input type="password" id="admin-password" class="input-field" autocomplete="off"
                      style="text-align:center; font-size:16px; letter-spacing:4px;">
                  <div id="admin-error" style="color:var(--fail); font-size:11px; margin-top:12px;
                      text-align:center; min-height:16px;"></div>
              </div>
              <div style="padding:16px 24px; border-top:1px solid var(--border-subtle);">
                  <button type="button" onclick="verifyAdminPassword();" class="btn-red"
                      style="width:100%;">AUTHENTICATE</button>
              </div>
          </div>`;
  
      document.body.appendChild(modal);
      setTimeout(() => {
          const pw = $('admin-password');
          if (pw) { pw.focus(); pw.onkeypress = (e) => { if (e.key === 'Enter') { e.preventDefault(); verifyAdminPassword(); } }; }
      }, 150);
  }
  
  function closeAdminModal() {
      const m = $('admin-modal');
      if (m) m.remove();
  }
  
  async function verifyAdminPassword() {
      const passwordField = $('admin-password');
      const password = passwordField?.value;
      const errorEl = $('admin-error');
  
      if (!password) { if (errorEl) errorEl.textContent = 'Passcode required'; return; }
  
      const btn = document.querySelector('#admin-modal .btn-red');
      const originalText = btn?.innerHTML || 'AUTHENTICATE';
      if (btn) { btn.innerHTML = 'VERIFYING...'; btn.disabled = true; }
  
      try {
          const result = await Api.call('verifyAdmin',
              { agentNo: STATE.agentNo, password },
              { dedupe: false, cache: false });
  
          if (result.success && result.sessionToken) {
              STATE.isAdmin = true;
              STATE.adminSession = result.sessionToken;
              localStorage.setItem('adminSession', result.sessionToken);
              localStorage.setItem('adminExpiry', String(Date.now() + 2 * 60 * 60 * 1000));
              closeAdminModal();
              addAdminIndicator();
              showToast('Access Granted', 'success');
              setTimeout(() => showAdminPanel(), 100);
          } else {
              throw new Error(result.error || 'Invalid Passcode');
          }
      } catch (e) {
          if (errorEl) errorEl.textContent = e.message || 'Auth Failed';
      } finally {
          if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
      }
  }
  
  // ==================== PANEL SHELL ====================
  
  function showAdminPanel() {
      if (!STATE.isAdmin) { showToast('Admin access required', 'error'); return; }
      if (!STATE.week) STATE.week = STATE.weeks?.[0] || 'Week 1';
      document.querySelectorAll('.admin-panel-overlay').forEach(p => p.remove());
  
      const TABS = [
          { key: 'create',  icon: '➕', label: 'Deploy'  },
          { key: 'active',  icon: '⚡', label: 'Active'  },
          { key: 'confirm', icon: '📋', label: 'Verify'  },
          { key: 'sotd',    icon: '🎵', label: 'SOTD'    },
          { key: 'leaves',  icon: '💤', label: 'Leave'   },
          { key: 'history', icon: '📜', label: 'History' },
          { key: 'system',  icon: '⚙️', label: 'System'  },
      ];
  
      const panel = document.createElement('div');
      panel.className = 'admin-panel-overlay';
      panel.style.cssText = `position:fixed; inset:0; background:var(--bg-abyss);
          z-index:999999; display:flex; flex-direction:column; overflow:hidden;`;
  
      panel.innerHTML = `
          <div style="background:rgba(6,6,10,0.9); backdrop-filter:blur(10px);
              border-bottom:1px solid var(--red-border); padding:16px 24px;
              display:flex; justify-content:space-between; align-items:center; z-index:10;">
              <div>
                  <h3 style="margin:0; color:var(--red-core); font-family:'Orbitron',sans-serif;
                      font-size:16px; letter-spacing:2px;">🎛️ MISSION CONTROL</h3>
                  <p style="margin:4px 0 0; color:var(--text-muted); font-size:11px;
                      font-family:'Share Tech Mono',monospace;">${STATE.week || 'Active Week'}</p>
              </div>
              <button type="button" onclick="closeAdminPanel()"
                  style="background:none; border:none; color:var(--text-muted); font-size:28px; cursor:pointer;">×</button>
          </div>
  
          <div style="display:flex; gap:8px; overflow-x:auto; padding:12px 24px;
              background:var(--bg-panel); border-bottom:1px solid var(--border-subtle);
              flex-shrink:0; -webkit-overflow-scrolling:touch;">
              ${TABS.map((t, i) => `
                  <button class="admin-tab${i === 0 ? ' active' : ''}" data-tab="${t.key}"
                      onclick="switchAdminTab('${t.key}', this)"
                      style="padding:8px 16px; background:${i === 0 ? 'var(--red-whisper)' : 'transparent'};
                      border:1px solid ${i === 0 ? 'var(--red-core)' : 'var(--border-subtle)'};
                      color:${i === 0 ? 'var(--red-core)' : 'var(--text-muted)'};
                      border-radius:8px; font-size:11px; font-weight:800; white-space:nowrap;
                      cursor:pointer; transition:all 0.2s;">${t.icon} ${t.label}</button>
              `).join('')}
          </div>
  
          <div id="admin-panel-body" style="flex:1; overflow-y:auto; padding:24px;
              max-width:800px; margin:0 auto; width:100%;"></div>`;
  
      document.body.appendChild(panel);
      document.body.style.overflow = 'hidden';
      switchAdminTab('create', panel.querySelector('.admin-tab[data-tab="create"]'));
  }
  
  function closeAdminPanel() {
      const panel = document.querySelector('.admin-panel-overlay');
      if (panel) { panel.remove(); document.body.style.overflow = ''; }
  }
  
  const TAB_RENDERERS = {
      create:  renderCreateMissionForm,
      active:  loadActiveTeamMissions,
      confirm: renderWeekConfirmation,
      sotd:    renderAdminSOTD,
      leaves:  loadLeavesAdmin,
      history: loadMissionHistory,
      system:  renderAdminSystemTab,
  };
  
  function switchAdminTab(tabName, btnElement) {
      document.querySelectorAll('.admin-tab').forEach(t => {
          t.style.background = 'transparent';
          t.style.borderColor = 'var(--border-subtle)';
          t.style.color = 'var(--text-muted)';
      });
      if (btnElement) {
          btnElement.style.background = 'var(--red-whisper)';
          btnElement.style.borderColor = 'var(--red-core)';
          btnElement.style.color = 'var(--red-core)';
      }
  
      const container = $('admin-panel-body');
      if (!container) return;
  
      const renderer = TAB_RENDERERS[tabName];
      if (renderer) renderer(container);
  }
  
  // ==================== TAB: CREATE MISSION ====================
  
  function renderCreateMissionForm(container) {
      const missionTypes = CONFIG.MISSION_TYPES || {
          switch_app: { icon: '🔄', name: 'Switch App' },
          filler:     { icon: '🧬', name: 'Filler Mode' },
          stream:     { icon: '▶️', name: 'Stream Party' },
          custom:     { icon: '⭐', name: 'Custom Task' },
      };
      const teams = CONFIG.TEAMS || {};
  
      container.innerHTML = `
          <div class="archive-card" style="margin-bottom:24px;">
              <div style="font-size:12px; font-weight:800; color:#fff; text-transform:uppercase;
                  letter-spacing:2px; margin-bottom:16px;">Mission Type</div>
              <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:12px; margin-bottom:16px;">
                  ${Object.entries(missionTypes).map(([key, m], i) => `
                      <div class="mission-type-option" data-type="${key}"
                          onclick="selectMissionType(this,'${key}')"
                          style="padding:16px; background:${i === 0 ? 'var(--red-whisper)' : 'rgba(255,255,255,0.02)'};
                          border:1px solid ${i === 0 ? 'var(--red-core)' : 'var(--border-subtle)'};
                          border-radius:8px; text-align:center; cursor:pointer; transition:all 0.2s;">
                          <div style="font-size:24px; margin-bottom:8px;">${m.icon}</div>
                          <div style="font-size:11px; font-weight:700;
                              color:${i === 0 ? 'var(--red-core)' : 'var(--text-muted)'};">${m.name}</div>
                      </div>
                  `).join('')}
              </div>
              <input type="hidden" id="selected-mission-type" value="${Object.keys(missionTypes)[0] || 'switch_app'}">
          </div>
  
          <div class="glass-card" style="padding:20px; margin-bottom:24px;">
              <div style="font-size:12px; font-weight:800; color:#fff; text-transform:uppercase;
                  letter-spacing:2px; margin-bottom:16px;">Target Teams</div>
              <div style="display:flex; flex-wrap:wrap; gap:12px;">
                  <label style="display:flex; align-items:center; gap:8px; padding:8px 12px;
                      background:rgba(255,255,255,0.05); border-radius:6px; cursor:pointer;">
                      <input type="checkbox" id="select-all-teams"
                          onchange="toggleAllTeams(this.checked)" style="accent-color:var(--red-core);">
                      <span style="font-size:11px; font-weight:800; color:#fff;">All Teams</span>
                  </label>
                  ${Object.keys(teams).map(team => `
                      <label style="display:flex; align-items:center; gap:8px; padding:8px 12px;
                          background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle);
                          border-radius:6px; cursor:pointer;">
                          <input type="checkbox" name="target-teams" value="${team}"
                              style="accent-color:var(--red-core);">
                          <span style="font-size:11px; color:${teamColor(team)};
                              font-weight:700;">${team.replace('Team ', '')}</span>
                      </label>
                  `).join('')}
              </div>
          </div>
  
          <div class="glass-card" style="padding:20px; margin-bottom:24px;">
              <div style="font-size:12px; font-weight:800; color:#fff; text-transform:uppercase;
                  letter-spacing:2px; margin-bottom:16px;">Mission Details</div>
              <div style="margin-bottom:16px;">
                  <label class="label-tag" style="display:block; margin-bottom:6px;">Mission Title</label>
                  <input type="text" id="mission-title" class="input-field" placeholder="e.g. Operation DNA">
              </div>
              <div style="margin-bottom:16px;">
                  <label class="label-tag" style="display:block; margin-bottom:6px;">Briefing</label>
                  <textarea id="mission-briefing" class="input-field"
                      style="min-height:80px; resize:vertical;" placeholder="Instructions for agents..."></textarea>
              </div>
              <div style="margin-bottom:16px;">
                  <label class="label-tag" style="display:block; margin-bottom:6px;">Target Track (Optional)</label>
                  <input type="text" id="target-track" class="input-field" placeholder="e.g. SWIM">
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                  <div>
                      <label class="label-tag" style="display:block; margin-bottom:6px;">Stream Target</label>
                      <input type="number" id="goal-target" class="input-field" value="100" min="1">
                  </div>
                  <div>
                      <label class="label-tag" style="display:block; margin-bottom:6px;">XP Reward</label>
                      <input type="number" id="xp-reward" class="input-field" value="5" min="1" max="50">
                  </div>
              </div>
          </div>
  
          <button type="button" onclick="createTeamMission()" class="btn-red"
              style="font-size:14px; padding:16px;">🚀 DEPLOY MISSION</button>
          <div id="create-result" style="margin-top:16px; text-align:center;"></div>`;
  }
  
  function selectMissionType(element, type) {
      document.querySelectorAll('.mission-type-option').forEach(el => {
          el.style.background = 'rgba(255,255,255,0.02)';
          el.style.borderColor = 'var(--border-subtle)';
          el.querySelector('div:nth-child(2)').style.color = 'var(--text-muted)';
      });
      element.style.background = 'var(--red-whisper)';
      element.style.borderColor = 'var(--red-core)';
      element.querySelector('div:nth-child(2)').style.color = 'var(--red-core)';
      $('selected-mission-type').value = type;
  }
  
  function toggleAllTeams(checked) {
      document.querySelectorAll('input[name="target-teams"]').forEach(cb => cb.checked = checked);
  }
  
  async function createTeamMission() {
      const type       = $('selected-mission-type')?.value;
      const title      = $('mission-title')?.value?.trim();
      const briefing   = $('mission-briefing')?.value?.trim();
      const targetTrack = $('target-track')?.value?.trim();
      const goalTarget = parseInt($('goal-target')?.value) || 100;
      const xpReward   = parseInt($('xp-reward')?.value) || 5;
      const targetTeams = Array.from(document.querySelectorAll('input[name="target-teams"]:checked')).map(cb => cb.value);
  
      if (!title)                return showCreateResult('❌ Please enter a mission title', true);
      if (targetTeams.length === 0) return showCreateResult('❌ Please select at least one team', true);
      if (!briefing)             return showCreateResult('❌ Please enter a mission briefing', true);
  
      Loading.show();
      try {
          const res = await Api.call('createTeamMission', {
              type, title, briefing, targetTeams: JSON.stringify(targetTeams),
              targetTrack, goalTarget, xpReward, week: STATE.week,
              agentNo: STATE.agentNo, sessionToken: STATE.adminSession
          }, { dedupe: false, cache: false });
  
          if (res.success) {
              showCreateResult('✅ Mission Deployed Successfully!', false);
              $('mission-title').value = '';
              $('mission-briefing').value = '';
              setTimeout(() => switchAdminTab('active', document.querySelector('.admin-tab[data-tab="active"]')), 1500);
          } else {
              showCreateResult('❌ ' + (res.error || 'Failed to create mission'), true);
          }
      } catch (e) {
          showCreateResult('❌ ' + e.message, true);
      } finally {
          Loading.hide();
      }
  }
  
  // ==================== TAB: ACTIVE MISSIONS ====================
  
  async function loadActiveTeamMissions(container) {
      if (!container) container = $('admin-panel-body');
      container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted);">⏳ Accessing active mission database...</div>';
  
      try {
          const res = await Api.call('getTeamMissions', { status: 'active', week: STATE.week }, { cache: false });
          const missions = res.missions || [];
  
          if (missions.length > 0) {
              container.innerHTML = `
                  <div style="margin-bottom:20px;">
                      <div style="font-size:14px; font-weight:900; color:#fff;
                          font-family:'Orbitron',sans-serif;">ACTIVE MISSIONS (${missions.length})</div>
                      <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">
                          Select a team to approve or fail their progress</div>
                  </div>
                  ${missions.map(m => renderAdminMissionCard(m)).join('')}`;
          } else {
              container.innerHTML = `
                  <div style="text-align:center; padding:60px 20px;">
                      <div style="font-size:48px; margin-bottom:16px; opacity:0.5;">📭</div>
                      <div style="font-size:14px; font-weight:800; color:#fff;">No Active Missions</div>
                      <div style="font-size:11px; color:var(--text-muted); margin-top:8px;">
                          Deploy a new mission from the Create tab.</div>
                  </div>`;
          }
      } catch (e) {
          container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--fail);">
              Failed to load missions.<br>${e.message}</div>`;
      }
  }
  
  function renderAdminMissionCard(mission) {
      const targetTeams    = mission.targetTeams || mission.target_teams || [];
      const completedTeams = mission.completedTeams || mission.completed_teams || [];
      const goalTarget     = mission.goalTarget || mission.goal_target || 100;
      const xpReward       = mission.xpReward || mission.xp_reward || 5;
      const progress       = mission.progress || {};
      const missionType    = CONFIG.MISSION_TYPES?.[mission.type || mission.mission_type] || { icon: '🎯', name: 'Mission' };
      const mid            = getMissionId(mission);
      const allCompleted   = targetTeams.length > 0 && targetTeams.every(t => completedTeams.includes(t));
  
      return `
          <div class="archive-card" style="margin-bottom:20px; padding:20px;
              border-top:3px solid ${allCompleted ? 'var(--green)' : 'var(--red-core)'};">
              <div style="display:flex; gap:16px; align-items:flex-start; margin-bottom:20px;">
                  <div style="width:48px; height:48px; border-radius:12px; background:rgba(255,255,255,0.05);
                      border:1px solid var(--border-light); display:flex; align-items:center;
                      justify-content:center; font-size:24px; flex-shrink:0;">${missionType.icon}</div>
                  <div style="flex:1;">
                      <div style="font-size:14px; font-weight:800; color:#fff; margin-bottom:4px;">
                          ${sanitize(mission.title)}</div>
                      <div style="font-size:10px; color:var(--text-secondary); display:flex; gap:8px;">
                          <span style="background:rgba(255,255,255,0.1); padding:2px 8px;
                              border-radius:4px;">Goal: ${goalTarget}</span>
                          <span style="background:var(--red-whisper); color:var(--red-core);
                              padding:2px 8px; border-radius:4px; font-weight:700;">+${xpReward} XP</span>
                      </div>
                  </div>
                  <div style="padding:4px 12px; border-radius:12px; font-size:11px; font-weight:900;
                      background:${allCompleted ? 'var(--green-soft)' : 'var(--red-whisper)'};
                      color:${allCompleted ? 'var(--green)' : 'var(--red-core)'};">
                      ${completedTeams.length}/${targetTeams.length} DONE</div>
              </div>
  
              <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr));
                  gap:10px; margin-bottom:20px;">
                  ${targetTeams.map(team => {
                      const done = completedTeams.includes(team);
                      const tp   = progress[team] || 0;
                      const pct  = goalTarget ? Math.min(100, (tp / goalTarget) * 100) : 0;
                      const tc   = teamColor(team);
                      return `
                          <div onclick="window.showTeamActionModal('${mid}','${team}')"
                              style="padding:12px; background:${done ? 'var(--green-soft)' : 'rgba(255,255,255,0.02)'};
                              border:1px solid ${done ? 'var(--green-border)' : 'var(--border-subtle)'};
                              border-left:3px solid ${done ? 'var(--green)' : tc};
                              border-radius:8px; cursor:pointer; transition:all 0.2s;"
                              onmouseenter="this.style.transform='translateY(-2px)'"
                              onmouseleave="this.style.transform='translateY(0)'">
                              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                  <span style="font-size:11px; font-weight:800; color:${tc};">
                                      ${team.replace('Team ', '')}</span>
                                  <span style="font-size:12px;">${done ? '✅' : '⚙️'}</span>
                              </div>
                              <div class="pbar" style="height:4px; background:rgba(255,255,255,0.05); margin-bottom:6px;">
                                  <div class="pfill ${done ? 'green' : ''}"
                                      style="width:${pct}%; ${!done ? 'background:' + tc : ''}"></div>
                              </div>
                              <div style="font-size:9px; color:var(--text-ghost); text-align:right;">${tp}/${goalTarget}</div>
                          </div>`;
                  }).join('')}
              </div>
  
              <div style="display:flex; gap:10px; border-top:1px solid var(--border-subtle); padding-top:16px;">
                  <button onclick="window.adminApproveAllTeams('${mid}')" class="btn-outline"
                      style="flex:1; border-color:var(--green); color:var(--green);">✅ Approve All</button>
                  <button onclick="window.adminCancelMission('${mid}')" class="btn-outline"
                      style="flex:1; border-color:var(--fail); color:var(--fail);">✕ Cancel</button>
              </div>
          </div>`;
  }
  
  // ==================== MISSION ACTION MODAL (single definition) ====================
  
  function showTeamActionModal(missionId, teamName) {
      document.querySelectorAll('.admin-confirm-modal').forEach(m => m.remove());
  
      const modal = document.createElement('div');
      modal.className = 'admin-confirm-modal spy-modal-overlay';
      modal.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.9); z-index:9999999;
          display:flex; align-items:center; justify-content:center; padding:20px;
          backdrop-filter:blur(8px); animation:fadeIn 0.2s ease;`;
  
      modal.innerHTML = `
          <div class="glass-card" style="border:1px solid var(--purple-core); padding:25px;
              width:100%; max-width:400px; text-align:center;
              box-shadow:0 0 40px rgba(124,58,237,0.2);" onclick="event.stopPropagation()">
              <h3 style="color:#fff; margin:0 0 10px; font-family:'Orbitron',sans-serif;">Manage Team Status</h3>
              <p style="color:var(--text-muted); font-size:13px; margin-bottom:24px;">
                  Action for <strong style="color:${teamColor(teamName)}">${teamName.replace('Team ', '')}</strong></p>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                  <button onclick="window.executeTeamFailure('${missionId}','${teamName}');
                      this.closest('.admin-confirm-modal').remove();" style="padding:16px;
                      background:rgba(255,68,68,0.1); border:1px solid var(--fail); border-radius:8px;
                      color:var(--fail); cursor:pointer; font-weight:800; transition:all 0.2s;">
                      ❌ FAIL TEAM
                      <div style="font-size:9px; font-weight:normal; opacity:0.8; margin-top:6px;">No XP Awarded</div>
                  </button>
                  <button onclick="window.executeTeamApproval('${missionId}','${teamName}');
                      this.closest('.admin-confirm-modal').remove();" style="padding:16px;
                      background:rgba(0,255,136,0.1); border:1px solid var(--green); border-radius:8px;
                      color:var(--green); cursor:pointer; font-weight:800; transition:all 0.2s;">
                      ✅ APPROVE
                      <div style="font-size:9px; font-weight:normal; opacity:0.8; margin-top:6px;">Award XP</div>
                  </button>
              </div>
              <button onclick="this.closest('.admin-confirm-modal').remove()"
                  class="btn-ghost" style="margin-top:20px; width:100%;">Cancel / Close</button>
          </div>`;
  
      modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
      document.body.appendChild(modal);
  }
  window.showTeamActionModal = showTeamActionModal;
  
  // ==================== MISSION ACTIONS (single definitions) ====================
  
  async function executeTeamApproval(missionId, teamName) {
      Loading.show();
      try {
          const res = await Api.call('completeTeamMission', {
              missionId, team: teamName, agentNo: STATE.agentNo, sessionToken: STATE.adminSession
          }, { dedupe: false, cache: false });
  
          if (res.success) {
              showToast(`✅ ${teamName} approved! +${res.xpAwarded || 5} XP`, 'success');
              Api.invalidate();
              loadActiveTeamMissions($('admin-panel-body'));
              if (typeof loadDashboard === 'function') loadDashboard();
          } else {
              showToast('❌ ' + (res.error || 'Failed to approve'), 'error');
          }
      } catch (e) {
          showToast('❌ Error: ' + e.message, 'error');
      } finally {
          Loading.hide();
      }
  }
  
  async function executeTeamFailure(missionId, teamName) {
      if (!confirm(`⚠️ Confirm FAIL for ${teamName}?\nThey will receive 0 XP for this mission.`)) return;
      Loading.show();
      try {
          const res = await Api.call('failTeamMission', {
              missionId, team: teamName, agentNo: STATE.agentNo, sessionToken: STATE.adminSession
          }, { dedupe: false, cache: false });
  
          if (res.success) {
              showToast(`🚫 ${teamName} marked as FAILED.`, 'info');
              loadActiveTeamMissions($('admin-panel-body'));
          } else {
              showToast('❌ ' + (res.error || 'Failed to update status'), 'error');
          }
      } catch (e) {
          showToast('❌ Error: ' + e.message, 'error');
      } finally {
          Loading.hide();
      }
  }
  
  async function adminApproveAllTeams(missionId) {
      if (!confirm('Approve mission for ALL remaining teams? This will award XP to all.')) return;
      Loading.show();
      try {
          const res = await Api.call('getTeamMissions', { status: 'active', week: STATE.week }, { cache: false });
          const mission = (res.missions || []).find(m => getMissionId(m) === missionId);
  
          if (!mission) { showToast('❌ Mission not found', 'error'); return; }
  
          const targetTeams    = mission.targetTeams || mission.target_teams || [];
          const completedTeams = mission.completedTeams || mission.completed_teams || [];
          const remaining      = targetTeams.filter(t => !completedTeams.includes(t));
  
          if (remaining.length === 0) { showToast('All teams already approved!', 'info'); return; }
  
          let ok = 0;
          for (const team of remaining) {
              try {
                  const r = await Api.call('completeTeamMission', {
                      missionId, team, agentNo: STATE.agentNo, sessionToken: STATE.adminSession
                  }, { dedupe: false, cache: false });
                  if (r.success) ok++;
              } catch (e) { console.error(`Failed to approve ${team}:`, e); }
          }
  
          showToast(`✅ Approved ${ok}/${remaining.length} teams`, 'success');
          Api.invalidate();
          loadActiveTeamMissions($('admin-panel-body'));
      } catch (e) {
          showToast('❌ Error: ' + e.message, 'error');
      } finally {
          Loading.hide();
      }
  }
  
  async function adminCancelMission(missionId) {
      if (!confirm('⚠️ Cancel and delete this mission?')) return;
      Loading.show();
      try {
          const res = await Api.call('cancelTeamMission', {
              missionId, agentNo: STATE.agentNo, sessionToken: STATE.adminSession
          }, { dedupe: false, cache: false });
  
          if (res.success) {
              showToast('✅ Mission cancelled', 'success');
              Api.invalidate();
              loadActiveTeamMissions($('admin-panel-body'));
          } else {
              showToast('❌ ' + (res.error || 'Failed'), 'error');
          }
      } catch (e) {
          showToast('❌ Error: ' + e.message, 'error');
      } finally {
          Loading.hide();
      }
  }
  
  // Single window export block
  window.executeTeamApproval  = executeTeamApproval;
  window.executeTeamFailure   = executeTeamFailure;
  window.adminApproveAllTeams = adminApproveAllTeams;
  window.adminCancelMission   = adminCancelMission;
  
  // ==================== TAB: VERIFICATION CENTER ====================
  
  async function renderWeekConfirmation(container) {
      if (!container) container = $('admin-panel-body');
      if (!container) return;
  
      container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted);">⏳ Verifying agent protocols...</div>';
  
      try {
          const summary = await Api.call('getWeeklySummary', { week: STATE.week }, { cache: false });
          const teams = summary.teams || {};
  
          let html = `
              <div style="margin-bottom:24px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                      <h4 style="color:#fff; font-family:'Orbitron',sans-serif; letter-spacing:1px; margin:0;">
                          📋 VERIFICATION CENTER</h4>
                      <p style="color:var(--text-muted); font-size:11px; margin-top:4px;">Approve weekend protocols</p>
                  </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:16px;">`;
  
          Object.keys(CONFIG.TEAMS).forEach(teamName => {
              const info = teams[teamName] || {};
              const tc   = teamColor(teamName);
              const att  = info.attendanceConfirmed;
              const pol  = info.policeConfirmed;
  
              const statusBtn = (key, current, val, label, color) => `
                  <button onclick="window.smartUpdateStatus('${teamName}','${key}',${val})"
                      style="flex:1; padding:10px; border:1px solid ${color}; border-radius:6px;
                      background:${current === (val === true || val === 'true') ? color : 'transparent'};
                      color:${current === (val === true || val === 'true') ? (color === 'var(--green)' ? '#000' : '#fff') : color};
                      font-weight:800; font-size:10px; cursor:pointer; transition:all 0.2s;">${label}</button>`;
  
              html += `
                  <div class="glass-card" style="padding:20px; border-left:4px solid ${tc};">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                          <span style="color:${tc}; font-weight:800; font-size:14px;">
                              ${teamEmoji(teamName)} ${teamName.replace('Team ', '')}</span>
                          <span style="font-size:11px; font-weight:900; font-family:'Share Tech Mono',monospace;
                              color:var(--text-muted);">${fmt(info.teamXP || 0)} XP</span>
                      </div>
                      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                          <div style="background:rgba(0,0,0,0.4); padding:16px; border-radius:8px;
                              border:1px solid var(--border-subtle); text-align:center;">
                              <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;
                                  letter-spacing:2px; margin-bottom:12px;">Attendance</div>
                              <div style="display:flex; gap:8px;">
                                  ${statusBtn('attendanceConfirmed', att, true, 'PASS', 'var(--green)')}
                                  ${statusBtn('attendanceConfirmed', att, false, 'FAIL', 'var(--fail)')}
                              </div>
                          </div>
                          <div style="background:rgba(0,0,0,0.4); padding:16px; border-radius:8px;
                              border:1px solid var(--border-subtle); text-align:center;">
                              <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;
                                  letter-spacing:2px; margin-bottom:12px;">Police Report</div>
                              <div style="display:flex; gap:8px;">
                                  ${statusBtn('policeConfirmed', pol, true, 'PASS', 'var(--green)')}
                                  ${statusBtn('policeConfirmed', pol, false, 'FAIL', 'var(--fail)')}
                              </div>
                          </div>
                      </div>
                  </div>`;
          });
  
          html += `</div>
              <div style="margin-top:32px; padding-top:24px; border-top:1px dashed var(--border-light);">
                  <button onclick="window.toggleResultsRelease()" class="btn-red"
                      style="background:linear-gradient(135deg, var(--gold-core), #b8860b); color:#000;">
                      📢 ${summary.resultsReleased ? 'HIDE WEEKLY RESULTS' : 'PUBLISH WEEKLY RESULTS'}
                  </button>
                  <p style="color:var(--text-ghost); font-size:10px; text-align:center; margin-top:12px;
                      text-transform:uppercase; letter-spacing:1px;">
                      Ensure all teams are verified before publishing.</p>
              </div>`;
  
          container.innerHTML = html;
      } catch (e) {
          container.innerHTML = `<div style="text-align:center; color:var(--fail); padding:40px;">
              Failed to load Verification Center.</div>`;
      }
  }
  window.renderWeekConfirmation = renderWeekConfirmation;
  
  async function smartUpdateStatus(team, key, value) {
      Loading.show();
      try {
          const res = await Api.call('updateTeamStatus', {
              team, key, value, sessionToken: STATE.adminSession
          }, { dedupe: false, cache: false });
          if (res.success) {
              showToast('Status Updated', 'success');
              renderWeekConfirmation($('admin-panel-body'));
          } else {
              showToast('Update failed: ' + (res.error || ''), 'error');
          }
      } catch (e) { showToast('Update failed', 'error'); }
      finally { Loading.hide(); }
  }
  window.smartUpdateStatus = smartUpdateStatus;
  
  // TODO: Implement this function
  async function toggleResultsRelease() {
      Loading.show();
      try {
          const res = await Api.call('toggleResultsRelease', {
              week: STATE.week, agentNo: STATE.agentNo, sessionToken: STATE.adminSession
          }, { dedupe: false, cache: false });
          if (res.success) {
              showToast(res.released ? '📢 Results Published!' : '🔒 Results Hidden', 'success');
              renderWeekConfirmation($('admin-panel-body'));
          } else {
              showToast('Failed: ' + (res.error || ''), 'error');
          }
      } catch (e) { showToast('Error: ' + e.message, 'error'); }
      finally { Loading.hide(); }
  }
  window.toggleResultsRelease = toggleResultsRelease;
  
  // ==================== TAB: SOTD ====================
  
  async function renderAdminSOTD(container) {
      container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted);">📡 Accessing Audio Database...</div>';
      const todayKST = getKSTDateString();
  
      let current = null;
      try {
          const res = await Api.call('getSongOfDay', { date: todayKST }, { cache: false });
          if (res.success && res.song) current = res.song;
      } catch (e) { /* no song yet */ }
  
      container.innerHTML = `
          <div class="archive-card" style="border-top:3px solid var(--purple-core); margin-bottom:24px;">
              <div style="font-size:14px; font-weight:900; color:var(--purple-mid);
                  font-family:'Orbitron',sans-serif; letter-spacing:1px; margin-bottom:20px;">🎵 SOTD PROTOCOL</div>
  
              <div style="background:rgba(0,0,0,0.4); border:1px solid var(--border-subtle);
                  padding:16px; border-radius:8px; margin-bottom:24px;">
                  <div style="font-size:10px; color:var(--text-ghost); letter-spacing:2px;
                      text-transform:uppercase; margin-bottom:8px;">Current Status (KST: ${todayKST})</div>
                  ${current ? `
                      <div style="color:#fff; font-size:14px; font-weight:800; margin-bottom:4px;">${current.title}</div>
                      <div style="color:var(--text-secondary); font-size:11px;">${current.artist} •
                          <span style="color:var(--gold-core); font-weight:800;">${current.xpReward} XP</span></div>
                  ` : `<div style="color:var(--courage-amber); font-weight:800; font-size:12px;">
                      ⚠️ No track designated for today.</div>`}
              </div>
  
              <div style="display:grid; gap:16px;">
                  <div>
                      <label class="label-tag" style="display:block; margin-bottom:6px;">Song Title</label>
                      <input type="text" id="admin-sotd-title" class="input-field"
                          placeholder="e.g. Run BTS" value="${current?.title || ''}">
                  </div>
                  <div>
                      <label class="label-tag" style="display:block; margin-bottom:6px;">Artist</label>
                      <input type="text" id="admin-sotd-artist" class="input-field"
                          placeholder="e.g. BTS" value="${current?.artist || 'BTS'}">
                  </div>
                  <div>
                      <label class="label-tag" style="display:block; margin-bottom:6px;">YouTube Link</label>
                      <input type="text" id="admin-sotd-link" class="input-field"
                          placeholder="Paste URL here..." value="${current?.youtubeId || ''}">
                  </div>
                  <div>
                      <label class="label-tag" style="display:block; margin-bottom:6px;">Intel / Hint</label>
                      <textarea id="admin-sotd-hint" class="input-field"
                          style="min-height:80px; resize:vertical;">${current?.hint || ''}</textarea>
                  </div>
                  <div>
                      <label class="label-tag" style="display:block; margin-bottom:6px;">XP Reward</label>
                      <input type="number" id="admin-sotd-xp" class="input-field"
                          value="${current?.xpReward || '1'}">
                  </div>
                  <button onclick="window.submitAdminSOTD()" class="btn-red" style="margin-top:12px;
                      background:linear-gradient(135deg, var(--purple-core), #5a1f99);">
                      ${current ? '💾 UPDATE DATABASE' : '🚀 PUBLISH TRACK'}</button>
              </div>
          </div>`;
  }
  window.renderAdminSOTD = renderAdminSOTD;
  
  async function submitAdminSOTD() {
      const title   = $('admin-sotd-title')?.value.trim();
      const artist  = $('admin-sotd-artist')?.value.trim();
      const rawLink = $('admin-sotd-link')?.value.trim();
      const hint    = $('admin-sotd-hint')?.value.trim();
      const xp      = $('admin-sotd-xp')?.value;
  
      if (!title || !rawLink || !hint) { showToast('Please fill all required fields', 'error'); return; }
  
      const youtubeId = extractYouTubeId(rawLink);
      if (!youtubeId) { showToast('Invalid YouTube URL', 'error'); return; }
  
      Loading.show();
      try {
          const res = await Api.call('setSongOfDay', {
              agentNo: STATE.agentNo, sessionToken: STATE.adminSession,
              date: getKSTDateString(), title, artist: artist || 'BTS',
              youtubeId, hint, xpReward: parseInt(xp) || 1
          }, { dedupe: false, cache: false });
  
          if (res.success) {
              showToast('✅ Track Published!', 'success');
              Api.invalidate('getSongOfDay');
              setTimeout(() => renderAdminSOTD($('admin-panel-body')), 500);
          } else {
              showToast(res.error || 'Publish Failed', 'error');
          }
      } catch (e) { showToast('System Error', 'error'); }
      finally { Loading.hide(); }
  }
  window.submitAdminSOTD = submitAdminSOTD;
  
  // ==================== TAB: LEAVES ====================
  
  async function loadLeavesAdmin(container) {
      if (!container) container = $('admin-panel-body');
      container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted);">⏳ Checking Ghost Protocol records...</div>';
  
      try {
          const res = await Api.call('getAgentsOnLeave', { week: STATE.week }, { cache: false });
          const agents = res.agents || [];
  
          if (agents.length === 0) {
              container.innerHTML = `
                  <div style="text-align:center; padding:40px; background:rgba(0,255,102,0.05);
                      border:1px dashed var(--green-border); border-radius:12px;">
                      <div style="font-size:32px; margin-bottom:12px;">✅</div>
                      <p style="color:var(--green); font-weight:800; font-size:12px;">Zero Agents on Leave</p>
                      <p style="color:var(--text-muted); font-size:10px; margin-top:6px;">
                          All personnel active for ${STATE.week}.</p>
                  </div>`;
              return;
          }
  
          container.innerHTML = `
              <div style="margin-bottom:20px;">
                  <h4 style="color:#fff; font-family:'Orbitron',sans-serif; margin:0;">🛑 GHOST PROTOCOL REGISTRY</h4>
                  <p style="color:var(--text-muted); font-size:10px; margin-top:4px;">
                      Agents currently on leave (${agents.length})</p>
              </div>
              <div style="display:flex; flex-direction:column; gap:12px;">
                  ${agents.map(a => `
                      <div class="glass-card" style="padding:16px; border-left:3px solid ${teamColor(a.team)};
                          display:flex; justify-content:space-between; align-items:center;">
                          <div>
                              <div style="color:#fff; font-weight:800; font-size:13px; margin-bottom:4px;">
                                  ${sanitize(a.name)}</div>
                              <div style="color:var(--text-secondary); font-size:10px;
                                  font-family:'Share Tech Mono',monospace;">
                                  ID: ${sanitize(a.agentNo)} | ${sanitize(a.team)}</div>
                              <div style="color:var(--text-ghost); font-size:9px; margin-top:6px;
                                  text-transform:uppercase; letter-spacing:1px;">
                                  Applied: ${new Date(a.created_at || a.timestamp || Date.now()).toLocaleDateString()}</div>
                          </div>
                          <button onclick="window.adminRevokeLeave('${a.agentNo}')" class="btn-outline"
                              style="border-color:var(--fail); color:var(--fail); padding:8px 16px; font-size:10px;">
                              REVOKE</button>
                      </div>
                  `).join('')}
              </div>`;
      } catch (e) {
          container.innerHTML = `<div style="text-align:center; color:var(--fail); padding:40px;">
              Failed to load leave records.<br>${e.message}</div>`;
      }
  }
  
  async function adminRevokeLeave(targetAgentNo) {
      if (!confirm(`⚠️ Revoke leave for ${targetAgentNo}?`)) return;
      Loading.show();
      try {
          const result = await Api.call('cancelLeave', {
              agentNo: targetAgentNo, week: STATE.week
          }, { dedupe: false, cache: false });
  
          if (result.success) {
              showToast('✅ Leave revoked', 'success');
              loadLeavesAdmin($('admin-panel-body'));
          } else {
              showToast('❌ Failed: ' + result.error, 'error');
          }
      } catch (e) { showToast('Error: ' + e.message, 'error'); }
      finally { Loading.hide(); }
  }
  window.adminRevokeLeave = adminRevokeLeave;
  
  // ==================== TAB: HISTORY ====================
  
  async function loadMissionHistory(container) {
      if (!container) container = $('admin-panel-body');
      container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted);">⏳ Accessing Archives...</div>';
  
      try {
          const res = await Api.call('getTeamMissions', { status: 'all', week: STATE.week }, { cache: false });
          const missions = (res.missions || []).filter(m => m.status !== 'active');
  
          if (missions.length > 0) {
              container.innerHTML = `
                  <div style="margin-bottom:20px;">
                      <h4 style="color:#fff; font-family:'Orbitron',sans-serif; margin:0;">📜 DECLASSIFIED ARCHIVES</h4>
                      <p style="color:var(--text-muted); font-size:10px; margin-top:4px;">
                          Past operations for ${STATE.week} (${missions.length})</p>
                  </div>
                  <div style="display:flex; flex-direction:column; gap:12px;">
                      ${missions.map(m => `
                          <div class="archive-card" style="padding:16px;
                              border-left:3px solid ${m.status === 'completed' ? 'var(--green)' : 'var(--text-ghost)'};">
                              <div style="display:flex; justify-content:space-between; align-items:center;">
                                  <div style="display:flex; align-items:center; gap:12px;">
                                      <div style="font-size:24px; opacity:0.7;">
                                          ${CONFIG.MISSION_TYPES?.[m.type]?.icon || '🎯'}</div>
                                      <div>
                                          <div style="color:#fff; font-weight:800; font-size:13px; margin-bottom:4px;">
                                              ${sanitize(m.title)}</div>
                                          <div style="color:var(--text-secondary); font-size:10px;">
                                              Target Teams: ${(m.targetTeams || m.target_teams || []).length}</div>
                                      </div>
                                  </div>
                                  <div style="padding:6px 12px; border-radius:12px; font-size:9px; font-weight:800;
                                      text-transform:uppercase; letter-spacing:1px;
                                      background:${m.status === 'completed' ? 'var(--green-soft)' : 'rgba(255,255,255,0.05)'};
                                      color:${m.status === 'completed' ? 'var(--green)' : 'var(--text-muted)'};
                                      border:1px solid ${m.status === 'completed' ? 'var(--green-border)' : 'var(--border-subtle)'};">
                                      ${m.status || 'unknown'}</div>
                              </div>
                          </div>
                      `).join('')}
                  </div>`;
          } else {
              container.innerHTML = `
                  <div style="text-align:center; padding:60px 20px; background:rgba(255,255,255,0.02);
                      border:1px dashed var(--border-light); border-radius:12px;">
                      <div style="font-size:48px; margin-bottom:16px; opacity:0.4;">🗄️</div>
                      <div style="color:#fff; font-weight:800; font-size:14px; margin-bottom:8px;">Archive Empty</div>
                      <p style="color:var(--text-muted); font-size:11px; margin:0;">
                          No completed or cancelled missions for this week.</p>
                  </div>`;
          }
      } catch (e) {
          container.innerHTML = `<div style="text-align:center; color:var(--fail); padding:40px;">
              Failed to load history.<br>${e.message}</div>`;
      }
  }
  
  // ==================== TAB: SYSTEM CONTROLS ====================
  
  function renderAdminSystemTab(container) {
      if (!container) container = $('admin-panel-body');
      if (!container) return;
  
      container.innerHTML = `
          <div class="archive-card" style="margin-bottom:24px; border-top:3px solid var(--red-core);">
              <div style="font-size:14px; font-weight:900; color:var(--red-core);
                  font-family:'Orbitron',sans-serif; letter-spacing:1px; margin-bottom:20px;">⚙️ SYSTEM CONTROLS</div>
              <div style="display:flex; flex-direction:column; gap:12px;">
                  <button onclick="window.adminTriggerSync()" class="btn-red"
                      style="padding:16px; font-size:11px; text-align:left; display:flex; justify-content:space-between;">
                      <span>⟳ FORCE DATABASE SYNC</span>
                      <span style="opacity:0.6;">Executes Last.fm checks</span></button>
                  <button onclick="window.adminCheckSync()" class="btn-outline"
                      style="padding:16px; font-size:11px; text-align:left; display:flex; justify-content:space-between;
                      border-color:var(--border-light); color:#fff;">
                      <span>📊 CHECK SYNC STATUS</span>
                      <span style="color:var(--text-muted);">View current progress</span></button>
                  <button onclick="window.adminFinalizeWeek()" class="btn-outline"
                      style="padding:16px; font-size:11px; text-align:left; display:flex; justify-content:space-between;
                      border-color:var(--courage-amber); color:var(--courage-amber);">
                      <span>🏁 FINALIZE WEEK</span>
                      <span style="opacity:0.8;">Locks missions & issues warnings</span></button>
                  <button onclick="window.adminGenerateUnits()" class="btn-outline"
                      style="padding:16px; font-size:11px; text-align:left; display:flex; justify-content:space-between;
                      border-color:var(--wave-foam); color:var(--wave-foam);">
                      <span>🔄 GENERATE NEXT WEEK UNITS</span>
                      <span style="opacity:0.8;">Assigns new tracks to teams</span></button>
              </div>
              <div style="margin-top:24px; padding-top:16px; border-top:1px dashed var(--border-light); text-align:center;">
                  <button onclick="window.adminExitMode()" style="background:none; border:1px solid var(--fail);
                      color:var(--fail); padding:8px 24px; border-radius:8px; font-size:10px;
                      font-weight:800; cursor:pointer;">⏻ EXIT ADMIN MODE</button>
              </div>
          </div>`;
  }
  window.renderAdminSystemTab = renderAdminSystemTab;
  
  // TODO: Implement these system actions
  window.adminTriggerSync    = window.adminTriggerSync    || function() { showToast('Not yet implemented', 'info'); };
  window.adminCheckSync      = window.adminCheckSync      || function() { showToast('Not yet implemented', 'info'); };
  window.adminFinalizeWeek   = window.adminFinalizeWeek   || function() { showToast('Not yet implemented', 'info'); };
  window.adminGenerateUnits  = window.adminGenerateUnits  || function() { showToast('Not yet implemented', 'info'); };
  // =============================================
  // ██████  148 PROTOCOL (RM's Strategic Dashboard)
  // =============================================
  
  // Ensure RM Config exists
  const RM_CONFIG = {
    IMAGE: 'https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/6c9cf38a7be372187ebd244d19a5e0357d4983c8/team%20pfps/baed0eb48e6ac22807df156ce76d8b4f.jpg',
    QUOTES: [
      "No agent left behind. Check the list.",
      "Efficiency is key. Focus on the gaps.",
      "I've identified who needs support.",
      "Teamwork makes the dream work.",
      "The numbers don't lie. Stream smart.",
      "Every stream is a step closer.",
      "148 streams of consciousness.",
      "Calculate. Execute. Dominate.",
      "Your daily mission is clear.",
      "We're not just streaming. We're building.",
      "Focus on what matters most today.",
      "Small consistent actions win wars.",
    ],
  };
  
  function getTodoKey() {
    return `p148_${STATE.agentNo}_${new Date().toDateString()}`;
  }
  
  function getSavedTodos() {
    try {
      return JSON.parse(localStorage.getItem(getTodoKey()) || '{}');
    } catch {
      return {};
    }
  }
  
  async function render148Protocol() {
    const container = $('protocolContent'); // Ensure your HTML uses <div id="protocolContent"></div>
    if (!container) return;
  
    showPageLoading(container);
  
    const team = STATE.data?.agent?.profile?.team || 'Unknown';
    const week = STATE.week;
  
    try {
      // 1. FETCH DATA (Parallel)
      const [goalsData, album2xData] = await Promise.all([
        Api.call('getGoalsProgress', { week }, { cache: true, ttl: 60_000 }),
        Api.call('getAlbum2xStatus', { week, team, agentNo: STATE.agentNo }, { cache: true, ttl: 60_000 }),
      ]);
  
      const trackGoals = goalsData.trackGoals || {};
      const albumGoals = goalsData.albumGoals || {};
      
      // 2. MATH & LOGIC (From your old app)
      const teamMembers = STATE.data?.team?.sideMissionStats?.membersTotal || 10;
      const activeEst = Math.ceil(teamMembers * 0.6) || 1; // 60% active estimate
      
      const daysLeft = getDaysRemaining(week);
      const safeDays = Math.max(1, daysLeft);
      const isUrgent = daysLeft <= 1;
  
      const tasks = [];
      let totalNeeded = 0;
  
      // Process Track & Album Goals
      const processGoals = (goals, type) => {
        Object.entries(goals).forEach(([name, info]) => {
          const current = info.teams?.[team]?.current || 0;
          const goal = info.goal || 0;
          
          if (current < goal) {
            const gap = goal - current;
            // RM's Fair Share Formula
            const myShare = Math.ceil(gap / activeEst) + 1;
            const dailyTarget = Math.ceil(myShare / safeDays);
            
            tasks.push({
              type, 
              name, 
              total: myShare,
              daily: dailyTarget,
              gap, 
              teamCurrent: current, 
              teamGoal: goal,
            });
            totalNeeded += myShare;
          }
        });
      };
  
      processGoals(trackGoals, '🎵');
      processGoals(albumGoals, '💿');
      tasks.sort((a, b) => b.gap - a.gap); // Sort by biggest gap first
  
      // 2X Incomplete Members List (Who needs help)
      const team2x = album2xData?.teams?.[team] || {};
      const pending2x = (team2x.members || []).filter(m => !m.passed);
  
      // Daily Checkbox State
      // Auto-ticked from streaming-derived stats; localStorage only used for the proof checkbox.
      const savedTodo = getSavedTodos();
      const today = getKSTDateString();
      const quote = RM_CONFIG.QUOTES[Math.floor(Math.random() * RM_CONFIG.QUOTES.length)];
      const sm = STATE.data?.agent?.sideMissions;
      const unitPassed = !!STATE.data?.agent?.arirangUnit?.passed;

      // Arirang 2X daily completion derived from per-track dailyGrid.
      const dailyGrid = STATE.data?.agent?.album2xStatus?.dailyGrid?.[today] || {};
      const today2xPassedCount = Object.values(dailyGrid).filter(c => c?.passed).length;
      const is2xDailyAllPassed = today2xPassedCount >= 14;

      // Only checkbox we still allow manual ticking for.
      const isProofDone = !!savedTodo['t148_proof'];
  
      // Threat Level Logic
      let threat = 'LOW', tColor = 'var(--green)', tIcon = '🟢';
      if (isUrgent) { threat = 'CRITICAL'; tColor = 'var(--red-core)'; tIcon = '🔴'; }
      else if (daysLeft <= 2) { threat = 'HIGH'; tColor = 'var(--courage-amber)'; tIcon = '🟡'; }
      else if (totalNeeded > 100) { threat = 'ELEVATED'; tColor = 'var(--courage-amber)'; tIcon = '🟠'; }
  
      // ==========================================
      // 3. BUILD THE UI (ARIRANG THEME)
      // ==========================================
      
      let html = `
        <!-- RM Briefing Header -->
        <div class="archive-card" style="margin-bottom:24px; border-top:3px solid var(--purple-core); background:linear-gradient(135deg, rgba(167, 139, 250, 0.05), var(--bg-panel));">
          <div style="display:flex; gap:16px; align-items:flex-start;">
            <img src="${RM_CONFIG.IMAGE}" style="width:48px; height:48px; border-radius:50%; border:2px solid var(--purple-core); object-fit:cover; flex-shrink:0; box-shadow:0 0 15px rgba(167, 139, 250, 0.4);" onerror="this.outerHTML='<div style=\\'width:48px;height:48px;border-radius:50%;background:var(--bg-panel);border:2px solid var(--purple-core);display:flex;align-items:center;justify-content:center;font-size:24px;\\'>🧠</div>'">
            
            <div style="flex:1;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div>
                  <div style="font-size:14px; font-weight:900; text-transform:uppercase; letter-spacing:1px; color:var(--purple-mid); font-family:'Orbitron', sans-serif;">THE 148 PROTOCOL</div>
                  <div style="font-size:9px; color:var(--text-muted); text-transform:uppercase; letter-spacing:2px;">Strategic Analysis Unit</div>
                </div>
                <button onclick="show148Info()" style="width:28px; height:28px; background:rgba(255,255,255,0.05); border:1px solid var(--border-light); color:var(--text-muted); font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; border-radius:6px; transition:all 0.2s;">?</button>
              </div>
              
              <div style="padding:10px 14px; background:rgba(167, 139, 250, 0.05); border-left:2px solid var(--purple-core); font-size:11px; color:var(--text-secondary); font-style:italic; border-radius:4px; line-height:1.5;">
                "${quote}"
              </div>
            </div>
          </div>
        </div>
  
        <!-- Threat & Stats Board -->
        <div class="glass-card" style="padding:16px; margin-bottom:24px;">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
            <span style="font-size:18px;">${tIcon}</span>
            <div style="flex:1;">
              <div style="font-size:9px; color:var(--text-muted); text-transform:uppercase; letter-spacing:2px;">Threat Level</div>
              <div style="font-size:13px; font-weight:900; color:${tColor}; letter-spacing:1px;">${threat}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:18px; font-weight:900; font-family:'Share Tech Mono', monospace; color:${daysLeft <= 2 ? 'var(--red-core)' : '#fff'};">${daysLeft}D</div>
              <div style="font-size:8px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px;">REMAINING</div>
            </div>
          </div>
  
          <div class="grid-3">
            <div style="text-align:center; padding:12px 8px; background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px;">
              <div style="font-size:18px; font-weight:900; font-family:'Share Tech Mono', monospace; color:var(--purple-mid);">${activeEst}</div>
              <div style="font-size:8px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-top:4px;">Active Agents</div>
            </div>
            <div style="text-align:center; padding:12px 8px; background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px;">
              <div style="font-size:18px; font-weight:900; font-family:'Share Tech Mono', monospace; color:${daysLeft <= 2 ? 'var(--red-core)' : 'var(--green)'};">${daysLeft}</div>
              <div style="font-size:8px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-top:4px;">Days Left</div>
            </div>
            <div style="text-align:center; padding:12px 8px; background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px;">
              <div style="font-size:18px; font-weight:900; font-family:'Share Tech Mono', monospace; color:var(--courage-amber);">${totalNeeded}</div>
              <div style="font-size:8px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-top:4px;">Your Share</div>
            </div>
          </div>
        </div>
      `;
  
      // Pending 2X Members Alert
      if (pending2x.length > 0) {
        html += `
          <div style="padding:16px; background:var(--red-whisper); border:1px solid var(--red-border); margin-bottom:24px; border-radius:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:11px; font-weight:900; color:var(--red-core); letter-spacing:1px; text-transform:uppercase;">🚨 2X Incomplete</span>
              <span style="font-size:10px; padding:2px 8px; background:var(--red-core); color:#fff; border-radius:12px; font-weight:800;">${pending2x.length} LEFT</span>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:6px; max-height:100px; overflow-y:auto;">
              ${pending2x.map(m => `
                <span style="font-size:10px; padding:4px 10px; background:rgba(255,20,95,0.1); border:1px solid rgba(255,20,95,0.2); border-radius:6px; color:#fff;">
                  ✗ ${displayName(m.name)}
                </span>
              `).join('')}
            </div>
            <div style="font-size:9px; color:var(--text-muted); margin-top:10px; font-style:italic;">
              Check the GC. Someone might need playlist links or support.
            </div>
          </div>
        `;
      }
  
      // Daily Planner List
      html += `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--border-light);">
          <span style="font-size:11px; color:var(--purple-mid); text-transform:uppercase; letter-spacing:2px; font-weight:900;">📋 Personal Target</span>
          <span style="font-size:10px; color:var(--text-muted); font-family:'Share Tech Mono', monospace;">${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
      `;
  
      // Render Dynamic Goal Tasks
      if (tasks.length === 0) {
        html += `
          <div style="text-align:center; padding:30px; background:var(--green-soft); border:1px solid var(--green-border); border-radius:12px; margin-bottom:16px;">
            <div style="font-size:32px; margin-bottom:12px;">🎉</div>
            <div style="font-size:13px; font-weight:800; color:var(--green); text-transform:uppercase; letter-spacing:1px;">All Team Targets Cleared</div>
            <div style="font-size:10px; color:var(--text-muted); margin-top:6px;">Assist other agents with their missions.</div>
          </div>
        `;
      } else {
        // Today's personal daily scrobbles per track (from backend-exposed field)
        const todayDailyScrobbles = STATE.data?.agent?.todayTrackScrobbles || {};
        const DAILY_TARGET = 22; // track goal daily requirement

        html += tasks.map(task => {
          const id = `t148_${task.name.replace(/[^a-zA-Z0-9]/g, '')}`;
          const pct = task.teamGoal > 0 ? Math.min(100, (task.teamCurrent / task.teamGoal) * 100) : 0;
          
          const isUrgentTask = isUrgent || pct > 95;
          const dailyText = isUrgentTask 
              ? `<span style="color:var(--red-core); font-weight:900;">⚠️ PUSH NOW</span>` 
              : `<span style="color:var(--courage-amber); font-family:'Share Tech Mono', monospace;">${task.daily}/DAY</span>`;
          
          const label = `${task.type} <strong>${sanitize(task.name)}</strong> <span style="color:var(--text-muted);">×${task.total}</span> — ${dailyText}`;
          
          // Auto-tick if team goal is done OR if personal daily streams for this track reached DAILY_TARGET
          const personalTodayCount = Object.entries(todayDailyScrobbles).reduce((sum, [trackName, count]) => {
            // Normalize match: lowercase compare
            if (trackName.toLowerCase().includes(task.name.toLowerCase()) || task.name.toLowerCase().includes(trackName.toLowerCase())) {
              return sum + Number(count);
            }
            return sum;
          }, 0);
          const autoChecked = pct >= 100 || personalTodayCount >= DAILY_TARGET;
          
          return render148Task(id, label, autoChecked, pct, `${fmt(task.teamCurrent)}/${fmt(task.teamGoal)}`, false);
        }).join('');
      }
  
      // Static Daily Habits
      html += `
        <div style="margin-top:24px; padding-top:16px; border-top:1px dashed var(--border-light);">
          <div style="font-size:10px; color:var(--text-ghost); text-transform:uppercase; letter-spacing:2px; margin-bottom:12px;">Habits</div>
          ${render148Task('t148_2x', '💿 Complete Arirang 2X (28 streams)', is2xDailyAllPassed, Math.min(100, (today2xPassedCount / 14) * 100), `${today2xPassedCount}/14`, false)}
          ${render148Task('t148_unit', '⚡ Arirang Unit (25 streams)', unitPassed, undefined, undefined, false)}
          ${render148Task('t148_side', '🛡️ Side Missions (4 tracks)', !!sm?.todayAllPassed, undefined, undefined, false)}
          ${render148Task('t148_proof', '📸 Post Recents Proof in GC', isProofDone, undefined, undefined, true)}
        </div>
      `;
  
      container.innerHTML = html;

      // Refresh auto-ticks when the day changes (KST).
      schedule148DailyAutoRefresh();
    } catch (e) {
      showPageError(container, 'render148Protocol');
    }
  }

  function schedule148DailyAutoRefresh() {
      if (window.__148DailyAutoRefreshSet) return;
      window.__148DailyAutoRefreshSet = true;

      window.__148DailyAutoRefreshLastDate = window.__148DailyAutoRefreshLastDate || getKSTDateString();

      Timers.setInterval('148-daily-auto-refresh', () => {
          if (STATE.page !== 'protocol148') return;
          const todayNow = getKSTDateString();
          if (window.__148DailyAutoRefreshLastDate !== todayNow) {
              window.__148DailyAutoRefreshLastDate = todayNow;
              Api.invalidate();
              render148Protocol();
          }
      }, 60_000);
  }
  
  // =============================================
  // HELPER: Toggle Logic for Checkboxes
  // =============================================
  
  function toggle148Task(taskId, element) {
    if (!element) return;
  
    const saved = getSavedTodos();
    const newState = !saved[taskId];
    saved[taskId] = newState;
    localStorage.setItem(getTodoKey(), JSON.stringify(saved));
  
    if (typeof navigator.vibrate === 'function') navigator.vibrate(10);
  
    const checkbox = element.querySelector('.check-box');
    const textDiv = element.querySelector('.task-text');
  
    // Arirang Theme styling updates on click
    if (newState) {
      element.style.background = 'var(--green-soft)';
      element.style.borderColor = 'var(--green-border)';
      element.style.borderLeftColor = 'var(--green)';
      if (checkbox) {
        checkbox.textContent = '✓';
        checkbox.style.color = 'var(--green)';
        checkbox.style.borderColor = 'var(--green)';
        checkbox.style.background = 'rgba(0,255,102,0.1)';
      }
      if (textDiv) {
        textDiv.style.color = 'var(--text-muted)';
        textDiv.style.textDecoration = 'line-through';
      }
    } else {
      element.style.background = 'var(--bg-lifted)';
      element.style.borderColor = 'var(--border-subtle)';
      element.style.borderLeftColor = 'var(--text-muted)';
      if (checkbox) {
        checkbox.textContent = '';
        checkbox.style.color = 'transparent';
        checkbox.style.borderColor = 'var(--text-muted)';
        checkbox.style.background = 'transparent';
      }
      if (textDiv) {
        textDiv.style.color = '#fff';
        textDiv.style.textDecoration = 'none';
      }
    }
  }
  
  function render148Task(id, text, isChecked, progressPct, progressText, clickable = false) {
    const bg = isChecked ? 'var(--green-soft)' : 'var(--bg-lifted)';
    const border = isChecked ? 'var(--green-border)' : 'var(--border-subtle)';
    const leftBorder = isChecked ? 'var(--green)' : 'var(--text-muted)';
    const isClickable = !!clickable;
    const onClickAttr = isClickable ? `onclick="toggle148Task('${id}', this)"` : '';
    
    return `
      <div ${onClickAttr} style="
        display:flex; align-items:center; gap:14px; padding:16px; margin-bottom:8px;
        background:${bg}; border:1px solid ${border}; border-left:3px solid ${leftBorder};
        cursor:${isClickable ? 'pointer' : 'default'}; pointer-events:${isClickable ? 'auto' : 'none'}; transition:all 0.2s; border-radius:8px;
      ">
        <div class="check-box" style="
          width:24px; height:24px; flex-shrink:0;
          border:2px solid ${isChecked ? 'var(--green)' : 'var(--text-muted)'};
          background:${isChecked ? 'rgba(0,255,102,0.1)' : 'transparent'};
          display:flex; align-items:center; justify-content:center;
          color:${isChecked ? 'var(--green)' : 'transparent'}; font-size:14px; font-weight:900;
          border-radius:6px; transition:all 0.2s;
        ">${isChecked ? '✓' : ''}</div>
        
        <div style="flex:1; min-width:0;">
          <div class="task-text" style="font-size:12px; font-weight:600; color:${isChecked ? 'var(--text-muted)' : '#fff'}; ${isChecked ? 'text-decoration:line-through;' : ''} margin-bottom:4px;">
              ${text}
          </div>
          ${progressPct !== undefined ? `
            <div style="display:flex; align-items:center; gap:10px;">
              <div class="pbar" style="flex:1; height:4px; background:rgba(255,255,255,0.05);">
                <div class="pfill ${progressPct >= 100 ? 'green' : ''}" style="width:${progressPct}%; ${progressPct < 100 ? 'background:var(--red-core)' : ''}"></div>
              </div>
              <span style="font-size:10px; font-weight:800; font-family:'Share Tech Mono', monospace; color:${progressPct >= 100 ? 'var(--green)' : 'var(--text-secondary)'};">${progressText || ''}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
  
  window.toggle148Task = toggle148Task;
  
  // =============================================
  // ██████  INFO MODAL
  // =============================================
  
  function show148Info() {
    document.querySelectorAll('.spy-modal-overlay').forEach(e => e.remove());
    const modal = document.createElement('div');
    modal.className = 'spy-modal-overlay';
    modal.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:100000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(8px); animation:fadeIn 0.3s ease;`;
  
    modal.innerHTML = `
      <div style="background:var(--bg-panel); border:1px solid var(--purple-core); border-radius:16px; width:100%; max-width:380px; box-shadow:0 20px 50px rgba(167, 139, 250, 0.15); overflow:hidden;">
          
          <div style="padding:20px; background:var(--purple-whisper); border-bottom:1px solid var(--purple-border); display:flex; justify-content:space-between; align-items:center;">
              <div style="font-weight:900; color:var(--purple-mid); font-family:'Orbitron', sans-serif; letter-spacing:1px;">🧠 148 PROTOCOL LOGIC</div>
              <button onclick="this.closest('.spy-modal-overlay').remove()" style="background:none; border:none; color:var(--text-muted); font-size:24px; cursor:pointer; line-height:1;">×</button>
          </div>
          
          <div style="padding:24px;">
              <div style="background:rgba(255,255,255,0.03); border:1px dashed var(--border-light); border-radius:8px; padding:16px; margin-bottom:20px;">
                  <h4 style="color:var(--courage-amber); font-size:10px; font-weight:800; letter-spacing:1px; text-transform:uppercase; margin:0 0 10px 0;">📖 Example Breakdown:</h4>
                  
                  <div style="font-size:13px; color:#fff; font-weight:700; margin-bottom:12px;">
                      🎵 SWIM <span style="color:var(--green);">×163</span> — <span style="color:var(--courage-amber); font-family:'Share Tech Mono', monospace;">28/DAY</span>
                  </div>
  
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:11px;">
                      <div>
                          <span style="color:var(--green); font-weight:800;">×163 (Total)</span><br>
                          <span style="color:var(--text-secondary); line-height:1.5;">Your total week's fair share to clear the team gap.</span>
                      </div>
                      <div>
                          <span style="color:var(--courage-amber); font-weight:800;">28/day (Pace)</span><br>
                          <span style="color:var(--text-secondary); line-height:1.5;">How many you should do <strong>today</strong> to finish on time.</span>
                      </div>
                  </div>
              </div>
  
              <p style="color:var(--text-muted); font-size:12px; line-height:1.6; margin-bottom:16px;">
                  RM calculates these numbers based on how many <strong>active agents</strong> are helping and how many <strong>days</strong> are left in the week.
              </p>
  
              <ul style="padding-left:20px; margin:0; color:var(--text-secondary); font-size:12px; line-height:1.6;">
                  <li style="margin-bottom:10px;">
                      <strong style="color:#fff;">It's Dynamic:</strong> If the team streams hard today, your numbers for tomorrow will go <strong>DOWN</strong>! 📉
                  </li>
                  <li>
                      <strong style="color:#fff;">Your Checklist:</strong> Items auto-update from streaming stats. Only the <strong>Proof</strong> item can be ticked manually.
                  </li>
              </ul>
          </div>
          
          <div style="padding:16px 24px; border-top:1px solid var(--border-subtle);">
              <button onclick="this.closest('.spy-modal-overlay').remove()" style="width:100%; padding:14px; background:var(--purple-core); border:none; border-radius:8px; color:#000; font-weight:900; text-transform:uppercase; letter-spacing:1px; cursor:pointer;">
                  Protocol Understood
              </button>
          </div>
      </div>
    `;
  
    document.body.appendChild(modal);
  }
  window.show148Info = show148Info;
  
  
  // =============================================
  // ██████  GUIDE PAGE
  // =============================================
  
  // =============================================
// ██████  GUIDE PAGE
// =============================================

function renderGuidePage() {
  const container = $('guideContent');
  if (!container) return;

  const team = STATE.data?.agent?.profile?.team || 'Your Team';

  const sections = [
    ['🎯', 'What Is This Mission?', `This is a <strong style="color:var(--red-main);">weekly streaming battle</strong> for BTS' ARIRANG comeback. 7 teams compete by streaming on Spotify or Apple Music, tracked via Last.fm.<br><br><strong>Every week you must:</strong><br>• Track & Album Goals (team)<br>• Arirang 2X — every track 2x/day (personal)<br>• Arirang Unit — 2 team tracks, 25x each (personal)<br>• Side Missions — 4 tracks, 20x/week (personal)<br>• Attendance + Police Check`],

    // ── 7 TEAMS, 7 MISSIONS ──
    ['📊', '7 Teams — 7 Missions', `These are <strong style="color:var(--red-main);">team-wide targets</strong> for specific tracks and the full Arirang album. Unlike personal missions, these require the whole squad to work in sync.<br><br>
      <strong style="color:var(--red-main);">Intelligence Briefing:</strong><br><br>
      • <strong>Shared Progress:</strong> Every stream from every agent in your team fills the same progress bar. Once it hits 100%, the mission is secured.<br><br>
      • <strong>Priority Focus:</strong> Focus your energy <i>only</i> on the tracks listed in your Goals tab.<br><br>
      • <strong>The 148 Protocol:</strong> Since these are team goals, it can be hard to know how much <i>you</i> should do. Use the <strong style="color:var(--red-main);">148 Protocol</strong> page — it calculates your personal "Fair Share" daily based on the remaining gap and number of active agents.<br><br>
      • <strong>XP Reward:</strong> These missions provide the <strong style="color:#ffd700;">heaviest XP boost</strong>, which is essential for leveling up your team's rank.`],
    // ──────────────────────────────────

    ['⚔️', 'The 7 Teams', Object.entries(CONFIG.TEAMS).map(([name, info]) =>
      `<span style="color:${info.color}">${info.emoji} ${name.replace('Team ', '')}</span> — ${info.ref}`
    ).join('<br>') + `<br><br>Your team: <strong style="color:${teamColor(team)}">${team}</strong>`],
    ['📋', 'All Missions Explained', `<strong style="color:var(--red-main);">💿 Arirang 2X (DAILY)</strong><br>Stream EVERY ARIRANG track 2x per day. 14 × 2 = 28 streams/day minimum.<br><br><strong style="color:#ffd700;">⚡ Arirang Unit (WEEKLY)</strong><br>Your team gets 2 tracks each week. 25x each. All complete = +25 XP bonus.<br><br><strong style="color:var(--red-main);">🛡️ Side Missions (SURVIVAL)</strong><br>4 tracks: Wild Flower, DSYLM, Haegeum, Killing It Girl. 20x/week each, must stream every day. Fail = WARNING → DISSOLVED.<br><br><strong>📋 Attendance & 👮 Police</strong><br>Share Spotify Recents weekly. Police check for looping. Max 3 reports.`],
    ['🏆', 'How to Win', `Pass ALL 7 missions + have the highest XP:<br>✅ Track Goals<br>✅ Album Goals<br>✅ Arirang 2X (every member, every day)<br>✅ Arirang Unit (every member)<br>✅ Side Missions (every member, every day)<br>✅ 100% Attendance<br>✅ Police check (≤3 reports)<br><br>🎖️ Winner gets <strong style="color:#ffd700;">Champion Badge</strong> + team levels up!`],
    ['📜', 'Rules & Leave', `• Use ONLY given playlists<br>• No looping the same playlist<br>• Volume 50%+ (muted may not count)<br>• Leave: max 1 week/month, 0 XP, team unaffected<br>• Warning system: fail side missions once = warning, twice = dissolved<br>• Dissolved team → members randomly redistributed<br><br>💜 <strong>Have fun!</strong> We're ONE ARMY streaming together! 🚀`],
  ];

  const quickLinks = [
    ['🏠', 'HQ',   'home'],
    ['🎯', 'Goals', 'goals'],
    ['💿', '2X',    'album2x'],
    ['🧠', '148',   'protocol148'],
    ['🛡️', 'Side', 'sidemissions'],
    ['⚡', 'Unit',  'unit'],
  ];

  container.innerHTML = `
    <div style="padding:16px;background:rgba(234,21,58,0.04);border:1px solid rgba(234,21,58,0.1);margin-bottom:14px;text-align:center;border-radius:8px;">
      <div style="font-size:18px;font-weight:900;margin-bottom:4px;">📚 Agent Manual</div>
      <div style="font-size:11px;color:var(--text-muted);">Everything about the ARIRANG MISSION</div>
    </div>

    ${sections.map(([icon, title, content], i) => `
      <div style="background:var(--panel-bg);border:1px solid var(--border-light);margin-bottom:8px;overflow:hidden;border-radius:6px;" id="guide-${i}">
        <div onclick="toggleGuideSection(this)" style="display:flex;align-items:center;gap:10px;padding:14px;background:rgba(234,21,58,0.02);cursor:pointer;user-select:none;">
          <span style="font-size:18px;">${icon}</span>
          <span style="flex:1;font-size:13px;font-weight:700;">${title}</span>
          <span style="color:var(--red-main);font-size:12px;transition:transform 0.3s;" class="guide-arrow">▼</span>
        </div>
        <div style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;" class="guide-body">
          <div style="padding:14px;font-size:12px;color:var(--text-muted);line-height:1.7;">${content}</div>
        </div>
      </div>
    `).join('')}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px;">
      ${quickLinks.map(([icon, label, page]) => `
        <div onclick="goTo('${page}')" style="padding:14px;background:var(--panel-bg);border:1px solid var(--border-light);text-align:center;cursor:pointer;border-radius:6px;transition:border-color 0.2s;"
          onmouseover="this.style.borderColor='var(--red-main)'" onmouseout="this.style.borderColor='var(--border-light)'">
          <div style="font-size:20px;margin-bottom:4px;">${icon}</div>
          <div style="font-size:10px;font-weight:700;">${label}</div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Toggle a guide accordion section.
 * v2.0: Cleaner state management, no stale maxHeight issues.
 */
function toggleGuideSection(header) {
  if (!header) return;
  if (typeof navigator.vibrate === 'function') navigator.vibrate(10);

  const section = header.parentElement;
  if (!section) return;

  const body = section.querySelector('.guide-body');
  const arrow = header.querySelector('.guide-arrow');
  if (!body) return;

  const isCurrentlyOpen = parseInt(body.style.maxHeight) > 0;

  // Close all sections first
  const allBodies = document.querySelectorAll('#guideContent .guide-body');
  const allArrows = document.querySelectorAll('#guideContent .guide-arrow');
  allBodies.forEach(b => b.style.maxHeight = '0px');
  allArrows.forEach(a => a.style.transform = 'rotate(0deg)');

  // Open clicked section if it was closed
  if (!isCurrentlyOpen) {
    body.style.maxHeight = body.scrollHeight + 'px';
    if (arrow) arrow.style.transform = 'rotate(180deg)';
  }
}

// =============================================
// ██████  NARRATIVE CARD HELPER (Upgraded UI)
// =============================================
function renderNarrativeCard(missionKey) {
  const n = MISSION_NARRATIVES[missionKey];
  if (!n) return '';

  return `
    <div class="narrative-box" style="--n-color: ${n.color};">
      <div class="narrative-header" style="margin-bottom: 12px;">
        <div class="narrative-avatar">
          ${n.member}
        </div>
        <div class="narrative-title">
          <span class="narrative-name">${n.memberName}</span>
          <span class="narrative-role">${n.meaning}</span>
        </div>
      </div>
      <div class="narrative-directive">
        <div class="narrative-directive-icon">${n.icon}</div>
        <div class="narrative-directive-text">
          ${n.bridge}
        </div>
      </div>
    </div>
  `;
}
  // =============================================
  // ██████  KEYBOARD SHORTCUTS
  // =============================================
  // v2.0: Uses a Map for clarity, ignores input fields.
  
  const KEYBOARD_SHORTCUTS = new Map([
    ['1', 'home'],
    ['2', 'profile'],
    ['3', 'goals'],
    ['4', 'album2x'],
    ['5', 'unit'],
    ['6', 'sidemissions'],
    ['7', 'rankings'],
    ['8', 'protocol148'],
  ]);
  
  document.addEventListener('keydown', e => {
    // Skip if user is typing in an input/textarea
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
  
    // Page shortcuts
    const page = KEYBOARD_SHORTCUTS.get(e.key);
    if (page) {
      goTo(page);
      return;
    }
  
    // Sync shortcut
    if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
      syncData();
    }
  });
  
  
  // =============================================
  // ██████  LOGIN KEYBOARD SUPPORT
  // =============================================
  
  document.getElementById('loginPw')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') doLogin();
  });
  
  document.getElementById('loginId')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') document.getElementById('loginPw')?.focus();
  });
  
  document.getElementById('findIG')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') findAgent();
  });
  
  document.getElementById('chatInput')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendChat();
  });
  
  
  // =============================================
  // ██████  CLEANUP ON PAGE CLOSE
  // =============================================
  
  window.addEventListener('beforeunload', () => {
    // Fire-and-forget cleanup
    if (STATE.agentNo) {
      // Use sendBeacon for reliable delivery during unload
      try {
        const payload = JSON.stringify({
          action: 'removeOnlineUser',
          agentNo: STATE.agentNo,
        });
        navigator.sendBeacon(CONFIG.API_URL, payload);
      } catch {
        // Fallback to fetch (may not complete)
        Api.call('removeOnlineUser', { agentNo: STATE.agentNo }, { silent: true, dedupe: false }).catch(() => {});
      }
    }
  
    // Clear all timers
    Timers.clearAll();
  });
  // --- Missing Function Fixes ---

function openLeaveModal() {
  const modal = document.createElement('div');
  modal.className = 'spy-modal-overlay';
  modal.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.9); z-index:100000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(8px);`;
  modal.innerHTML = `
    <div class="archive-card" style="max-width:380px; width:100%; border-top:4px solid var(--courage-amber);">
      <h3 style="color:#fff; margin-bottom:12px;">APPLY FOR LEAVE?</h3>
      <p style="font-size:12px; color:var(--text-muted); line-height:1.6; margin-bottom:20px;">
        You will earn 0 XP this week, but your team's completion percentage will not be penalized by your absence.
      </p>
      <div style="display:flex; gap:12px;">
        <button onclick="this.closest('.spy-modal-overlay').remove()" class="btn-outline" style="flex:1;">Cancel</button>
        <button onclick="confirmLeaveApplication()" class="btn-red" style="flex:1; background:var(--courage-amber); border-color:var(--courage-amber); color:#000;">Confirm Leave</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

async function markMissionComplete(missionId) {
  if(!confirm("Confirm mission completion?")) return;
  Loading.show();
  try {
    const res = await Api.call('updateMissionProgress', { missionId, agentNo: STATE.agentNo, status: 'completed' });
    if(res.success) {
      showToast("Mission status updated!", "success");
      Api.invalidate();
      renderSecretMissions();
    }
  } catch(e) { showToast("Update failed", "error"); }
  finally { Loading.hide(); }
}

function copyShareText(week, total, winner, teamsJson) {
  const teams = JSON.parse(teamsJson.replace(/&quot;/g, '"'));
  const teamList = teams.map((t, i) => `${i+1}. ${t.t}: ${t.xp} XP`).join('\n');
  const text = `📊 ARIRANG MISSION: ${week} RESULTS\n\n🏆 WINNER: ${winner || 'NONE'}\n🎵 TOTAL STREAMS: ${total.toLocaleString()}\n\nSTANDINGS:\n${teamList}\n\n#ARIRANG_MISSION #BTS #ARMY`;
  
  navigator.clipboard.writeText(text).then(() => {
    showToast("Caption copied to clipboard!", "success");
  });
}
  
  // =============================================
// ██████  WINDOW EXPORTS
// =============================================
// v2.1: Added operative database & police functions

const WINDOW_EXPORTS = {
    // Auth
    doLogin, doLogout, findAgent,

    // Navigation
    goTo, toggleSidebar, toggleNavGroup, openSidebar, closeSidebar,

    // Dashboard
    loadDashboard, syncData, handleManualSync,

    // Profile actions
    openPasswordModal, closePasswordModal, changePassword,
    deleteAccountConfirm, promptDeleteAccount,
    applyLeave, cancelLeave, submitAttendance,
    openLeaveModal, cancelLeaveRequest,

    // Pages
    renderHome, renderProfile, renderTrackGoals, renderAlbumGoals, renderAlbum2x,
    renderUnit, renderSideMissions, loadRankings, switchRankTab,
    renderTeams, loadFeed, loadChat, sendChat,
    renderAnnouncements, renderGuidePage,
    renderSongOfDay, submitSongAnswer,
    renderSecretMissions, renderBadgesPage, renderSummary,
    render148Protocol, toggle148Task, show148Info,
    toggleGuideSection,
    renderOperatives,

    // Notifications
    checkNotifications, showNotificationCenter, dismissHT, checkHTOnboarding,

    // Admin
    showAdminPanel, adminExitMode,
    adminTriggerSync, adminCheckSync,
    adminFinalizeWeek, adminGenerateUnits,
    adminReleaseResults, adminCancelMission,
    smartUpdateStatus,

    // Effects
    fireConfetti,
};

Object.entries(WINDOW_EXPORTS).forEach(([name, fn]) => {
    window[name] = fn;
});
  
  
  // =============================================
  // ██████  NOTIFICATION SYSTEM INIT
  // =============================================
  
  setupNotificationChecks();
  
  
  // =============================================
  // ██████  🚀 START
  // =============================================
  // Entry point: check if user has a saved session,
  // if so skip login and go straight to dashboard.
  
  checkAuth();
  // =============================================
  // ██████  NAV GROUP TOGGLE (Collapsible sidebar sections)
  // =============================================
  
  function toggleNavGroup(toggle) {
    if (!toggle) return;
    const body = toggle.nextElementSibling;
    if (!body) return;
  
    // Check if it is currently open
    const isOpen = body.classList.contains('open');
  
    // Toggle the "open" class on the body and the header
    if (isOpen) {
      body.classList.remove('open');
      toggle.classList.remove('open');
      // Reset max-height so it shrinks back to 0
      body.style.maxHeight = "0px";
    } else {
      body.classList.add('open');
      toggle.classList.add('open');
      // Set to a large enough pixel value so animation works
      body.style.maxHeight = "5000px"; 
    }
    
    if (navigator.vibrate) navigator.vibrate(5);
}
  
window.toggleNavGroup = toggleNavGroup;
/**
 * HT Onboarding System
 * Checks if it's the agent's first time and shows the Hope Tracker welcome.
 */
function checkHTOnboarding() {
  const onboardingKey = `ht_welcome_seen_${STATE.agentNo}`;
  
  // If they've seen it already, stop here
  if (localStorage.getItem(onboardingKey)) return;

  // Create the modal element
  const overlay = document.createElement('div');
  overlay.id = 'ht-onboarding-overlay';
  overlay.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:200000;
    display:flex; align-items:center; justify-content:center; padding:20px;
    backdrop-filter:blur(10px); animation:fadeIn 0.5s ease;
  `;

  overlay.innerHTML = `
    <div class="archive-card" style="max-width:400px; width:100%; border-top:4px solid var(--red-core); padding:30px; text-align:center; box-shadow:0 0 50px rgba(255,20,95,0.2);">
      <div style="width:70px; height:70px; background:var(--bg-lifted); border:2px solid var(--red-core); border-radius:50%; margin:0 auto 20px; display:flex; align-items:center; justify-content:center; font-size:30px; box-shadow:0 0 20px var(--red-whisper);">
        🤖
      </div>
      
      <h2 style="font-family:'Orbitron', sans-serif; font-size:16px; font-weight:900; color:#fff; margin-bottom:10px; letter-spacing:1px;">IDENTIFICATION: HOPE TRACKER</h2>
      
      <p style="font-size:13px; color:var(--text-secondary); line-height:1.6; margin-bottom:24px;">
        Hi! I am <strong>Hope Tracker</strong>, but everyone here calls me <span style="color:var(--red-core); font-weight:800;">HT</span>. 
        As it's your first time in the system, let me get you briefed. Where should we start?
      </p>

      <div style="display:flex; flex-direction:column; gap:12px;">
        <button onclick="dismissHT('guide')" class="btn-red" style="padding:14px; font-size:11px;">
          📚 READ AGENT MANUAL
        </button>
        <button onclick="dismissHT('gclinks')" class="btn-outline" style="padding:14px; font-size:11px; border-color:var(--wave-foam); color:var(--wave-foam);">
          👥 JOIN TEAM GROUP CHATS
        </button>
        <button onclick="dismissHT('trackgoals')" class="btn-outline" style="padding:14px; font-size:11px; border-color:var(--vinyl-gold); color:var(--vinyl-gold);">
          🎯 VIEW MISSION GOALS
        </button>
      </div>

      <p style="margin-top:20px; font-size:10px; color:var(--text-ghost); text-transform:uppercase; letter-spacing:1px;">
        Welcome to the Agency, Agent ${STATE.agentNo}.
      </p>
    </div>
  `;

  document.body.appendChild(overlay);
}

/**
 * Dismisses the onboarding, saves the flag, and navigates.
 */
function dismissHT(targetPage) {
  const onboardingKey = `ht_welcome_seen_${STATE.agentNo}`;
  localStorage.setItem(onboardingKey, 'true');
  
  const el = document.getElementById('ht-onboarding-overlay');
  if (el) el.remove();
  
  if (targetPage) goTo(targetPage);
}
  
  
  // =============================================
  // ██████  UPDATED renderGuide — uses new glass-card style
  // =============================================
  
  function renderGuide(page) {
    return '';
  }
  
  
  // =============================================
  // ██████  RING PROGRESS COMPONENT
  // =============================================
  
  function renderRingProgress(percent, label, color = 'var(--red-core)', size = 64) {
    const r = (size - 6) / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (percent / 100) * circumference;
  
    return `
      <div class="ring-progress" style="width:${size}px;height:${size}px;">
        <svg viewBox="0 0 ${size} ${size}">
          <circle class="ring-track" cx="${size/2}" cy="${size/2}" r="${r}"/>
          <circle class="ring-fill" cx="${size/2}" cy="${size/2}" r="${r}"
            stroke="${color}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}"/>
        </svg>
        <div class="ring-label" style="color:${color};">${label}</div>
      </div>
    `;
  }
  
  // =============================================
  // ██████  UNIT PAGE — TREASURE HUB REDESIGN
  // =============================================
  
  function renderUnit() {
      if (!STATE.data) return;
      const container = $('unitContent');
      if (!container) return;
  
      const unit = STATE.data.agent.arirangUnit;
      const team = STATE.data.team;
      const n = MISSION_NARRATIVES.arirangUnit; // From your config
  
      let html = renderGuide('unit') || '';
  
      if (!unit) {
          html += `
              <div class="glass-card" style="text-align:center; padding:40px; color:var(--text-muted);">
                  <div style="font-size:32px; margin-bottom:10px; opacity:0.5;">🔒</div>
                  <p style="font-size:12px;">No unit assigned this week</p>
              </div>`;
          container.innerHTML = html;
          return;
      }
  
      // 1. Narrative Context Card
      html += `
          <div class="archive-card" style="margin-bottom:24px; border-top:3px solid #60a5fa; background:linear-gradient(135deg, rgba(96,165,250,0.05), var(--bg-panel));">
              <div style="display:flex; gap:16px; align-items:flex-start;">
                  <div style="width:48px; height:48px; border-radius:50%; background:rgba(96,165,250,0.1); border:1px solid #60a5fa; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0;">
                      ${n.member || '🐻'}
                  </div>
                  <div style="flex:1;">
                      <div style="font-size:10px; color:#60a5fa; font-weight:900; text-transform:uppercase; letter-spacing:2px; margin-bottom:6px;">${n.memberName} — ${n.meaning}</div>
                      <div style="font-size:12px; color:var(--text-primary); font-style:italic; line-height:1.6; margin-bottom:10px;">"${n.quote}"</div>
                      <div style="font-size:10px; color:var(--text-muted); line-height:1.5;">${n.bridge}</div>
                  </div>
              </div>
          </div>
      `;
  
      // 2. Your Progress Hub
      html += `<div style="font-size:10px; color:#60a5fa; font-weight:900; letter-spacing:4px; text-transform:uppercase; margin-bottom:12px; margin-left:4px;">[ // Your Assignment ]</div>`;
      
      html += `<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px;">`;
      html += renderUnitTrackModern(unit.track1, unit.track1Count, unit.required, '📀');
      html += renderUnitTrackModern(unit.track2, unit.track2Count, unit.required, '💎');
      html += `</div>`;
  
      // Completion Status
      html += `
          <div class="glass-card" style="padding:20px; text-align:center; margin-bottom:32px; border-color:${unit.passed ? 'var(--green)' : 'var(--border-light)'};">
              <div style="font-size:32px; margin-bottom:12px; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.5));">${unit.passed ? '🎉' : '⏳'}</div>
              <div style="font-size:14px; font-weight:900; color:${unit.passed ? 'var(--green)' : 'var(--fail)'}; letter-spacing:1px; text-transform:uppercase;">
                  ${unit.passed ? '✓ UNIT SECURED — +25 XP' : '✗ UNIT INCOMPLETE'}
              </div>
              <div style="font-size:10px; color:var(--text-muted); margin-top:6px;">
                  All members must complete for team bonus.
              </div>
          </div>
      `;
  
      // 2.5 Unit Members Intelligence (per-agent green/red)
      html += `
          <div id="unitMembersBox" class="glass-card" style="padding:20px; border-top:3px solid var(--wave-foam); margin-bottom:24px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                  <h3 style="margin:0; font-size:13px; font-weight:800; color:#fff; display:flex; align-items:center; gap:8px;">
                      <span style="font-size:16px;">⚡</span> Unit Members Intelligence
                  </h3>
                  <span style="padding:4px 10px; border-radius:12px; font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:1px; background:rgba(255,255,255,0.05); color:var(--text-secondary);">
                      Loading...
                  </span>
              </div>
              <div style="text-align:center; padding:12px; color:var(--text-muted); font-size:11px;">
                  Fetching per-agent completion...
              </div>
          </div>
      `;

      // 3. Team Hubs (Global Network)
      const teamComps = STATE.data.teamComparison || [];
      
      html += `<div style="font-size:10px; color:var(--text-ghost); font-weight:900; letter-spacing:4px; text-transform:uppercase; margin-bottom:12px; margin-left:4px;">[ // Global Network ]</div>`;
      
      html += `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:12px;">`;
      
      teamComps.forEach(tc => {
          const isMyTeam = tc.team === team.name;
          const passed = tc.arirangUnitPassed;
          const cColor = teamColor(tc.team);
          
          html += `
              <div class="glass-card" style="padding:16px; text-align:center; transition:transform 0.3s; ${isMyTeam ? `border-color:${cColor}; background:${cColor}08;` : ''}">
                  <div style="width:40px; height:40px; margin:0 auto 12px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px; background:var(--bg-deep); border:2px solid ${passed ? 'var(--green)' : 'var(--border-light)'}; ${passed ? 'box-shadow:0 0 15px rgba(0,255,102,0.2);' : ''}">
                      ${passed ? '🏆' : teamEmoji(tc.team)}
                  </div>
                  <div style="font-size:11px; font-weight:800; color:${cColor}; margin-bottom:4px;">${tc.team.replace('Team ', '')}</div>
                  <div style="font-size:10px; font-weight:800; font-family:'Share Tech Mono', monospace; color:${passed ? 'var(--green)' : 'var(--text-muted)'};">
                      ${passed ? '+25 XP' : 'IN PROGRESS'}
                  </div>
                  ${isMyTeam ? `<div style="font-size:8px; color:#fff; background:rgba(255,255,255,0.2); padding:2px 8px; border-radius:8px; display:inline-block; margin-top:8px; font-weight:700;">YOUR TEAM</div>` : ''}
              </div>
          `;
      });
      
      html += `</div>`;
      container.innerHTML = html;

      // Async fill: per-member unit completion.
      renderUnitMembersBox(team?.name).catch(() => {
          const box = $('unitMembersBox');
          if (box) {
              box.innerHTML = `
                  <div style="text-align:center; color:var(--fail); font-size:11px; padding:10px;">
                      Failed to load per-agent Unit status.
                  </div>
              `;
          }
      });

      scheduleUnitMembersDailyRefresh();
  }
  
  // Helper function for the individual Unit tracks
  function renderUnitTrackModern(name, count, req, icon) {
      const isExempt = typeof count === 'string';
      const current = isExempt ? req : (count || 0);
      const pct = Math.min(100, (current / req) * 100);
      const done = isExempt || current >= req;
  
      return `
          <div class="glass-card" style="padding:20px 16px; text-align:center; border-top:3px solid ${done ? 'var(--green)' : '#60a5fa'}; position:relative; overflow:hidden;">
              <div style="font-size:24px; margin-bottom:12px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.5));">${icon}</div>
              
              <div style="font-size:12px; font-weight:800; color:#fff; margin-bottom:16px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${sanitize(name)}">
                  ${sanitize(name)}
              </div>
              
              <div style="margin:0 auto 16px; display:flex; justify-content:center;">
                  ${renderRingProgress(pct, `${current}/${req}`, done ? 'var(--green)' : '#60a5fa', 64)}
              </div>
              
              <div style="font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:${done ? 'var(--green)' : 'var(--text-muted)'};">
                  ${isExempt ? 'EXEMPT' : (done ? '✓ COMPLETE' : `${req - current} MORE NEEDED`)}
              </div>
          </div>
      `;
  }

  // ==================== Unit Members Intelligence Helpers ====================
  function computeArirangUnitPassedForAgent(agent) {
      // Some payloads may already include a boolean flag.
      if (typeof agent?.arirangUnitPassed === 'boolean') return agent.arirangUnitPassed;

      const u = agent?.arirangUnit;
      if (!u) return null;
      if (typeof u?.passed === 'boolean') return u.passed;

      // Fallback: compute from track counts if available.
      const required = Number(u?.required ?? 25) || 25;
      const t1 = u?.track1Count;
      const t2 = u?.track2Count;

      const t1Done = (typeof t1 === 'string') ? true
          : (typeof t1 === 'number') ? t1 >= required
          : null;

      const t2Done = (typeof t2 === 'string') ? true
          : (typeof t2 === 'number') ? t2 >= required
          : null;

      if (t1Done === null && t2Done === null) return null;
      if (t1Done === null) return t2Done;
      if (t2Done === null) return t1Done;
      return t1Done && t2Done;
  }

  function buildUnitMemberPill(memberName, passed) {
      const n = displayName(memberName);
      if (passed === true) {
          return `<span style="display:inline-flex; align-items:center; gap:6px; padding:4px 10px; background:rgba(0,255,102,0.05); border:1px solid rgba(0,255,102,0.15); border-radius:6px; font-size:10px; color:#fff;">✓ ${n}</span>`;
      }
      if (passed === false) {
          return `<span style="display:inline-flex; align-items:center; gap:6px; padding:4px 10px; background:rgba(255,20,95,0.1); border:1px solid rgba(255,20,95,0.2); border-radius:6px; font-size:10px; color:#fff;">✗ ${n}</span>`;
      }
      return `<span style="display:inline-flex; align-items:center; gap:6px; padding:4px 10px; background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:6px; font-size:10px; color:var(--text-muted);">? ${n}</span>`;
  }

  async function renderUnitMembersBox(myTeamName) {
      const box = $('unitMembersBox');
      if (!box) return;

      const teamName = myTeamName || STATE.data?.agent?.profile?.team;
      if (!teamName) return;

      // Loading state.
      box.innerHTML = `
          <div style="text-align:center; padding:12px; color:var(--text-muted); font-size:11px;">
              Updating today...
          </div>
      `;

      const d = await Api.call('getOperativeDatabase', { week: STATE.week }, { cache: true, ttl: 60_000 });
      const agents = d?.agents || [];
      const teamMembers = agents.filter(a => (a?.team || '') === teamName);

      if (teamMembers.length === 0) {
          box.innerHTML = `<div style="text-align:center; padding:14px; color:var(--text-muted); font-size:11px;">No squad agents found.</div>`;
          return;
      }

      const memberStatuses = teamMembers.map(a => ({
          name: a?.name || a?.agentNo,
          passed: computeArirangUnitPassedForAgent(a)
      }));

      const hasAnyUnitData = memberStatuses.some(m => m.passed !== null);
      if (!hasAnyUnitData) {
          box.innerHTML = `
              <div style="text-align:center; padding:14px; color:var(--text-muted); font-size:11px; line-height:1.6;">
                  HQ is not providing per-agent Unit completion stats yet.
              </div>
          `;
          return;
      }

      const passedMembers = memberStatuses.filter(m => m.passed === true);
      const failedMembers = memberStatuses.filter(m => m.passed !== true); // includes false + null

      box.innerHTML = `
          <div style="margin-bottom:20px;">
              <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">
                  <span>Team Weekly Completion</span>
                  <span style="color:#fff; font-family:'Share Tech Mono', monospace;">${passedMembers.length}/${teamMembers.length}</span>
              </div>
              <div class="pbar" style="height:6px;">
                  <div class="pfill" style="width:${teamMembers.length ? (passedMembers.length / teamMembers.length) * 100 : 0}%; background:${passedMembers.length === teamMembers.length ? 'var(--green)' : teamColor(teamName)}; box-shadow:0 0 10px rgba(0,0,0,0.2);"></div>
              </div>
          </div>

          ${failedMembers.length > 0 ? `
              <div style="background:var(--red-whisper); border:1px solid var(--red-border); border-radius:8px; padding:12px; margin-bottom:12px;">
                  <div style="color:var(--red-core); font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">
                      🚨 Agents Action Required (${failedMembers.length})
                  </div>
                  <div style="display:flex; flex-wrap:wrap; gap:6px; max-height:150px; overflow-y:auto;">
                      ${failedMembers.slice(0, 50).map(m => buildUnitMemberPill(m.name, m.passed)).join('')}
                      ${failedMembers.length > 50 ? '<span style="font-size:10px; color:var(--text-muted); padding:4px;">+' + (failedMembers.length - 50) + ' more</span>' : ''}
                  </div>
              </div>
          ` : ''}

          ${passedMembers.length > 0 ? `
              <div style="background:var(--green-soft); border:1px solid var(--green-border); border-radius:8px; padding:12px;">
                  <div style="color:var(--green); font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">
                      ✅ Secured Agents (${passedMembers.length})
                  </div>
                  <div style="display:flex; flex-wrap:wrap; gap:6px; max-height:150px; overflow-y:auto;">
                      ${passedMembers.slice(0, 50).map(m => buildUnitMemberPill(m.name, m.passed)).join('')}
                      ${passedMembers.length > 50 ? '<span style="font-size:10px; color:var(--text-muted); padding:4px;">+' + (passedMembers.length - 50) + ' more</span>' : ''}
                  </div>
              </div>
          ` : ''}
      `;
  }

  function scheduleUnitMembersDailyRefresh() {
      if (window.__unitMembersDailyRefreshSet) return;
      window.__unitMembersDailyRefreshSet = true;

      window.__unitMembersDailyRefreshLastDate = window.__unitMembersDailyRefreshLastDate || getKSTDateString();

      Timers.setInterval('unit-members-daily-refresh', () => {
          if (STATE.page !== 'unit') return;
          const today = getKSTDateString();
          if (window.__unitMembersDailyRefreshLastDate !== today) {
              window.__unitMembersDailyRefreshLastDate = today;
              Api.invalidate();
              renderUnit();
          }
      }, 60_000);
  }

  // =============================================
  // ██████  PROFILE — ALL WEEKS CAREER HISTORY
  // =============================================
  
  async function loadCareerHistory() {
    const container = $('profileCareer');
    if (!container) return;
  
    showPageLoading(container);
  
    try {
      const d = await Api.call('getAgentCareerStats', {
        agentNo: STATE.agentNo
      }, { cache: true, ttl: 120_000 });
  
      if (!d.success || !d.weeks?.length) {
        container.innerHTML = '<div style="color:var(--text-muted);font-size:0.75rem;">No history yet — complete your first week!</div>';
        return;
      }
  
      // Aggregate stats
      const totals = d.totals || {};
  
      container.innerHTML = `
        <!-- Lifetime aggregates -->
        <div class="grid-4" style="margin-bottom:16px;">
          <div class="stat-box"><div class="sv gold">${fmt(totals.totalXP || 0)}</div><div class="sl">Lifetime XP</div></div>
          <div class="stat-box"><div class="sv white">${fmt(totals.totalStreams || 0)}</div><div class="sl">Total Streams</div></div>
          <div class="stat-box"><div class="sv purple">${d.weeks.length}</div><div class="sl">Weeks Active</div></div>
          <div class="stat-box"><div class="sv green">${totals.bestRank || '—'}</div><div class="sl">Best Rank</div></div>
        </div>
  
        <!-- Week-by-week breakdown -->
        <div style="max-height:300px;overflow-y:auto;">
          ${d.weeks.map(w => {
            const missions = [w.tracksPassed, w.albumsPassed, w.album2xPassed, w.unitPassed, w.sidePassed].filter(Boolean).length;
            return `
              <div class="m-row" style="border-left:3px solid ${missions >= 5 ? 'var(--green)' : missions >= 3 ? 'var(--gold-core)' : 'var(--fail)'};">
                <div style="flex:1;">
                  <div style="font-size:0.75rem;font-weight:700;">${w.week}</div>
                  <div style="font-size:0.5625rem;color:var(--text-muted);">${missions}/5 missions • Rank #${w.rank || '—'}</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.8125rem;font-weight:900;font-family:'JetBrains Mono',monospace;color:var(--red-core);">${fmt(w.xp || 0)}</div>
                  <div style="font-size:0.5rem;color:var(--text-muted);">${fmt(w.streams || 0)} streams</div>
                </div>
              </div>`;
          }).join('')}
        </div>
      `;
    } catch {
      container.innerHTML = '<div style="color:var(--text-muted);font-size:0.75rem;">Failed to load history</div>';
    }
  }
  
  
  // =============================================
  // ██████  OPERATIVE DATABASE (Full agent roster)
  // =============================================
  
  // =============================================
  // ██████  OPERATIVE DATABASE
  // =============================================
 // =============================================
// ██████  OPERATIVE DATABASE & HELPER CHECK
// =============================================

async function renderOperatives() {
    const container = $('operativesContent');
    if (!container) return;

    showPageLoading(container);

    try {
        // 1. Fetch Data
        const d = await Api.call('getOperativeDatabase', { week: STATE.week }, { cache: true, ttl: 60000 });
        const agents = d.agents || [];
        const myTeam = STATE.data?.agent?.profile?.team;

        // 2. Group by Team & Status
        const byTeam = {};
        Object.keys(CONFIG.TEAMS).forEach(t => byTeam[t] = { active: [], leave: [] });

        agents.forEach(a => {
            const t = a.team || 'Unknown';
            if (!byTeam[t]) byTeam[t] = { active: [], leave: [] };
            if (a.onLeave) byTeam[t].leave.push(a);
            else byTeam[t].active.push(a);
        });

        // 3. Sort Alphabetically
        Object.values(byTeam).forEach(data => {
            data.active.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            data.leave.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        });

        let grandTotalActive = 0;
        let grandTotalLeave = 0;

        // 4. Build Header & Search
        let html = `
            <div style="margin-bottom:20px; position:relative;">
                <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:14px; pointer-events:none;">🔍</span>
                <input type="text" id="opSearch" oninput="window.filterOperativesModern(this.value)"
                    placeholder="Search agent dossiers..." class="input-field"
                    style="padding-left:40px;">
            </div>

            <div class="glass-card" style="padding:16px; margin-bottom:20px; border-left:3px solid var(--wave-foam); display:flex; align-items:center; gap:12px;">
                <span style="font-size:24px;">💡</span>
                <span style="font-size:11px; color:var(--text-secondary); line-height:1.5;">
                    <strong style="color:var(--wave-foam);">Attendance Helpers:</strong> Tap the circle next to an agent's name to mark them present today. Team stats update in real-time.
                </span>
            </div>

            <div id="opList" style="display:flex; flex-direction:column; gap:20px;">
        `;

        // 5. Render Team Cards
        for (const [team, data] of Object.entries(byTeam)) {
            if (data.active.length === 0 && data.leave.length === 0) continue;

            grandTotalActive += data.active.length;
            grandTotalLeave += data.leave.length;

            const isMyTeam = team === myTeam;
            const tColor = teamColor(team);
            const teamIdClean = team.replace(/\s+/g, '');
            const totalAgents = data.active.length + data.leave.length;

            html += `
                <div class="archive-card team-op-section" style="border-top: 3px solid ${tColor}; padding:0; overflow:hidden;" data-team="${team}">
                    
                    <!-- TEAM HEADER (Collapsible) -->
                    <div style="padding:16px; background:linear-gradient(135deg, ${tColor}11, transparent); display:flex; align-items:center; gap:12px; cursor:pointer;" onclick="toggleNavGroup(this)">
                        <div class="battle-pfp-mid" style="border-color:${tColor}; margin:0; width:40px; height:40px;">
                            <img src="${teamPfp(team)}" alt="${team}">
                        </div>
                        <div style="flex:1;">
                            <div style="font-family:var(--font-display); font-size:14px; font-weight:800; color:${tColor}; letter-spacing:1px; text-transform:uppercase;">
                                ${team.replace('Team ', '')}
                                ${isMyTeam ? '<span style="font-size:8px; color:#fff; background:var(--red-core); padding:2px 6px; border-radius:4px; margin-left:6px; vertical-align:middle;">YOUR SQUAD</span>' : ''}
                            </div>
                            <div style="font-size:10px; color:var(--text-muted); font-family:var(--font-mono); margin-top:4px;">
                                ${totalAgents} TOTAL • ${data.active.length} ACTIVE • ${data.leave.length} GHOST
                            </div>
                        </div>
                        <div class="nav-chevron" style="font-size:14px; color:var(--text-muted); transition:transform 0.3s;">▼</div>
                    </div>

                    <!-- TEAM BODY -->
                    <div class="nav-group-body open" style="padding:0 16px 16px;">
                        
                        <!-- Progress Bar -->
                        <div style="background:rgba(0,0,0,0.3); border:1px solid var(--border-subtle); border-radius:8px; padding:12px; margin-top:16px; margin-bottom:16px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                <span style="font-size:10px; font-weight:800; color:var(--text-ghost); text-transform:uppercase; letter-spacing:1px;">Today's Presence</span>
                                <span style="font-family:var(--font-mono); font-size:12px; font-weight:900; color:#fff;">
                                    <span id="present-${teamIdClean}">0</span> / <span id="active-${teamIdClean}">${data.active.length}</span>
                                    <span id="percent-${teamIdClean}" style="color:var(--text-muted); margin-left:6px; font-size:10px;">(0%)</span>
                                </span>
                            </div>
                            <div class="pbar" style="height:6px; background:rgba(255,255,255,0.05);">
                                <div class="pfill" id="bar-${teamIdClean}" style="width:0%; background:${tColor}; box-shadow:0 0 10px ${tColor}66;"></div>
                            </div>
                        </div>

                        <!-- Active List -->
                        ${data.active.length > 0 ? `
                            <div style="font-size:10px; font-weight:800; color:var(--green); text-transform:uppercase; letter-spacing:2px; margin-bottom:8px; padding-left:4px;">🟢 Active Operatives</div>
                            <div style="display:flex; flex-direction:column; gap:4px; margin-bottom:16px;">
                                ${data.active.map(a => renderAgentRowModern(a, false, teamIdClean)).join('')}
                            </div>
                        ` : ''}

                        <!-- Leave List -->
                        ${data.leave.length > 0 ? `
                            <div style="font-size:10px; font-weight:800; color:var(--courage-amber); text-transform:uppercase; letter-spacing:2px; margin-bottom:8px; padding-left:4px;">💤 Ghost Protocol (Leave)</div>
                            <div style="display:flex; flex-direction:column; gap:4px;">
                                ${data.leave.map(a => renderAgentRowModern(a, true, teamIdClean)).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        // 6. Overall Summary Footer
        html += `
            </div><!-- end opList -->

            <!-- OVERALL STATS -->
            <div class="glass-card" style="margin-top:24px; padding:20px; border-top:3px solid var(--gold-core);">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
                    <span style="font-size:20px;">📋</span>
                    <div style="font-size:12px; font-weight:900; color:var(--gold-core); text-transform:uppercase; letter-spacing:2px;">Overall Attendance</div>
                </div>
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">Network Total</span>
                    <span style="font-family:var(--font-mono); font-size:14px; font-weight:900;">
                        <span id="overall-present" style="color:var(--green);">0</span> / 
                        <span id="overall-active" style="color:#fff;">${grandTotalActive}</span>
                        <span id="overall-percent" style="color:var(--text-muted); font-size:11px; margin-left:4px;">(0%)</span>
                    </span>
                </div>
                <div class="pbar" style="height:8px; margin-bottom:16px; background:rgba(255,255,255,0.05);">
                    <div class="pfill gold" id="overall-bar" style="width:0%;"></div>
                </div>

                <div class="grid-3" style="text-align:center;">
                    <div style="padding:10px; background:rgba(255,255,255,0.02); border-radius:8px; border:1px solid var(--border-subtle);">
                        <div style="font-family:var(--font-mono); font-size:16px; font-weight:900; color:#fff;">${grandTotalActive + grandTotalLeave}</div>
                        <div style="font-size:8px; color:var(--text-muted); text-transform:uppercase; margin-top:2px;">Total Force</div>
                    </div>
                    <div style="padding:10px; background:rgba(255,255,255,0.02); border-radius:8px; border:1px solid var(--border-subtle);">
                        <div style="font-family:var(--font-mono); font-size:16px; font-weight:900; color:var(--green);">${grandTotalActive}</div>
                        <div style="font-size:8px; color:var(--text-muted); text-transform:uppercase; margin-top:2px;">Active</div>
                    </div>
                    <div style="padding:10px; background:rgba(255,255,255,0.02); border-radius:8px; border:1px solid var(--border-subtle);">
                        <div style="font-family:var(--font-mono); font-size:16px; font-weight:900; color:var(--courage-amber);">${grandTotalLeave}</div>
                        <div style="font-size:8px; color:var(--text-muted); text-transform:uppercase; margin-top:2px;">On Leave</div>
                    </div>
                </div>
            </div>

            <!-- POLICE LOGIN SECTION -->
            <div id="police-section" style="margin-top:24px;">
                <div class="glass-card" onclick="window.showPoliceLoginModern()" style="cursor:pointer; padding:16px; display:flex; justify-content:space-between; align-items:center; border-left:3px solid var(--red-core); transition:border-color 0.3s;" onmouseover="this.style.borderColor='var(--red-mid)'" onmouseout="this.style.borderColor='var(--red-core)'">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span style="font-size:20px;">👮</span>
                        <span style="font-size:12px; font-weight:900; color:#fff; text-transform:uppercase; letter-spacing:2px;">Police Verification</span>
                    </div>
                    <span style="color:var(--text-muted); font-size:10px;">Tap to access ▶</span>
                </div>
            </div>

            <!-- POLICE MODAL (Inline) -->
            <div id="police-login-modal" style="display:none; margin-top:24px;">
                <div class="glass-card" style="padding:20px; border-top:3px solid var(--red-core);">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
                        <span style="font-size:20px;">🔐</span>
                        <span style="font-size:12px; font-weight:900; color:var(--red-core); text-transform:uppercase; letter-spacing:2px;">Enter Police Code</span>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <input type="password" id="police-password" class="input-field" placeholder="Enter passcode..." 
                            onkeydown="if(event.key==='Enter') window.verifyPoliceAccessModern()">
                        <button onclick="window.verifyPoliceAccessModern()" class="btn-red" style="width:auto; padding:10px 24px;">VERIFY</button>
                    </div>
                </div>
            </div>

            <div id="police-lastfm-container" style="display:none; margin-top:24px;"></div>
        `;

        container.innerHTML = html;

        // Trigger calculations & cleanup
        window.cleanupOldCheckmarks();
        window.updateAllAttendanceStatsModern();

    } catch (e) {
        console.error('renderOperatives error:', e);
        showPageError(container, 'renderOperatives');
    }
}

// ── Helper: Render Individual Row ──
function renderAgentRowModern(agent, isLeave, teamIdClean) {
    const today = new Date().toISOString().split('T')[0];
    const agentNo = agent.agentNo || 'N/A';
    const storageKey = `helper_check_${agentNo}_${today}`;
    const isChecked = localStorage.getItem(storageKey) === 'true';

    let displayName = agent.name ? sanitize(agent.name) : 'Unknown Agent';
    if (displayName.toUpperCase().startsWith('AGENT') || !agent.name) displayName = 'Classified Agent';

    const statusBadge = isLeave
        ? `<span style="font-size:8px; font-weight:800; padding:4px 8px; background:rgba(255,149,0,0.1); color:var(--courage-amber); border-radius:12px; border:1px solid rgba(255,149,0,0.3);">GHOST</span>`
        : (agent.attendanceSubmitted
            ? `<span style="font-size:8px; font-weight:800; padding:4px 8px; background:rgba(0,255,102,0.1); color:var(--green); border-radius:12px; border:1px solid rgba(0,255,102,0.3);">SUBMITTED</span>`
            : ``);

    return `
        <div class="op-row-modern ${isLeave ? 'on-leave' : ''} ${isChecked ? 'checked' : ''}" 
             data-agent="${agentNo}" data-team-ref="${teamIdClean}"
             data-search="${(agent.name || '').toLowerCase()} ${agentNo.toLowerCase()}"
             style="display:flex; align-items:center; gap:12px; padding:10px 12px; background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px; transition:all 0.2s;">
            
            ${!isLeave ? `
            <div class="helper-check-wrapper" onclick="window.toggleHelperCheckModern(event, this, '${agentNo}', '${teamIdClean}')"
                 style="width:24px; height:24px; border-radius:50%; border:2px solid ${isChecked ? 'var(--green)' : 'var(--text-muted)'}; background:${isChecked ? 'rgba(0,255,102,0.1)' : 'transparent'}; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:all 0.2s;">
                <span class="helper-checkbox" style="color:${isChecked ? 'var(--green)' : 'transparent'}; font-size:14px; font-weight:900;">${isChecked ? '✓' : ''}</span>
            </div>
            ` : `
            <div style="width:24px; height:24px; border-radius:50%; border:2px dashed var(--courage-amber); opacity:0.5; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <span style="font-size:10px;">💤</span>
            </div>
            `}

            <div style="flex:1; min-width:0;">
                <div style="font-size:13px; font-weight:700; color:${isLeave ? 'var(--text-muted)' : '#fff'}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${displayName}
                </div>
                <div style="font-size:9px; color:var(--text-ghost); font-family:var(--font-mono); margin-top:2px;">
                    ID: ${agentNo}
                </div>
            </div>

            <div style="flex-shrink:0;">
                ${statusBadge}
            </div>
        </div>
    `;
}

// ── Helper: Checkbox Toggle ──
window.toggleHelperCheckModern = function(event, wrapper, agentNo, teamId) {
    event.stopPropagation();
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `helper_check_${agentNo}_${today}`;

    const row = wrapper.closest('.op-row-modern');
    const checkbox = wrapper.querySelector('.helper-checkbox');
    if (!row || !checkbox) return;

    const isNowChecked = !row.classList.contains('checked');

    if (isNowChecked) {
        row.classList.add('checked');
        wrapper.style.borderColor = 'var(--green)';
        wrapper.style.background = 'rgba(0,255,102,0.1)';
        checkbox.style.color = 'var(--green)';
        checkbox.textContent = '✓';
        localStorage.setItem(storageKey, 'true');
        if (navigator.vibrate) navigator.vibrate(10);
        row.style.transform = 'scale(1.02)';
        setTimeout(() => { row.style.transform = ''; }, 150);
    } else {
        row.classList.remove('checked');
        wrapper.style.borderColor = 'var(--text-muted)';
        wrapper.style.background = 'transparent';
        checkbox.style.color = 'transparent';
        checkbox.textContent = '';
        localStorage.removeItem(storageKey);
    }

    window.updateTeamStatsModern(teamId);
    window.updateAllAttendanceStatsModern();
};

// ── Helper: Calculate Stats ──
window.updateTeamStatsModern = function(teamId) {
    const activeItems = document.querySelectorAll(`.op-row-modern[data-team-ref="${teamId}"]:not(.on-leave)`);
    const totalActive = activeItems.length;
    let presentCount = 0;

    activeItems.forEach(item => {
        if (item.classList.contains('checked')) presentCount++;
    });

    const percentage = totalActive > 0 ? Math.round((presentCount / totalActive) * 100) : 0;

    const presentEl = $(`present-${teamId}`);
    const barEl = $(`bar-${teamId}`);
    const percentEl = $(`percent-${teamId}`);

    if (presentEl) presentEl.textContent = presentCount;
    if (barEl) barEl.style.width = `${percentage}%`;
    if (percentEl) {
        percentEl.textContent = `(${percentage}%)`;
        if (percentage >= 80) percentEl.style.color = 'var(--green)';
        else if (percentage >= 50) percentEl.style.color = 'var(--courage-amber)';
        else percentEl.style.color = 'var(--fail)';
    }

    return { present: presentCount, total: totalActive };
};

window.updateAllAttendanceStatsModern = function() {
    const teamSections = document.querySelectorAll('.team-op-section');
    let overallPresent = 0;
    let overallActive = 0;

    teamSections.forEach(section => {
        const teamName = section.getAttribute('data-team');
        const teamIdClean = teamName.replace(/\s+/g, '');
        const stats = window.updateTeamStatsModern(teamIdClean);
        overallPresent += stats.present;
        overallActive += stats.total;
    });

    const percentage = overallActive > 0 ? Math.round((overallPresent / overallActive) * 100) : 0;

    const presentEl = $('overall-present');
    const barEl = $('overall-bar');
    const percentEl = $('overall-percent');

    if (presentEl) presentEl.textContent = overallPresent;
    if (barEl) barEl.style.width = `${percentage}%`;
    if (percentEl) {
        percentEl.textContent = `(${percentage}%)`;
        if (percentage >= 80) percentEl.style.color = 'var(--green)';
        else if (percentage >= 50) percentEl.style.color = 'var(--courage-amber)';
        else percentEl.style.color = 'var(--fail)';
    }
};

// ── Helper: Cleanup Old Data ──
window.cleanupOldCheckmarks = function() {
    const today = new Date().toISOString().split('T')[0];
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('helper_check_') && !key.endsWith(today)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
};

// ── Helper: Search Filter ──
window.filterOperativesModern = function(query) {
    const q = (query || '').toLowerCase().trim();
    const rows = document.querySelectorAll('.op-row-modern');

    rows.forEach(row => {
        const name = row.getAttribute('data-search') || '';
        row.style.display = name.includes(q) ? 'flex' : 'none';
    });

    // Hide empty teams
    const teamCards = document.querySelectorAll('.team-op-section');
    teamCards.forEach(card => {
        const hasVisible = Array.from(card.querySelectorAll('.op-row-modern')).some(r => r.style.display !== 'none');
        card.style.display = hasVisible ? 'block' : 'none';

        // Auto-expand if searching
        const body = card.querySelector('.nav-group-body');
        const header = card.querySelector('[onclick*="toggleNavGroup"]');
        if (q.length > 0 && hasVisible) {
            if (body) {
                body.classList.add('open');
                body.style.maxHeight = '6000px';
            }
            if (header) header.classList.add('open');
        }
    });
};


// =============================================
// ██████  POLICE VERIFICATION LOGIC
// =============================================

window.showPoliceLoginModern = function() {
    const modal = $('police-login-modal');
    const section = $('police-section');
    if (modal) {
        modal.style.display = 'block';
        const input = $('police-password');
        if (input) input.focus();
    }
    if (section) section.style.display = 'none';
};

window.verifyPoliceAccessModern = async function() {
    const input = $('police-password');
    const password = input?.value?.trim();

    if (!password) {
        showToast('Enter password', 'error');
        return;
    }

    const loginModal = $('police-login-modal');
    const container = $('police-lastfm-container');
    if (loginModal) loginModal.style.display = 'none';
    if (container) {
        container.style.display = 'block';
        container.innerHTML = `
            <div class="glass-card" style="text-align:center; padding:30px;">
                <div class="spinner" style="margin:0 auto 10px;"></div>
                <div style="color:var(--text-muted); font-size:11px;">Accessing Last.fm Database...</div>
            </div>
        `;
    }

    try {
        const res = await Api.call('getPoliceData', {
            password: password,
            week: STATE.week
        }, { dedupe: false, cache: false });

        if (!res.success) {
            showToast(res.error || '❌ Access Denied', 'error');
            if (input) input.value = '';
            if (loginModal) loginModal.style.display = 'block';
            if (container) container.style.display = 'none';
            return;
        }

        const teams = res.teams || {};
        let html = `
            <div class="glass-card" style="padding:16px; margin-bottom:20px; border-left:3px solid var(--red-core); display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div style="font-size:14px; font-weight:900; color:var(--red-core); text-transform:uppercase;">Police Terminal</div>
                    <div style="font-size:9px; color:var(--text-muted); font-family:var(--font-mono); margin-top:2px;">WEEK RANGE: ${res.weekRange?.fromDate || '?'} → ${res.weekRange?.toDate || '?'}</div>
                </div>
                <button onclick="window.logoutPoliceModern()" class="btn-outline" style="font-size:9px; padding:6px 12px; border-color:var(--fail); color:var(--fail);">🔒 LOCK</button>
            </div>
        `;

        for (const [teamName, members] of Object.entries(teams)) {
            const teamColorVal = teamColor(teamName);

            html += `
                <div class="archive-card" style="margin-bottom:12px; padding:0; border-top:3px solid ${teamColorVal}; overflow:hidden;">
                    <div onclick="toggleNavGroup(this)" style="padding:16px; background:linear-gradient(135deg, ${teamColorVal}11, transparent); display:flex; align-items:center; justify-content:space-between; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <span style="font-size:18px;">👮</span>
                            <span style="font-family:var(--font-display); font-size:13px; font-weight:800; color:${teamColorVal}; letter-spacing:1px; text-transform:uppercase;">${teamName.replace('Team ', '')}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <span style="color:var(--text-muted); font-size:10px; font-family:var(--font-mono);">${members.length} AGENTS</span>
                            <span class="nav-chevron" style="color:var(--text-muted); font-size:12px; transition:transform 0.3s;">▼</span>
                        </div>
                    </div>
                    
                    <div class="nav-group-body open" style="padding:0 16px 16px; max-height: none;">
                        <div style="display:flex; flex-direction:column; gap:4px; margin-top:10px;">
                        ${members.map(m => {
                            const usernames = m.usernames || [];
                            const hasLastFm = usernames.length > 0;

                            return `
                                <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 12px; background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px;">
                                    <div style="min-width:0; flex:1;">
                                        <div style="color:#fff; font-size:12px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                            ${sanitize(m.name || 'Agent')}
                                        </div>
                                    </div>
                                    <div style="display:flex; gap:6px; flex-shrink:0; margin-left:8px;">
                                        ${hasLastFm ? usernames.map((u, i) => `
                                            <a href="https://www.last.fm/user/${encodeURIComponent(u)}/library?from=${res.weekRange?.fromDate || ''}&to=${res.weekRange?.toDate || ''}" 
                                               target="_blank" rel="noopener"
                                               style="padding:6px 10px; background:var(--red-whisper); border:1px solid var(--red-border); border-radius:6px; color:var(--red-core); font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:1px; text-decoration:none; white-space:nowrap; transition:all 0.2s;"
                                               onmouseover="this.style.background='rgba(255,20,95,0.15)'"
                                               onmouseout="this.style.background='var(--red-whisper)'">
                                                🎵 ${usernames.length > 1 ? 'LFM ' + (i + 1) : 'Last.fm'}
                                            </a>
                                        `).join('') : `
                                            <span style="padding:6px 10px; background:rgba(255,255,255,0.02); border:1px dashed var(--border-subtle); border-radius:6px; color:var(--text-ghost); font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:1px;">
                                                No Data
                                            </span>
                                        `}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        if (container) container.innerHTML = html;
        showToast('👮 Police access granted', 'success');

    } catch (e) {
        console.error('Police data error:', e);
        if (container) {
            container.innerHTML = `
                <div class="glass-card" style="text-align:center; padding:20px; border-left:3px solid var(--fail);">
                    <div style="color:var(--fail); font-size:11px; font-weight:700;">⚠️ Failed to load: ${e.message}</div>
                </div>
            `;
        }
    }
};

// ── Helper: Logout Police ──
window.logoutPoliceModern = function() {
    const section = $('police-section');
    const loginModal = $('police-login-modal');
    const container = $('police-lastfm-container');
    const input = $('police-password');

    if (section) section.style.display = 'block';
    if (loginModal) loginModal.style.display = 'none';
    if (container) { container.style.display = 'none'; container.innerHTML = ''; }
    if (input) input.value = '';

    showToast('🔒 Police panel locked', 'info');
};
  // =============================================
  // ██████  TEAM COMPARISON PAGE
  // =============================================
  async function renderComparison() {
    const container = $('comparisonContent');
    if (!container) return;

    const teams = STATE.data?.teamComparison || [];
    if (!teams.length) {
        container.innerHTML = '<div class="glass-card" style="padding:40px; text-align:center;">No data.</div>';
        return;
    }

    // Sort by XP to find the leader
    const sorted = [...teams].sort((a, b) => b.teamXP - a.teamXP);
    const topXP = sorted[0].teamXP || 1; // Avoid divide by zero

    let html = `
        <div class="archive-card" style="margin-bottom:20px; border-color:var(--red-border);">
            <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:2px; margin-bottom:15px; text-align:center;">
                📊 Live Battle Statistics (Relative to Leader)
            </div>
            <div class="comparison-list">
    `;

    sorted.forEach((tm, i) => {
        const tColor = teamColor(tm.team);
        const pct = Math.max(5, (tm.teamXP / topXP) * 100); // Min 5% so bar is visible
        
        // Define the 5 missions to check
        const missionIcons = [
            { icon: '🎵', key: 'trackGoalPassed' },
            { icon: '📀', key: 'albumGoalPassed' },
            { icon: '🔁', key: 'album2xPassed' },
            { icon: '⚡', key: 'arirangUnitPassed' },
            { icon: '🛡️', key: 'sideMissionPassed' }
        ];

        const dotsHtml = missionIcons.map(m => `
            <div class="comp-dot ${tm[m.key] ? 'passed' : 'failed'}">
                <span>${m.icon}</span>
                <span>${tm[m.key] ? '●' : '○'}</span>
            </div>
        `).join('');

        html += `
            <div class="comp-row" style="--team-color: ${tColor}">
                <div class="comp-rank-badge">${i + 1}</div>
                
                <div class="comp-team-info">
                    <span class="comp-name" style="color:${tColor}">${tm.team.replace('Team ', '')}</span>
                    <span class="comp-xp-val" style="color:#fff">${fmt(tm.teamXP)} <span style="font-size:9px; color:var(--text-muted)">XP</span></span>
                </div>

                <div class="comp-bar-bg">
                    <div class="comp-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, ${tColor}aa, ${tColor}); box-shadow: 0 0 15px ${tColor}44;"></div>
                </div>

                <div class="comp-mission-row">
                    ${dotsHtml}
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
        <button onclick="goTo('teams')" class="btn-outline" style="width:100%">View Detailed Squad Standings</button>
    `;

    container.innerHTML = html;
}
  
  // =============================================
  // ██████  ATTENDANCE PAGE (Simple Version)
  // =============================================
  
  function renderAttendancePage() {
    const container = $('attendanceContent');
    if (!container) return;
  
    const a = STATE.data?.agent;
    if (!a) return;
  
    const att = a.attendance || {};
    const team = a.profile?.team || 'Unknown';
    
    const kstDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    const kstDay = kstDate.getDay(); 
    const isWeekend = kstDay === 0 || kstDay === 6;
  
    let html = renderGuide('attendance') || '';
    html += renderNarrativeCard('attendance') || '';
  
    // 1. SIMPLE STATUS & ACTION CARD
    html += `<div class="glass-card" style="padding:30px 20px; text-align:center; margin-bottom:24px;">`;
  
    if (att.submitted) {
      // Already Submitted
      html += `
        <div style="font-size:40px; margin-bottom:12px;">✅</div>
        <div style="font-size:16px; font-weight:800; color:var(--green); letter-spacing:1px; margin-bottom:8px;">Attendance Submitted</div>
        <div style="font-size:12px; color:var(--text-muted);">You're all set for this week. Thank you!</div>
      `;
    } else if (isWeekend) {
      // Weekend - Ready to Submit
      html += `
        <div style="font-size:40px; margin-bottom:12px;">📸</div>
        <div style="font-size:16px; font-weight:800; color:var(--gold-core); letter-spacing:1px; margin-bottom:12px;">Weekly Check-In</div>
        <div style="font-size:12px; color:var(--text-secondary); line-height:1.6; margin-bottom:24px;">
          1. Drop your Spotify "Recently Played" screenshot in the <strong>${team.replace('Team ', '')} GC</strong>.<br>
          2. Click the button below to log your attendance.
        </div>
        <button class="btn-red" onclick="submitAttendance()" style="max-width:250px;">
          ✓ Mark Attendance
        </button>
      `;
    } else {
      // Weekday - Locked
      html += `
        <div style="font-size:40px; margin-bottom:12px; opacity:0.5;">🔒</div>
        <div style="font-size:14px; font-weight:800; color:var(--text-muted); letter-spacing:1px; margin-bottom:8px;">Locked Until Weekend</div>
        <div style="font-size:11px; color:var(--text-ghost);">The attendance portal opens on Saturday at 3:00 PM KST.</div>
      `;
    }
    
    html += `</div>`;
  
    // 2. TEAM PROGRESS
    html += `
      <div class="archive-card" style="border-top:3px solid var(--gold-core);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span style="font-size:12px; font-weight:800; color:#fff; text-transform:uppercase; letter-spacing:1px;">👥 Team Progress</span>
          <span style="font-size:16px; font-weight:900; font-family:'Share Tech Mono', monospace; color:var(--gold-core);">${att.teamStats?.percentage || 0}%</span>
        </div>
        
        <div class="pbar" style="height:8px; margin-bottom:12px; background:rgba(255,255,255,0.05);">
          <div class="pfill gold" style="width:${att.teamStats?.percentage || 0}%;"></div>
        </div>
        
        <div style="font-size:11px; color:var(--text-muted); text-align:right;">
          ${att.teamStats?.submitted || 0} / ${att.teamStats?.total || 0} Agents Submitted
        </div>
      </div>
    `;
  
    container.innerHTML = html;
  }
  
  // Simple, direct submit function
  async function submitAttendance() {
    Loading.show();
    try {
      const d = await Api.call('submitAttendance', { agentNo: STATE.agentNo }, { dedupe: false, cache: false });
      if (d.success) {
        showToast('Attendance Marked!', 'success');
        Api.invalidate(); // Clear cache to refresh UI
        setTimeout(() => loadDashboard(), 1000);
      } else {
        showToast(d.error || 'Failed to submit', 'error');
      }
    } catch (e) {
      showToast('Network Error', 'error');
    } finally {
      Loading.hide();
    }
  }
  
  // =============================================
  // ██████  POLICE PAGE (Dedicated)
  // =============================================
  
  // =============================================
  // ██████  POLICE PAGE (Simplified Integrity)
  // =============================================
  
  function renderPolicePage() {
    const container = $('policeContent');
    if (!container) return;
  
    const a = STATE.data?.agent;
    if (!a) return;
  
    const pol = a.policeStatus || {};
    const resultsReleased = pol.resultsReleased === true;
    
    // If results not released yet, always show 0 to the user
    const reports = resultsReleased ? (pol.confirmedReports || 0) : 0;
    const max = pol.maxAllowed || 3;
    const severity = reports === 0 ? 'clean' : reports < max ? 'warning' : 'exceeded';
    
    const sConfig = {
      'clean': { 
        color: 'var(--green)', 
        icon: '🛡️', 
        title: 'INTEGRITY CLEAR', 
        bg: 'linear-gradient(135deg, rgba(0,255,102,0.05), var(--bg-panel))', 
        border: 'var(--green-border)' 
      },
      'warning': { 
        color: 'var(--courage-amber)', 
        icon: '⚠️', 
        title: 'WARNING ISSUED', 
        bg: 'linear-gradient(135deg, rgba(255,149,0,0.05), var(--bg-panel))', 
        border: 'rgba(255,149,0,0.3)' 
      },
      'exceeded': { 
        color: 'var(--fail)', 
        icon: '🚨', 
        title: 'LIMIT EXCEEDED', 
        bg: 'linear-gradient(135deg, rgba(255,59,92,0.1), var(--bg-panel))', 
        border: 'var(--red-border)' 
      }
    };
    
    const s = sConfig[severity];
  
    let html = renderGuide('police') || '';
    html += renderNarrativeCard('police') || '';

    // If results haven't been released by admin yet, show a notice
    if (!resultsReleased) {
      html += `
        <div style="padding:14px 18px; border-radius:12px; margin-bottom:20px; background:rgba(255,149,0,0.06); border:1px solid rgba(255,149,0,0.2); display:flex; gap:12px; align-items:center;">
          <span style="font-size:20px;">\uD83D\uDD12</span>
          <div>
            <div style="font-size:11px; font-weight:800; color:var(--courage-amber); text-transform:uppercase; letter-spacing:1px;">Results Pending</div>
            <div style="font-size:11px; color:var(--text-secondary); margin-top:3px;">Police reports are reviewed by admin on Sunday. Your record will be finalised when results are officially released.</div>
          </div>
        </div>
      `;
    }
  
    // 1. MAIN STATUS CARD
    html += `
      <div class="archive-card" style="padding:30px 20px; text-align:center; margin-bottom:24px; background:${s.bg}; border-top:4px solid ${s.color};">
        <div style="font-size:48px; margin-bottom:16px; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.3));">${s.icon}</div>
        
        <div style="font-size:40px; font-weight:900; font-family:'Share Tech Mono', monospace; color:${s.color}; line-height:1; margin-bottom:12px; text-shadow:0 0 20px ${severity==='clean' ? 'rgba(0,255,102,0.3)' : 'rgba(255,59,92,0.3)'};">
          ${reports} <span style="font-size:18px; color:var(--text-muted);">/ ${max}</span>
        </div>
        
        <div style="font-size:14px; font-weight:900; color:${s.color}; letter-spacing:2px; text-transform:uppercase; font-family:'Orbitron', sans-serif;">
          ${s.title}
        </div>
        
        <div style="font-size:11px; color:var(--text-secondary); margin-top:8px;">
          Confirmed violations recorded against Agent ${a.agentNo}
        </div>
      </div>
    `;
  
    // 2. STRIKE INDICATOR VISUAL
    html += `
      <div class="glass-card" style="padding:20px; margin-bottom:24px;">
        <div style="font-size:10px; font-weight:800; color:var(--text-ghost); text-transform:uppercase; letter-spacing:2px; margin-bottom:16px; text-align:center;">Violation Record</div>
        
        <div style="display:flex; gap:16px; justify-content:center; max-width:240px; margin:0 auto;">
          ${[0, 1, 2].map(i => `
            <div style="
              flex:1; aspect-ratio:1; border-radius:12px; 
              background:${i < reports ? 'var(--red-whisper)' : 'rgba(255,255,255,0.02)'}; 
              border:2px solid ${i < reports ? 'var(--fail)' : 'var(--border-subtle)'}; 
              display:flex; align-items:center; justify-content:center; 
              font-size:24px; transition:all 0.3s; 
              ${i < reports ? 'box-shadow:inset 0 0 20px rgba(255,59,92,0.3), 0 0 15px rgba(255,59,92,0.2); animation:pulseBorder 2s infinite;' : ''}
            ">
              ${i < reports ? '🚨' : '<span style="color:var(--text-ghost); font-weight:900;">—</span>'}
            </div>
          `).join('')}
        </div>
        
        <div style="text-align:center; font-size:10px; color:var(--text-muted); margin-top:20px; line-height:1.6;">
          If a playlist violation is found in your screenshot, a strike is added.<br>
          <strong style="color:var(--fail);">3 Strikes = Immediate Mission Failure for the Team.</strong>
        </div>
      </div>
    `;
  
    // 3. HOW TO AVOID A REPORT (Direct & Simple)
    html += `
      <div class="archive-card" style="padding:24px 20px; border-left:3px solid var(--gold-core);">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
          <span style="font-size:20px;">💡</span>
          <div style="font-size:12px; font-weight:900; color:#fff; text-transform:uppercase; letter-spacing:2px; font-family:'Orbitron', sans-serif;">How to Avoid a Report</div>
        </div>
        
        <div style="font-size:11px; color:var(--text-secondary); line-height:1.6; margin-bottom:12px;">
          The Police check screenshots to make sure everyone is streaming correctly. To stay safe:
        </div>
  
        <ul style="margin:0; padding-left:20px; color:var(--text-secondary); font-size:11px; line-height:1.8;">
          <li style="margin-bottom:8px;"><strong>Use the given playlists:</strong> Only use official playlists found in the <span style="color:var(--wave-foam); font-weight:bold;">Playlist GC</span>.</li>
          <li style="margin-bottom:8px;"><strong>Want a custom playlist?</strong> Submit a request to the Playlist Makers via the form on the Playlists page.</li>
          <li><strong>Using outside playlists?</strong> Before using a playlist from somewhere else, get it checked and approved in the Main GC.</li>
        </ul>
        
        <div style="margin-top:20px; display:flex; gap:12px;">
          <button onclick="goTo('playlists')" class="btn-outline" style="flex:1; border-color:var(--gold-core); color:var(--gold-core); font-size:10px;">Go to Playlists</button>
          <button onclick="goTo('gclinks')" class="btn-outline" style="flex:1; font-size:10px;">Go to GCs</button>
        </div>
      </div>
    `;
  
    container.innerHTML = html;
  }
  // =============================================
  // ██████  PLAYLISTS PAGE
  // =============================================
  
  window.toggleMakerPanel = function() {
      const form = document.getElementById('maker-form');
      const arrow = document.getElementById('maker-arrow');
      if (!form) return;
      
      if (form.style.display === 'none' || form.style.display === '') {
          form.style.display = 'block';
          if(arrow) arrow.style.transform = 'rotate(180deg)';
      } else {
          form.style.display = 'none';
          if(arrow) arrow.style.transform = 'rotate(0deg)';
      }
  };
  
  async function renderPlaylists() {
      const container = $('playlistsContent');
      if (!container) return;
  
      // Platform Icons Helper
      const getPlatformIcon = (plat) => {
          if(plat === 'Spotify') return '<span style="color:#1DB954">🎧</span>';
          if(plat === 'Apple Music') return '<span style="color:#FA243C">🍎</span>';
          if(plat === 'YouTube') return '<span style="color:#FF0000">▶️</span>';
          return '🎵';
      };
  
      container.innerHTML = `
          ${renderGuide('playlists') || ''}
          
          <!-- Maker Panel -->
          <div class="archive-card" style="margin-bottom:20px; border-color:var(--vinyl-gold);">
              <div style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;" onclick="window.toggleMakerPanel()">
                  <div style="display:flex; align-items:center; gap:10px;">
                      <span style="font-size:20px;">💿</span>
                      <div>
                          <div style="font-size:13px; font-weight:800; color:var(--vinyl-gold); text-transform:uppercase; letter-spacing:1px;">Playlist Maker Terminal</div>
                          <div style="font-size:9px; color:var(--text-muted);">Authorized Makers Only</div>
                      </div>
                  </div>
                  <span id="maker-arrow" style="color:var(--vinyl-gold); transition:transform 0.3s ease; font-size:12px;">▼</span>
              </div>
              
              <div id="maker-form" style="display:none; padding-top:16px; margin-top:12px; border-top:1px dashed rgba(212,175,55,0.3);">
                  <div style="display:grid; gap:12px;">
                      <div>
                          <label class="label-tag">Playlist Name</label>
                          <input type="text" id="pl-name" placeholder="e.g. Focus V1" class="input-field">
                      </div>
                      <div>
                          <label class="label-tag">Playlist URL</label>
                          <input type="text" id="pl-url" placeholder="https://..." class="input-field">
                      </div>
                      
                      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                          <div>
                              <label class="label-tag">Platform</label>
                              <select id="pl-platform" class="input-field">
                                  <option value="Spotify">Spotify</option>
                                  <option value="Apple Music">Apple Music</option>
                                  <option value="YouTube">YouTube</option>
                              </select>
                          </div>
                          <div>
                              <label class="label-tag">Target Team</label>
                              <select id="pl-team" class="input-field">
                                  <option value="All">All Teams</option>
                                  ${Object.keys(CONFIG.TEAMS || {}).map(t => `<option value="${t}">${t}</option>`).join('')}
                              </select>
                          </div>
                      </div>
  
                      <div>
                          <label class="label-tag" style="color:var(--red-core)">Maker Password</label>
                          <input type="password" id="pl-password" placeholder="🔒 Authentication required" class="input-field" style="border-color:rgba(255,20,95,0.3);">
                      </div>
                      
                      <button onclick="submitNewPlaylist()" class="btn-red" style="margin-top:8px;">
                          Publish to Network
                      </button>
                  </div>
              </div>
          </div>
          
          <!-- Request System -->
          <div class="glass-card" style="padding:16px; margin-bottom:20px; border-left:3px solid var(--wave-foam); text-align:center;">
              <div style="font-size:12px; font-weight:800; color:var(--wave-foam); margin-bottom:6px; text-transform:uppercase; letter-spacing:1px;">📝 Request a Playlist</div>
              <p style="font-size:10px; color:var(--text-muted); margin:0 0 12px 0;">Need a specific mix? Submit a request to the maker team.</p>
              <a href="https://forms.gle/hwHMSDxVjNhcLh1U6" target="_blank" class="btn-outline" style="display:inline-block; width:auto; padding:8px 20px; font-size:10px; text-decoration:none;">Open Request Form</a>
          </div>
  
          <!-- Official Playlists -->
          <div class="section-label">🎵 Official Playlists</div>
          <div id="playlists-list" style="display:flex; flex-direction:column; gap:10px;">
              <div style="text-align:center; padding:30px; color:var(--text-muted);"><div class="spinner" style="margin:0 auto 10px;"></div>Loading database...</div>
          </div>
      `;
  
      // Fetch Lists
      try {
          const data = await Api.call('getPlaylists', {}, { cache: true, ttl: 60_000 });
          const playlists = data.playlists || [];
          const listEl = $('playlists-list');
          
          if (playlists.length > 0) {
              playlists.reverse(); 
              
              listEl.innerHTML = playlists.map(pl => {
                  const link = pl.link || pl.url || '#'; 
                  const name = pl.name || 'Untitled Playlist';
                  const platform = pl.platform || 'Spotify';
                  const team = pl.team || 'All';
                  const tColor = team === 'All' ? 'var(--wave-foam)' : teamColor(team);
  
                  return `
                  <a href="${sanitize(link)}" target="_blank" style="text-decoration:none;">
                      <div class="glass-card" style="padding:14px; display:flex; align-items:center; gap:14px; transition:transform 0.2s, border-color 0.2s;" onmouseover="this.style.borderColor='${tColor}'" onmouseout="this.style.borderColor='var(--border-light)'">
                          <div style="width:40px; height:40px; border-radius:8px; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; border:1px solid var(--border-subtle);">
                              ${getPlatformIcon(platform)}
                          </div>
                          <div style="flex:1;">
                              <div style="color:#fff; font-size:13px; font-weight:700; margin-bottom:4px;">${sanitize(name)}</div>
                              <div style="display:flex; gap:6px; font-size:9px; font-weight:700;">
                                  <span style="background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px; color:var(--text-muted);">${sanitize(platform)}</span>
                                  <span style="background:${tColor}22; color:${tColor}; padding:2px 6px; border-radius:4px;">${team === 'All' ? '🌍 All Teams' : sanitize(team)}</span>
                              </div>
                          </div>
                          <div style="color:var(--text-ghost); font-size:16px;">›</div>
                      </div>
                  </a>
              `}).join('');
          } else {
              listEl.innerHTML = `<div class="glass-card" style="text-align:center; padding:30px; color:var(--text-muted); font-size:11px;">No playlists available in database.</div>`;
          }
      } catch (e) {
          $('playlists-list').innerHTML = `<div style="text-align:center; padding:20px; color:var(--fail); font-size:11px;">Failed to load network.</div>`;
      }
  }
  
  window.submitNewPlaylist = async function() {
      const nameInput = $('pl-name');
      const urlInput = $('pl-url');
      const platformInput = $('pl-platform');
      const teamInput = $('pl-team');
      const passwordInput = $('pl-password');
      
      if (!nameInput || !urlInput || !passwordInput) return;
  
      const name = nameInput.value.trim();
      const url = urlInput.value.trim();
      const platform = platformInput.value;
      const team = teamInput.value;
      const password = passwordInput.value.trim();
      
      if (!name || !url || !password) {
          showToast('Fill all required fields', 'error');
          return;
      }
  
      Loading.show();
  
      try {
          const result = await Api.call('addPlaylist', {
              password: password,
              name: name,
              url: url,
              platform: platform,
              type: 'Playlist',
              team: team,
              targetWeek: STATE.week || 'Week 1'
          }, { dedupe: false, cache: false });
  
          if (result.success) {
              showToast('Playlist Published', 'success');
              
              // Clear Form
              nameInput.value = '';
              urlInput.value = '';
              passwordInput.value = '';
              
              window.toggleMakerPanel();
              Api.invalidate('getPlaylists');
              renderPlaylists();
          } else {
              showToast(result.error || 'Authentication Failed', 'error');
          }
      } catch (e) {
          showToast('Network Error', 'error');
      } finally {
          Loading.hide();
      }
  }
  // =============================================
  // ██████  GC LINKS PAGE
  // =============================================
  
  async function renderGCLinks() {
  const container = $('gclinksContent');
  if (!container || !STATE.data) return;

  const team = STATE.data.agent?.profile?.team || 'Unknown';
  const tColor = teamColor(team);

  const teamLink = CONFIG.GC_LINKS?.teams?.[team] || '';
  const mainLink = CONFIG.GC_LINKS?.main || '';
  const plLink   = CONFIG.GC_LINKS?.playlist || '';

  container.innerHTML = `
    ${renderGuide('gc-links') || ''}

    <div style="display:grid; gap:16px; margin-top:20px;">

      <!-- ── TEAM GC ── -->
      <div class="archive-card" style="border-top:4px solid ${tColor};">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:15px;">
          <div style="width:40px; height:40px; border-radius:50%; background:${tColor}22; color:${tColor}; display:flex; align-items:center; justify-content:center; font-size:20px; border:1px solid ${tColor}44;">
            ${teamEmoji(team)}
          </div>
          <div>
            <h4 style="margin:0; font-size:14px; color:#fff;">${team.toUpperCase()} GC</h4>
            <p style="margin:2px 0 0 0; font-size:10px; color:var(--text-muted);">Secure team comms & Proofs</p>
          </div>
        </div>

        <div style="padding:10px; background:rgba(255,255,255,0.02); border-radius:6px; font-size:10px; color:var(--text-muted); margin-bottom:12px; line-height:1.5;">
          ⚠️ Mandatory: You must post your Spotify listening history screenshots here every weekend before submitting them to the Police.
        </div>

        ${teamLink
          ? `<a href="${teamLink}" target="_blank" class="btn-red" style="display:block; text-align:center; text-decoration:none; background:${tColor}; color:#000; font-weight:900;">
              ENTER TEAM COMM-LINK →
            </a>`
          : `<div class="btn-outline" style="display:block; text-align:center; opacity:0.5; border-color:${tColor}; color:${tColor}; cursor:default;">
              Link Unavailable
            </div>`
        }
      </div>

      <!-- ── PLAYLIST CHANNEL ── -->
      <div class="glass-card" style="padding:16px; border-left:4px solid var(--wave-foam);">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:15px;">
          <span style="font-size:24px;">💿</span>
          <div>
            <h4 style="margin:0; font-size:14px; color:#fff;">PLAYLIST CHANNEL</h4>
            <p style="margin:2px 0 0 0; font-size:10px; color:var(--text-muted);">Get official mission playlists here</p>
          </div>
        </div>
        ${plLink
          ? `<a href="${plLink}" target="_blank" class="btn-outline" style="display:block; text-align:center; text-decoration:none; border-color:var(--wave-foam); color:var(--wave-foam);">VIEW PLAYLISTS →</a>`
          : `<div class="btn-outline" style="display:block; text-align:center; opacity:0.5; border-color:var(--wave-foam); color:var(--wave-foam); cursor:default;">Link Unavailable</div>`
        }
      </div>

      <!-- ── MAIN GC ── -->
      <div class="glass-card" style="padding:16px; border-left:4px solid var(--vinyl-gold);">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:15px;">
          <span style="font-size:24px;">🌍</span>
          <div>
            <h4 style="margin:0; font-size:14px; color:#fff;">MAIN GC</h4>
            <p style="margin:2px 0 0 0; font-size:10px; color:var(--text-muted);">Join here for battle updates</p>
          </div>
        </div>
        ${mainLink
          ? `<a href="${mainLink}" target="_blank" class="btn-outline" style="display:block; text-align:center; text-decoration:none; border-color:var(--vinyl-gold); color:var(--vinyl-gold);">OPEN MAIN GC →</a>`
          : `<div class="btn-outline" style="display:block; text-align:center; opacity:0.5; border-color:var(--vinyl-gold); color:var(--vinyl-gold); cursor:default;">Link Unavailable</div>`
        }
      </div>

    </div>

    <!-- ── NOT ADDED YET ── -->
    <div style="margin-top:24px; padding:16px; background:rgba(255,20,95,0.05); border:1px dashed rgba(255,20,95,0.3); border-radius:8px; text-align:center;">
      <div style="font-size:20px; margin-bottom:8px;">💜</div>
      <p style="margin:0; color:rgba(255,255,255,0.8); font-size:11px; line-height:1.6;">
        <strong>Not added to a GC yet?</strong><br>
        Don't panic. Check your daily missions here on the dashboard. We will add you soon.
      </p>
    </div>
  `;
}
// =============================================
// ██████  MAGIC SHIP — ARIRANG VOYAGE SYSTEM
// =============================================
// Collect 7 badges → Sail to BTS SWIM Concert

const VOYAGE_OVERLAY_ID = 'voyage-overlay';

// ─────────────────────────────────────────────
// SECTION 1: BADGE & POSITION CONSTANTS
// ─────────────────────────────────────────────


// Circular positions around the army bomb lightstick
const AB_POSITIONS = (() => {
  const radius = 140;
  const centerX = 50; // percent
  const centerY = 46; // percent
  return ARMY_BOMB_BADGES.map((_, i) => {
    const angle = (i / 7) * 360 - 90;
    const x = Math.cos(angle * Math.PI / 180) * radius;
    const y = Math.sin(angle * Math.PI / 180) * radius;
    return {
      left: `calc(${centerX}% + ${x}px - 44px)`,
      top: `calc(${centerY}% + ${y}px - 44px)`,
    };
  });
})();


// ─────────────────────────────────────────────
// SECTION 2: HELPER
// ─────────────────────────────────────────────

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}



// ─────────────────────────────────────────────
// SECTION 3: renderArmyBombSection()
// ─────────────────────────────────────────────

function renderArmyBombSection(badgeStates, chargePercent, isAwakened) {
  const collected = badgeStates.filter(b => b.passed).length;
  const total = badgeStates.length;

  const badgesHtml = badgeStates.map((badge) => {
    const pos = badge.position || {};
    const statusText = badge.passed
      ? '✓ ABOARD THE ARIRANG'
      : `🔒 Keep streaming to unlock`;
    const descText = badge.passed
      ? `<span style="color:var(--green); font-weight:800;">MISSION SECURED:</span> ${escHtml(badge.importance)}`
      : `<span style="color:var(--red-core); font-weight:800;">REQUIRED:</span> ${escHtml(badge.req)}`;

    return `
      <div class="ab-badge" style="left:${pos.left};top:${pos.top}" tabindex="0">
        <div class="ab-dot ${badge.passed ? 'ab-dot--unlocked' : 'ab-dot--locked'}">
          <div class="ab-dot__inner" style="
            ${badge.passed ? `background: linear-gradient(135deg, ${badge.color}22, ${badge.color}44);` : ''}
          ">
            <span class="ab-dot__icon">${badge.icon}</span>
          </div>
          <div class="ab-icon">${badge.passed ? '✓' : '🔒'}</div>
        </div>
        <div class="ab-name">${escHtml(badge.name)}</div>
        <div class="ab-tooltip">
          <div class="ab-tooltip__title">${escHtml(badge.name)}</div>
          <div class="ab-tooltip__status" style="color:${badge.passed ? badge.color : '#888'}">${statusText}</div>
          <div class="ab-tooltip__desc">${descText}</div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="ab-wrap">
      <div class="ab-head">
        <div class="ab-progress">ARIRANG CREW: ${collected}/${total} ABOARD</div>
        <div class="ab-sub">Complete milestones to unlock each member and set sail</div>
        <div class="ab-feature-row">
          <span class="ab-feature ab-feature--purple">⛵ Ship Voyage</span>
        </div>
      </div>

      <div class="ab-layout">
        <!-- Energy Ring -->
        <div class="ab-energy" style="--charge:${chargePercent}"></div>

        <!-- Army Bomb Lightstick -->
        <div class="ab-lightstick ${isAwakened ? 'ab-lightstick--active' : ''}">
          <div class="ab-globe">
            <div class="ab-logo"></div>
          </div>
          <div class="ab-button"></div>
          <div class="ab-neck"></div>
          <div class="ab-handle"></div>
          <div class="ab-base"></div>
        </div>

        <!-- Member Badges -->
        ${badgesHtml}

        <!-- Charge label -->
        <div class="ab-charge-label">${chargePercent}%</div>
      </div>
    </div>
  `;
}


// ─────────────────────────────────────────────
// SECTION 4: renderArirangShip()
// 4-masted schooner with "Arirang" on hull
// ─────────────────────────────────────────────

function renderArirangShip(isAwakened) {
  const shipState = isAwakened ? 'awakened' : 'locked';

  // Generate stars
  const starsHtml = Array.from({ length: 20 }, () => {
    const size = (Math.random() * 2 + 1).toFixed(1);
    const top = (Math.random() * 90).toFixed(1);
    const left = (Math.random() * 95).toFixed(1);
    const delay = (Math.random() * 3).toFixed(2);
    return `<div class="arirang__star" style="--size:${size}px;top:${top}%;left:${left}%;--delay:${delay}s"></div>`;
  }).join('');

  // Generate waves
  const wavesHtml = Array.from({ length: 6 }, (_, i) =>
    `<div class="arirang__wave" style="--i:${i}"></div>`
  ).join('');

  // Generate reflections
  const reflectionsHtml = Array.from({ length: 5 }, (_, i) =>
    `<div class="arirang__reflection" style="left:${15 + i * 18}%;--delay:${(i * 0.4).toFixed(1)}s"></div>`
  ).join('');

  // Generate particles
  const particlesHtml = Array.from({ length: 12 }, (_, i) =>
    `<div class="arirang__particle" style="--i:${i}"></div>`
  ).join('');

  // 7 crew members
  const crewHeights = [11, 13, 14, 13, 12, 14, 11];
  const crewHtml = crewHeights.map((h, i) => `
    <div class="arirang__crew-member ${isAwakened ? 'arirang__crew-member--active' : ''}"
         style="--h:${h}px"
         title="${ARMY_BOMB_BADGES[i]?.name || 'Member'}">
    </div>
  `).join('');

  return `
    <div class="arirang arirang--${shipState}">

      <!-- ═══ SKY ═══ -->
      <div class="arirang__sky">
        <div class="arirang__clouds">
          <div class="arirang__cloud arirang__cloud--1"></div>
          <div class="arirang__cloud arirang__cloud--2"></div>
          <div class="arirang__cloud arirang__cloud--3"></div>
        </div>
        <div class="arirang__stars">${starsHtml}</div>
        <div class="arirang__horizon-glow"></div>
        <div class="arirang__sun"></div>
      </div>

      <!-- ═══ OCEAN ═══ -->
      <div class="arirang__ocean">
        <div class="arirang__waves">${wavesHtml}</div>
        <div class="arirang__reflections">${reflectionsHtml}</div>
        <div class="arirang__ship-reflection"></div>
      </div>

      <!-- ═══════════════════════════════════════
           THE ARIRANG — 4-Masted Schooner
           ═══════════════════════════════════════ -->
      <div class="arirang__ship">

        <!-- Magical aura under ship -->
        <div class="arirang__ship-aura"></div>

        <!-- Light beams from mast tops -->
        <div class="arirang__light-beam arirang__light-beam--1"></div>
        <div class="arirang__light-beam arirang__light-beam--2"></div>
        <div class="arirang__light-beam arirang__light-beam--3"></div>

        <!-- ─── SAILS ─── -->
        <!-- Gaff sails (between masts) -->
        <div class="arirang__sail arirang__sail--gaff-1">
          <div class="arirang__sail-fold"></div>
        </div>
        <div class="arirang__sail arirang__sail--gaff-2">
          <div class="arirang__sail-fold"></div>
        </div>
        <div class="arirang__sail arirang__sail--gaff-3">
          <div class="arirang__sail-fold"></div>
        </div>
        <!-- Jib sails (front triangular) -->
        <div class="arirang__sail arirang__sail--jib"></div>
        <div class="arirang__sail arirang__sail--jib-inner"></div>

        <!-- ─── 4 MASTS with lanterns ─── -->
        <div class="arirang__mast arirang__mast--1"><div class="arirang__lantern"></div></div>
        <div class="arirang__mast arirang__mast--2"><div class="arirang__lantern"></div></div>
        <div class="arirang__mast arirang__mast--3"><div class="arirang__lantern"></div></div>
        <div class="arirang__mast arirang__mast--4"><div class="arirang__lantern"></div></div>

        <!-- ─── CROSS-TREES ─── -->
        <div class="arirang__xtree arirang__xtree--1"></div>
        <div class="arirang__xtree arirang__xtree--2"></div>
        <div class="arirang__xtree arirang__xtree--3"></div>
        <div class="arirang__xtree arirang__xtree--4"></div>

        <!-- ─── GAFFS (top boom of gaff sails) ─── -->
        <div class="arirang__gaff arirang__gaff--1"></div>
        <div class="arirang__gaff arirang__gaff--2"></div>
        <div class="arirang__gaff arirang__gaff--3"></div>

        <!-- ─── BOOMS (bottom of gaff sails) ─── -->
        <div class="arirang__boom arirang__boom--1"></div>
        <div class="arirang__boom arirang__boom--2"></div>
        <div class="arirang__boom arirang__boom--3"></div>

        <!-- ─── RIGGING (thin rope lines) ─── -->
        <div class="arirang__rig arirang__rig--s1"></div>
        <div class="arirang__rig arirang__rig--s2"></div>
        <div class="arirang__rig arirang__rig--s3"></div>
        <div class="arirang__rig arirang__rig--s4"></div>
        <div class="arirang__rig arirang__rig--s5"></div>
        <div class="arirang__rig arirang__rig--s6"></div>
        <div class="arirang__rig arirang__rig--f1"></div>
        <div class="arirang__rig arirang__rig--f2"></div>

        <!-- ─── HULL — single smooth piece ─── -->
        <div class="arirang__hull">
          <div class="arirang__hull-stripe arirang__hull-stripe--top"></div>
          <div class="arirang__hull-stripe arirang__hull-stripe--mid"></div>
          <div class="arirang__hull-stripe arirang__hull-stripe--bottom"></div>

          <!-- Ship name ON the hull between stripes -->
          <div class="arirang__hull-text">Arirang</div>

          <!-- Lit port windows -->
          <div class="arirang__porthole" style="left:14%"></div>
          <div class="arirang__porthole" style="left:26%"></div>
          <div class="arirang__porthole" style="left:38%"></div>
          <div class="arirang__porthole" style="left:50%"></div>
          <div class="arirang__porthole" style="left:62%"></div>

          <!-- Anchor -->
          <div class="arirang__anchor">⚓</div>
        </div>

        <!-- Hull underwater shadow -->
        <div class="arirang__hull-shadow"></div>

        <!-- Magical waterline glow -->
        <div class="arirang__waterline-glow"></div>

        <!-- Bowsprit (pole at front) -->
        <div class="arirang__bowsprit"></div>

        <!-- ─── DECK ─── -->
        <div class="arirang__deck">
          <div class="arirang__railing"></div>
          <div class="arirang__crew">${crewHtml}</div>
        </div>

        <!-- ─── WAKE / FOAM ─── -->
        <div class="arirang__wake">
          <div class="arirang__wake-foam arirang__wake-foam--1"></div>
          <div class="arirang__wake-foam arirang__wake-foam--2"></div>
          <div class="arirang__wake-foam arirang__wake-foam--3"></div>
          <div class="arirang__wake-foam arirang__wake-foam--4"></div>
        </div>

        <!-- Bow wave -->
        <div class="arirang__bow-wave"></div>

        <!-- Purple BTS flag -->
        <div class="arirang__flag">
          <div class="arirang__flag-design"></div>
        </div>
      </div>

      <!-- Magical particles -->
      <div class="arirang__particles">${particlesHtml}</div>

      <!-- Bottom label -->
      <div class="arirang__label">
        <span class="arirang__label-icon">${isAwakened ? '⛵' : '🔒'}</span>
        ${isAwakened
          ? 'THE ARIRANG IS READY TO SAIL'
          : 'COLLECT ALL 7 CREW TO SET SAIL'
        }
      </div>
    </div>
  `;
}


// ─────────────────────────────────────────────
// SECTION 5: renderActionSection()
// ─────────────────────────────────────────────

function renderActionSection(collected, total, isAwakened) {
  const remaining = total - collected;

  return `
    <div class="ms-card ms-status-card">
      <div class="ms-status-label">Voyage Status</div>
      <div class="ms-status-value ${isAwakened ? '' : 'ms-status-value--muted'}">
        ${isAwakened
          ? '⛵ ALL 7 CREW ABOARD'
          : `⏳ ${remaining} MEMBER${remaining !== 1 ? 'S' : ''} REMAINING`
        }
      </div>
    </div>

    <div class="ms-action-section">
      <div class="ms-status-msg ${isAwakened ? 'ms-status-msg--on' : 'ms-status-msg--off'}">
        ${isAwakened
          ? '✦ The Arirang awaits your command, Captain ARMY ✦'
          : `${collected}/${total} crew aboard · Stream Arirang to unlock all members`
        }
      </div>
      <button class="ms-launch-btn"
              data-action="launch-voyage"
              ${isAwakened ? '' : 'disabled'}
              ${isAwakened ? '' : 'style="opacity:0.35;cursor:not-allowed;box-shadow:none;"'}>
        ${isAwakened ? '⛵ SET SAIL TO SWIM CONCERT' : `🔒 COLLECT ALL ${total} CREW`}
      </button>
    </div>
  `;
}


// ─────────────────────────────────────────────
// SECTION 6: renderMagicShip() — Main render
// (connects to your app STATE)
// ─────────────────────────────────────────────

function renderMagicShip() {
  if (!STATE.data) return;

  const container = $('magicShipContent');
  if (!container) return;

  ensureMagicShipStyles();

  const tc = STATE.data.teamComparison || [];
  const myTeamName = STATE.data.agent?.profile?.team;

  // Guard: no team assigned
  if (!myTeamName) {
    container.innerHTML = `
      <div class="ms-card ms-status-card">
        <div class="ms-status-label">Vessel Status</div>
        <div class="ms-status-value ms-status-value--muted">
          No team assigned
        </div>
      </div>
    `;
    return;
  }

  // Find my team's data
  const myTeamData = tc.find(t => t.team === myTeamName) || {};

  // Build badge states from team data
  const badgeStates = ARMY_BOMB_BADGES.map((badge, i) => ({
    ...badge,
    passed: !!myTeamData[badge.key],
    position: AB_POSITIONS[i] || {},
    index: i,
  }));

  const collected = badgeStates.filter(b => b.passed).length;
  const total = badgeStates.length;
  const isAwakened = total > 0 && collected === total;
  const chargePercent = total > 0 ? Math.round((collected / total) * 100) : 0;

  // Build full page
  container.innerHTML = `
    <!-- Header Card -->
    <div class="ms-card ms-status-card">
      <div class="ms-status-label">Vessel Status</div>
      <div class="ms-status-value">${escHtml(myTeamName)}</div>
    </div>

    <!-- Army Bomb + Badge Collection -->
    ${renderArmyBombSection(badgeStates, chargePercent, isAwakened)}

    <!-- Arirang Ship Visualization -->
    ${renderArirangShip(isAwakened)}

    <!-- Action / Launch Section -->
    ${renderActionSection(collected, total, isAwakened)}
  `;

  // Wire up launch button
  const launchBtn = container.querySelector('[data-action="launch-voyage"]');
  if (launchBtn) {
    launchBtn.addEventListener('click', () => {
      if (typeof window.launchTheVoyage === 'function') {
        window.launchTheVoyage();
      } else {
        console.warn('launchTheVoyage not defined');
      }
    });
  }
}


// ─────────────────────────────────────────────
// SECTION 7: SWIM CONCERT HELPERS
// ─────────────────────────────────────────────

const SWIM_LYRICS = [
  { main: 'Swim, swim', sub: 'Water falling off your skin' },
  { main: 'Swim, swim', sub: 'I could spend a lifetime watching you' },
  { main: 'Swim, swim', sub: 'This is how it all begins' },
  { main: 'Swim, swim', sub: 'I just wanna dive, I just wanna dive' },

  { main: 'Bad world, gone away', sub: 'and I still wake up in this mad world' },
  { main: 'Name a place that I could breathe', sub: 'on this map, world' },
  { main: "Lookin' like a goody, goody", sub: 'in this bad world, bad world' },
  { main: "Don't know how to act, girl", sub: "I'm in the deep, tell me where the hell you at, girl?" },
  { main: "Oh, you ain't even gotta love me bad, girl", sub: "You know that I'm never holdin' back, girl. Yeah" },

  { main: "So easy, don't make it so hard", sub: 'Nights like these, I just wanna get lost' },
  { main: 'Right here with the moon and the sharks', sub: "I ain't gotta think 'bout a thing, baby, I just" },

  { main: 'Swim, swim', sub: 'Water falling off your skin' },
  { main: 'Swim, swim', sub: 'I could spend a lifetime watching you' },
  { main: 'Swim (Swim), swim (Swim)', sub: 'This is how it all begins' },
  { main: 'Swim, swim', sub: 'I just wanna dive, I just wanna dive' },

  { main: 'Water, water so deep, water so deep', sub: "Take it off the ground, I ain't never gettin' cold feet" },
  { main: 'Yeah, you know me, yeah, you know me', sub: "Sittin' on the shore, now I'm ready for the whole sea" },
  { main: "I can feel the high waves comin' (Yeah)", sub: "Why you run away? You can run in (Yeah)" },
  { main: "Salt on my tongue, she's stunnin' (Oh)", sub: "You're the only place that I wanna be, yeah" },

  { main: 'Swim, swim', sub: 'Water falling off your skin' },
  { main: 'Swim, swim', sub: 'I could spend a lifetime watching you' },
  { main: 'Swim (Swim), swim (Swim)', sub: 'This is how it all begins' },
  { main: 'Swim, swim', sub: 'I just wanna dive, I just wanna dive' },

  { main: 'Splash (Splash), drift (Drift)', sub: 'I make waves with my two fins (Two fins)' },
  { main: 'Splash (Woo), drip (Drip)', sub: 'I just wanna take it across the line' },
  { main: "Under here, we don't chase the time", sub: "Baby, everything can't be so sad (So sad)" },
  { main: 'Turn my face from the land', sub: 'I just wanna dive, I just wanna dive' },

  { main: 'Swim, swim', sub: 'Water falling off your skin' },
  { main: 'Swim, swim', sub: 'I could spend a lifetime watching you' },
  { main: 'Swim (Swim), swim (Swim)', sub: 'Let it all begin' },
  { main: 'Swim, swim', sub: 'I just wanna dive, I just wanna dive' }
];

const SWIM_PHASES = ['calm', 'deep', 'warm', 'bright'];

function generateBubbles(container, count = 25) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    b.className = 'swim-bubble';
    const size = 2 + Math.random() * 8;
    b.style.cssText = `
      left:${Math.random() * 100}%;
      width:${size}px; height:${size}px;
      animation-duration:${4 + Math.random() * 6}s;
      animation-delay:${Math.random() * 5}s;
    `;
    container.appendChild(b);
  }
}

function generateSwimmers(container) {
  if (!container) return;
  const configs = [
    { y: 55, speed: 18, delay: 0, dir: 'right' },
    { y: 38, speed: 22, delay: 3, dir: 'left' },
    { y: 68, speed: 15, delay: 6, dir: 'right' },
    { y: 30, speed: 25, delay: 1.5, dir: 'left' },
    { y: 62, speed: 20, delay: 4.5, dir: 'right' },
    { y: 45, speed: 17, delay: 7, dir: 'left' },
    { y: 74, speed: 23, delay: 2, dir: 'right' },
  ];
  configs.forEach((c, i) => {
    const el = document.createElement('div');
    el.className = `swim-swimmer swim-swimmer--${c.dir}`;
    el.style.cssText = `top:${c.y}%;--speed:${c.speed}s;animation-delay:${c.delay}s;`;
    el.innerHTML = '<div class="swim-swimmer__body"></div>';
    el.title = ARMY_BOMB_BADGES[i]?.name || `Member ${i + 1}`;
    container.appendChild(el);
  });
}

function triggerDiveTransition(root) {
  const dive = root.querySelector('.swim-dive');
  if (!dive) return;
  dive.classList.remove('swim-dive--hidden');

  const flash = dive.querySelector('.swim-dive__flash');
  setTimeout(() => flash?.classList.add('swim-dive__flash--active'), 100);

  const bubbles = dive.querySelector('.swim-dive__bubbles');
  if (bubbles) {
    for (let i = 0; i < 40; i++) {
      const b = document.createElement('div');
      b.className = 'swim-dive-bubble';
      const size = 4 + Math.random() * 15;
      b.style.cssText = `
        left:${Math.random() * 100}%;
        width:${size}px; height:${size}px;
        animation-delay:${Math.random() * 0.8}s;
        animation-duration:${1 + Math.random() * 1.2}s;
      `;
      bubbles.appendChild(b);
    }
  }
}

function startLyricCycle(root) {
  const mainEl = root.querySelector('.swim-lyrics__main');
  const subEl = root.querySelector('.swim-lyrics__sub');
  if (!mainEl || !subEl) return null;

  let index = 0;

  function showLyric() {
    const lyric = SWIM_LYRICS[index];

    // Fade out
    mainEl.classList.remove('swim-lyrics--visible');
    subEl.classList.remove('swim-lyrics--visible');

    setTimeout(() => {
      mainEl.textContent = lyric.main;
      subEl.textContent = lyric.sub || '';

      // Fade in
      mainEl.classList.add('swim-lyrics--visible');
      if (lyric.sub) subEl.classList.add('swim-lyrics--visible');

      index = (index + 1) % SWIM_LYRICS.length;
    }, 800);
  }

  showLyric();
  return setInterval(showLyric, 4000);
}

function handleSwimRipple(e, container) {
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Two expanding rings
  for (let r = 0; r < 2; r++) {
    const ring = document.createElement('div');
    ring.className = 'swim-ripple';
    ring.style.cssText = `left:${x}px;top:${y}px;animation-delay:${r * 0.15}s;`;
    container.appendChild(ring);
    setTimeout(() => ring.remove(), 1400);
  }

  // Particle burst
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('div');
    p.className = 'swim-ripple-particle';
    p.style.cssText = `left:${x}px;top:${y}px;`;
    container.appendChild(p);

    const angle = Math.random() * Math.PI * 2;
    const dist = 20 + Math.random() * 40;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;

    p.animate([
      { transform: 'translate(-50%,-50%) translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(-50%,-50%) translate(${tx}px,${ty}px) scale(0)`, opacity: 0 }
    ], { duration: 800, easing: 'ease-out', fill: 'forwards' });

    setTimeout(() => p.remove(), 850);
  }
}


// ─────────────────────────────────────────────
// SECTION 8: launchTheVoyage()
// ─────────────────────────────────────────────

window.launchTheVoyage = function () {
  const existing = document.getElementById(VOYAGE_OVERLAY_ID);
  if (existing) existing.remove();

  ensureVoyageStyles();

  const root = document.createElement('div');
  root.id = VOYAGE_OVERLAY_ID;
  root.className = 'vy-root';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Arirang Voyage — SWIM Concert');

  // Get agent name for personalization
  const stateRef = (typeof STATE !== 'undefined' ? STATE : (window.STATE || null));
  const agentName = stateRef?.data?.agent?.profile?.name || stateRef?.data?.agent?.profile?.agentNo || 'ARMY';

  root.innerHTML = `
    <!-- ═══ HEADER ═══ -->
    <div class="vy-header">
      <div style="font-family:'Orbitron',sans-serif; font-size:10px; color:rgba(0,180,220,0.8); letter-spacing:2px; font-weight:800;">
        ⚡ ARIRANG WAVE
      </div>
      <button class="vy-close" data-action="close-voyage" aria-label="Close voyage">✕</button>
    </div>

    <!-- ═══ THE ARIRANG SHIP ═══ -->
    <div class="vy-ship-container">
      <div class="vy-arirang-ship">
        <div class="vy-arirang__glow"></div>
        <div class="vy-arirang__sail vy-arirang__sail--g1"></div>
        <div class="vy-arirang__sail vy-arirang__sail--g2"></div>
        <div class="vy-arirang__sail vy-arirang__sail--g3"></div>
        <div class="vy-arirang__sail vy-arirang__sail--jib1"></div>
        <div class="vy-arirang__sail vy-arirang__sail--jib2"></div>
        <div class="vy-arirang__mast vy-arirang__mast--1"><div class="vy-arirang__lantern"></div></div>
        <div class="vy-arirang__mast vy-arirang__mast--2"><div class="vy-arirang__lantern"></div></div>
        <div class="vy-arirang__mast vy-arirang__mast--3"><div class="vy-arirang__lantern"></div></div>
        <div class="vy-arirang__mast vy-arirang__mast--4"><div class="vy-arirang__lantern"></div></div>
        <div class="vy-arirang__xtree" style="bottom:78%;left:14%;width:18%"></div>
        <div class="vy-arirang__xtree" style="bottom:84%;left:32%;width:20%"></div>
        <div class="vy-arirang__xtree" style="bottom:82%;left:53%;width:18%"></div>
        <div class="vy-arirang__xtree" style="bottom:72%;left:72%;width:16%"></div>
        <div class="vy-arirang__gaff" style="bottom:84%;left:14%;width:26%;transform:rotate(-30deg)"></div>
        <div class="vy-arirang__gaff" style="bottom:88%;left:34%;width:28%;transform:rotate(-28deg)"></div>
        <div class="vy-arirang__gaff" style="bottom:86%;left:56%;width:24%;transform:rotate(-32deg)"></div>
        <div class="vy-arirang__boom" style="bottom:48%;left:14%;width:28%;transform:rotate(-2deg)"></div>
        <div class="vy-arirang__boom" style="bottom:52%;left:34%;width:32%;transform:rotate(-1.5deg)"></div>
        <div class="vy-arirang__boom" style="bottom:50%;left:56%;width:26%;transform:rotate(-2deg)"></div>
        <div class="vy-arirang__rig" style="bottom:24%;left:16%;height:44%;transform:rotate(-12deg)"></div>
        <div class="vy-arirang__rig" style="bottom:24%;left:16%;height:56%;transform:rotate(-8deg)"></div>
        <div class="vy-arirang__rig" style="bottom:24%;left:36%;height:48%;transform:rotate(-10deg)"></div>
        <div class="vy-arirang__rig" style="bottom:24%;left:36%;height:60%;transform:rotate(-6deg)"></div>
        <div class="vy-arirang__rig" style="bottom:24%;left:58%;height:46%;transform:rotate(-11deg)"></div>
        <div class="vy-arirang__rig" style="bottom:24%;left:58%;height:58%;transform:rotate(-7deg)"></div>
        <div class="vy-arirang__rig" style="bottom:24%;left:76%;height:74%;transform:rotate(22deg)"></div>
        <div class="vy-arirang__rig" style="bottom:24%;left:76%;height:60%;transform:rotate(28deg)"></div>
        <div class="vy-arirang__hull">
          <div class="vy-arirang__hull-stripe" style="top:8%;left:5%;width:80%;height:7%"></div>
          <div class="vy-arirang__hull-stripe" style="top:40%;left:4%;width:83%;height:3%"></div>
          <div class="vy-arirang__hull-stripe" style="bottom:15%;left:3%;width:87%;height:6%"></div>
          <div class="vy-arirang__hull-name">Arirang</div>
          <div class="vy-arirang__port" style="left:12%"></div>
          <div class="vy-arirang__port" style="left:22%"></div>
          <div class="vy-arirang__port" style="left:32%"></div>
          <div class="vy-arirang__port" style="left:42%"></div>
          <div class="vy-arirang__port" style="left:52%"></div>
        </div>
        <div class="vy-arirang__bowsprit"></div>
        <div class="vy-arirang__deck"></div>
        <div class="vy-arirang__railing"></div>
        <div class="vy-arirang__crew">
          <div class="vy-arirang__person" style="--h:11px"></div>
          <div class="vy-arirang__person" style="--h:13px"></div>
          <div class="vy-arirang__person" style="--h:14px"></div>
          <div class="vy-arirang__person" style="--h:13px"></div>
          <div class="vy-arirang__person" style="--h:12px"></div>
          <div class="vy-arirang__person" style="--h:14px"></div>
          <div class="vy-arirang__person" style="--h:11px"></div>
        </div>
        <div class="vy-arirang__wake">
          <div class="vy-arirang__foam"></div>
          <div class="vy-arirang__foam"></div>
          <div class="vy-arirang__foam"></div>
        </div>
        <div class="vy-arirang__flag"></div>
      </div>
    </div>

    <!-- ═══ NARRATIVE (3 lines — during dive) ═══ -->
    <div class="vy-narrative vy-narrative--hidden">
      <div class="vy-narrative__line vy-narrative__line--1">
        <span class="vy-narrative__icon">⚡</span>
        ALL 7 CREW ABOARD THE ARIRANG
      </div>
      <div class="vy-narrative__line vy-narrative__line--2">
        <span class="vy-narrative__icon">🌊</span>
        THE ARIRANG DIVES INTO THE DEEP
      </div>
      <div class="vy-narrative__line vy-narrative__line--3">
        <span class="vy-narrative__icon">💫</span>
        I JUST WANNA DIVE
      </div>
    </div>

    <!-- ═══ OCEAN SURFACE (initial) ═══ -->
    <div class="vy-ocean">
      <div class="vy-ocean-dots"></div>
    </div>

    <!-- ═══ DIVE TRANSITION ═══ -->
    <div class="swim-dive swim-dive--hidden">
      <div class="swim-dive__flash"></div>
      <div class="swim-dive__bubbles"></div>
    </div>

    <!-- ═══ UNDERWATER CONCERT ═══ -->
    <div class="swim-underwater swim-underwater--hidden" id="concertStage">

      <!-- Starfield background -->
      <div class="cs-stars" id="csStars"></div>

      <!-- Soft ambient glow -->
      <div class="cs-ambient"></div>

      <!-- Water surface shimmer from ship above -->
      <div class="swim-surface">
        <div class="swim-surface__shimmer"></div>
        <div class="swim-surface__wave"></div>
        <div class="swim-ship-shadow"></div>
      </div>

      <!-- Concert Stage Layout -->
      <div class="cs-layout">

        <!-- Song info -->
        <div class="cs-song-info">
          <div class="cs-era-icon">🌸</div>
          <h2 class="cs-title">Swim</h2>
          <p class="cs-artist">BTS • Arirang Wave</p>
        </div>

        <!-- Your army bomb (foreground, controllable) -->
        <div class="cs-stage">
          <div class="cs-stage-glow"></div>
          <div class="cs-pivot" id="csPivot">
            <div class="cs-bomb">
              <div class="cs-sphere">
                <div class="cs-fill"></div>
                <span class="cs-logo">⟭⟬</span>
              </div>
              <div class="cs-handle"></div>
            </div>
          </div>
        </div>

        <!-- Lyrics area -->
        <div class="swim-lyrics">
          <div class="swim-lyrics__main"></div>
          <div class="swim-lyrics__sub"></div>
        </div>

        <!-- Crowd army bombs (JS-generated) -->
        <div class="cs-crowd" id="csCrowd"></div>

        <!-- Controls -->
        <div class="cs-controls">
          <div class="cs-ctrl-row cs-ctrl-patterns">
            <button class="cs-pat-btn active" data-val="slow-sway">〰️ Sway</button>
            <button class="cs-pat-btn" data-val="drift">🪐 Drift</button>
            <button class="cs-pat-btn" data-val="ocean">🌊 Ocean</button>
            <button class="cs-pat-btn" data-val="stars">✨ Stars</button>
            <button class="cs-pat-btn" data-val="flutter">🦋 Flutter</button>
          </div>
          <div class="cs-ctrl-row cs-ctrl-bottom">
            <div class="cs-speed-wrap">
              <span class="cs-label">Speed:</span>
              <button class="cs-speed-btn" data-spd="8">Slow</button>
              <button class="cs-speed-btn active" data-spd="4">Medium</button>
              <button class="cs-speed-btn" data-spd="1">Fast</button>
            </div>
            <div class="cs-color-wrap">
              <span class="cs-label">Color:</span>
              <button class="cs-col-btn active" data-col="#a855f7" style="background:#a855f7"></button>
              <button class="cs-col-btn" data-col="#e879f9" style="background:#e879f9"></button>
              <button class="cs-col-btn" data-col="#6366f1" style="background:#6366f1"></button>
              <button class="cs-col-btn" data-col="#22c55e" style="background:#22c55e"></button>
              <button class="cs-col-btn" data-col="#fbbf24" style="background:#fbbf24"></button>
              <button class="cs-col-btn cs-col-rainbow" data-col="rainbow">🌈</button>
            </div>
          </div>
        </div>

      </div><!-- /cs-layout -->

      <div class="swim-ripple-area"></div>
    </div>

    <!-- ═══ EXIT OVERLAY ═══ -->
    <div class="swim-exit">
      <div class="swim-exit__light"></div>
    </div>

    <!-- ═══ SPOTIFY PLAYER ═══ -->
    <div class="vy-player vy-player--hidden">
      <div class="vy-player-label">🎧 YOUR BOARDING PASS TO SWIM</div>
      <iframe class="vy-player-iframe" title="Spotify — SWIM"
        src="https://open.spotify.com/embed/track/68lbSrXDORS51pmyjZv712?utm_source=generator&theme=0"
        width="100%" height="80" frameBorder="0" allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"></iframe>
    </div>
  `;

  document.body.appendChild(root);

  // ── State ──
  let lyricInterval = null;
  let colorInterval = null;
  let colorIndex = 0;

  // ── Close handler ──
  function closeVoyage() {
    if (lyricInterval) clearInterval(lyricInterval);
    if (colorInterval) clearInterval(colorInterval);

    const exit = root.querySelector('.swim-exit');
    if (exit) exit.classList.add('swim-exit--active');

    const iframe = root.querySelector('iframe');
    if (iframe) iframe.src = '';

    setTimeout(() => {
      root.classList.remove('visible');
      root.addEventListener('transitionend', () => root.remove(), { once: true });
      setTimeout(() => { if (root.parentNode) root.remove(); }, 1500);
    }, 800);

    document.removeEventListener('keydown', onEsc);
  }

  const closeBtn = root.querySelector('[data-action="close-voyage"]');
  if (closeBtn) closeBtn.addEventListener('click', closeVoyage);

  function onEsc(e) { if (e.key === 'Escape') closeVoyage(); }
  document.addEventListener('keydown', onEsc);
  if (closeBtn) closeBtn.focus();

  // ── Concert Controls ──
  let _rainbowInterval = null;
  let _currentBPM = 80;
  let _currentMultiplier = 4;
  let _currentPattern = 'slow-sway';

  function updatePivotAnim() {
    const pivot = root.querySelector('#csPivot');
    if (!pivot) return;
    const dur = (60000 / _currentBPM) * _currentMultiplier;
    pivot.style.animation = `cs-${_currentPattern} ${dur}ms infinite ease-in-out`;
  }

  function setStageColor(color) {
    if (_rainbowInterval) { clearInterval(_rainbowInterval); _rainbowInterval = null; }
    if (color === 'rainbow') {
      const cols = ['#a855f7','#e879f9','#6366f1','#22c55e','#fbbf24','#ef4444','#3b82f6'];
      let idx = 0;
      _rainbowInterval = setInterval(() => {
        root.style.setProperty('--cs-theme', cols[idx]);
        idx = (idx + 1) % cols.length;
      }, 500);
    } else {
      root.style.setProperty('--cs-theme', color);
    }
  }

  root.querySelectorAll('.cs-pat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('.cs-pat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _currentPattern = btn.dataset.val;
      updatePivotAnim();
    });
  });

  root.querySelectorAll('.cs-speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('.cs-speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _currentMultiplier = parseFloat(btn.dataset.spd);
      updatePivotAnim();
    });
  });

  root.querySelectorAll('.cs-col-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('.cs-col-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setStageColor(btn.dataset.col);
    });
  });

  // Generate star background
  const starContainer = root.querySelector('#csStars');
  if (starContainer) {
    for (let i = 0; i < 60; i++) {
      const s = document.createElement('div');
      s.className = 'cs-star';
      s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s;--star-size:${1+Math.random()*2}px;`;
      starContainer.appendChild(s);
    }
  }

  // Generate crowd rows
  const crowd = root.querySelector('#csCrowd');
  if (crowd) {
    const rows = [
      { count: 11, size: 14, opacity: 0.25, delayBase: 0 },
      { count: 9, size: 19, opacity: 0.35, delayBase: 0.3 },
      { count: 7, size: 24, opacity: 0.45, delayBase: 0.6 },
    ];
    rows.forEach((row, ri) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'cs-crowd-row';
      for (let i = 0; i < row.count; i++) {
        const bomb = document.createElement('div');
        bomb.className = 'cs-crowd-bomb';
        const delay = (i * 0.18 + row.delayBase).toFixed(2);
        const dur = (2.5 + Math.random() * 2).toFixed(1);
        bomb.style.cssText = `--cb-size:${row.size}px;--cb-opacity:${row.opacity};animation-duration:${dur}s;animation-delay:${delay}s;`;
        bomb.innerHTML = `<div class="cs-cb-sphere"></div><div class="cs-cb-handle"></div>`;
        rowEl.appendChild(bomb);
      }
      crowd.appendChild(rowEl);
    });
  }

  // Initial animation
  setStageColor('#a855f7');
  setTimeout(() => updatePivotAnim(), 100);

  // ── Ripple interaction ──
  const rippleArea = root.querySelector('.swim-ripple-area');
  if (rippleArea) rippleArea.addEventListener('click', (e) => handleSwimRipple(e, rippleArea));

  // Phase 0: Fade in (0ms)
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('visible')));

  // Phase 1: Ship starts diving (500ms)
  setTimeout(() => {
    const sc = root.querySelector('.vy-ship-container');
    if (sc) sc.classList.add('vy-ship-container--diving');
  }, 500);

  // Phase 2: Narrative appears (1500ms)
  setTimeout(() => {
    const n = root.querySelector('.vy-narrative');
    if (n) { n.classList.remove('vy-narrative--hidden'); n.classList.add('vy-narrative--visible'); }
  }, 1500);

  [1500, 2500, 3500].forEach((t, i) => {
    setTimeout(() => {
      const line = root.querySelector(`.vy-narrative__line--${i + 1}`);
      if (line) line.classList.add('vy-narrative__line--visible');
    }, t);
  });

  // Phase 3: Dive transition — flash + bubbles (3800ms)
  setTimeout(() => triggerDiveTransition(root), 3800);

  // Phase 4: Narrative fades, ocean hides (4500ms)
  setTimeout(() => {
    const n = root.querySelector('.vy-narrative');
    if (n) { n.classList.remove('vy-narrative--visible'); n.classList.add('vy-narrative--fading'); }
    const ocean = root.querySelector('.vy-ocean');
    if (ocean) ocean.style.opacity = '0';
  }, 4500);

  // Phase 5: Concert appears (5000ms) — generate bubbles and show stage
  setTimeout(() => {
    const uw = root.querySelector('.swim-underwater');
    if (uw) uw.classList.add('swim-underwater--visible');
  }, 5000);

  // Phase 7: Welcome message (6200ms)
  setTimeout(() => {
    const welcome = root.querySelector('.swim-welcome');
    if (welcome) welcome.classList.remove('swim-welcome--hidden');
    setTimeout(() => { if (welcome) welcome.classList.add('swim-welcome--fading'); }, 3000);
  }, 6200);

  // Phase 8: Lyrics start cycling (7000ms)
  setTimeout(() => { lyricInterval = startLyricCycle(root); }, 7000);

  // Phase 9: Swimmers appear (7500ms)
  setTimeout(() => {
    generateSwimmers(root.querySelector('.swim-swimmers'));
    setTimeout(() => {
      root.querySelectorAll('.swim-swimmer').forEach(s => s.classList.add('swim-swimmer--visible'));
    }, 100);
  }, 7500);

  // Phase 10: Spotify player (8500ms)
  setTimeout(() => {
    const pl = root.querySelector('.vy-player');
    if (pl) pl.classList.remove('vy-player--hidden');
  }, 8500);

  // Phase 11: Color shift cycle (starts at 12s, shifts every 15s)
  setTimeout(() => {
    colorInterval = setInterval(() => {
      const uw = root.querySelector('.swim-underwater');
      if (!uw) return;
      SWIM_PHASES.forEach(p => uw.classList.remove(`swim-phase-${p}`));
      colorIndex = (colorIndex + 1) % SWIM_PHASES.length;
      uw.classList.add(`swim-phase-${SWIM_PHASES[colorIndex]}`);
    }, 15000);
  }, 12000);
};


// ─────────────────────────────────────────────
// SECTION 9: STYLE INJECTION
// ─────────────────────────────────────────────

function ensureMagicShipStyles() {
  if (document.getElementById('magic-ship-styles')) return;
  const style = document.createElement('style');
  style.id = 'magic-ship-styles';
  style.textContent = MAGIC_SHIP_CSS;
  document.head.appendChild(style);
}

function ensureVoyageStyles() {
  if (document.getElementById('voyage-styles')) return;
  const style = document.createElement('style');
  style.id = 'voyage-styles';
  style.textContent = VOYAGE_CSS + VOYAGE_SHIP_CSS + VOYAGE_SWIM_CSS;
  document.head.appendChild(style);
}


// ─────────────────────────────────────────────
// SECTION 10: CSS — MAGIC_SHIP_CSS
// (Page styles: cards, army bomb, ship scene)
// ─────────────────────────────────────────────

const MAGIC_SHIP_CSS = `

/* ── Page Cards ── */
.ms-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}
.ms-status-card { text-align: center; border-top: 3px solid var(--purple-core, #a78bfa); }
.ms-status-label { font-size: 10px; color: var(--purple-core, #a78bfa); font-weight: 900; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
.ms-status-value { font-size: 18px; font-weight: 900; color: #fff; font-family: 'Orbitron', sans-serif; }
.ms-status-value--muted { color: var(--text-muted, #888); }

.ms-action-section { margin-top: 20px; }
.ms-status-msg { text-align: center; font-size: 11px; letter-spacing: 0.5px; margin-bottom: 12px; }
.ms-status-msg--on { color: #c4b5fd; font-weight: 800; }
.ms-status-msg--off { color: var(--text-muted, #888); }

.ms-launch-btn {
  display: block; width: 100%; padding: 16px; border-radius: 12px; border: none;
  background: linear-gradient(135deg, var(--purple-core, #a78bfa), #7c3aed);
  color: #fff; font-family: 'Orbitron', sans-serif; font-size: 14px; font-weight: 900;
  letter-spacing: 3px; text-transform: uppercase; cursor: pointer;
  box-shadow: 0 10px 30px rgba(167,139,250,0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}
.ms-launch-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(167,139,250,0.55); }
.ms-launch-btn:active:not(:disabled) { transform: translateY(0); }
.ms-launch-btn:focus-visible { outline: 2px solid #c4b5fd; outline-offset: 3px; }

/* ── Army Bomb ── */
.ab-wrap {
  background: #0b0b0b; border: 1px solid rgba(124,58,237,0.35);
  padding: 14px; border-radius: 14px;
  box-shadow: 0 0 20px rgba(124,58,237,0.12) inset;
  margin-bottom: 16px;
}
.ab-head { text-align: center; margin-bottom: 12px; }
.ab-progress { color: #fff; font-size: 12px; font-weight: 900; letter-spacing: 0.9px; text-transform: uppercase; }
.ab-sub { color: #b3b3b3; font-size: 10px; margin-top: 4px; }
.ab-feature-row { display: flex; justify-content: center; gap: 6px; flex-wrap: wrap; margin-top: 7px; }
.ab-feature { font-size: 9px; padding: 3px 7px; border-radius: 999px; border: 1px solid rgba(124,58,237,0.45); color: #ddd6fe; background: rgba(124,58,237,0.12); }
.ab-feature--purple { border-color: rgba(167,139,250,0.6); color: #e9d5ff; background: rgba(167,139,250,0.18); }

.ab-layout { position: relative; height: 420px; max-width: 520px; margin: 10px auto 0; }

.ab-energy {
  position: absolute; left: 50%; top: 46%; transform: translate(-50%,-50%);
  width: 250px; height: 250px; border-radius: 50%;
  border: 2px dashed rgba(124,58,237,0.2);
}
.ab-energy::after {
  content: ''; position: absolute; inset: 0; border-radius: 50%;
  border: 2px solid rgba(124,58,237,0.65);
  clip-path: polygon(0 100%, calc(var(--charge,0) * 1%) 100%, calc(var(--charge,0) * 1%) 0, 0 0);
  transition: clip-path 0.4s ease;
}

.ab-charge-label {
  position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%);
  font-size: 11px; color: rgba(167,139,250,0.6); font-weight: 700;
  letter-spacing: 1px; font-family: 'Orbitron', sans-serif;
}

/* Lightstick */
.ab-lightstick { position: absolute; left: 50%; top: 53%; transform: translate(-50%,-50%); width: 160px; height: 250px; z-index: 3; }
.ab-globe {
  position: absolute; left: 50%; top: 0; transform: translateX(-50%);
  width: 132px; height: 132px; border-radius: 50%;
  background: radial-gradient(circle at 35% 28%, rgba(255,255,255,0.9), rgba(210,210,220,0.36) 45%, rgba(20,20,25,0.45) 78%, rgba(0,0,0,0.55));
  border: 2px solid rgba(240,240,250,0.65);
  box-shadow: inset 0 0 20px rgba(255,255,255,0.26), 0 0 18px rgba(124,58,237,0.24);
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  transition: box-shadow 0.4s ease;
}
.ab-logo { width: 44px; height: 66px; position: relative; opacity: 0.82; }
.ab-logo::before, .ab-logo::after {
  content: ''; position: absolute; top: 0; width: 18px; height: 100%;
  border: 2px solid rgba(30,30,35,0.6);
  background: linear-gradient(180deg, rgba(255,255,255,0.72), rgba(120,120,135,0.34));
  transition: border-color 0.4s ease;
}
.ab-logo::before { left: 1px; clip-path: polygon(0 0, 100% 18%, 100% 100%, 0 82%); }
.ab-logo::after { right: 1px; clip-path: polygon(0 18%, 100% 0, 100% 82%, 0 100%); }

.ab-button {
  position: absolute; right: 18px; top: 6px; width: 22px; height: 14px;
  border-radius: 12px; transform: rotate(-28deg);
  background: #0f1014; border: 1px solid rgba(255,255,255,0.2);
}
.ab-button::after {
  content: ''; position: absolute; right: 3px; top: 3px;
  width: 7px; height: 7px; border-radius: 50%;
  background: #7c3aed; box-shadow: 0 0 6px rgba(124,58,237,0.8);
}

.ab-neck { position: absolute; left: 50%; top: 126px; transform: translateX(-50%); width: 60px; height: 14px; border-radius: 7px; background: linear-gradient(180deg, #8a8f9c, #343845); border: 1px solid rgba(255,255,255,0.18); }
.ab-handle {
  position: absolute; left: 50%; top: 140px; transform: translateX(-50%);
  width: 48px; height: 95px; border-radius: 12px;
  background: linear-gradient(180deg, #2c313e, #12151c 35%, #0a0c12);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: inset 0 0 10px rgba(255,255,255,0.06), 0 8px 18px rgba(0,0,0,0.45);
}
.ab-handle::before {
  content: ''; position: absolute; left: 50%; top: 25px; transform: translateX(-50%);
  width: 16px; height: 18px;
  background: linear-gradient(180deg, #747b8f, #3f4558);
  clip-path: polygon(50% 0, 90% 20%, 90% 80%, 50% 100%, 10% 80%, 10% 20%);
}
.ab-base { position: absolute; left: 50%; top: 232px; transform: translateX(-50%); width: 54px; height: 14px; border-radius: 8px; background: linear-gradient(180deg, #1d212c, #05070c); border: 1px solid rgba(255,255,255,0.12); }

.ab-lightstick--active .ab-globe { box-shadow: inset 0 0 24px rgba(255,255,255,0.38), 0 0 24px rgba(124,58,237,0.8), 0 0 54px rgba(124,58,237,0.45); }
.ab-lightstick--active .ab-logo::before, .ab-lightstick--active .ab-logo::after { border-color: rgba(124,58,237,0.75); }
.ab-lightstick--active { animation: abPulse 2s ease-in-out infinite; }

/* Badges */
.ab-badge { position: absolute; width: 88px; text-align: center; }
.ab-dot {
  width: 84px; height: 84px; border-radius: 50%; padding: 3px;
  background: linear-gradient(180deg, rgba(60,60,70,0.9), rgba(30,30,35,0.9));
  box-shadow: 0 0 0 2px rgba(124,58,237,0.2);
  position: relative; transition: all 0.3s ease;
}
.ab-dot__inner {
  width: 100%; height: 100%; border-radius: 50%;
  background: #1c1c1c;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.ab-dot__icon { font-size: 28px; filter: grayscale(0); transition: filter 0.3s; }
.ab-dot--locked .ab-dot__icon { filter: grayscale(1) brightness(0.5); }
.ab-dot--unlocked {
  background: linear-gradient(180deg, rgba(124,58,237,0.95), rgba(60,20,120,0.95));
  box-shadow: 0 0 0 2px rgba(124,58,237,0.7), 0 0 18px rgba(124,58,237,0.65);
  animation: abSoftPulse 2.4s ease-in-out infinite;
}
.ab-icon {
  position: absolute; right: -2px; bottom: -2px;
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: #0b0b0b; border: 1px solid rgba(124,58,237,0.7);
  color: #fff; font-size: 12px;
}
.ab-name { color: #fff; font-size: 10px; margin-top: 5px; font-weight: 700; }

/* Tooltip */
.ab-tooltip {
  position: absolute; left: 50%; top: calc(100% + 6px); transform: translateX(-50%);
  width: 190px; padding: 8px; border-radius: 10px;
  background: #101010; border: 1px solid rgba(124,58,237,0.45);
  box-shadow: 0 10px 18px rgba(0,0,0,0.55);
  text-align: left; z-index: 15; display: none; pointer-events: none;
}
.ab-badge:hover .ab-tooltip, .ab-badge:focus-within .ab-tooltip { display: block; }
.ab-tooltip__title { color: #fff; font-size: 10px; font-weight: 800; }
.ab-tooltip__status { font-size: 9px; font-weight: 700; margin-top: 2px; }
.ab-tooltip__desc { color: #bdbdbd; font-size: 9px; line-height: 1.35; margin-top: 4px; }

@keyframes abSoftPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
@keyframes abPulse {
  0%, 100% { box-shadow: 0 0 32px rgba(124,58,237,0.85), 0 0 70px rgba(124,58,237,0.45); }
  50%      { box-shadow: 0 0 40px rgba(124,58,237,1), 0 0 100px rgba(124,58,237,0.6); }
}

/* ═══════════════════════════════════════
   ARIRANG SHIP — In-Page Scene
   ═══════════════════════════════════════ */

.arirang {
  position: relative; width: 100%; height: 260px;
  border-radius: 16px; overflow: hidden;
  background: linear-gradient(180deg, #0d0d2b 0%, #1a1a4e 25%, #1e2a5a 35%, #1a3050 42%, #0d2040 42.5%, #0a1a35 60%, #081530 80%, #040e20 100%);
  border: 1px solid rgba(255,255,255,0.05);
  margin-bottom: 16px; transition: all 0.8s ease;
}

/* Sky */
.arirang__sky { position: absolute; inset: 0; bottom: 55%; overflow: hidden; }
.arirang__clouds { position: absolute; inset: 0; }
.arirang__cloud { position: absolute; background: rgba(255,255,255,0.06); border-radius: 50px; filter: blur(8px); }
.arirang__cloud--1 { width: 100px; height: 22px; top: 15%; left: 8%; }
.arirang__cloud--2 { width: 70px; height: 16px; top: 28%; right: 12%; }
.arirang__cloud--3 { width: 85px; height: 20px; top: 8%; right: 32%; }
.arirang__stars { position: absolute; inset: 0; opacity: 0; transition: opacity 1s ease; }
.arirang__star { position: absolute; width: var(--size,2px); height: var(--size,2px); background: #fff; border-radius: 50%; animation: starTwinkle 2s ease-in-out infinite; animation-delay: var(--delay,0s); }
.arirang__horizon-glow { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 200%; height: 80px; background: radial-gradient(ellipse at center bottom, rgba(124,58,237,0.1), transparent 60%); opacity: 0.3; transition: all 0.8s ease; }
.arirang__sun { position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%); width: 50px; height: 50px; background: radial-gradient(circle, rgba(255,200,100,0.8), rgba(255,150,50,0.4) 40%, transparent 70%); border-radius: 50%; opacity: 0; transition: all 0.8s ease; }

/* Ocean */
.arirang__ocean { position: absolute; bottom: 0; left: 0; right: 0; height: 55%; background: linear-gradient(180deg, rgba(13,32,64,0.9), rgba(10,26,53,0.95), rgba(8,21,48,1)); overflow: hidden; }
.arirang__waves { position: absolute; top: 0; left: 0; right: 0; height: 35px; }
.arirang__wave { position: absolute; top: calc(var(--i) * 5px); left: -10%; right: -10%; height: 1.5px; background: linear-gradient(90deg, transparent, rgba(100,180,255,0.1) 20%, rgba(80,160,240,0.06) 50%, rgba(100,180,255,0.1) 80%, transparent); animation: waveMove 5s ease-in-out infinite; animation-delay: calc(var(--i) * 0.3s); }
.arirang__reflections { position: absolute; inset: 0; opacity: 0; transition: opacity 0.8s ease; }
.arirang__reflection { position: absolute; bottom: 20%; width: 3px; height: 25px; background: linear-gradient(180deg, rgba(167,139,250,0.5), transparent); filter: blur(3px); animation: reflectionShimmer 2s ease-in-out infinite; animation-delay: var(--delay,0s); }
.arirang__ship-reflection { position: absolute; bottom: 5%; left: 50%; transform: translateX(-50%) scaleY(-0.3); width: 120px; height: 50px; background: linear-gradient(180deg, rgba(255,255,255,0.06), transparent); filter: blur(6px); opacity: 0.4; }

/* Ship */
.arirang__ship { position: absolute; bottom: 24%; left: 50%; transform: translateX(-50%); width: 200px; height: 180px; transition: all 0.8s ease; filter: brightness(0.6) saturate(0.3); }
.arirang__ship-aura { position: absolute; bottom: -10px; left: -15px; width: calc(100% + 30px); height: 30px; background: radial-gradient(ellipse at 50% 100%, rgba(100,180,255,0.06), transparent 70%); filter: blur(6px); animation: auraPulse 4s ease-in-out infinite; opacity: 0; }

/* Masts */
.arirang__mast { position: absolute; background: linear-gradient(90deg, #5a3e1c, #7a5830 30%, #8b6838 50%, #7a5830 70%, #5a3e1c); border-radius: 1.5px; }
.arirang__mast--1 { bottom: 25%; left: 17%; width: 3px; height: 50%; }
.arirang__mast--2 { bottom: 25%; left: 36%; width: 3.5px; height: 54%; }
.arirang__mast--3 { bottom: 25%; left: 57%; width: 3.5px; height: 52%; }
.arirang__mast--4 { bottom: 25%; left: 76%; width: 3px; height: 44%; }

.arirang__lantern { position: absolute; top: -3px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background: radial-gradient(circle, rgba(255,230,150,0.8), rgba(255,200,80,0.3), transparent); border-radius: 50%; box-shadow: 0 0 6px rgba(255,210,100,0.6), 0 0 12px rgba(255,200,50,0.3); animation: lanternGlow 3s ease-in-out infinite; opacity: 0; }
.arirang__mast--2 .arirang__lantern { animation-delay: 0.75s; }
.arirang__mast--3 .arirang__lantern { animation-delay: 1.5s; }
.arirang__mast--4 .arirang__lantern { animation-delay: 2.25s; }

/* Cross-trees, Gaffs, Booms, Rigging */
.arirang__xtree { position: absolute; height: 2px; background: #5a3a10; border-radius: 1px; }
.arirang__xtree--1 { bottom: 65%; left: 10%; width: 18%; }
.arirang__xtree--2 { bottom: 70%; left: 28%; width: 20%; }
.arirang__xtree--3 { bottom: 68%; left: 50%; width: 18%; }
.arirang__xtree--4 { bottom: 60%; left: 70%; width: 16%; }

.arirang__gaff { position: absolute; height: 2px; background: linear-gradient(90deg, #5a3e1c, #7a5830, #5a3e1c); border-radius: 1px; transform-origin: left center; }
.arirang__gaff--1 { bottom: 70%; left: 15%; width: 22%; transform: rotate(-30deg); }
.arirang__gaff--2 { bottom: 74%; left: 34%; width: 24%; transform: rotate(-28deg); }
.arirang__gaff--3 { bottom: 72%; left: 55%; width: 20%; transform: rotate(-32deg); }

.arirang__boom { position: absolute; height: 2px; background: linear-gradient(90deg, #4d3318, #6b4a25, #4d3318); border-radius: 1px; }
.arirang__boom--1 { bottom: 40%; left: 15%; width: 22%; transform: rotate(-2deg); }
.arirang__boom--2 { bottom: 43%; left: 34%; width: 25%; transform: rotate(-1.5deg); }
.arirang__boom--3 { bottom: 41%; left: 55%; width: 20%; transform: rotate(-2deg); }

.arirang__rig { position: absolute; width: 0.8px; background: rgba(50,35,15,0.25); }
.arirang__rig--s1 { bottom: 26%; left: 19%; height: 35%; transform: rotate(-12deg); }
.arirang__rig--s2 { bottom: 26%; left: 19%; height: 44%; transform: rotate(-8deg); }
.arirang__rig--s3 { bottom: 26%; left: 38%; height: 38%; transform: rotate(-10deg); }
.arirang__rig--s4 { bottom: 26%; left: 38%; height: 48%; transform: rotate(-6deg); }
.arirang__rig--s5 { bottom: 26%; left: 59%; height: 36%; transform: rotate(-11deg); }
.arirang__rig--s6 { bottom: 26%; left: 59%; height: 46%; transform: rotate(-7deg); }
.arirang__rig--f1 { bottom: 26%; left: 78%; height: 58%; transform: rotate(22deg); }
.arirang__rig--f2 { bottom: 26%; left: 78%; height: 48%; transform: rotate(28deg); }

/* Sails */
.arirang__sail { position: absolute; transition: all 0.6s ease; }
.arirang__sail-fold { position: absolute; inset: 0; background: repeating-linear-gradient(95deg, transparent 0px, transparent 12px, rgba(0,0,0,0.02) 12px, rgba(0,0,0,0.02) 13px); }

.arirang__sail--gaff-1 { bottom: 40%; left: 19%; width: 17%; height: 32%; background: linear-gradient(180deg, rgba(220,215,200,0.85), rgba(200,195,180,0.8), rgba(180,175,165,0.75)); clip-path: polygon(0% 0%, 65% 0%, 100% 100%, 0% 100%); }
.arirang__sail--gaff-2 { bottom: 43%; left: 38%; width: 19%; height: 35%; background: linear-gradient(180deg, rgba(225,220,205,0.85), rgba(205,200,185,0.8), rgba(185,180,170,0.75)); clip-path: polygon(0% 0%, 70% 0%, 100% 100%, 0% 100%); }
.arirang__sail--gaff-3 { bottom: 41%; left: 59%; width: 16%; height: 33%; background: linear-gradient(180deg, rgba(220,215,200,0.85), rgba(200,195,180,0.8), rgba(180,175,165,0.75)); clip-path: polygon(0% 0%, 68% 0%, 100% 100%, 0% 100%); }
.arirang__sail--jib { bottom: 26%; left: 78%; width: 27%; height: 44%; background: linear-gradient(135deg, rgba(215,210,195,0.8), rgba(195,190,175,0.75), rgba(175,170,160,0.7)); clip-path: polygon(0% 0%, 0% 100%, 100% 82%); }
.arirang__sail--jib-inner { bottom: 30%; left: 80%; width: 21%; height: 36%; background: linear-gradient(135deg, rgba(210,205,190,0.75), rgba(190,185,170,0.7)); clip-path: polygon(0% 0%, 0% 100%, 100% 72%); opacity: 0.8; }

/* Hull */
.arirang__hull { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 82%; height: 25%; background: linear-gradient(180deg, #e8e0d5, #ddd5c8 40%, #d0c8b8); clip-path: polygon(0% 30%, 4% 5%, 70% 5%, 85% 5%, 100% 50%, 95% 95%, 3% 95%, 0% 65%); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15)); }
.arirang__hull-stripe { position: absolute; background: #1a1a1a; }
.arirang__hull-stripe--top { top: 8%; left: 5%; width: 80%; height: 7%; }
.arirang__hull-stripe--mid { top: 42%; left: 4%; width: 83%; height: 3%; }
.arirang__hull-stripe--bottom { bottom: 15%; left: 3%; width: 87%; height: 6%; }
.arirang__hull-text { position: absolute; bottom: 30%; left: 32%; font-family: 'Brush Script MT', 'Segoe Script', cursive; font-size: 12px; color: #3a2a15; font-style: italic; letter-spacing: 2px; white-space: nowrap; text-shadow: 0 0 6px rgba(200,170,80,0.3); }
.arirang__porthole { position: absolute; top: 55%; width: 4px; height: 4px; border-radius: 50%; background: radial-gradient(circle, rgba(255,220,130,0.2), transparent); box-shadow: 0 0 3px rgba(255,210,100,0.15); }
.arirang__anchor { position: absolute; right: 5%; bottom: 20%; font-size: 6px; opacity: 0.4; }

.arirang__hull-shadow { position: absolute; bottom: -3px; left: 50%; transform: translateX(-50%); width: 78%; height: 5px; background: linear-gradient(180deg, rgba(10,30,50,0.25), transparent); filter: blur(1px); }
.arirang__waterline-glow { position: absolute; bottom: -1px; left: 50%; transform: translateX(-50%); width: 74%; height: 2px; background: linear-gradient(90deg, transparent, rgba(100,200,255,0.25), rgba(150,220,255,0.4), rgba(100,200,255,0.25), transparent); filter: blur(2px); animation: waterlineGlow 3s ease-in-out infinite; opacity: 0; }
.arirang__bowsprit { position: absolute; right: -8%; bottom: 16%; width: 18%; height: 2px; background: linear-gradient(90deg, #7a5a1a, #9b7828, #7a5a1a); transform: rotate(-18deg); transform-origin: left center; border-radius: 0 1.5px 1.5px 0; }

/* Deck & Crew */
.arirang__deck { position: absolute; bottom: 22%; left: 50%; transform: translateX(-50%); width: 68%; height: 4%; background: linear-gradient(180deg, #5a3d20, #4a3018); border-radius: 1px; }
.arirang__railing { position: absolute; top: -6px; left: 4%; right: 12%; height: 6px; border: 1px solid rgba(255,255,255,0.2); border-bottom: none; border-radius: 1px 1px 0 0; background: repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(255,255,255,0.15) 6px, rgba(255,255,255,0.15) 7px); }
.arirang__crew { position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); display: flex; align-items: flex-end; justify-content: center; width: 75%; height: 18px; }
.arirang__crew-member { width: 5px; height: var(--h,14px); margin: 0 1.5px; background: linear-gradient(180deg, #1a1515, #151010); border-radius: 2px 2px 0 0; position: relative; opacity: 0.4; transition: opacity 0.4s, background 0.4s; }
.arirang__crew-member::before { content: ''; position: absolute; top: -4px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background: #1a1515; border-radius: 50%; }
.arirang__crew-member--active { opacity: 1; background: linear-gradient(180deg, #1e3a5f, #0f1f35); }
.arirang__crew-member--active::before { background: #e8d5b7; }

/* Wake */
.arirang__wake { position: absolute; bottom: -6px; left: 5%; width: 85%; height: 12px; opacity: 0; transition: opacity 0.8s ease; }
.arirang__wake-foam { position: absolute; border-radius: 50%; filter: blur(2px); animation: foamBubble 3s ease-in-out infinite; }
.arirang__wake-foam--1 { width: 15%; height: 40%; bottom: 30%; left: 5%; background: rgba(150,200,255,0.25); }
.arirang__wake-foam--2 { width: 20%; height: 30%; bottom: 15%; left: 15%; background: rgba(120,180,255,0.18); animation-delay: 0.5s; }
.arirang__wake-foam--3 { width: 25%; height: 25%; bottom: 35%; left: 30%; background: rgba(100,170,255,0.14); animation-delay: 1s; }
.arirang__wake-foam--4 { width: 30%; height: 20%; bottom: 20%; left: 50%; background: rgba(80,150,255,0.08); animation-delay: 1.5s; }
.arirang__bow-wave { position: absolute; right: -4%; bottom: -4%; width: 8%; height: 10%; background: radial-gradient(ellipse, rgba(150,220,255,0.3), transparent); border-radius: 50%; filter: blur(2px); animation: bowSplash 2s ease-in-out infinite; opacity: 0; }

/* Flag */
.arirang__flag { position: absolute; top: 14%; left: 38%; width: 16px; height: 10px; background: linear-gradient(135deg, #7c3aed, #a78bfa); clip-path: polygon(0 0, 85% 25%, 100% 50%, 85% 75%, 0 100%); transform-origin: left center; animation: flagWave 1s ease-in-out infinite alternate; animation-play-state: paused; box-shadow: 1px 1px 3px rgba(0,0,0,0.3); }
.arirang__flag-design { position: absolute; left: 5px; top: 50%; transform: translateY(-50%); width: 4px; height: 4px; background: rgba(255,255,255,0.85); border-radius: 1px; }

/* Light beams */
.arirang__light-beam { position: absolute; width: 1.5px; background: linear-gradient(180deg, rgba(255,230,150,0.15), rgba(255,230,150,0.03), transparent); filter: blur(1.5px); animation: lightBeamPulse 6s ease-in-out infinite; opacity: 0; }
.arirang__light-beam--1 { bottom: 78%; left: 22%; height: 15%; }
.arirang__light-beam--2 { bottom: 82%; left: 42%; height: 18%; animation-delay: 1s; }
.arirang__light-beam--3 { bottom: 80%; left: 62%; height: 14%; animation-delay: 2s; }

/* Particles */
.arirang__particles { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 1s ease; }
.arirang__particle { position: absolute; width: 3px; height: 3px; background: rgba(167,139,250,0.5); border-radius: 50%; left: calc(8% + var(--i) * 7%); animation: particleFloat 4s ease-in-out infinite; animation-delay: calc(var(--i) * 0.3s); }

/* Label */
.arirang__label { position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: linear-gradient(0deg, rgba(0,0,0,0.9), transparent); font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; text-align: center; color: #666; z-index: 10; transition: all 0.6s ease; }
.arirang__label-icon { margin-right: 5px; }

/* ── LOCKED STATE ── */
.arirang--locked .arirang__sky { opacity: 0.4; }
.arirang--locked .arirang__ocean { background: linear-gradient(180deg, rgba(10,20,35,0.95), rgba(6,12,25,0.98), rgba(3,8,18,1)); }
.arirang--locked .arirang__ship { filter: brightness(0.5) saturate(0.2); animation: shipDrift 6s ease-in-out infinite; }
.arirang--locked .arirang__sail { opacity: 0.6; }

/* ── AWAKENED STATE ── */
.arirang--awakened { border-color: rgba(124,58,237,0.3); box-shadow: 0 0 40px rgba(124,58,237,0.15), inset 0 0 60px rgba(124,58,237,0.05); }
.arirang--awakened .arirang__sky { background: linear-gradient(180deg, rgba(13,13,43,0.9), rgba(30,30,60,0.7), rgba(60,40,80,0.5)); }
.arirang--awakened .arirang__clouds { animation: cloudsMove 20s linear infinite; }
.arirang--awakened .arirang__cloud { background: rgba(255,200,150,0.1); }
.arirang--awakened .arirang__stars { opacity: 1; }
.arirang--awakened .arirang__horizon-glow { opacity: 1; background: radial-gradient(ellipse at center bottom, rgba(255,180,100,0.35), rgba(167,139,250,0.15) 50%, transparent 80%); }
.arirang--awakened .arirang__sun { opacity: 1; animation: sunPulse 4s ease-in-out infinite; }
.arirang--awakened .arirang__ocean { background: linear-gradient(180deg, rgba(20,40,70,0.9), rgba(15,30,55,0.95), rgba(60,30,80,0.2), rgba(10,18,30,1)); }
.arirang--awakened .arirang__wave { background: linear-gradient(90deg, transparent, rgba(167,139,250,0.08) 20%, rgba(255,200,150,0.1) 50%, rgba(167,139,250,0.08) 80%, transparent); }
.arirang--awakened .arirang__reflections { opacity: 1; }
.arirang--awakened .arirang__ship { filter: brightness(1) saturate(1.1); animation: shipSail 4s ease-in-out infinite; }
.arirang--awakened .arirang__ship-aura { opacity: 1; }
.arirang--awakened .arirang__sail { opacity: 1; box-shadow: inset 0 0 15px rgba(255,200,100,0.1); }
.arirang--awakened .arirang__sail--gaff-1 { animation: sailBillow 3s ease-in-out infinite; }
.arirang--awakened .arirang__sail--gaff-2 { animation: sailBillow 3s ease-in-out infinite 0.3s; }
.arirang--awakened .arirang__sail--gaff-3 { animation: sailBillow 3s ease-in-out infinite 0.6s; }
.arirang--awakened .arirang__flag { animation-play-state: running; }
.arirang--awakened .arirang__hull { box-shadow: 0 3px 15px rgba(167,139,250,0.2); }
.arirang--awakened .arirang__hull-text { color: #2a3a20; text-shadow: 0 0 8px rgba(200,170,80,0.5), 0 0 15px rgba(200,170,80,0.3); animation: nameGlow 3s ease-in-out infinite; }
.arirang--awakened .arirang__porthole { background: radial-gradient(circle, rgba(255,220,130,0.5), rgba(255,200,80,0.2), transparent); box-shadow: 0 0 5px rgba(255,210,100,0.4); animation: portFlicker 4s ease-in-out infinite; }
.arirang--awakened .arirang__lantern { opacity: 1; }
.arirang--awakened .arirang__waterline-glow { opacity: 1; }
.arirang--awakened .arirang__light-beam { opacity: 1; }
.arirang--awakened .arirang__bow-wave { opacity: 1; }
.arirang--awakened .arirang__wake { opacity: 1; }
.arirang--awakened .arirang__particles { opacity: 1; }
.arirang--awakened .arirang__label { color: #c4b5fd; text-shadow: 0 0 15px rgba(167,139,250,0.5); background: linear-gradient(0deg, rgba(15,10,30,0.95), rgba(30,20,50,0.5) 50%, transparent); }

/* ── ANIMATIONS ── */
@keyframes shipDrift { 0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); } 50% { transform: translateX(-50%) translateY(2px) rotate(0.3deg); } }
@keyframes shipSail { 0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); } 25% { transform: translateX(-50%) translateY(-3px) rotate(-0.8deg); } 75% { transform: translateX(-50%) translateY(-1px) rotate(0.8deg); } }
@keyframes sailBillow { 0%, 100% { transform: scaleX(1) skewX(0deg); } 50% { transform: scaleX(1.03) skewX(1.5deg); } }
@keyframes flagWave { 0% { transform: scaleX(1) skewY(0deg); } 100% { transform: scaleX(1.05) skewY(6deg); } }
@keyframes waveMove { 0%, 100% { transform: translateX(0); opacity: 0.5; } 50% { transform: translateX(12px); opacity: 1; } }
@keyframes starTwinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
@keyframes reflectionShimmer { 0%, 100% { opacity: 0.3; transform: scaleY(0.8); } 50% { opacity: 0.8; transform: scaleY(1.2); } }
@keyframes cloudsMove { 0% { transform: translateX(0); } 100% { transform: translateX(25px); } }
@keyframes sunPulse { 0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.8; } 50% { transform: translateX(-50%) scale(1.1); opacity: 1; } }
@keyframes particleFloat { 0% { transform: translateY(100%) scale(0); opacity: 0; } 20% { opacity: 0.7; } 80% { opacity: 0.7; } 100% { transform: translateY(-40px) scale(1); opacity: 0; } }
@keyframes auraPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
@keyframes lanternGlow { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
@keyframes waterlineGlow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
@keyframes lightBeamPulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.8; } }
@keyframes foamBubble { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 0.9; } }
@keyframes bowSplash { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
@keyframes nameGlow { 0%, 100% { text-shadow: 0 0 8px rgba(200,170,80,0.4), 0 0 15px rgba(200,170,80,0.2); } 50% { text-shadow: 0 0 12px rgba(200,170,80,0.7), 0 0 25px rgba(200,170,80,0.4); } }
@keyframes portFlicker { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

@media (prefers-reduced-motion: reduce) {
  .ab-lightstick--active, .ab-dot--unlocked,
  .arirang__ship, .arirang__sail, .arirang__flag,
  .arirang__wave, .arirang__star, .arirang__particle,
  .arirang__sun, .arirang__clouds, .arirang__wake-foam,
  .arirang__lantern, .arirang__light-beam, .arirang__bow-wave,
  .arirang__porthole, .arirang__hull-text, .arirang__waterline-glow,
  .arirang__ship-aura { animation: none !important; }
}
`;


// ─────────────────────────────────────────────
// SECTION 11: CSS — VOYAGE_CSS + VOYAGE_SHIP_CSS
// ─────────────────────────────────────────────

const VOYAGE_CSS = `
/* ═══ Voyage Overlay v3 — SWIM Dive Edition ═══ */
.vy-root { position: fixed; inset: 0; z-index: 9999999; background: radial-gradient(circle at center, #020617, #000); font-family: 'Orbitron', sans-serif; overflow: hidden; opacity: 0; transition: opacity 1s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: all; }
.vy-root.visible { opacity: 1; }

.vy-header { position: absolute; top: 0; left: 0; right: 0; z-index: 50; padding: 20px; display: flex; justify-content: space-between; align-items: flex-start; background: linear-gradient(180deg, rgba(0,0,0,0.8), transparent); }
.vy-close { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 40px; height: 40px; border-radius: 50%; font-size: 20px; cursor: pointer; backdrop-filter: blur(10px); transition: background 0.2s; z-index: 51; }
.vy-close:hover { background: rgba(255,255,255,0.2); }
.vy-close:focus-visible { outline: 2px solid #00b4d8; outline-offset: 2px; }

/* Ship container — DIVE animation (not sail-away) */
.vy-ship-container { position: relative; z-index: 10; margin-top: -10vh; will-change: transform, opacity; }
.vy-ship-container--diving {
  animation: vyShipDive 4s cubic-bezier(0.4, 0, 0.8, 1) forwards !important;
  pointer-events: none;
}
@keyframes vyShipDive {
  0%   { transform: translateX(0) translateY(0) rotate(0deg) scale(1); opacity: 1; }
  25%  { transform: translateX(6vw) translateY(-2vh) rotate(0deg) scale(0.95); opacity: 1; }
  50%  { transform: translateX(10vw) translateY(2vh) rotate(-20deg) scale(0.8); opacity: 1; }
  75%  { transform: translateX(12vw) translateY(18vh) rotate(-40deg) scale(0.5); opacity: 0.6; }
  100% { transform: translateX(13vw) translateY(40vh) rotate(-55deg) scale(0.15); opacity: 0; }
}

/* Narrative — 3 lines, ocean colors */
.vy-narrative { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 25; text-align: center; width: 90%; max-width: 500px; transition: opacity 1.5s ease; }
.vy-narrative--hidden { opacity: 0; visibility: hidden; }
.vy-narrative--visible { opacity: 1; visibility: visible; }
.vy-narrative--fading { opacity: 0; visibility: hidden; transition: opacity 1.5s ease, visibility 0s 1.5s; }
.vy-narrative__line { font-family: 'Orbitron', sans-serif; font-size: clamp(11px, 3vw, 15px); font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0); margin-bottom: 16px; transform: translateY(15px); transition: color 1s ease, transform 1s ease; line-height: 1.6; }
.vy-narrative__line--visible { color: rgba(255,255,255,0.9); transform: translateY(0); }
.vy-narrative__line--1.vy-narrative__line--visible { color: #fbbf24; text-shadow: 0 0 20px rgba(251,191,36,0.5); }
.vy-narrative__line--2.vy-narrative__line--visible { color: #48cae4; text-shadow: 0 0 20px rgba(72,202,228,0.5); }
.vy-narrative__line--3.vy-narrative__line--visible { color: #00b4d8; text-shadow: 0 0 25px rgba(0,180,216,0.6); animation: vyNarrativePulse 1.5s ease-in-out infinite; }
.vy-narrative__icon { display: inline-block; margin-right: 8px; font-size: 16px; vertical-align: middle; }
@keyframes vyNarrativePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

/* Ocean surface (initial, fades out during dive) */
.vy-ocean { position: absolute; bottom: 0; left: 0; width: 100%; height: 40%; background: linear-gradient(180deg, transparent, #020617 20%, #000); display: flex; justify-content: center; align-items: flex-end; overflow: hidden; z-index: 1; transition: opacity 1.5s ease; }
.vy-ocean-dots { position: relative; width: 100%; height: 100%; }

/* Spotify player */
.vy-player { position: absolute; bottom: 0; left: 0; right: 0; z-index: 30; background: linear-gradient(0deg, rgba(0,15,30,0.95) 70%, transparent); padding: 20px 20px 40px; text-align: center; transition: opacity 1s ease; }
.vy-player--hidden { opacity: 0; pointer-events: none; }
.vy-player-label { font-size: 10px; color: #48cae4; letter-spacing: 2px; margin-bottom: 12px; text-transform: uppercase; font-weight: 800; }
.vy-player-iframe { border-radius: 12px; border: none; }

@media (max-width: 480px) {
  .vy-ship-container { margin-top: -5vh; }
  .vy-narrative__line { font-size: clamp(10px, 3.5vw, 14px); letter-spacing: 1.5px; margin-bottom: 12px; }
  .vy-narrative__icon { font-size: 13px; margin-right: 5px; }
  .vy-header { padding: 14px; }
  .vy-close { width: 36px; height: 36px; font-size: 18px; }
  .vy-player { padding: 14px 14px 30px; }
  .vy-player-label { font-size: 9px; }
}
@media (max-height: 500px) and (orientation: landscape) {
  .vy-ship-container { margin-top: 0; }
  .vy-narrative { top: 45%; }
  .vy-narrative__line { font-size: 11px; margin-bottom: 8px; }
  .vy-ocean { height: 30%; }
  .vy-player { padding: 10px 14px 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .vy-ship-container--diving, .vy-narrative__line--3 { animation: none !important; }
  .vy-ship-container, .vy-ocean, .vy-narrative, .vy-narrative__line, .vy-player { transition: none !important; }
}
`;

const VOYAGE_SWIM_CSS = `
/* ═══════════════════════════════════════════════
   SWIM UNDERWATER CONCERT
   Ship dives → underwater amphitheater of light
   ═══════════════════════════════════════════════ */

/* ── Dive Transition ── */
.swim-dive { position: absolute; inset: 0; z-index: 20; pointer-events: none; }
.swim-dive--hidden { opacity: 0; visibility: hidden; }
.swim-dive__flash { position: absolute; inset: 0; background: radial-gradient(circle, rgba(0,150,220,0.3), rgba(0,80,150,0.5), rgba(0,20,60,0.85)); opacity: 0; transition: opacity 1.2s ease; }
.swim-dive__flash--active { opacity: 1; }
.swim-dive__bubbles { position: absolute; inset: 0; overflow: hidden; }
.swim-dive-bubble { position: absolute; bottom: -20px; border-radius: 50%; background: rgba(150,220,255,0.3); border: 1px solid rgba(200,240,255,0.2); animation: diveBubbleRush 1.8s ease-out forwards; }
@keyframes diveBubbleRush {
  0% { transform: translateY(0) scale(1); opacity: 0.8; }
  100% { transform: translateY(-120vh) scale(0.3); opacity: 0; }
}

/* ── Underwater Scene ── */
.swim-underwater {
  position: absolute; inset: 0; z-index: 15; overflow: hidden;
  background: linear-gradient(180deg,
    rgba(0,50,90,0.95) 0%,
    rgba(0,35,65,0.97) 20%,
    rgba(5,20,45,0.98) 50%,
    rgba(2,10,30,1) 80%,
    rgba(1,5,18,1) 100%
  );
  opacity: 0;
  transition: opacity 2s ease, background 6s ease;
}
.swim-underwater--visible { opacity: 1; }

/* Color shift phases */
.swim-underwater.swim-phase-calm { background: linear-gradient(180deg, rgba(0,55,95,0.95), rgba(0,35,65,0.98), rgba(5,18,40,1)); }
.swim-underwater.swim-phase-deep { background: linear-gradient(180deg, rgba(15,12,50,0.95), rgba(10,8,38,0.98), rgba(5,3,22,1)); }
.swim-underwater.swim-phase-warm { background: linear-gradient(180deg, rgba(12,50,65,0.95), rgba(8,35,50,0.98), rgba(3,18,32,1)); }
.swim-underwater.swim-phase-bright { background: linear-gradient(180deg, rgba(0,65,105,0.95), rgba(0,45,80,0.98), rgba(5,22,50,1)); }

/* ── Water Surface (seen from below) ── */
.swim-surface { position: absolute; top: 0; left: 0; right: 0; height: 80px; z-index: 5; }
.swim-surface__shimmer {
  position: absolute; top: 0; left: -10%; right: -10%; height: 50px;
  background: linear-gradient(180deg, rgba(100,210,255,0.15), rgba(0,150,220,0.06), transparent);
  animation: surfaceShimmer 4s ease-in-out infinite;
}
.swim-surface__wave {
  position: absolute; top: 30px; left: -10%; right: -10%; height: 25px;
  background: repeating-linear-gradient(90deg, transparent, rgba(100,210,255,0.08) 25%, transparent 50%);
  background-size: 200px 100%;
  animation: surfaceWaveScroll 6s linear infinite;
}
.swim-ship-shadow {
  position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
  width: 80px; height: 12px; background: rgba(0,0,0,0.12);
  border-radius: 50%; filter: blur(4px);
  animation: shipShadowFloat 8s ease-in-out infinite;
}
@keyframes surfaceShimmer { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
@keyframes surfaceWaveScroll { 0% { transform: translateX(0); } 100% { transform: translateX(200px); } }
@keyframes shipShadowFloat { 0%, 100% { transform: translateX(-50%) scaleX(1); opacity: 0.12; } 50% { transform: translateX(-45%) scaleX(1.15); opacity: 0.2; } }

/* ── Caustic Light Patterns ── */
.swim-caustics { position: absolute; inset: 0; overflow: hidden; z-index: 1; }
.swim-caustics::before, .swim-caustics::after { content: ''; position: absolute; inset: -50%; }
.swim-caustics::before {
  background:
    radial-gradient(circle at 20% 25%, rgba(0,180,255,0.1) 0%, transparent 40%),
    radial-gradient(circle at 65% 55%, rgba(0,220,200,0.08) 0%, transparent 35%),
    radial-gradient(circle at 85% 15%, rgba(100,200,255,0.07) 0%, transparent 45%),
    radial-gradient(circle at 40% 80%, rgba(0,160,180,0.08) 0%, transparent 38%);
  animation: causticDrift1 12s ease-in-out infinite;
}
.swim-caustics::after {
  background:
    radial-gradient(circle at 50% 40%, rgba(0,150,255,0.08) 0%, transparent 40%),
    radial-gradient(circle at 25% 70%, rgba(0,200,180,0.06) 0%, transparent 35%),
    radial-gradient(circle at 75% 85%, rgba(80,180,220,0.08) 0%, transparent 42%);
  animation: causticDrift2 15s ease-in-out infinite reverse;
}
@keyframes causticDrift1 {
  0%, 100% { transform: translate(0,0) rotate(0deg); }
  33% { transform: translate(5%,3%) rotate(5deg); }
  66% { transform: translate(-3%,5%) rotate(-3deg); }
}
@keyframes causticDrift2 {
  0%, 100% { transform: translate(0,0) rotate(0deg); }
  33% { transform: translate(-4%,-3%) rotate(-4deg); }
  66% { transform: translate(3%,-5%) rotate(6deg); }
}

/* ── God Rays ── */
.swim-godray {
  position: absolute; top: 0; width: 40px; height: 100%; z-index: 2;
  background: linear-gradient(180deg, rgba(100,210,255,0.06), transparent 55%);
  transform-origin: top center; filter: blur(12px);
  animation: godrayPulse 8s ease-in-out infinite;
}
.swim-godray--1 { left: 12%; transform: rotate(-8deg); }
.swim-godray--2 { left: 32%; width: 55px; animation-delay: -2s; transform: rotate(-3deg); }
.swim-godray--3 { left: 58%; animation-delay: -4s; transform: rotate(5deg); }
.swim-godray--4 { left: 82%; width: 45px; animation-delay: -6s; transform: rotate(10deg); }
@keyframes godrayPulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.7; } }

/* ── Bubbles ── */
.swim-bubbles { position: absolute; inset: 0; overflow: hidden; z-index: 3; pointer-events: none; }
.swim-bubble {
  position: absolute; bottom: -20px; border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(200,240,255,0.35), rgba(100,200,255,0.08));
  border: 1px solid rgba(200,240,255,0.12);
  animation: bubbleFloat linear infinite;
}
@keyframes bubbleFloat {
  0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
  10% { opacity: 0.5; }
  50% { transform: translateY(-50vh) translateX(15px); }
  90% { opacity: 0.3; }
  100% { transform: translateY(-105vh) translateX(-10px) scale(0.5); opacity: 0; }
}

/* ── Floating Army Bomb (light source) ── */
.swim-lightstick {
  position: absolute; left: 50%; top: 42%; transform: translate(-50%,-50%);
  width: 55px; height: 85px; z-index: 6;
  animation: lightstickDrift 6s ease-in-out infinite;
  opacity: 0; transition: opacity 1.5s ease;
}
.swim-lightstick--visible { opacity: 1; }
.swim-lightstick__globe {
  position: absolute; left: 50%; top: 0; transform: translateX(-50%);
  width: 45px; height: 45px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85), rgba(200,235,255,0.35) 45%, rgba(0,100,180,0.25) 78%);
  border: 2px solid rgba(200,240,255,0.4);
  box-shadow:
    0 0 25px rgba(0,180,255,0.35),
    0 0 50px rgba(0,150,220,0.18),
    0 0 80px rgba(0,120,200,0.08);
}
.swim-lightstick__handle {
  position: absolute; left: 50%; top: 43px; transform: translateX(-50%);
  width: 14px; height: 38px;
  background: linear-gradient(180deg, #2c313e, #0a0c12);
  border-radius: 4px; border: 1px solid rgba(255,255,255,0.08);
}
.swim-lightstick__rays {
  position: absolute; left: 50%; top: 22px; transform: translateX(-50%);
  width: 180px; height: 180px;
  background: radial-gradient(circle, rgba(0,180,255,0.08), transparent 55%);
  animation: rayPulse 3s ease-in-out infinite;
  pointer-events: none;
}
@keyframes lightstickDrift {
  0%, 100% { transform: translate(-50%,-50%) rotate(-3deg) translateY(0); }
  50% { transform: translate(-50%,-50%) rotate(3deg) translateY(-8px); }
}
@keyframes rayPulse {
  0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.4; }
  50% { transform: translateX(-50%) scale(1.3); opacity: 0.9; }
}

/* ── Swimmer Silhouettes ── */
.swim-swimmers { position: absolute; inset: 0; overflow: hidden; z-index: 4; pointer-events: none; }
.swim-swimmer { position: absolute; opacity: 0; transition: opacity 2s ease; }
.swim-swimmer--visible { opacity: 1; }
.swim-swimmer__body {
  width: 28px; height: 7px;
  background: rgba(255,255,255,0.05);
  border-radius: 14px 14px 4px 4px;
  position: relative;
}
.swim-swimmer__body::before {
  content: ''; position: absolute; left: -5px; top: -1px;
  width: 7px; height: 7px;
  background: rgba(255,255,255,0.07);
  border-radius: 50%;
}
.swim-swimmer__body::after {
  content: ''; position: absolute; right: -1px; top: -3px;
  width: 10px; height: 3px;
  background: rgba(255,255,255,0.04);
  border-radius: 3px;
  transform-origin: left center;
  animation: swimStroke 1.8s ease-in-out infinite;
}
@keyframes swimStroke { 0%, 100% { transform: rotate(-25deg); } 50% { transform: rotate(35deg); } }
.swim-swimmer--right { animation: swimDriftRight var(--speed, 18s) linear infinite; }
.swim-swimmer--left { animation: swimDriftLeft var(--speed, 18s) linear infinite; }
@keyframes swimDriftRight {
  0% { transform: translateX(-120px) scaleX(1); }
  100% { transform: translateX(calc(100vw + 120px)) scaleX(1); }
}
@keyframes swimDriftLeft {
  0% { transform: translateX(calc(100vw + 120px)) scaleX(-1); }
  100% { transform: translateX(-120px) scaleX(-1); }
}

/* ── Welcome Message ── */
.swim-welcome {
  position: absolute; top: 22%; left: 50%; transform: translateX(-50%);
  z-index: 12; text-align: center; width: 90%; max-width: 400px;
  opacity: 1; transition: opacity 1.5s ease;
}
.swim-welcome--hidden { opacity: 0; }
.swim-welcome--fading { opacity: 0; }
.swim-welcome__text {
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(10px, 2.5vw, 13px);
  color: rgba(100,220,255,0.7);
  letter-spacing: 2px; text-transform: uppercase;
  text-shadow: 0 0 15px rgba(0,180,220,0.3);
}

/* ── Cycling Lyrics ── */
.swim-lyrics {
  position: absolute; left: 50%; top: 35%; transform: translateX(-50%);
  text-align: center; width: 90%; max-width: 500px;
  z-index: 10; pointer-events: none;
}
.swim-lyrics__main {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(16px, 4.5vw, 28px);
  font-weight: 900; letter-spacing: 2px;
  color: rgba(255,255,255,0);
  transform: translateY(10px);
  transition: color 1s ease, transform 1s ease, text-shadow 1s ease;
}
.swim-lyrics__sub {
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(9px, 2.2vw, 13px);
  letter-spacing: 3px; text-transform: uppercase;
  color: rgba(100,200,255,0);
  margin-top: 12px;
  transform: translateY(10px);
  transition: color 1s ease, transform 1s ease;
}
.swim-lyrics--visible.swim-lyrics__main {
  color: #fff;
  text-shadow: 0 0 20px rgba(0,180,255,0.5), 0 0 40px rgba(0,150,220,0.25);
  transform: translateY(0);
}
.swim-lyrics--visible.swim-lyrics__sub {
  color: rgba(150,220,255,0.7);
  transform: translateY(0);
}

/* ── Ripple Interaction ── */
.swim-ripple-area { position: absolute; inset: 0; z-index: 8; cursor: pointer; }
.swim-ripple {
  position: absolute; width: 0; height: 0; border-radius: 50%;
  border: 1.5px solid rgba(100,210,255,0.45);
  transform: translate(-50%,-50%);
  animation: rippleExpand 1.2s ease-out forwards;
  pointer-events: none;
}
@keyframes rippleExpand {
  0% { width: 0; height: 0; opacity: 1; }
  100% { width: 180px; height: 180px; opacity: 0; }
}
.swim-ripple-particle {
  position: absolute; width: 3px; height: 3px;
  background: rgba(100,220,255,0.5);
  border-radius: 50%; pointer-events: none;
}

/* ── Exit Animation ── */
.swim-exit { position: absolute; inset: 0; z-index: 35; pointer-events: none; opacity: 0; transition: opacity 0.3s ease; }
.swim-exit--active { opacity: 1; }
.swim-exit__light {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center top, rgba(200,240,255,0.6), rgba(100,200,255,0.25) 30%, transparent 65%);
  animation: exitRise 1.5s ease-in forwards;
  opacity: 0;
}
.swim-exit--active .swim-exit__light { opacity: 1; }
@keyframes exitRise {
  0% { transform: translateY(40vh); opacity: 0; }
  60% { opacity: 1; }
  100% { transform: translateY(0); opacity: 1; }
}

/* ── Mobile ── */
@media (max-width: 480px) {
  .swim-lightstick { width: 42px; height: 65px; }
  .swim-lightstick__globe { width: 35px; height: 35px; }
  .swim-lightstick__handle { top: 33px; width: 11px; height: 30px; }
  .swim-lightstick__rays { width: 140px; height: 140px; }
  .swim-lyrics__main { letter-spacing: 1px; }
  .swim-lyrics__sub { letter-spacing: 1.5px; }
  .swim-godray { width: 25px; filter: blur(8px); }
  .swim-swimmer__body { width: 20px; height: 5px; }
  .swim-welcome__text { font-size: 10px; letter-spacing: 1.5px; }
}
@media (max-height: 500px) and (orientation: landscape) {
  .swim-lyrics { top: 28%; }
  .swim-lightstick { top: 48%; }
  .swim-welcome { top: 18%; }
}
@media (prefers-reduced-motion: reduce) {
  .swim-caustics::before, .swim-caustics::after,
  .swim-godray, .swim-bubble, .swim-lightstick,
  .swim-lightstick__rays, .swim-swimmer,
  .swim-swimmer__body::after,
  .swim-surface__shimmer, .swim-surface__wave,
  .swim-ship-shadow, .swim-dive-bubble,
  .swim-exit__light { animation: none !important; }
  .swim-underwater, .swim-lightstick, .swim-welcome,
  .swim-lyrics__main, .swim-lyrics__sub, .swim-swimmer,
  .swim-exit { transition: none !important; }
}

/* ═══════════════════════════════════════════════
   CONCERT STAGE — Army Bomb Crowd Experience
   ═══════════════════════════════════════════════ */

/* Root theme token */
.vy-root { --cs-theme: #a855f7; }

/* Override: hide old godrays and standalone lightstick */
.swim-caustics, .swim-godray, .swim-lightstick,
.swim-swimmers, .swim-bubbles { display: none !important; }

/* Concert stage base */
.swim-underwater {
  background: radial-gradient(ellipse at center 35%, color-mix(in srgb, var(--cs-theme) 25%, #050508) 0%, #050508 70%) !important;
  transition: background 1s ease !important;
}

/* ── Stars ── */
.cs-stars { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 1; }
.cs-star {
  position: absolute;
  width: var(--star-size, 2px); height: var(--star-size, 2px);
  background: #fff; border-radius: 50%; opacity: 0;
  animation: cs-twinkle 3s ease-in-out infinite;
  box-shadow: 0 0 4px var(--cs-theme);
}
@keyframes cs-twinkle { 0%,100%{opacity:0.15;transform:scale(0.8)} 50%{opacity:0.8;transform:scale(1.3)} }
.cs-star:nth-child(3n) { animation-duration: 4.5s; }
.cs-star:nth-child(2n) { animation-duration: 2s; }

/* ── Ambient glow (soft radial, not harsh) ── */
.cs-ambient {
  position: absolute; inset: 0; pointer-events: none; z-index: 2;
  background: radial-gradient(ellipse at center 40%, var(--cs-theme) 0%, transparent 65%);
  opacity: 0.18;
  animation: cs-breathe 4s ease-in-out infinite;
  transition: background 1s;
}
@keyframes cs-breathe { 0%,100%{opacity:0.15;transform:scale(0.95)} 50%{opacity:0.23;transform:scale(1.05)} }

/* ── Layout ── */
.cs-layout {
  position: absolute; inset: 0; z-index: 10;
  display: flex; flex-direction: column; align-items: center;
  justify-content: flex-start; padding: 16px 16px 0;
  overflow: hidden;
}

/* ── Song info ── */
.cs-song-info { text-align: center; margin-bottom: 6px; animation: cs-fade-up 0.8s forwards 0.2s; opacity: 0; }
.cs-era-icon { font-size: 22px; animation: cs-era-pulse 3s ease-in-out infinite; text-shadow: 0 0 20px var(--cs-theme); }
@keyframes cs-era-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
.cs-title { margin: 3px 0 0; font-family: 'Orbitron', sans-serif; font-size: 22px; font-weight: 800; color: #fff; letter-spacing: 2px; text-shadow: 0 0 20px rgba(0,0,0,0.5); }
.cs-artist { margin: 2px 0 0; font-size: 11px; color: rgba(255,255,255,0.6); letter-spacing: 1px; }
@keyframes cs-fade-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

/* ── Your army bomb stage ── */
.cs-stage { position: relative; display: flex; align-items: center; justify-content: center; height: 190px; width: 100%; margin-bottom: 2px; }
.cs-stage-glow {
  position: absolute; width: 220px; height: 220px; border-radius: 50%;
  background: var(--cs-theme); filter: blur(90px); opacity: 0.22;
  animation: cs-breathe 4s ease-in-out infinite; transition: background 1s;
}

/* Pivot element — animations applied via JS */
.cs-pivot { transform-origin: center bottom; position: relative; cursor: default; }
.cs-bomb { display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 12px 35px rgba(0,0,0,0.6)); }
.cs-sphere {
  width: 110px; height: 110px; border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), rgba(0,0,0,0.4));
  border: 1.5px solid rgba(255,255,255,0.22);
  box-shadow: inset 0 0 28px var(--cs-theme), 0 0 22px var(--cs-theme);
  position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden;
  transition: box-shadow 0.5s;
}
.cs-fill { position: absolute; bottom: 0; left: 0; right: 0; height: 100%; background: linear-gradient(to top, var(--cs-theme), transparent); opacity: 0.38; transition: background 1s; }
.cs-logo { font-size: 36px; font-weight: 700; color: #fff; z-index: 5; text-shadow: 0 0 14px var(--cs-theme); transition: text-shadow 0.5s; }
.cs-handle {
  width: 28px; height: 95px;
  background: linear-gradient(90deg, #1a1a1a, #2a2a2a 40%, #111);
  margin-top: -5px; border-radius: 0 0 12px 12px;
  position: relative;
}
.cs-handle::before {
  content: ''; position: absolute; top: 14px; left: 50%; transform: translateX(-50%);
  width: 12px; height: 18px; background: #000; border: 1px solid #333; border-radius: 6px;
}

/* Wave animations */
@keyframes cs-slow-sway { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-9deg) translateX(-10px)} 75%{transform:rotate(9deg) translateX(10px)} }
@keyframes cs-drift { 0%,100%{transform:translate(0,0)rotate(0)} 20%{transform:translate(12px,-16px)rotate(3deg)} 50%{transform:translate(-5px,-22px)rotate(-2deg)} 75%{transform:translate(-14px,-5px)rotate(1deg)} }
@keyframes cs-ocean { 0%,100%{transform:translateY(0)rotate(0)} 50%{transform:translateY(-18px)rotate(4deg)} }
@keyframes cs-stars { 0%,100%{transform:translateY(0)rotate(0)} 25%{transform:translateY(-10px)rotate(3deg)} 75%{transform:translateY(-7px)rotate(-3deg)} }
@keyframes cs-flutter { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-5deg)translate(-2px,-2px)} 50%{transform:rotate(0)translate(0,-5px)} 75%{transform:rotate(5deg)translate(2px,-2px)} }

/* ── Lyrics ── */
.swim-lyrics {
  text-align: center; width: 90%; margin: 4px auto; z-index: 20;
  min-height: 42px; position: relative;
}
.swim-lyrics__main {
  font-size: 16px; font-weight: 800; color: #fff; letter-spacing: 1px;
  text-shadow: 0 0 12px var(--cs-theme);
  animation: cs-lyric-glow 3s ease-in-out infinite;
  transition: opacity 0.4s; line-height: 1.4;
}
.swim-lyrics__sub {
  font-size: 12px; color: rgba(255,255,255,0.65); font-style: italic;
  margin-top: 4px; line-height: 1.4;
}
@keyframes cs-lyric-glow { 0%,100%{opacity:0.75} 50%{opacity:1} }

/* ── Crowd ── */
.cs-crowd {
  display: flex; flex-direction: column-reverse; align-items: center; gap: 2px;
  width: 100%; margin-top: 2px; z-index: 5; pointer-events: none;
}
.cs-crowd-row { display: flex; align-items: flex-end; justify-content: center; gap: 6px; }
.cs-crowd-bomb {
  display: flex; flex-direction: column; align-items: center;
  opacity: var(--cb-opacity, 0.3);
  animation: cs-crowd-sway var(--cs-crowd-dur, 3s) ease-in-out infinite;
}
@keyframes cs-crowd-sway { 0%,100%{transform:rotate(0)} 30%{transform:rotate(-6deg)} 70%{transform:rotate(6deg)} }
.cs-cb-sphere {
  width: var(--cb-size, 16px); height: var(--cb-size, 16px); border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18), rgba(0,0,0,0.4));
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 0 calc(var(--cb-size, 16px) * 0.6) var(--cs-theme);
  transition: box-shadow 1s;
}
.cs-cb-handle {
  width: calc(var(--cb-size, 16px) * 0.28); height: calc(var(--cb-size, 16px) * 0.8);
  background: #1a1a1a; border-radius: 0 0 3px 3px; margin-top: -2px;
}

/* ── Controls ── */
.cs-controls {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  width: 100%; padding: 10px 14px 34px;
  background: linear-gradient(to top, #000 85%, transparent);
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 30;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.cs-ctrl-row { display: flex; align-items: center; justify-content: center; gap: 7px; flex-wrap: wrap; }
.cs-pat-btn {
  background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.2);
  color: rgba(255,255,255,0.7); padding: 6px 12px; border-radius: 20px;
  font-size: 11px; cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.cs-pat-btn:hover { background: rgba(168,85,247,0.2); border-color: rgba(168,85,247,0.4); }
.cs-pat-btn.active {
  background: linear-gradient(135deg, var(--cs-theme), #7c3aed);
  color: #fff; border-color: var(--cs-theme); font-weight: 700;
  box-shadow: 0 0 12px color-mix(in srgb, var(--cs-theme) 50%, transparent);
}
.cs-ctrl-bottom { gap: 12px; }
.cs-speed-wrap, .cs-color-wrap { display: flex; align-items: center; gap: 5px; }
.cs-label { font-size: 9px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
.cs-speed-btn {
  background: rgba(255,255,255,0.05); border: 1px solid #333; color: #888;
  padding: 4px 10px; border-radius: 20px; font-size: 10px; cursor: pointer; transition: all 0.2s;
}
.cs-speed-btn.active { background: #fff; color: #000; border-color: #fff; font-weight: 700; }
.cs-col-btn {
  width: 22px; height: 22px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.18); cursor: pointer; transition: all 0.2s; padding: 0;
}
.cs-col-btn:hover { transform: scale(1.2); border-color: #fff; }
.cs-col-btn.active { transform: scale(1.25); border-color: #fff; box-shadow: 0 0 8px rgba(255,255,255,0.5); }
.cs-col-rainbow { background: linear-gradient(135deg,#ef4444,#fbbf24,#22c55e,#3b82f6,#a855f7); font-size: 10px; display: flex; align-items: center; justify-content: center; }

/* ── Water surface at top ── */
.swim-surface { display: block !important; }
.swim-surface__shimmer, .swim-surface__wave, .swim-ship-shadow { display: block !important; }

/* ── Ripple area ── */
.swim-ripple-area { position: absolute; inset: 0; z-index: 8; }

@media (max-width: 480px) {
  .cs-sphere { width: 88px; height: 88px; }
  .cs-logo { font-size: 28px; }
  .cs-handle { width: 22px; height: 72px; }
  .cs-title { font-size: 18px; }
  .cs-stage { height: 155px; }
  .swim-lyrics__main { font-size: 13px; }
  .swim-lyrics__sub { font-size: 11px; }
  .cs-pat-btn { padding: 5px 9px; font-size: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .cs-pivot, .cs-crowd-bomb, .cs-ambient, .cs-star { animation: none !important; }
}
`;


const VOYAGE_SHIP_CSS = `
/* ═══ Voyage Arirang Ship (overlay) ═══ */
.vy-arirang-ship { width: 280px; height: 200px; position: relative; animation: vyShipBob 4s ease-in-out infinite; }
@keyframes vyShipBob { 0%, 100% { transform: translateY(0) rotate(-0.5deg); } 50% { transform: translateY(-4px) rotate(0.5deg); } }

.vy-arirang__glow { position: absolute; bottom: -10px; left: -15px; width: calc(100% + 30px); height: 30px; background: radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.15), transparent 70%); filter: blur(8px); animation: vyGlowPulse 3s ease-in-out infinite; }
@keyframes vyGlowPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }

.vy-arirang__mast { position: absolute; background: linear-gradient(90deg, #4a3a1a, #6b5228 30%, #7a5e30 50%, #6b5228 70%, #4a3a1a); border-radius: 1.5px; }
.vy-arirang__mast--1 { bottom: 24%; left: 15%; width: 3px; height: 52%; }
.vy-arirang__mast--2 { bottom: 24%; left: 34%; width: 3.5px; height: 56%; }
.vy-arirang__mast--3 { bottom: 24%; left: 56%; width: 3.5px; height: 54%; }
.vy-arirang__mast--4 { bottom: 24%; left: 75%; width: 3px; height: 45%; }

.vy-arirang__lantern { position: absolute; top: -3px; left: 50%; transform: translateX(-50%); width: 5px; height: 5px; background: radial-gradient(circle, #fff, #ffd866); border-radius: 50%; box-shadow: 0 0 8px rgba(255,220,100,0.8), 0 0 16px rgba(255,200,50,0.5), 0 0 30px rgba(255,180,0,0.3); animation: vyLanternPulse 3s ease-in-out infinite; }
.vy-arirang__mast--2 .vy-arirang__lantern { animation-delay: 0.75s; }
.vy-arirang__mast--3 .vy-arirang__lantern { animation-delay: 1.5s; }
.vy-arirang__mast--4 .vy-arirang__lantern { animation-delay: 2.25s; }
@keyframes vyLanternPulse { 0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.7; } 50% { transform: translateX(-50%) scale(1.4); opacity: 1; } }

.vy-arirang__xtree { position: absolute; height: 2.5px; background: #5a3a10; border-radius: 1px; }
.vy-arirang__gaff { position: absolute; height: 2.5px; background: linear-gradient(90deg, #5a3e1c, #7a5830, #5a3e1c); border-radius: 1px; transform-origin: left center; }
.vy-arirang__boom { position: absolute; height: 2.5px; background: linear-gradient(90deg, #4d3318, #6b4a25, #4d3318); border-radius: 1px; }
.vy-arirang__rig { position: absolute; width: 0.8px; background: rgba(50,35,15,0.3); }

.vy-arirang__sail { position: absolute; opacity: 0.88; }
.vy-arirang__sail--g1 { bottom: 40%; left: 17%; width: 17%; height: 34%; background: linear-gradient(180deg, rgba(220,215,200,0.9), rgba(200,195,180,0.85), rgba(180,175,165,0.8)); clip-path: polygon(0% 0%, 65% 0%, 100% 100%, 0% 100%); animation: vySailBillow 8s ease-in-out infinite; }
.vy-arirang__sail--g2 { bottom: 43%; left: 36%; width: 19%; height: 37%; background: linear-gradient(180deg, rgba(225,220,205,0.9), rgba(205,200,185,0.85), rgba(185,180,170,0.8)); clip-path: polygon(0% 0%, 70% 0%, 100% 100%, 0% 100%); animation: vySailBillow 9s ease-in-out infinite 1s; }
.vy-arirang__sail--g3 { bottom: 41%; left: 58%; width: 16%; height: 35%; background: linear-gradient(180deg, rgba(220,215,200,0.9), rgba(200,195,180,0.85), rgba(180,175,165,0.8)); clip-path: polygon(0% 0%, 68% 0%, 100% 100%, 0% 100%); animation: vySailBillow 8.5s ease-in-out infinite 0.5s; }
.vy-arirang__sail--jib1 { bottom: 26%; left: 77%; width: 27%; height: 44%; background: linear-gradient(135deg, rgba(215,210,195,0.85), rgba(195,190,175,0.8), rgba(175,170,160,0.75)); clip-path: polygon(0% 0%, 0% 100%, 100% 82%); animation: vySailBillow 7s ease-in-out infinite 2s; }
.vy-arirang__sail--jib2 { bottom: 30%; left: 79%; width: 20%; height: 36%; background: linear-gradient(135deg, rgba(210,205,190,0.8), rgba(190,185,170,0.75)); clip-path: polygon(0% 0%, 0% 100%, 100% 72%); opacity: 0.75; animation: vySailBillow 7.5s ease-in-out infinite 1.5s; }
.vy-arirang__sail::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(124,58,237,0.05), rgba(167,139,250,0.08), rgba(124,58,237,0.03)); animation: vySailMagic 5s ease-in-out infinite; }
@keyframes vySailBillow { 0%, 100% { transform: skewX(0deg) scaleX(1); } 50% { transform: skewX(1.2deg) scaleX(1.02); } }
@keyframes vySailMagic { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

.vy-arirang__hull { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 82%; height: 22%; background: linear-gradient(180deg, #e8e0d5, #ddd5c8 40%, #d0c8b8); clip-path: polygon(0% 30%, 4% 5%, 70% 5%, 85% 5%, 100% 50%, 95% 95%, 3% 95%, 0% 65%); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); }
.vy-arirang__hull-stripe { position: absolute; background: #1a1a1a; }
.vy-arirang__hull-name { position: absolute; bottom: 30%; left: 30%; font-family: 'Brush Script MT', 'Segoe Script', cursive; font-size: 13px; color: #c4a45a; font-style: italic; letter-spacing: 2px; white-space: nowrap; text-shadow: 0 0 10px rgba(200,170,80,0.5), 0 0 20px rgba(200,170,80,0.3); animation: vyNameGlow 3s ease-in-out infinite; }
@keyframes vyNameGlow { 0%, 100% { text-shadow: 0 0 10px rgba(200,170,80,0.5), 0 0 20px rgba(200,170,80,0.3); } 50% { text-shadow: 0 0 15px rgba(200,170,80,0.8), 0 0 30px rgba(200,170,80,0.5), 0 0 45px rgba(200,170,80,0.2); } }

.vy-arirang__port { position: absolute; top: 50%; width: 5px; height: 5px; border-radius: 50%; background: radial-gradient(circle, #ffd866, #cc9900); box-shadow: 0 0 6px rgba(255,216,102,0.8), 0 0 12px rgba(255,200,50,0.4); animation: vyPortFlicker 4s ease-in-out infinite; }
.vy-arirang__port:nth-child(5) { animation-delay: 0.5s; }
.vy-arirang__port:nth-child(6) { animation-delay: 1s; }
.vy-arirang__port:nth-child(7) { animation-delay: 1.5s; }
.vy-arirang__port:nth-child(8) { animation-delay: 2s; }
@keyframes vyPortFlicker { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; box-shadow: 0 0 10px rgba(255,216,102,1), 0 0 20px rgba(255,200,50,0.6); } }

.vy-arirang__bowsprit { position: absolute; right: -10%; bottom: 15%; width: 18%; height: 3px; background: linear-gradient(90deg, #7a5a1a, #9b7828, #7a5a1a); transform: rotate(-18deg); transform-origin: left center; border-radius: 0 2px 2px 0; }
.vy-arirang__deck { position: absolute; bottom: 20%; left: 50%; transform: translateX(-50%); width: 68%; height: 3.5%; background: linear-gradient(180deg, #5a3d20, #4a3018); }
.vy-arirang__railing { position: absolute; bottom: 23%; left: 18%; width: 56%; height: 5%; border: 1px solid rgba(255,255,255,0.2); border-bottom: none; border-radius: 1px 1px 0 0; background: repeating-linear-gradient(90deg, transparent 0px, transparent 7px, rgba(255,255,255,0.15) 7px, rgba(255,255,255,0.15) 8px); }

.vy-arirang__crew { position: absolute; bottom: 26%; left: 38%; display: flex; gap: 3px; align-items: flex-end; z-index: 5; }
.vy-arirang__person { display: flex; flex-direction: column; align-items: center; }
.vy-arirang__person::before { content: ''; width: 4px; height: 4px; background: #1a1515; border-radius: 50%; margin-bottom: 1px; }
.vy-arirang__person::after { content: ''; width: 5px; height: var(--h,12px); background: #151010; border-radius: 1.5px 1.5px 0 0; }

.vy-arirang__wake { position: absolute; bottom: -5%; left: 5%; width: 80%; height: 8%; }
.vy-arirang__foam { position: absolute; border-radius: 50%; filter: blur(2px); background: rgba(150,200,255,0.25); animation: vyFoam 3s ease-in-out infinite; }
.vy-arirang__foam:nth-child(1) { width: 20%; height: 50%; bottom: 20%; left: 5%; }
.vy-arirang__foam:nth-child(2) { width: 28%; height: 40%; bottom: 10%; left: 20%; background: rgba(120,180,255,0.18); animation-delay: 0.5s; }
.vy-arirang__foam:nth-child(3) { width: 35%; height: 30%; bottom: 30%; left: 40%; background: rgba(100,170,255,0.12); animation-delay: 1s; }
@keyframes vyFoam { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 0.9; } }

.vy-arirang__flag { position: absolute; top: 16%; left: 36%; width: 20px; height: 12px; background: linear-gradient(135deg, #7c3aed, #a78bfa); clip-path: polygon(0 0, 85% 25%, 100% 50%, 85% 75%, 0 100%); transform-origin: left center; animation: vyFlagWave 0.8s ease-in-out infinite alternate; box-shadow: 1px 1px 3px rgba(0,0,0,0.3); }
@keyframes vyFlagWave { 0% { transform: scaleX(1) skewY(0deg); } 100% { transform: scaleX(1.05) skewY(6deg); } }

@media (prefers-reduced-motion: reduce) {
  .vy-arirang-ship, .vy-arirang__sail, .vy-arirang__flag,
  .vy-arirang__lantern, .vy-arirang__foam, .vy-arirang__glow,
  .vy-arirang__port, .vy-arirang__hull-name { animation: none !important; }
}

/* ═══ Mobile ═══ */
@media (max-width: 480px) {
  .vy-arirang-ship { width: 200px; height: 140px; }
  .vy-ship-container { margin-top: -5vh; }
  .vy-narrative__line { font-size: clamp(11px, 3.5vw, 14px); letter-spacing: 1.5px; margin-bottom: 12px; }
  .vy-narrative__icon { font-size: 13px; margin-right: 5px; }
  .vy-header { padding: 14px; }
  .vy-close { width: 36px; height: 36px; font-size: 18px; }
  .vy-player { padding: 14px 14px 30px; }
  .vy-player-label { font-size: 9px; letter-spacing: 1.5px; margin-bottom: 8px; }
}
@media (max-height: 500px) and (orientation: landscape) {
  .vy-arirang-ship { width: 160px; height: 110px; }
  .vy-ship-container { margin-top: 0; }
  .vy-narrative { top: 45%; }
  .vy-narrative__line { font-size: 11px; margin-bottom: 8px; }
  .vy-ocean { height: 30%; }
  .vy-player { padding: 10px 14px 20px; }
}

/* ── Interactive Concert UI ── */
.concert-scene {
  position: absolute; inset: 0; z-index: 25;
  display: flex; flex-direction: column; align-items: center; pointer-events: none;
}
.concert-top-title { margin-top: 40px; text-align: center; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5); pointer-events: auto; }
.concert-top-title .concert-icon { font-size: 24px; animation: pulse 2s infinite; text-shadow: 0 0 15px rgba(255,100,200,0.8); }
.concert-top-title h2 { margin: 5px 0 0; font-family: 'Orbitron', sans-serif; font-size: 28px; font-weight: 800; letter-spacing: 2px; }
.concert-top-title p { margin: 2px 0 0; font-size: 11px; color: rgba(255,255,255,0.7); letter-spacing: 1px; }

.concert-ab-container { position: relative; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; pointer-events: auto; margin-top: 20px; }
.cab-lyric-hint { margin-top: 20px; font-size: 12px; font-weight: 700; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5); font-family: 'Orbitron', sans-serif; letter-spacing: 1px; }

/* Concert Army Bomb */
.concert-ab { position: relative; width: 140px; height: 260px; transition: transform 0.5s; z-index: 10; margin-bottom: 20px; }
.cab-globe {
  position: absolute; left: 50%; top: 0; transform: translateX(-50%);
  width: 140px; height: 140px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.5);
  box-shadow: inset 0 0 40px rgba(255,255,255,0.8), 0 0 50px var(--uw-glow, #a78bfa);
  background: radial-gradient(circle at 35% 25%, rgba(255,255,255,0.9), rgba(255,255,255,0.4) 40%, rgba(0,0,0,0.4));
  overflow: hidden; z-index: 2; transition: box-shadow 0.6s ease;
}
.cab-light { position: absolute; inset: 0; background: var(--uw-glow, #a78bfa); opacity: 0.35; filter: blur(8px); mix-blend-mode: overlay; transition: background 0.6s ease; }
.cab-logo { width: 46px; height: 70px; margin: 35px auto 0; position: relative; opacity: 0.9; }
.cab-logo::before, .cab-logo::after { content: ''; position: absolute; top: 0; width: 20px; height: 100%; border: 3px solid rgba(0,0,0,0.7); background: linear-gradient(180deg, #fff, #bbb); }
.cab-logo::before { left: 0; clip-path: polygon(0 0, 100% 18%, 100% 100%, 0 82%); }
.cab-logo::after { right: 0; clip-path: polygon(0 18%, 100% 0, 100% 82%, 0 100%); }

.cab-neck { position: absolute; left: 50%; top: 135px; transform: translateX(-50%); width: 66px; height: 16px; border-radius: 8px; background: linear-gradient(180deg, #888, #444); border: 1px solid rgba(255,255,255,0.2); z-index: 1; }
.cab-handle { position: absolute; left: 50%; top: 145px; transform: translateX(-50%); width: 54px; height: 105px; border-radius: 14px; background: linear-gradient(180deg, #222, #050505); border: 1px solid rgba(255,255,255,0.1); z-index: 0; box-shadow: inset 0 0 15px rgba(255,255,255,0.05); }
.cab-button { position: absolute; right: 20px; top: 8px; width: 24px; height: 16px; border-radius: 14px; transform: rotate(-30deg); background: #111; border: 1px solid rgba(255,255,255,0.2); }
.cab-button::after { content: ''; position: absolute; right: 4px; top: 4px; width: 8px; height: 8px; border-radius: 50%; background: var(--uw-glow, #a78bfa); box-shadow: 0 0 10px var(--uw-glow, #a78bfa); transition: background 0.6s ease, box-shadow 0.6s ease; }
.cab-base { position: absolute; left: 50%; top: 245px; transform: translateX(-50%); width: 62px; height: 16px; border-radius: 8px; background: linear-gradient(180deg, #111, #000); border: 1px solid rgba(255,255,255,0.1); z-index: 1; }
.cab-glow { position: absolute; left: 50%; top: 70px; transform: translateX(-50%); width: 300px; height: 300px; background: var(--uw-glow, #a78bfa); filter: blur(80px); opacity: 0.15; z-index: -1; transition: background 0.6s; pointer-events: none; }

/* Move Animations */
@keyframes cabSway { 0%,100%{transform:rotate(-8deg);} 50%{transform:rotate(8deg);} }
@keyframes cabDrift { 0%,100%{transform:translateX(-15px) rotate(-10deg) translateY(0);} 50%{transform:translateX(15px) rotate(10deg) translateY(-10px);} }
@keyframes cabOcean { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-20px) scale(1.05);} }
@keyframes cabStars { 0%,100%{transform:translateY(-8px) rotate(-3deg); filter:brightness(1);} 50%{transform:translateY(8px) rotate(3deg); filter:brightness(1.5);} }
@keyframes cabFlutter { 0%,100%{transform:scale(1) rotate(0);} 10%,30%,50%,70%,90%{transform:scale(1.05) rotate(2deg);} 20%,40%,60%,80%{transform:scale(0.95) rotate(-2deg);} }

.move-sway { animation: cabSway 2s ease-in-out infinite; }
.move-drift { animation: cabDrift 4s ease-in-out infinite; }
.move-ocean { animation: cabOcean 3s ease-in-out infinite; }
.move-stars { animation: cabStars 1.5s ease-in-out infinite; }
.move-flutter { animation: cabFlutter 4s linear infinite; }

.speed-slow { animation-duration: 4s !important; }
.speed-medium { animation-duration: 2s !important; }
.speed-fast { animation-duration: 0.9s !important; }

/* Concert Controls */
.concert-controls { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-bottom: 25px; padding: 15px 20px; pointer-events: auto; background: rgba(0,0,0,0.5); border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); z-index: 30; }
.cc-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; }
.cc-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #ccc; padding: 6px 12px; border-radius: 20px; font-size: 11px; cursor: pointer; transition: 0.2s; font-family: 'Inter', sans-serif; font-weight: 500; }
.cc-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
.cc-btn.active { background: rgba(255,255,255,0.25); border-color: rgba(255,255,255,0.5); color: #fff; font-weight: 700; box-shadow: 0 0 10px rgba(255,255,255,0.2); }
.cc-speed, .cc-colors { display: flex; align-items: center; gap: 6px; }
.cc-speed span, .cc-colors span { font-size: 10px; color: #aaa; letter-spacing: 1px; font-weight: 700; margin-right: 2px; }
.cc-btn-small { padding: 4px 8px; font-size: 10px; }
.cc-color-btn { width: 18px; height: 18px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: transform 0.2s; padding: 0; outline: none; margin: 0 2px; }
.cc-color-btn:hover { transform: scale(1.2); }
.cc-color-btn.active { border-color: #fff; transform: scale(1.3); box-shadow: 0 0 8px rgba(255,255,255,0.6); }

/* Remove old lightstick static */
.swim-lightstick { display: none !important; }
`;
// Auto-inject page styles on load
ensureMagicShipStyles();
  
  // =============================================
  // ██████  ADMIN SYSTEM CONTROLS & LOGIC
  // =============================================
  
  async function adminReleaseResults() {
      if (!STATE.adminSession) {
          showToast('Login as admin first', 'error');
          return;
      }
      try {
          const summary = await Api.call('getWeeklySummary', { week: STATE.week }, { cache: false });
          const currentlyReleased = summary.resultsReleased === true;
          const newState = !currentlyReleased;
          if (!confirm(`${newState ? 'RELEASE' : 'HIDE'} results for ${STATE.week}?`)) return;
  
          Loading.show();
          const d = await Api.call('toggleResultsRelease', {
              week: STATE.week,
              released: newState,
              adminSession: STATE.adminSession,
              agentNo: STATE.agentNo,
          }, { dedupe: false, cache: false });
  
          if (d.success) {
              showToast(newState ? 'Results released! 📢' : 'Results hidden 🔒', 'success');
              Api.invalidate('getWeeklySummary');
              if (typeof renderWeekConfirmation === 'function') {
                  renderWeekConfirmation(document.getElementById('admin-panel-body'));
              }
          } else {
              showToast(`❌ ${d.error}`, 'error');
          }
      } catch (e) {
          showToast('❌ ' + e.message, 'error');
      } finally {
          Loading.hide();
      }
  }
  
  async function adminTriggerSync() {
      if (!confirm('Trigger a full database sync? This forces Last.fm checks for all agents.')) return;
      Loading.show();
      try {
          const d = await Api.call('initiateFairSync', { adminKey: 'BTSSYNC2024' }, { dedupe: false, cache: false });
          if (d.success) {
              showToast(`✅ Sync complete: ${d.progress?.completed}/${d.progress?.total} agents`, 'success');
              Api.invalidate(); 
          } else {
              showToast(`❌ Error: ${d.error}`, 'error');
          }
      } catch (e) { showToast('❌ ' + e.message, 'error'); }
      finally { Loading.hide(); }
  }
  
  async function adminCheckSync() {
      Loading.show();
      try {
          const d = await Api.call('getSyncStatus', {}, { cache: false });
          if (d.success && d.lastSync) {
              alert(`📊 SYNC STATUS:\n\nSynced: ${d.lastSync.synced} agents\nFailed: ${d.lastSync.failed} agents\nDuration: ${d.lastSync.duration}ms\nTime: ${new Date(d.lastSync.timestamp).toLocaleString()}`);
          } else { showToast('No sync data available yet', 'info'); }
      } catch (e) { showToast('❌ ' + e.message, 'error'); }
      finally { Loading.hide(); }
  }
  
  async function adminFinalizeWeek() {
      if (!confirm(`⚠️ FINAL WARNING: Finalize ${STATE.week}?\nThis checks Side Missions, issues Police warnings, and locks the week.`)) return;
      Loading.show();
      try {
          const d = await Api.call('finalizeWeek', { adminKey: 'BTSSYNC2024', week: STATE.week }, { dedupe: false, cache: false });
          if (d.success) {
              showToast('✅ Week successfully finalized!', 'success');
              Api.invalidate();
          } else { showToast(`❌ ${d.error}`, 'error'); }
      } catch (e) { showToast('❌ ' + e.message, 'error'); }
      finally { Loading.hide(); }
  }
  
  async function adminGenerateUnits() {
      if (!confirm('🔄 Generate Arirang Unit rotation for next week?')) return;
      Loading.show();
      try {
          const d = await Api.call('generateUnitRotation', { adminKey: 'BTSSYNC2024' }, { dedupe: false, cache: false });
          if (d.success) { showToast('✅ Next week units generated successfully', 'success'); }
          else { showToast(`❌ ${d.error}`, 'error'); }
      } catch (e) { showToast('❌ ' + e.message, 'error'); }
      finally { Loading.hide(); }
  }
  
  // =============================================
  // ██████  FINAL ROUTING & SIDEBAR LOGIC
  // =============================================
  
  // 1. Register all pages to the renderer
  // Locate this block near the end of your file and update it:
  const ROUTER_MAP = {
  'home': renderHome,
  'profile': renderProfile,
  'guide': renderGuidePage,
  'trackgoals': renderTrackGoals,
  'albumgoals': renderAlbumGoals,
  'album2x': renderAlbum2x,
  'unit': renderUnit,
  'sidemissions': renderSideMissions,
  'attendance': renderAttendancePage,
  'police': renderPolicePage,
  'rankings': loadRankings,
  'teams': renderTeams,
  'hangar': renderMagicShip,
  'operatives': renderOperatives,
  'comparison': renderComparison,
  'secretmissions': renderSecretMissions,
  'sotd': renderSongOfDay,
  'protocol148': render148Protocol,
  'badges': renderBadgesPage,
  'chat': loadChat,
  'playlists': renderPlaylists,
  'announcements': renderAnnouncements,
  'summary': renderSummary,
  'feed': loadFeed,
  'gclinks': renderGCLinks,
};
Object.assign(PAGE_RENDERERS, ROUTER_MAP);

  
  // 2. Sidebar Core Functions
  function openSidebar() {
    const sb = $('sidebar'), ov = $('sidebarOverlay');
    if (sb) sb.classList.add('open');
    if (ov) { ov.style.display = 'block'; setTimeout(() => ov.classList.add('active'), 10); }
    document.body.classList.add('sidebar-open');
  }
  
  function closeSidebar() {
    const sb = $('sidebar'), ov = $('sidebarOverlay');
    if (sb) sb.classList.remove('open');
    if (ov) { ov.classList.remove('active'); setTimeout(() => ov.style.display = 'none', 300); }
    document.body.classList.remove('sidebar-open');
  }
  
  function toggleSidebar() {
    const sb = $('sidebar');
    if (!sb) return;
    sb.classList.contains('open') ? closeSidebar() : openSidebar();
  }
  
  // 3. Mobile Swipe-to-Close Support
  (function setupSwipeClose() {
    let startX = 0, tracking = false;
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
  
    sidebar.addEventListener('touchstart', e => { startX = e.touches[0].clientX; tracking = true; }, { passive: true });
    sidebar.addEventListener('touchmove', e => {
      if (!tracking) return;
      const dx = e.touches[0].clientX - startX;
      if (dx < -60) { closeSidebar(); tracking = false; }
    }, { passive: true });
    sidebar.addEventListener('touchend', () => { tracking = false; }, { passive: true });
  })();
  
 // =============================================
// ██████  GLOBAL WINDOW EXPORTS
// =============================================
// v2.3: Fixed filterOperatives alias, removed non-existent functions

const EXPORTS = {
    // ── Auth ──
    doLogin,
    doLogout,
    findAgent,

    // ── Navigation ──
    goTo,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    toggleNavGroup,

    // ── Dashboard & Sync ──
    loadDashboard,
    syncData,
    handleManualSync,

    // ── Profile & Account ──
    openPasswordModal,
    closePasswordModal,
    changePassword,
    deleteAccountConfirm,
    promptDeleteAccount,

    // ── Leave System ──
    applyLeave,
    cancelLeave,
    openLeaveModal,
    confirmLeaveApplication,
    cancelLeaveRequest,

    // ── Attendance ──
    submitAttendance,

    // ── Page Renderers ──
    renderHome,
    renderProfile,
    renderTrackGoals,
    renderAlbumGoals,
    renderAlbum2x,
    renderUnit,
    renderSideMissions,
    renderTeams,
    renderAnnouncements,
    renderGuidePage,
    renderSongOfDay,
    renderSecretMissions,
    renderBadgesPage,
    renderSummary,
    render148Protocol,
    renderOperatives,
    renderComparison,
    renderAttendancePage,
    renderPolicePage,
    renderPlaylists,
    renderMagicShip,
    renderRingProgress,

    // ── Rankings ──
    loadRankings,
    switchRankTab,

    // ── Feed & Chat ──
    loadFeed,
    loadChat,
    sendChat,

    // ── Career & Streak ──
    loadCareerHistory,

    // ── Song of the Day ──
    submitSongAnswer,

    // ── 148 Protocol ──
    toggle148Task,
    show148Info,

    // ── Guide ──
    toggleGuideSection,

    // ── Notifications ──
    checkNotifications,
    showNotificationCenter,
    checkHTOnboarding,
    dismissHT,

    // ── Magic Ship ──
    launchTheVoyage,

    // ── Missions ──
    markMissionComplete,

    // ── Search / Filter ──
    // filterOperatives is now an alias for filterOperativesModern (attached via window.x = fn)
    filterOperatives: function(q) { 
        if (typeof window.filterOperativesModern === 'function') {
            window.filterOperativesModern(q); 
        }
    },

    // ── Share ──
    copyShareText,

    // ── Admin ──
    showAdminPanel,
    adminExitMode,
    adminTriggerSync,
    adminCheckSync,
    adminFinalizeWeek,
    adminGenerateUnits,
    adminReleaseResults,
    smartUpdateStatus,

    // ── Effects ──
    fireConfetti,
};

// Attach everything to window exactly once
Object.assign(window, EXPORTS);

// ── Post-export: verify nothing is missing ──
// Run this in browser console if you suspect a broken export:
// Object.keys(EXPORTS).forEach(n => { if (typeof window[n] !== 'function') console.warn('MISSING:', n); });
  
  // =============================================
  // ██████  INITIATE APP
  // =============================================
  
  
  // =============================================
  // END OF app.js v2.0 — STABLE & SECURE
  // =============================================
  
