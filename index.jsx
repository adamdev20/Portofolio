import { useState, useEffect, useRef } from “react”;

const CSS = `
@import url(‘https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap’);

:root {
–c-bg:      #f7f5f0;
–c-surface: #f0ede6;
–c-ink:     #111110;
–c-ink-2:   #6b6860;
–c-ink-3:   #b5b2aa;
–c-line:    rgba(17,17,16,.09);
–f-display: ‘Cormorant Garamond’, serif;
–f-body:    ‘Outfit’, sans-serif;
–f-mono:    ‘DM Mono’, monospace;
–ease-expo: cubic-bezier(.19,1,.22,1);
–ease-back: cubic-bezier(.34,1.56,.64,1);
–gap: 130px;
}

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
html { scroll-behavior:smooth; }
body {
font-family:var(–f-body);
background:var(–c-bg);
color:var(–c-ink);
overflow-x:hidden;
-webkit-font-smoothing:antialiased;
}
a { text-decoration:none; color:inherit; }
ul { list-style:none; }
button { border:none; background:none; font-family:inherit; cursor:pointer; color:inherit; }
input,textarea { font-family:inherit; }

/* ── Cursor ── */
.cur { display:none; }
@media(pointer:fine){
body { cursor:none; }
.cur {
display:block; position:fixed; pointer-events:none; z-index:99999;
mix-blend-mode:multiply;
}
.cur-dot {
width:7px; height:7px; background:var(–c-ink); border-radius:50%;
transform:translate(-50%,-50%);
transition:width .3s var(–ease-back), height .3s var(–ease-back);
}
.cur-ring {
width:38px; height:38px; border:1px solid rgba(17,17,16,.25); border-radius:50%;
transform:translate(-50%,-50%);
transition:width .35s var(–ease-back), height .35s var(–ease-back), border-color .3s, background .3s;
}
body.hov .cur-dot  { width:4px; height:4px; }
body.hov .cur-ring { width:54px; height:54px; border-color:var(–c-ink); background:rgba(17,17,16,.05); }
body.ck  .cur-dot  { transform:translate(-50%,-50%) scale(.55); }
}

/* ── Loader ── */
.loader {
position:fixed; inset:0; z-index:9000;
background:var(–c-ink);
display:flex; flex-direction:column;
align-items:center; justify-content:center;
overflow:hidden;
transition:none;
}
.loader.exit { animation:loaderUp .95s cubic-bezier(.76,0,.24,1) forwards; }
@keyframes loaderUp {
0%   { transform:translateY(0); }
100% { transform:translateY(-100%); }
}
.loader-num {
font-family:var(–f-display);
font-size:clamp(7rem,20vw,15rem);
font-weight:300;
color:var(–c-bg);
line-height:1; letter-spacing:-.05em;
user-select:none;
display:flex; align-items:flex-start;
}
.loader-num sup {
font-size:clamp(1.8rem,5vw,4rem);
margin-top:.4em;
opacity:.35;
letter-spacing:0;
}
.loader-track {
width:min(400px,78vw); height:1px;
background:rgba(247,245,240,.1);
margin-top:3.5rem; position:relative; overflow:hidden;
}
.loader-fill { position:absolute; left:0; top:0; height:100%; background:var(–c-bg); transition:width .06s linear; }
.loader-tag {
font-family:var(–f-mono); font-size:.62rem;
letter-spacing:.24em; text-transform:uppercase;
color:rgba(247,245,240,.28); margin-top:1.5rem;
}
.loader-sig {
position:absolute; bottom:2.5rem; left:3rem;
font-family:var(–f-display); font-size:.95rem;
font-style:italic; font-weight:300;
color:rgba(247,245,240,.2); letter-spacing:.04em;
}

/* ── Nav ── */
.nav {
position:fixed; top:0; left:0; right:0; z-index:800;
height:60px; display:flex; align-items:center; justify-content:space-between;
padding:0 3.5rem;
transition:background .5s, border-bottom .5s;
}
.nav.scrolled {
background:rgba(247,245,240,.9);
backdrop-filter:blur(20px);
border-bottom:1px solid var(–c-line);
}
.nav-logo {
font-family:var(–f-display); font-size:1.3rem;
font-weight:400; font-style:italic; letter-spacing:.01em;
}
.nav-links { display:flex; gap:.2rem; align-items:center; }
.nav-link {
font-family:var(–f-mono); font-size:.62rem;
letter-spacing:.18em; text-transform:uppercase;
color:var(–c-ink-2); padding:.45rem .85rem;
border-radius:4px; transition:color .22s, background .22s;
position:relative;
}
.nav-link:hover,.nav-link.active { color:var(–c-ink); }
.nav-link.active::after {
content:’’; position:absolute;
bottom:6px; left:50%; transform:translateX(-50%);
width:3px; height:3px; border-radius:50%; background:var(–c-ink);
}
.nav-hire {
font-family:var(–f-mono); font-size:.62rem; letter-spacing:.14em; text-transform:uppercase;
color:var(–c-bg); background:var(–c-ink);
padding:.5rem 1.15rem; border-radius:100px;
transition:transform .25s var(–ease-back), box-shadow .25s;
}
.nav-hire:hover { transform:scale(1.04); box-shadow:0 8px 22px rgba(17,17,16,.17); }
.nav-burger { display:none; flex-direction:column; gap:5px; padding:4px; }
.nav-burger span { display:block; width:20px; height:1.5px; background:var(–c-ink); transition:.3s; }
.nav-burger.open span:nth-child(1) { transform:translateY(6.5px) rotate(45deg); }
.nav-burger.open span:nth-child(2) { opacity:0; }
.nav-burger.open span:nth-child(3) { transform:translateY(-6.5px) rotate(-45deg); }
.nav-mob {
display:none; position:fixed; top:60px; inset-inline:0; z-index:799;
background:rgba(247,245,240,.97); backdrop-filter:blur(24px);
border-bottom:1px solid var(–c-line);
padding:2rem 3rem 3rem; flex-direction:column;
animation:mobIn .35s var(–ease-expo);
}
@keyframes mobIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
.nav-mob.open { display:flex; }
.nav-mob-item {
font-family:var(–f-display); font-size:2.1rem;
font-weight:300; font-style:italic;
padding:.5rem 0; border-bottom:1px solid var(–c-line);
color:var(–c-ink-2); transition:color .2s; text-align:left;
}
.nav-mob-item:hover { color:var(–c-ink); }

/* ── Shared ── */
section { padding:var(–gap) 0; }
.wrap { max-width:1160px; margin:0 auto; padding:0 3.5rem; }
.sec-tag {
font-family:var(–f-mono); font-size:.6rem;
letter-spacing:.24em; text-transform:uppercase;
color:var(–c-ink-3); margin-bottom:1.2rem;
display:flex; align-items:center; gap:.6rem;
}
.sec-tag::before { content:’’; width:22px; height:1px; background:var(–c-ink-3); display:block; }

/* ── Hero ── */
#home {
min-height:100vh; display:flex; align-items:center;
padding-top:0; position:relative; overflow:hidden;
}
.hero-grid {
display:grid; grid-template-columns:1fr 1fr;
min-height:100vh; align-items:end; padding-top:60px;
}
.hero-left { padding:9vh 5rem 7vh 0; display:flex; flex-direction:column; justify-content:flex-end; }
.hero-tag-wrap { margin-bottom:2.8rem; opacity:0; animation:fuIn .8s var(–ease-expo) .35s forwards; }
.hero-h1 {
font-family:var(–f-display);
font-size:clamp(4rem,7.5vw,7.2rem);
font-weight:300; line-height:1.0; letter-spacing:-.035em;
margin-bottom:2.2rem;
}
.hero-h1 em { font-style:italic; }
.hero-h1 .line { display:block; overflow:hidden; }
.hero-h1 .line span {
display:block; opacity:0; transform:translateY(105%);
}
.hero-h1 .line:nth-child(1) span { animation:lineUp .9s var(–ease-expo) .5s forwards; }
.hero-h1 .line:nth-child(2) span { animation:lineUp .9s var(–ease-expo) .65s forwards; }
.hero-h1 .line:nth-child(3) span { animation:lineUp .9s var(–ease-expo) .8s forwards; }
@keyframes lineUp { to{opacity:1;transform:translateY(0)} }
.hero-sub {
font-size:.97rem; line-height:1.85; color:var(–c-ink-2);
max-width:380px; margin-bottom:2.8rem;
opacity:0; animation:fuIn .8s var(–ease-expo) 1s forwards;
}
.hero-btns {
display:flex; gap:1rem; flex-wrap:wrap; align-items:center;
opacity:0; animation:fuIn .8s var(–ease-expo) 1.1s forwards;
}
.btn-fill {
display:inline-flex; align-items:center; gap:.5rem;
font-family:var(–f-mono); font-size:.65rem; letter-spacing:.14em; text-transform:uppercase;
color:var(–c-bg); background:var(–c-ink);
padding:.85rem 1.8rem; border-radius:100px;
transition:transform .25s var(–ease-back), box-shadow .25s;
}
.btn-fill:hover { transform:translateY(-3px); box-shadow:0 14px 30px rgba(17,17,16,.18); }
.btn-fill svg { transition:transform .3s var(–ease-back); }
.btn-fill:hover svg { transform:translate(3px,-3px); }
.btn-bare {
display:inline-flex; align-items:center; gap:.45rem;
font-family:var(–f-mono); font-size:.65rem; letter-spacing:.14em; text-transform:uppercase;
color:var(–c-ink-2); padding-bottom:.2rem;
border-bottom:1px solid var(–c-line);
transition:color .22s, border-color .22s;
}
.btn-bare:hover { color:var(–c-ink); border-color:var(–c-ink); }
.hero-right {
border-left:1px solid var(–c-line);
padding:9vh 0 7vh 5rem;
display:flex; flex-direction:column; justify-content:flex-end; gap:4rem;
opacity:0; animation:fadeIn .9s var(–ease-expo) 1.25s forwards;
}
.h-stat-n {
font-family:var(–f-display);
font-size:clamp(3rem,5vw,4.2rem);
font-weight:300; line-height:1; letter-spacing:-.04em;
}
.h-stat-l {
font-family:var(–f-mono); font-size:.58rem; letter-spacing:.22em;
text-transform:uppercase; color:var(–c-ink-3); margin-top:.35rem;
}
.hero-scroll {
position:absolute; bottom:2rem; left:50%; transform:translateX(-50%);
display:flex; flex-direction:column; align-items:center; gap:.55rem;
font-family:var(–f-mono); font-size:.56rem; letter-spacing:.22em; text-transform:uppercase;
color:var(–c-ink-3); opacity:0; animation:fadeIn 1s var(–ease-expo) 1.7s both;
}
.hero-scroll-line {
width:1px; height:38px;
background:linear-gradient(to bottom,var(–c-ink-3),transparent);
animation:scrollAnim 2.4s ease-in-out infinite;
}
@keyframes scrollAnim { 0%,100%{opacity:.5;height:38px} 50%{opacity:.2;height:22px} }

/* ── About ── */
#about { background:var(–c-surface); }
.about-grid { display:grid; grid-template-columns:2fr 3fr; gap:6rem; align-items:start; }
.about-big-num {
font-family:var(–f-display); font-size:clamp(6rem,14vw,10rem);
font-weight:300; line-height:1; letter-spacing:-.05em; color:var(–c-ink-3);
margin-bottom:2rem;
}
.about-pill {
display:inline-flex; align-items:center; gap:.5rem;
border:1px solid var(–c-line); border-radius:100px;
padding:.4rem 1rem; font-family:var(–f-mono);
font-size:.62rem; letter-spacing:.12em; text-transform:uppercase; color:var(–c-ink-2);
}
.a-dot { width:6px; height:6px; background:#4caf50; border-radius:50%; animation:blink 2s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.35} }
.about-body p { font-size:1rem; line-height:1.85; color:var(–c-ink-2); margin-bottom:1.3rem; }
.about-body strong { color:var(–c-ink); font-weight:500; }
.about-tags {
display:grid; grid-template-columns:1fr 1fr; gap:.5rem;
margin-top:2.5rem; padding-top:2.5rem; border-top:1px solid var(–c-line);
}
.about-tag {
font-family:var(–f-mono); font-size:.67rem; letter-spacing:.07em;
color:var(–c-ink-2); display:flex; align-items:center; gap:.45rem;
}
.about-tag::before { content:’’; width:3px; height:3px; border-radius:50%; background:var(–c-ink-3); flex-shrink:0; }

/* ── Skills ── */
.skills-top {
display:flex; justify-content:space-between; align-items:flex-end;
padding-bottom:2rem; margin-bottom:0;
border-bottom:1px solid var(–c-line); flex-wrap:wrap; gap:1rem;
}
.skills-h2 {
font-family:var(–f-display);
font-size:clamp(2.5rem,5vw,3.8rem);
font-weight:300; letter-spacing:-.03em; line-height:1;
}
.skills-h2 em { font-style:italic; }
.skills-note {
font-family:var(–f-mono); font-size:.62rem; letter-spacing:.12em;
text-transform:uppercase; color:var(–c-ink-3);
text-align:right; line-height:1.7;
}
.skills-cols {
display:grid; grid-template-columns:repeat(3,1fr);
gap:1px; background:var(–c-line);
}
.skill-col {
background:var(–c-bg); padding:2.2rem 2rem;
transition:background .3s;
}
.skill-col:hover { background:var(–c-surface); }
.skill-col-hd {
font-family:var(–f-mono); font-size:.6rem; letter-spacing:.2em;
text-transform:uppercase; color:var(–c-ink-3); margin-bottom:2rem;
}
.skill-items { display:flex; flex-direction:column; gap:1.2rem; }
.skill-item {}
.skill-item-top { display:flex; justify-content:space-between; margin-bottom:.45rem; }
.skill-name { font-size:.88rem; color:var(–c-ink); }
.skill-pct { font-family:var(–f-mono); font-size:.68rem; color:var(–c-ink-3); }
.skill-track { height:1px; background:var(–c-line); position:relative; overflow:hidden; }
.skill-fill {
position:absolute; left:0; top:0; height:100%; background:var(–c-ink);
transform:scaleX(0); transform-origin:left;
transition:transform 1.5s var(–ease-expo);
}
.skill-fill.on { transform:scaleX(1); }

/* ── Projects ── */
#projects { background:var(–c-surface); }
.proj-top {
display:flex; justify-content:space-between; align-items:flex-end;
padding-bottom:2rem; margin-bottom:0;
border-bottom:1px solid var(–c-line); flex-wrap:wrap; gap:1rem;
}
.proj-h2 {
font-family:var(–f-display);
font-size:clamp(2.5rem,5vw,3.8rem);
font-weight:300; letter-spacing:-.03em; line-height:1;
}
.proj-h2 em { font-style:italic; }
.proj-list {}
.proj-row {
display:grid; grid-template-columns:2.5rem 1fr auto;
align-items:center; gap:2.5rem;
padding:2rem 0; border-bottom:1px solid var(–c-line);
position:relative; overflow:hidden;
transition:padding .45s var(–ease-expo);
}
.proj-row::before {
content:’’; position:absolute; inset:0;
background:var(–c-bg);
transform:scaleY(0); transform-origin:bottom;
transition:transform .4s var(–ease-expo); z-index:0;
}
.proj-row:hover { padding:2.5rem 1.2rem; }
.proj-row:hover::before { transform:scaleY(1); }
.proj-row > * { position:relative; z-index:1; }
.proj-idx {
font-family:var(–f-mono); font-size:.65rem;
letter-spacing:.1em; color:var(–c-ink-3);
}
.proj-body {}
.proj-chips { display:flex; flex-wrap:wrap; gap:.35rem; margin-bottom:.55rem; }
.proj-chip {
font-family:var(–f-mono); font-size:.56rem; letter-spacing:.14em; text-transform:uppercase;
color:var(–c-ink-3); border:1px solid var(–c-line); padding:.15rem .5rem; border-radius:100px;
transition:border-color .25s, color .25s;
}
.proj-row:hover .proj-chip { border-color:rgba(17,17,16,.2); color:var(–c-ink-2); }
.proj-title {
font-family:var(–f-display);
font-size:clamp(1.3rem,2.5vw,1.9rem);
font-weight:300; letter-spacing:-.02em;
transition:letter-spacing .45s var(–ease-expo);
}
.proj-row:hover .proj-title { letter-spacing:.01em; }
.proj-desc {
font-size:.85rem; color:var(–c-ink-2); margin-top:.35rem;
line-height:1.7; max-width:580px;
max-height:0; overflow:hidden; opacity:0;
transition:max-height .5s var(–ease-expo), opacity .4s;
}
.proj-row:hover .proj-desc { max-height:80px; opacity:1; }
.proj-arrow {
width:36px; height:36px; border:1px solid var(–c-line); border-radius:50%;
display:flex; align-items:center; justify-content:center; flex-shrink:0;
transition:transform .35s var(–ease-back), border-color .25s, background .25s, color .25s;
color:var(–c-ink-3);
}
.proj-row:hover .proj-arrow {
transform:rotate(-45deg);
background:var(–c-ink); border-color:var(–c-ink); color:var(–c-bg);
}

/* ── Contact ── */
.contact-split { display:grid; grid-template-columns:1fr 1fr; gap:8rem; align-items:start; }
.contact-h2 {
font-family:var(–f-display);
font-size:clamp(2.6rem,5.5vw,4.2rem);
font-weight:300; letter-spacing:-.03em; line-height:1.1; margin-bottom:1.8rem;
}
.contact-h2 em { font-style:italic; }
.contact-sub { font-size:.95rem; color:var(–c-ink-2); line-height:1.85; margin-bottom:2.8rem; }
.c-links {}
.c-link {
display:flex; align-items:center; justify-content:space-between;
padding:1.1rem 0; border-bottom:1px solid var(–c-line);
transition:padding .3s var(–ease-expo);
}
.c-link:hover { padding:1.1rem .7rem; }
.c-link-label {
font-family:var(–f-mono); font-size:.6rem; letter-spacing:.18em;
text-transform:uppercase; color:var(–c-ink-3);
}
.c-link-val { font-size:.93rem; color:var(–c-ink); margin-top:.15rem; }
.c-link-arr { font-size:1rem; color:var(–c-ink-3); transition:transform .3s var(–ease-back), color .25s; }
.c-link:hover .c-link-arr { transform:translate(4px,-4px); color:var(–c-ink); }
.c-form { display:flex; flex-direction:column; gap:1.8rem; }
.c-field { display:flex; flex-direction:column; gap:.45rem; }
.c-label {
font-family:var(–f-mono); font-size:.58rem; letter-spacing:.2em;
text-transform:uppercase; color:var(–c-ink-3);
}
.c-input, .c-area {
background:transparent; border:none;
border-bottom:1px solid var(–c-line);
padding:.65rem 0; font-size:.93rem; color:var(–c-ink);
outline:none; transition:border-color .25s; resize:none;
}
.c-input:focus,.c-area:focus { border-color:var(–c-ink); }
.c-input::placeholder,.c-area::placeholder { color:var(–c-ink-3); }
.c-area { min-height:100px; }
.c-submit {
display:inline-flex; align-items:center; gap:.5rem;
font-family:var(–f-mono); font-size:.65rem; letter-spacing:.14em; text-transform:uppercase;
color:var(–c-bg); background:var(–c-ink); padding:.88rem 2rem; border-radius:100px;
align-self:flex-start; border:none; cursor:pointer;
transition:transform .25s var(–ease-back), box-shadow .25s;
}
.c-submit:hover { transform:translateY(-2px); box-shadow:0 12px 26px rgba(17,17,16,.17); }

/* ── Footer ── */
footer {
border-top:1px solid var(–c-line);
padding:2rem 3.5rem;
display:flex; align-items:center; justify-content:space-between;
flex-wrap:wrap; gap:1rem;
}
.ft-c { font-family:var(–f-mono); font-size:.6rem; letter-spacing:.1em; color:var(–c-ink-3); }
.ft-ls { display:flex; gap:1.5rem; }
.ft-l {
font-family:var(–f-mono); font-size:.6rem; letter-spacing:.1em;
text-transform:uppercase; color:var(–c-ink-3); transition:color .2s;
}
.ft-l:hover { color:var(–c-ink); }

/* ── Reveal ── */
.rv {
opacity:0; transform:translateY(26px);
transition:opacity .85s var(–ease-expo), transform .85s var(–ease-expo);
}
.rv.on { opacity:1; transform:translateY(0); }
.d1 { transition-delay:.1s; } .d2 { transition-delay:.2s; }
.d3 { transition-delay:.3s; } .d4 { transition-delay:.4s; }

/* ── Keyframes ── */
@keyframes fuIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }

/* ── Responsive ── */
@media(max-width:1024px){
.hero-grid { grid-template-columns:1fr; }
.hero-left { padding-right:0; }
.hero-right {
flex-direction:row; flex-wrap:wrap; border-left:none;
border-top:1px solid var(–c-line); padding:3rem 0 6vh; gap:2rem 4rem;
}
.about-grid { grid-template-columns:1fr; gap:3rem; }
.skills-cols { grid-template-columns:1fr 1fr; }
.contact-split { grid-template-columns:1fr; gap:4rem; }
}
@media(max-width:768px){
:root { –gap:85px; }
.wrap { padding:0 1.4rem; }
.nav { padding:0 1.4rem; }
.nav-links,.nav-hire { display:none; }
.nav-burger { display:flex; }
.skills-cols { grid-template-columns:1fr; }
.proj-row { grid-template-columns:2rem 1fr; }
.proj-arrow { display:none; }
footer { flex-direction:column; text-align:center; align-items:center; }
.loader-sig { left:1.4rem; }
}
`;

