// ✏️ Yahan uska naam likho
const HER_NAME = "Bully";

document.querySelectorAll('.her-name').forEach(el => el.textContent = HER_NAME);

const funnyMsgs = [
  "Kyu click kar rahi ho? Pagal ho kya? 😤",
  "Aisa karogi? 🥺",
  "Galat button hai madam 🙄",
  "Aaj No allowed nahi hai, birthday rules 😌",
  "Pakad ke dikhao 😜",
  "Itni ziddi kyu ho yaar? 😂",
  "Ye button sirf decoration ke liye hai 😏",
  "Arey arey, phir se? 🤦‍♂️",
  "No ka stock khatam ho gaya 📦",
  "Ye button aaj chhutti pe hai 🏖️",
  "Kitna bhaagogi iske peeche? 🏃‍♀️",
  "Birthday hai tumhara isliye maaf kiya Bully 😒",
  "Haar maan lo, Yes hi dabana padega 😎",
  "Ek kaam karo, Yes try karo 🙃",
];
const noLabels = ["No", "Pakka? 🤨", "Soch lo 🥺", "Phir se socho 😢", "Nahi maanogi? 😭", "Please 🙏", "Bilkul nahi 😤"];

const toast = document.getElementById('toast');
let toastTimer, msgIndex = 0;
function showToast(text) {
  toast.textContent = text;
  toast.classList.remove('show'); void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1900);
}

const pages = [...document.querySelectorAll('.page')];
const steps = [...document.querySelectorAll('[data-step]')];
let current = 0;

// progress dots
steps.forEach((page, idx) => {
  page.querySelector('.dots').innerHTML = steps.map((_, i) => `<i class="${i <= idx ? 'on' : ''}"></i>`).join('');
});

function goTo(i) {
  // flying No buttons live on <body>, so hide them all when the page changes
  document.querySelectorAll('.no').forEach(n => { if (n.classList.contains('flying') || pages[current].contains(n)) n.style.display = 'none'; });
  pages[current].classList.remove('active');
  if (i >= pages.length) return enterParty();
  current = i;
  pages[current].classList.add('active');
  burst(12);
  if (pages[current].hasAttribute('data-type')) typeOut();
}

// keep a fixed-position element fully inside the visible screen
function screenBox() {
  const vv = window.visualViewport;
  return vv ? { w: vv.width, h: vv.height, x: vv.offsetLeft, y: vv.offsetTop } : { w: innerWidth, h: innerHeight, x: 0, y: 0 };
}

steps.forEach(page => {
  const yes = page.querySelector('.yes');
  const no = page.querySelector('.no');
  let tries = 0;

  no.addEventListener('click', e => {
    e.preventDefault();
    tries++;
    showToast(funnyMsgs[msgIndex++ % funnyMsgs.length]);
    if (navigator.vibrate) navigator.vibrate(40);
    no.textContent = noLabels[Math.min(tries, noLabels.length - 1)];
    yes.style.setProperty('--grow', Math.min(1 + tries * 0.06, 1.3));

    if (!no.classList.contains('flying')) {
      const r = no.getBoundingClientRect();
      document.body.appendChild(no); // card has backdrop-filter, which would make "fixed" relative to the card
      no.style.left = r.left + 'px';
      no.style.top = r.top + 'px';
      no.classList.add('flying');
      void no.offsetWidth;
    }

    const box = screenBox();
    const pad = 18, topPad = 90; // leave room for the toast at top
    const bw = no.offsetWidth, bh = no.offsetHeight;
    const minX = box.x + pad, maxX = box.x + box.w - bw - pad;
    const minY = box.y + topPad, maxY = box.y + box.h - bh - pad;
    const yr = yes.getBoundingClientRect();
    const nr = no.getBoundingClientRect();
    let x, y, tries2 = 0, overlapsYes, tooClose;
    do {
      x = minX + Math.random() * Math.max(0, maxX - minX);
      y = minY + Math.random() * Math.max(0, maxY - minY);
      tries2++;
      overlapsYes = x < yr.right + 12 && x + bw > yr.left - 12 && y < yr.bottom + 12 && y + bh > yr.top - 12;
      tooClose = Math.hypot(x - nr.left, y - nr.top) < 90;
    } while (tries2 < 40 && (overlapsYes || tooClose));
    no.style.left = Math.round(x) + 'px';
    no.style.top = Math.round(y) + 'px';
    no.style.transform = `rotate(${Math.round(Math.random() * 12 - 6)}deg)`;
    setTimeout(clampFlying, 320);
  });

  yes.addEventListener('click', () => goTo(pages.indexOf(page) + 1));
});

