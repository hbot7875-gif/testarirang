// =============================================
// ARIRANG BATTLE TRACKER — PART 1 (CLEANED)
// Configuration, Helpers & Dashboard (Read-Only)
//
// Timezone policy:
//   • Daily bucketing / date strings → KST (UTC+9)
//   • Week boundaries → KST midnight
//   • DB storage (updated_at, etc.) → UTC ISO strings
//   • Last.fm unix timestamps → converted to KST dates
// =============================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type SupabaseDB = ReturnType<typeof createClient>

// =============================================
// 1. CORS HEADERS
// =============================================

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-auth, preferred-timezone',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// =============================================
// 2. ENVIRONMENT HELPERS
// =============================================

/** Throws if env var missing — use for secrets that must exist */
function requireEnv(name: string): string {
  const value = Deno.env.get(name)
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

// =============================================
// 3. CONFIGURATION
// =============================================

const CONFIG = {
  // Arirang 2X: every member streams every track 2× PER DAY
  ALBUM_2X_DAILY_REQ: 2,
  ALBUM_2X_TRACKS: 14,
  // 14 tracks × 2 streams × 7 days = 196 streams/week minimum

  // Arirang Unit: team-specific 2 tracks, 25× each per week
  ARIRANG_UNIT_REQ: 25,
  ARIRANG_UNIT_TEAM_XP: 25,

  // Side Missions: 4 tracks, 20× per week total, must stream EVERY day
  SIDE_MISSION_WEEKLY_REQ: 20,
  SIDE_MISSION_MIN_DAILY: 1,
  SIDE_MISSION_TEAM_XP: 15,

  // Police
  MAX_POLICE_REPORTS: 3,

  TRAINING_WEEKS: ['Week 1', 'Week 2'],

  // XP: 10 scrobbles = 1 XP
  SCROBBLES_PER_XP: 10,

  // Sync
  REFRESH_COOLDOWN_MINUTES: 5,
  HOURLY_SYNC_ENABLED: true,

  // Leave
  MAX_LEAVES_PER_MONTH: 1,

  // Battle dates (KST)
  BATTLE_START: '2026-03-22',
  BATTLE_END: '2026-07-22',

  // Override current week (set to null for production)
  OVERRIDE_CURRENT_WEEK: null,
}

// =============================================
// 4. WEEK START DATES (KST calendar dates)
// =============================================

const WEEK_START_DATES: Record<string, string> = {
  'Week 1': '2026-03-22',
  'Week 2': '2026-03-29',
  'Week 3': '2026-04-05',
  'Week 4': '2026-04-12',
  'Week 5': '2026-04-19',
  'Week 6': '2026-04-26',
  'Week 7': '2026-05-03',
  'Week 8': '2026-05-10',
  'Week 9': '2026-05-17',
  'Week 10': '2026-05-24',
  'Week 11': '2026-05-31',
  'Week 12': '2026-06-07',
  'Week 13': '2026-06-14',
  'Week 14': '2026-06-21',
  'Week 15': '2026-06-28',
  'Week 16': '2026-07-05',
  'Week 17': '2026-07-12',
  'Week 18': '2026-07-19',
}

// =============================================
// 5. TEAMS
// =============================================

const TEAMS = [
  'Team MONO', 'Team Happy', 'Team D-Day', 'Team Hopeworld',
  'Team Muse', 'Team Layover', 'Team Golden',
] as const

type TeamName = (typeof TEAMS)[number]

const TEAM_PFPS: Record<string, string> = {
  'Team MONO': '',
  'Team Happy': '',
  'Team D-Day': '',
  'Team Hopeworld': '',
  'Team Muse': '',
  'Team Layover': '',
  'Team Golden': '',
}

// =============================================
// 6. ARIRANG ALBUM TRACKS (14 tracks)
//    2X Challenge: stream each 2× PER DAY
// =============================================

const ARIRANG_TRACKS: string[] = [
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
];

const ALBUM_CHALLENGE_VARIANTS: Record<string, string[]> = {
  'Swim': ['sWiM', 'SWIM', 'swim', 'Swim', 'SWIM (Title Track)'],
  'Body to Body': ['bOdY tO bOdY', 'Body to Body', 'BODY TO BODY'],
  'Hooligan': ['hOoLiGaN', 'Hooligan', 'HOOLIGAN'],
  'Aliens': ['aLiEnS', 'Aliens', 'ALIENS', 'aliens'],
  'FYA': ['fYa', 'FYA', 'fya', 'F.Y.A'],
  'Merry Go Round': ['mErRy gO rOuNd', 'Merry Go Round', 'MERRY GO ROUND', 'Merry-Go-Round'],
  'One More Night': ['oNe MoRe NiGhT', 'One More Night', 'ONE MORE NIGHT'],
  'Please': ['Please', 'please', 'PLEASE'],
  'Into the Sun': ['iNtO tHe SuN', 'Into the Sun', 'INTO THE SUN'],
  'No. 29': ['nO. 29', 'No. 29', 'no. 29', 'NO. 29', 'No', 'NO'],
  'Normal': ['nOrMaL', 'Normal', 'NORMAL', 'normal'],
  'they don’t know ’bout us': [
    'they don’t know ’bout us',
    "they don't know 'bout us",
    "they dont know bout us",
    "THEY DON'T KNOW 'BOUT US"
  ],
  '2.0': ['2.0', '2point0', '2.O'],
  'Like Animals': ['lIkE aNiMaLs', 'Like Animals', 'LIKE ANIMALS']
};

// =============================================
// 7. SIDE MISSION TRACKS (4 tracks)
//    20× per week total, must stream EVERY day
// =============================================

const SIDE_MISSION_TRACKS = [
  {
    name: 'Wild Flower',
    artist: 'RM',
    variants: [
      'Wild Flower (with youjeen)',
      '야생화',
      '야생화 Wild Flower',
      '야생화 Wild Flower (with 조유진)',
      'Wild Flower (feat. youjeen)',
      'Wild Flower (with 조유진)',
      'Wild Flower (with Youjeen)'
    ],
    weeklyRequired: 20,
    minDaily: 1,
  },
  {
    name: "Don't Say You Love Me",
    artist: 'JIN',
    variants: [
      'Dont Say You Love Me', 'DSYLM',
      "Don't say you love me", "DON'T SAY YOU LOVE ME",
    ],
    weeklyRequired: 20,
    minDaily: 1,
  },
  {
    name: 'Haegeum',
    artist: 'Agust D',
    variants: ['해금', 'HAEGEUM', 'haegeum', '해금 Haegeum'],
    weeklyRequired: 20,
    minDaily: 1,
  },
  {
    name: "Killin' It Girl (feat. GloRilla)",
    artist: 'J-Hope',
    variants: [
      "Killin' It Girl",
      "killin' it girl",
      "KILLIN' IT GIRL",
      "Killin It Girl",
      "killing it girl",
      "Killin' It Girl (feat. GloRilla)",
      "Killing It Girl",
      "Killin' It Girl - feat. GloRilla",
      "Killin' It Girl (Solo Version)" // Fixed missing comma above this line
    ],
    weeklyRequired: 20,
    minDaily: 1,
  }
]

const ARIRANG_SPOTIFY =
  'https://open.spotify.com/album/PLACEHOLDER_UPDATE_ON_RELEASE'

// =============================================
// 8. HELPER FUNCTIONS
// =============================================

// ---------- CONSTANTS ----------

const KST_OFFSET_MS = 9 * 60 * 60 * 1000 // UTC+9

// ---------- CACHE HEADERS ----------

function getCacheHeaders(): Record<string, string> {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store',
  }
}

// ---------- KST TIME HELPERS ----------

/** Current KST date string YYYY-MM-DD (for daily bucketing) */
function getKSTDateString(): string {
  const d = new Date(Date.now() + KST_OFFSET_MS)
  return d.toISOString().slice(0, 10)
}

/** Current UTC ISO string (for DB updated_at columns) */
function utcNow(): string {
  return new Date().toISOString()
}

