/* ============ EDIT YOUR CONTENT HERE ============ */
const TARGET = new Date(2026, 10, 15, 0, 0, 0); // 15 Nov 2026, 12:00 AM (viewer's local time)
const PASSWORD = "15.11.2005";
const CONTENT = {
  subi: {
    name: "Subi", other: "suji",
    letter: "Today the world gets to celebrate one of its brightest lights. Twenty-one years ago you arrived and everything became softer, louder and so much more fun.\n\n[Replace this with your own heartfelt letter - a memory, a thank-you, a wish for the year ahead.]",
    sign: "Forever yours, with all my love",
    caption: "Partners in crime"
  },
  suji: {
    name: "Suji", other: "subi",
    letter: "Happy 21st to my person, my mirror, my favourite chaos. You make every ordinary day feel like a celebration.\n\n[Replace this with your own heartfelt letter - a memory, a thank-you, a wish for the year ahead.]",
    sign: "Forever yours, with all my love",
    caption: "Best days with you"
  }
};
/* ================================================= */

const $ = s => document.querySelector(s);
const screens = ["lock","celebrate","verify"];
let twin = sessionStorage.getItem("twin") || null;
let unlocked = sessionStorage.getItem("unlocked") === "1";
let partyStarted = false;

// ---- stars
const stars = $("#stars");
for (let i = 0; i < 70; i++) {
  const s = document.createElement("i");
  s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s;opacity:${.4+Math.random()*.6}`;
  stars.appendChild(s);
}

// ---- screen routing
function show(id) {
  document.querySelectorAll(".screen,.page").forEach(e => e.classList.remove("active"));
  const el = document.getElementById(id);
  el.classList.add("active");
  window.scrollTo(0, 0);
  document.body.classList.toggle("party", id !== "lock");
  document.body.style.overflowX = "hidden";
}

// ---- countdown (real target date; preview with ?preview in URL)
const preview = new URLSearchParams(location.search).has("preview");
const pad = n => String(n).padStart(2, "0");
function tick() {
  const diff = TARGET - new Date();
  if (diff <= 0 || preview) { clearInterval(timer); startParty(); return; }
  $("#cd-d").textContent = pad(Math.floor(diff / 864e5));
  $("#cd-h").textContent = pad(Math.floor(diff / 36e5) % 24);
  $("#cd-m").textContent = pad(Math.floor(diff / 6e4) % 60);
  $("#cd-s").textContent = pad(Math.floor(diff / 1e3) % 60);
}
function startParty() {
  if (unlocked && twin) { openPage(twin); return; }
  show("celebrate");
  if (!partyStarted) { partyStarted = true; makeBalloons(); burst(); setTimeout(burst, 1200); setTimeout(burst, 2600); }
}
let timer;

// ---- balloons
function makeBalloons() {
  const cols = ["#E6A4B4", "#C8B6FF", "#F5D08A", "#FFCFB0", "#FDF2F4"], b = $("#balloons");
  for (let i = 0; i < 12; i++) {
    const d = document.createElement("div"); d.className = "bl";
    const left = i % 2 ? Math.random() * 8 : 90 + Math.random() * 8;
    d.style.cssText = `left:${left}%;background:${cols[i % 5]};animation-duration:${14 + Math.random() * 10}s;animation-delay:${-Math.random() * 14}s`;
    b.appendChild(d);
  }
}

// ---- confetti + fireworks (canvas)
const cv = $("#fx"), cx = cv.getContext("2d"); let parts = [], raf = null;
function size() { cv.width = innerWidth; cv.height = innerHeight; } size(); addEventListener("resize", size);
function burst() {
  const gold = ["#F5D08A", "#E6A4B4", "#C8B6FF", "#fff"];
  for (let i = 0; i < 110; i++) parts.push({ x: Math.random() * cv.width, y: -20, vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 4, w: 6 + Math.random() * 6, h: 10 + Math.random() * 10, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: gold[i % 4], life: 260, t: "c" });
  for (let k = 0; k < 3; k++) {
    const x = cv.width * (.2 + Math.random() * .6), y = cv.height * (.15 + Math.random() * .3);
    for (let i = 0; i < 50; i++) { const a = Math.random() * 6.28, s = 2 + Math.random() * 4; parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, c: gold[i % 4], life: 80, t: "f" }); }
  }
  if (!raf) loop();
}
function loop() {
  cx.clearRect(0, 0, cv.width, cv.height);
  parts = parts.filter(p => p.life-- > 0 && p.y < cv.height + 30);
  for (const p of parts) {
    p.x += p.vx; p.y += p.vy; cx.fillStyle = p.c;
    if (p.t === "c") { p.r += p.vr; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); cx.restore(); }
    else { p.vy += .05; cx.globalAlpha = p.life / 80; cx.beginPath(); cx.arc(p.x, p.y, 2.2, 0, 6.28); cx.fill(); cx.globalAlpha = 1; }
  }
  raf = parts.length ? requestAnimationFrame(loop) : null;
}

// ---- name selection
function chooseTwin(t) {
  twin = t; sessionStorage.setItem("twin", t);
  if (unlocked) return openPage(t);
  $("#vTitle").textContent = `Welcome, ${CONTENT[t].name}! Unlock Your Space`;
  $("#switch").textContent = `← Not ${CONTENT[t].name}? Switch name`;
  $("#pw").value = ""; $("#pwErr").hidden = true; show("verify"); $("#pw").focus();
}
document.querySelectorAll(".chip").forEach(c => c.onclick = () => {
  document.querySelectorAll(".chip").forEach(x => x.classList.remove("sel")); c.classList.add("sel");
  $("#nameInput").value = CONTENT[c.dataset.twin].name; chooseTwin(c.dataset.twin);
});
function submitName() {
  const v = $("#nameInput").value.trim().toLowerCase();
  if (v === "subi" || v === "suji") { $("#nameErr").hidden = true; chooseTwin(v); }
  else { $("#nameErr").hidden = false; $("#nameInput").classList.add("bad"); setTimeout(() => $("#nameInput").classList.remove("bad"), 500); }
}
$("#nameGo").onclick = submitName;
$("#nameInput").addEventListener("keydown", e => { if (e.key === "Enter") submitName(); });

// ---- password
$("#eye").onclick = () => {
  const p = $("#pw"), h = p.type === "password"; p.type = h ? "text" : "password";
  $("#eye").textContent = h ? "🙈" : "👁️"; $("#eye").setAttribute("aria-label", h ? "Hide password" : "Show password");
};
function checkPw() {
  if ($("#pw").value.replace(/\D/g, "") === PASSWORD.replace(/\D/g, "")) { unlocked = true; sessionStorage.setItem("unlocked", "1"); openPage(twin); burst(); }
  else { $("#pwErr").hidden = false; $("#pw").classList.add("bad"); setTimeout(() => $("#pw").classList.remove("bad"), 500); }
}
$("#pwGo").onclick = checkPw; $("#pw").addEventListener("keydown", e => { if (e.key === "Enter") checkPw(); });
$("#switch").onclick = e => { e.preventDefault(); twin = null; sessionStorage.removeItem("twin"); $("#nameInput").value = ""; show("celebrate"); };

// ---- personal pages
function buildPage(key) {
  const c = CONTENT[key], o = CONTENT[c.other], isSubi = key === "subi";
  const sp = Array.from({ length: 14 }, () => `<span class="sp" style="left:${Math.random()*96}%;top:${Math.random()*90}%;font-size:${10+Math.random()*16}px;animation-delay:${Math.random()*2}s">✦</span>`).join("");
  const letter = c.letter.split("\n\n").map(p => `<p class="t">${p}</p>`).join("");
  return `<section id="${key}" class="page ${key}">
  <nav class="nav"><b>15.11.26 • ${c.name}'s Space</b><div class="acts">
    <button class="nbtn music" aria-pressed="false">🎵 Play Birthday Melody</button>
    <button class="nbtn go" data-go="${c.other}">${isSubi ? "Visit Suji's Page →" : "← Visit Subi's Page"}</button></div></nav>
  <header class="hero">${sp}<span class="badge">🎂 15.11.2026</span><h1>Happy 21st Birthday, ${c.name}!</h1></header>
  <div class="wrap">
    <article class="letter"><div class="seal">S</div><div class="hi">Dearest ${c.name},</div>
      <div contenteditable="true" spellcheck="false">${letter}</div>
      <div class="sign">${c.sign},<br>${o.name} 💛</div></article>
    <h2>${c.name}'s Cherished Moments &amp; Memories</h2>
    <figure class="pol solo"><div class="ph" data-img="${key}" tabindex="0" role="button" aria-label="Add ${c.name}'s photo"><span>📷<br>Your photo goes here<br>(images/${key}.jpg)</span></div><p>${c.caption}</p></figure>
    ${isSubi ? "" : `<div class="bond"><h3>Subi &amp; Suji — Born 15.11.2005</h3><p>Two hearts, one story. Twenty-one years of shared secrets, matching laughs, finished sentences and a bond no distance could ever dim. Here's to every memory behind us and every adventure waiting ahead.</p><span class="hand">Twins today, twins forever ✨</span></div>`}
    <footer>Made with love • 15.11.26</footer>
  </div></section>`;
}
$("#pageHost").innerHTML = buildPage("subi") + buildPage("suji");
// ---- auto-load photos from the /images folder (subi-portrait.jpg, subi-1.jpg ... suji-8.jpg)
const IMG_DIR = "images/", EXTS = ["jpg", "jpeg", "png", "webp"];
function loadPhoto(ph, n = 0) {
  if (n >= EXTS.length) return;               // no file found -> keep placeholder
  const url = `${IMG_DIR}${ph.dataset.img}.${EXTS[n]}`, im = new Image();
  im.onload = () => { ph.style.backgroundImage = `url("${url}")`; ph.classList.add("has"); };
  im.onerror = () => loadPhoto(ph, n + 1);
  im.src = url;
}
document.querySelectorAll(".ph[data-img]").forEach(p => loadPhoto(p));

function openPage(k) {
  twin = k; sessionStorage.setItem("twin", k); unlocked = true; show(k); try { history.replaceState(null, "", "#" + k); } catch (e) {}
}
document.querySelectorAll("[data-go]").forEach(b => b.onclick = () => { openPage(b.dataset.go); });

// ---- photo placeholders: click to preview your own picture locally
let activePh = null; const picker = $("#picker");
document.addEventListener("click", e => { const p = e.target.closest(".ph"); if (p) { activePh = p; picker.click(); } });
document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.classList?.contains("ph")) e.target.click(); });
picker.onchange = () => { const f = picker.files[0]; if (f && activePh) { activePh.style.backgroundImage = `url(${URL.createObjectURL(f)})`; activePh.classList.add("has"); } picker.value = ""; };

// ---- ambient birthday melody (WebAudio, no files needed)
const N = { G4: 392, A4: 440, B4: 494, C5: 523, D5: 587, E5: 659, F5: 698, G5: 784 };
const SONG = [["G4",.75],["G4",.25],["A4",1],["G4",1],["C5",1],["B4",2],["G4",.75],["G4",.25],["A4",1],["G4",1],["D5",1],["C5",2],["G4",.75],["G4",.25],["G5",1],["E5",1],["C5",1],["B4",1],["A4",2],["F5",.75],["F5",.25],["E5",1],["C5",1],["D5",1],["C5",2]];
let ac = null, playing = false, loopTimer = null;
function playSong() {
  let t = ac.currentTime + .05; const beat = .55;
  for (const [n, d] of SONG) {
    const o = ac.createOscillator(), g = ac.createGain(); o.type = "triangle"; o.frequency.value = N[n];
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.14, t + .03); g.gain.exponentialRampToValueAtTime(.001, t + d * beat);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d * beat + .05); t += d * beat;
  }
  loopTimer = setTimeout(() => playing && playSong(), (t - ac.currentTime + 1.5) * 1000);
}
function setMusic(on) {
  playing = on;
  if (on) { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); playSong(); } else { clearTimeout(loopTimer); ac && ac.suspend(); }
  document.querySelectorAll(".music").forEach(b => { b.textContent = on ? "⏸ Pause Birthday Melody" : "🎵 Play Birthday Melody"; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
}
document.querySelectorAll(".music").forEach(b => b.onclick = () => setMusic(!playing));

// ---- start (kept at the end so everything above is defined first)
timer = setInterval(tick, 1000);
tick();
if (unlocked && (location.hash === "#subi" || location.hash === "#suji") && new Date() >= TARGET || (preview && unlocked && twin)) openPage(twin || location.hash.slice(1));
