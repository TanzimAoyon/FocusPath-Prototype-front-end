// ==========================================================
// FOCUS PATH — main app script
// All data is stored in the browser (localStorage); nothing is sent to a server.
// Sections: 1 Helpers  2 Demo data  3 Icons  4 Navigation  5 Pages
//           6 Actions  7 Roadmap  8 Focus timer  9 Profile
//
// 1. HELPERS & SAVED DATA — S is the whole app state, save() writes it to localStorage
// ==========================================================
const $ = s => document.querySelector(s), KEY = 'focuspath_v3';
const DEF = {
  xp: 0,
  streak: 0,
  best: 0,
  last: '',
  stages: [],
  goals: [],
  todos: [],
  prac: [],
  sessions: [],
  days: {},
  reviews: [],
  paid: {},
  shield: [0, 0, 0, 0],
  profile: {name: '', user: '', email: '', bio: '', avatar: '🦊', photo: '', joined: ''},
  stg: {},
  blocks: [],
  energy: '',
  set: {notif: true, alarm: true}
};
const S = Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || 'null') || demo());
const save = () => {
  localStorage.setItem(KEY, JSON.stringify(S));
  $('#xp').textContent = S.xp.toLocaleString();
  $('#stk').textContent = S.streak
};
const dk = d => {
  d = d || new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
};
const today = () => dk(), plus = n => { const d = new Date(); d.setDate(d.getDate() + n); return dk(d) };
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const uid = () => Math.random().toString(36).slice(2, 9), $v = id => (document.getElementById(id) || {}).value || '';
const toast = m => {
  const t = $('#toast');
  t.textContent = m;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600)
};
function notify(t, b) {
  if (S.set.notif && 'Notification' in window && Notification.permission === 'granted') new Notification(t, {body: b})
}

function bumpStreak() {
  const t = today();
  if (S.last === t) return;
  const y = plus(-1);
  S.streak = S.last === y ? S.streak + 1 : 1;
  S.last = t;
  S.best = Math.max(S.best, S.streak)
}

// Give XP once per activity (key) so the same activity can't be rewarded twice.
function reward(key, xp, msg) {
  if (S.paid[key]) return;
  S.paid[key] = 1;
  S.xp += xp;
  bumpStreak();
  save();
  toast('+' + xp + ' XP  ' + (msg || 'Nice work! 🎉'))
}

// ==========================================================
// 2. DEMO DATA — used the first time the app opens (Settings → Start fresh clears it)
// ==========================================================
function demo() {
  const dk = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'), p = n => { const d = new Date(); d.setDate(d.getDate() + n); return dk(d) };
  const days = {};
  [25, 0, 40, 55, 30, 0, 45, 60, 20, 35, 50, 25, 40, 30].forEach((m, i) => { if (m) days[p(-i)] = m });
  const T = ['Project report', 'Algorithms practice', 'Read chapter 4', 'Portfolio design'], H = [9, 10, 14, 16, 20, 9, 11, 15, 21, 10, 9, 14];
  const sessions = H.map((h, i) => ({
    title: T[i % 4],
    kind: ['task', 'practice', 'focus', 'task'][i % 4],
    mins: [25, 45, 25, 40][i % 4],
    pauses: i % 3,
    pausedSec: (i % 3) * 40,
    start: String(h).padStart(2, '0') + ':05',
    end: String(h).padStart(2, '0') + ':40',
    date: p(-Math.floor(i / 1.2)),
    hour: h
  }));
  return {
    xp: 1200,
    streak: 7,
    best: 12,
    last: p(0),
    stages: [0, 1, 2],
    paid: {},
    days,
    sessions,
    shield: [1, 1, 0, 0],
    energy: 'Morning',
    profile: {
      name: 'Alex Morgan',
      user: 'alexfocus',
      email: 'alex.morgan@example.com',
      bio: 'CS student building better study habits, one focused session at a time.',
      avatar: '🦊',
      photo: '',
      joined: p(-30)
    },
    stg: {
      0: {
        goal: 'Become a confident web developer',
        why: 'I want to build real products and get a junior developer job.',
        strengths: ['Curious', 'Persistent'],
        values: ['Growth', 'Independence']
      }
    },
    goals: [
      {
        id: 'g_stage1',
        t: 'Become a confident web developer',
        res: 'Build and deploy 3 full projects and pass my web course with an A.',
        w: 'I want a junior developer job and the freedom to build my own ideas.',
        str: 'Curious, persistent, good at debugging',
        vis: 'Unsure how deep to go on backend vs frontend.',
        s: 'Finish the FocusPath prototype this month',
        m: 'Complete the web course and build a portfolio site',
        l: 'Land a junior developer role within 12 months',
        td: p(120),
        p: 35
      },
      {
        id: 'g2',
        t: 'Improve my daily focus',
        res: 'Focus 2 hours a day without checking my phone.',
        w: 'Distractions are costing me study time and sleep.',
        str: 'Good at routines once started',
        vis: '',
        s: '7-day streak of focus sessions',
        m: '60 focus hours in a month',
        l: 'Make deep work a daily habit',
        td: '',
        p: 60
      }
    ],
    todos: [
      {
        id: 'd1',
        t: 'Finish mid-term presentation slides',
        desc: 'Add prototype screenshots and SRS summary',
        date: p(0),
        time: '10:00',
        p: 'High',
        d: 45,
        notes: 'Check with faculty template',
        done: false,
        mit: true
      },
      {
        id: 'd2',
        t: 'Practice JavaScript array methods',
        desc: 'map, filter, reduce exercises',
        date: p(0),
        time: '14:00',
        p: 'Medium',
        d: 25,
        notes: '',
        done: false,
        mit: true
      },
      {
        id: 'd3',
        t: 'Draw low-fidelity wireframes',
        desc: 'Hand-drawn versions of all main screens',
        date: p(0),
        time: '17:30',
        p: 'High',
        d: 60,
        notes: '',
        done: false,
        mit: true
      },
      {
        id: 'd4',
        t: 'Write SRS functional requirements',
        desc: '',
        date: p(1),
        time: '11:00',
        p: 'High',
        d: 90,
        notes: 'Use faculty template',
        done: false,
        mit: false
      },
      {
        id: 'd5',
        t: 'Deploy prototype to GitHub Pages',
        desc: '',
        date: p(1),
        time: '',
        p: 'Medium',
        d: 25,
        notes: '',
        done: false,
        mit: false
      },
      {
        id: 'd6',
        t: 'Review database design notes',
        desc: '',
        date: p(4),
        time: '',
        p: 'Low',
        d: 45,
        notes: '',
        done: false,
        mit: false
      },
      {
        id: 'd7',
        t: 'Plan next week study schedule',
        desc: '',
        date: p(7),
        time: '',
        p: 'Medium',
        d: 25,
        notes: '',
        done: false,
        mit: false
      },
      {
        id: 'd8',
        t: 'Set up GitHub repository',
        desc: '',
        date: p(-1),
        time: '',
        p: 'Medium',
        d: 25,
        notes: '',
        done: true,
        mit: false,
        doneAt: p(-1)
      },
      {
        id: 'd9',
        t: 'Choose colour palette in Figma',
        desc: '',
        date: p(-2),
        time: '',
        p: 'Low',
        d: 25,
        notes: '',
        done: true,
        mit: false,
        doneAt: p(-2)
      }
    ],
    prac: [
      {
        id: 'pr1',
        t: 'CSS Grid practice',
        plan: 'Rebuild the dashboard layout using grid only.',
        date: p(0),
        time: '16:00',
        d: 25,
        done: false
      },
      {
        id: 'pr2',
        t: 'Debugging drills',
        plan: 'Fix 5 broken snippets without searching the answer.',
        date: p(1),
        time: '10:00',
        d: 45,
        done: false
      },
      {
        id: 'pr3',
        t: 'Typing and keyboard shortcuts',
        plan: 'VS Code shortcuts for 15 minutes.',
        date: p(-1),
        time: '09:00',
        d: 15,
        done: true,
        ref: 'Felt easier after the third round. Will repeat tomorrow.',
        rate: 8
      }
    ],
    reviews: [
      {
        d: p(-1),
        m: '🙂 Good',
        rate: 7,
        wins: 'Finished my top 2 tasks before lunch.',
        dist: 'Phone notifications in the afternoon.',
        energy: 'Best energy 9–11am.',
        next: 'Put the phone in another room.'
      },
      {
        d: p(-3),
        m: '😐 Okay',
        rate: 5,
        wins: 'Did one 45-minute session.',
        dist: 'Social media.',
        energy: 'Low after lunch.',
        next: 'Schedule a walk after lunch.'
      }
    ],
    blocks: [{id: 'b1', task: 'Finish mid-term presentation slides', time: '10:00', d: 45, energy: 'High'}]
  }
}