const NAV_IDS = [“home”,“about”,“skills”,“projects”,“contact”];
const SKILLS = [
{ title:“Frontend”, items:[{n:“React / Next.js”,p:92},{n:“TypeScript”,p:87},{n:“SASS / CSS”,p:90},{n:“Vue.js”,p:74}] },
{ title:“Backend”,  items:[{n:“Node.js / Express”,p:88},{n:“Go (Golang)”,p:72},{n:“REST & GraphQL”,p:85},{n:“PostgreSQL”,p:83}] },
{ title:“Infra”,    items:[{n:“Docker / K8s”,p:78},{n:“CI/CD”,p:82},{n:“AWS / GCP”,p:74},{n:“Git & Agile”,p:94}] },
];
const PROJECTS = [
{ n:“CloudSync”,    tags:[“React”,“Node.js”,“WebSocket”], desc:“Platform kolaborasi dokumen real-time dengan multiplayer editing dan AI writing assistant.” },
{ n:“FinTrack”,     tags:[“Next.js”,“TypeScript”,“Prisma”], desc:“Dashboard keuangan personal dengan analitik cerdas dan visualisasi data interaktif.” },
{ n:“DevBot”,       tags:[“Python”,“FastAPI”,“OpenAI”], desc:“Bot GitHub code review otomatis — refactoring suggestion & bug detection berbasis LLM.” },
{ n:“ShopWave”,     tags:[“Next.js”,“Stripe”,“Sanity”], desc:“Headless e-commerce performa tinggi dengan SSG/ISR dan integrasi payment gateway lokal.” },
{ n:“MetricsPulse”, tags:[“Vue.js”,“Go”,“ClickHouse”], desc:“Platform analytics SaaS real-time dengan custom events tracking dan funnel analysis.” },
];

