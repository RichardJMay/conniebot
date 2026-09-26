/*
 * Connie's Contingencies — shared utilities
 * Loaded on every page. Keep this file small and dependency-free.
 */

// ---- Treats counter (persists across pages via localStorage) ----
const TREATS_KEY = "connie_treats_total";

function getTreatsTotal() {
  return parseInt(localStorage.getItem(TREATS_KEY) || "0", 10);
}

function addTreats(n = 1) {
  const total = getTreatsTotal() + n;
  localStorage.setItem(TREATS_KEY, String(total));
  renderTreatsCounter();
  return total;
}

function renderTreatsCounter() {
  const el = document.querySelector("[data-treats-counter]");
  if (el) el.textContent = getTreatsTotal();
}

document.addEventListener("DOMContentLoaded", renderTreatsCounter);

// ---- Tiny chiptune-style tone player (Web Audio API) ----
// Synthesizes short square/triangle-wave notes — no audio files needed,
// and nothing here reproduces any copyrighted melody. Swap NOTE
// sequences per module as needed.
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// Plays a single short blip — e.g. on reinforcement delivery.
function playChime(freq = 880, durationMs = 90, type = "square") {
  const ctx = getAudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + durationMs / 1000);
}

// Plays a short sequence of [freq, durationMs] pairs, e.g. a 3-4 note
// "treat" jingle. Call only after a user gesture (click/keypress) —
// browsers block audio autoplay before that.
function playMotif(notes, type = "square") {
  const ctx = getAudioCtx();
  let t = ctx.currentTime;
  notes.forEach(([freq, durationMs]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + durationMs / 1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + durationMs / 1000);
    t += durationMs / 1000;
  });
}