/** Convert Unix timestamp (seconds) → KST date string */
function unixToKSTDate(timestamp: number): string {
  const d = new Date(timestamp * 1000 + KST_OFFSET_MS)
  return d.toISOString().slice(0, 10)
}
/** NEW: PT date string YYYY-MM-DD for Voting reset */
function getPTDateString(): string {
  // en-CA locale naturally produces YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}
/** 
 * NEW: Sums up daily scrobbles for an ALBUM across all track variants 
 */
function findDailyAlbumScrobbles(
  dailyTracks: Record<string, number>, // This contains [TrackName: Count]
  combinedTracks: Record<string, string>, // We need a way to know which tracks belong to which album
  targetAlbum: string,
): number {
  // For the Arirang Album, we know it consists of the 14 ARIRANG_TRACKS
  if (normalizeKey(targetAlbum) === normalizeKey('Arirang')) {
    let total = 0;
    for (const [trackName, count] of Object.entries(dailyTracks)) {
      if (ARIRANG_TRACKS.map(t => normalizeKey(t)).includes(normalizeKey(trackName))) {
        total += count;
      }
    }
    return Math.floor(total / 14); // Return "Full Album" equivalents
  }
  return 0;
}

// ---------- WEEK HELPERS ----------

/** Build UTC-based time ranges for every week (boundaries at KST midnight) */
function buildWeekDateRanges(): Record<string, { start: string; end: string }> {
  const ranges: Record<string, { start: string; end: string }> = {}
  const sorted = Object.entries(WEEK_START_DATES).sort(
    (a, b) => new Date(a[1]).getTime() - new Date(b[1]).getTime(),
  )
  for (const [label, startDate] of sorted) {
    // KST midnight → proper timezone-aware ISO
    const startKST = `${startDate}T00:00:00+09:00`
    const startMs = new Date(startKST).getTime()
    const endMs = startMs + 7 * 24 * 60 * 60 * 1000 - 1000
    ranges[label] = {
      start: startKST,
      end: new Date(endMs).toISOString(),
    }
  }
  return ranges
}

const WEEK_DATE_RANGES = buildWeekDateRanges()

/** Determine which week we're currently in */
function getCurrentWeekLabel(): string {
  if (CONFIG.OVERRIDE_CURRENT_WEEK) return CONFIG.OVERRIDE_CURRENT_WEEK
  const nowMs = Date.now()
  const sorted = Object.entries(WEEK_DATE_RANGES).sort(
    (a, b) => new Date(b[1].start).getTime() - new Date(a[1].start).getTime(),
  )
  for (const [label, range] of sorted) {
    if (nowMs >= new Date(range.start).getTime()) return label
  }
  return 'Pre-Season'
}

/** Given "Week 4" returns "Week 3", given "Week 1" returns null */
function getPreviousWeekLabel(weekLabel: string): string | null {
  const match = weekLabel.match(/(\d+)/)
  if (!match) return null
  const n = parseInt(match[1], 10)
  if (n <= 1) return null
  return weekLabel.replace(/\d+/, String(n - 1))
}

/** Unix-second range for Last.fm API queries */
function getWeekTimeRange(weekLabel: string): { from: number; to: number } {
  const range = WEEK_DATE_RANGES[weekLabel]
  if (range) {
    return {
      from: Math.floor(new Date(range.start).getTime() / 1000),
      to: Math.floor(new Date(range.end).getTime() / 1000),
    }
  }
  console.error(`[WEEK] "${weekLabel}" not found`)
  const now = Date.now()
  return {
    from: Math.floor((now - 7 * 86400000) / 1000),
    to: Math.floor(now / 1000),
  }
}

/** Seven KST date strings for a given week */
function getWeekDates(weekLabel: string): string[] {
  const startDate = WEEK_START_DATES[weekLabel]
  if (!startDate) return []
  const dates: string[] = []
  const start = new Date(startDate + 'T00:00:00Z') // treat as pure calendar date
  for (let i = 0; i < 7; i++) {
    dates.push(new Date(start.getTime() + i * 86400000).toISOString().slice(0, 10))
  }
  return dates
}

/** YYYY-MM month for leave tracking */
function getWeekMonth(weekLabel: string): string {
  const startDate = WEEK_START_DATES[weekLabel]
  return startDate ? startDate.substring(0, 7) : ''
}

/** Guard: is this a known week label? */
function isValidWeek(week: string): boolean {
  return !!WEEK_START_DATES[week]
}

// ---------- STRING / MATCHING HELPERS ----------

/**
 * Normalise a track/album name for fuzzy matching.
 * Strips diacritics, apostrophes, punctuation; lowercases; collapses whitespace.
 */
function normalizeKey(s: string): string {
  if (!s) return ''
  return String(s)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')   // combining diacritics
    .toLowerCase()
    .replace(/[''`’‘´]/g, '')          // apostrophes / backticks / smart quotes
    .replace(/[:~–—\-]/g, ' ')         // dashes / colons → space
    .replace(/[^\p{L}\p{N}\s]/gu, '')  // KEEP ALL LETTERS/NUMBERS (Fixes K-pop Hangul!)
    .replace(/\s+/g, ' ')              // collapse whitespace
    .trim()
}

/** 10 scrobbles → 1 XP */
function scrobblesToXP(count: number): number {
  return Math.floor(count / CONFIG.SCROBBLES_PER_XP)
}

/** Extract 11-char YouTube video ID from any URL shape */
function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const str = url.toString().trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = str.match(p)
    if (m) return m[1]
  }
  return null
}

/** Strip a Last.fm profile URL down to the bare username */
function cleanLastFmUsername(input: string): string {
  if (!input) return ''
  return input
    .replace(/^(https?:\/\/)?(www\.)?last\.fm\/user\//i, '')
    .replace(/\/.*$/, '')
    .replace(/\?.*$/, '')
    .trim()
}

/** Total scrobbles for a track across all name variants (weekly) */
/** 
 * FIXED: Total scrobbles for a track across ALL variants (Sums them up)
 */
function findTrackScrobbles(
  combinedTracks: Record<string, number>,
  targetTrack: string,
  variants?: string[],
): number {
  const allTargetVariants = [targetTrack, ...(variants || [])].map(v => normalizeKey(v));
  let totalMatch = 0;

  for (const [name, count] of Object.entries(combinedTracks)) {
    if (allTargetVariants.includes(normalizeKey(name))) {
      totalMatch += count;
    }
  }
  return totalMatch;
}

/** 
 * FIXED: Daily scrobbles for a track across ALL variants (Sums them up)
 */
function findDailyTrackScrobbles(
  dailyTracks: Record<string, number>,
  targetTrack: string,
  variants?: string[],
): number {
  const allTargetVariants = [targetTrack, ...(variants || [])].map(v => normalizeKey(v));
  let totalMatch = 0;

  for (const [name, count] of Object.entries(dailyTracks)) {
    if (allTargetVariants.includes(normalizeKey(name))) {
      totalMatch += count;
    }
  }
  return totalMatch;
}

// =============================================
// 9. CORE DATA FUNCTIONS
// =============================================

async function getAvailableWeeks(supabase: SupabaseDB) {
  // Query both stats and goal definitions to find all defined weeks
  const [statsRes, goalsRes] = await Promise.all([
    supabase.from('weekly_member_stats').select('week_label'),
    supabase.from('goal_definitions').select('week_label')
  ]);

  const weeksSet = new Set<string>();

  // Default: Always allow Week 1 to show up
  weeksSet.add('Week 1');

  statsRes.data?.forEach((w: any) => weeksSet.add(w.week_label));
  goalsRes.data?.forEach((w: any) => weeksSet.add(w.week_label));

  // Remove "Pre-Season" from the list if it accidentally got in there
  const availableWeeks = Array.from(weeksSet)
    .filter(w => w !== 'Pre-Season')
    .sort();

  return {
    success: true,
    weeks: availableWeeks,
    current: getCurrentWeekLabel()
  };
}

async function getAllAgents(supabase: SupabaseDB) {
  const { data, error } = await supabase
    .from('agents')
    .select('agent_no, name, team, instagram_handle')
    .eq('status', 'active')
    .order('agent_no')

  if (error) {
    console.error('[getAllAgents]', error.message)
    return { success: false, error: error.message, agents: [] }
  }

  return {
    success: true,
    agents: (data || []).map((a: any) => ({
      agentNo: a.agent_no,
      name: a.name,
      team: a.team,
      instagram: a.instagram_handle,
    })),
    lastUpdated: utcNow(),
  }
}

async function getAgentByInstagram(supabase: SupabaseDB, instagram: string) {
  if (!instagram) return { success: false, result: null }
  const clean = instagram.toLowerCase().replace(/@/g, '').trim()

  const { data, error } = await supabase
    .from('agents')
    .select('agent_no')
    .eq('instagram_handle', clean) // stored lowercase
    .limit(1)
    .maybeSingle()

  if (error) console.error('[getAgentByInstagram]', error.message)
  return { success: true, result: data?.agent_no || null }
}

async function debugWeekAndGoals(supabase: SupabaseDB, week: string) {
  const [goalsRes, allWeeksRes, unitRes, smConfigRes, statusRes] = await Promise.all([
    supabase.from('goal_definitions')
      .select('week_label, team, target_name, target_type, goal_amount')
      .eq('week_label', week),
    supabase.from('goal_definitions').select('week_label'),
    supabase.from('arirang_unit_rotation').select('*').eq('week_label', week),
    supabase.from('side_mission_config').select('*').eq('active', true),
    supabase.from('team_status').select('*').eq('week_label', week),
  ])

  const uniqueWeeks = [
    ...new Set((allWeeksRes.data || []).map((g: any) => g.week_label)),
  ].sort()

  return {
    success: true,
    currentWeek: getCurrentWeekLabel(),
    requestedWeek: week,
    weeksInGoalsTable: uniqueWeeks,
    goals: goalsRes.data || [],
    goalsCount: goalsRes.data?.length || 0,
    weekRange: WEEK_DATE_RANGES[week] || null,
    weekDates: getWeekDates(week),
    arirangTracks: ARIRANG_TRACKS,
    unitRotation: unitRes.data || [],
    sideMissions: smConfigRes.data || [],
    teamStatuses: statusRes.data || [],
    teams: [...TEAMS],
    config: {
      overrideWeek: CONFIG.OVERRIDE_CURRENT_WEEK,
      kstDate: getKSTDateString(),
      album2xDailyReq: CONFIG.ALBUM_2X_DAILY_REQ,
      unitReq: CONFIG.ARIRANG_UNIT_REQ,
      sideMissionWeeklyReq: CONFIG.SIDE_MISSION_WEEKLY_REQ,
      sideMissionMinDaily: CONFIG.SIDE_MISSION_MIN_DAILY,
      unitTeamXP: CONFIG.ARIRANG_UNIT_TEAM_XP,
      sideMissionTeamXP: CONFIG.SIDE_MISSION_TEAM_XP,
      maxLeavesPerMonth: CONFIG.MAX_LEAVES_PER_MONTH,
      maxPoliceReports: CONFIG.MAX_POLICE_REPORTS,
      scrobblesPerXP: CONFIG.SCROBBLES_PER_XP,
    },
  }
}

// =============================================
// 10. DASHBOARD (READ-ONLY — no writes)
//     Queries parallelised via Promise.all
// =============================================

async function getDashboardData(supabase: SupabaseDB, agentNo: string, week: string) {
  if (!agentNo) return { success: false, error: 'Agent number required' }
  if (week !== 'Pre-Season' && !isValidWeek(week)) {
    return { success: false, error: `Unknown week: ${week}` }
  }

  // ── AGENT (critical — must succeed) ────────────────────────
  const { data: agent, error: agentErr } = await supabase
    .from('agents')
    .select('*')
    .eq('agent_no', agentNo)
    .limit(1)
    .single()

  if (agentErr || !agent) {
    return { success: false, error: agentErr?.message || 'Agent not found' }
  }

  const joinDateKST = unixToKSTDate(new Date(agent.created_at).getTime() / 1000)

  const weekDates = getWeekDates(week)
  let today = getKSTDateString()
  
  // ✅ FIX: Cap 'today' to the last day of the week so past weeks don't break the UI
  if (weekDates.length > 0 && today > weekDates[6]) {
    today = weekDates[6];
  }
  
  const currentMonth = getWeekMonth(week)

  // ── PARALLEL QUERIES (all independent of each other) ───────
  const [
    statsRes, rankRes, summaryRes, goalsRes, annoRes, leaveRes,
    trackContribRes, albumContribRes, album2xRes, unitRes,
    smDailyRes, attendRes, teamStatusRes, policeRes, warningRes,
    allTeamsRes, topAgentsRes, globalGoalRes, leaveUsageRes,
    availWeeksRes, goalDailyRes, teamAlbum2xRes
  ] = await Promise.all([
    supabase.from('weekly_member_stats').select('*')
      .eq('agent_id', agent.id).eq('week_label', week).maybeSingle(),
    supabase.from('live_rankings').select('global_rank, team_rank')
      .eq('agent_no', agentNo).eq('week_label', week).maybeSingle(),
    supabase.from('weekly_summary').select('*')
      .eq('week_label', week).eq('team', agent.team).maybeSingle(),
    supabase.from('team_goals_progress').select('*')
      .eq('week_label', week).eq('team', agent.team),
    supabase.from('announcements').select('*')
      .or(`week.eq.${week},week.eq.all`)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false }).limit(5),
    supabase.from('leave_requests').select('*')
      .eq('agent_no', agentNo).eq('week_label', week).maybeSingle(),
    supabase.from('member_scrobble_details').select('target_name, scrobble_count')
      .eq('agent_id', agent.id).eq('week_label', week).eq('target_type', 'track'),
    supabase.from('member_scrobble_details').select('target_name, scrobble_count')
      .eq('agent_id', agent.id).eq('week_label', week).eq('target_type', 'album'),
    supabase.from('album_2x_daily').select('*')
      .eq('agent_no', agentNo).eq('week_label', week),
    supabase.from('arirang_unit_rotation').select('*')
      .eq('week_label', week).eq('team', agent.team).maybeSingle(),
    supabase.from('side_mission_daily').select('*')
      .eq('agent_no', agentNo).eq('week_label', week),
    supabase.from('attendance_submissions').select('*')
      .eq('agent_no', agentNo).eq('week_label', week).maybeSingle(),
    supabase.from('team_status').select('*')
      .eq('team', agent.team).eq('week_label', week).maybeSingle(),
    supabase.from('police_reports').select('id')
      .eq('reported_team', agent.team).eq('week_label', week).eq('status', 'confirmed'),
    supabase.from('team_warnings').select('*')
      .eq('team', agent.team).eq('status', 'active').maybeSingle(),
    supabase.from('weekly_summary').select('*')
      .eq('week_label', week).order('team_xp', { ascending: false }),
    supabase.from('live_rankings').select('*')
      .eq('week_label', week).order('global_rank').limit(10),
    supabase.from('global_arirang_goal').select('*').maybeSingle(),
    supabase.from('monthly_leave_usage').select('*')
      .eq('agent_no', agentNo).eq('month', currentMonth).maybeSingle(),
    supabase.from('weekly_member_stats').select('week_label'),
    supabase.from('goal_daily_scrobbles').select('track_name, target_type, stream_count, date')
      .eq('agent_no', agentNo).eq('week_label', week).in('date', weekDates),
    // ✅ Fetch team members' Album 2x completion for today
    (async () => {
      const { data: teamAgents } = await supabase
        .from('agents')
        .select('agent_no')
        .eq('team', agent.team)
      
      const agentNos = (teamAgents || []).map(a => a.agent_no)
      
      if (agentNos.length === 0) {
        return { data: [] }
      }
      
      return await supabase
        .from('album_2x_daily')
        .select('agent_no, track_name, passed')
        .eq('week_label', week)
        .eq('date', today)
        .in('agent_no', agentNos)
    })()
  ])

  // Extract data (null-safe via || defaults below)
  const stats = statsRes.data
  const rankData = rankRes.data
  const teamSummary = summaryRes.data
  const teamGoals = goalsRes.data
  const announcements = annoRes.data
  const leaveData = leaveRes.data
  const trackContribs = trackContribRes.data
  const albumContribs = albumContribRes.data
  const album2xDaily = album2xRes.data
  const unitRotation = unitRes.data
  const sideMissionData = smDailyRes.data
  const attendSubmission = attendRes.data
  const teamStatus = teamStatusRes.data
  const policeReports = policeRes.data
  const teamWarning = warningRes.data
  const allTeams = allTeamsRes.data
  const topAgentsData = topAgentsRes.data
  const globalGoal = globalGoalRes.data
  const leaveUsage = leaveUsageRes.data
  const teamAlbum2xData = teamAlbum2xRes.data || []

  const availableWeeks = [
    ...new Set((availWeeksRes.data || []).map((w: any) => w.week_label)),
  ].sort()

  const isOnLeave = !!leaveData

  // ── NEW: FETCH LIVE ARMY VOTING STATS ────────────────────
  const votingToday = getPTDateString();
  const { data: armyVotesData } = await supabase
    .from('army_daily_votes')
    .select('team')
    .eq('date', votingToday);

  const teamVoteCounts: Record<string, number> = {};
  TEAMS.forEach(t => teamVoteCounts[t] = 0);
  (armyVotesData || []).forEach((v: any) => {
    if (teamVoteCounts[v.team] !== undefined) teamVoteCounts[v.team]++;
  });

  const armyVotingStats = TEAMS.map(teamName => {
    const teamInfo = allTeams?.find((t: any) => t.team === teamName);
    const total = teamInfo?.member_count || teamInfo?.agent_count || 10;
    return {
      team: teamName,
      voted: teamVoteCounts[teamName] || 0,
      total: total
    };
  });

  // ── INDIVIDUAL GOAL CONTRIBUTIONS ──────────────────────────
  const trackContributions: Record<string, number> = {}
  const albumContributions: Record<string, number> = {}
  trackContribs?.forEach((c: any) => {
    if (c.scrobble_count > 0) trackContributions[c.target_name] = c.scrobble_count
  })
  albumContribs?.forEach((c: any) => {
    if (c.scrobble_count > 0) albumContributions[c.target_name] = c.scrobble_count
  })

  // ── TRACK / ALBUM GOALS ───────────────────────────────────
  const trackGoalsObj: Record<string, any> = {}
  const albumGoalsObj: Record<string, any> = {}
  teamGoals?.forEach((g: any) => {
    const obj = {
      goal: g.goal_amount,
      current: g.current_total,
      percentage: g.percentage,
      moreNeeded: Math.max(0, g.goal_amount - g.current_total),
      status: g.status,
    }
    if (g.target_type === 'track') trackGoalsObj[g.target_name] = obj
    else albumGoalsObj[g.target_name] = obj
  })

  // ── ALBUM 2X DAILY STATUS ─────────────────────────────────
  const album2xDailyGrid: Record<string, Record<string, { count: number; passed: boolean }>> = {}
  let album2xWeeklyPassed = true

  for (const date of weekDates) {
    album2xDailyGrid[date] = {}
    for (const track of ARIRANG_TRACKS) {
      const rec = album2xDaily?.find(
        (r: any) => r.date === date && r.track_name === track,
      )
      const count = rec?.stream_count || 0
      const passed = rec?.passed || false
      album2xDailyGrid[date][track] = { count, passed }

      if (date <= today && !passed && !isOnLeave) {
        album2xWeeklyPassed = false
      }
    }
  }

  if (stats?.album_2x_passed === true) album2xWeeklyPassed = true
  if (isOnLeave) album2xWeeklyPassed = true

  // ── ✅ PROCESS TEAM ALBUM 2X COMPLETION DATA ─────────
  const agentPassStatus: Record<string, boolean> = {}
  const agentTrackCounts: Record<string, number> = {}
  
  teamAlbum2xData.forEach((record: any) => {
    if (!agentTrackCounts[record.agent_no]) {
      agentTrackCounts[record.agent_no] = 0
      agentPassStatus[record.agent_no] = true
    }
    agentTrackCounts[record.agent_no]++
    if (!record.passed) {
      agentPassStatus[record.agent_no] = false
    }
  })

  // Only include agents who have records for all tracks
  const teamAlbum2xMembers = Object.entries(agentPassStatus)
    .filter(([agentNo, _]) => agentTrackCounts[agentNo] === ARIRANG_TRACKS.length)
    .map(([agentNo, passed]) => ({
      name: agentNo,
      passed: passed
    }))

  // ── ARIRANG UNIT STATUS ────────────────────────────────────
  const unitDetails = stats?.arirang_unit_details || {}
  let arirangUnit: any = null

  if (unitRotation) {
    const t1Count = isOnLeave ? 'Exempt' : (unitDetails[unitRotation.track_1] ?? 0)
    const t2Count = isOnLeave ? 'Exempt' : (unitDetails[unitRotation.track_2] ?? 0)
    const t1Passed = isOnLeave || (typeof t1Count === 'number' && t1Count >= CONFIG.ARIRANG_UNIT_REQ)
    const t2Passed = isOnLeave || (typeof t2Count === 'number' && t2Count >= CONFIG.ARIRANG_UNIT_REQ)

    arirangUnit = {
      track1: unitRotation.track_1,
      track2: unitRotation.track_2,
      track1Count: t1Count,
      track2Count: t2Count,
      required: CONFIG.ARIRANG_UNIT_REQ,
      track1Passed: t1Passed,
      track2Passed: t2Passed,
      passed: t1Passed && t2Passed,
    }
  }

  // ── SIDE MISSION STATUS ────────────────────────────────────
  const smLookup: Record<string, Record<string, { count: number; passed: boolean }>> = {}
  sideMissionData?.forEach((row: any) => {
    if (!smLookup[row.track_name]) smLookup[row.track_name] = {}
    smLookup[row.track_name][row.date] = { count: row.stream_count, passed: row.passed }
  })

  let weekFullyPassed = true
  let todayAllPassed = true

  const sideMissionTracks = SIDE_MISSION_TRACKS.map((track) => {
    const daily: Record<string, { count: number; passed: boolean }> = {}
    let trackWeekPassed = true
    let weeklyTotal = 0

    for (const date of weekDates) {
      if (isOnLeave) {
        daily[date] = { count: 0, passed: true }
      } else {
        const entry = smLookup[track.name]?.[date]
        const count = entry?.count ?? 0
        const passed = entry?.passed ?? false
        daily[date] = { count, passed }
        weeklyTotal += count
        if (!passed && date <= today) trackWeekPassed = false
      }
    }

    if (!isOnLeave) {
      const todayEntry = daily[today]
      if (!todayEntry || !todayEntry.passed) todayAllPassed = false
    }
    if (!trackWeekPassed) weekFullyPassed = false

    return {
      name: track.name,
      artist: track.artist,
      weeklyRequired: track.weeklyRequired,
      minDaily: track.minDaily,
      daily,
      weeklyTotal,
      weekPassed: isOnLeave || trackWeekPassed,
    }
  })

  if (isOnLeave) {
    weekFullyPassed = true
    todayAllPassed = true
  }

  // ── POLICE STATUS ──────────────────────────────────────────
  const resultsAreReleased = teamSummary?.results_released === true
  const policeReportCount = resultsAreReleased ? (policeReports?.length || 0) : 0

  // Build todayTrackScrobbles from today's records only
  const todayTrackScrobbles: Record<string, number> = {}
  // Build weeklyGoalScrobbles: date -> {trackName: count} for all week days
  const weeklyGoalScrobbles: Record<string, Record<string, number>> = {}

  if (goalDailyRes.data && goalDailyRes.data.length > 0) {
    (goalDailyRes.data || []).forEach((r: any) => {
      // Today's scrobbles
      if (r.date === today) {
        todayTrackScrobbles[r.track_name] = (todayTrackScrobbles[r.track_name] || 0) + (r.stream_count || 0)
      }
      // Weekly map
      if (!weeklyGoalScrobbles[r.date]) weeklyGoalScrobbles[r.date] = {}
      weeklyGoalScrobbles[r.date][r.track_name] = (weeklyGoalScrobbles[r.date][r.track_name] || 0) + (r.stream_count || 0)
    })
  } else {
    (album2xDaily || []).forEach((r: any) => {
      if (r.date === today) {
        todayTrackScrobbles[r.track_name] = (todayTrackScrobbles[r.track_name] || 0) + (r.stream_count || 0)
      }
    })
    ;(sideMissionData || []).forEach((r: any) => {
      if (r.date === today) {
        todayTrackScrobbles[r.track_name] = (todayTrackScrobbles[r.track_name] || 0) + (r.stream_count || 0)
      }
    })
  }

  // ── TEAM WARNING ───────────────────────────────────────────
  // Dissolution/Warning system is disabled. Teams will no longer receive warnings.
  // let warningStatus: any = null
  let warningStatus: any = null

  // ── TEAM COMPARISON ────────────────────────────────────────
  const teamComparison = (allTeams || []).map((t: any) => ({
    team: t.team,
    level: t.level,
    teamXP: t.team_xp,
    agentCount: t.member_count || t.agent_count || 0,
    trackGoalPassed: t.track_goal_passed,
    albumGoalPassed: t.album_goal_passed,
    album2xPassed: t.album_2x_passed,
    arirangUnitPassed: t.arirang_unit_passed,
    sideMissionPassed: t.side_mission_passed,
    isWinner: t.is_winner,
    pfp: TEAM_PFPS[t.team] || '',
  }))

  // ── TOP AGENTS ─────────────────────────────────────────────
  const topAgents = (topAgentsData || []).map((r: any) => ({
    rank: r.global_rank,
    agentNo: r.agent_no,
    name: r.agent_name,
    team: r.team,
    totalXP: r.total_xp,
  }))

  // ── RESPONSE ───────────────────────────────────────────────
  return {
    success: true,
    week,
    currentWeek: getCurrentWeekLabel(),
    availableWeeks,
    resultsReleased: teamSummary?.results_released || false,
    timestamp: utcNow(),

    agent: {
      agentNo,
      joinDate: joinDateKST,
      profile: {
        name: agent.name, team: agent.team, lastfm: agent.last_fm_username,
        lastfms: agent.last_fm_usernames
      },
      stats: {
        trackScrobbles: stats?.track_scrobbles || 0,
        albumScrobbles: stats?.album_scrobbles || 0,
        trackXP: stats?.track_xp || 0,
        albumXP: stats?.album_xp || 0,
        songXP: stats?.song_xp || 0,
        totalXP: stats?.total_xp || 0,
      },
      rank: rankData?.global_rank || null,
      teamRank: rankData?.team_rank || null,
      trackContributions,
      albumContributions,

      album2xStatus: {
        dailyRequired: CONFIG.ALBUM_2X_DAILY_REQ,
        dailyGrid: album2xDailyGrid,
        weeklyPassed: album2xWeeklyPassed,
        tracksPerDay: ARIRANG_TRACKS.length,
        streamsPerDay: ARIRANG_TRACKS.length * CONFIG.ALBUM_2X_DAILY_REQ,
        albumName: 'Arirang',
      },

      arirangUnit,

      sideMissions: {
        tracks: sideMissionTracks,
        todayAllPassed,
        weekFullyPassed,
        weekDates,
        today,
      },

      attendance: {
        submitted: !!attendSubmission?.submitted,
        submittedAt: attendSubmission?.submitted_at,
        screenshotUrl: attendSubmission?.screenshot_url,
        verified: !!attendSubmission?.verified_at,
        teamStats: {
          submitted: teamStatus?.attendance_submitted || 0,
          total: teamStatus?.attendance_total || 0,
          percentage: teamStatus?.attendance_percentage || 0,
        },
      },

      policeStatus: {
        confirmedReports: policeReportCount,
        maxAllowed: CONFIG.MAX_POLICE_REPORTS,
        passed: policeReportCount <= CONFIG.MAX_POLICE_REPORTS,
        resultsReleased: resultsAreReleased,
      },

      todayTrackScrobbles,
      weeklyGoalScrobbles,

      onLeave: isOnLeave,
      leaveUsage: {
        month: currentMonth,
        used: leaveUsage?.weeks_used || 0,
        max: CONFIG.MAX_LEAVES_PER_MONTH,
        canApply:
          (leaveUsage?.weeks_used || 0) < CONFIG.MAX_LEAVES_PER_MONTH && !isOnLeave,
      },
    },

    team: {
      name: agent.team,
      level: teamSummary?.level || 1,
      teamXP: teamSummary?.team_xp || 0,
      pfp: TEAM_PFPS[agent.team] || '',
      isAlive: true, // Always true now
      isAtRisk: false, // Warnings disabled
      
      // ✅ Add team Album 2x completion data
      album2xStatus: {
        teams: {
          [agent.team]: {
            members: teamAlbum2xMembers
          }
        }
      },

      warningStatus,
      missions: {
        tracksPassed: teamSummary?.track_goal_passed || false,
        albumsPassed: teamSummary?.album_goal_passed || false,
        album2xPassed: teamSummary?.album_2x_passed || false,
        arirangUnitPassed: teamSummary?.arirang_unit_passed || false,
        sideMissionPassed: teamSummary?.side_mission_passed || false,
        attendancePassed: teamSummary?.attendance_confirmed || false,
        policePassed: teamSummary?.police_confirmed || false,
      },
      isWinner: teamSummary?.is_winner || false,
      sideMissionStats: {
        membersPassed: teamStatus?.members_passed || 0,
        membersFailed: teamStatus?.members_failed || 0,
        membersTotal: teamStatus?.members_total || 0,
      },
    },

    trackGoals: trackGoalsObj,
    albumGoals: albumGoalsObj,
    topAgents,
    teamComparison,
    armyVotingStats,

    globalArirangGoal: {
      total: globalGoal?.total_streams || 0,
      target: globalGoal?.target || 5000000,
      percentage: globalGoal?.target
        ? Math.round(((globalGoal?.total_streams || 0) / globalGoal.target) * 100)
        : 0,
    },

    announcements: (announcements || []).map((a: any) => ({
      id: a.id,
      week: a.week,
      title: a.title,
      message: a.message,
      priority: a.priority,
      created: a.created_at,
      link: a.link || '',
      linkText: a.link_text || '',
    })),

    lastUpdated: stats?.updated_at || null,
  }
}

async function getAgentData(supabase: SupabaseDB, agentNo: string, week: string) {
  return getDashboardData(supabase, agentNo, week)
}



// =============================================
// 11. ALL WEEKS STATS (History)
// =============================================

async function getAllWeeksStats(supabase: SupabaseDB, agentNo: string) {
  if (!agentNo) return { success: false, error: 'Agent number required', weeks: [] }

  const { data: agent, error: agentErr } = await supabase
    .from('agents')
    .select('id, team')
    .eq('agent_no', agentNo)
    .limit(1)
    .single()

  if (agentErr || !agent) {
    return { success: false, error: agentErr?.message || 'Agent not found', weeks: [] }
  }

  const [statsRes, winnersRes, statusesRes] = await Promise.all([
    supabase.from('weekly_member_stats').select('*')
      .eq('agent_id', agent.id).order('week_label'),
    supabase.from('weekly_summary').select('week_label, team')
      .eq('is_winner', true),
    supabase.from('team_status')
      .select('team, week_label, is_alive, side_mission_passed')
      .eq('team', agent.team),
  ])

  const winnerMap: Record<string, string> = {}
  winnersRes.data?.forEach((w: any) => { winnerMap[w.week_label] = w.team })

  const statusMap: Record<string, any> = {}
  statusesRes.data?.forEach((ts: any) => { statusMap[ts.week_label] = ts })

  const weeks = (statsRes.data || []).map((s: any) => {
    const ts = statusMap[s.week_label]
    return {
      week: s.week_label,
      team: agent.team,
      stats: {
        trackScrobbles: s.track_scrobbles || 0,
        albumScrobbles: s.album_scrobbles || 0,
        trackXP: s.track_xp || 0,
        albumXP: s.album_xp || 0,
        songXP: s.song_xp || 0,
        totalXP: s.total_xp || 0,
      },
      album2xPassed: s.album_2x_passed || false,
      arirangUnit: {
        passed: s.arirang_unit_passed || false,
        details: s.arirang_unit_details || {},
      },
      teamAlive: ts?.is_alive ?? true,
      sideMissionPassed: ts?.side_mission_passed ?? false,
      winner: winnerMap[s.week_label] || null,
    }
  })

  return { success: true, weeks, agentTeam: agent.team }
}
/** 
 * 1. Operative Database: Returns all agents, their teams, and status.
 */
async function getOperativeDatabase(supabase: SupabaseDB, week: string) {
  const [agentsRes, leavesRes, attendanceRes, unitStatsRes] = await Promise.all([
    // ✅ Added 'id' and 'created_at' to select — needed to match weekly_member_stats.agent_id and evaluate grace periods
    supabase.from('agents').select('id, agent_no, name, team, created_at').eq('status', 'active'),
    supabase.from('leave_requests').select('agent_no').eq('week_label', week),
    supabase.from('attendance_submissions').select('agent_no').eq('week_label', week).eq('submitted', true),
    // ✅ NEW: fetch unit completion per agent for this week
    supabase.from('weekly_member_stats').select('agent_id, arirang_unit_passed').eq('week_label', week)
  ]);

  if (agentsRes.error) return { success: false, error: agentsRes.error.message };

  const leaveSet = new Set((leavesRes.data || []).map(l => l.agent_no));
  const attendanceSet = new Set((attendanceRes.data || []).map(a => a.agent_no));

  // ✅ NEW: map agent_id → arirang_unit_passed
  const unitMap = new Map(
    (unitStatsRes.data || []).map(u => [u.agent_id, u.arirang_unit_passed])
  );

  const weekDates = getWeekDates(week);

  const agents = (agentsRes.data || []).map(a => {
    const isOnLeave = leaveSet.has(a.agent_no);
    const joinDateKST = unixToKSTDate(new Date(a.created_at).getTime() / 1000);
    const isGracePeriod = joinDateKST > (weekDates[0] || '2000-01-01');

    return {
      agentNo: a.agent_no,
      name: a.name,
      team: a.team,
      onLeave: isOnLeave,
      attendanceSubmitted: attendanceSet.has(a.agent_no),
      // ✅ FIX: Automatically mark Arirang Unit as Passed for Ghost Protocol & Grace Period recruits
      arirangUnitPassed: (isOnLeave || isGracePeriod) ? true : (unitMap.get(a.id) ?? null)
    };
  });

  return { success: true, agents };
}

/** 
 * 2. Career Stats: Returns lifetime totals + week-by-week history.
 */
async function getAgentCareerStats(supabase: SupabaseDB, agentNo: string) {
  const { data: agent } = await supabase.from('agents').select('id, team').eq('agent_no', agentNo).limit(1).single();
  if (!agent) return { success: false, error: 'Agent not found' };
  const [statsRes, rankingsRes] = await Promise.all([
    supabase.from('weekly_member_stats').select('*').eq('agent_id', agent.id).order('week_label', { ascending: false }),
    supabase.from('live_rankings').select('week_label, global_rank').eq('agent_no', agentNo)
  ]);
  const rankMap = Object.fromEntries((rankingsRes.data || []).map(r => [r.week_label, r.global_rank]));
  const totals = {
    totalXP: statsRes.data?.reduce((acc, curr) => acc + (curr.total_xp || 0), 0) || 0,
    totalStreams: statsRes.data?.reduce((acc, curr) => acc + (curr.track_scrobbles || 0) + (curr.album_scrobbles || 0), 0) || 0,
    bestRank: rankingsRes.data?.length ? Math.min(...rankingsRes.data.map(r => r.global_rank)) : '—'
  };
  const weeks = (statsRes.data || []).map(s => ({
    week: s.week_label, xp: s.total_xp, streams: (s.track_scrobbles || 0) + (s.album_scrobbles || 0),
    rank: rankMap[s.week_label] || '—', tracksPassed: true, albumsPassed: true,
    album2xPassed: s.album_2x_passed, unitPassed: s.arirang_unit_passed, sidePassed: true
  }));
  return { success: true, totals, weeks };
}

// =============================================
// END OF PART 1
// =============================================
// =============================================
// ARIRANG BATTLE TRACKER — PART 2 (CLEANED)
// Sync Engine, Streaks, Activity Feed, Orchestration
//
// Depends on Part 1 exports:
//   CONFIG, TEAMS, ARIRANG_TRACKS, ALBUM_CHALLENGE_VARIANTS,
//   SIDE_MISSION_TRACKS, TEAM_PFPS, WEEK_START_DATES,
//   WEEK_DATE_RANGES, KST_OFFSET_MS,
//   getKSTDateString, utcNow, unixToKSTDate, getCurrentWeekLabel,
//   getWeekTimeRange, getWeekDates, getWeekMonth, isValidWeek,
//   normalizeKey, scrobblesToXP, cleanLastFmUsername,
//   findTrackScrobbles, findDailyTrackScrobbles,
//   getCacheHeaders, SupabaseDB
//
// Required schema addition (run once):
//   ALTER TABLE weekly_member_stats
//     ADD COLUMN IF NOT EXISTS global_arirang_contributed
//     INTEGER DEFAULT 0;
// =============================================

// =============================================
// 12. HELPERS
// =============================================

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function getYesterdayKSTDate(): string {
  const d = new Date(Date.now() + KST_OFFSET_MS - 86400000)
  return d.toISOString().slice(0, 10)
}

/** Sum today's tracked streams from both daily tables */
async function getTodayStreamCount(
  supabase: SupabaseDB,
  agentNo: string,
): Promise<number> {
  const today = getKSTDateString()
  const [albumRes, sideRes] = await Promise.all([
    supabase
      .from('album_2x_daily')
      .select('stream_count')
      .eq('agent_no', agentNo)
      .eq('date', today),
    supabase
      .from('side_mission_daily')
      .select('stream_count')
      .eq('agent_no', agentNo)
      .eq('date', today),
  ])
  const sum = (rows: any[] | null) =>
    (rows || []).reduce((s: number, r: any) => s + (r.stream_count || 0), 0)
  return sum(albumRes.data) + sum(sideRes.data)
}

// =============================================
// 13. REFRESH WITH COOLDOWN
// =============================================

async function handleRefreshWithCooldown(
  supabase: SupabaseDB,
  agentNo: string,
  week: string,
  params: any = {}
) {
  const isDebugMode = params.debug === true || params.debug === 'true';

  const { data: agent, error } = await supabase
    .from('agents')
    .select('last_synced_at')
    .eq('agent_no', agentNo)
    .limit(1)
    .single()

  if (error || !agent) {
    return { success: false, error: error?.message || 'Agent not found' }
  }

  const now = Date.now()
  const lastSync = agent.last_synced_at
    ? new Date(agent.last_synced_at).getTime()
    : 0
  const diffMinutes = (now - lastSync) / 60000

  // Only enforce cooldown if NOT in debug mode
  if (!isDebugMode && diffMinutes < CONFIG.REFRESH_COOLDOWN_MINUTES) {
    const remaining = Math.ceil(CONFIG.REFRESH_COOLDOWN_MINUTES - diffMinutes)
    return {
      success: true,
      message: `Synced recently. Try again in ${remaining} min${remaining > 1 ? 's' : ''}.`,
      alreadySynced: true,
    }
  }

  // Perform the sync with debug flag
  const syncResult = await refreshAgentStats(supabase, agentNo, week, { isDebug: isDebugMode })

  // Update last_synced_at timestamp on successful sync
  if (syncResult.success) {
    await supabase
      .from('agents')
      .update({ last_synced_at: new Date(now).toISOString() })
      .eq('agent_no', agentNo)
  }

  return syncResult
}

// =============================================
// 14. CORE SYNC: refreshAgentStats
//
// Query budget (per agent):
//   Reads:  ~8  (agent, leave, goals, unit, existing×4)
//   Fetch:  1–80 Last.fm pages (rate-limited)
//   Writes: ~5  (album2x, sideMission, contribs, stats, global)
//   RPC:    1–2 (global increment, aggregation)
//   Total:  ~15–20 DB round-trips (down from ~270)
// =============================================

interface SyncOptions {
  /** Unix-second upper bound for Last.fm fetch (fair-sync snapshot) */
  overrideTo?: number | null
  /** Skip run_all_aggregations (caller will run it after batch) */
  skipAggregation?: boolean
}

async function refreshAgentStats(
  supabase: SupabaseDB,
  agentNo: string,
  week: string,
  options: SyncOptions = {},
) {
  const { overrideTo = null, skipAggregation = false, isDebug = false } = options

  const LASTFM_KEY = Deno.env.get('LASTFM_API_KEY')
  if (!LASTFM_KEY) {
    return { success: false, error: 'Last.fm API key not configured' }
  }

  // ── A. AGENT LOOKUP ────────────────────────────────────────
  const cleanAgentNo = String(agentNo).trim().toUpperCase()

  const { data: agent, error: agentErr } = await supabase
    .from('agents')
    .select('id, last_fm_username, last_fm_usernames, team, agent_no, created_at')
    .eq('agent_no', cleanAgentNo)
    .limit(1)
    .single()

  if (agentErr || !agent) {
    return { success: false, error: agentErr?.message || 'Agent not found' }
  }

  const joinDateKST = unixToKSTDate(new Date(agent.created_at).getTime() / 1000)
  // ✅ GRACE PERIOD: If they joined after Sunday (day 0) of the current week, they are exempt!
  const isGracePeriod = joinDateKST > getWeekDates(week)[0];

  // Deduplicate Last.fm usernames
  const usernamesSet = new Set<string>()
  if (
    agent.last_fm_usernames &&
    Array.isArray(agent.last_fm_usernames) &&
    agent.last_fm_usernames.length > 0
  ) {
    for (const u of agent.last_fm_usernames) {
      const cleaned = cleanLastFmUsername(u)
      if (cleaned) usernamesSet.add(cleaned.toLowerCase())
    }
  } else if (agent.last_fm_username) {
    const cleaned = cleanLastFmUsername(agent.last_fm_username)
    if (cleaned) usernamesSet.add(cleaned.toLowerCase())
  }

  const usernames = Array.from(usernamesSet)
  if (usernames.length === 0) {
    return { success: false, error: 'No Last.fm account linked' }
  }

  // ── B. LEAVE CHECK ─────────────────────────────────────────
  const { data: leaveCheck } = await supabase
    .from('leave_requests')
    .select('id')
    .eq('agent_no', cleanAgentNo)
    .eq('week_label', week)
    .maybeSingle()

  if (leaveCheck) {
    return await handleLeaveExemption(supabase, agent, cleanAgentNo, week)
  }

  // ── C. GOAL DEFINITIONS + UNIT ROTATION ────────────────────
  const [goalsRes, unitRes] = await Promise.all([
    supabase
      .from('goal_definitions')
      .select('*')
      .eq('week_label', week)
      .in('team', [agent.team, 'All']), // <--- THIS FIXES THE SPACE BUG
    supabase
      .from('arirang_unit_rotation')
      .select('*')
      .ilike('team', agent.team.trim()) // Case-insensitive and removes spaces
      .eq('week_label', week)
      .maybeSingle(),
  ])

  // Deduplicate goals to prevent double XP
  const uniqueGoals = new Map()
  for (const g of goalsRes.data || []) {
    const key = `${g.target_type}:${g.target_name}`
    if (!uniqueGoals.has(key) || g.team !== 'All') {
      uniqueGoals.set(key, g)
    }
  }

  let activeGoals = Array.from(uniqueGoals.values())
  const unitRotation = unitRes.data

  // Fallback: shared goals
  if (activeGoals.length === 0) {
    const { data: sharedGoals } = await supabase
      .from('goal_definitions')
      .select('*')
      .eq('week_label', week)

    if (!sharedGoals || sharedGoals.length === 0) {
      await supabase.from('weekly_member_stats').upsert(
        {
          agent_id: agent.id,
          agent_no: cleanAgentNo,
          week_label: week,
          track_scrobbles: 0,
          album_scrobbles: 0,
          track_xp: 0,
          album_xp: 0,
          song_xp: 0,
          total_xp: 0,
          album_2x_passed: false,
          album_2x_details: { error: 'No goals defined' },
          arirang_unit_passed: false,
          arirang_unit_details: {},
          updated_at: utcNow(),
        },
        { onConflict: 'agent_id, week_label' },
      )
      return { success: false, error: `No goals defined for "${week}"` }
    }
    activeGoals = sharedGoals
  }

  // ── D. TIME RANGE ──────────────────────────────────────────
  const { from } = getWeekTimeRange(week)
  const to = overrideTo ?? Math.floor(Date.now() / 1000)

  // Debug log for scrobble fetch window
  console.log(`[SYNC] ${cleanAgentNo}: Fetching from ${new Date(from * 1000).toISOString()} to ${new Date(to * 1000).toISOString()}`)

  // ── E. LAST.FM FETCH ───────────────────────────────────────
  const combinedTracks: Record<string, number> = {}
  const combinedAlbums: Record<string, number> = {}
  const dailyTracks: Record<string, Record<string, number>> = {}
  const dailyAlbums: Record<string, Record<string, number>> = {}
  const fetchErrors: string[] = []
  let totalScrobblesFetched = 0
  let fetchComplete = true
  const MAX_PAGES = 100  // ← REDUCE from 200 to prevent timeout

  // Diagnostic variables
  let mostRecentTrackInfo = "None Found"
  let lastApiError: string | null = null
  let pagesFetched = 0

  for (const username of usernames) {
    try {
      let page = 1
      let totalPages = 1

      while (page <= totalPages && page <= MAX_PAGES) {
        // Rate limit: ~5 requests/second (more conservative)
        if (page > 1) await delay(200)  // ← INCREASE from 20ms to 200ms

        const url =
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks` +
          `&user=${encodeURIComponent(username)}&from=${from}&to=${to}` +
          `&limit=200&page=${page}&api_key=${LASTFM_KEY}&format=json`

        let res: any
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout per request

          const rawRes = await fetch(url, { signal: controller.signal })
          clearTimeout(timeoutId)

          if (!rawRes.ok) {
            const errorMsg = `${username} p${page}: HTTP ${rawRes.status}`
            fetchErrors.push(errorMsg)
            lastApiError = errorMsg
            fetchComplete = false
            break
          }
          res = await rawRes.json()
        } catch (netErr: any) {
          const errorMsg = `${username} p${page}: ${netErr.message}`
          fetchErrors.push(errorMsg)
          lastApiError = errorMsg
          fetchComplete = false
          break
        }

        if (res.error) {
          const errorMsg = `${username} p${page}: ${res.message}`
          fetchErrors.push(errorMsg)
          lastApiError = errorMsg
          fetchComplete = false
          break
        }

        const recentTracks = res.recenttracks
        if (!recentTracks) {
          const errorMsg = `${username}: No recenttracks`
          fetchErrors.push(errorMsg)
          lastApiError = errorMsg
          fetchComplete = false
          break
        }

        totalPages = parseInt(recentTracks['@attr']?.totalPages || '1')
        const tracks = recentTracks.track
        if (!tracks) break

        const tracksArr = Array.isArray(tracks) ? tracks : [tracks]

        // Capture most recent track info (from first page only)
        if (page === 1 && tracksArr.length > 0) {
          const latest = tracksArr[0]
          const isNowPlaying = latest['@attr']?.nowplaying === 'true'
          const trackName = latest.name || 'Unknown Track'
          const artistName = latest.artist?.['#text'] || 'Unknown Artist'
          const timestamp = isNowPlaying ? 'Now Playing' : (latest.date?.['#text'] || 'Unknown Time')

          mostRecentTrackInfo = `${trackName} by ${artistName} (${timestamp})`
        }

        for (const t of tracksArr) {
          if (t['@attr']?.nowplaying === 'true') continue

          const trackName = t.name?.trim()
          const albumName = t.album?.['#text']?.trim()
          const timestamp = parseInt(t.date?.uts || '0')
          if (!trackName || !timestamp) continue

          combinedTracks[trackName] = (combinedTracks[trackName] || 0) + 1
          totalScrobblesFetched++

          if (albumName) {
            combinedAlbums[albumName] = (combinedAlbums[albumName] || 0) + 1
          }

          // Daily breakdown (KST)
          const kstDate = unixToKSTDate(timestamp)
          if (!dailyTracks[kstDate]) dailyTracks[kstDate] = {}
          dailyTracks[kstDate][trackName] = (dailyTracks[kstDate][trackName] || 0) + 1

          if (albumName) {
            if (!dailyAlbums[kstDate]) dailyAlbums[kstDate] = {}
            dailyAlbums[kstDate][albumName] = (dailyAlbums[kstDate][albumName] || 0) + 1
          }
        }

        pagesFetched++
        page++

        // Log progress every 10 pages
        if (pagesFetched % 10 === 0) {
          console.log(`[SYNC] ${cleanAgentNo}: Fetched ${pagesFetched}/${totalPages} pages, ${totalScrobblesFetched} scrobbles`)
        }
      }

      // Warn if hit page limit
      if (page > MAX_PAGES && totalPages > MAX_PAGES) {
        const warnMsg = `${username}: Stopped at ${MAX_PAGES}/${totalPages} pages to prevent timeout`
        fetchErrors.push(warnMsg)
        lastApiError = warnMsg
        console.warn(`[SYNC WARNING] ${cleanAgentNo}: ${warnMsg}`)
      }

    } catch (e: any) {
      const errorMsg = `${username}: ${e.message}`
      fetchErrors.push(errorMsg)
      lastApiError = errorMsg
      fetchComplete = false
    }
  }

  // ── F. ALL-OR-NOTHING ──────────────────────────────────────
  if (!fetchComplete) {
    const { data: existingStats } = await supabase
      .from('weekly_member_stats')
      .select('track_scrobbles, album_scrobbles, total_xp, album_2x_passed')
      .eq('agent_id', agent.id)
      .eq('week_label', week)
      .maybeSingle()

    if (existingStats && (existingStats.track_scrobbles > 0 || existingStats.album_scrobbles > 0)) {
      return {
        success: true,
        preserved: true,
        message: 'Fetch incomplete — preserved existing data',
        stats: existingStats,
        fetchErrors,
        debug: isDebug ? {  // ← FIXED: use isDebug from options
          lastfm_username: usernames.join(', '),
          raw_scrobble_count: totalScrobblesFetched,
          pages_fetched: pagesFetched,
          last_api_error: lastApiError,
          most_recent_track: mostRecentTrackInfo,
          weekRange: {
            from: new Date(from * 1000).toISOString(),
            to: new Date(to * 1000).toISOString(),
          },
          fetchErrors: fetchErrors.length > 0 ? fetchErrors : undefined,
        } : undefined,
      }
    }

    return {
      success: false,
      error: 'Incomplete fetch for new agent — no data saved',
      fetchErrors,
      debug: isDebug ? {  // ← FIXED: use isDebug from options
        lastfm_username: usernames.join(', '),
        raw_scrobble_count: totalScrobblesFetched,
        pages_fetched: pagesFetched,
        last_api_error: lastApiError,
        most_recent_track: mostRecentTrackInfo,
        weekRange: {
          from: new Date(from * 1000).toISOString(),
          to: new Date(to * 1000).toISOString(),
        },
        fetchErrors: fetchErrors.length > 0 ? fetchErrors : undefined,
      } : undefined,
    }
  }

  // ── G. GOAL MATCHING ───────────────────────────────────────
  const individualGoalData: any[] = []
  let goalMatchedTrackScrobbles = 0
  let goalMatchedAlbumScrobbles = 0

  const trackGoals = activeGoals.filter((g: any) => g.target_type === 'track')
  const albumGoals = activeGoals.filter((g: any) => g.target_type === 'album')

  // Build normalised lookup maps
  const normalizedTracksMap = new Map<
    string,
    { original: string; count: number }
  >()
  for (const [name, count] of Object.entries(combinedTracks)) {
    const key = normalizeKey(name)
    const existing = normalizedTracksMap.get(key)
    if (existing) existing.count += count
    else normalizedTracksMap.set(key, { original: name, count })
  }

  const normalizedAlbumsMap = new Map<
    string,
    { original: string; count: number }
  >()
  for (const [name, count] of Object.entries(combinedAlbums)) {
    const key = normalizeKey(name)
    const existing = normalizedAlbumsMap.get(key)
    if (existing) existing.count += count
    else normalizedAlbumsMap.set(key, { original: name, count })
  }

  // 1. Process Track Goals
  for (const goal of trackGoals) {
    if (goal.team && goal.team !== 'All' && goal.team !== agent.team) continue

    // Create a Set of unique normalized keys we are looking for
    const targetKeys = new Set([
      normalizeKey(goal.target_name),
      ...(Array.isArray(goal.variants) ? goal.variants.map(v => normalizeKey(v)) : [])
    ])

    let matchedCount = 0

    // Iterate over the user's scrobbles and sum matches
    // This ensures each unique scrobble entry is only counted ONCE
    for (const [userScrobbleKey, data] of normalizedTracksMap.entries()) {
      if (targetKeys.has(userScrobbleKey)) {
        matchedCount += data.count
      }
    }

    if (matchedCount > 0) {
      goalMatchedTrackScrobbles += matchedCount
      individualGoalData.push({
        agent_id: agent.id,
        week_label: week,
        target_name: goal.target_name,
        target_type: 'track',
        scrobble_count: matchedCount,
        updated_at: utcNow(),
      })
    }
  }

  // 2. Process Album Goals
  for (const goal of albumGoals) {
    if (goal.team && goal.team !== 'All' && goal.team !== agent.team) continue

    // Create a Set of unique normalized keys we are looking for
    const targetKeys = new Set([
      normalizeKey(goal.target_name),
      ...(Array.isArray(goal.variants) ? goal.variants.map(v => normalizeKey(v)) : [])
    ])

    let matchedCount = 0

    // Iterate over the user's scrobbles and sum matches
    for (const [userScrobbleKey, data] of normalizedAlbumsMap.entries()) {
      if (targetKeys.has(userScrobbleKey)) {
        matchedCount += data.count
      }
    }

    if (matchedCount > 0) {
      goalMatchedAlbumScrobbles += matchedCount
      individualGoalData.push({
        agent_id: agent.id,
        week_label: week,
        target_name: goal.target_name,
        target_type: 'album',
        scrobble_count: matchedCount,
        updated_at: utcNow(),
      })
    }
  }
  // ── H. BATCH-READ EXISTING DATA ────────────────────────────
  const [existing2xRes, existingSMRes, existingStatsRes, existingContribsRes] =
    await Promise.all([
      supabase
        .from('album_2x_daily')
        .select('date, track_name, stream_count, passed')
        .eq('agent_no', cleanAgentNo)
        .eq('week_label', week),
      supabase
        .from('side_mission_daily')
        .select('date, track_name, stream_count, passed')
        .eq('agent_no', cleanAgentNo)
        .eq('week_label', week),
      supabase
        .from('weekly_member_stats')
        .select('*')
        .eq('agent_id', agent.id)
        .eq('week_label', week)
        .maybeSingle(),
      supabase
        .from('member_scrobble_details')
        .select('target_name, target_type, scrobble_count')
        .eq('agent_id', agent.id)
        .eq('week_label', week),
    ])

  // Build lookup maps
  const existing2xMap = new Map<
    string,
    { stream_count: number; passed: boolean }
  >()
  for (const r of existing2xRes.data || []) {
    existing2xMap.set(`${r.date}|${r.track_name}`, {
      stream_count: r.stream_count,
      passed: r.passed,
    })
  }

  const existingSMMap = new Map<
    string,
    { stream_count: number; passed: boolean }
  >()
  for (const r of existingSMRes.data || []) {
    existingSMMap.set(`${r.date}|${r.track_name}`, {
      stream_count: r.stream_count,
      passed: r.passed,
    })
  }

  const existingStats = existingStatsRes.data

  const existingContribMap = new Map<string, number>()
  for (const c of existingContribsRes.data || []) {
    existingContribMap.set(
      `${c.target_type}:${c.target_name}`,
      c.scrobble_count,
    )
  }

  // ── I. ALBUM 2X DAILY (in memory) ─────────────────────────
  const weekDates = getWeekDates(week)
  const todayKST = getKSTDateString()

  const album2xUpserts: any[] = []
  let album2xPassed = true
  let totalArirangStreams = 0

  // Backward-compat weekly summary
  const album2xDetails: Record<string, number | string> = {}

  for (const date of weekDates) {
    const dayData = dailyTracks[date] || {}

    for (const track of ARIRANG_TRACKS) {
      const variants = ALBUM_CHALLENGE_VARIANTS[track] || [track]
      const freshCount = findDailyTrackScrobbles(dayData, track, variants)

      const key = `${date}|${track}`
      const existing = existing2xMap.get(key)

      const finalCount = Math.max(freshCount, existing?.stream_count || 0)
      const dayPassed = finalCount >= CONFIG.ALBUM_2X_DAILY_REQ
      const isPreJoin = date < joinDateKST
      const finalPassed = dayPassed || existing?.passed === true || isPreJoin || isGracePeriod

      totalArirangStreams += finalCount

      album2xUpserts.push({
        agent_no: cleanAgentNo,
        date,
        week_label: week,
        track_name: track,
        stream_count: finalCount,
        passed: finalPassed,
        updated_at: utcNow(),
      })

      // Only fail on past/current days
      if (date <= todayKST && !finalPassed) {
        album2xPassed = false
      }
    }
  }

  // Build weekly summary (backward compat — dashboard uses daily grid)
  for (const track of ARIRANG_TRACKS) {
    const variants = ALBUM_CHALLENGE_VARIANTS[track] || [track]
    album2xDetails[track] = findTrackScrobbles(
      combinedTracks,
      track,
      variants,
    )
  }

  // ── J. ARIRANG UNIT CHECK (weekly totals) ──────────────────
  const arirangUnitDetails: Record<string, number> = {}
  let arirangUnitPassed = false

  if (unitRotation) {
    const t1Variants =
      ALBUM_CHALLENGE_VARIANTS[unitRotation.track_1] || [unitRotation.track_1]
    const t2Variants =
      ALBUM_CHALLENGE_VARIANTS[unitRotation.track_2] || [unitRotation.track_2]

    const t1Count = findTrackScrobbles(
      combinedTracks,
      unitRotation.track_1,
      t1Variants,
    )
    const t2Count = findTrackScrobbles(
      combinedTracks,
      unitRotation.track_2,
      t2Variants,
    )

    arirangUnitDetails[unitRotation.track_1] = t1Count
    arirangUnitDetails[unitRotation.track_2] = t2Count

    arirangUnitPassed = isGracePeriod || (
      t1Count >= CONFIG.ARIRANG_UNIT_REQ &&
      t2Count >= CONFIG.ARIRANG_UNIT_REQ
    )
  } else {
    arirangUnitPassed = true // no rotation assigned
  }

  // ── K. SIDE MISSIONS DAILY (in memory) ─────────────────────
  const smUpserts: any[] = []

  for (const date of weekDates) {
    const dayData = dailyTracks[date] || {}

    for (const mission of SIDE_MISSION_TRACKS) {
      const freshCount = findDailyTrackScrobbles(
        dayData,
        mission.name,
        mission.variants,
      )

      const key = `${date}|${mission.name}`
      const existing = existingSMMap.get(key)

      const finalCount = Math.max(freshCount, existing?.stream_count || 0)
      const dayPassed = finalCount >= CONFIG.SIDE_MISSION_MIN_DAILY
      const isPreJoin = date < joinDateKST
      const finalPassed = dayPassed || existing?.passed === true || isPreJoin

      smUpserts.push({
        agent_no: cleanAgentNo,
        date,
        week_label: week,
        track_name: mission.name,
        stream_count: finalCount,
        passed: finalPassed,
        updated_at: utcNow(),
      })
    }
  }

  // ── K2. GOAL DAILY SCROBBLES (per-day per-track for ALL goal tracks) ─────
  // This powers the 148 Protocol daily auto-tick correctly.
  const goalDailyUpserts: any[] = []

  // ── K2. FIXED: UNIVERSAL GOAL DAILY SCROBBLES ──
  for (const goal of activeGoals) {
    // Only process goals defined for this specific agent's team (or 'All')
    if (goal.team && goal.team !== 'All' && goal.team !== agent.team) continue

    const variants: string[] = [
      goal.target_name,
      ...(Array.isArray(goal.variants) ? goal.variants : []),
    ]

    for (const date of weekDates) {
      let freshCount = 0

      // CASE 1: The goal is a specific TRACK
      if (goal.target_type === 'track') {
        const dayData = dailyTracks[date] || {}
        freshCount = findDailyTrackScrobbles(dayData, goal.target_name, variants)
      }

      // CASE 2: The goal is an entire ALBUM
      else if (goal.target_type === 'album') {
        const dayAlbumData = dailyAlbums[date] || {}

        // Strategy A: Direct Album Metadata match (Works for Golden, Indigo, etc.)
        freshCount = findDailyTrackScrobbles(
          dayAlbumData,
          goal.target_name,
          variants,
        )

        // Strategy B: Special sum for "Arirang" (fallback)
        if (normalizeKey(goal.target_name) === normalizeKey('Arirang')) {
          const dayTrackData = dailyTracks[date] || {}
          const allArirangVariants = Object.values(
            ALBUM_CHALLENGE_VARIANTS,
          ).flat().map((v) => normalizeKey(v))

          let trackSum = 0
          for (const [tName, count] of Object.entries(dayTrackData)) {
            if (allArirangVariants.includes(normalizeKey(tName))) {
              trackSum += count
            }
          }

          // Use whichever count is higher (Metadata or Manual Sum)
          freshCount = Math.max(freshCount, trackSum)
        }
      }

      // Only save to DB if there is data OR it's today/yesterday (to show 0/X)
      if (freshCount > 0 || date <= todayKST) {
        goalDailyUpserts.push({
          agent_no: cleanAgentNo,
          week_label: week,
          date,
          track_name: goal.target_name, // e.g. "Golden" or "Arirang"
          target_type: goal.target_type,
          stream_count: freshCount,
          updated_at: utcNow(),
        })
      }
    }
  }

  // ── L. HIGH WATER MARK + LATCH ─────────────────────────────
  if (existingStats) {
    // High water mark on goal contributions
    for (const contrib of individualGoalData) {
      const key = `${contrib.target_type}:${contrib.target_name}`
      const prev = existingContribMap.get(key) || 0
      contrib.scrobble_count = Math.max(contrib.scrobble_count, prev)
    }

    // Recompute matched totals from high-water-marked values
    goalMatchedTrackScrobbles = 0
    goalMatchedAlbumScrobbles = 0
    for (const c of individualGoalData) {
      if (c.target_type === 'track') goalMatchedTrackScrobbles += c.scrobble_count
      else goalMatchedAlbumScrobbles += c.scrobble_count
    }

    // LATCH: album 2x — once passed, stays passed
    if (existingStats.album_2x_passed === true) {
      album2xPassed = true
      const oldDetails = existingStats.album_2x_details || {}
      for (const track of ARIRANG_TRACKS) {
        const oldVal = oldDetails[track]
        const newVal = album2xDetails[track]
        if (oldVal === 'Leave' || oldVal === 'Exempt') {
          album2xDetails[track] = oldVal
        } else {
          const oldCount = parseInt(String(oldVal)) || 0
          const newCount =
            typeof newVal === 'number'
              ? newVal
              : parseInt(String(newVal)) || 0
          album2xDetails[track] = Math.max(oldCount, newCount)
        }
      }
    }

    // LATCH: arirang unit — once passed, stays passed
    if (existingStats.arirang_unit_passed === true) {
      arirangUnitPassed = true
      const oldUnit = existingStats.arirang_unit_details || {}
      for (const track of Object.keys(arirangUnitDetails)) {
        arirangUnitDetails[track] = Math.max(
          arirangUnitDetails[track],
          oldUnit[track] || 0,
        )
      }
    }
  }

  // ── M. BATCH WRITES ────────────────────────────────────────
  const existingSongXP = existingStats?.song_xp || 0
  const trackXP = scrobblesToXP(goalMatchedTrackScrobbles)
  const albumXP = scrobblesToXP(goalMatchedAlbumScrobbles)
  const totalXP = trackXP + albumXP + existingSongXP

  // Global Arirang goal: net delta only (prevents double-counting)
  const prevContributed = existingStats?.global_arirang_contributed || 0
  const arirangNetDelta = Math.max(0, totalArirangStreams - prevContributed)

  const writePromises: Promise<any>[] = [
    supabase.from('album_2x_daily').upsert(album2xUpserts, {
      onConflict: 'agent_no, date, track_name',
    }),
    supabase.from('side_mission_daily').upsert(smUpserts, {
      onConflict: 'agent_no, date, track_name',
    }),
    supabase.from('weekly_member_stats').upsert(
      {
        agent_id: agent.id,
        agent_no: cleanAgentNo,
        week_label: week,
        track_scrobbles: goalMatchedTrackScrobbles,
        album_scrobbles: goalMatchedAlbumScrobbles,
        track_xp: trackXP,
        album_xp: albumXP,
        song_xp: existingSongXP,
        total_xp: totalXP,
        album_2x_passed: album2xPassed,
        album_2x_details: album2xDetails,
        arirang_unit_passed: arirangUnitPassed,
        arirang_unit_details: arirangUnitDetails,
        side_mission_xp: 0,
        global_arirang_contributed: totalArirangStreams,
        updated_at: utcNow(),
      },
      { onConflict: 'agent_id, week_label' },
    ),
  ]

  if (individualGoalData.length > 0) {
    writePromises.push(
      supabase.from('member_scrobble_details').upsert(individualGoalData, {
        onConflict: 'agent_id, week_label, target_name, target_type',
      }),
    )
  }

  // Write goal daily scrobbles (for 148 Protocol daily auto-tick)
  if (goalDailyUpserts.length > 0) {
    writePromises.push(
      supabase.from('goal_daily_scrobbles').upsert(goalDailyUpserts, {
        onConflict: 'agent_no, week_label, date, track_name, target_type',
      }),
    )
  }

  const writeResults = await Promise.all(writePromises)

  // Check if the main stats write (index 2 in writePromises) was successful
  const statsSuccess = !writeResults[2].error

  if (!statsSuccess) {
    for (const wr of writeResults) {
      if (wr.error) console.error('[SYNC WRITE ERROR]', wr.error.message)
    }
    return { success: false, error: 'Failed to save stats—global counter not updated.' }
  }

  // ── N. GLOBAL ARIRANG GOAL (net delta) ─────────────────────
  // ONLY increment if the main update succeeded to prevent double-counting on retry
  if (arirangNetDelta > 0) {
    try {
      await supabase.rpc('increment_global_arirang', {
        inc_amount: arirangNetDelta,
      })
    } catch (e: any) {
      console.error(`[GLOBAL GOAL ERROR] ${cleanAgentNo}: ${e.message}`)
    }
  }

  // ── N2. MISSION COMPLETION BROADCASTS ──────────────────────
  // Broadcast if they JUST finished Album 2X
  if (album2xPassed && !existingStats?.album_2x_passed) {
    try {
      await broadcastActivity(supabase, 'album2x_completed', {
        agent: cleanAgentNo,
        name: agent.name,
        team: agent.team
      }, cleanAgentNo)
    } catch (e: any) {
      console.error(`[BROADCAST ERROR] ${cleanAgentNo}: ${e.message}`)
    }
  }

  // Broadcast if they JUST finished their Unit
  if (arirangUnitPassed && !existingStats?.arirang_unit_passed) {
    try {
      await broadcastActivity(supabase, 'unit_completed', {
        agent: cleanAgentNo,
        name: agent.name,
        team: agent.team
      }, cleanAgentNo)
    } catch (e: any) {
      console.error(`[BROADCAST ERROR] ${cleanAgentNo}: ${e.message}`)
    }
  }

  // ── O. AGGREGATION ─────────────────────────────────────────

  // ── O. AGGREGATION ─────────────────────────────────────────
  if (!skipAggregation) {
    try {
      await supabase.rpc('run_all_aggregations', { target_week: week })
    } catch (e: any) {
      console.error('[AGGREGATION]', e.message)
    }
  }

  // ── P. RETURN ──────────────────────────────────────────────
  return {
    success: true,
    team: agent.team,
    agentNo: cleanAgentNo,
    stats: {
      trackScrobbles: goalMatchedTrackScrobbles,
      albumScrobbles: goalMatchedAlbumScrobbles,
      trackXP,
      albumXP,
      totalXP,
      album2xPassed,
      arirangUnitPassed,
    },
    goalsTracked: individualGoalData.length,
    album2xDetails,
    arirangUnitDetails,
    debug: isDebug ? {  // ← FIXED: use isDebug from options
      week,
      lastfm_username: usernames.join(', '),
      usernames,
      weekRange: {
        from: new Date(from * 1000).toISOString(),
        to: new Date(to * 1000).toISOString(),
      },
      goalsFound: activeGoals.length,
      raw_scrobble_count: totalScrobblesFetched,
      pages_fetched: pagesFetched,
      filtered_scrobble_count: goalMatchedTrackScrobbles + goalMatchedAlbumScrobbles,
      goalMatchedTrackScrobbles,
      goalMatchedAlbumScrobbles,
      daysWithData: Object.keys(dailyTracks).length,
      totalArirangStreams,
      arirangNetDelta,
      last_api_error: lastApiError,
      most_recent_track: mostRecentTrackInfo,
      fetchErrors: fetchErrors.length > 0 ? fetchErrors : undefined,
    } : undefined,
  }
}
// ── LEAVE EXEMPTION (batch writes) ───────────────────────────