/* ── Custom Cursor ── */
function Cursor(){
const dot=useRef(null), ring=useRef(null);
const m=useRef({x:0,y:0}), r=useRef({x:0,y:0});
useEffect(()=>{
const mv=e=>{
m.current={x:e.clientX,y:e.clientY};
if(dot.current){dot.current.style.left=e.clientX+“px”;dot.current.style.top=e.clientY+“px”;}
};
let af;
const loop=()=>{
r.current.x+=(m.current.x-r.current.x)*.12;
r.current.y+=(m.current.y-r.current.y)*.12;
if(ring.current){ring.current.style.left=r.current.x+“px”;ring.current.style.top=r.current.y+“px”;}
af=requestAnimationFrame(loop);
};
loop();
const ho=()=>document.body.classList.add(“hov”);
const hl=()=>document.body.classList.remove(“hov”);
const ck=()=>document.body.classList.add(“ck”);
const cu=()=>document.body.classList.remove(“ck”);
document.addEventListener(“mousemove”,mv);
document.addEventListener(“mousedown”,ck);
document.addEventListener(“mouseup”,cu);
const attach=()=>document.querySelectorAll(“a,button,[data-h]”).forEach(el=>{
el.addEventListener(“mouseenter”,ho);el.addEventListener(“mouseleave”,hl);
});
attach();
const ob=new MutationObserver(attach);
ob.observe(document.body,{childList:true,subtree:true});
return()=>{document.removeEventListener(“mousemove”,mv);cancelAnimationFrame(af);ob.disconnect();};
},[]);
return(
<div className="cur">
<div ref={dot}  className=“cur-dot”  style={{position:“fixed”,pointerEvents:“none”,zIndex:99999}}/>
<div ref={ring} className=“cur-ring” style={{position:“fixed”,pointerEvents:“none”,zIndex:99998}}/>
</div>
);
}