// ==========================================================
// 3. SIDEBAR ICONS (inline SVG, same style as the Figma sample)
// ==========================================================
const ICON = {
  home: `<svg viewBox="0 0 32 32">
      <path d="M4 15 16 4l12 11M7 13v14h18V13M13 27v-8h6v8"/>
    </svg>`,
  roadmap: `<svg viewBox="0 0 32 32">
      <circle cx="8" cy="7" r="3"/><circle cx="24" cy="14" r="3"/><circle cx="8" cy="25" r="3"/><path d="M11 7h10a3 3 0 0 1 0 4M21 14H11a3 3 0 0 0 0 5M11 25h13"/>
    </svg>`,
  goals: `<svg viewBox="0 0 32 32">
      <circle cx="15" cy="17" r="10"/><circle cx="15" cy="17" r="5"/><path d="M15 17 27 5M22 5h5v5"/>
    </svg>`,
  todo: `<svg viewBox="0 0 32 32">
      <path d="M14 6H7a2 2 0 0 0-2 2v17a2 2 0 0 0 2 2h17a2 2 0 0 0 2-2v-7"/><path d="m13 19 1-5 12-12 4 4-12 12z"/>
    </svg>`,
  practice: `<svg viewBox="0 0 32 32">
      <path d="M16 4v2M16 26v2M4 16h2M26 16h2M7.5 7.5 9 9M23 23l1.500 1.500M7.500 24.500 9 23M23 9l1.500-1.500"/><path d="M10 16l4 4 8-8"/>
    </svg>`,
  profile: `<svg viewBox="0 0 32 32">
      <path d="M16 28c-6-3-9-8-8-14l3 3V6l3 5 2-7 2 7 3-5v11l3-3c1 6-2 11-8 14z"/>
    </svg>`,
  plan: `<svg viewBox="0 0 32 32">
      <rect x="4" y="6" width="24" height="22" rx="3"/><path d="M4 13h24M10 3v6M22 3v6M11 21l4 4 7-8"/>
    </svg>`,
  review: `<svg viewBox="0 0 32 32">
      <rect x="5" y="5" width="22" height="22" rx="3"/><path d="M11 22v-6M16 22V10M21 22v-9"/>
    </svg>`,
  timer: `<svg viewBox="0 0 32 32">
      <circle cx="16" cy="18" r="10"/><path d="M16 12v6l4 3M12 3h8M16 3v5"/>
    </svg>`,
  shield: `<svg viewBox="0 0 32 32">
      <path d="M16 3 5 7v8c0 7 5 11 11 14 6-3 11-7 11-14V7z"/><path d="m11 16 4 4 7-8"/>
    </svg>`,
  settings: `<svg viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="4"/><path d="M16 3v4M16 25v4M3 16h4M25 16h4M7 7l3 3M22 22l3 3M7 25l3-3M22 10l3-3"/>
    </svg>`
};
// ==========================================================
// 4. NAVIGATION — go('page') switches page, draw() redraws the screen
// ==========================================================
const NAV = [
  ['home', 'Home'],
  ['roadmap', 'Roadmap'],
  ['goals', 'Goals'],
  ['todo', 'To-do'],
  ['practice', 'Practice'],
  ['timer', 'Focus Timer'],
  ['shield', 'Focus Shield'],
  ['profile', 'Profile'],
  ['plan', 'Daily Plan'],
  ['review', 'Daily Review'],
  ['settings', 'Settings']
];
let page = 'home', lesson = null, edit = null, tf = 'today';
function go(p, e) {
  page = p;
  lesson = null;
  edit = e || null;
  draw()
}

function draw() {
  $('#nav').innerHTML = NAV.map(n => `<button class="${n[0]===page?'on':''}" onclick="go('${n[0]}')">${ICON[n[0]]}<span>${n[1]}</span></button>`).join('');
  save();
  const nm = (NAV.find(n => n[0] === page) || [])[1];
  $('#view').innerHTML = lesson !== null ? lessonView() : `<h1 class="ptitle">
      ${nm}
    </h1>` + V[page]();
  paint()
}

const mins = () => S.days[today()] || 0, pct = () => Math.round(S.stages.length / 7 * 100);
const chips = (id, arr, cur, multi) => `<div class="chips" id="${id}">
    ${arr.map(c=>`<button type="button" class="chip ${String(c)===String(cur)?'sel':''}" onclick="${multi?"this.classList.toggle('sel')":'pickOne(this)'}">${c}</button>`).join('')}
  </div>`;
function pickOne(b) {
  b.parentNode.querySelectorAll('.chip').forEach(c => c.classList.remove('sel'));
  b.classList.add('sel')
}

const sel = id => (document.querySelector('#' + id + ' .sel') || {}).textContent || '';
const inp = (id, l, v, t, ph) => `<label class="f">
    ${l}<input id="${id}" type="${t||'text'}" value="${esc(v)}" placeholder="${ph||''}">
  </label>`;
const ta = (id, l, v, ph) => `<label class="f">
    ${l}<textarea id="${id}" rows="2" placeholder="${ph||''}">${esc(v)}</textarea>
  </label>`;
const WK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// Does a date fall in the chosen filter (today / tomorrow / this week / next week)?
function within(d, f) {
  const t = today();
  if (f === 'all') return true;
  if (f === 'today') return d === t;
  if (f === 'tomorrow') return d === plus(1);
  const s = new Date(t + 'T12:00');
  s.setDate(s.getDate() - (s.getDay() + 6) % 7);
  if (f === 'nextweek') s.setDate(s.getDate() + 7);
  const e = new Date(s);
  e.setDate(e.getDate() + 7);
  const x = new Date(d + 'T12:00');
  return x >= s && x < e
}