// if screen size changes (rotate phone / keyboard), pull a flying No back on screen
function clampFlying() {
  const box = screenBox();
  document.querySelectorAll('.no.flying').forEach(no => {
    const x = Math.min(Math.max(parseFloat(no.style.left), box.x + 18), box.x + box.w - no.offsetWidth - 18);
    const y = Math.min(Math.max(parseFloat(no.style.top), box.y + 90), box.y + box.h - no.offsetHeight - 18);
    no.style.left = x + 'px'; no.style.top = y + 'px';
  });
}
addEventListener('resize', clampFlying);
if (window.visualViewport) visualViewport.addEventListener('resize', clampFlying);

// typewriter for the emotional page
const lines = [
  "Mujhe sach mein nahi pata ki <span class='hl'>hamara rishta kya hai</span>... dost, best friend, ya kuch aur 🤷",
  "Aur shayad iska koi naam hona zaroori bhi nahi. Kuch rishte naam se nahi, <span class='hl'>ehsaas se chalte hai</span>.",
  "Main tumse ladta hu, tumhe bully karta hu, pareshaan karta hu... par sach bolu? <span class='hl'>Tumhare bina sab kuch adhoora lagta hai</span> 🥹",
  "Bas itna yaad rakhna, din ho ya raat, khushi ho ya aansu, <span class='hl'>main hamesha tumhare saath rahunga</span>. Bina kuch puche, bina kuch maange 🤍",
];
let typed = false;
function typeOut() {
  if (typed) return; typed = true;
  const el = document.getElementById('typeText');
  const html = lines.join('<br><br>');
  let i = 0, out = '';
  (function step() {
    if (i >= html.length) {
      el.innerHTML = html;
      document.getElementById('typeAfter').classList.add('show');
      return;
    }
    if (html[i] === '<') { const end = html.indexOf('>', i); out += html.slice(i, end + 1); i = end + 1; }
    else { out += html[i++]; }
    el.innerHTML = out + '<span class="cursor"></span>';
    setTimeout(step, html[i - 1] === '.' || html[i - 1] === ',' ? 220 : 32);
  })();
}

// floating hearts / sparkles
const floaters = document.getElementById('floaters');
const icons = ['💖', '🌸', '✨', '🎈', '💫', '🌷', '🎀'];
function spawn() {
  if (document.body.classList.contains('party')) return;
  const s = document.createElement('span');
  s.textContent = icons[Math.floor(Math.random() * icons.length)];
  s.style.left = Math.random() * 100 + 'vw';
  s.style.fontSize = 14 + Math.random() * 20 + 'px';
  s.style.animationDuration = 6 + Math.random() * 6 + 's';
  floaters.appendChild(s);
  setTimeout(() => s.remove(), 13000);
}
function burst(n) { for (let i = 0; i < n; i++) setTimeout(spawn, i * 80); }
setInterval(spawn, 750);

// confetti + fireworks
const cv = document.getElementById('confetti');
const ctx = cv.getContext('2d');
let pieces = [], running = false;
function resize() { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); }
addEventListener('resize', resize); resize();
const colors = ['#ff4d8d', '#ffb6d0', '#ffd166', '#b388ff', '#7ee8fa', '#ffffff'];
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
function confetti(n = 160) {
  for (let i = 0; i < n; i++) {
    pieces.push({
      x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight / 2.4,
      vx: (Math.random() - .5) * 13, vy: -Math.random() * 14 - 4,
      w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
      r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3,
      c: pick(colors), life: 0,
    });
  }
  animate();
}
function firework(x, y) {
  const c = pick(colors);
  for (let i = 0; i < 70; i++) {
    const a = (Math.PI * 2 * i) / 70, sp = 2 + Math.random() * 4;
    pieces.push({ spark: true, x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, c: Math.random() < .3 ? '#fff' : c, life: 0, max: 55 + Math.random() * 30 });
  }
  animate();
}
function fireworkShow(n = 6) {
  for (let i = 0; i < n; i++) {
    setTimeout(() => firework(innerWidth * (.15 + Math.random() * .7), innerHeight * (.12 + Math.random() * .35)), i * 450);
  }
}
function animate() { if (!running) { running = true; requestAnimationFrame(tick); } }
function tick() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  pieces.forEach(p => {
    p.life++;
    if (p.spark) {
      p.vx *= .97; p.vy = p.vy * .97 + .05; p.x += p.vx; p.y += p.vy;
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
      ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    } else {
      p.vy += .32; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.cos(p.life * .1));
      ctx.restore();
    }
  });
  pieces = pieces.filter(p => p.spark ? p.life < p.max : p.y < innerHeight + 40);
  if (pieces.length) requestAnimationFrame(tick); else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
}