async function handleLeaveExemption(
  supabase: SupabaseDB,
  agent: any,
  cleanAgentNo: string,
  week: string,
) {
  const weekDates = getWeekDates(week)

  // Build exempt details
  const album2xDetails: Record<string, string> = {}
  ARIRANG_TRACKS.forEach((t) => {
    album2xDetails[t] = 'Leave'
  })

  const arirangUnitDetails: Record<string, string> = {}
  const { data: unitRot } = await supabase
    .from('arirang_unit_rotation')
    .select('track_1, track_2')
    .eq('team', agent.team)
    .eq('week_label', week)
    .maybeSingle()

  if (unitRot) {
    arirangUnitDetails[unitRot.track_1] = 'Leave'
    arirangUnitDetails[unitRot.track_2] = 'Leave'
  }

  // Build all exempt daily records
  const album2xUpserts: any[] = []
  const smUpserts: any[] = []

  for (const date of weekDates) {
    for (const track of ARIRANG_TRACKS) {
      album2xUpserts.push({
        agent_no: cleanAgentNo,
        date,
        week_label: week,
        track_name: track,
        stream_count: 0,
        passed: true,
        updated_at: utcNow(),
      })
    }
    for (const mission of SIDE_MISSION_TRACKS) {
      smUpserts.push({
        agent_no: cleanAgentNo,
        date,
        week_label: week,
        track_name: mission.name,
        stream_count: 0,
        passed: true,
        updated_at: utcNow(),
      })
    }
  }

  // 3 parallel batch writes (instead of 126 individual upserts)
  await Promise.all([
    supabase
      .from('album_2x_daily')
      .upsert(album2xUpserts, { onConflict: 'agent_no, date, track_name' }),
    supabase
      .from('side_mission_daily')
      .upsert(smUpserts, { onConflict: 'agent_no, date, track_name' }),
    supabase.from('weekly_member_stats').upsert(
      {
        agent_id: agent.id,
        agent_no: cleanAgentNo,
        week_label: week,
        track_scrobbles: 0,
        album_scrobbles: 0,
        track_xp: 0,
        album_xp: 0,
        song_xp: 0,
        total_xp: 0,
        album_2x_passed: true,
        album_2x_details: album2xDetails,
        arirang_unit_passed: true,
        arirang_unit_details: arirangUnitDetails,
        side_mission_xp: 0,
        global_arirang_contributed: 0,
        updated_at: utcNow(),
      },
      { onConflict: 'agent_id, week_label' },
    ),
  ])

  return {
    success: true,
    message: 'On leave — exempt from all missions',
    onLeave: true,
  }
}

// =============================================
// 15. STREAKS
// =============================================

async function getStreakData(supabase: SupabaseDB, agentNo: string) {
  if (!agentNo) return { success: false, error: 'Agent number required' }

  const { data } = await supabase
    .from('streaks')
    .select('*')
    .ilike('agent_no', agentNo)
    .maybeSingle()

  const today = getKSTDateString()

  const defaults = {
    current: 0,
    longest: 0,
    lastActiveDate: null as string | null,
    freezesRemaining: 2,
    freezesUsedThisMonth: 0,
    todayCompleted: false,
    streakStartDate: null as string | null,
  }

  return {
    success: true,
    streak: data
      ? {
        current: data.current_streak || 0,
        longest: data.longest_streak || 0,
        lastActiveDate: data.last_active_date,
        freezesRemaining: data.freezes_remaining ?? 2,
        freezesUsedThisMonth: data.freezes_used_this_month || 0,
        todayCompleted: data.last_active_date === today,
        streakStartDate: data.streak_start_date,
      }
      : defaults,
  }
}

/**
 * Check/update streak using ACTUAL daily stream count
 * (not weekly total — fixes the original bug).
 */
async function checkStreak(
  supabase: SupabaseDB,
  agentNo: string,
  _week: string,
) {
  const THRESHOLD = 10
  const today = getKSTDateString()
  const yesterday = getYesterdayKSTDate()

  const { data: agent, error: agentErr } = await supabase
    .from('agents')
    .select('id, name, team')
    .eq('agent_no', agentNo)
    .limit(1)
    .single()

  if (agentErr || !agent) {
    return { success: false, error: agentErr?.message || 'Agent not found' }
  }

  // Get TODAY's actual stream count from daily tables
  const todayStreams = await getTodayStreamCount(supabase, agentNo)

  const { data: streak } = await supabase
    .from('streaks')
    .select('*')
    .eq('agent_no', agentNo)
    .maybeSingle()

  // Already completed today
  if (streak?.last_active_date === today) {
    return {
      success: true,
      status: 'completed',
      streams: todayStreams,
      target: THRESHOLD,
      streak: streak.current_streak,
    }
  }

  if (todayStreams >= THRESHOLD) {
    // Determine new streak value
    let newStreak: number
    if (!streak) {
      newStreak = 1
    } else if (streak.last_active_date === yesterday) {
      // Consecutive day → continue
      newStreak = (streak.current_streak || 0) + 1
    } else {
      // Gap (missed days, or freeze bridged yesterday) → reset
      newStreak = 1
    }

    await supabase.from('streaks').upsert(
      {
        agent_no: agentNo,
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streak?.longest_streak || 0),
        last_active_date: today,
        freezes_remaining: streak?.freezes_remaining ?? 2,
        freezes_used_this_month: streak?.freezes_used_this_month || 0,
        streak_start_date:
          newStreak === 1 ? today : streak?.streak_start_date || today,
        updated_at: utcNow(),
      },
      { onConflict: 'agent_no' },
    )

    // Milestone broadcast
    const milestones = [3, 7, 14, 21, 30, 50, 100]
    if (milestones.includes(newStreak)) {
      await broadcastActivity(
        supabase,
        'streak_update',
        { agentNo, name: agent.name, team: agent.team, streak: newStreak },
        agentNo,
      )
    }

    return {
      success: true,
      status: 'completed',
      streams: todayStreams,
      target: THRESHOLD,
      streak: newStreak,
    }
  }

  return {
    success: true,
    status: 'pending',
    streams: todayStreams,
    target: THRESHOLD,
    needed: THRESHOLD - todayStreams,
    streak: streak?.current_streak || 0,
  }
}

/**
 * Admin/internal: set streak data directly.
 * ⚠️ Requires auth at the router level.
 */