// ==========================================================
// 5. PAGES — each function returns the HTML for one page
// ==========================================================
const V = {
  home() {
    const top = S.todos.filter(t => t.mit && !t.done), nx = S.stages.length < 7 ? [0, 1, 2, 3, 4, 5, 6].find(i => !S.stages.includes(i)) : -1, g = S.goals[0];
    return `<div class="hero">
        <h2>
          Welcome back, ${esc((S.profile.name||'there').split(' ')[0])}! 👋
        </h2>
        <p>
          ${nx<0?'You finished the whole path! 🏆':'Next up: Stage '+(nx+1)+' — '+STAGES[nx].n}
        </p>
        <button class="btn alt" onclick="${nx<0?"go('roadmap')":`open_(${nx})`}">Continue journey</button> <button class="btn alt" onclick="go('timer')">Start focus session</button>
      </div>


      <div class="grid">
        <div class="card stat">
          ${mins()}<small>focus min today</small>
        </div>
        <div class="card stat">
          ${S.stages.length}/7<small>roadmap stages</small>
        </div>
        <div class="card stat">
          ${S.todos.filter(t=>t.done).length}<small>tasks done</small>
        </div>
        <div class="card stat">
          ${S.sessions.length}<small>focus sessions</small>
        </div>
      </div>


      <div class="card">
        <b>🎯 Main goal</b>${g?`<p>
            ${esc(g.t)}
          </p>
          <div class="bar">
            <i style="width:${g.p}%"></i>
          </div>
          <small>${g.p}% complete</small>`:'<p>No goal yet.</p><button class="btn" onclick="go(\'goals\')">Create goal</button>'}
      </div>


      <div class="card">
        <b>⭐ Today's top 3</b>${top.map(t=>`<div class="row">
            ${esc(t.t)}<button class="btn" onclick="startTask('${t.id}')">Focus</button>
          </div>`).join('')||'<p>Star up to 3 tasks in To-do to see them here.</p>'}
      </div>


      <div class="card">
        <b>🎓 Upcoming practice</b>${S.prac.filter(p=>!p.done&&p.date>=today()).slice(0,3).map(p=>`<div class="row">
            ${esc(p.t)}<span>${p.date} ${p.time||''}</span>
          </div>`).join('')||'<p>Nothing scheduled.</p>'}
      </div>`
  },
  roadmap() {
    const nx = [0, 1, 2, 3, 4, 5, 6].find(i => !S.stages.includes(i));
    return `<div class="card">
        <div class="bar">
          <i style="width:${pct()}%"></i>
        </div>
        <small>${S.stages.length}/7 stages complete · all stages are open to explore</small>
      </div>
      <div class="path">
        ${STAGES.map((s,i)=>`<div style="transform:translateX(${[0,-60,-90,-60,0,60,90][i]}px)">
            <button class="node ${S.stages.includes(i)?'done':i===nx?'next':''}" onclick="open_(${i})">${S.stages.includes(i)?'✓':s.e}</button>
            <div class="lbl">
              Stage ${i+1}<small>${s.n}</small>
            </div>
          </div>`).join('')}
      </div>`
  },
  goals() {
    const g = S.goals.find(x => x.id === edit) || {};
    return `<div class="card">
        <b>${edit?'Edit goal':'Write a new goal'}</b>
        <div class="form">
          ${inp('g1','Goal title',g.t)}${ta('g2','Result you want to achieve',g.res)}${ta('g3','Why does it matter to you?',g.w)}${ta('g4','Your strengths',g.str)}${ta('g5','Refine your vision',g.vis)}${inp('g6','Short-term milestone',g.s)}${inp('g7','Mid-term milestone',g.m)}${inp('g8','Long-term milestone',g.l)}${inp('g9','Target date (optional)',g.td,'date')}
        </div>
        <button class="btn" onclick="saveGoal()">${edit?'Update goal':'Save goal'}</button>${edit?' <button class="btn alt" onclick="go(\'goals\')">Cancel</button>':''}
      </div>

${S.goals.map(g=>`<div class="card">
          <b>${g.done?'✅ ':'🎯 '}${esc(g.t)}</b>
          <p>
            ${esc(g.res||'')}
          </p>
          <p>
            <small>Why: ${esc(g.w||'—')}<br>Short: ${esc(g.s||'—')} · Mid: ${esc(g.m||'—')} · Long: ${esc(g.l||'—')}${g.td?'<br>Target: '+g.td:''}</small>
          </p>
          <div class="bar">
            <i style="width:${g.p}%"></i>
          </div>
          ${chips('p'+g.id,[0,25,50,75,100].map(v=>v+'%'),g.p+'%').replace(/onclick="pickOne\(this\)"/g,'onclick="setP(\''+g.id+'\',this.textContent)"')}<button class="chip" onclick="go('goals','${g.id}')">✏️ Edit</button> <button class="chip" onclick="delG('${g.id}')">🗑 Delete</button>
        </div>`).join('')}`
  },
  todo() {
    const t = S.todos.find(x => x.id === edit) || {p: 'Medium', d: 25, date: today()};
    const f = tf;
    const L = S.todos.filter(x => f === 'done' ? x.done : !x.done && within(x.date, f));
    return `<div class="card">
        <b>${edit?'Edit task':'New task'}</b>
        <div class="form">
          ${inp('t1','Task title',t.t)}${ta('t2','Description',t.desc)}${inp('t3','Due date',t.date,'date')}${inp('t4','Due time',t.time,'time')}
        </div>
        <div>
          Priority
        </div>
        ${chips('t5',['High','Medium','Low'],t.p)}
        <div>
          Estimated duration
        </div>
        ${chips('t6',[15,25,45,60,90].map(x=>x+' min'),t.d+' min')}${ta('t7','Notes (optional)',t.notes)}<button class="btn" onclick="saveTodo()">${edit?'Update task':'Add task'}</button>${edit?' <button class="btn alt" onclick="go(\'todo\')">Cancel</button>':''}
      </div>


      <div class="chips">
        ${[['today','Today'],['tomorrow','Tomorrow'],['week','This Week'],['nextweek','Next Week'],['all','All Tasks'],['done','Completed']].map(x=>`<button class="chip ${tf===x[0]?'sel':''}" onclick="tf='${x[0]}';draw()">${x[1]}</button>`).join('')}
      </div>

${L.map(t=>`<div class="card">
          <div class="row" style="border:0">
            <span class="${t.done?'done-t':''}"><b class="pr-${t.p}">●</b> <b>${esc(t.t)}</b> ${t.mit?'⭐':''}<br><small>${esc(t.desc||'')} 📅 ${t.date} ${t.time||''} · ⏱ ${t.d} min · ${t.p}${t.notes?' · 📝 '+esc(t.notes):''}</small></span>
          </div>
          <div class="chips">
            ${t.done?'':`<button class="btn" onclick="startTask('${t.id}')">Focus</button><button class="chip" onclick="doneTodo('${t.id}')">✓ Done</button><button class="chip" onclick="mit('${t.id}')">⭐ Top 3</button>`}<button class="chip" onclick="go('todo','${t.id}')">✏️</button><button class="chip" onclick="ics('${t.id}')">📅 Calendar</button><button class="chip" onclick="delT('${t.id}')">🗑</button>
          </div>
        </div>`).join('')||'<div class="card">No tasks here.</div>'}`
  },
  practice() {
    const p = S.prac.find(x => x.id === edit) || {d: 25, date: today()};
    return `<div class="card">
        <b>Create a practice session</b>
        <div class="form">
          ${inp('p1','Practice title',p.t)}${ta('p2','Practice plan',p.plan)}${inp('p3','Date',p.date,'date')}${inp('p4','Time',p.time,'time')}
        </div>
        <div>
          Duration
        </div>
        ${chips('p5',[15,25,45,60].map(x=>x+' min'),p.d+' min')}<button class="btn" onclick="savePrac()">Save session</button>
      </div>

${S.prac.map(p=>`<div class="card">
          <b class="${p.done?'done-t':''}">🎓 ${esc(p.t)}</b> <small>${p.date} ${p.time||''} · ${p.d} min</small>
          <p>
            <small>${esc(p.plan||'')}</small>
          </p>
          ${p.done?`<p>
              ✅ Completed · Reflection: ${p.ref||'—'}
            </p>`:`<div class="chips">
              <button class="btn" onclick="startPractice('${p.id}')">Start</button><button class="chip" onclick="delP('${p.id}')">🗑</button>
            </div>`}${p.done&&!p.ref?`<label class="f">
              How did it go? What did you learn?<textarea id="rf${p.id}" rows="2"></textarea>
            </label>
            <button class="btn" onclick="reflect('${p.id}')">Save reflection</button>`:''}
        </div>`).join('')}`
  },
  timer() {
    // ==========================================================
    // 7. ROADMAP — 7 stages, each with 2 real exercises
    // ==========================================================
    const pend = S.todos.filter(t => !t.done), pr = S.prac.filter(p => !p.done);
    return `<div class="card">
        <div class="chips">
          ${chips('tsel',['Free focus'].concat(pend.map(t=>'📝 '+t.t),pr.map(p=>'🎓 '+p.t)),T.label).replace(/onclick="pickOne\(this\)"/g,'onclick="pickT(this)"')}
        </div>


        <svg class="ring" width="250" height="250" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e5e5" stroke-width="9"/><circle id="arc" cx="60" cy="60" r="52" fill="none" stroke="#58cc02" stroke-width="9" stroke-linecap="round" stroke-dasharray="326.7" transform="rotate(-90 60 60)"/><text id="clock" x="60" y="68" text-anchor="middle" font-size="24" font-weight="800" fill="#1f2d4a"></text>
        </svg>


        <p style="text-align:center">
          ${esc(T.title)} · planned ${Math.round(T.total/60)} min
        </p>
        <div class="chips" style="justify-content:center">
          ${[10,15,25,45,60].map(m=>`<button class="chip ${T.total==m*60?'sel':''}" onclick="setDur(${m})">${m}m</button>`).join('')}
        </div>


        <div class="chips" style="justify-content:center">
          ${['🔇 Silence','🌧️ Rain','🌲 Forest','🏫 Classroom'].map((s,i)=>`<button class="chip ${S.set.snd==i?'sel':''}" onclick="S.set.snd=${i};if(T.run)noise();draw()">${s}</button>`).join('')}
        </div>


        <div style="text-align:center">
          <button class="btn" onclick="toggleT()">${T.run?'Pause':T.started?'Resume':'Start'}</button> <button class="btn alt" onclick="stopT()" ${T.started?'':'disabled'}>Stop</button> <button class="btn alt" onclick="resetT()">Reset</button>
        </div>
        <p style="text-align:center">
          <small>Pauses: ${T.pauses} · Paused time: ${Math.round(T.pausedSec)}s</small>
        </p>
      </div>


      <div class="card">
        <b>Session history</b>${S.sessions.slice(0,10).map(s=>`<div class="row">
            <span>${esc(s.title)}<br><small>${s.date} ${s.start}–${s.end}</small></span><span>${s.mins} min · ${s.pauses} pauses · ${s.pausedSec}s paused</span>
          </div>`).join('')||'<p>No sessions yet.</p>'}
      </div>`
  },
  shield() {
    const L = [
      'Social media closed or muted',
      'Environment prepared (desk clear, water ready)',
      'Android Focus Mode turned on',
      'Do Not Disturb turned on'
    ];
    return `<div class="card">
        <p>
          A web app <b>cannot</b> block other apps or change Android settings. Follow these steps yourself, then confirm.
        </p>
        ${L.map((l,i)=>`<button class="chip ${S.shield[i]?'ok':''}" style="display:block;width:100%;margin:8px 0;text-align:left" onclick="S.shield[${i}]=S.shield[${i}]?0:1;save();draw()">${S.shield[i]?'✅':'⬜'} ${l}</button>`).join('')}
      </div>


      <div class="card">
        <b>📱 Android Focus Mode</b>
        <p>
          <small>Settings → Digital Wellbeing & parental controls → Focus mode → choose distracting apps → Turn on now.</small>
        </p>
        <b>🔕 Do Not Disturb</b>
        <p>
          <small>Swipe down Quick Settings → Do Not Disturb, or Settings → Notifications → Do Not Disturb.</small>
        </p>
        <button class="btn" ${S.shield.every(x=>x)?'':'disabled'} onclick="reward('shield'+today(),10,'Shield ready 🛡️');go('timer')">I'm ready — start focusing</button>
      </div>`
  },
  profile() {
    const P = S.profile, av = P.photo ? `<img src="${P.photo}" class="av">` : `<div class="av">
        ${P.avatar}
      </div>`, g = S.goals[0];
    if (edit === 'profile') return `<div class="card">
        <b>Edit profile</b>
        <div style="display:flex;gap:16px;align-items:center;margin:10px 0">
          ${av}
          <div>
            <div class="chips" id="pav">
              ${['🦊','🐼','🦉','🐯','🐸','🦄','🚀','🌱'].map(e=>`<button type="button" class="chip ${P.avatar===e?'sel':''}" onclick="pickOne(this)">${e}</button>`).join('')}
            </div>
            <label class="f">
              Or upload a photo<input type="file" accept="image/*" onchange="photo(this)">
            </label>
          </div>
        </div>
        <div class="form">
          ${inp('pf1','Full name',P.name)}${inp('pf2','Username',P.user)}${inp('pf3','Email',P.email,'email')}
        </div>
        ${ta('pf4','Bio',P.bio)}<button class="btn" onclick="saveProfile()">Save profile</button> <button class="btn alt" onclick="go('profile')">Cancel</button>
      </div>` + V.stats();
    return `<div class="card" style="display:flex;gap:20px;align-items:center;flex-wrap:wrap">
        ${av}
        <div style="flex:1;min-width:220px">
          <h2 style="margin:0">
            ${esc(P.name||'Your name')}
          </h2>
          <div style="color:#7a869c">
            @${esc(P.user||'username')} · ${esc(P.email||'no email')}
          </div>
          <p>
            ${esc(P.bio||'')}
          </p>
          <small>Member since ${P.joined||today()} · 🎯 Main goal: ${g?esc(g.t)+' ('+g.p+'%)':'none yet'}</small>
        </div>
        <button class="btn" onclick="go('profile','profile')">Edit profile</button>
      </div>` + V.stats()
  },
  stats() {
    const n = S.set.range === 'month' ? 30 : 7, d = [...Array(n)].map((_, i) => {
      const x = new Date();
      x.setDate(x.getDate() - (n - 1 - i));
      const k = dk(x);
      return [n > 7 ? x.getDate() : WK[x.getDay()], S.days[k] || 0]
    }), mx = Math.max(30, ...d.map(x => x[1])), lv = Math.floor(S.xp / 100) + 1;
    const hr = Array(24).fill(0);
    S.sessions.forEach(s => hr[s.hour]++);
    const hm = Math.max(1, ...hr), best = hr.indexOf(Math.max(...hr)), tot = S.sessions.reduce((a, s) => a + s.mins, 0), ps = S.sessions.reduce((a, s) => a + s.pauses, 0);
    const B = [
      ['🔥', '3-day streak', S.best >= 3],
      ['⚡', '100 XP', S.xp >= 100],
      ['🗺️', 'Roadmap done', S.stages.length == 7],
      ['⏱️', '5 sessions', S.sessions.length >= 5],
      ['🎓', 'First practice', S.prac.some(p => p.done)],
      ['✅', '10 tasks', S.todos.filter(t => t.done).length >= 10]
    ];
    return `<div class="grid">
        <div class="card stat">
          Lv ${lv}<small>${S.xp%100}/100 XP</small>
        </div>
        <div class="card stat">
          ${S.xp}<small>total XP</small>
        </div>
        <div class="card stat">
          ${S.streak}<small>current streak</small>
        </div>
        <div class="card stat">
          ${S.best}<small>longest streak</small>
        </div>
        <div class="card stat">
          ${tot}<small>focus minutes</small>
        </div>
        <div class="card stat">
          ${S.todos.filter(t=>t.done).length}<small>tasks completed</small>
        </div>
        <div class="card stat">
          ${S.prac.filter(p=>p.done).length}<small>practice done</small>
        </div>
        <div class="card stat">
          ${ps}<small>pauses (distractions)</small>
        </div>
      </div>


      <div class="card">
        <b>Focus minutes</b> <button class="chip ${n==7?'sel':''}" onclick="S.set.range='week';draw()">Week</button><button class="chip ${n==30?'sel':''}" onclick="S.set.range='month';draw()">Month</button>
        <div class="bars">
          ${d.map(x=>`<div>
              <i style="height:${x[1]/mx*100}px"></i>${n==7?x[1]+'<br>':''}${x[0]}
            </div>`).join('')}
        </div>
      </div>


      <div class="card">
        <b>Most active time of day</b> <small>${S.sessions.length?best+':00':'—'}</small>
        <div class="bars" style="height:90px">
          ${hr.map((v,h)=>`<div>
              <i style="height:${v/hm*70}px"></i>${h%6==0?h:''}
            </div>`).join('')}
        </div>
      </div>


      <div class="card">
        <b>Badges</b>
        <div class="chips">
          ${B.map(b=>`<span class="chip ${b[2]?'ok':''}" style="opacity:${b[2]?1:.4}">${b[0]} ${b[1]}</span>`).join('')}
        </div>
      </div>


      <div class="card">
        <b>History</b>${S.sessions.slice(0,15).map(s=>`<div class="row">
            ${esc(s.title)}<small>${s.date} · ${s.mins} min · ${s.pauses} pauses</small>
          </div>`).join('')||'<p>Nothing yet.</p>'}
      </div>`
  },
  plan() {
    const t = S.todos.filter(x => !x.done && x.date === today()), p = S.prac.filter(x => !x.done && x.date === today());
    return `<div class="hero">
        <h2>
          Plan today ☀️
        </h2>
        <p>
          Pick your energy, then work through your top 3.
        </p>
      </div>
      <div class="card">
        <b>My energy window</b>${chips('en',['Morning','Afternoon','Evening'],S.energy).replace(/onclick="pickOne\(this\)"/g,'onclick="pickOne(this);S.energy=this.textContent;save()"')}
      </div>


      <div class="card">
        <b>⭐ Top 3</b>${S.todos.filter(x=>x.mit&&!x.done).map(x=>`<div class="row">
            ${esc(x.t)}<button class="btn" onclick="startTask('${x.id}')">Focus</button>
          </div>`).join('')||'<p>Star tasks in To-do.</p>'}
      </div>


      <div class="card">
        <b>⏱️ Planned time blocks</b>${S.blocks.map(b=>`<div class="row">
            ${b.time||'Any time'} · ${esc(b.task)}<span>${b.d} min · ${b.energy} energy</span>
          </div>`).join('')||'<p>Plan one in Roadmap stage 4.</p>'}
      </div>
      <div class="card">
        <b>Today's schedule</b>${t.concat(p).sort((a,b)=>(a.time||'99')<(b.time||'99')?-1:1).map(x=>`<div class="row">
            ${x.time||'Any time'} · ${esc(x.t)}<span>${x.d} min</span>
          </div>`).join('')||'<p>Nothing due today.</p>'}
      </div>`
  },
  review() {
    const R = ['😞 Hard', '😐 Okay', '🙂 Good', '🤩 Great'];
    return `<div class="card">
        <b>How was your day?</b>${chips('rm',R)}
        <label class="f">
          Productivity rating: <b id="rr_o">7</b>/10<input id="rr" type="range" min="1" max="10" value="7" oninput="document.getElementById('rr_o').textContent=this.value">
        </label>
        ${ta('r1','What went well?','')}${ta('r2','What distracted or slowed me down?','')}${ta('r3','When was my energy best?','')}${ta('r4','One improvement for next time','')}<button class="btn" onclick="saveRev()">Save review</button>
      </div>
      <div class="card">
        <b>Past reviews</b>${S.reviews.slice(0,7).map(r=>`<div class="row" style="display:block">
            <b>${r.d} · ${r.m}${r.rate?' · '+r.rate+'/10':''}</b><br><small>✅ ${esc(r.wins||'—')}<br>⚠️ ${esc(r.dist||'—')}<br>➡️ ${esc(r.next||'—')}</small>
          </div>`).join('')||'<p>None yet.</p>'}
      </div>`
  },
  settings() {
    const ok = 'Notification' in window;
    return `<div class="card">
        <b>🔔 Notifications & sound</b>
        <div class="chips">
          <button class="chip ${S.set.notif?'ok':''}" onclick="S.set.notif=!S.set.notif;save();draw()">${S.set.notif?'✅':'⬜'} Alerts</button><button class="chip ${S.set.alarm?'ok':''}" onclick="S.set.alarm=!S.set.alarm;save();draw()">${S.set.alarm?'✅':'⬜'} Alarm sound</button>${ok?`<button class="chip" onclick="Notification.requestPermission().then(p=>toast('Permission: '+p))">Allow browser notifications</button>`:'<small>This browser has no notifications.</small>'}
        </div>
      </div>
      <div class="card">
        <b>👤 Account</b>
        <p>
          Level ${Math.floor(S.xp/100)+1} · ${S.xp} XP · ${S.streak}-day streak
        </p>
        <small>Data is stored only in this browser. Google Calendar sync is planned, not built — use 📅 Calendar on a task to download an .ics file.</small>
      </div>
      <div class="card">
        <b>💾 Data</b>
        <div class="chips">
          <button class="chip" onclick="exportD()">Export backup</button><button class="chip" onclick="if(confirm('Replace your data with demo data?')){localStorage.setItem(KEY,JSON.stringify(demo()));location.reload()}">Load demo data</button><button class="chip" onclick="if(confirm('Start completely fresh?')){localStorage.setItem(KEY,JSON.stringify(DEF));location.reload()}">Start fresh</button><button class="chip" onclick="if(confirm('Erase everything?')){localStorage.removeItem(KEY);location.reload()}">Reset all data</button>
        </div>
      </div>`
  }

};
// ==========================================================
// 6. ACTIONS — what the buttons on the pages do
// ==========================================================
function saveGoal() {
  const t = $v('g1').trim();
  if (!t || !$v('g3').trim()) return toast('Add a title and why it matters ✍️');
  const o = {
    t,
    res: $v('g2'),
    w: $v('g3'),
    str: $v('g4'),
    vis: $v('g5'),
    s: $v('g6'),
    m: $v('g7'),
    l: $v('g8'),
    td: $v('g9')
  }, g = S.goals.find(x => x.id === edit);
  if (g) Object.assign(g, o);
  else {
    S.goals.unshift(Object.assign({id: uid(), p: 0}, o));
    reward('goal' + S.goals.length, 10, 'Goal saved 🎯')
  }
  edit = null;
  draw()
}