// ---------- party room ----------
const stage = document.getElementById('stage');
const controls = document.getElementById('controls');
const cap = document.getElementById('cap');
const stageBtn = document.getElementById('stageBtn');
const cake = document.getElementById('cake');
const partyColors = ['#ffd166', '#ff4d8d', '#7ee8fa', '#8ef58e', '#b388ff', '#ff9f43', '#ff6b6b'];

// bulbs hanging along a curved wire
const bulbsEl = document.getElementById('bulbs');
const BULBS = 9;
for (let i = 0; i < BULBS; i++) {
  const f = (i + .5) / BULBS;
  const w = document.createElement('div');
  w.className = 'bulb-wrap';
  w.style.marginTop = Math.round(22 * (1 - (2 * f - 1) ** 2) - 4) + 'px';
  w.innerHTML = `<div class="bulb" style="--c:${partyColors[i % partyColors.length]};animation-delay:${(i % 3) * .35}s"></div>`;
  bulbsEl.appendChild(w);
}

// "HAPPY BIRTHDAY" flags
document.getElementById('flags').innerHTML = [...'HAPPY BIRTHDAY'].map((ch, i) =>
  ch === ' ' ? '<div class="flag gap"></div>'
    : `<div class="flag" style="--c:${partyColors[i % partyColors.length]};animation-delay:${-(i % 4) * .6}s">${ch}</div>`
).join('');

// one balloon per letter of her name
const balloonLayer = document.getElementById('balloons');
const letters = [...HER_NAME.replace(/\s/g, '').toUpperCase()].slice(0, 9);
const balloons = letters.map((ch, i) => {
  const b = document.createElement('div');
  b.className = 'balloon';
  b.style.setProperty('--n', letters.length);
  b.style.setProperty('--c', partyColors[(i + 1) % partyColors.length]);
  b.style.left = (10 + Math.random() * 80) + '%';
  b.innerHTML = `<div class="body" style="animation-delay:${-i * .5}s">${ch}</div><div class="string"></div>`;
  balloonLayer.appendChild(b);
  return b;
});
let floatTimer;
function floatBalloons() {
  const W = stage.clientWidth, H = stage.clientHeight;
  balloons.forEach(b => {
    b.style.left = Math.round(8 + Math.random() * (W - b.offsetWidth - 16)) + 'px';
    b.style.top = Math.round(H * (.2 + Math.random() * .45)) + 'px';
  });
}
function alignBalloons() {
  clearInterval(floatTimer);
  const W = stage.clientWidth;
  const top = document.querySelector('.stage-top').getBoundingClientRect().bottom + 4;
  const bw = balloons[0].offsetWidth, gap = 8;
  const total = balloons.length * bw + (balloons.length - 1) * gap;
  balloons.forEach((b, i) => {
    b.classList.add('aligned');
    b.style.left = Math.round((W - total) / 2 + i * (bw + gap)) + 'px';
    b.style.top = Math.round(top + (i % 2) * 10) + 'px';
  });
}