/* ── Loader ── */
function Loader({onDone}){
const [pct,setPct]=useState(0);
const [exit,setExit]=useState(false);
const [gone,setGone]=useState(false);

useEffect(()=>{
// Non-linear staged progression for a crafted feel
const stages=[
{to:28,ms:380},{to:55,ms:460},{to:72,ms:320},
{to:87,ms:380},{to:95,ms:260},{to:100,ms:200}
];
let cur=0, i=0, to;
function run(){
if(i>=stages.length) return;
const {to:end,ms}=stages[i];
const from=cur, t0=performance.now();
function tick(now){
const p=Math.min((now-t0)/ms,1);
const e=1-Math.pow(1-p,3);
cur=Math.round(from+(end-from)*e);
setPct(cur);
if(p<1) requestAnimationFrame(tick);
else{i++;if(i<stages.length)to=setTimeout(run,60);
else setTimeout(()=>{
setExit(true);
setTimeout(()=>{setGone(true);onDone();},950);
},320);}
}
requestAnimationFrame(tick);
}
to=setTimeout(run,80);
return()=>clearTimeout(to);
},[]);

if(gone) return null;
return(
<div className={`loader${exit?" exit":""}`}>
<div className="loader-num">
{pct}<sup>%</sup>
</div>
<div className="loader-track">
<div className=“loader-fill” style={{width:`${pct}%`}}/>
</div>
<div className="loader-tag">Loading portfolio</div>
<div className="loader-sig">Aldi Rizky — Fullstack Developer</div>
</div>
);
}