function setP(id, v) {
  const g = S.goals.find(x => x.id == id);
  g.p = parseInt(v);
  if (g.p == 100) { g.done = true; reward('goaldone' + id, 25, 'Goal achieved! 🏆') }
  save();
  draw()
}

function delG(id) {
  if (confirm('Delete this goal?')) { S.goals = S.goals.filter(g => g.id != id); draw() }

}

function saveTodo() {
  const t = $v('t1').trim();
  if (!t) return toast('Name your task first');
  const o = {
    t,
    desc: $v('t2'),
    date: $v('t3') || today(),
    time: $v('t4'),
    p: sel('t5') || 'Medium',
    d: parseInt(sel('t6')) || 25,
    notes: $v('t7')
  }, x = S.todos.find(y => y.id === edit);
  if (x) Object.assign(x, o);
  else S.todos.unshift(Object.assign({id: uid(), done: false, mit: false}, o));
  edit = null;
  toast('Task saved ✓');
  draw()
}

function doneTodo(id) {
  const t = S.todos.find(x => x.id == id);
  t.done = true;
  t.doneAt = today();
  reward('t' + id, 15, 'Task complete ✅');
  draw()
}

function delT(id) {
  S.todos = S.todos.filter(t => t.id != id);
  draw()
}

function mit(id) {
  const t = S.todos.find(x => x.id == id);
  if (!t.mit && S.todos.filter(x => x.mit && !x.done).length >= 3) return toast('Top 3 is full — finish or unstar one');
  t.mit = !t.mit;
  draw()
}