// Music: agar folder mein song.mp3 rakha hai toh wo bajega, warna music-box wala Happy Birthday
let actx, master, nextStart, muted = false, song;
const NOTE = { F2: 87.31, G2: 98, C3: 130.81, G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
// [melody note, beats, bass note]
const TUNE = [
  ['G4', .75], ['G4', .25], ['A4', 1, 'C3'], ['G4', 1], ['C5', 1], ['B4', 2, 'G2'],
  ['G4', .75], ['G4', .25], ['A4', 1, 'G2'], ['G4', 1], ['D5', 1], ['C5', 2, 'C3'],
  ['G4', .75], ['G4', .25], ['G5', 1, 'C3'], ['E5', 1], ['C5', 1], ['B4', 1, 'F2'], ['A4', 2],
  ['F5', .75], ['F5', .25], ['E5', 1, 'C3'], ['C5', 1], ['D5', 1, 'G2'], ['C5', 3, 'C3'],
];
const BEAT = .52;
function bell(freq, t, vol, decay) {
  const g = actx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + .01);
  g.gain.exponentialRampToValueAtTime(.0005, t + decay);
  g.connect(master);
  [[1, 1], [2, .25], [3, .08]].forEach(([mul, v]) => {
    const o = actx.createOscillator(), og = actx.createGain();
    o.type = 'sine'; o.frequency.value = freq * mul; og.gain.value = v;
    o.connect(og).connect(g);
    o.start(t); o.stop(t + decay + .05);
  });
}
function scheduleTune() {
  let t = nextStart;
  TUNE.forEach(([n, beats, bass]) => {
    bell(NOTE[n], t, .3, 1.6);
    bell(NOTE[n] * 2, t + .004, .04, .6); // little sparkle on top
    if (bass) bell(NOTE[bass], t, .22, 2.4);
    t += beats * BEAT;
  });
  nextStart = t + BEAT * 3;
  setTimeout(scheduleTune, Math.max(0, (nextStart - actx.currentTime - .6) * 1000));
}
function startSynth() {
  try {
    actx = new (window.AudioContext || window.webkitAudioContext)();
    master = actx.createGain(); master.gain.value = .55; master.connect(actx.destination);
    nextStart = actx.currentTime + .15;
    scheduleTune();
  } catch (e) { /* no audio support, party continues */ }
}
function startMusic() {
  if (song || actx) return;
  document.getElementById('musicToggle').classList.add('show');
  song = new Audio('song.mp3');
  song.loop = true; song.volume = .8;
  song.play().catch(() => { song = null; startSynth(); });
}
document.getElementById('musicToggle').addEventListener('click', e => {
  e.stopPropagation();
  muted = !muted;
  if (song) song.muted = muted;
  if (actx) master.gain.setTargetAtTime(muted ? 0 : .55, actx.currentTime, .05);
  e.currentTarget.textContent = muted ? '🔇' : '🔊';
});

// step-by-step party, like switching things on in a dark room
function showControl(text, btnText, onClick) {
  controls.classList.add('hide');
  setTimeout(() => {
    cap.textContent = text;
    stageBtn.hidden = !btnText;
    stageBtn.textContent = btnText || '';
    stageBtn.onclick = onClick ? () => { stageBtn.onclick = null; onClick(); } : null;
    controls.classList.remove('hide');
  }, 450);
}

const flow = [
  { cap: "Arey, itna andhera kyu hai? 🙈", btn: "Light jalao 💡", run: () => stage.classList.add('lit') },
  { cap: "Wah! Ab thoda music ho jaaye? 🎶", btn: "Music chalao 🎵", run: startMusic },
  { cap: "Thodi decoration bhi banti hai 😌", btn: "Decoration karo 🎊", run: () => document.getElementById('bunting').classList.add('show') },
  { cap: "Balloons ke bina kaisi party? 🎈", btn: "Balloons udao 🎈", run: () => { floatBalloons(); floatTimer = setInterval(floatBalloons, 4500); } },
  { cap: "Ab sabse important cheez... 🤤", btn: "Cake lao 🎂", run: () => document.getElementById('cakeWrap').classList.add('show') },
  { cap: "Candles ke bina cake adhoora hai 🥲", btn: "Candles jalao 🕯️", run: () => cake.classList.add('lit') },
  { cap: "Sab ready hai... ab bolo? 🥳", btn: "Happy Birthday! 🎉", run: wish },
];
function runFlow(i) {
  if (i >= flow.length) return;
  const s = flow[i];
  showControl(s.cap, s.btn, () => { s.run(); if (i < flow.length - 1) setTimeout(() => runFlow(i + 1), 900); });
}

function enterParty() {
  document.body.classList.add('party');
  runFlow(0);
}

function wish() {
  alignBalloons();
  document.getElementById('wishTitle').classList.add('show');
  fireworkShow(5);
  setTimeout(() => confetti(200), 400);
  showControl("Aankhein band karo, wish maango, aur candles pe tap karke bujhao 🌬️");
}