async function updateStreak(
  supabase: SupabaseDB,
  agentNo: string,
  streakData: any,
) {
  if (!agentNo) return { success: false, error: 'Agent number required' }

  const parsed =
    typeof streakData === 'string' ? JSON.parse(streakData) : streakData

  const { error } = await supabase.from('streaks').upsert(
    {
      agent_no: agentNo,
      current_streak: parsed.current || 0,
      longest_streak: parsed.longest || 0,
      last_active_date: parsed.lastActiveDate,
      freezes_remaining: parsed.freezesRemaining ?? 2,
      freezes_used_this_month: parsed.freezesUsedThisMonth || 0,
      streak_start_date: parsed.streakStartDate,
      updated_at: utcNow(),
    },
    { onConflict: 'agent_no' },
  )

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/** Use a streak freeze — validates streak state first. */
async function useStreakFreeze(supabase: SupabaseDB, agentNo: string) {
  if (!agentNo) return { success: false, error: 'Agent number required' }

  const { data: streak, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('agent_no', agentNo)
    .maybeSingle()

  if (error) return { success: false, error: error.message }
  if (!streak) return { success: false, error: 'No streak data found' }
  if (streak.current_streak <= 0) {
    return { success: false, error: 'No active streak to freeze' }
  }
  if (streak.freezes_remaining <= 0) {
    return { success: false, error: 'No freezes remaining' }
  }

  const today = getKSTDateString()
  const yesterday = getYesterdayKSTDate()

  if (streak.last_active_date === today) {
    return { success: false, error: 'Already active today — no freeze needed' }
  }
  if (streak.last_active_date === yesterday) {
    return {
      success: false,
      error: 'Active yesterday — no freeze needed yet',
    }
  }

  // Bridge the gap: set last_active_date to yesterday
  // so that today's checkStreak sees a consecutive day
  const { error: updateErr } = await supabase
    .from('streaks')
    .update({
      last_active_date: yesterday,
      freezes_remaining: streak.freezes_remaining - 1,
      freezes_used_this_month: (streak.freezes_used_this_month || 0) + 1,
      updated_at: utcNow(),
    })
    .eq('agent_no', agentNo)

  if (updateErr) return { success: false, error: updateErr.message }

  return {
    success: true,
    message: 'Streak freeze applied! Your streak is preserved.',
    freezesRemaining: streak.freezes_remaining - 1,
    currentStreak: streak.current_streak,
  }
}

// =============================================
// 16. ACTIVITY FEED
// =============================================

async function getActivityFeed(
  supabase: SupabaseDB,
  limit: number = 20,
  since: string | null = null,
) {
  let query = supabase
    .from('activity_feed')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (since) query = query.gt('created_at', since)

  const { data } = await query
  const activities = data || []

  // ── Resolve display names for all activities ──
  // Collect all unique agent_nos that appear either in agent_no column
  // or as data.agent (for older events that only stored the raw ID)
  const agentNoSet = new Set<string>()
  for (const a of activities) {
    if (a.agent_no && a.agent_no !== 'SYSTEM') agentNoSet.add(a.agent_no)
    const d = a.data || {}
    // Detect raw agent ID in data.agent (no spaces = not a real name)
    if (d.agent && typeof d.agent === 'string' && !d.agent.includes(' ') && d.agent.length > 4) {
      agentNoSet.add(d.agent)
    }
  }

  let nameMap: Record<string, string> = {}
  if (agentNoSet.size > 0) {
    const { data: agentRows } = await supabase
      .from('agents')
      .select('agent_no, name')
      .in('agent_no', [...agentNoSet])
    for (const r of agentRows || []) {
      if (r.name) nameMap[r.agent_no] = r.name
    }
  }

  return {
    success: true,
    activities: activities.map((a: any) => {
      const d = { ...(a.data || {}) }
      // Inject resolved name into data.name and fix data.agent
      const resolvedName = nameMap[a.agent_no] || nameMap[d.agent]
      if (resolvedName) {
        if (!d.name) d.name = resolvedName
        // If agent field is a raw ID (no spaces), replace with real name
        if (d.agent && !d.agent.includes(' ')) d.agent = resolvedName
      }
      return {
        id: a.id,
        type: a.activity_type,
        data: d,
        timestamp: a.created_at,
        agentNo: a.agent_no,
      }
    }),
  }
}

/**
 * Post to the activity feed.
 * ⚠️ When exposed as an API endpoint, require admin auth in the router.
 */
async function broadcastActivity(
  supabase: SupabaseDB,
  type: string,
  data: any,
  agentNo: string | null,
) {
  const validTypes = [
    'stream_milestone',
    'xp_milestone',
    'streak_update',
    'badge_earned',
    'goal_completed',
    'album2x_completed',
    'team_surge',
    'new_agent',
    'rank_change',
    'secret_mission',
    'sotd_winner',
    'leader_update',
    'results_release',
    'goal_almost',
    'priority_alert',
    'strategy_intel',
    'mission_success',
    'team_dissolved',
    'side_mission_alert',
    'agent_retired',
    'hype_post',
    'emergency_save',
  ]

  if (!validTypes.includes(type)) {
    return { success: false, error: 'Invalid activity type' }
  }

  const parsedData = typeof data === 'string' ? JSON.parse(data) : data

  const { data: inserted, error } = await supabase
    .from('activity_feed')
    .insert({
      activity_type: type,
      data: parsedData,
      agent_no: agentNo || 'SYSTEM',
    })
    .select('id')
    .single()

  // Cleanup: keep last 500 entries
  try {
    const { count } = await supabase
      .from('activity_feed')
      .select('*', { count: 'exact', head: true })

    if (count && count > 500) {
      const { data: oldIds } = await supabase
        .from('activity_feed')
        .select('id')
        .order('created_at', { ascending: true })
        .limit(count - 500)

      if (oldIds?.length) {
        await supabase
          .from('activity_feed')
          .delete()
          .in(
            'id',
            oldIds.map((r: any) => r.id),
          )
      }
    }
  } catch (_e) {
    // Cleanup is non-critical
  }

  return { success: !error, id: inserted?.id }
}

// =============================================
// 18. EMERGENCY SAVES
// =============================================

/**
 * Use a Team Emergency Save to rescue a member who missed a mission day.
 * - Costs 10 Team XP.
 * - Requires at least one agent on the team to have the '100XP' honor badge.
 * - Max 5 saves per team per week.
 * - Acts like a leave (marks passed with 0 streams).
 */
async function useEmergencySave(supabase: SupabaseDB, params: any) {
  const { team, weekLabel, savedAgentNo, missionType, savedDate, triggeredBy, emergencyKey, badgeOwnerAgentNo } = params;

  if (!team || !weekLabel || !savedAgentNo || !missionType || !savedDate || !triggeredBy) {
    return { success: false, error: 'Missing required parameters' };
  }

  // 1. Verify Emergency Key
  const expectedKey = Deno.env.get('EMERGENCY_SAVE_KEY');
  if (!expectedKey) return { success: false, error: 'Emergency Save System not configured (Missing Key)' };
  if (emergencyKey !== expectedKey) {
    return { success: false, error: 'Invalid Emergency Save Key' };
  }

  if (!badgeOwnerAgentNo) {
    return { success: false, error: 'You must select a team member who is selling/donating their 100XP badge.' };
  }

  // 2. Verify selected Badge Owner has the merit (100+ XP)
  const { data: stats } = await supabase
    .from('weekly_member_stats')
    .select('total_xp, song_xp, agent_id')
    .eq('agent_no', badgeOwnerAgentNo)
    .eq('week_label', weekLabel)
    .single();

  if (!stats || stats.total_xp < 100) {
    return { success: false, error: `Selected agent ${badgeOwnerAgentNo} does not possess a Classified Merit (Requires 100 XP).` };
  }

  // Verify donor is on the same team
  const { data: donorAgent } = await supabase
    .from('agents')
    .select('team')
    .eq('agent_no', badgeOwnerAgentNo)
    .limit(1)
    .single();

  if (!donorAgent || donorAgent.team !== team) {
    return { success: false, error: 'Selected badge donor must be on your team.' };
  }

  // 3. Check Team XP
  const { data: summary } = await supabase
    .from('weekly_summary')
    .select('team_xp')
    .eq('team', team)
    .eq('week_label', weekLabel)
    .single();

  if (!summary || summary.team_xp < 10) {
    return { success: false, error: 'Insufficient Team XP (10 XP required for emergency save).' };
  }

  // 4. Check Weekly Usage Limit
  const { count: usageCount } = await supabase
    .from('team_emergency_saves')
    .select('*', { count: 'exact', head: true })
    .eq('team', team)
    .eq('week_label', weekLabel);

  if (usageCount !== null && usageCount >= 5) {
    return { success: false, error: 'Weekly limit of 5 Emergency Saves reached for this team.' };
  }

  // 5. Deduct Team XP
  const { error: xpError } = await supabase.rpc('increment_team_xp', {
    t_name: team,
    w_label: weekLabel,
    xp_inc: -10,
  });
  if (xpError) return { success: false, error: `XP Deduction failed: ${xpError.message}` };

  // 5.5 Consume the Merit (Deduct 100 XP permanently from song_xp buffer)
  const now = new Date().toISOString();
  const { error: consumeError } = await supabase
    .from('weekly_member_stats')
    .update({ 
      song_xp: (stats.song_xp || 0) - 100,
      total_xp: stats.total_xp - 100,
      updated_at: now
    })
    .eq('agent_no', badgeOwnerAgentNo)
    .eq('week_label', weekLabel);

  if (consumeError) return { success: false, error: `Failed to consume merit: ${consumeError.message}` };

  // 6. Record Save
  const { data: saveRecord, error: saveError } = await supabase
    .from('team_emergency_saves')
    .insert({
      team,
      week_label: weekLabel,
      saved_agent_no: savedAgentNo,
      mission_type: missionType,
      saved_date: savedDate,
      triggered_by: triggeredBy,
      xp_deducted: 10
    })
    .select()
    .single();

  if (saveError) {
    // If record fails, we should ideally rollback XP but for simplicity we log error
    console.error(`[SAVE ERROR] Failed to record save after deduction: ${saveError.message}`);
  }

  // 7. Apply "Leave" Effect (Mark as passed with 0 streams)
  if (missionType === 'album_2x') {
    const upserts = ARIRANG_TRACKS.map(track => ({
      agent_no: savedAgentNo,
      date: savedDate,
      week_label: weekLabel,
      track_name: track,
      stream_count: 0,
      passed: true,
      updated_at: now
    }));
    await supabase.from('album_2x_daily').upsert(upserts, { onConflict: 'agent_no, date, track_name' });
  } else if (missionType === 'side_mission') {
    const upserts = SIDE_MISSION_TRACKS.map(track => ({
      agent_no: savedAgentNo,
      date: savedDate,
      week_label: weekLabel,
      track_name: track.name,
      stream_count: 0,
      passed: true,
      updated_at: now
    }));
    await supabase.from('side_mission_daily').upsert(upserts, { onConflict: 'agent_no, date, track_name' });
  }

  // 8. Broadcast
  await broadcastActivity(supabase, 'emergency_save', {
    team,
    savedAgent: savedAgentNo,
    missionType: missionType === 'album_2x' ? 'Arirang 2X' : 'Side Mission',
    date: savedDate,
    triggeredBy,
    badgeDonor: badgeOwnerAgentNo
  }, triggeredBy);

  return { success: true, message: `Emergency Save applied! Classified Merit consumed (100 XP removed) from ${badgeOwnerAgentNo}.` };
}

/**
 * Get list of agents on a team who possess a specific honor badge.
 */
async function getTeamBadgeHolders(supabase: SupabaseDB, team: string, week: string) {
  // Merits are virtual: 100 XP = 1 Merit
  const { data: agents } = await supabase
    .from('agents')
    .select('agent_no, name')
    .eq('team', team);

  if (!agents || agents.length === 0) return { success: true, holders: [] };

  const agentNos = agents.map(a => a.agent_no);

  const { data: stats } = await supabase
    .from('weekly_member_stats')
    .select('agent_no, total_xp')
    .eq('week_label', week)
    .in('agent_no', agentNos)
    .gte('total_xp', 100);

  const statsMap = new Map((stats || []).map((s: any) => [s.agent_no, s.total_xp]));

  const holders = agents
    .filter((a: any) => statsMap.has(a.agent_no))
    .map((a: any) => ({
      agentNo: a.agent_no,
      name: a.name,
      meritCount: Math.floor((statsMap.get(a.agent_no) || 0) / 100)
    }));

  return { success: true, holders };
}

async function getRescueSuggestions(supabase: SupabaseDB, team: string, date: string, week: string) {
  const { data: agents } = await supabase.from('agents').select('agent_no, name').eq('team', team);
  if (!agents) return { success: true, failedMembers: [] };

  const agentNos = agents.map((a: any) => a.agent_no);

  const [a2xRes, smRes] = await Promise.all([
    supabase.from('album_2x_daily').select('agent_no, passed').eq('date', date).eq('week_label', week).in('agent_no', agentNos),
    supabase.from('side_mission_daily').select('agent_no, passed').eq('date', date).eq('week_label', week).in('agent_no', agentNos)
  ]);

  const failures = agents.map((a: any) => {
    const a2xPassedCount = (a2xRes.data || []).filter((r: any) => r.agent_no === a.agent_no && r.passed).length;
    const smPassedCount = (smRes.data || []).filter((r: any) => r.agent_no === a.agent_no && r.passed).length;

    const missed2X = a2xPassedCount < 14;
    const missedSM = smPassedCount < 4;

    if (missed2X || missedSM) {
      return {
        agentNo: a.agent_no,
        name: a.name,
        missed: [missed2X ? '2X' : '', missedSM ? 'Side' : ''].filter(Boolean).join(' & ')
      };
    }
    return null;
  }).filter(Boolean);

  return { success: true, failedMembers: failures };
}

// =============================================
// 17. SYNC ORCHESTRATION
// =============================================

async function initiateFairSync(
  supabase: SupabaseDB,
  week: string,
  adminKey: string,
) {
  const expectedKey = Deno.env.get('SYNC_ADMIN_KEY')
  if (!expectedKey || adminKey !== expectedKey) {
    return { success: false, error: 'Unauthorized' }
  }

  // Snapshot: before-XP for surge detection
  const { data: beforeTeams } = await supabase
    .from('weekly_summary')
    .select('team, team_xp')
    .eq('week_label', week)

  const statsBefore = Object.fromEntries(
    (beforeTeams || []).map((t: any) => [t.team, t.team_xp]),
  )

  const startTime = Date.now()
  const snapshotTimestamp = Math.floor(startTime / 1000)
  const sessionId = `fair_${snapshotTimestamp}_${Math.random().toString(36).slice(2, 8)}`

  // Exclude agents on leave
  const { data: leaveAgents } = await supabase
    .from('leave_requests')
    .select('agent_no')
    .eq('week_label', week)

  const leaveNos = (leaveAgents || []).map((l: any) => l.agent_no)

  let query = supabase
    .from('agents')
    .select('agent_no')
    .eq('status', 'active')
    .or('last_fm_username.not.is.null,last_fm_usernames.not.eq.{}')

  if (leaveNos.length > 0) {
    query = query.not('agent_no', 'in', `(${leaveNos.join(',')})`)
  }

  const { data: agentsToSync, error: fetchErr } = await query
    .order('last_synced_at', { ascending: true, nullsFirst: true })
    .limit(45)

  if (fetchErr) return { success: false, error: fetchErr.message }

  // Create session record
  await supabase.from('sync_sessions').insert({
    session_id: sessionId,
    week_label: week,
    snapshot_timestamp: snapshotTimestamp,
    total_agents: agentsToSync.length,
    agents_completed: 0,
    agents_failed: 0,
    status: 'running',
    batch_status: {},
    started_at: utcNow(),
  })

  const PARALLEL_SIZE = 3
  const MAX_TIME_MS = 50000
  let completed = 0
  let failed = 0
  const errors: string[] = []

  for (let i = 0; i < agentsToSync.length; i += PARALLEL_SIZE) {
    if (Date.now() - startTime > MAX_TIME_MS) break

    const batch = agentsToSync.slice(i, i + PARALLEL_SIZE)
    const results = await Promise.allSettled(
      batch.map(async (a: any) => {
        const syncResult = await refreshAgentStats(
          supabase,
          a.agent_no,
          week,
          { overrideTo: snapshotTimestamp, skipAggregation: true },
        )
        if (syncResult.success) {
          try {
            await checkStreak(supabase, a.agent_no, week)
          } catch (e: any) {
            console.error(`[STREAK] ${a.agent_no}: ${e.message}`)
          }
        }
        return syncResult
      }),
    )

    results.forEach((result, idx) => {
      if (result.status === 'fulfilled' && result.value.success) {
        completed++
      } else {
        failed++
        const msg =
          result.status === 'rejected'
            ? result.reason?.message
            : (result as any).value?.error
        errors.push(`${batch[idx].agent_no}: ${msg || 'Unknown'}`)
      }
    })
  }

  const totalProcessed = completed + failed
  const finalStatus =
    totalProcessed >= agentsToSync.length ? 'completed' : 'partial'
  const duration = Date.now() - startTime

  // Update session
  await supabase
    .from('sync_sessions')
    .update({
      agents_completed: completed,
      agents_failed: failed,
      status: finalStatus,
      completed_at: utcNow(),
      batch_status: {
        completed,
        failed,
        processed: totalProcessed,
        total: agentsToSync.length,
        errors: errors.slice(0, 10),
      },
    })
    .eq('session_id', sessionId)

  // Run aggregation once for all agents
  if (completed > 0) {
    try {
      await supabase.rpc('run_all_aggregations', { target_week: week })
    } catch (e: any) {
      console.error('[FAIR SYNC] Aggregation failed:', e.message)
    }
  }

  // ✅ AUTO-BADGE TRIGGER
  // Automatically evaluate Side Mission badges every time the system syncs
  try {
    console.log(`[AUTO-BADGES] Evaluating Side Missions for ${week}...`)
    await checkAllTeamsSurvival(supabase, week, adminKey)
    
    // Safety Net: Also evaluate the previous week, just in case a user's Last.fm 
    // scrobbles from Saturday night were delayed and synced on Sunday morning!
    const prevWeek = getPreviousWeekLabel(week)
    if (prevWeek) {
      await checkAllTeamsSurvival(supabase, prevWeek, adminKey)
    }
  } catch (e: any) {
    console.error('[AUTO-BADGES] Failed:', e.message)
  }

  // Team surge detection
  const { data: afterTeams } = await supabase
    .from('weekly_summary')
    .select('team, team_xp')
    .eq('week_label', week)

  for (const team of afterTeams || []) {
    const oldXP = statsBefore[team.team]
    if (oldXP === undefined || oldXP === null) continue
    const xpGained = (team.team_xp || 0) - oldXP
    if (xpGained <= 0) continue
    const streamsGained = xpGained * CONFIG.SCROBBLES_PER_XP
    if (streamsGained >= 200) {
      await broadcastActivity(
        supabase,
        'team_surge',
        {
          team: team.team,
          streams: streamsGained,
          fromXP: oldXP,
          toXP: team.team_xp,
        },
        'SYSTEM',
      )
    }
  }

  // Sync log
  await supabase.from('sync_logs').insert({
    sync_id: sessionId,
    sync_type: 'fair_parallel',
    week_label: week,
    agents_synced: completed,
    agents_failed: failed,
    agents_skipped: leaveNos.length,
    duration_ms: duration,
    errors: errors.length > 0 ? errors.slice(0, 20) : null,
    created_at: utcNow(),
  })

  return {
    success: true,
    sessionId,
    snapshotTime: new Date(snapshotTimestamp * 1000).toISOString(),
    status: finalStatus,
    progress: {
      completed,
      failed,
      total: agentsToSync.length,
      percentage: Math.round((totalProcessed / agentsToSync.length) * 100),
    },
    skippedOnLeave: leaveNos.length,
    duration: `${duration}ms`,
  }
}

async function syncAgentShard(
  supabase: SupabaseDB,
  week: string,
  shard: number,
  totalShards: number,
  runAggregation: boolean = false,
) {
  const startTime = Date.now()
  const snapshotTimestamp = Math.floor(startTime / 1000)

  const { data: leaveAgents } = await supabase
    .from('leave_requests')
    .select('agent_no')
    .eq('week_label', week)

  const leaveNos = (leaveAgents || []).map((l: any) => l.agent_no)

  let query = supabase
    .from('agents')
    .select('agent_no, id')
    .eq('status', 'active')
    .or('last_fm_username.not.is.null,last_fm_usernames.not.eq.{}')
    .order('agent_no')

  if (leaveNos.length > 0) {
    query = query.not('agent_no', 'in', `(${leaveNos.join(',')})`)
  }

  const { data: allAgents, error: fetchErr } = await query
  if (fetchErr) return { success: false, error: fetchErr.message }

  const myAgents = (allAgents || []).filter(
    (_: any, index: number) => index % totalShards === shard,
  )

  let completed = 0
  let failed = 0
  const errors: string[] = []

  for (let i = 0; i < myAgents.length; i += 3) {
    if (Date.now() - startTime > 110000) break

    const batch = myAgents.slice(i, i + 3)
    const results = await Promise.allSettled(
      batch.map(async (a: any) => {
        const r = await refreshAgentStats(supabase, a.agent_no, week, {
          overrideTo: snapshotTimestamp,
          skipAggregation: true,
        })
        if (r.success) {
          try {
            await checkStreak(supabase, a.agent_no, week)
          } catch (_e) {
            /* non-critical */
          }
        }
        return r
      }),
    )

    results.forEach((result, idx) => {
      if (result.status === 'fulfilled' && result.value.success) {
        completed++
      } else {
        failed++
        const msg =
          result.status === 'rejected'
            ? result.reason?.message
            : (result as any).value?.error
        errors.push(`${batch[idx].agent_no}: ${msg}`)
      }
    })
  }

  // Optionally run aggregation (caller can set this for the last shard)
  if (runAggregation && completed > 0) {
    try {
      await supabase.rpc('run_all_aggregations', { target_week: week })
    } catch (e: any) {
      console.error('[SHARD SYNC] Aggregation failed:', e.message)
    }
  }

  return {
    success: true,
    shard,
    totalShards,
    agentsInShard: myAgents.length,
    completed,
    failed,
    duration: `${Date.now() - startTime}ms`,
    errors: errors.slice(0, 5),
  }
}

async function runQuickFairSync(
  supabase: SupabaseDB,
  week: string,
  adminKey: string,
) {
  const expectedKey = Deno.env.get('SYNC_ADMIN_KEY')
  if (!expectedKey || adminKey !== expectedKey) {
    return { success: false, error: 'Unauthorized' }
  }

  const startTime = Date.now()
  const snapshotTimestamp = Math.floor(startTime / 1000)
  const syncId = `quick_${snapshotTimestamp}`

  const { data: agents } = await supabase
    .from('agents')
    .select('agent_no')
    .eq('status', 'active')
    .or('last_fm_username.not.is.null,last_fm_usernames.not.eq.{}')

  const { data: leaveAgents } = await supabase
    .from('leave_requests')
    .select('agent_no')
    .eq('week_label', week)

  const leaveSet = new Set(
    (leaveAgents || []).map((l: any) => l.agent_no),
  )
  const agentsToSync = (agents || []).filter(
    (a: any) => !leaveSet.has(a.agent_no),
  )

  if (agentsToSync.length > 100) {
    return {
      success: false,
      error: 'Too many agents. Use initiateFairSync.',
      agentCount: agentsToSync.length,
    }
  }

  let synced = 0
  let failed = 0

  for (const a of agentsToSync) {
    if (Date.now() - startTime > 55000) break
    try {
      const result = await refreshAgentStats(supabase, a.agent_no, week, {
        overrideTo: snapshotTimestamp,
        skipAggregation: true,
      })
      if (result.success) synced++
      else failed++
    } catch (_e) {
      failed++
    }
  }

  // Single aggregation pass at the end
  try {
    await supabase.rpc('run_all_aggregations', { target_week: week })
  } catch (e: any) {
    console.error('[QUICK SYNC] Aggregation:', e.message)
  }

  await supabase.from('sync_logs').insert({
    sync_id: syncId,
    sync_type: 'quick_fair',
    week_label: week,
    agents_synced: synced,
    agents_failed: failed,
    duration_ms: Date.now() - startTime,
    created_at: utcNow(),
  })

  return {
    success: true,
    syncId,
    snapshotTime: new Date(snapshotTimestamp * 1000).toISOString(),
    synced,
    failed,
    skipped: leaveSet.size,
    duration: `${Date.now() - startTime}ms`,
  }
}

async function getFairSyncStatus(
  supabase: SupabaseDB,
  sessionId: string | null,
) {
  if (!sessionId) {
    const { data: recent } = await supabase
      .from('sync_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!recent) return { success: false, error: 'No sync sessions found' }
    sessionId = recent.session_id
  }

  const { data: session, error } = await supabase
    .from('sync_sessions')
    .select('*')
    .eq('session_id', sessionId)
    .single()

  if (error || !session) {
    return { success: false, error: error?.message || 'Session not found' }
  }

  const startMs = new Date(session.started_at).getTime()
  const endMs = session.completed_at
    ? new Date(session.completed_at).getTime()
    : Date.now()

  return {
    success: true,
    sessionId: session.session_id,
    status: session.status,
    week: session.week_label,
    snapshotTime: new Date(session.snapshot_timestamp * 1000).toISOString(),
    progress: {
      percentage:
        session.total_agents > 0
          ? Math.round(
            (session.agents_completed / session.total_agents) * 100,
          )
          : 0,
      agentsCompleted: session.agents_completed,
      agentsFailed: session.agents_failed,
      totalAgents: session.total_agents,
    },
    timing: {
      startedAt: session.started_at,
      completedAt: session.completed_at,
      duration: `${Math.round((endMs - startMs) / 1000)}s`,
    },
    batchDetails: session.batch_status,
  }
}

async function getSyncStatus(supabase: SupabaseDB) {
  const [logsRes, sessionsRes] = await Promise.all([
    supabase
      .from('sync_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('sync_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const logs = logsRes.data || []
  const sessions = sessionsRes.data || []
  const lastSync = logs[0] || null
  const lastFairSync = sessions[0] || null

  // Next scheduled sync (top of next hour)
  const now = new Date()
  const nextSync = new Date(now)
  nextSync.setMinutes(0, 0, 0)
  nextSync.setHours(nextSync.getHours() + 1)

  return {
    success: true,
    currentTime: utcNow(),
    lastSync: lastSync
      ? {
        syncId: lastSync.sync_id,
        type: lastSync.sync_type,
        week: lastSync.week_label,
        synced: lastSync.agents_synced,
        failed: lastSync.agents_failed,
        duration: lastSync.duration_ms,
        timestamp: lastSync.created_at,
      }
      : null,
    lastFairSync: lastFairSync
      ? {
        sessionId: lastFairSync.session_id,
        status: lastFairSync.status,
        week: lastFairSync.week_label,
        completed: lastFairSync.agents_completed,
        failed: lastFairSync.agents_failed,
        total: lastFairSync.total_agents,
        snapshotTime: new Date(
          lastFairSync.snapshot_timestamp * 1000,
        ).toISOString(),
        startedAt: lastFairSync.started_at,
        completedAt: lastFairSync.completed_at,
      }
      : null,
    nextScheduledSync: nextSync.toISOString(),
    recentLogs: logs.map((l: any) => ({
      syncId: l.sync_id,
      type: l.sync_type,
      synced: l.agents_synced,
      failed: l.agents_failed,
      duration: l.duration_ms,
      timestamp: l.created_at,
    })),
    syncEnabled: CONFIG.HOURLY_SYNC_ENABLED,
  }
}

// =============================================
// 18. SIDE MISSION STATUS (Standalone query)
// =============================================

async function getSideMissionStatus(
  supabase: SupabaseDB,
  agentNo: string,
  week: string,
) {
  if (!agentNo) return { success: false, error: 'Agent number required' }

  const { data: agent, error: agentErr } = await supabase
    .from('agents')
    .select('team')
    .eq('agent_no', agentNo)
    .limit(1)
    .single()

  if (agentErr || !agent) {
    return { success: false, error: agentErr?.message || 'Agent not found' }
  }

  // Parallel reads
  const [leaveRes, smRes, statusRes] = await Promise.all([
    supabase
      .from('leave_requests')
      .select('id')
      .eq('agent_no', agentNo)
      .eq('week_label', week)
      .maybeSingle(),
    supabase
      .from('side_mission_daily')
      .select('*')
      .eq('agent_no', agentNo)
      .eq('week_label', week),
    supabase
      .from('team_status')
      .select('*')
      .eq('team', agent.team)
      .eq('week_label', week)
      .maybeSingle(),
  ])

  const isOnLeave = !!leaveRes.data
  const weekDates = getWeekDates(week)
  let today = getKSTDateString()

  // ✅ FIX: Cap 'today' for Side Missions
  if (weekDates.length > 0 && today > weekDates[6]) {
    today = weekDates[6];
  }

  // Build lookup
  const smLookup: Record<
    string,
    Record<string, { count: number; passed: boolean }>
  > = {}
  for (const row of smRes.data || []) {
    if (!smLookup[row.track_name]) smLookup[row.track_name] = {}
    smLookup[row.track_name][row.date] = {
      count: row.stream_count,
      passed: row.passed,
    }
  }

  let weekFullyPassed = true
  let todayAllPassed = true

  const tracks = SIDE_MISSION_TRACKS.map((track) => {
    const daily: Record<string, { count: number; passed: boolean }> = {}
    let trackWeekPassed = true
    let weeklyTotal = 0

    for (const date of weekDates) {
      if (isOnLeave) {
        daily[date] = { count: 0, passed: true }
      } else {
        const entry = smLookup[track.name]?.[date]
        const count = entry?.count ?? 0
        const passed = entry?.passed ?? false
        daily[date] = { count, passed }
        weeklyTotal += count
        if (!passed && date <= today) trackWeekPassed = false
      }
    }

    if (!isOnLeave) {
      const todayEntry = daily[today]
      if (!todayEntry || !todayEntry.passed) todayAllPassed = false
    }
    if (!trackWeekPassed) weekFullyPassed = false

    return {
      name: track.name,
      artist: track.artist,
      weeklyRequired: track.weeklyRequired,
      minDaily: track.minDaily,
      daily,
      weeklyTotal,
      weekPassed: isOnLeave || trackWeekPassed,
      weeklyTotalPassed: isOnLeave || weeklyTotal >= track.weeklyRequired,
    }
  })

  if (isOnLeave) {
    weekFullyPassed = true
    todayAllPassed = true
  }

  const teamStatus = statusRes.data

  return {
    success: true,
    agentNo,
    team: agent.team,
    week,
    onLeave: isOnLeave,
    today,
    weekDates,
    tracks,
    todayAllPassed,
    weekFullyPassed,
    teamStatus: {
      isAlive: teamStatus?.is_alive ?? true,
      sideMissionPassed: teamStatus?.side_mission_passed ?? false,
      membersPassed: teamStatus?.members_passed || 0,
      membersFailed: teamStatus?.members_failed || 0,
      membersTotal: teamStatus?.members_total || 0,
    },
  }
}

// =============================================
// END OF PART 2
// =============================================
// =============================================
// ARIRANG BATTLE TRACKER — PART 3 (CLEANED)
// Features, Admin, Registration & Router
//
// Depends on Parts 1 & 2 exports.
//
// Schema additions (run once):
//   ALTER TABLE agents ADD COLUMN IF NOT EXISTS
//     password_hash TEXT;
// =============================================

// =============================================
// 19. SECURITY HELPERS
// =============================================

async function hashPassword(password: string): Promise<string> {
  const salt = Deno.env.get('PASSWORD_SALT') || 'arirang-battle-2026'
  const data = new TextEncoder().encode(password + salt)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('')
}

function generateSecureToken(): string {
  const buf = new Uint8Array(32)
  crypto.getRandomValues(buf)
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('')
}

function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;') // Syntax error fixed here
    .replace(/`/g, '&#x60;');
}

// =============================================
// 20. ADMIN AUTH
// =============================================

async function verifyAdmin(supabase: SupabaseDB, params: any) {
  const adminPassword = Deno.env.get('ADMIN_PASSWORD')
  const adminAgentNo = Deno.env.get('ADMIN_AGENT_NO')
  if (!adminPassword || !adminAgentNo) {
    return { success: false, error: 'Admin not configured' }
  }

  if (params.agentNo !== adminAgentNo) {
    return { success: false, error: 'Access denied' }
  }
  if (params.password !== adminPassword) {
    return { success: false, error: 'Invalid password' }
  }

  const token = `admin_${generateSecureToken()}`
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000)

  await supabase.from('admin_sessions').insert({
    agent_no: params.agentNo,
    session_token: token,
    expires_at: expiresAt.toISOString(),
  })

  return { success: true, sessionToken: token, expiresIn: 7200 }
}

async function validateAdminSession(
  supabase: SupabaseDB,
  sessionToken: string,
): Promise<boolean> {
  if (!sessionToken) return false
  const adminAgentNo = Deno.env.get('ADMIN_AGENT_NO')
  if (!adminAgentNo) return false

  const { data } = await supabase
    .from('admin_sessions')
    .select('id')
    .eq('agent_no', adminAgentNo)
    .eq('session_token', sessionToken)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  return !!data
}

function requireSyncAdminKey(providedKey: string): boolean {
  const expected = Deno.env.get('SYNC_ADMIN_KEY')
  return !!expected && providedKey === expected
}

async function checkTeamSurvival(
  supabase: SupabaseDB,
  team: string,
  week: string,
) {
  // Parallel: members + leaves + existing status
  const [membersRes, leavesRes, statusRes] = await Promise.all([
    supabase.from('agents').select('agent_no, created_at').eq('team', team).eq('status', 'active'),
    supabase.from('leave_requests').select('agent_no').eq('week_label', week),
    supabase.from('team_status').select('side_mission_passed').eq('team', team).eq('week_label', week).maybeSingle()
  ])

  const leaveSet = new Set((leavesRes.data || []).map((l: any) => l.agent_no))
  const activeMembers = (membersRes.data || []).filter((m: any) => !leaveSet.has(m.agent_no))
  const memberNos = activeMembers.map((m: any) => m.agent_no)
  
  // XP Safeguard: Check if they already earned the badge this week
  const alreadyPassed = statusRes.data?.side_mission_passed === true;

  const joinDates = new Map<string, string>()
  for (const m of activeMembers) {
    joinDates.set(m.agent_no, unixToKSTDate(new Date(m.created_at).getTime() / 1000))
  }

  if (memberNos.length === 0) {
    return { success: true, team, week, alive: true, passed: 0, failed: 0, total: 0 }
  }

  const { data: allDailyRecords } = await supabase
    .from('side_mission_daily')
    .select('agent_no, track_name, date, stream_count, passed')
    .in('agent_no', memberNos)
    .eq('week_label', week)

  const recordsByAgent = new Map<string, any[]>()
  for (const r of allDailyRecords || []) {
    if (!recordsByAgent.has(r.agent_no)) recordsByAgent.set(r.agent_no, [])
    recordsByAgent.get(r.agent_no)!.push(r)
  }

  const weekDates = getWeekDates(week)
  
  // ✅ FIX: Defining the missing variables for Date boundary capping
  let today = getKSTDateString()
  if (weekDates.length > 0 && today > weekDates[6]) {
    today = weekDates[6] // Cap 'today' to the last day of the week
  }
  const isWeekOver = today >= weekDates[6]

  let allPassed = true
  let passedCount = 0
  let failedCount = 0
  const failureDetails: Record<string, any> = {}

  for (const memberNo of memberNos) {
    const records = recordsByAgent.get(memberNo) || []
    let memberPassed = true
    const dailyMap: Record<string, Record<string, boolean>> = {}
    const weeklyTotals: Record<string, number> = {}

    for (const r of records) {
      if (!dailyMap[r.track_name]) dailyMap[r.track_name] = {}
      dailyMap[r.track_name][r.date] = r.passed
      weeklyTotals[r.track_name] = (weeklyTotals[r.track_name] || 0) + r.stream_count
    }

    const joinDateKST = joinDates.get(memberNo) || '2000-01-01'
    
    // ✅ GRACE PERIOD: Automatically pass recruits who joined after the week started
    const isGracePeriod = joinDateKST > weekDates[0]
    
    if (isGracePeriod) {
      passedCount++
      continue // Skip the rest of the checks for this agent, they pass automatically
    }

    // Check 1: Daily minimums (1x per day)
    let missedDays = 0
    for (const mission of SIDE_MISSION_TRACKS) {
      for (const date of weekDates) {
        if (date > today) continue; // Do not penalize future days

        const isPreJoin = date < joinDateKST
        if (!dailyMap[mission.name]?.[date] && !isPreJoin) {
          memberPassed = false
          missedDays++
        }
      }
    }

    // Check 2: Weekly total per track (Enforced only when the week is over)
    const insufficientTracks: string[] = []
    if (isWeekOver) {
      for (const mission of SIDE_MISSION_TRACKS) {
        const total = weeklyTotals[mission.name] || 0
        if (total < CONFIG.SIDE_MISSION_WEEKLY_REQ) {
          memberPassed = false
          insufficientTracks.push(`${mission.name}: ${total}/${CONFIG.SIDE_MISSION_WEEKLY_REQ}`)
        }
      }
    }

    if (memberPassed) {
      passedCount++
    } else {
      failedCount++
      allPassed = false
      failureDetails[memberNo] = { missedDays, insufficientTracks }
    }
  }

  const isTrainingWeek = CONFIG.TRAINING_WEEKS.includes(week)
  if (isTrainingWeek) allPassed = true

  // ── Award XP ONLY if they just passed right now ──
  if (allPassed && !alreadyPassed && CONFIG.SIDE_MISSION_TEAM_XP > 0) {
    await awardTeamSecretXP(supabase, team, CONFIG.SIDE_MISSION_TEAM_XP, week)
  }

  await supabase.from('team_status').upsert({
      team, week_label: week, is_alive: true, side_mission_passed: allPassed,
      members_passed: passedCount, members_failed: failedCount, members_total: activeMembers.length,
      failure_details: failureDetails, dissolved_at: null,
      xp_awarded: allPassed ? CONFIG.SIDE_MISSION_TEAM_XP : 0, updated_at: utcNow(),
  }, { onConflict: 'team, week_label' })

  await supabase.from('weekly_summary')
    .update({ side_mission_passed: allPassed, is_alive: true })
    .eq('week_label', week).eq('team', team)

  return { 
      success: true, team, week, alive: true, passed: passedCount, failed: failedCount, 
      total: activeMembers.length, xpAwarded: allPassed && !alreadyPassed ? CONFIG.SIDE_MISSION_TEAM_XP : 0 
  }
}
async function checkAllTeamsSurvival(
  supabase: SupabaseDB,
  week: string,
  adminKey: string,
) {
  if (!requireSyncAdminKey(adminKey)) {
    return { success: false, error: 'Unauthorized' }
  }

  const results: Record<string, any> = {}
  for (const team of TEAMS) {
    results[team] = await checkTeamSurvival(supabase, team, week)
  }
  return { success: true, week, results }
}

// =============================================
// 22. ARIRANG UNIT
// =============================================

async function getArirangUnit(
  supabase: SupabaseDB,
  team: string,
  week: string,
) {
  const { data } = await supabase
    .from('arirang_unit_rotation')
    .select('*')
    .eq('team', team)
    .eq('week_label', week)
    .maybeSingle()

  return {
    success: true,
    team,
    week,
    tracks: data ? [data.track_1, data.track_2] : [],
    required: data?.required_streams || CONFIG.ARIRANG_UNIT_REQ,
  }
}

async function generateUnitRotation(
  supabase: SupabaseDB,
  week: string,
  adminKey: string,
) {
  if (!requireSyncAdminKey(adminKey)) {
    return { success: false, error: 'Unauthorized' }
  }

  if (ARIRANG_TRACKS.length < TEAMS.length * 2) {
    return {
      success: false,
      error: `Need ${TEAMS.length * 2} tracks, have ${ARIRANG_TRACKS.length}`,
    }
  }

  // Get previous week's assignments to avoid repeats
  const weekNumbers = Object.keys(WEEK_START_DATES)
  const currentIdx = weekNumbers.indexOf(week)
  const previousAssignments: Record<string, string[]> = {}

  if (currentIdx > 0) {
    const { data: prevData } = await supabase
      .from('arirang_unit_rotation')
      .select('*')
      .eq('week_label', weekNumbers[currentIdx - 1])

    prevData?.forEach((r: any) => {
      previousAssignments[r.team] = [r.track_1, r.track_2]
    })
  }

  const shuffled = [...ARIRANG_TRACKS]
  let assignments: any[] = []
  let validAssignment = false
  let attempts = 0
  const MAX_ATTEMPTS = 50

  while (attempts < MAX_ATTEMPTS && !validAssignment) {
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    assignments = TEAMS.map((team, i) => ({
      week_label: week,
      team,
      track_1: shuffled[i * 2],
      track_2: shuffled[i * 2 + 1],
      required_streams: CONFIG.ARIRANG_UNIT_REQ,
    }))

    validAssignment = true
    for (const a of assignments) {
      const prev = previousAssignments[a.team]
      if (prev && (prev.includes(a.track_1) || prev.includes(a.track_2))) {
        validAssignment = false
        break
      }
    }
    attempts++
  }

  // Refuse to save invalid rotation
  if (!validAssignment) {
    return {
      success: false,
      error: `Could not avoid previous week's tracks after ${MAX_ATTEMPTS} attempts. Manual assignment required.`,
      lastAttempt: assignments.map((a) => ({
        team: a.team,
        track1: a.track_1,
        track2: a.track_2,
      })),
    }
  }

  await supabase
    .from('arirang_unit_rotation')
    .upsert(assignments, { onConflict: 'week_label, team' })

  return {
    success: true,
    week,
    assignments: assignments.map((a) => ({
      team: a.team,
      track1: a.track_1,
      track2: a.track_2,
    })),
    attemptsNeeded: attempts,
  }
}

async function getUnitRotationOverview(supabase: SupabaseDB, week: string) {
  const { data } = await supabase
    .from('arirang_unit_rotation')
    .select('*')
    .eq('week_label', week)

  const overview: Record<string, any> = {}
  for (const row of data || []) {
    overview[row.team] = {
      track1: row.track_1,
      track2: row.track_2,
      required: row.required_streams,
    }
  }

  return {
    success: true,
    week,
    units: overview,
    teamsAssigned: Object.keys(overview).length,
    totalTeams: TEAMS.length,
  }
}

// =============================================
// 23. GLOBAL ARIRANG GOAL
// =============================================

async function getGlobalArirangGoal(supabase: SupabaseDB) {
  const { data } = await supabase
    .from('global_arirang_goal')
    .select('*')
    .maybeSingle()

  const total = data?.total_streams || 0
  const target = data?.target || 5000000
  return {
    success: true,
    total,
    target,
    percentage: target > 0 ? Math.round((total / target) * 100) : 0,
    remaining: Math.max(0, target - total),
    lastUpdated: data?.last_updated || null,
  }
}

async function setGlobalArirangTarget(
  supabase: SupabaseDB,
  newTarget: number,
  adminKey: string,
) {
  if (!requireSyncAdminKey(adminKey)) {
    return { success: false, error: 'Unauthorized' }
  }

  await supabase
    .from('global_arirang_goal')
    .update({ target: newTarget, last_updated: utcNow() })
    .eq('id', 1)

  return { success: true, newTarget }
}

// =============================================
// 24. TEAM SECRET XP HELPER
// =============================================

async function awardTeamSecretXP(
  supabase: SupabaseDB,
  team: string,
  xp: number,
  week: string,
) {
  const { error } = await supabase.rpc('increment_team_xp', {
    t_name: team,
    w_label: week,
    xp_inc: xp,
  })
  if (error) console.error(`[XP] ${team}: ${error.message}`)
}

// =============================================
// 25. RANKINGS
// =============================================

async function getRankings(
  supabase: SupabaseDB,
  week: string,
  limit: number = 100,
) {
  const prevWeek = getPreviousWeekLabel(week)

  // Fetch current + previous week ranks in parallel
  const [currRes, prevRes] = await Promise.all([
    supabase
      .from('live_rankings')
      .select('*')
      .eq('week_label', week)
      .order('global_rank', { ascending: true })
      .limit(limit),
    prevWeek
      ? supabase
          .from('live_rankings')
          .select('agent_no, global_rank')
          .eq('week_label', prevWeek)
      : Promise.resolve({ data: [] }),
  ])

  // Build a map of agent_no → previous global_rank
  const prevRankMap = new Map<string, number>(
    ((prevRes as any).data || []).map((r: any) => [r.agent_no, r.global_rank]),
  )

  return {
    success: true,
    week,
    rankings: (currRes.data || []).map((r: any) => {
      const prevRank = prevRankMap.get(r.agent_no)
      const rankDelta = prevRank != null ? prevRank - r.global_rank : null // +ve = moved up
      return {
        rank: r.global_rank,
        teamRank: r.team_rank,
        agentNo: r.agent_no,
        name: r.agent_name,
        team: r.team,
        totalXP: r.total_xp,
        rankDelta, // null = new entry this week
        xpDelta: rankDelta, // alias consumed by frontend buildRankCard
      }
    }),
    lastUpdated: utcNow(),
  }
}

async function getTeamRankings(
  supabase: SupabaseDB,
  team: string,
  week: string,
) {
  const prevWeek = getPreviousWeekLabel(week)

  const [currRes, prevRes] = await Promise.all([
    supabase
      .from('live_rankings')
      .select('*')
      .eq('week_label', week)
      .eq('team', team)
      .order('team_rank', { ascending: true }),
    prevWeek
      ? supabase
          .from('live_rankings')
          .select('agent_no, team_rank')
          .eq('week_label', prevWeek)
          .eq('team', team)
      : Promise.resolve({ data: [] }),
  ])

  const prevRankMap = new Map<string, number>(
    ((prevRes as any).data || []).map((r: any) => [r.agent_no, r.team_rank]),
  )

  return {
    success: true,
    team,
    week,
    rankings: (currRes.data || []).map((r: any) => {
      const prevRank = prevRankMap.get(r.agent_no)
      const rankDelta = prevRank != null ? prevRank - r.team_rank : null
      return {
        rank: r.team_rank,
        agentNo: r.agent_no,
        name: r.agent_name,
        team: r.team,
        totalXP: r.total_xp,
        rankDelta,
        xpDelta: rankDelta,
      }
    }),
    lastUpdated: utcNow(),
  }
}

// =============================================
// 26. TEAM DATA
// =============================================

async function getTeamData(
  supabase: SupabaseDB,
  teamName: string,
  week: string,
) {
  if (!teamName) return { success: false, error: 'Team name required' }

  const [summaryRes, membersRes, goalsRes, unitRes, statusRes, warningRes] =
    await Promise.all([
      supabase
        .from('weekly_summary')
        .select('*')
        .eq('week_label', week)
        .eq('team', teamName)
        .maybeSingle(),
      supabase
        .from('weekly_member_stats')
        .select(
          'total_xp, track_scrobbles, album_scrobbles, album_2x_passed, arirang_unit_passed, agents!inner(name, agent_no, team)',
        )
        .eq('week_label', week)
        .eq('agents.team', teamName)
        .order('total_xp', { ascending: false }),
      supabase
        .from('team_goals_progress')
        .select('*')
        .eq('week_label', week)
        .eq('team', teamName),
      supabase
        .from('arirang_unit_rotation')
        .select('*')
        .eq('week_label', week)
        .eq('team', teamName)
        .maybeSingle(),
      supabase
        .from('team_status')
        .select('*')
        .eq('team', teamName)
        .eq('week_label', week)
        .maybeSingle(),
      supabase
        .from('team_warnings')
        .select('*')
        .eq('team', teamName)
        .eq('status', 'active')
        .maybeSingle(),
    ])

  const summary = summaryRes.data
  const members = membersRes.data || []
  const teamStatus = statusRes.data
  const teamWarning = warningRes.data
  const unitRotation = unitRes.data

  // Goal maps
  const trackGoals: Record<string, any> = {}
  const albumGoals: Record<string, any> = {}
  for (const g of goalsRes.data || []) {
    const obj = {
      goal: g.goal_amount,
      current: g.current_total,
      percentage: g.percentage,
      status: g.status,
    }
    if (g.target_type === 'track') trackGoals[g.target_name] = obj
    else albumGoals[g.target_name] = obj
  }

  // Album 2x / Unit stats
  const album2xStats = { passed: 0, failed: 0, total: members.length }
  const unitStats = { passed: 0, failed: 0, total: members.length }
  for (const m of members) {
    if (m.album_2x_passed) album2xStats.passed++
    else album2xStats.failed++
    if (m.arirang_unit_passed) unitStats.passed++
    else unitStats.failed++
  }

  return {
    success: true,
    team: teamName,
    week,
    level: summary?.level || 1,
    teamXP: summary?.team_xp || 0,
    winner: summary?.is_winner || false,
    pfp: TEAM_PFPS[teamName] || '',
    isAlive: teamStatus?.is_alive ?? true,
    isAtRisk: !!teamWarning,
    warningStatus: teamWarning
      ? {
        warningWeek: teamWarning.warning_week,
        recoveryWeek: teamWarning.recovery_week,
        daysRequired: teamWarning.recovery_days_required,
        daysAchieved: teamWarning.recovery_days_achieved || 0,
      }
      : null,
    missions: {
      tracksPassed: summary?.track_goal_passed || false,
      albumsPassed: summary?.album_goal_passed || false,
      album2xPassed: summary?.album_2x_passed || false,
      arirangUnitPassed: summary?.arirang_unit_passed || false,
      sideMissionPassed: summary?.side_mission_passed || false,
      attendancePassed: summary?.attendance_confirmed || false,
      policePassed: summary?.police_confirmed || false,
    },
    album2xStats,
    unitStats,
    arirangUnit: unitRotation
      ? {
        track1: unitRotation.track_1,
        track2: unitRotation.track_2,
        required: unitRotation.required_streams,
      }
      : null,
    sideMissionStats: {
      membersPassed: teamStatus?.members_passed || 0,
      membersFailed: teamStatus?.members_failed || 0,
      membersTotal: teamStatus?.members_total || 0,
    },
    members: members.map((m: any) => ({
      agentNo: m.agents.agent_no,
      name: m.agents.name,
      trackScrobbles: m.track_scrobbles,
      albumScrobbles: m.album_scrobbles,
      totalXP: m.total_xp,
      album2xPassed: m.album_2x_passed,
      arirangUnitPassed: m.arirang_unit_passed,
    })),
    trackGoals,
    albumGoals,
    lastUpdated: summary?.updated_at || null,
  }
}

async function getTeamMembers(
  supabase: SupabaseDB,
  team: string,
  week: string,
) {
  const td = await getTeamData(supabase, team, week)
  if (!td.success) return td
  return {
    success: true,
    team,
    week,
    members: td.members,
    totalMembers: td.members?.length || 0,
    teamXP: td.teamXP,
    level: td.level,
    album2xStats: td.album2xStats,
    unitStats: td.unitStats,
    isAlive: td.isAlive,
    lastUpdated: td.lastUpdated,
  }
}

async function getTeamComparison(supabase: SupabaseDB, week: string) {
  const [summaryRes, statusRes] = await Promise.all([
    supabase
      .from('weekly_summary')
      .select('*')
      .eq('week_label', week)
      .order('team_xp', { ascending: false }),
    supabase
      .from('team_status')
      .select('team, is_alive, side_mission_passed')
      .eq('week_label', week),
  ])

  const statusMap: Record<string, any> = {}
  for (const s of statusRes.data || []) statusMap[s.team] = s

  return {
    success: true,
    week,
    comparison: (summaryRes.data || []).map((t: any) => ({
      team: t.team,
      level: t.level,
      teamXP: t.team_xp,
      missions: {
        tracks: t.track_goal_passed,
        albums: t.album_goal_passed,
        album2x: t.album_2x_passed,
        arirangUnit: t.arirang_unit_passed,
        sideMission: t.side_mission_passed,
        attendance: t.attendance_confirmed,
        police: t.police_confirmed,
      },
      isAlive: statusMap[t.team]?.is_alive ?? true,
      winner: t.is_winner,
      pfp: TEAM_PFPS[t.team] || '',
    })),
    lastUpdated: utcNow(),
  }
}

async function getWeeklySummary(supabase: SupabaseDB, week: string) {
  const [summaryRes, statusRes] = await Promise.all([
    supabase.from('weekly_summary').select('*').eq('week_label', week),
    supabase
      .from('team_status')
      .select('team, is_alive')
      .eq('week_label', week),
  ])

  const statusMap: Record<string, any> = {}
  for (const s of statusRes.data || []) statusMap[s.team] = s

  const teams: Record<string, any> = {}
  let winner: string | null = null

  for (const t of summaryRes.data || []) {
    const allComplete =
      t.track_goal_passed &&
      t.album_goal_passed &&
      t.album_2x_passed &&
      t.arirang_unit_passed &&
      t.side_mission_passed

    teams[t.team] = {
      trackGoalPassed: t.track_goal_passed,
      albumGoalPassed: t.album_goal_passed,
      album2xPassed: t.album_2x_passed,
      arirangUnitPassed: t.arirang_unit_passed,
      sideMissionPassed: t.side_mission_passed,
      isAlive: statusMap[t.team]?.is_alive ?? true,
      levelStatus: allComplete
        ? `⬆️ Level ${t.level}`
        : `⏸️ Level ${t.level}`,
      level: t.level,
      teamXP: t.team_xp,
      isWinner: t.is_winner,
      attendanceConfirmed: t.attendance_confirmed,
      policeConfirmed: t.police_confirmed,
      pfp: TEAM_PFPS[t.team] || '',
    }
    if (t.is_winner) winner = t.team
  }

  return {
    success: true,
    week,
    teams,
    winner,
    resultsReleased: summaryRes.data?.[0]?.results_released || false,
  }
}

async function getGoalsProgress(supabase: SupabaseDB, week: string) {
  const { data } = await supabase
    .from('team_goals_progress')
    .select('*')
    .eq('week_label', week)

  const trackGoals: Record<string, any> = {}
  const albumGoals: Record<string, any> = {}

  for (const g of data || []) {
    const td = {
      current: g.current_total,
      percentage: g.percentage,
      moreNeeded: Math.max(0, g.goal_amount - g.current_total),
      status: g.status,
    }
    const bucket = g.target_type === 'track' ? trackGoals : albumGoals
    if (!bucket[g.target_name]) {
      bucket[g.target_name] = { goal: g.goal_amount, teams: {} }
    }
    bucket[g.target_name].teams[g.team] = td
  }

  return { success: true, week, trackGoals, albumGoals, lastUpdated: utcNow() }
}

// =============================================
// 27. ALBUM 2X STATUS (Standalone — uses daily grid)
// =============================================

async function getAlbum2xStatus(
  supabase: SupabaseDB,
  week: string,
  team: string | null,
  agentNo: string | null,
) {
  let memberQuery = supabase
    .from('weekly_member_stats')
    .select(
      'album_2x_passed, arirang_unit_passed, agents!inner(agent_no, name, team, created_at)',
    )
    .eq('week_label', week)

  if (team) memberQuery = memberQuery.eq('agents.team', team)

  const memberRes = await memberQuery
  if (memberRes.error) {
    return { success: false, error: memberRes.error.message }
  }

  const agentNos = (memberRes.data || []).map((r: any) => String(r.agents.agent_no).trim())

  const leavesRes = await supabase
    .from('leave_requests')
    .select('agent_no')
    .eq('week_label', week)
    .in('agent_no', agentNos.length ? agentNos : ['NONE'])

  // Fetch daily stats per agent to avoid API max-row truncation!
  const dailyPromises = agentNos.map(aNo =>
    supabase
      .from('album_2x_daily')
      .select('agent_no, date, track_name, stream_count, passed')
      .eq('week_label', week)
      .eq('agent_no', aNo)
  )
  const dailyResArray = await Promise.all(dailyPromises)
  const allDailyData = dailyResArray.flatMap(r => r.data || [])

  const leaveSet = new Set(
    (leavesRes.data || []).map((l: any) => String(l.agent_no).trim()),
  )

  // Build daily lookup: agent → date → track → { count, passed }
  const dailyLookup = new Map<
    string,
    Map<string, Map<string, { count: number; passed: boolean }>>
  >()
  for (const r of allDailyData) {
    const rAgentNo = String(r.agent_no).trim()
    if (!dailyLookup.has(rAgentNo)) dailyLookup.set(rAgentNo, new Map())
    const agentMap = dailyLookup.get(rAgentNo)!
    if (!agentMap.has(r.date)) agentMap.set(r.date, new Map())
    agentMap.get(r.date)!.set(r.track_name, {
      count: r.stream_count,
      passed: r.passed,
    })
  }

  const weekDates = getWeekDates(week)
  let today = getKSTDateString()
  
  // ✅ FIX: Cap 'today' for Album 2X
  if (weekDates.length > 0 && today > weekDates[6]) {
    today = weekDates[6];
  }
  
  const totalTracks = ARIRANG_TRACKS.length
  const teams: Record<string, any> = {}
  let userTracks: Record<string, any> = {}

  for (const row of memberRes.data || []) {
    const mTeam = row.agents.team
    const mNo = String(row.agents.agent_no).trim()
    const isOnLeave = leaveSet.has(mNo)

    if (!teams[mTeam]) {
      teams[mTeam] = { members: [], passed: 0, failed: 0, totalMembers: 0 }
    }

    // ── Per-track status (existing) ──
    const memberTracks: Record<string, any> = {}
    let memberPassed = true

    for (const track of ARIRANG_TRACKS) {
      if (isOnLeave) {
        memberTracks[track] = { status: 'Exempt', dailyPassed: true }
      } else {
        let allDaysPassed = true
        let totalCount = 0

        for (const date of weekDates) {
          if (date > today) continue

          const dayEntry = dailyLookup
            .get(mNo)
            ?.get(date)
            ?.get(track)

          const count = dayEntry?.count || 0
          const passed = dayEntry?.passed || false
          totalCount += count

          if (!passed) allDaysPassed = false
        }

        memberTracks[track] = {
          totalCount,
          dailyPassed: allDaysPassed,
        }
        if (!allDaysPassed) memberPassed = false
      }
    }

    if (isOnLeave) memberPassed = true

    // ── NEW: Per-day aggregate (for Daily Team Monitor) ──
    const daily: Record<string, { passed: boolean; tracksDone: number; totalTracks: number; exempt: boolean; preJoin?: boolean }> = {}

    const joinDateKST = unixToKSTDate(new Date(row.agents.created_at).getTime() / 1000)

    for (const date of weekDates) {
      const isPreJoin = date < joinDateKST
      if (isOnLeave || isPreJoin) {
        daily[date] = { passed: true, tracksDone: totalTracks, totalTracks, exempt: isOnLeave, preJoin: isPreJoin }
      } else if (date > today) {
        // Future date — no data yet
        daily[date] = { passed: false, tracksDone: 0, totalTracks, exempt: false }
      } else {
        const agentDateMap = dailyLookup.get(mNo)?.get(date)
        let tracksDone = 0

        for (const track of ARIRANG_TRACKS) {
          const entry = agentDateMap?.get(track)
          if (entry?.passed) tracksDone++
        }

        daily[date] = {
          passed: tracksDone >= totalTracks,
          tracksDone,
          totalTracks,
          exempt: false,
        }
      }
    }

    teams[mTeam].members.push({
      agentNo: mNo,
      name: row.agents.name,
      passed: memberPassed,
      onLeave: isOnLeave,           // ✅ NEW
      tracks: memberTracks,
      daily,                          // ✅ NEW
      arirangUnitPassed: row.arirang_unit_passed,
    })
    teams[mTeam].totalMembers++
    if (memberPassed) teams[mTeam].passed++
    else teams[mTeam].failed++

    if (agentNo && mNo === String(agentNo).trim()) {
      userTracks = memberTracks
    }
  }

  return {
    success: true,
    week,
    teams,
    userTracks,
    weekDates,       // ✅ NEW
    today,           // ✅ NEW
    totalTracks,     // ✅ NEW
  }
}
async function getSideMissionTeamStatus(
  supabase: SupabaseDB,
  week: string,
  team: string,
) {
  if (!team) return { success: false, error: 'Team required' }
  if (!isValidWeek(week)) return { success: false, error: `Unknown week: ${week}` }

  const weekDates = getWeekDates(week)
  let today = getKSTDateString()

  // FIX 1: Cap "today" to the last day of the week so the UI doesn't break when viewing past weeks
  if (today > weekDates[6]) {
    today = weekDates[6]
  }

  const totalTracks = SIDE_MISSION_TRACKS.length

  const agentsRes = await supabase.from('agents')
    .select('agent_no, name, created_at')
    .eq('team', team)
    .eq('status', 'active')

  if (agentsRes.error) return { success: false, error: agentsRes.error.message }
  const agents = agentsRes.data || []
  const agentNos = agents.map(a => String(a.agent_no).trim())

  const leavesRes = await supabase.from('leave_requests')
    .select('agent_no')
    .eq('week_label', week)
    .in('agent_no', agentNos.length ? agentNos : ['NONE'])

  // FIX 2: Select stream_count so we can verify the 20 streams total requirement
  const dailyPromises = agentNos.map(aNo =>
    supabase.from('side_mission_daily')
      .select('agent_no, date, track_name, passed, stream_count')
      .eq('week_label', week)
      .eq('agent_no', aNo)
  )
  const dailyResArray = await Promise.all(dailyPromises)
  const allDailyData = dailyResArray.flatMap(r => r.data || [])

  const leaveSet = new Set((leavesRes.data || []).map((l: any) => String(l.agent_no).trim()))

  // Build lookup: agent → date → trackName → { passed, stream_count }
  const dailyLookup = new Map<string, Map<string, Map<string, any>>>()
  for (const r of allDailyData) {
    const rAgentNo = String(r.agent_no).trim()
    if (!dailyLookup.has(rAgentNo)) dailyLookup.set(rAgentNo, new Map())
    const agentMap = dailyLookup.get(rAgentNo)!
    if (!agentMap.has(r.date)) agentMap.set(r.date, new Map())
    agentMap.get(r.date)!.set(r.track_name, r)
  }

  // Build per-member daily status
  const members = agents.map(a => {
    const isOnLeave = leaveSet.has(a.agent_no)

    const daily: Record<string, {
      passed: boolean;
      tracksDone: number;
      totalTracks: number;
      exempt: boolean;
      preJoin?: boolean;
      missingTracks: string[];
    }> = {}

    let weeklyChainIntact = true
    const weeklyTotals: Record<string, number> = {}

    const joinDateKST = unixToKSTDate(new Date(a.created_at).getTime() / 1000)
    const isGracePeriod = joinDateKST > weekDates[0];

    for (const date of weekDates) {
      // ✅ UI FIX: Mark the entire week as PreJoin if they are in Grace Period
      const isPreJoin = date < joinDateKST || isGracePeriod;
      
      if (isOnLeave || isPreJoin) {
        daily[date] = {
          passed: true,
          tracksDone: totalTracks,
          totalTracks,
          exempt: isOnLeave,
          preJoin: isPreJoin,
          missingTracks: []
        }
      } else if (date > today) {
        daily[date] = {
          passed: false,
          tracksDone: 0,
          totalTracks,
          exempt: false,
          missingTracks: []
        }
      } else {
        const checkAgentNo = String(a.agent_no).trim()
        const dayMap = dailyLookup.get(checkAgentNo)?.get(date) || new Map()

        let tracksDone = 0
        const missingTracks: string[] = []

        for (const t of SIDE_MISSION_TRACKS) {
          const r = dayMap.get(t.name)
          if (r?.passed) {
            tracksDone++
          } else {
            missingTracks.push(t.name)
          }
          // Accumulate total for the 20 streams check
          weeklyTotals[t.name] = (weeklyTotals[t.name] || 0) + (r?.stream_count || 0)
        }

        const dayPassed = tracksDone >= totalTracks
        daily[date] = {
          passed: dayPassed,
          tracksDone,
          totalTracks,
          exempt: false,
          missingTracks
        }

        if (!dayPassed) weeklyChainIntact = false
      }
    }



    let missedWeeklyTotal = false
    const volumeShortfalls: Array<{ name: string, current: number, required: number }> = []
    const chainBroken = !weeklyChainIntact

    // ✅ FIX: Do not enforce the 20-stream weekly rule if they are on leave OR in the Grace Period
    if (!isOnLeave && !isGracePeriod) {
      for (const t of SIDE_MISSION_TRACKS) {
        const total = weeklyTotals[t.name] || 0
        if (total < t.weeklyRequired) {
          missedWeeklyTotal = true
          volumeShortfalls.push({
            name: t.name,
            current: total,
            required: t.weeklyRequired
          })
        }
      }
    }

    return {
      agentNo: a.agent_no,
      name: a.name,
      onLeave: isOnLeave,
      daily,
      // ✅ FIX: Force the weekPassed flag to true for Grace Period agents
      weekPassed: isOnLeave || isGracePeriod || (!chainBroken && !missedWeeklyTotal),
      chainBroken,
      volumeShortfalls
    }
  }) // <-- FIX 1: Close the agents.map() function

  // <-- FIX 2: Return the final data for the whole function
  return {
    success: true,
    team,
    week,
    members
  }
} // <-- FIX 3: Close getSideMissionTeamStatus function

// =============================================
// 28. ANNOUNCEMENTS & PLAYLISTS
// =============================================

async function getAnnouncements(supabase: SupabaseDB, week: string) {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .or(`week.eq.${week},week.eq.all`)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10)

      return {
        success: true,
        week,
        announcements: (data || []).map((a: any) => ({
          id: a.id,
          week: a.week,
          title: a.title,
          message: a.message,
          priority: a.priority,
          created: a.created_at,
          link: a.link || '',
          linkText: a.link_text || '',
        })),
      }
    }

  async function addAnnouncement(supabase: SupabaseDB, params: any) {
      const pw = Deno.env.get('JOURNALIST_PASSWORD')
      if (!pw || params.password !== pw) {
        return { success: false, error: 'Invalid password' }
      }

      const { error } = await supabase.from('announcements').insert({
        week: params.week || 'all',
        title: params.title,
        message: params.message,
        priority: params.priority || 'medium',
        link: params.link,
        link_text: params.linkText,
      })

      return { success: !error, error: error?.message }
    }

  async function getPlaylists(supabase: SupabaseDB, week: string) {
      const { data } = await supabase
        .from('playlists')
        .select('*')
        .or(`target_week.eq.${week},target_week.eq.all,target_week.is.null`)
        .order('created_at', { ascending: false })

      return {
        success: true,
        playlists: (data || []).map((p: any) => ({
          week: p.target_week,
          name: p.name,
          url: p.url,
          platform: p.platform,
          type: p.playlist_type,
          team: p.team,
          addedBy: p.added_by,
          date: p.created_at,
        })),
      }
    }

  async function addPlaylist(supabase: SupabaseDB, params: any) {
      const pw = Deno.env.get('PLAYLIST_PASSWORD')
      if (!pw || params.password !== pw) {
        return { success: false, error: 'Invalid password' }
      }

      const { error } = await supabase.from('playlists').insert({
        target_week: params.targetWeek,
        name: params.name,
        url: params.url,
        platform: params.platform || 'Spotify',
        playlist_type: params.type || 'Playlist',
        team: params.team || 'All',
        added_by: params.agentNo,
      })

      return { success: !error }
    }

  // =============================================
  // 29. LEAVE SYSTEM
  // =============================================

  async function applyLeave(
      supabase: SupabaseDB,
      agentNo: string,
      week: string,
    ) {
      if (!agentNo) return { success: false, error: 'Agent number required' }

      const month = getWeekMonth(week)
      if (!month) return { success: false, error: 'Invalid week' }

      const [existingRes, usageRes] = await Promise.all([
        supabase
          .from('leave_requests')
          .select('id')
          .eq('agent_no', agentNo)
          .eq('week_label', week)
          .maybeSingle(),
        supabase
          .from('monthly_leave_usage')
          .select('*')
          .eq('agent_no', agentNo)
          .eq('month', month)
          .maybeSingle(),
      ])

      if (existingRes.data) {
        return { success: false, error: 'Leave already applied for this week.' }
      }

      const used = usageRes.data?.weeks_used || 0
      if (used >= CONFIG.MAX_LEAVES_PER_MONTH) {
        return {
          success: false,
          error: `Already used your leave this month (${month}).`,
        }
      }

      const { error } = await supabase.from('leave_requests').insert({
        agent_no: agentNo,
        week_label: week,
        month_label: month,
        status: 'Approved',
      })

      if (error) return { success: false, error: error.message }

      await supabase.from('monthly_leave_usage').upsert(
        { agent_no: agentNo, month, weeks_used: used + 1 },
        { onConflict: 'agent_no, month' },
      )

      return {
        success: true,
        message: 'Leave applied. Exempt from all missions, 0 XP this week.',
        month,
        leavesUsedThisMonth: used + 1,
      }
    }

  async function cancelLeave(
      supabase: SupabaseDB,
      agentNo: string,
      week: string,
    ) {
      if (!agentNo) return { success: false, error: 'Agent number required' }

      const month = getWeekMonth(week)

      const { count } = await supabase
        .from('leave_requests')
        .delete({ count: 'exact' })
        .eq('agent_no', agentNo)
        .eq('week_label', week)

      if (!count || count === 0) {
        return { success: false, error: 'No active leave found.' }
      }

      if (month) {
        const { data: usage } = await supabase
          .from('monthly_leave_usage')
          .select('weeks_used')
          .eq('agent_no', agentNo)
          .eq('month', month)
          .maybeSingle()

        if (usage && usage.weeks_used > 0) {
          await supabase
            .from('monthly_leave_usage')
            .update({ weeks_used: usage.weeks_used - 1 })
            .eq('agent_no', agentNo)
            .eq('month', month)
        }
      }

      return { success: true, message: 'Leave cancelled. Back on duty!' }
    }

  async function getAgentsOnLeave(supabase: SupabaseDB, week: string) {
      const { data: leaves } = await supabase
        .from('leave_requests')
        .select('agent_no')
        .eq('week_label', week)

      const agentNos = (leaves || []).map((l: any) => l.agent_no)
      if (agentNos.length === 0) return { success: true, agents: [] }

      const { data: agents } = await supabase
        .from('agents')
        .select('agent_no, name, team')
        .in('agent_no', agentNos)

      return {
        success: true,
        agents: (agents || []).map((a: any) => ({
          agentNo: a.agent_no,
          name: a.name,
          team: a.team,
        })),
      }
    }

  // =============================================
  // 30. SECRET MISSIONS
  // =============================================

  async function getTeamMissions(
      supabase: SupabaseDB,
      week: string,
      status: string = 'active',
    ) {
      let q = supabase.from('team_missions').select('*').eq('week_label', week)
      if (status !== 'all') q = q.eq('status', status)
      const { data } = await q.order('created_at', { ascending: false })
      return { success: true, missions: data || [] }
    }

  async function getTeamSecretMissions(
      supabase: SupabaseDB,
      team: string,
      agentNo: string,
      week: string,
    ) {
      // ✅ Use ilike for case-insensitive week matching
      const { data: missions, error } = await supabase
        .from('team_missions')
        .select('*')
        .ilike('week_label', week.trim()); // Matches "week 4", "Week 4", "WEEK 4"

      if (error) {
        console.error('[Get Missions Error]', error);
        return {
          success: false,
          error: error.message,
          active: [],
          completed: [],
          myAssigned: []
        };
      }

      // ✅ Filter teams manually with case-insensitive comparison
      const filteredMissions = (missions || []).filter(m => {
        let teams = m.target_teams;

        // Handle both JSONB array and string formats
        if (typeof teams === 'string') {
          try {
            teams = JSON.parse(teams);
          } catch {
            teams = [];
          }
        }

        if (!Array.isArray(teams)) teams = [];

        // Case-insensitive team match
        return teams.some(t =>
          t.trim().toLowerCase() === team.trim().toLowerCase()
        );
      });

      // ✅ Filter active missions
      const active = filteredMissions.filter((m: any) => {
        if (m.status !== 'active') return false;

        let completedTeams = m.completed_teams || [];
        if (typeof completedTeams === 'string') {
          try {
            completedTeams = JSON.parse(completedTeams);
          } catch {
            completedTeams = [];
          }
        }

        return !completedTeams.some(ct =>
          ct.trim().toLowerCase() === team.trim().toLowerCase()
        );
      });

      // ✅ Filter completed missions
      const completed = filteredMissions.filter((m: any) => {
        if (m.status === 'completed') return true;

        let completedTeams = m.completed_teams || [];
        if (typeof completedTeams === 'string') {
          try {
            completedTeams = JSON.parse(completedTeams);
          } catch {
            completedTeams = [];
          }
        }

        return completedTeams.some(ct =>
          ct.trim().toLowerCase() === team.trim().toLowerCase()
        );
      });

      // ✅ Filter missions assigned to this agent
      const myAssigned = active.filter((m: any) => {
        let assignedAgents = m.assigned_agents || [];
        if (typeof assignedAgents === 'string') {
          try {
            assignedAgents = JSON.parse(assignedAgents);
          } catch {
            assignedAgents = [];
          }
        }

        return assignedAgents.some((a: any) => a.agentNo === agentNo);
      });

      return { success: true, active, completed, myAssigned };
    }

  async function getTeamSecretStats(supabase: SupabaseDB, week: string) {
      // ✅ Use ilike for case-insensitive week matching
      const { data: missions, error } = await supabase
        .from('team_missions')
        .select('*')
        .ilike('week_label', week.trim());

      if (error) {
        console.error('[Get Stats Error]', error);
        return { success: false, error: error.message };
      }

      // Initialize stats for all teams
      const stats: Record<string, any> = {};
      TEAMS.forEach((t) => {
        stats[t] = {
          secretXP: 0,
          completed: 0,
          active: 0,
          total: 0,
          pfp: TEAM_PFPS[t]
        };
      });

      // Process each mission
      for (const m of missions || []) {
        // Parse target_teams
        let targetTeams = m.target_teams;
        if (typeof targetTeams === 'string') {
          try {
            targetTeams = JSON.parse(targetTeams);
          } catch {
            targetTeams = [];
          }
        }
        if (!Array.isArray(targetTeams)) targetTeams = [];

        // Parse completed_teams
        let completedTeams = m.completed_teams || [];
        if (typeof completedTeams === 'string') {
          try {
            completedTeams = JSON.parse(completedTeams);
          } catch {
            completedTeams = [];
          }
        }
        if (!Array.isArray(completedTeams)) completedTeams = [];

        // ✅ Update stats with case-insensitive matching
        for (const targetTeam of targetTeams) {
          const normalizedTarget = targetTeam.trim();

          // Find matching team in stats (case-insensitive)
          const statKey = TEAMS.find(t =>
            t.toLowerCase() === normalizedTarget.toLowerCase()
          );

          if (!statKey || !stats[statKey]) continue;

          stats[statKey].total++;

          // Check if this team completed the mission
          const isCompleted = completedTeams.some(ct =>
            ct.trim().toLowerCase() === normalizedTarget.toLowerCase()
          );

          if (isCompleted) {
            stats[statKey].completed++;
            stats[statKey].secretXP += m.xp_reward || 0;
          } else if (m.status === 'active') {
            stats[statKey].active++;
          }
        }
      }

      return { success: true, teams: stats };
    }

  async function createTeamMission(supabase: SupabaseDB, params: any) {
    const isValid = await validateAdminSession(supabase, params.sessionToken)
    if (!isValid) return { success: false, error: 'Unauthorized' }

    const missionId = `TM-${Date.now()}-${generateSecureToken().slice(0, 6)}`.toUpperCase()
    const targetTeams =
      typeof params.targetTeams === 'string'
        ? JSON.parse(params.targetTeams)
        : params.targetTeams

    const { error } = await supabase.from('team_missions').insert({
      mission_id: missionId,
      mission_type: params.type || 'joint_op',
      title: params.title,
      briefing: params.briefing,
      target_teams: targetTeams,
      assigned_agents: params.assignedAgents || [],
      target_track: params.targetTrack,
      goal_type: params.goalType || 'combined_streams',
      goal_target: parseInt(params.goalTarget) || 100,
      xp_reward: parseInt(params.xpReward) || 5,
      deadline: params.deadline,
      week_label: params.week || getCurrentWeekLabel(),
      status: 'active',
      completed_teams: [],
      progress: {},
    })

    return { success: !error, missionId, error: error?.message }
  }

  async function completeTeamMission(supabase: SupabaseDB, params: any) {
    const { missionId, team } = params

    const { data: mission, error } = await supabase
      .from('team_missions')
      .select('*')
      .eq('mission_id', missionId)
      .single()

    if (error || !mission) return { success: false, error: 'Mission not found' }
    if (!mission.target_teams?.includes(team)) {
      return { success: false, error: 'Team not in mission' }
    }
    if (mission.completed_teams?.includes(team)) {
      return { success: false, error: 'Already completed' }
    }

    const newCompleted = [...(mission.completed_teams || []), team]
    const newProgress = { ...(mission.progress || {}), [team]: mission.goal_target }

    const totalProcessed = newCompleted.length + Object.values(newProgress).filter(v => v === 'FAILED').length
    const isFullyDone = totalProcessed >= mission.target_teams.length

    await supabase
      .from('team_missions')
      .update({
        completed_teams: newCompleted,
        progress: newProgress,
        status: isFullyDone ? 'completed' : 'active',
      })
      .eq('mission_id', missionId)

    await awardTeamSecretXP(supabase, team, mission.xp_reward, mission.week_label)

    await broadcastActivity(
      supabase,
      'secret_mission',
      { team, title: mission.title, xp: mission.xp_reward },
      params.agentNo,
    )

    return {
      success: true,
      xpAwarded: mission.xp_reward,
      completedTeams: newCompleted,
    }
  }

  async function failTeamMission(supabase: SupabaseDB, params: any) {
    const { data: mission } = await supabase
      .from('team_missions')
      .select('*')
      .eq('mission_id', params.missionId)
      .single()

    if (!mission) return { success: false, error: 'Mission not found' }
    if (!mission.target_teams?.includes(params.team)) {
      return { success: false, error: 'Team not in mission' }
    }

    const wasCompleted = mission.completed_teams?.includes(params.team)
    
    // 1. Remove from completed_teams
    const newCompleted = (mission.completed_teams || []).filter((t: string) => t !== params.team)
    
    // 2. Mark as FAILED in progress
    const newProgress = { ...(mission.progress || {}), [params.team]: 'FAILED' }

    const totalProcessed = newCompleted.length + Object.values(newProgress).filter(v => v === 'FAILED').length
    const isFullyDone = totalProcessed >= mission.target_teams.length

    await supabase
      .from('team_missions')
      .update({
        completed_teams: newCompleted,
        progress: newProgress,
        status: isFullyDone ? 'completed' : 'active'
      })
      .eq('mission_id', params.missionId)

    // 3. Deduct XP if it was previously given
    if (wasCompleted) {
      await awardTeamSecretXP(supabase, params.team, -mission.xp_reward, mission.week_label || getCurrentWeekLabel())
    }

    await broadcastActivity(
      supabase,
      'secret_mission',
      { 
        team: params.team, 
        title: `${mission.title} (FAILED)`, 
        xp: wasCompleted ? -mission.xp_reward : 0,
        message: wasCompleted ? `XP Reversed (-${mission.xp_reward})` : 'Status: Failed'
      },
      params.agentNo || 'ADMIN',
    )

    return { success: true, message: wasCompleted ? 'Status reversed & XP deducted.' : 'Team marked as failed.' }
  }
  async function cancelTeamMission(supabase: SupabaseDB, params: any) {
    await supabase
      .from('team_missions')
      .update({ status: 'cancelled' })
      .eq('mission_id', params.missionId)
    return { success: true }
  }


  async function getMissionHistory(
      supabase: SupabaseDB,
      team: string,
      limit: number,
    ) {
      const { data } = await supabase
        .from('team_missions')
        .select('*')
        .contains('target_teams', [team])
        .in('status', ['completed', 'cancelled'])
        .order('created_at', { ascending: false })
        .limit(limit)

      return {
        success: true,
        history: (data || []).map((m: any) => ({
          ...m,
          teamCompleted: m.completed_teams?.includes(team),
        })),
      }
    }

  // =============================================
  // 31. SONG OF THE DAY
  // =============================================

  async function getSongOfDay(supabase: SupabaseDB, params: any = {}) {
      const kstToday = getKSTDateString()
      const targetDate = params.date || kstToday

      const { data } = await supabase
        .from('daily_sotd')
        .select('*')
        .eq('date', targetDate)
        .maybeSingle()

      if (!data) {
        return { success: false, date: targetDate, error: 'No song set for ' + targetDate }
      }

      return {
        success: true,
        isToday: targetDate === kstToday,
        song: {
          date: data.date,
          title: data.song_title,
          artist: data.artist,
          youtubeId: data.youtube_id,
          hint: data.hint,
          xpReward: data.xp_reward || 1,
        },
      }
    }

  async function setSongOfDay(supabase: SupabaseDB, params: any) {
      const isValid = await validateAdminSession(supabase, params.sessionToken)
      if (!isValid) return { success: false, error: 'Admin access required' }

      const targetDate = params.date || getKSTDateString()
      const songData = {
        song_title: params.title,
        artist: params.artist || 'BTS',
        youtube_id: params.youtubeId,
        hint: params.hint,
        xp_reward: parseInt(params.xpReward) || 1,
      }

      const { data: existing } = await supabase
        .from('daily_sotd')
        .select('id')
        .eq('date', targetDate)
        .maybeSingle()

      if (existing) {
        await supabase.from('daily_sotd').update(songData).eq('date', targetDate)
      } else {
        await supabase
          .from('daily_sotd')
          .insert({ ...songData, date: targetDate, created_by: params.agentNo })
      }

      return {
        success: true,
        message: `${existing ? 'Updated' : 'Published'} song for KST ${targetDate}`,
      }
    }

  /**
   * Submit SOTD answer. Fixed:
   *  - Uses atomic increment (no stats spread)
   *  - Attempt count is re-verified after insert to prevent race conditions
   */
  async function submitSongAnswer(supabase: SupabaseDB, params: any) {
      const { agentNo, answer } = params
      if (!agentNo || !answer) {
        return { success: false, error: 'Missing agentNo or answer' }
      }

      const today = getKSTDateString()
      const songData = await getSongOfDay(supabase, { date: today })
      if (!songData.success) return { success: false, error: 'No song available' }

      const song = songData.song!
      const week = getCurrentWeekLabel()

      // Check existing attempts
      const { data: existing } = await supabase
        .from('sotd_answers')
        .select('id, is_correct, attempt_number')
        .eq('agent_no', agentNo)
        .eq('answer_date', today)
        .order('attempt_number', { ascending: true })

      if (existing?.some((a: any) => a.is_correct)) {
        return { success: true, alreadyAnswered: true, message: 'Already completed! 🎉' }
      }
      if ((existing?.length || 0) >= 2) {
        return { success: false, error: 'No more chances today!', alreadyAnswered: true }
      }

      const attemptNumber = (existing?.length || 0) + 1
      const submittedId = extractYouTubeId(answer)
      const isCorrect = submittedId?.toLowerCase() === song.youtubeId.toLowerCase()

      const { data: leaveCheck } = await supabase
        .from('leave_requests')
        .select('id')
        .eq('agent_no', agentNo)
        .eq('week_label', week)
        .maybeSingle()

      const isOnLeave = !!leaveCheck
      const xpAwarded = isCorrect && !isOnLeave ? (song.xpReward || 1) : 0

      // Insert attempt
      const { error: insertErr } = await supabase.from('sotd_answers').insert({
        agent_no: agentNo,
        answer_date: today,
        submitted_answer: answer,
        is_correct: isCorrect,
        xp_awarded: xpAwarded,
        attempt_number: attemptNumber,
      })

      if (insertErr) {
        // Likely race condition — re-check
        return { success: false, error: 'Could not submit answer. Try again.' }
      }

      // Award XP atomically (no stats spread)
      if (xpAwarded > 0) {
        const { data: agent } = await supabase
          .from('agents')
          .select('id, team')
          .eq('agent_no', agentNo)
    .limit(1)
    .single()

        if (agent) {
          // Atomic increment via targeted update
          const { data: currentStats } = await supabase
            .from('weekly_member_stats')
            .select('song_xp, total_xp')
            .eq('agent_id', agent.id)
            .eq('week_label', week)
            .maybeSingle()

          if (currentStats) {
            await supabase
              .from('weekly_member_stats')
              .update({
                song_xp: (currentStats.song_xp || 0) + xpAwarded,
                total_xp: (currentStats.total_xp || 0) + xpAwarded,
                updated_at: utcNow(),
              })
              .eq('agent_id', agent.id)
              .eq('week_label', week)
          } else {
            // No stats row yet — create minimal one
            await supabase.from('weekly_member_stats').upsert(
              {
                agent_id: agent.id,
                agent_no: agentNo,
                week_label: week,
                track_scrobbles: 0,
                album_scrobbles: 0,
                track_xp: 0,
                album_xp: 0,
                song_xp: xpAwarded,
                total_xp: xpAwarded,
                album_2x_passed: false,
                arirang_unit_passed: false,
                updated_at: utcNow(),
              },
              { onConflict: 'agent_id, week_label' },
            )
          }

          await awardTeamSecretXP(supabase, agent.team, xpAwarded, week)
        }
      }

      const remaining = 2 - attemptNumber
      return {
        success: true,
        correct: isCorrect,
        xpAwarded,
        attemptsRemaining: remaining,
        message: isCorrect
          ? `🎉 Correct! +${xpAwarded} XP!`
          : `❌ Wrong! ${remaining} chance${remaining !== 1 ? 's' : ''} left.`,
      }
    }

  async function getSOTDDailyResults(supabase: SupabaseDB, date: string | null) {
      const targetDate = date || getKSTDateString()

      const [songRes, answersRes] = await Promise.all([
        supabase
          .from('daily_sotd')
          .select('song_title, artist')
          .eq('date', targetDate)
          .maybeSingle(),
        supabase
          .from('sotd_answers')
          .select('agent_no, xp_awarded')
          .eq('answer_date', targetDate)
          .eq('is_correct', true),
      ])

      const agentNos = (answersRes.data || []).map((a: any) => a.agent_no)
      let agentTeamMap: Record<string, string> = {}

      if (agentNos.length > 0) {
        const { data: agents } = await supabase
          .from('agents')
          .select('agent_no, team')
          .in('agent_no', agentNos)

        for (const a of agents || []) agentTeamMap[a.agent_no] = a.team
      }

      const teamStats: Record<string, any> = {}
      TEAMS.forEach((t) => {
        teamStats[t] = { correct: 0, xp: 0, pfp: TEAM_PFPS[t] }
      })

      for (const a of answersRes.data || []) {
        const t = agentTeamMap[a.agent_no]
        if (t && teamStats[t]) {
          teamStats[t].correct++
          teamStats[t].xp += a.xp_awarded
        }
      }

      let winner: string | null = null
      let maxCorrect = 0
      for (const [t, s] of Object.entries(teamStats) as [string, any][]) {
        if (s.correct > maxCorrect) {
          maxCorrect = s.correct
          winner = t
        }
      }

      return {
        success: true,
        date: targetDate,
        song: songRes.data
          ? { title: songRes.data.song_title, artist: songRes.data.artist }
          : null,
        teams: teamStats,
        winner,
        totalParticipants: answersRes.data?.length || 0,
      }
    }

  /** Batched: single query for all songs, single query for all answers */
  async function getSOTDHistory(supabase: SupabaseDB, limit: number) {
      const today = getKSTDateString()

      const { data: songs } = await supabase
        .from('daily_sotd')
        .select('date, song_title, artist, youtube_id')
        .lt('date', today)
        .order('date', { ascending: false })
        .limit(limit)

      if (!songs || songs.length === 0) return { success: true, history: [], count: 0 }

      const dates = songs.map((s: any) => s.date)

      // Single query for ALL answers across all dates
      const { data: allAnswers } = await supabase
        .from('sotd_answers')
        .select('agent_no, answer_date, xp_awarded')
        .in('answer_date', dates)
        .eq('is_correct', true)

      // Get agent teams in one query
      const agentNos = [...new Set((allAnswers || []).map((a: any) => a.agent_no))]
      let agentTeamMap: Record<string, string> = {}

      if (agentNos.length > 0) {
        const { data: agents } = await supabase
          .from('agents')
          .select('agent_no, team')
          .in('agent_no', agentNos)

        for (const a of agents || []) agentTeamMap[a.agent_no] = a.team
      }

      // Build results per date
      const history = songs.map((song: any) => {
        const dayAnswers = (allAnswers || []).filter(
          (a: any) => a.answer_date === song.date,
        )

        const teamStats: Record<string, any> = {}
        TEAMS.forEach((t) => {
          teamStats[t] = { correct: 0, xp: 0 }
        })

        let winner: string | null = null
        let maxCorrect = 0

        for (const a of dayAnswers) {
          const t = agentTeamMap[a.agent_no]
          if (t && teamStats[t]) {
            teamStats[t].correct++
            teamStats[t].xp += a.xp_awarded
          }
        }

        for (const [t, s] of Object.entries(teamStats) as [string, any][]) {
          if (s.correct > maxCorrect) {
            maxCorrect = s.correct
            winner = t
          }
        }

        return {
          date: song.date,
          song: {
            title: song.song_title,
            artist: song.artist,
            youtubeId: song.youtube_id,
          },
          results: {
            winner,
            totalParticipants: dayAnswers.length,
            teams: teamStats,
          },
        }
      })

      return { success: true, history, count: history.length }
    }

  async function getLatestSOTDResult(supabase: SupabaseDB) {
      const yesterday = new Date(Date.now() + KST_OFFSET_MS - 86400000)
        .toISOString()
        .slice(0, 10)
      return getSOTDDailyResults(supabase, yesterday)
    }

  async function finalizeSOTD(supabase: SupabaseDB) {
      try {
        const yesterday = new Date(Date.now() + KST_OFFSET_MS - 86400000)
          .toISOString()
          .slice(0, 10)
        const { error } = await supabase.rpc('broadcast_sotd_winner', {
          target_date: yesterday,
        })
        if (error) throw error
        return { success: true, message: `Results finalized for ${yesterday}.` }
      } catch (e: any) {
        return { success: false, error: e.message }
      }
    }
  // =============================================
  // 30.5 THE 8TH MISSION: VOTING
  // =============================================
  async function submitArmyVote(supabase: SupabaseDB, params: any) {
      const { agentNo, week } = params;
      if (!agentNo) return { success: false, error: 'Agent number required' };

      // Use PT date string (midnight PT = 4 PM KST cutoff)
      const votingToday = getPTDateString();

      // 1. Get the agent's team
      const { data: agent } = await supabase
        .from('agents')
        .select('team')
        .eq('agent_no', agentNo)
    .limit(1)
    .single();

      if (!agent) return { success: false, error: 'Agent not found' };

      // 2. Insert the vote
      const { error } = await supabase
        .from('army_daily_votes')
        .insert({
          agent_no: agentNo,
          team: agent.team,
          date: votingToday, // Store as PT date
          week_label: week || getCurrentWeekLabel()
        });

      // 3. Handle duplicates gracefully (just return success if they already voted)
      if (error && !error.message.includes('unique constraint') && !error.message.includes('duplicate key')) {
        return { success: false, error: error.message };
      }

      return { success: true, message: 'Vote confirmed and synced to HQ.' };
    }
  // =============================================
  // 32. CHAT (with rate limiting & full sanitization)
  // =============================================

  const CHAT_COOLDOWN_SECONDS = 3

  async function getChatMessages(supabase: SupabaseDB, limit: number = 50) {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    return {
      success: true,
      messages: (data || [])
        .reverse()
        .map((m: any) => ({
          id: m.id,
          username: m.username,
          team: m.team,
          message: m.message,
          timestamp: m.created_at,
        })),
      count: data?.length || 0,
    }
  }

  async function sendChatMessage(supabase: SupabaseDB, params: any) {
    const { agentNo, message } = params
    if (!agentNo) return { success: false, error: 'Agent number required' }
    if (!message?.trim()) return { success: false, error: 'Message cannot be empty' }
    if (message.length > 500) return { success: false, error: 'Message too long (500 char max)' }

    const { data: agent, error: agentErr } = await supabase
      .from('agents')
      .select('name, team')
      .eq('agent_no', agentNo)
    .limit(1)
    .single()

    if (agentErr || !agent) return { success: false, error: 'Agent not found' }

    // Rate limit: check last message time
    const cooldownCutoff = new Date(
      Date.now() - CHAT_COOLDOWN_SECONDS * 1000,
    ).toISOString()

    const { data: recent } = await supabase
      .from('chat_messages')
      .select('id')
      .eq('agent_no', agentNo)
      .gt('created_at', cooldownCutoff)
      .limit(1)

    if (recent && recent.length > 0) {
      return {
        success: false,
        error: `Please wait ${CHAT_COOLDOWN_SECONDS}s between messages.`,
      }
    }

    const cleanMessage = sanitizeHtml(message.trim()).substring(0, 500)

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        agent_no: agentNo,
        username: agent.name || 'Agent',
        team: agent.team || 'Unknown',
        message: cleanMessage,
      })
      .select('id')
      .single()

    return { success: !error, messageId: data?.id, error: error?.message }
  }

  // =============================================
  // 33. ONLINE TRACKING (KST timestamps)
  // =============================================

  async function recordHeartbeat(supabase: SupabaseDB, params: any) {
    const { agentNo } = params
    if (!agentNo) return { success: false }

    const { data: agent } = await supabase
      .from('agents')
      .select('name, team')
      .eq('agent_no', agentNo)
      .maybeSingle()

    // Store UTC (consistent with comparison in getOnlineCount)
    const now = utcNow()

    await supabase.from('online_users').upsert(
      {
        agent_no: agentNo,
        username: agent?.name || 'Agent',
        team: agent?.team || 'Unknown',
        last_seen: now,
      },
      { onConflict: 'agent_no' },
    )

    return { success: true, timestamp: now }
  }

  async function getOnlineCount(supabase: SupabaseDB) {
    // Both stored and compared as UTC — no mismatch
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()

    const { data } = await supabase
      .from('online_users')
      .select('username, team')
      .gte('last_seen', oneMinuteAgo)

    return { success: true, online: data?.length || 0, users: data || [] }
  }

  async function removeOnlineUser(supabase: SupabaseDB, agentNo: string) {
    if (!agentNo) return { success: false }
    await supabase.from('online_users').delete().eq('agent_no', agentNo)
    return { success: true }
  }

  // =============================================
  // 34. BADGES & CHARTS
  // =============================================

  async function getBadges(supabase: SupabaseDB, agentNo: string) {
    if (!agentNo) return { success: false, error: 'Agent number required', badges: [] }

    const { data } = await supabase
      .from('badges')
      .select('*')
      .eq('agent_no', agentNo)
      .order('created_at', { ascending: false })

    return {
      success: true,
      agentNo,
      badges: (data || []).map((b: any) => ({
        type: b.badge_type,
        name: b.badge_name,
        imageUrl: b.image_url,
        weekEarned: b.week_earned,
        description: b.description,
      })),
    }
  }

  async function getAgentChartData(supabase: SupabaseDB, agentNo: string) {
    if (!agentNo) return { success: false, error: 'Agent number required' }

    const { data: agent } = await supabase
      .from('agents')
      .select('id')
      .eq('agent_no', agentNo)
    .limit(1)
    .single()

    if (!agent) return { success: false, error: 'Agent not found' }

    const { data: stats } = await supabase
      .from('weekly_member_stats')
      .select('week_label, track_xp, album_xp, song_xp, total_xp')
      .eq('agent_id', agent.id)
      .order('week_label')

    const weeks: string[] = []
    const trackXP: number[] = []
    const albumXP: number[] = []
    const songXP: number[] = []
    const totalXP: number[] = []

    for (const s of stats || []) {
      weeks.push(s.week_label)
      trackXP.push(s.track_xp || 0)
      albumXP.push(s.album_xp || 0)
      songXP.push(s.song_xp || 0)
      totalXP.push(s.total_xp || 0)
    }

    return { success: true, agentNo, weeks, trackXP, albumXP, songXP, totalXP }
  }

  async function getTeamChartData(supabase: SupabaseDB, team: string) {
    if (!team) return { success: false, error: 'Team name required' }

    const { data } = await supabase
      .from('weekly_summary')
      .select(
        'week_label, team_xp, level, track_goal_passed, album_goal_passed, album_2x_passed, arirang_unit_passed, side_mission_passed',
      )
      .eq('team', team)
      .order('week_label')

    const weeks: string[] = []
    const teamXP: number[] = []
    const levels: number[] = []
    const missionsPassed: number[] = []

    for (const s of data || []) {
      weeks.push(s.week_label)
      teamXP.push(s.team_xp || 0)
      levels.push(s.level || 1)
      missionsPassed.push(
        (s.track_goal_passed ? 1 : 0) +
        (s.album_goal_passed ? 1 : 0) +
        (s.album_2x_passed ? 1 : 0) +
        (s.arirang_unit_passed ? 1 : 0) +
        (s.side_mission_passed ? 1 : 0),
      )
    }

    return { success: true, team, weeks, teamXP, levels, missionsPassed }
  }

  async function toggleResultsRelease(supabase: SupabaseDB, params: any) {
    // ✅ REMOVED — router already validates admin session before handler runs
    // const isValid = await validateAdminSession(supabase, params.adminSession)
    // if (!isValid) return { success: false, error: 'Unauthorized' }

    const released = params.released === 'true' || params.released === true
    const week = params.week

    // 1. Update the release flag immediately so the UI reflects the change
    const { error: updateErr } = await supabase
      .from('weekly_summary')
      .update({ results_released: released })
      .eq('week_label', week)

    if (updateErr) return { success: false, error: updateErr.message }

    // If we are hiding results, just reset winners and exit
    if (!released) {
      await supabase
        .from('weekly_summary')
        .update({ is_winner: false })
        .eq('week_label', week)
      return { success: true, released: false }
    }

    // 2. Fetch data to calculate winners
    const [teamsRes, statusesRes] = await Promise.all([
      supabase
        .from('weekly_summary')
        .select('*')
        .eq('week_label', week)
        .order('team_xp', { ascending: false }),
      supabase
        .from('team_status')
        .select('team, is_alive')
        .eq('week_label', week),
    ])

    const teams = teamsRes.data || []
    const aliveSet = new Set(
      (statusesRes.data || []).filter((s: any) => s.is_alive).map((s: any) => s.team),
    )
    const hasStatuses = (statusesRes.data || []).length > 0
    const isTrue = (v: any) => v === true || String(v).toLowerCase() === 'true'

    // 3. Reset all winners first before recalculating
    await supabase
      .from('weekly_summary')
      .update({ is_winner: false })
      .eq('week_label', week)

    // 4. Find qualified winner
    const qualifiedWinner = teams.find(
      (t: any) =>
        isTrue(t.track_goal_passed) &&
        isTrue(t.album_goal_passed) &&
        isTrue(t.album_2x_passed) &&
        isTrue(t.arirang_unit_passed) &&
        isTrue(t.side_mission_passed) &&
        isTrue(t.attendance_confirmed) &&
        isTrue(t.police_confirmed) &&
        (!hasStatuses || aliveSet.has(t.team)),
    )

    let winnerTeam: string | null = null
    const levelUps: any[] = []

    // 5. Calculate level ups
    for (const team of teams) {
      const allComplete =
        isTrue(team.track_goal_passed) &&
        isTrue(team.album_goal_passed) &&
        isTrue(team.album_2x_passed) &&
        isTrue(team.arirang_unit_passed) &&
        isTrue(team.side_mission_passed) &&
        (!hasStatuses || aliveSet.has(team.team))

      if (allComplete) {
        let prevLevel = 1

        // ✅ FIX: Only look for previous level if NOT Week 1
        // Week 1 has no prior week to compare — default stays at 1
        if (week !== 'Week 1') {
          const { data: pws } = await supabase
            .from('weekly_summary')
            .select('level')
            .eq('team', team.team)
            .lt('week_label', week)
            .order('week_label', { ascending: false })
            .limit(1)

          prevLevel = pws?.[0]?.level || 1
        }

        const newLevel = prevLevel + 1

        await supabase
          .from('weekly_summary')
          .update({ level: newLevel })
          .eq('week_label', week)
          .eq('team', team.team)

        levelUps.push({ team: team.team, oldLevel: prevLevel, newLevel })
      }
    }

    // 6. Mark the winner
    if (qualifiedWinner) {
      winnerTeam = qualifiedWinner.team
      await supabase
        .from('weekly_summary')
        .update({ is_winner: true })
        .eq('week_label', week)
        .eq('team', winnerTeam)
    }

    // 7. Idempotent broadcast — only fire once per week
    const { data: existingBroadcast } = await supabase
      .from('activity_feed')
      .select('id')
      .eq('activity_type', 'results_release')
      .contains('data', { week })
      .limit(1)

    if (!existingBroadcast || existingBroadcast.length === 0) {
      // Broadcast level-ups
      for (const lu of levelUps) {
        await broadcastActivity(
          supabase,
          'leader_update',
          {
            team: lu.team,
            week,
            oldLevel: lu.oldLevel,
            newLevel: lu.newLevel,
            message: `${lu.team} leveled up to Level ${lu.newLevel}! 🎉`,
          },
          'ADMIN',
        )
      }

      // Broadcast results
      await broadcastActivity(
        supabase,
        'results_release',
        winnerTeam
          ? {
            week,
            winner: winnerTeam,
            winnerXP: qualifiedWinner!.team_xp,
            levelUps,
            message: `🏆 ${winnerTeam} wins ${week}!`,
          }
          : {
            week,
            winner: null,
            levelUps,
            message: `⬡ ${week}: No team cleared all missions.`,
          },
        'ADMIN',
      )
    }

    return { success: true, released: true, winner: winnerTeam, levelUps }
  }

  async function updateTeamStatus(supabase: SupabaseDB, params: any) {
    // Determine the week (frontend might not pass it for manual XP, so fallback to current)
    const week = params.week || getCurrentWeekLabel()

    // ── NEW: Intercept Manual XP Injection (Protocol 8 Voting) ──
    if (params.field === 'addManualXP') {
      const xpAmount = parseInt(params.value)
      if (isNaN(xpAmount) || xpAmount === 0) return { success: false, error: 'Invalid XP amount (must be non-zero)' }

      // 1. Award (or deduct) the XP using your existing secure RPC helper
      await awardTeamSecretXP(supabase, params.team, xpAmount, week)

      // 2. Broadcast to the live feed so the team sees the change
      const activityType = xpAmount > 0 ? 'secret_mission' : 'strategy_intel'
      const title = xpAmount > 0 ? 'Protocol Update: Bonus Awarded' : 'Protocol Update: XP Correction'
      
      await broadcastActivity(
        supabase,
        activityType,
        { team: params.team, title: title, xp: xpAmount, message: `System adjustment: ${xpAmount} XP` },
        'ADMIN'
      )

      return { success: true }
    }

    // ── EXISTING: Attendance & Police Logic ──
    const field =
      params.field === 'attendanceConfirmed'
        ? 'attendance_confirmed'
        : 'police_confirmed'
    const value = params.value === 'true' || params.value === true

    const { error } = await supabase
      .from('weekly_summary')
      .update({ [field]: value })
      .eq('week_label', week)
      .eq('team', params.team)

    return error ? { success: false, error: error.message } : { success: true }
  }

  async function getWeeklyWinners(supabase: SupabaseDB) {
    const { data } = await supabase
      .from('weekly_summary')
      .select('week_label, team, team_xp, level')
      .eq('is_winner', true)
      .order('week_label')

    return {
      success: true,
      winners: (data || []).map((w: any) => ({
        week: w.week_label,
        team: w.team,
        teamXP: w.team_xp,
        level: w.level,
      })),
    }
  }

  // =============================================
  // 36. ATTENDANCE & POLICE HELPERS
  // =============================================

  async function updateTeamAttendance(
    supabase: SupabaseDB,
    team: string,
    week: string,
  ) {
    const [membersRes, subsRes] = await Promise.all([
      supabase
        .from('agents')
        .select('agent_no')
        .eq('team', team)
        .eq('status', 'active'),
      supabase
        .from('attendance_submissions')
        .select('agent_no')
        .eq('week_label', week)
        .eq('submitted', true),
    ])

    const memberNos = new Set(
      (membersRes.data || []).map((m: any) => m.agent_no),
    )
    const submitted = (subsRes.data || []).filter((s: any) =>
      memberNos.has(s.agent_no),
    ).length
    const total = memberNos.size
    const pct = total > 0 ? Math.round((submitted / total) * 100) : 0

    await Promise.all([
      supabase.from('team_status').upsert(
        {
          team,
          week_label: week,
          attendance_submitted: submitted,
          attendance_total: total,
          attendance_percentage: pct,
          updated_at: utcNow(),
        },
        { onConflict: 'team, week_label' },
      ),
      supabase
        .from('weekly_summary')
        .update({ attendance_confirmed: pct === 100, attendance_percentage: pct })
        .eq('team', team)
        .eq('week_label', week),
    ])
  }

  async function updateTeamPoliceReports(
    supabase: SupabaseDB,
    team: string,
    week: string,
  ) {
    const { data: reports } = await supabase
      .from('police_reports')
      .select('id')
      .eq('reported_team', team)
      .eq('week_label', week)
      .eq('status', 'confirmed')

    const count = reports?.length || 0
    const passed = count <= CONFIG.MAX_POLICE_REPORTS

    await Promise.all([
      supabase.from('team_status').upsert(
        {
          team,
          week_label: week,
          police_reports_count: count,
          police_check_passed: passed,
          updated_at: utcNow(),
        },
        { onConflict: 'team, week_label' },
      ),
      supabase
        .from('weekly_summary')
        .update({ police_confirmed: passed, police_reports: count })
        .eq('team', team)
        .eq('week_label', week),
    ])
  }

  // =============================================
  // 37. AUTH & REGISTRATION
  // =============================================

  /**
   * Login: tries hashed password first, then plaintext (migration).
   * After successful plaintext login, migrates to hashed.
   */
  async function loginAgent(supabase: SupabaseDB, params: any) {
    if (!params.agentNo || !params.password) {
      return { success: false, error: 'Agent ID and password required' }
    }

    const { data: agent } = await supabase
      .from('agents')
      .select('agent_no, name, team, password, password_hash')
      .eq('agent_no', params.agentNo)
    .limit(1)
    .single()

    if (!agent) return { success: false, error: 'Invalid Agent ID or Password' }

    const inputHash = await hashPassword(params.password)
    let authenticated = false

    if (agent.password_hash && agent.password_hash === inputHash) {
      authenticated = true
    } else if (agent.password && agent.password === params.password) {
      // Legacy plaintext match — migrate to hashed
      authenticated = true
      await supabase
        .from('agents')
        .update({ password_hash: inputHash, password: null })
        .eq('agent_no', params.agentNo)
    }

    if (!authenticated) {
      return { success: false, error: 'Invalid Agent ID or Password' }
    }

    return {
      success: true,
      agent: {
        agentNo: agent.agent_no,
        name: agent.name,
        team: agent.team,
      },
    }
  }

  async function updatePassword(supabase: SupabaseDB, params: any) {
    if (!params.agentNo || !params.oldPassword || !params.newPassword) {
      return { success: false, error: 'All fields required' }
    }
    if (params.newPassword.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters' }
    }

    // Verify current password
    const { data: agent } = await supabase
      .from('agents')
      .select('password, password_hash')
      .eq('agent_no', params.agentNo)
    .limit(1)
    .single()

    if (!agent) return { success: false, error: 'Agent not found' }

    const oldHash = await hashPassword(params.oldPassword)
    const oldMatch =
      (agent.password_hash && agent.password_hash === oldHash) ||
      (agent.password && agent.password === params.oldPassword)

    if (!oldMatch) {
      return { success: false, error: 'Current password is incorrect' }
    }

    const newHash = await hashPassword(params.newPassword)
    const { error } = await supabase
      .from('agents')
      .update({ password_hash: newHash, password: null })
      .eq('agent_no', params.agentNo)

    return error
      ? { success: false, error: 'Failed to update password' }
      : { success: true, message: 'Password updated successfully' }
  }

  async function registerAgent(supabase: SupabaseDB, params: any) {
    const {
      name,
      instagram,
      lastFmUsername,
      lastFmUsernames,
      password,
      teamPreference,
    } = params

    if (!name?.trim()) return { success: false, error: 'Name is required' }
    if (!instagram?.trim()) return { success: false, error: 'Instagram handle is required' }
    if (!password || password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters' }
    }

    const cleanName = name.trim()
    const cleanIG = instagram.trim().replace(/@/g, '').toLowerCase()

    // Check Instagram uniqueness
    const { data: existingIG } = await supabase
      .from('agents')
      .select('agent_no')
      .eq('instagram_handle', cleanIG)
      .maybeSingle()

    if (existingIG) {
      return { success: false, error: 'This Instagram handle is already registered!' }
    }

    // Clean Last.fm usernames
    const lfmUsernames: string[] = []
    if (lastFmUsernames && Array.isArray(lastFmUsernames)) {
      for (const u of lastFmUsernames) {
        const cleaned = cleanLastFmUsername(u)
        if (cleaned) lfmUsernames.push(cleaned)
      }
    } else if (lastFmUsername) {
      const cleaned = cleanLastFmUsername(lastFmUsername)
      if (cleaned) lfmUsernames.push(cleaned)
    }

    if (lfmUsernames.length === 0) {
      return { success: false, error: 'At least one Last.fm username is required' }
    }

    // Validate Last.fm user exists
    const LASTFM_KEY = Deno.env.get('LASTFM_API_KEY')
    if (LASTFM_KEY) {
      try {
        const checkUrl =
          `https://ws.audioscrobbler.com/2.0/?method=user.getinfo` +
          `&user=${encodeURIComponent(lfmUsernames[0])}&api_key=${LASTFM_KEY}&format=json`
        const res = await fetch(checkUrl)
        const data = await res.json()
        if (data.error) {
          return {
            success: false,
            error: `Last.fm user "${lfmUsernames[0]}" not found. Check the username.`,
          }
        }
      } catch (_e) {
        // Skip validation if API fails — don't block registration
      }
    }

    // Team assignment with balance cap
    const { data: teamCounts } = await supabase
      .from('agents')
      .select('team')
      .eq('status', 'active')

    const counts: Record<string, number> = {}
    TEAMS.forEach((t) => { counts[t] = 0 })
    teamCounts?.forEach((a: any) => {
      if (counts[a.team] !== undefined) counts[a.team]++
    })

    let assignedTeam: string

    if (teamPreference && TEAMS.includes(teamPreference as any)) {
      // Allow preference only if team isn't significantly larger than average
      const avg =
        Object.values(counts).reduce((a, b) => a + b, 0) / TEAMS.length
      if (counts[teamPreference] <= avg + 2) {
        assignedTeam = teamPreference
      } else {
        // Fallback to smallest team
        assignedTeam = TEAMS.reduce((min, t) =>
          counts[t] < counts[min] ? t : min,
        )
      }
    } else {
      assignedTeam = TEAMS.reduce((min, t) =>
        counts[t] < counts[min] ? t : min,
      )
    }

    // Generate agent number with retry (prevents race condition)
    const passwordHash = await hashPassword(password)
    let agentNo = ''
    let inserted = false

    for (let attempt = 0; attempt < 5; attempt++) {
      const { data: lastAgent } = await supabase
        .from('agents')
        .select('agent_no')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      let nextNum = 1
      if (lastAgent?.agent_no) {
        const match = lastAgent.agent_no.match(/(\d+)$/)
        if (match) nextNum = parseInt(match[1]) + 1 + attempt
      }
      agentNo = `AGENT${String(nextNum).padStart(3, '0')}`

      const { error: insertErr } = await supabase.from('agents').insert({
        agent_no: agentNo,
        name: cleanName,
        team: assignedTeam,
        password_hash: passwordHash,
        password: null,
        instagram_handle: cleanIG,
        last_fm_username: lfmUsernames[0],
        last_fm_usernames: lfmUsernames,
        status: 'active',
      })

      if (!insertErr) {
        inserted = true
        break
      }

      // If duplicate key error, retry with next number
      if (
        !insertErr.message.includes('unique') &&
        !insertErr.message.includes('duplicate')
      ) {
        return { success: false, error: 'Registration failed: ' + insertErr.message }
      }
    }

    if (!inserted) {
      return { success: false, error: 'Registration failed: could not generate unique agent number. Please try again.' }
    }

    await broadcastActivity(
      supabase,
      'new_agent',
      {
        agentNo,
        name: cleanName,
        team: assignedTeam,
        message: `${cleanName} has joined ${assignedTeam}! 💜`,
      },
      agentNo,
    )

    return {
      success: true,
      message: `Welcome, ${cleanName}! You are ${agentNo} on ${assignedTeam}!`,
      agent: { agentNo, name: cleanName, team: assignedTeam },
    }
  }

  async function deleteAccount(supabase: SupabaseDB, params: any) {
    if (!params.agentNo || !params.password) {
      return { success: false, error: 'Agent ID and password required' }
    }

    // Verify password
    const { data: agent } = await supabase
      .from('agents')
      .select('id, agent_no, team, password, password_hash')
      .eq('agent_no', params.agentNo)
    .limit(1)
    .single()

    if (!agent) return { success: false, error: 'Agent not found' }

    const inputHash = await hashPassword(params.password)
    const authenticated =
      (agent.password_hash && agent.password_hash === inputHash) ||
      (agent.password && agent.password === params.password)

    if (!authenticated) return { success: false, error: 'Invalid password' }

    try {
      // Delete from agent_id tables
      await Promise.all([
        supabase.from('weekly_member_stats').delete().eq('agent_id', agent.id),
        supabase.from('member_scrobble_details').delete().eq('agent_id', agent.id),
      ])

      // Delete from agent_no tables (comprehensive list)
      const agentNoTables = [
        'live_rankings', 'streaks', 'badges', 'leave_requests',
        'monthly_leave_usage', 'sotd_answers', 'chat_messages',
        'online_users', 'side_mission_daily', 'album_2x_daily',
        'attendance_submissions', 'activity_feed',
      ]

      await Promise.all(
        agentNoTables.map((tbl) =>
          supabase.from(tbl).delete().eq('agent_no', agent.agent_no),
        ),
      )

      // Update police reports (anonymize, don't delete)
      await supabase
        .from('police_reports')
        .update({ reporter_agent_no: 'DELETED' })
        .eq('reporter_agent_no', agent.agent_no)

      // Delete agent
      const { error: delErr } = await supabase
        .from('agents')
        .delete()
        .eq('id', agent.id)

      if (delErr) return { success: false, error: 'Deletion failed: ' + delErr.message }

      // Re-aggregate
      try {
        await supabase.rpc('run_all_aggregations', {
          target_week: getCurrentWeekLabel(),
        })
      } catch (_e) {
        /* non-critical */
      }

      await broadcastActivity(
        supabase,
        'agent_retired',
        { team: agent.team, message: 'An agent has retired from the mission' },
        'SYSTEM',
      )

      return { success: true, message: 'Agent retired successfully' }
    } catch (e: any) {
      return { success: false, error: 'Deletion error: ' + e.message }
    }
  }

  // =============================================
  // 38. MAIN HANDLER — Deno.serve()
  //
  // Dispatch table with auth levels.
  // =============================================

  type RouteHandler = (
    supabase: SupabaseDB,
    params: Record<string, any>,
    week: string,
  ) => Promise<any>

  interface Route {
    handler: RouteHandler
    auth: 'public' | 'agent' | 'admin' | 'syncAdmin'
    /** HTTP status for errors (default 200 for backward compat) */
    errorStatus?: number
  }

  function buildRoutes(): Record<string, Route> {
    return {
      // ── CORE ───────────────────────────────────────
      getCurrentWeek: {
        auth: 'public',
        handler: async () => ({
          success: true,
          week: getCurrentWeekLabel(),
          timestamp: utcNow(),
          kstDate: getKSTDateString(),
          battleStart: CONFIG.BATTLE_START,
          battleEnd: CONFIG.BATTLE_END,
        }),
      },
      getAvailableWeeks: {
        auth: 'public',
        handler: async (sb) => getAvailableWeeks(sb),
      },
      getAllAgents: {
        auth: 'public',
        handler: async (sb) => getAllAgents(sb),
      },
      getAgentByInstagram: {
        auth: 'public',
        handler: async (sb, p) => getAgentByInstagram(sb, p.instagram),
      },
      checkInstagramAvailable: {
        auth: 'public',
        handler: async (sb, p) => {
          if (!p.instagram) return { success: true, available: false }
          const clean = p.instagram.trim().replace(/@/g, '').toLowerCase()
          const { data } = await sb
            .from('agents')
            .select('agent_no')
            .eq('instagram_handle', clean)
            .maybeSingle()
          return { success: true, available: !data, instagram: clean }
        },
      },
      checkLastFmValid: {
        auth: 'public',
        handler: async (_sb, p) => {
          if (!p.username) return { success: false, valid: false }
          const cleaned = cleanLastFmUsername(p.username)
          const key = Deno.env.get('LASTFM_API_KEY')
          if (!key || !cleaned) return { success: true, valid: !!cleaned, username: cleaned }
          try {
            const res = await fetch(
              `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${encodeURIComponent(cleaned)}&api_key=${key}&format=json`,
            )
            const data = await res.json()
            return {
              success: true,
              valid: !data.error,
              username: cleaned,
              displayName: data.user?.realname || cleaned,
              playcount: data.user?.playcount,
            }
          } catch (_e) {
            // Network error → unknown, not "valid"
            return { success: true, valid: null, username: cleaned, note: 'Could not verify — Last.fm API unavailable' }
          }
        },
      },
      getTeamSizes: {
        auth: 'public',
        handler: async (sb) => {
          const { data } = await sb.from('agents').select('team').eq('status', 'active')
          const counts: Record<string, number> = {}
          TEAMS.forEach((t) => { counts[t] = 0 })
          data?.forEach((a: any) => { if (counts[a.team] !== undefined) counts[a.team]++ })
          return {
            success: true,
            teams: Object.entries(counts).map(([team, count]) => ({
              team,
              count,
              pfp: TEAM_PFPS[team],
            })),
          }
        },
      },

      // ── AUTH ────────────────────────────────────────
      registerAgent: {
        auth: 'public',
        handler: async (sb, p) => registerAgent(sb, p),
      },
      loginAgent: {
        auth: 'public',
        handler: async (sb, p) => loginAgent(sb, p),
      },
      updatePassword: {
        auth: 'agent',
        handler: async (sb, p) => updatePassword(sb, p),
      },
      deleteAccount: {
        auth: 'agent',
        handler: async (sb, p) => deleteAccount(sb, p),
      },
      verifyAdmin: {
        auth: 'public',
        handler: async (sb, p) => verifyAdmin(sb, p),
      },
      savePushSubscription: {
        auth: 'agent',
        handler: async (sb, p) => {
          const { agentNo, subscription } = p
          if (!subscription) return { success: false, error: 'Subscription object required' }
          const { error } = await sb
            .from('push_subscriptions')
            .upsert({
              agent_no: agentNo,
              subscription,
              updated_at: new Date().toISOString()
            }, { onConflict: 'agent_no' })
          return error ? { success: false, error: error.message } : { success: true }
        },
      },

      // ── DASHBOARD ──────────────────────────────────
      getDashboardData: {
        auth: 'agent',
        handler: async (sb, p, w) => getDashboardData(sb, p.agentNo, w),
      },
      getAgentData: {
        auth: 'agent',
        handler: async (sb, p, w) => getAgentData(sb, p.agentNo, w),
      },
      getAllWeeksStats: {
        auth: 'agent',
        handler: async (sb, p) => getAllWeeksStats(sb, p.agentNo),
      },
      refreshAgentStats: {
        auth: 'agent',
        handler: async (sb, p, w) => handleRefreshWithCooldown(sb, p.agentNo, w, p),
      },

      // ── SYNC (admin) ───────────────────────────────
      initiateFairSync: {
        auth: 'syncAdmin',
        handler: async (sb, p, w) => initiateFairSync(sb, w, p.adminKey),
      },
      runHourlySync: {
        auth: 'syncAdmin',
        handler: async (sb, p, w) => initiateFairSync(sb, w, p.adminKey),
      },
      triggerFullSync: {
        auth: 'syncAdmin',
        handler: async (sb, p, w) => initiateFairSync(sb, w, p.adminKey),
      },
      getFairSyncStatus: {
        auth: 'public',
        handler: async (sb, p) => getFairSyncStatus(sb, p.sessionId),
      },
      runQuickFairSync: {
        auth: 'syncAdmin',
        handler: async (sb, p, w) => runQuickFairSync(sb, w, p.adminKey),
      },
      getSyncStatus: {
        auth: 'public',
        handler: async (sb) => getSyncStatus(sb),
      },
      initiateFairSyncShard: {
        auth: 'syncAdmin',
        handler: async (sb, p, w) =>
          syncAgentShard(
            sb,
            p.week || w,
            parseInt(p.shard) || 0,
            parseInt(p.totalShards) || 5,
            p.runAggregation === 'true',
          ),
      },
      runAggregationOnly: {
        auth: 'syncAdmin',
        handler: async (sb, p, w) => {
          const targetWeek = p.week || w;
          try {
            // 1. ✅ AUTO-BADGE TRIGGER: Current Week
            console.log(`[AUTO-BADGES] Evaluating Side Missions for ${targetWeek}...`);
            await checkAllTeamsSurvival(sb, targetWeek, p.adminKey);

            // 2. ✅ AUTO-BADGE TRIGGER: Previous Week (CRITICAL FOR UNLOCKING BADGES)
            const prevWeek = getPreviousWeekLabel(targetWeek);
            if (prevWeek) {
              console.log(`[AUTO-BADGES] Evaluating Side Missions for PREVIOUS week: ${prevWeek}...`);
              await checkAllTeamsSurvival(sb, prevWeek, p.adminKey);
            }

            // 3. Run the SQL aggregations for the current week
            await sb.rpc('run_all_aggregations', { target_week: targetWeek });
            
            // 4. Run SQL aggregation for the previous week to ensure XP/levels are perfectly locked in
            if (prevWeek) {
              await sb.rpc('run_all_aggregations', { target_week: prevWeek });
            }

            return { success: true, message: `Aggregations and Badges completed for ${targetWeek} (and ${prevWeek})` }
          } catch (e: any) {
            return { success: false, error: e.message }
          }
        },
      },

      // ── DEBUG ──────────────────────────────────────
      debugWeekAndGoals: {
        auth: 'public',
        handler: async (sb, _p, w) => debugWeekAndGoals(sb, w),
      },

      // ── RANKINGS ───────────────────────────────────
      getRankings: {
        auth: 'public',
        handler: async (sb, p, w) => getRankings(sb, w, parseInt(p.limit) || 100),
      },
      getTeamRankings: {
        auth: 'public',
        handler: async (sb, p, w) => getTeamRankings(sb, p.team, w),
      },

      // ── TEAM DATA ──────────────────────────────────
      getTeamData: {
        auth: 'public',
        handler: async (sb, p, w) => getTeamData(sb, p.team, w),
      },
      getTeamMembers: {
        auth: 'public',
        handler: async (sb, p, w) => getTeamMembers(sb, p.team, w),
      },
      getTeamComparison: {
        auth: 'public',
        handler: async (sb, _p, w) => getTeamComparison(sb, w),
      },
      getWeeklySummary: {
        auth: 'public',
        handler: async (sb, _p, w) => getWeeklySummary(sb, w),
      },
      getGoalsProgress: {
        auth: 'public',
        handler: async (sb, _p, w) => getGoalsProgress(sb, w),
      },
      getAlbum2xStatus: {
        auth: 'public',
        handler: async (sb, p, w) => getAlbum2xStatus(sb, w, p.team, p.agentNo),
      },
      getAlbumChallengeSettings: {
        auth: 'public',
        handler: async () => ({
          success: true,
          albumName: 'Arirang',
          dailyRequired: CONFIG.ALBUM_2X_DAILY_REQ,
          tracks: ARIRANG_TRACKS,
          unitRequired: CONFIG.ARIRANG_UNIT_REQ,
          sideMissionWeeklyReq: CONFIG.SIDE_MISSION_WEEKLY_REQ,
          sideMissionMinDaily: CONFIG.SIDE_MISSION_MIN_DAILY,
        }),
      },

      // ── ARIRANG UNIT ───────────────────────────────
      getArirangUnit: {
        auth: 'public',
        handler: async (sb, p, w) => getArirangUnit(sb, p.team, w),
      },
      generateUnitRotation: {
        auth: 'syncAdmin',
        handler: async (sb, p, w) => generateUnitRotation(sb, p.week || w, p.adminKey),
      },
      getUnitRotationOverview: {
        auth: 'public',
        handler: async (sb, _p, w) => getUnitRotationOverview(sb, w),
      },

      // ── SIDE MISSIONS ──────────────────────────────
      getSideMissionStatus: {
        auth: 'agent',
        handler: async (sb, p, w) => getSideMissionStatus(sb, p.agentNo, w),
      },
      getSideMissionTeamStatus: {
        auth: 'public',
        handler: async (sb, p, w) => getSideMissionTeamStatus(sb, p.week || w, p.team),
      },
      checkTeamSurvival: {
        auth: 'syncAdmin',
        handler: async (sb, p, w) => checkTeamSurvival(sb, p.team, p.week || w),
      },
      checkAllTeamsSurvival: {
        auth: 'syncAdmin',
        handler: async (sb, p, w) => checkAllTeamsSurvival(sb, p.week || w, p.adminKey),
      },
      getTeamAliveStatus: {
        auth: 'public',
        handler: async (sb, _p, w) => {
          const { data } = await sb.from('team_status').select('*').eq('week_label', w)
          const map: Record<string, any> = {}
          TEAMS.forEach((t) => { map[t] = { isAlive: true, sideMissionPassed: false } })
          data?.forEach((s: any) => {
            map[s.team] = {
              isAlive: s.is_alive,
              sideMissionPassed: s.side_mission_passed,
              membersPassed: s.members_passed,
              membersFailed: s.members_failed,
              membersTotal: s.members_total,
            }
          })
          return { success: true, week: w, teams: map }
        },
      },

      // ── GLOBAL GOAL ────────────────────────────────
      getGlobalArirangGoal: {
        auth: 'public',
        handler: async (sb) => getGlobalArirangGoal(sb),
      },
      setGlobalArirangTarget: {
        auth: 'syncAdmin',
        handler: async (sb, p) => setGlobalArirangTarget(sb, parseInt(p.target), p.adminKey),
      },

      // ── ANNOUNCEMENTS & PLAYLISTS ──────────────────
      getAnnouncements: {
        auth: 'public',
        handler: async (sb, _p, w) => getAnnouncements(sb, w),
      },
      addAnnouncement: {
        auth: 'public', // password-protected inside
        handler: async (sb, p) => addAnnouncement(sb, p),
      },
      getPlaylists: {
        auth: 'public',
        handler: async (sb, _p, w) => getPlaylists(sb, w),
      },
      addPlaylist: {
        auth: 'public', // password-protected inside
        handler: async (sb, p) => addPlaylist(sb, p),
      },

      // ── LEAVE ──────────────────────────────────────
      applyLeave: {
        auth: 'agent',
        handler: async (sb, p, w) => applyLeave(sb, p.agentNo, w),
      },
      cancelLeave: {
        auth: 'agent',
        handler: async (sb, p, w) => cancelLeave(sb, p.agentNo, w),
      },
      getAgentsOnLeave: {
        auth: 'public',
        handler: async (sb, _p, w) => getAgentsOnLeave(sb, w),
      },

      // ── SECRET MISSIONS ────────────────────────────
      getTeamMissions: {
        auth: 'public',
        handler: async (sb, p, w) => getTeamMissions(sb, w, p.status),
      },
      submitArmyVote: {
        auth: 'agent',
        handler: async (sb, p) => submitArmyVote(sb, p),
      },
      getTeamSecretMissions: {
        auth: 'agent',
        handler: async (sb, p, w) => getTeamSecretMissions(sb, p.team, p.agentNo, w),
      },
      getTeamSecretStats: {
        auth: 'public',
        handler: async (sb, _p, w) => getTeamSecretStats(sb, w),
      },
      createTeamMission: {
        auth: 'admin',
        handler: async (sb, p) => createTeamMission(sb, p),
      },
      completeTeamMission: {
        auth: 'admin',
        handler: async (sb, p) => completeTeamMission(sb, p),
      },
      completeMission: {
        auth: 'admin',
        handler: async (sb, p) => completeTeamMission(sb, p),
      },
      failTeamMission: {
        auth: 'admin',
        handler: async (sb, p) => failTeamMission(sb, p),
      },
      cancelTeamMission: {
        auth: 'admin',
        handler: async (sb, p) => cancelTeamMission(sb, p),
      },
      getMissionHistory: {
        auth: 'public',
        handler: async (sb, p) => getMissionHistory(sb, p.team, parseInt(p.limit) || 20),
      },

      // ── SONG OF THE DAY ────────────────────────────
      getSongOfDay: {
        auth: 'public',
        handler: async (sb) => getSongOfDay(sb),
      },
      setSongOfDay: {
        auth: 'admin',
        handler: async (sb, p) => setSongOfDay(sb, p),
      },
      submitSongAnswer: {
        auth: 'agent',
        handler: async (sb, p) => submitSongAnswer(sb, p),
      },
      getSOTDDailyResults: {
        auth: 'public',
        handler: async (sb, p) => getSOTDDailyResults(sb, p.date),
      },
      getSOTDHistory: {
        auth: 'public',
        handler: async (sb, p) => getSOTDHistory(sb, parseInt(p.limit) || 7),
      },
      getLatestSOTDResult: {
        auth: 'public',
        handler: async (sb) => getLatestSOTDResult(sb),
      },
      finalizeSOTD: {
        auth: 'admin',
        handler: async (sb) => finalizeSOTD(sb),
      },

      // ── STREAKS ────────────────────────────────────
      getStreakData: {
        auth: 'agent',
        handler: async (sb, p) => getStreakData(sb, p.agentNo),
      },
      checkStreak: {
        auth: 'agent',
        handler: async (sb, p, w) => checkStreak(sb, p.agentNo, w),
      },
      updateStreak: {
        auth: 'admin', // was public — now requires admin
        handler: async (sb, p) => updateStreak(sb, p.agentNo, p.streak),
      },
      useStreakFreeze: {
        auth: 'agent',
        handler: async (sb, p) => useStreakFreeze(sb, p.agentNo),
      },

      // ── CHAT ───────────────────────────────────────
      getChatMessages: {
        auth: 'public',
        handler: async (sb, p) => getChatMessages(sb, parseInt(p.limit) || 50),
      },
      sendChatMessage: {
        auth: 'agent',
        handler: async (sb, p) => sendChatMessage(sb, p),
      },
      markChatAsRead: {
        auth: 'agent',
        handler: async () => ({ success: true }),
      },
      hasUnreadMessages: {
        auth: 'agent',
        handler: async () => ({ success: true, hasUnread: false, count: 0 }),
      },

      // ── ONLINE ─────────────────────────────────────
      heartbeat: {
        auth: 'agent',
        handler: async (sb, p) => recordHeartbeat(sb, p),
      },
      getOnlineCount: {
        auth: 'public',
        handler: async (sb) => getOnlineCount(sb),
      },
      removeOnlineUser: {
        auth: 'agent',
        handler: async (sb, p) => removeOnlineUser(sb, p.agentNo),
      },
      cleanupOnlineUsers: {
        auth: 'public',
        handler: async (sb) => {
          const cutoff = new Date(Date.now() - 120000).toISOString()
          const { count } = await sb
            .from('online_users')
            .delete({ count: 'exact' })
            .lt('last_seen', cutoff)
          return { success: true, removed: count || 0 }
        },
      },

      // ── BADGES & CHARTS ────────────────────────────
      getBadges: {
        auth: 'agent',
        handler: async (sb, p) => getBadges(sb, p.agentNo),
      },
      getAgentChartData: {
        auth: 'agent',
        handler: async (sb, p) => getAgentChartData(sb, p.agentNo),
      },
      getTeamChartData: {
        auth: 'public',
        handler: async (sb, p) => getTeamChartData(sb, p.team),
      },

      // ── ACTIVITY FEED ──────────────────────────────
      getActivityFeed: {
        auth: 'public',
        handler: async (sb, p) => getActivityFeed(sb, parseInt(p.limit) || 20, p.since),
      },
      broadcastActivity: {
        auth: 'admin', // was public — now requires admin
        handler: async (sb, p) => broadcastActivity(sb, p.type, p.data, p.agentNo),
      },
      deleteActivity: {
        auth: 'admin',
        handler: async (sb, p) => {
          const { error } = await sb.from('activity_feed').delete().eq('id', p.activityId)
          return { success: !error, error: error?.message }
        },
      },
      getOperativeDatabase: {
        auth: 'public',
        handler: async (sb, p, w) => getOperativeDatabase(sb, p.week || w),
      },
      getAgentCareerStats: {
        auth: 'agent',
        handler: async (sb, p) => getAgentCareerStats(sb, p.agentNo),
      },
      adminTriggerSync: {
        auth: 'syncAdmin',
        handler: async (sb, p, w) => initiateFairSync(sb, w, p.adminKey),
      },
      adminCheckSync: {
        auth: 'syncAdmin',
        handler: async (sb) => getSyncStatus(sb),
      },
      adminFinalizeWeek: {
        auth: 'syncAdmin',
        handler: async (sb, p, w) => {
          const targetWeek = p.week || w;
          
          // 1. Run the TypeScript survival checks FIRST (This unlocks the badges!)
          const survivalRes = await checkAllTeamsSurvival(sb, targetWeek, p.adminKey);
          if (!survivalRes.success) return survivalRes;

          // 2. Then run the RPC to lock the week
          const { data, error } = await sb.rpc('finalize_week', { 
            target_week: targetWeek, 
            admin_key: p.adminKey 
          });
          
          return error 
            ? { success: false, error: error.message } 
            : { success: true, survival: survivalRes, rpc: data };
        },
      },
      adminGenerateUnits: {
        auth: 'syncAdmin',
        handler: async (sb, p, w) => generateUnitRotation(sb, p.week || w, p.adminKey),
      },
      useEmergencySave: {
        auth: 'public', // Internal key verified inside function
        handler: async (sb, p) => useEmergencySave(sb, p),
      },
      getTeamBadgeHolders: {
        auth: 'agent',
        handler: async (sb, p) => getTeamBadgeHolders(sb, p.team, p.week),
      },
      getRescueSuggestions: {
        auth: 'agent',
        handler: async (sb, p) => getRescueSuggestions(sb, p.team, p.date, p.week),
      },

      // ── ADMIN ──────────────────────────────────────
      confirmTeamAttendance: {
        auth: 'admin',
        handler: async (sb, p) =>
          updateTeamStatus(sb, {
            ...p,
            field: 'attendanceConfirmed',
            value: p.confirmed === 'true' || p.confirmed === true,
            adminSession: p.sessionToken,
          }),
      },
      confirmTeamPolice: {
        auth: 'admin',
        handler: async (sb, p) =>
          updateTeamStatus(sb, {
            ...p,
            field: 'policeConfirmed',
            value: p.confirmed === 'true' || p.confirmed === true,
            adminSession: p.sessionToken,
          }),
      },
      updateTeamStatus: {
        auth: 'admin',
        handler: async (sb, p) =>
          updateTeamStatus(sb, {
            ...p,
            adminSession: p.sessionToken ?? p.adminSession,
          }),
      },
      toggleResultsRelease: {
        auth: 'admin',
        handler: async (sb, p) => toggleResultsRelease(sb, p),
      },
      getWeeklyWinners: {
        auth: 'public',
        handler: async (sb) => getWeeklyWinners(sb),
      },

      // ── ATTENDANCE ─────────────────────────────────
      submitAttendance: {
        auth: 'agent',
        handler: async (sb, p, w) => {
          if (!p.agentNo) return { success: false, error: 'Agent number required' }
          const { error } = await sb.from('attendance_submissions').upsert(
            {
              agent_no: p.agentNo,
              week_label: w,
              submitted: true,
              screenshot_url: p.screenshotUrl || null,
              submitted_at: utcNow(),
            },
            { onConflict: 'agent_no, week_label' },
          )
          if (error) return { success: false, error: error.message }
          const { data: ag } = await sb.from('agents').select('team').eq('agent_no', p.agentNo).limit(1).single()
          if (ag) await updateTeamAttendance(sb, ag.team, w)
          return { success: true, message: 'Attendance submitted! 📸' }
        },
      },
      getAttendanceStatus: {
        auth: 'public',
        handler: async (sb, p, w) => {
          const team = p.team
          const week = p.week || w
          const [membersRes, subsRes] = await Promise.all([
            sb.from('agents').select('agent_no, name').eq('team', team).eq('status', 'active'),
            sb.from('attendance_submissions').select('*').eq('week_label', week),
          ])
          const subMap = new Map(
            (subsRes.data || []).map((s: any) => [s.agent_no, s]),
          )
          const members = (membersRes.data || []).map((m: any) => ({
            agentNo: m.agent_no,
            name: m.name,
            submitted: subMap.has(m.agent_no),
            submittedAt: subMap.get(m.agent_no)?.submitted_at,
            verified: !!subMap.get(m.agent_no)?.verified_at,
          }))
          const sc = members.filter((m) => m.submitted).length
          const tc = members.length
          const pct = tc > 0 ? Math.round((sc / tc) * 100) : 0
          return { success: true, team, week, submitted: sc, total: tc, percentage: pct, isComplete: pct === 100, members }
        },
      },
      verifyAttendance: {
        auth: 'admin',
        handler: async (sb, p, w) => {
          const { error } = await sb
            .from('attendance_submissions')
            .update({ verified_by: p.agentNo, verified_at: utcNow() })
            .eq('agent_no', p.targetAgentNo)
            .eq('week_label', p.week || w)
          return { success: !error, error: error?.message }
        },
      },

      // ── POLICE REPORTS ─────────────────────────────
      submitPoliceReport: {
        auth: 'agent',
        handler: async (sb, p, w) => {
          const { reporterAgentNo, reportedAgentNo, violationType, evidenceUrl, description } = p
          if (!reporterAgentNo || !reportedAgentNo || !violationType) {
            return { success: false, error: 'Missing required fields' }
          }
          const [reporterRes, reportedRes] = await Promise.all([
            sb.from('agents').select('team').eq('agent_no', reporterAgentNo).limit(1).single(),
            sb.from('agents').select('team').eq('agent_no', reportedAgentNo).limit(1).single(),
          ])
          if (!reporterRes.data || !reportedRes.data) return { success: false, error: 'Agent not found' }
          if (reporterRes.data.team === reportedRes.data.team) {
            return { success: false, error: 'Cannot report your own team members' }
          }

          // Rate limit: max 5 reports per agent per week
          const { data: existingReports } = await sb
            .from('police_reports')
            .select('id')
            .eq('reporter_agent_no', reporterAgentNo)
            .eq('week_label', w)

          if ((existingReports?.length || 0) >= 5) {
            return { success: false, error: 'Maximum 5 reports per week' }
          }

          const reportId = `PR-${Date.now()}-${generateSecureToken().slice(0, 4)}`.toUpperCase()
          const { error } = await sb.from('police_reports').insert({
            report_id: reportId,
            week_label: w,
            reported_agent_no: reportedAgentNo,
            reported_team: reportedRes.data.team,
            reporter_agent_no: reporterAgentNo,
            reporter_team: reporterRes.data.team,
            violation_type: violationType,
            evidence_url: evidenceUrl,
            description,
            status: 'pending',
          })
          if (error) return { success: false, error: error.message }
          await updateTeamPoliceReports(sb, reportedRes.data.team, w)
          return { success: true, reportId, message: 'Report submitted for review' }
        },
      },
      getPoliceReports: {
        auth: 'public',
        handler: async (sb, p, w) => {
          let q = sb.from('police_reports').select('*').eq('week_label', p.week || w).order('created_at', { ascending: false })
          if (p.team) q = q.eq('reported_team', p.team)
          const { data } = await q
          return {
            success: true,
            reports: (data || []).map((r: any) => ({
              reportId: r.report_id, reportedAgent: r.reported_agent_no,
              reportedTeam: r.reported_team, reporterTeam: r.reporter_team,
              violationType: r.violation_type, evidenceUrl: r.evidence_url,
              description: r.description, status: r.status,
              createdAt: r.created_at, reviewedBy: r.reviewed_by,
            })),
            totalReports: data?.length || 0,
          }
        },
      },
      reviewPoliceReport: {
        auth: 'admin',
        handler: async (sb, p) => {
          if (!['confirmed', 'dismissed'].includes(p.status)) {
            return { success: false, error: 'Invalid status' }
          }
          const { data: rpt } = await sb.from('police_reports').select('reported_team, week_label').eq('report_id', p.reportId).single()
          if (!rpt) return { success: false, error: 'Report not found' }
          await sb.from('police_reports').update({ status: p.status, reviewed_by: p.agentNo, reviewed_at: utcNow() }).eq('report_id', p.reportId)
          await updateTeamPoliceReports(sb, rpt.reported_team, rpt.week_label)
          return { success: true, message: `Report ${p.status}` }
        },
      },
      getTeamPoliceStatus: {
        auth: 'public',
        handler: async (sb, p, w) => {
          const { data } = await sb.from('police_reports').select('id').eq('reported_team', p.team).eq('week_label', p.week || w).eq('status', 'confirmed')
          const cnt = data?.length || 0
          return { success: true, team: p.team, confirmedReports: cnt, maxAllowed: CONFIG.MAX_POLICE_REPORTS, passed: cnt <= CONFIG.MAX_POLICE_REPORTS }
        },
      },

      // ── WARNINGS & DISSOLUTION ─────────────────────
      getTeamWarnings: {
        auth: 'public',
        handler: async (sb) => {
          const { data } = await sb.from('team_warnings').select('*').order('created_at', { ascending: false })
          const active = (data || []).filter((w: any) => w.status === 'active')
          return {
            success: true,
            warnings: (data || []).map((w: any) => ({
              team: w.team, warningWeek: w.warning_week, recoveryWeek: w.recovery_week,
              daysRequired: w.recovery_days_required, daysAchieved: w.recovery_days_achieved,
              status: w.status, issuedAt: w.warning_issued_at, resolvedAt: w.resolved_at,
            })),
            activeWarnings: active.length,
            teamsAtRisk: active.map((w: any) => w.team),
          }
        },
      },
      getTeamWarningStatus: {
        auth: 'public',
        handler: async (sb, p) => {
          if (!p.team) return { success: false, error: 'Team required' }
          const { data } = await sb.from('team_warnings').select('*').eq('team', p.team).eq('status', 'active').maybeSingle()
          if (!data) return { success: true, hasWarning: false, team: p.team, status: 'safe' }
          return {
            success: true, hasWarning: true, team: p.team, status: 'at_risk',
            warning: { warningWeek: data.warning_week, recoveryWeek: data.recovery_week, daysRequired: data.recovery_days_required, daysAchieved: data.recovery_days_achieved || 0 },
          }
        },
      },
      checkTeamRecovery: {
        auth: 'public',
        handler: async (sb, p, w) => {
          const { data, error } = await sb.rpc('check_team_recovery', { target_team: p.team, current_week: p.week || w })
          return error ? { success: false, error: error.message } : data
        },
      },
      getRedistributionLog: {
        auth: 'public',
        handler: async (sb, p) => {
          const { data } = await sb.from('redistribution_log').select('*').order('redistributed_at', { ascending: false }).limit(parseInt(p.limit) || 50)
          return { success: true, log: (data || []).map((r: any) => ({ agentNo: r.agent_no, oldTeam: r.old_team, newTeam: r.new_team, reason: r.reason, week: r.week_label, date: r.redistributed_at })) }
        },
      },
      getDissolvedTeams: {
        auth: 'public',
        handler: async (sb) => {
          const { data } = await sb.from('team_warnings').select('*').eq('status', 'dissolved').order('resolved_at', { ascending: false })
          return { success: true, dissolved: (data || []).map((w: any) => ({ team: w.team, warningWeek: w.warning_week, dissolutionWeek: w.recovery_week, daysAchieved: w.recovery_days_achieved, resolvedAt: w.resolved_at })) }
        },
      },
      manualDissolveTeam: {
        auth: 'syncAdmin',
        handler: async (sb, p, w) => {
          if (!p.team) return { success: false, error: 'Team required' }
          const { data, error } = await sb.rpc('dissolve_and_redistribute', { target_team: p.team, dissolution_week: p.week || w })
          return error ? { success: false, error: error.message } : data
        },
      },

      // ── FINALIZE ───────────────────────────────────
      finalizeWeek: {
        auth: 'syncAdmin',
        handler: async (sb, p, w) => {
          const { data, error } = await sb.rpc('finalize_week', { target_week: p.week || w, admin_key: p.adminKey })
          return error ? { success: false, error: error.message } : data
        },
      },
      getWeekConfig: {
        auth: 'public',
        handler: async (sb) => {
          const { data } = await sb.from('week_config').select('*').order('start_date')
          return { success: true, weeks: (data || []).map((w: any) => ({ label: w.week_label, startDate: w.start_date, endDate: w.end_date, isActive: w.is_active })), currentWeek: getCurrentWeekLabel() }
        },
      },

      // ── BATTLE STATS ───────────────────────────────
      getBattleStats: {
        auth: 'public',
        handler: async (sb) => {
          const [summaryRes, tracksRes, albumsRes] = await Promise.all([
            sb.from('battle_summary').select('*').maybeSingle(),
            sb.from('battle_cumulative_totals').select('*').eq('target_type', 'track').order('total_streams', { ascending: false }),
            sb.from('battle_cumulative_totals').select('*').eq('target_type', 'album').order('total_streams', { ascending: false }),
          ])
          const s = summaryRes.data
          return {
            success: true,
            summary: { totalStreams: s?.total_streams || 0, totalAgents: s?.total_agents || 0, weeksCompleted: s?.total_weeks_completed || 0, topTrack: s?.top_track, topAlbum: s?.top_album, lastUpdated: s?.updated_at },
            tracks: (tracksRes.data || []).map((t: any) => ({ name: t.target_name, totalStreams: t.total_streams, peakWeek: t.peak_week })),
            albums: (albumsRes.data || []).map((a: any) => ({ name: a.target_name, totalStreams: a.total_streams, peakWeek: a.peak_week })),
          }
        },
      },
      refreshBattleStats: {
        auth: 'syncAdmin',
        handler: async (sb) => {
          for (const w of Object.keys(WEEK_START_DATES)) {
            try { await sb.rpc('update_battle_streaming_stats', { target_week: w }) }
            catch (_e) { /* continue */ }
          }
          return { success: true, message: 'Battle stats refreshed' }
        },
      },
      getWeeklyBattleStats: {
        auth: 'public',
        handler: async (sb, p, w) => {
          const week = p.week || w
          const { data } = await sb
            .from('battle_streaming_stats')
            .select('*')
            .eq('week_label', week)
            .order('total_streams', { ascending: false })

          const trackStats = (data || []).filter((s: any) => s.target_type === 'track')
          const albumStats = (data || []).filter((s: any) => s.target_type === 'album')
          const totalStreams = (data || []).reduce(
            (sum: number, s: any) => sum + (s.total_streams || 0), 0,
          )

          return {
            success: true,
            week,
            totalStreams,
            tracks: trackStats.map((t: any) => ({
              name: t.target_name,
              streams: t.total_streams,
              agents: t.contributing_agents,
            })),
            albums: albumStats.map((a: any) => ({
              name: a.target_name,
              streams: a.total_streams,
              agents: a.contributing_agents,
            })),
            lastUpdated: data?.[0]?.updated_at,
          }
        },
      },

      // ── POLICE DATA (password-protected) ───────────
      getPoliceData: {
        auth: 'public', // password checked inside
        handler: async (sb, p) => {
          const pw = Deno.env.get('POLICE_PASSWORD')
          if (!pw || p.password !== pw) return { success: false, error: 'Access Denied' }
          const week = p.week || getCurrentWeekLabel()
          const { from, to } = getWeekTimeRange(week)
          const { data: agents } = await sb.from('agents').select('agent_no, name, team, last_fm_username, last_fm_usernames').eq('status', 'active').order('team')
          const teams: Record<string, any[]> = {}
          TEAMS.forEach((t) => { teams[t] = [] })
          for (const a of agents || []) {
            const unames: string[] = []
            if (a.last_fm_usernames?.length > 0) { for (const u of a.last_fm_usernames) { const c = cleanLastFmUsername(u); if (c) unames.push(c) } }
            else if (a.last_fm_username) { const c = cleanLastFmUsername(a.last_fm_username); if (c) unames.push(c) }
            if (teams[a.team]) teams[a.team].push({ agentNo: a.agent_no, name: a.name, usernames: unames })
          }
          return { success: true, teams, weekRange: { fromDate: new Date(from * 1000).toISOString().slice(0, 10), toDate: new Date(to * 1000).toISOString().slice(0, 10) }, week }
        },
      },

      // ── ADMIN DELETE ───────────────────────────────
      adminDeleteAgent: {
        auth: 'syncAdmin',
        handler: async (sb, p) => {
          const { data: ag } = await sb.from('agents').select('id, agent_no, team').eq('agent_no', p.agentNo).limit(1).single()
          if (!ag) return { success: false, error: 'Agent not found' }
          // Reuse deleteAccount logic without password check
          await Promise.all([
            sb.from('weekly_member_stats').delete().eq('agent_id', ag.id),
            sb.from('member_scrobble_details').delete().eq('agent_id', ag.id),
          ])
          const tables = ['live_rankings', 'streaks', 'badges', 'leave_requests', 'monthly_leave_usage', 'sotd_answers', 'chat_messages', 'online_users', 'side_mission_daily', 'album_2x_daily', 'attendance_submissions', 'activity_feed']
          await Promise.all(tables.map((t) => sb.from(t).delete().eq('agent_no', ag.agent_no)))
          await sb.from('police_reports').update({ reporter_agent_no: 'DELETED' }).eq('reporter_agent_no', ag.agent_no)
          const { error } = await sb.from('agents').delete().eq('id', ag.id)
          if (error) return { success: false, error: error.message }
          try { await sb.rpc('run_all_aggregations', { target_week: getCurrentWeekLabel() }) } catch (_e) { }
          await broadcastActivity(sb, 'agent_retired', { team: ag.team, message: 'Agent removed' }, 'SYSTEM')
          return { success: true, message: `Agent ${ag.agent_no} removed` }
        },
      },

      // ── STATIC ─────────────────────────────────────
      getGCLinks: {
        auth: 'public',
        handler: async () => ({
          success: true,
          links: { team: Object.fromEntries(TEAMS.map((t) => [t, ''])), playlist: '', main: '' },
        }),
      },
      getHelperRoles: {
        auth: 'public',
        handler: async () => ({
          success: true,
          roles: [
            { icon: '📋', name: 'Attendance Checker', description: 'Check team attendance', agents: [] },
            { icon: '👮', name: 'Police Agent', description: 'Monitor violations', agents: [] },
            { icon: '🎵', name: 'Playlist Maker', description: 'Create playlists', agents: [] },
            { icon: '🎓', name: 'Senior', description: 'Team mentor', agents: [] },
          ],
        }),
      },
      refreshMissionProgress: {
        auth: 'public',
        handler: async () => ({ success: true, message: 'Progress refreshed' }),
      },

      // ── FAN HYPE WALL ───────────────────────────────
      getHypePosts: {
        auth: 'public',
        handler: async (sb, p) => {
          const limit = parseInt(p.limit) || 30
          const offset = parseInt(p.offset) || 0
          const { data: posts, error } = await sb
            .from('hype_posts')
            .select(`
              *,
              uploader:agents!hype_posts_agent_no_fkey (
                name,
                team
              )
            `)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)
          if (error) return { success: false, error: error.message }
          
          // Map to flatten the uploader data for easier frontend use
          const formattedPosts = (posts || []).map((post: any) => ({
            ...post,
            agent_name: post.uploader?.name || post.agent_no,
            agent_team: post.uploader?.team || 'Unknown'
          }))
          
          return { success: true, posts: formattedPosts }
        },
      },

      getHypeUserStatus: {
        auth: 'agent',
        handler: async (sb, p) => {
          const { agentNo } = p
          const week = getCurrentWeekLabel()
          const weekStart = getWeekTimeRange(week).from
          
          // Count total likes given this week
          const { count: weeklyLikes } = await sb
            .from('hype_likes')
            .select('id', { count: 'exact', head: true })
            .eq('agent_no', agentNo)
            .gte('created_at', new Date(weekStart * 1000).toISOString())
            
          // Check if already posted today (KST)
          const todayKST = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)
          const { data: existingPost } = await sb
            .from('hype_posts')
            .select('id')
            .eq('agent_no', agentNo)
            .gte('created_at', todayKST + 'T00:00:00Z')
            .maybeSingle()
            
          return { 
            success: true, 
            weeklyLikes: weeklyLikes || 0,
            hasUploadedToday: !!existingPost
          }
        },
      },

      submitHypePost: {
        auth: 'agent',
        handler: async (sb, p) => {
          const { agentNo, igUsername, postUrl, caption, contentType } = p
          if (!igUsername || !postUrl || !caption) {
            return { success: false, error: 'Instagram username, post URL and caption are required.' }
          }
          // Validate caption mentions the battle
          const battleKeywords = ['arirang', 'bts', 'btscomebackbattle', 'arirangmission', 'stream', 'battle', '#bts', '#arirang']
          const captionLower = (caption || '').toLowerCase()
          const hasBattleKeyword = battleKeywords.some(kw => captionLower.includes(kw))
          if (!hasBattleKeyword) {
            return { success: false, error: 'Caption must mention BTS, Arirang, or the battle to qualify for XP.' }
          }
          // Check if this post URL has already been shared by anyone
          const normalizedUrl = postUrl.trim().split('?')[0]; // Remove query params for better matching
          const { data: urlExists } = await sb
            .from('hype_posts')
            .select('id')
            .ilike('post_url', `%${normalizedUrl}%`)
            .maybeSingle()
          
          if (urlExists) {
            return { success: false, error: 'This post has already been shared on the Hype Wall. Please share unique content!' }
          }

          // Check if agent already posted today
          const todayUTC = new Date().toISOString().slice(0, 10)
          const { data: existing } = await sb
            .from('hype_posts')
            .select('id')
            .eq('agent_no', agentNo)
            .gte('created_at', todayUTC + 'T00:00:00Z')
            .maybeSingle()
          if (existing) {
            return { success: false, error: 'You have already uploaded today. Come back tomorrow!' }
          }
          // Insert the post
          const { data: post, error: insertError } = await sb
            .from('hype_posts')
            .insert({
              agent_no: agentNo,
              ig_username: igUsername,
              post_url: postUrl.trim(),
              caption: caption.trim().slice(0, 500),
              content_type: contentType || 'Post',
              status: 'active',
              like_count: 0,
              created_at: new Date().toISOString(),
            })
            .select()
            .single()
          if (insertError) return { success: false, error: insertError.message }
          // Award 5 XP to uploader via secret_xp table
          const week = getCurrentWeekLabel()
          await sb.from('secret_xp').upsert({
            agent_no: agentNo,
            week_label: week,
            source: 'hype_post',
            xp_awarded: 5,
            awarded_at: new Date().toISOString(),
            notes: `Hype Wall post: ${postUrl.slice(0, 80)}`,
          }, { onConflict: 'agent_no, week_label, source, notes' })
          // Broadcast to activity feed
          const { data: ag } = await sb.from('agents').select('name, team').eq('agent_no', agentNo).limit(1).single()
          if (ag) {
            await broadcastActivity(sb, 'hype_post', {
              name: ag.name,
              team: ag.team,
              postUrl: postUrl
            }, agentNo)
          }

          return { success: true, post, xpAwarded: 5, message: '+5 XP awarded for your Hype Wall post! 🔥' }
        },
      },

      likeHypePost: {
        auth: 'agent',
        handler: async (sb, p) => {
          const { agentNo, postId } = p
          if (!postId) return { success: false, error: 'Post ID required.' }
          // Prevent self-like — get post owner
          const { data: post } = await sb
            .from('hype_posts')
            .select('agent_no, like_count')
            .eq('id', postId)
            .maybeSingle()
          if (!post) return { success: false, error: 'Post not found.' }
          if (post.agent_no === agentNo) return { success: false, error: 'You cannot like your own post.' }
          // Check duplicate like
          const { data: alreadyLiked } = await sb
            .from('hype_likes')
            .select('id')
            .eq('post_id', postId)
            .eq('agent_no', agentNo)
            .maybeSingle()
          if (alreadyLiked) return { success: false, error: 'You already liked this post.' }
          // Insert like
          await sb.from('hype_likes').insert({ post_id: postId, agent_no: agentNo, created_at: new Date().toISOString() })
          // Increment post like_count
          const newLikeCount = (post.like_count || 0) + 1
          await sb.from('hype_posts').update({ like_count: newLikeCount }).eq('id', postId)
          // Check if liker has hit the 5-like milestone for 1 XP
          const week = getCurrentWeekLabel();
          const { data: existingMilestone } = await sb
            .from('secret_xp')
            .select('id')
            .eq('agent_no', agentNo)
            .eq('week_label', week)
            .eq('source', 'hype_like_milestone')
            .maybeSingle();

          // Count total likes given this week for this agent to check milestone
          const weekStart = getWeekTimeRange(week).from;
          const { count: currentWeeklyLikes } = await sb
            .from('hype_likes')
            .select('id', { count: 'exact', head: true })
            .eq('agent_no', agentNo)
            .gte('created_at', new Date(weekStart * 1000).toISOString());

          const weeklyLikes = currentWeeklyLikes || 0;
          let milestoneMet = false;
          let xpAwarded = 0;

          // Award 1 XP every 5 likes (repeatable)
          if (weeklyLikes > 0 && weeklyLikes % 5 === 0) {
            const milestoneSet = weeklyLikes / 5;
            await sb.from('secret_xp').insert({
              agent_no: agentNo,
              week_label: week,
              source: 'hype_like_milestone',
              xp_awarded: 1,
              awarded_at: new Date().toISOString(),
              notes: `Liked ${weeklyLikes} Hype Wall posts (Milestone #${milestoneSet})`,
            });
            xpAwarded = 1;
            milestoneMet = true;
          }
          return { 
            success: true, 
            newLikeCount, 
            xpAwarded, 
            weeklyLikes,
            milestoneMet,
            message: xpAwarded ? '+1 XP milestone: liked 5 posts this week! 💜' : null 
          }
        },
      },
    }
  }

  const ROUTES = buildRoutes()

  // ── REQUEST HANDLER ──────────────────────────────

  Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: CORS_HEADERS });
    }

    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );

      // 1. Get Params safely
      let params: Record<string, any> = {};
      if (req.method === 'POST') {
        const text = await req.text();
        params = text ? JSON.parse(text) : {};
      } else {
        params = Object.fromEntries(new URL(req.url).searchParams);
      }

      const { action } = params;
      console.log(`Processing action: ${action}`); // This will show in your Supabase logs

      const route = ROUTES[action];
      if (!route) {
        return jsonResponse({ success: false, error: `Action "${action}" not found` }, 404);
      }

      // 2. Auth Check
      const authResult = await checkAuth(supabase, route.auth, params);
      if (!authResult.ok) {
        return jsonResponse({ success: false, error: authResult.error }, 401);
      }

      const rawWeek = params.week || getCurrentWeekLabel();
      const currentWeek = isValidWeek(rawWeek) ? rawWeek : getCurrentWeekLabel();

      // 3. EXECUTE HANDLER
      const result = await route.handler(supabase, params, currentWeek);

      // --- SAFETY NET: DETECT EMPTY RETURNS ---
      if (result === undefined || result === null) {
        console.error(`CRITICAL: Action "${action}" returned nothing!`);
        return jsonResponse({ 
          success: false, 
          error: `The backend handler for "${action}" failed to return a response object.` 
        }, 200); 
      }

      return jsonResponse(result, 200);

    } catch (error: any) {
      console.error('Edge Function Error:', error.message);
      return jsonResponse({ success: false, error: error.message }, 200);
    }
  });

// ── RESPONSE HELPERS ─────────────────────────────

function jsonResponse(data: any, status: number = 200): Response {
  // If data is undefined/null, send an error object instead of an empty body
  const body = JSON.stringify(data ?? { success: false, error: "Handler returned no data" });
  
  return new Response(body, {
    headers: {
      ...CORS_HEADERS,
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
    },
    status,
  });
}

  async function checkAuth(
    supabase: SupabaseDB,
    level: string,
    params: Record<string, any>,
  ): Promise<{ ok: boolean; error?: string }> {
    switch (level) {
      case 'public':
        return { ok: true }

      case 'agent':
        if (!params.agentNo) return { ok: false, error: 'Agent number required' }
        return { ok: true }

      case 'admin': {
        const token = params.sessionToken ?? params.adminSession
        const valid = await validateAdminSession(supabase, token)
        return valid
          ? { ok: true }
          : { ok: false, error: 'Admin session required' }
      }

      case 'syncAdmin': {
        if (!requireSyncAdminKey(params.adminKey)) {
          return { ok: false, error: 'Unauthorized' }
        }
        return { ok: true }
      }

      default:
        return { ok: false, error: 'Unknown auth level' }
    }
  }

// =============================================
// END OF PART 3
// =============================================
