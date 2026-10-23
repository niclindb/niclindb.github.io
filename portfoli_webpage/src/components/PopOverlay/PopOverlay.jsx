import { useEffect, useRef } from 'react';
import './PopOverlay.css';

const INFLATE_MS = 520;
const BURST_MS = 650;
const WOBBLES = 7;

const easeInCubic = (t) => t * t * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// Wobbly outline, like a gum bubble that isn't quite round
function blobPath(ctx, x, y, r, t, seed) {
  ctx.beginPath();
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const wobble = 1 + 0.035 * Math.sin(a * 3 + seed + t * 18) + 0.025 * Math.sin(a * WOBBLES - t * 25);
    const px = x + Math.cos(a) * r * wobble;
    const py = y + Math.sin(a) * r * wobble;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function bubbleFill(ctx, x, y, r, alpha) {
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.05, x, y, r);
  g.addColorStop(0, `rgba(255, 255, 255, ${0.55 * alpha})`);
  g.addColorStop(0.55, `rgba(228, 214, 255, ${0.7 * alpha})`);
  g.addColorStop(0.85, `rgba(255, 196, 232, ${0.82 * alpha})`);
  g.addColorStop(1, `rgba(196, 226, 255, ${0.9 * alpha})`);
  return g;
}

// Torn pieces of the bubble skin that fly off when it bursts: jagged
// flaps plus a few curled strands, like gum snapping.
function makeShards(cx, cy, count) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const strand = i % 3 === 0;
    const corners = 7;
    const points = Array.from({ length: corners }, (_, k) => {
      const a = (k / corners) * Math.PI * 2;
      const d = 0.55 + Math.random() * 0.5;
      return [Math.cos(a) * d, Math.sin(a) * d * 0.6];
    });
    return {
      angle,
      strand,
      startDistance: Math.random() * 0.55,
      speed: 0.6 + Math.random() * 0.6,
      size: strand ? 60 + Math.random() * 80 : 35 + Math.random() * 80,
      spin: (Math.random() - 0.5) * 6,
      curl: (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 1.5),
      points,
      cx,
      cy,
    };
  });
}

function drawShard(ctx, s, size, t) {
  if (s.strand) {
    // A strip of skin that curls up as it flies
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.6, 0, Math.PI * (0.4 + 0.5 * (1 - t)) * s.curl, s.curl < 0);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(2, size * 0.12);
    ctx.strokeStyle = 'rgba(255, 214, 240, 0.9)';
    ctx.stroke();
    ctx.lineWidth = Math.max(1, size * 0.04);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.stroke();
    return;
  }
  // Smooth, blobby flap: curve through the midpoints of the outline
  const pts = s.points.map(([px, py]) => [px * size, py * size]);
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  ctx.beginPath();
  const start = mid(pts[pts.length - 1], pts[0]);
  ctx.moveTo(start[0], start[1]);
  pts.forEach((p, k) => {
    const m = mid(p, pts[(k + 1) % pts.length]);
    ctx.quadraticCurveTo(p[0], p[1], m[0], m[1]);
  });
  ctx.closePath();
  ctx.fillStyle = bubbleFill(ctx, 0, 0, size, 0.85);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();
}

// Full-screen "bubble gum" pop: the bubble inflates from where it was on
// screen until it covers everything, then snaps into flying pieces.
export default function PopOverlay({ origin, onBurst, onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext?.('2d');
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!ctx || reduceMotion) {
      onBurst();
      onDone();
      return undefined;
    }

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const x0 = origin?.x ?? w / 2;
    const y0 = origin?.y ?? h / 2;
    const r0 = origin?.radius ?? 60;
    // Far enough to cover every corner from the origin
    const rMax = Math.hypot(Math.max(x0, w - x0), Math.max(y0, h - y0)) * 1.08;
    const seed = Math.random() * 10;
    // Where the bubble ends up once it has filled the screen
    const xEnd = x0 + (w / 2 - x0) * 0.6;
    const yEnd = y0 + (h / 2 - y0) * 0.6;
    const shards = makeShards(xEnd, yEnd, 30);
    let burst = false;
    let frame;
    const start = performance.now();

    const draw = (now) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, w, h);

      if (elapsed < INFLATE_MS) {
        // Inflate: slow at first, then rushing out, drifting toward the centre
        const t = elapsed / INFLATE_MS;
        const e = easeInCubic(t);
        const x = x0 + (xEnd - x0) * e;
        const y = y0 + (yEnd - y0) * e;
        const r = r0 + (rMax - r0) * e;
        blobPath(ctx, x, y, r, t, seed);
        ctx.fillStyle = bubbleFill(ctx, x, y, r, 0.6 + 0.4 * t);
        ctx.fill();
        ctx.lineWidth = 3 + 5 * t;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.stroke();
        // Shine
        ctx.beginPath();
        ctx.ellipse(x - r * 0.38, y - r * 0.42, r * 0.16, r * 0.08, -0.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
      } else {
        if (!burst) {
          burst = true;
          onBurst();
        }
        const t = Math.min((elapsed - INFLATE_MS) / BURST_MS, 1);
        const e = easeOutCubic(t);
        const reach = Math.hypot(w, h) * 0.75;

        // Snap flash
        if (t < 0.25) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.55 * (1 - t / 0.25)})`;
          ctx.fillRect(0, 0, w, h);
        }

        shards.forEach((s) => {
          const d = reach * (s.startDistance + e * s.speed);
          const sx = s.cx + Math.cos(s.angle) * d;
          // Pieces sag as they fall, like stretchy gum
          const sy = s.cy + Math.sin(s.angle) * d + t * t * 180;
          const size = s.size * (1 - 0.6 * t);
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(s.angle + s.spin * t);
          ctx.globalAlpha = 1 - t;
          drawShard(ctx, s, size, t);
          ctx.restore();
        });

        if (t >= 1) {
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