cake.addEventListener('click', () => {
  if (!cake.classList.contains('lit') || cake.classList.contains('blown') || !document.getElementById('wishTitle').classList.contains('show')) return;
  cake.classList.add('blown');
  confetti(260);
  fireworkShow(8);
  if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
  showControl("Wish ho gayi! Ab ye poori bhi hogi 🌟", "Tumhare liye ek message 💌", playStory);
});

// message that appears one line at a time
const storyLines = [
  "Aaj ka din...",
  "baaki dino jaisa hi lagta hai",
  "par ek fark hai",
  "aaj ke din tum is duniya mein aayi thi ✨",
  "aur duniya thodi aur khoobsurat ho gayi 🌸",
  "ek saal aur nikal gaya",
  "palak jhapakte hi ⏳",
  "kitni baatein, kitne jhagde",
  "kitni hasi, kitni bak-bak 😂",
  "aur sach bolu?",
  "har ek pal sambhaal ke rakha hai maine 🥹",
  "kuch baatein seedhe keh nahi paata...",
  "toh socha aaj shayari mein keh du ✍️",
  ["Tujhe nigaahon se kab dekha hai maine,", "Tujhe toh apne khwaabon mein mehsoos kiya hai maine."],
  ["Tu chaand ka tukda hai, ye zamaana kehta hai,", "Maine toh tujhmein apna poora aasmaan dekha hai."],
  ["Teri soorat ko lafzon mein bayaan kaise karun,", "Tujhe sochkar hi toh har ghazal likhi hai maine."],
  "pata hai...",
  "tumhara ek chhota sa 'kya kar rahe ho?'",
  "mera poora din theek kar deta hai 📱",
  "aur jis din baat nahi hoti",
  "us din sab kuch adhoora sa lagta hai 🥲",
  ["Tu saamne ho toh shayad kuch keh bhi na sakun,", "Tujhse mohabbat toh khaamoshi mein ki hai maine."],
  "aage ka raasta hamesha aasaan nahi hoga",
  "kabhi thakaan hogi, kabhi aansu",
  "par darna mat",
  "kyunki tum akeli nahi ho",
  "main hamesha yahin hu 🤍",
  "bina kuch puche, bina kuch maange",
  ["Tujhe paane ki zid kabhi ki hi nahi,", "Teri khushi mein bhi apna sukoon dhoondha hai maine."],
  "bas tum hamesha aise hi muskurati rehna",
  "tum jaisi ho na...",
  "waisi hi perfect ho 💫",
  "apni smile kabhi kam mat hone dena",
  "kyunki wo mera pura din bana deti hai 😊",
  `aur haan ${HER_NAME}...`,
  "No button wali harkat maine sab dekhi hai 😏",
  "last mein...",
  "ek baar phir se...",
  `Happy Birthday ${HER_NAME} 🎂💖`,
];
const storyEl = document.getElementById('story');
let storyIndex = 0, storyTimer, storyOn = false;
function playStory() {
  storyOn = true;
  stage.classList.add('story-mode');
  showControl("👆 tap karo aage badhne ke liye");
  setTimeout(nextLine, 700);
}
function nextLine() {
  clearTimeout(storyTimer);
  if (storyIndex >= storyLines.length) return finale();
  const line = storyLines[storyIndex++];
  storyEl.innerHTML = '';
  const p = document.createElement('p');
  // array = shayari couplet, shown together in handwriting style
  if (Array.isArray(line)) {
    p.className = 'shayari';
    line.forEach(l => { const s = document.createElement('span'); s.textContent = l; p.appendChild(s); });
  } else {
    p.textContent = line;
  }
  storyEl.appendChild(p);
  const text = [].concat(line).join(' ');
  storyTimer = setTimeout(nextLine, (Array.isArray(line) ? 3500 : 1800) + text.length * 45);
}
stage.addEventListener('click', e => {
  if (storyOn && !e.target.closest('button')) nextLine();
});

function finale() {
  storyOn = false;
  storyEl.innerHTML = '';
  stage.classList.remove('story-mode');
  document.getElementById('sign').classList.add('show');
  fireworkShow(8);
  confetti(220);
  showControl("", "Phir se dekho 🔁", () => location.reload());
}