/* ── Navbar ── */
function Navbar({active}){
const [sc,setSc]=useState(false);
const [open,setOpen]=useState(false);
useEffect(()=>{
const h=()=>setSc(window.scrollY>18);
window.addEventListener(“scroll”,h);return()=>window.removeEventListener(“scroll”,h);
},[]);
const go=id=>{setOpen(false);document.getElementById(id)?.scrollIntoView({behavior:“smooth”});};
return(
<>
<nav className={`nav${sc?" scrolled":""}`}>
<button className=“nav-logo” onClick={()=>go(“home”)}>ar.</button>
<ul className="nav-links">
{NAV_IDS.map(id=>(
<li key={id}><button className={`nav-link${active===id?" active":""}`} onClick={()=>go(id)}>{id}</button></li>
))}
</ul>
<button className=“nav-hire” onClick={()=>go(“contact”)}>Hire me</button>
<button className={`nav-burger${open?" open":""}`} onClick={()=>setOpen(!open)} aria-label=“menu”>
<span/><span/><span/>
</button>
</nav>
<div className={`nav-mob${open?" open":""}`}>
{NAV_IDS.map(id=>(
<button key={id} className=“nav-mob-item” onClick={()=>go(id)}>{id}</button>
))}
</div>
</>
);
}

/* ── Hero ── */
function Hero(){
const go=id=>document.getElementById(id)?.scrollIntoView({behavior:“smooth”});
return(
<section id="home">
<div className="wrap">
<div className="hero-grid">
<div className="hero-left">
<div className="hero-tag-wrap">
<div className="sec-tag" style={{margin:0}}>Based in Indonesia</div>
</div>
<h1 className="hero-h1">
<span className="line"><span>Aldi</span></span>
<span className="line"><span>Rizky,</span></span>
<span className="line"><span><em>Developer.</em></span></span>
</h1>
<p className="hero-sub">
Membangun produk digital yang scalable — dari antarmuka yang halus hingga arsitektur backend yang solid dan reliable.
</p>
<div className="hero-btns">
<button className=“btn-fill” onClick={()=>go(“projects”)}>
Lihat Proyek
<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
<path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
</svg>
</button>
<button className=“btn-bare” onClick={()=>go(“contact”)}>Kontak Saya →</button>
</div>
</div>
<div className="hero-right">
{[[“3+”,“Tahun”],[“20+”,“Proyek”],[“10+”,“Klien”]].map(([n,l])=>(
<div key={l}>
<div className="h-stat-n">{n}</div>
<div className="h-stat-l">{l}</div>
</div>
))}
</div>
</div>
</div>
<div className="hero-scroll">
<div className="hero-scroll-line"/>
<span>Scroll</span>
</div>
</section>
);
}

