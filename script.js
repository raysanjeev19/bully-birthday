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
  const oldNo = pages[current].querySelector('.no');
  if (oldNo) oldNo.style.display = 'none';
  pages[current].classList.remove('active');
  current = i;
  pages[current].classList.add('active');
  burst(12);
  if (pages[current].hasAttribute('data-type')) typeOut();
  if (pages[current].id === 'final') { confetti(220); setTimeout(() => confetti(140), 700); }
}

// keep a fixed-position element fully inside the visible screen
function screenBox() {
  const vv = window.visualViewport;
  return vv ? { w: vv.width, h: vv.height, x: vv.offsetLeft, y: vv.offsetTop } : { w: innerWidth, h: innerHeight, x: 0, y: 0 };
}

steps.forEach((page, idx) => {
  const yes = page.querySelector('.yes');
  const no = page.querySelector('.no');
  let tries = 0;

  no.addEventListener('click', e => {
    e.preventDefault();
    tries++;
    showToast(funnyMsgs[msgIndex++ % funnyMsgs.length]);
    if (navigator.vibrate) navigator.vibrate(40);
    no.textContent = noLabels[Math.min(tries, noLabels.length - 1)];
    yes.style.setProperty('--grow', Math.min(1 + tries * 0.08, 1.5));

    if (!no.classList.contains('flying')) {
      const r = no.getBoundingClientRect();
      no.style.left = r.left + 'px';
      no.style.top = r.top + 'px';
      no.classList.add('flying');
      void no.offsetWidth;
    }

    const box = screenBox();
    const pad = 14, topPad = 80; // leave room for the toast at top
    const bw = no.offsetWidth, bh = no.offsetHeight;
    const minX = box.x + pad, maxX = box.x + box.w - bw - pad;
    const minY = box.y + topPad, maxY = box.y + box.h - bh - pad;
    const yr = yes.getBoundingClientRect();
    const nr = no.getBoundingClientRect();
    let x, y, tries2 = 0;
    do {
      x = minX + Math.random() * Math.max(0, maxX - minX);
      y = minY + Math.random() * Math.max(0, maxY - minY);
      tries2++;
      var overlapsYes = x < yr.right + 12 && x + bw > yr.left - 12 && y < yr.bottom + 12 && y + bh > yr.top - 12;
      var tooClose = Math.hypot(x - nr.left, y - nr.top) < 90;
    } while (tries2 < 40 && (overlapsYes || tooClose));
    no.style.left = Math.round(x) + 'px';
    no.style.top = Math.round(y) + 'px';
    no.style.transform = `rotate(${Math.round(Math.random() * 20 - 10)}deg)`;
  });

  yes.addEventListener('click', () => goTo(pages.indexOf(page) + 1));
});

// if screen size changes (rotate phone / keyboard), pull a flying No back on screen
function clampFlying() {
  const box = screenBox();
  document.querySelectorAll('.no.flying').forEach(no => {
    const x = Math.min(Math.max(parseFloat(no.style.left), box.x + 14), box.x + box.w - no.offsetWidth - 14);
    const y = Math.min(Math.max(parseFloat(no.style.top), box.y + 80), box.y + box.h - no.offsetHeight - 14);
    no.style.left = x + 'px'; no.style.top = y + 'px';
  });
}
addEventListener('resize', clampFlying);
if (window.visualViewport) visualViewport.addEventListener('resize', clampFlying);

// typewriter for the emotional page
const lines = [
  "Mujhe sach mein nahi pata ki <span class='hl'>hamara rishta kya hai</span>... dost, best friend, ya kuch aur 🤷",
  "Aur shayad iska koi naam hona zaroori bhi nahi. Kuch rishte naam se nahi, <span class='hl'>ehsaas se chalte hai</span>.",
  "Tum ladti ho, bully karti ho, pareshaan karti ho... par sach bolu? Tumhare bina sab kuch adhoora lagta hai 🥹",
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

// confetti
const cv = document.getElementById('confetti');
const ctx = cv.getContext('2d');
let pieces = [], running = false;
function resize() { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); }
addEventListener('resize', resize); resize();
const colors = ['#ff4d8d', '#ffb6d0', '#ffd166', '#b388ff', '#7ee8fa', '#ffffff'];
function confetti(n = 160) {
  for (let i = 0; i < n; i++) {
    pieces.push({
      x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight / 2.4,
      vx: (Math.random() - .5) * 13, vy: -Math.random() * 14 - 4,
      w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
      r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3,
      c: colors[Math.floor(Math.random() * colors.length)], life: 0,
    });
  }
  if (!running) { running = true; requestAnimationFrame(tick); }
}
function tick() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  pieces.forEach(p => {
    p.vy += .32; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
    ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.cos(p.life * .1));
    ctx.restore();
  });
  pieces = pieces.filter(p => p.y < innerHeight + 40);
  if (pieces.length) requestAnimationFrame(tick); else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
}

const cake = document.getElementById('cake');
cake.addEventListener('click', () => {
  if (cake.classList.contains('blown')) return;
  cake.classList.add('blown');
  document.getElementById('hint').textContent = 'Wish ho gayi! Ab ye poori bhi hogi 🌟';
  confetti(260);
  burst(28);
  setTimeout(() => {
    const letter = document.getElementById('letter');
    letter.classList.add('show');
    letter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 600);
});