function ics(id) {
  const t = S.todos.find(x => x.id == id), f = d => d.replace(/[-:]/g, ''), s = t.date + 'T' + (t.time || '09:00') + ':00', e = new Date(new Date(s).getTime() + t.d * 6e4), en = dk(e) + 'T' + String(e.getHours()).padStart(2, '0') + String(e.getMinutes()).padStart(2, '0') + '00';
  const x = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'UID:' + t.id + '@focuspath',
    'DTSTART:' + f(s),
    'DTEND:' + en,
    'SUMMARY:' + t.t.replace(/[,;]/g, ' '),
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n'), a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([x], {type: 'text/calendar'}));
  a.download = 'task.ics';
  a.click()
}

function savePrac() {
  const t = $v('p1').trim();
  if (!t) return toast('Name the session');
  S.prac.unshift({
    id: uid(),
    t,
    plan: $v('p2'),
    date: $v('p3') || today(),
    time: $v('p4'),
    d: parseInt(sel('p5')) || 25,
    done: false
  });
  toast('Practice saved 🎓');
  draw()
}

function delP(id) {
  S.prac = S.prac.filter(p => p.id != id);
  draw()
}

function reflect(id) {
  const v = $v('rf' + id).trim();
  if (!v) return toast('Write a short reflection');
  S.prac.find(p => p.id == id).ref = v;
  reward('ref' + id, 5, 'Reflection saved ✍️');
  draw()
}