/* ── About ── */
function About(){
return(
<section id="about">
<div className="wrap">
<div className="about-grid">
<div className="rv">
<div className="about-big-num">01</div>
<div className="about-pill"><div className="a-dot"/>Open to work</div>
</div>
<div>
<div className="sec-tag rv">About me</div>
<div className="about-body rv d1">
<p>Halo, saya <strong>Aldi Rizky</strong> — Fullstack Developer yang percaya bahwa software terbaik lahir dari perpaduan engineering yang matang dan sensitivitas desain yang tinggi.</p>
<p>Selama 3+ tahun saya membangun aplikasi web dari ground up: database, REST/GraphQL API, hingga UI responsif dan interaktif. Saya berpikir sebagai <strong>product builder</strong>, bukan sekadar code writer.</p>
<p>Aktif menulis artikel teknis dan berkontribusi ke proyek open source di waktu luang.</p>
</div>
<div className="about-tags rv d2">
{[“React & Next.js”,“Node.js & Go”,“Database Design”,“API Architecture”,“Docker & CI/CD”,“UI/UX Thinking”,“AWS / GCP”,“Agile & Scrum”].map(t=>(
<div key={t} className="about-tag">{t}</div>
))}
</div>
</div>
</div>
</div>
</section>
);
}

/* ── Skills ── */
function Skills(){
const [on,setOn]=useState(false);
const ref=useRef(null);
useEffect(()=>{
const ob=new IntersectionObserver(([e])=>{if(e.isIntersecting){setOn(true);ob.disconnect();}},{threshold:.12});
if(ref.current) ob.observe(ref.current);
return()=>ob.disconnect();
},[]);
return(
<section id="skills" ref={ref}>
<div className="wrap">
<div className="skills-top rv">
<h2 className="skills-h2">Tech <em>Stack</em></h2>
<div className="skills-note">Tools & technologies<br/>I work with daily</div>
</div>
<div className="skills-cols rv d1">
{SKILLS.map((c,ci)=>(
<div className="skill-col" key={c.title}>
<div className="skill-col-hd">{String(ci+1).padStart(2,“0”)} — {c.title}</div>
<div className="skill-items">
{c.items.map(s=>(
<div className="skill-item" key={s.n}>
<div className="skill-item-top">
<span className="skill-name">{s.n}</span>
<span className="skill-pct">{s.p}</span>
</div>
<div className="skill-track">
<div className={`skill-fill${on?" on":""}`} style={{width:`${s.p}%`}}/>
</div>
</div>
))}
</div>
</div>
))}
</div>
</div>
</section>
);
}

