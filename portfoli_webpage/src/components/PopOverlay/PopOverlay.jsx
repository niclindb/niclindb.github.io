import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../motion';
import './PopOverlay.css';

// Timeline of a pop, in milliseconds
const INFLATE_MS = 460; // the film blows up until it surrounds the screen
const RUPTURE_MS = 280; // a hole opens where you clicked and rips across
const SETTLE_MS = 650; // the spray of droplets falls and fades

const MAX_DROPLETS = 700;

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Outline of the film, wobbling a little like a real soap bubble does
function filmPath(ctx, x, y, r, time, seed) {
  ctx.beginPath();
  for (let i = 0; i <= 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const wobble = 1
      + 0.018 * Math.sin(a * 3 + seed + time * 9)
      + 0.012 * Math.sin(a * 5 - time * 13);
    const px = x + Math.cos(a) * r * wobble;
    const py = y + Math.sin(a) * r * wobble;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

// Thin-film look: nearly clear in the middle, brighter towards the edge,
// with slowly swirling bands of colour
function paintFilm(ctx, x, y, r, time, strength) {
  const body = ctx.createRadialGradient(x, y, 0, x, y, r);
  body.addColorStop(0, `rgba(255, 255, 255, ${0.1 * strength})`);
  body.addColorStop(0.7, `rgba(236, 228, 255, ${0.2 * strength})`);
  body.addColorStop(0.93, `rgba(255, 255, 255, ${0.42 * strength})`);
  body.addColorStop(1, `rgba(255, 255, 255, ${0.75 * strength})`);
  ctx.fillStyle = body;
  ctx.fill();

  if (ctx.createConicGradient) {
    const swirl = ctx.createConicGradient(time * 1.6, x, y);
    const a = 0.2 * strength;
    swirl.addColorStop(0, `rgba(255, 120, 220, ${a})`);
    swirl.addColorStop(0.2, `rgba(120, 220, 255, ${a})`);
    swirl.addColorStop(0.4, `rgba(255, 240, 140, ${a * 0.8})`);
    swirl.addColorStop(0.6, `rgba(170, 130, 255, ${a})`);
    swirl.addColorStop(0.8, `rgba(120, 255, 210, ${a * 0.8})`);
    swirl.addColorStop(1, `rgba(255, 120, 220, ${a})`);
    ctx.save();
    ctx.clip();
    // Keep the colours to a soft band near the edge, like light on real film
    ctx.strokeStyle = swirl;
    const bands = 8;
    for (let i = 0; i < bands; i++) {
      const k = i / (bands - 1);
      ctx.globalAlpha = 0.25 + 0.75 * k;
      ctx.lineWidth = r * 0.06;
      ctx.beginPath();
      ctx.arc(x, y, r * (0.6 + 0.4 * k), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function paintHighlights(ctx, x, y, r, strength) {
  ctx.save();
  ctx.globalAlpha = strength;
  // Window reflection, top left
  ctx.beginPath();
  ctx.ellipse(x - r * 0.42, y - r * 0.46, r * 0.17, r * 0.07, -0.7, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.fill();
  // Smaller bounce light, bottom right
  ctx.beginPath();
  ctx.ellipse(x + r * 0.5, y + r * 0.52, r * 0.07, r * 0.03, -0.7, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fill();
  ctx.restore();
}

// Full-screen soap-bubble pop. The bubble you clicked blows up from where it
// was until it surrounds the screen; then, like a real bubble, a hole opens
// at one point and races across the film, and the retracting edge sheds a
// spray of tiny droplets.
export default function PopOverlay({ origin, onBurst, onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext?.('2d');
    if (!ctx || prefersReducedMotion()) {
      onBurst();
      onDone();
      return undefined;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const x0 = origin?.x ?? w / 2;
    const y0 = origin?.y ?? h / 2;
    const r0 = origin?.radius ?? 60;
    // Where the film is centred once it surrounds the screen, and how big
    const xEnd = x0 + (w / 2 - x0) * 0.5;
    const yEnd = y0 + (h / 2 - y0) * 0.5;
    const rMax = Math.hypot(Math.max(xEnd, w - xEnd), Math.max(yEnd, h - yEnd)) * 1.05;
    // The tear starts on the side nearest where you clicked
    const tearX = x0;
    const tearY = y0;
    const tearReach = Math.hypot(Math.max(tearX, w - tearX), Math.max(tearY, h - tearY)) * 1.05;
    const seed = Math.random() * 10;
    // Small ripples along the torn edge
    const edgeNoise = Array.from({ length: 48 }, () => Math.random());

    const droplets = [];
    let burst = false;
    let frame;
    let last = performance.now();
    const start = last;

    const spawnDroplets = (holeR, count) => {
      for (let i = 0; i < count && droplets.length < MAX_DROPLETS; i++) {
        const a = Math.random() * Math.PI * 2;
        const speed = 500 + Math.random() * 900; // px per second, outward
        droplets.push({
          x: tearX + Math.cos(a) * holeR,
          y: tearY + Math.sin(a) * holeR,
          vx: Math.cos(a) * speed + (Math.random() - 0.5) * 200,
          vy: Math.sin(a) * speed + (Math.random() - 0.5) * 200,
          r: 0.8 + Math.random() * Math.random() * 3.2,
          life: 0,
          maxLife: 0.35 + Math.random() * 0.45,
        });
      }
    };

    const drawDroplets = (dt) => {
      droplets.forEach((d) => {
        d.life += dt;
        d.vx *= 1 - 3.2 * dt; // air drag
        d.vy = d.vy * (1 - 3.2 * dt) + 900 * dt; // and gravity
        d.x += d.vx * dt;
        d.y += d.vy * dt;
      });
      for (let i = droplets.length - 1; i >= 0; i--) {
        if (droplets[i].life > droplets[i].maxLife) droplets.splice(i, 1);
      }
      ctx.lineCap = 'round';
      droplets.forEach((d) => {
        const fade = 1 - d.life / d.maxLife;
        // Fast droplets smear into short streaks
        const streak = 0.018;
        ctx.beginPath();
        ctx.moveTo(d.x - d.vx * streak, d.y - d.vy * streak);
        ctx.lineTo(d.x, d.y);
        ctx.lineWidth = d.r * 2;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.85 * fade})`;
        ctx.stroke();
      });
    };

    const draw = (now) => {
      const elapsed = now - start;
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      const time = elapsed / 1000;
      ctx.clearRect(0, 0, w, h);

      // Checked on its own so a slow frame that skips the whole rupture
      // still reveals the content
      if (elapsed >= INFLATE_MS && !burst) {
        burst = true;
        onBurst();
      }

      if (elapsed < INFLATE_MS) {
        // A quick squish, then the film blows up and drifts towards the middle
        const t = elapsed / INFLATE_MS;
        const squish = t < 0.12 ? Math.sin((t / 0.12) * Math.PI) * 0.08 : 0;
        const e = easeInOutCubic(Math.max(0, (t - 0.08) / 0.92));
        const x = x0 + (xEnd - x0) * e;
        const y = y0 + (yEnd - y0) * e;
        const r = (r0 + (rMax - r0) * e) * (1 - squish);
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1 + squish * 1.5, 1 - squish);
        ctx.translate(-x, -y);
        filmPath(ctx, x, y, r, time, seed);
        paintFilm(ctx, x, y, r, time, 0.9 + 0.1 * t);
        ctx.lineWidth = 1.5 + 2.5 * t;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.stroke();
        paintHighlights(ctx, x, y, r, 1 - 0.4 * t);
        ctx.restore();
      } else if (elapsed < INFLATE_MS + RUPTURE_MS) {
        // The hole's edge moves at a steady speed, as it does on real film
        const t = (elapsed - INFLATE_MS) / RUPTURE_MS;
        const holeR = tearReach * t;

        filmPath(ctx, xEnd, yEnd, rMax, time, seed);
        paintFilm(ctx, xEnd, yEnd, rMax, time, 1);
        paintHighlights(ctx, xEnd, yEnd, rMax, 0.6 * (1 - t));

        // Cut the hole, with a slightly ragged edge
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        edgeNoise.forEach((n, i) => {
          const a = (i / edgeNoise.length) * Math.PI * 2;
          const rr = holeR * (1 + (n - 0.5) * 0.06);
          const px = tearX + Math.cos(a) * rr;
          const py = tearY + Math.sin(a) * rr;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // The retracting film bunches up into a bright rim
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;

        spawnDroplets(holeR, 34);
        drawDroplets(dt);
      } else {
        const t = (elapsed - INFLATE_MS - RUPTURE_MS) / SETTLE_MS;
        drawDroplets(dt);
        if (t >= 1 || droplets.length === 0) {
          ctx.clearRect(0, 0, w, h);
          onDone();
          return;
        }
      }
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
    // Runs once per pop; the parent remounts this component for each pop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="pop-overlay" aria-hidden="true" />;
}