function saveRev() {
  const m = sel('rm');
  if (!m) return toast('Pick how your day felt');
  if (!$v('r1').trim()) return toast('Write what went well');
  S.reviews.unshift({
    d: today(),
    m,
    rate: +$v('rr'),
    wins: $v('r1'),
    dist: $v('r2'),
    energy: $v('r3'),
    next: $v('r4')
  });
  reward('rev' + today(), 10, 'Review saved 📊');
  draw()
}

function exportD() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], {type: 'application/json'}));
  a.download = 'focuspath-backup.json';
  a.click()
}

const pend = () => S.todos.filter(t => !t.done), G = () => {
  let g = S.goals.find(x => x.id === 'g_stage1') || S.goals[0];
  if (!g) {
    g = {
      id: 'g_stage1',
      t: 'My goal',
      res: '',
      w: '',
      str: '',
      vis: '',
      s: '',
      m: '',
      l: '',
      td: '',
      p: 0
    };
    S.goals.unshift(g)
  }
  return g
};
const done5 = s => S.stg[s] || {};
const STAGES = [
  {
    n: 'Find Your Direction',
    e: '🧭',
    steps: [
      {
        h: 'Name your goal',
        p: 'Choose a goal that matters to you and say why.',
        f: [['goal', 'My goal', 'text'], ['why', 'Why does this goal matter to me?', 'area']],
        hook: o => { const g = G(); g.t = o.goal; g.w = o.why }
      },
      {
        h: 'Strengths and values',
        p: 'Pick what you can build on.',
        f: [
          [
            'strengths',
            'My strengths',
            'multi',
            ['Curious', 'Persistent', 'Creative', 'Organised', 'Fast learner', 'Good communicator']
          ],
          [
            'values',
            'What I value',
            'multi',
            ['Growth', 'Independence', 'Impact', 'Stability', 'Creativity', 'Helping others']
          ]
        ],
        hook: o => { G().str = o.strengths.join(', ') }
      }
    ]
  },
  {
    n: 'Make the Goal Clear',
    e: '🎯',
    steps: [
      {
        h: 'Define the result and milestones',
        p: 'Make it observable, then split it across time.',
        f: [
          ['res', 'What result will I be able to see or measure?', 'area'],
          ['s', 'Short-term milestone', 'text'],
          ['m', 'Mid-term milestone', 'text'],
          ['l', 'Long-term milestone', 'text']
        ],
        hook: o => { Object.assign(G(), {res: o.res, s: o.s, m: o.m, l: o.l}) }
      },
      {
        h: 'Refine unclear parts',
        p: 'What is still fuzzy about this goal?',
        f: [['vis', 'What is unclear, and how could I find out?', 'area'], ['td', 'Target date', 'date']],
        hook: o => { const g = G(); g.vis = o.vis; g.td = o.td }
      }
    ]
  },
  {
    n: 'Choose the Right Work',
    e: '🪴',
    steps: [
      {
        h: 'The 80/20 sort',
        p: 'Mark each task: does it create real progress (high impact) or is it busywork?',
        r: () => pend().length ? pend().slice(0, 8).map(t => `<div class="row">
            ${esc(t.t)}<span><button class="chip ${t.imp==='H'?'ok':''}" onclick="imp('${t.id}','H')">High impact</button><button class="chip ${t.imp==='L'?'bad':''}" onclick="imp('${t.id}','L')">Low impact</button></span>
          </div>`).join('') : '<p>Add tasks in To-do first.</p>',
        ok: () => pend().slice(0, 8).every(t => t.imp) && pend().length > 0
      },
      {
        h: 'Pick your Top 3 for today',
        p: 'Choose up to three tasks that matter most.',
        r: () => pend().map(t => `<div class="row">
            ${esc(t.t)} <button class="chip ${t.mit?'ok':''}" onclick="mit('${t.id}')">${t.mit?'⭐ Top 3':'☆ Add'}</button>
          </div>`).join('') || '<p>No tasks yet.</p>',
        ok: () => S.todos.some(t => t.mit && !t.done)
      }
    ]
  },
  {
    n: 'Build a Focus Routine',
    e: '⏱️',
    steps: [
      {
        h: 'Plan a time block',
        p: 'Give one task a set slot, matched to your energy.',
        f: [
          ['task', 'Task for this block', 'select', () => pend().map(t => t.t).concat(['Free focus'])],
          ['time', 'Start time', 'time'],
          ['dur', 'Duration (minutes)', 'range', [10, 90]],
          ['energy', 'Energy needed', 'select', ['High', 'Medium', 'Low']]
        ],
        hook: o => {
          S.blocks.unshift({id: uid(), task: o.task, time: o.time, d: +o.dur, energy: o.energy})
        }

      },
      {
        h: 'Practise without interruption',
        p: 'Run one real focus session in the Focus Timer.',
        go: 'timer',
        label: 'Open Focus Timer',
        ok: () => S.sessions.length > 0
      }
    ]
  },
  {
    n: 'Remove Friction',
    e: '🧹',
    steps: [
      {
        h: 'Distraction audit',
        p: 'Be honest, then set one boundary.',
        f: [
          [
            'main',
            'Biggest distraction',
            'select',
            ['Social media', 'Notifications', 'Noise', 'Messy desk', 'Other tasks']
          ],
          ['hrs', 'Hours lost per day', 'range', [0, 8]],
          ['rule', 'My boundary rule', 'text'],
          ['prep', 'One thing I will prepare before focusing', 'text']
        ],
        hook: o => {}
      },
      {
        h: 'Prepare your environment',
        p: 'Finish the Focus Shield checklist.',
        go: 'shield',
        label: 'Open Focus Shield',
        ok: () => S.shield.every(x => x)
      }
    ]
  },
  {
    n: 'Protect Your Energy',
    e: '🌿',
    steps: [
      {
        h: 'Your energy plan',
        p: 'Work with your body, not against it.',
        f: [
          ['win', 'Best focus window', 'select', ['Morning', 'Afternoon', 'Evening']],
          [
            'brk',
            'Break rule',
            'select',
            ['5 min after each 25 min', '10 min after each 50 min', 'Break when focus drops']
          ],
          ['sleep', 'Sleep target (hours)', 'range', [5, 10]]
        ],
        hook: o => { S.energy = o.win }
      },
      {
        h: 'Low-energy plan',
        p: 'What will you do when energy is low?',
        f: [['low', 'On low-energy days I will…', 'area']]
      }
    ]
  },
  {
    n: 'Review and Improve',
    e: '🔄',
    steps: [
      {
        h: 'Weekly review',
        p: 'Look back, then choose one improvement.',
        f: [
          ['wins', 'What went well?', 'area'],
          ['dist', 'What got in the way?', 'area'],
          ['next', 'One improvement for next week', 'text']
        ],
        hook: o => {
          S.reviews.unshift({
            d: today(),
            m: '🙂 Weekly',
            rate: 7,
            wins: o.wins,
            dist: o.dist,
            energy: '',
            next: o.next
          })
        }

      },
      {
        h: 'Refine a goal',
        p: 'Update your progress on a goal.',
        f: [['gp', 'Progress on my main goal (%)', 'range', [0, 100]]],
        hook: o => { G().p = +o.gp }
      }
    ]
  }
];
const imp = (id, v) => { S.todos.find(t => t.id == id).imp = v; save(); draw() };
let L = {i: 0, s: 0};
function open_(s) {
  page = 'roadmap';
  lesson = s;
  L = {i: 0, s};
  draw()
}