/* ── Projects ── */
function Projects(){
return(
<section id="projects">
<div className="wrap">
<div className="proj-top rv">
<h2 className="proj-h2">Selected <em>Work</em></h2>
<div className="sec-tag" style={{margin:0}}>2023 – 2025</div>
</div>
<div className="proj-list rv d1">
{PROJECTS.map((p,i)=>(
<div className="proj-row" key={p.n}>
<div className="proj-idx">{String(i+1).padStart(2,“0”)}</div>
<div className="proj-body">
<div className="proj-chips">{p.tags.map(t=><span key={t} className="proj-chip">{t}</span>)}</div>
<div className="proj-title">{p.n}</div>
<div className="proj-desc">{p.desc}</div>
</div>
<div className="proj-arrow">
<svg width="13" height="13" viewBox="0 0 13 13" fill="none">
<path d="M2 11L11 2M11 2H5M11 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
</svg>
</div>
</div>
))}
</div>
</div>
</section>
);
}

/* ── Contact ── */
function Contact(){
const [f,setF]=useState({name:””,email:””,msg:””});
const [sent,setSent]=useState(false);
const send=()=>{setSent(true);setF({name:””,email:””,msg:””});setTimeout(()=>setSent(false),3000);};
return(
<section id="contact">
<div className="wrap">
<div className="contact-split">
<div>
<div className="sec-tag rv">Contact</div>
<h2 className="contact-h2 rv d1">Punya Ide?<br/><em>Ayo Bicara.</em></h2>
<p className="contact-sub rv d2">Terbuka untuk proyek freelance, full-time role, atau sekadar ngobrol soal teknologi.</p>
<div className="c-links rv d3">
{[
{l:“Email”,v:“aldi@example.com”,h:“mailto:aldi@example.com”},
{l:“WhatsApp”,v:”+62 812-3456-7890”,h:“https://wa.me/628123456789”},
{l:“LinkedIn”,v:”/in/aldirizkyfullstack”,h:”#”},
{l:“GitHub”,v:“github.com/aldirizky”,h:”#”},
].map(c=>(
<a key={c.l} className=“c-link” href={c.h} target={c.h.startsWith(“http”)?”_blank”:”_self”} rel=“noreferrer”>
<div><div className="c-link-label">{c.l}</div><div className="c-link-val">{c.v}</div></div>
<div className="c-link-arr">↗</div>
</a>
))}
</div>
</div>
<div className="c-form rv d2">
<div className="c-field">
<label className="c-label">Nama</label>
<input className=“c-input” placeholder=“Nama kamu” value={f.name} onChange={e=>setF({…f,name:e.target.value})}/>
</div>
<div className="c-field">
<label className="c-label">Email</label>
<input className=“c-input” type=“email” placeholder=“email@domain.com” value={f.email} onChange={e=>setF({…f,email:e.target.value})}/>
</div>
<div className="c-field">
<label className="c-label">Pesan</label>
<textarea className=“c-area” placeholder=“Ceritakan proyekmu…” value={f.msg} onChange={e=>setF({…f,msg:e.target.value})}/>
</div>
<button className="c-submit" onClick={send}>{sent?“✓ Terkirim”:“Kirim Pesan →”}</button>
</div>
</div>
</div>
</section>
);
}

/* ── Footer ── */
function Footer(){
return(
<footer>
<div className="ft-c">© 2025 Aldi Rizky</div>
<div className="ft-ls">
{[“GitHub”,“LinkedIn”,“Twitter”,“Dribbble”].map(s=><a key={s} href="#" className="ft-l">{s}</a>)}
</div>
</footer>
);
}

/* ── ROOT ── */
export default function App(){
const [loaded,setLoaded]=useState(false);
const [active,setActive]=useState(“home”);

useEffect(()=>{
const s=document.createElement(“style”);
s.textContent=CSS;
document.head.appendChild(s);
return()=>document.head.removeChild(s);
},[]);

useEffect(()=>{
if(!loaded) return;
const ob=new IntersectionObserver(
es=>es.forEach(e=>{if(e.isIntersecting)setActive(e.target.id);}),
{threshold:.38}
);
NAV_IDS.forEach(id=>{const el=document.getElementById(id);if(el)ob.observe(el);});
return()=>ob.disconnect();
},[loaded]);

useEffect(()=>{
if(!loaded) return;
const ob=new IntersectionObserver(
es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add(“on”);ob.unobserve(e.target);}}),
{threshold:.07}
);
document.querySelectorAll(”.rv”).forEach(el=>ob.observe(el));
return()=>ob.disconnect();
},[loaded]);

return(
<>
<Cursor/>
<Loader onDone={()=>setLoaded(true)}/>
{loaded&&(
<>
<Navbar active={active}/>
<main>
<Hero/><About/><Skills/><Projects/><Contact/>
</main>
<Footer/>
</>
)}
</>
);
}