function fld(f) {
  const id = 'sf_' + f[0], v = done5(L.s)[f[0]], o = typeof f[3] === 'function' ? f[3]() : f[3], t = f[2];
  if (t === 'area') return ta(id, f[1], v || '');
  if (t === 'select') return `<label class="f">
      ${f[1]}<select id="${id}">${o.map(x=>`<option ${x==v?'selected':''}>${esc(x)}</option>`).join('')}</select>
    </label>`;
  if (t === 'range') return `<label class="f">
      ${f[1]}: <b id="${id}_o">${v||o[0]}</b><input id="${id}" type="range" min="${o[0]}" max="${o[1]}" value="${v||o[0]}" oninput="document.getElementById('${id}_o').textContent=this.value">
    </label>`;
  if (t === 'multi') return `<div class="f">
      ${f[1]}
    </div>
    <div class="chips" id="${id}">
      ${o.map(x=>`<button type="button" class="chip ${(v||[]).includes(x)?'sel':''}" onclick="this.classList.toggle('sel')">${x}</button>`).join('')}
    </div>`;
  return inp(id, f[1], v || (t === 'time' ? '09:00' : ''), t)
}

function lessonView() {
  const st = STAGES[L.s], sp = st.steps[L.i], n = st.steps.length, last = L.i == n - 1;
  const body = sp.f ? sp.f.map(fld).join('') : sp.go ? `<button class="btn alt" onclick="go('${sp.go}')">${sp.label}</button> ${sp.ok()?'✅ done':''}` : sp.r();
  const btn = sp.f ? `<button class="btn" onclick="stepSave()">${last?'Save & finish stage':'Save & continue'}</button>` : `<button class="btn" ${sp.ok()?'':'disabled'} onclick="stepNext()">${last?'Finish stage':'Continue'}</button>`;
  return `<div class="card">
      <div class="bar">
        <i style="width:${L.i/n*100}%"></i>
      </div>
      <small>Stage ${L.s+1} · Step ${L.i+1} of ${n}</small>
      <h2>
        ${st.e} ${sp.h}
      </h2>
      <p>
        ${sp.p}
      </p>
      ${body}
      <div style="margin-top:14px">
        <button class="btn alt" onclick="go('roadmap')">Exit</button> ${btn}
      </div>
    </div>`
}

// Reads the form fields of the current roadmap step, validates and saves them.
function stepSave() {
  const sp = STAGES[L.s].steps[L.i], o = {};
  for (const f of sp.f) {
    const el = document.getElementById('sf_' + f[0]);
    o[f[0]] = f[2] === 'multi' ? [...el.querySelectorAll('.sel')].map(x => x.textContent) : el.value.trim();
    if (f[2] !== 'date' && (f[2] === 'multi' ? !o[f[0]].length : !o[f[0]])) return toast('Please complete: ' + f[1])
  }
  S.stg[L.s] = Object.assign(S.stg[L.s] || {}, o);
  if (sp.hook) sp.hook(o);
  save();
  stepNext()
}

function stepNext() {
  const n = STAGES[L.s].steps.length;
  if (L.i < n - 1) { L.i++; draw() }  else {
    if (!S.stages.includes(L.s)) S.stages.push(L.s);
    reward('stage' + L.s, 30, 'Stage ' + (L.s + 1) + ' complete! 🎉');
    go('roadmap')
  }

}

const T = {
  title: 'Free focus',
  label: 'Free focus',
  total: 1500,
  left: 1500,
  run: false,
  started: false,
  iv: null,
  pauses: 0,
  pausedSec: 0,
  pAt: 0,
  t0: 0,
  kind: 'focus',
  id: null
};
// ==========================================================
// 8. FOCUS TIMER & TIME BLOCKING
// ==========================================================
let ac, ns;
function noise() {
  stopN();
  const k = S.set.snd || 0;
  if (!k) return;
  ac = ac || new AudioContext();
  const b = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  ns = ac.createBufferSource();
  ns.buffer = b;
  ns.loop = true;
  const f = ac.createBiquadFilter(), g = ac.createGain();
  f.type = 'lowpass';
  f.frequency.value = [0, 1400, 600, 900][k];
  g.gain.value = .06;
  ns.connect(f);
  f.connect(g);
  g.connect(ac.destination);
  ns.start()
}

const stopN = () => { try { ns && ns.stop() } catch (e) {} ns = null };
function paint() {
  const c = $('#clock');
  if (!c) return;
  c.textContent = String(Math.floor(T.left / 60)).padStart(2, '0') + ':' + String(T.left % 60).padStart(2, '0');
  $('#arc').style.strokeDashoffset = 326.7 * (1 - T.left / T.total)
}

function toggleT() {
  if (T.run) {
    clearInterval(T.iv);
    T.run = false;
    T.pauses++;
    T.pAt = Date.now();
    stopN()
  }  else {
    if (!T.started) { T.started = true; T.t0 = Date.now() }  else if (T.pAt) { T.pausedSec += (Date.now() - T.pAt) / 1e3; T.pAt = 0 }
    T.run = true;
    noise();
    T.iv = setInterval(() => { T.left--; paint(); if (T.left <= 0) finishT(true) }, 1000)
  }
  draw()
}

function pickT(b) {
  const l = b.textContent;
  T.label = l;
  if (l.startsWith('📝')) {
    const t = S.todos.find(x => '📝 ' + x.t === l && !x.done);
    Object.assign(T, {title: t.t, id: t.id, kind: 'task', total: t.d * 60, left: t.d * 60})
  }  else if (l.startsWith('🎓')) {
    const p = S.prac.find(x => '🎓 ' + x.t === l && !x.done);
    Object.assign(T, {title: p.t, id: p.id, kind: 'practice', total: p.d * 60, left: p.d * 60})
  }  else Object.assign(T, {title: 'Free focus', id: null, kind: 'focus'});
  draw()
}

function resetT() {
  clearInterval(T.iv);
  stopN();
  Object.assign(T, {run: false, started: false, left: T.total, pauses: 0, pausedSec: 0, pAt: 0});
  draw()
}

function setDur(m) {
  if (T.started) return;
  T.total = T.left = m * 60;
  draw()
}

function stopT() {
  if (confirm('End the session now? Time focused so far is saved.')) finishT(false)
}

// Ends a session: saves start/end time, pauses and minutes, then rewards XP.
function finishT(full) {
  clearInterval(T.iv);
  stopN();
  if (T.pAt) T.pausedSec += (Date.now() - T.pAt) / 1e3;
  const m = Math.round((T.total - T.left) / 60), n = new Date(), tm = d => d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  if (m >= 1 || full) {
    S.sessions.unshift({
      title: T.title,
      kind: T.kind,
      mins: full ? Math.round(T.total / 60) : m,
      pauses: T.pauses,
      pausedSec: Math.round(T.pausedSec),
      start: tm(new Date(T.t0)),
      end: tm(n),
      date: today(),
      hour: new Date(T.t0).getHours()
    });
    S.days[today()] = mins() + (full ? Math.round(T.total / 60) : m)
  }
  if (full) {
    if (T.kind === 'task') {
      const t = S.todos.find(x => x.id == T.id);
      if (t && !t.done) { t.done = true; t.doneAt = today(); reward('t' + t.id, 15) }

    }
    if (T.kind === 'practice') {
      const p = S.prac.find(x => x.id == T.id);
      if (p && !p.done) { p.done = true; reward('p' + p.id, 15) }

    }
    reward('sess' + Date.now(), 10, 'Session complete — great focus! 🌟');
    notify('FocusPath', 'Session complete 🌟 Take a short break!');
    if (S.set.alarm) beep();
    alert('🌟 Session complete! You focused for ' + Math.round(T.total / 60) + ' minutes. Take a short break.')
  }
  Object.assign(T, {
    run: false,
    started: false,
    left: T.total,
    pauses: 0,
    pausedSec: 0,
    pAt: 0,
    title: 'Free focus',
    label: 'Free focus',
    id: null,
    kind: 'focus'
  });
  save();
  draw()
}

function beep() {
  try {
    const c = new AudioContext();
    [0, .3, .6].forEach(d => {
      const o = c.createOscillator();
      o.connect(c.destination);
      o.frequency.value = 880;
      o.start(c.currentTime + d);
      o.stop(c.currentTime + d + .2)
    })
  }  catch (e) {}
}

function startTask(id) {
  const t = S.todos.find(x => x.id == id);
  T.label = '📝 ' + t.t;
  Object.assign(T, {
    title: t.t,
    id,
    kind: 'task',
    total: t.d * 60,
    left: t.d * 60,
    started: false,
    pauses: 0,
    pausedSec: 0
  });
  go('timer')
}

function startPractice(id) {
  const p = S.prac.find(x => x.id == id);
  T.label = '🎓 ' + p.t;
  Object.assign(T, {
    title: p.t,
    id,
    kind: 'practice',
    total: p.d * 60,
    left: p.d * 60,
    started: false,
    pauses: 0,
    pausedSec: 0
  });
  go('timer')
}

setInterval(() => {
  const n = new Date(), hm = String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0');
  S.todos.forEach(t => {
    if (!t.done && !t.rem && t.date === today() && t.time === hm) { t.rem = 1; notify('Task reminder', t.t); toast('⏰ ' + t.t); save() }

  });
  S.prac.forEach(p => {
    if (!p.done && !p.rem && p.date === today() && p.time === hm) { p.rem = 1; notify('Practice time', p.t); toast('⏰ ' + p.t); save() }

  })
}, 20000);
draw();
// ==========================================================
// 9. PROFILE
// ==========================================================
function saveProfile() {
  const n = $v('pf1').trim();
  if (!n) return toast('Please enter your name');
  Object.assign(S.profile, {
    name: n,
    user: $v('pf2').trim(),
    email: $v('pf3').trim(),
    bio: $v('pf4').trim(),
    avatar: sel('pav') || S.profile.avatar
  });
  if (!S.profile.joined) S.profile.joined = today();
  toast('Profile saved ✓');
  go('profile')
}

function photo(inp) {
  const f = inp.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    const im = new Image();
    im.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = 160;
      const x = c.getContext('2d'), s = Math.min(im.width, im.height);
      x.drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, 0, 0, 160, 160);
      S.profile.photo = c.toDataURL('image/jpeg', .8);
      save();
      toast('Photo added');
      draw()
    };
    im.src = r.result
  };
  r.readAsDataURL(f)
}
