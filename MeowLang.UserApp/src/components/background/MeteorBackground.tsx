// File: src/components/background/MeteorBackground.tsx

import { useEffect, useRef } from "react";

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  width: number;
  color: [number, number, number];
  life: number;
  maxLife: number;
  glowRadius: number;
}

function randomColor(): [number, number, number] {
  const palette: [number, number, number][] = [
    [20, 80, 255],
    [0, 140, 255],
    [0, 200, 230],
    [0, 220, 180],
    [100, 60, 220],
    [60, 120, 255],
    [0, 180, 200],
  ];
  return palette[Math.floor(Math.random() * palette.length)];
}

function createMeteor(W: number, H: number, stagger?: boolean): Meteor {
  // Start from top-left area — move toward bottom-right
  // Change starting position — anywhere on screen
  const x = Math.random() * W * 1.2 - W * 0.2;
  const y = Math.random() * H * 0.8 - H * 0.2;

  // Direction — top-left to bottom-right
  const speed = Math.random() * 0.5 + 0.2;
  const angle = Math.PI * 0.25 + (Math.random() - 0.5) * 0.2;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;

  const length = Math.random() * 350 + 250;
  const maxLife = Math.random() * 400 + 300;

  return {
    x,
    y,
    vx,
    vy,
    length,
    width: Math.random() * 2.5 + 1.2,
    color: randomColor(),
    life: stagger ? Math.random() * maxLife : 0,
    maxLife,
    glowRadius: Math.random() * 14 + 8,
  };
}

function MeteorBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const W = canvas.width;
    const H = canvas.height;
    // Generate stars once — never changes
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      radius: Math.random() * 1.2 + 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const meteors: Meteor[] = Array.from({ length: 20 }, () =>
      createMeteor(W, H, true),
    );

    let animId: number;

    const draw = () => {
      time++;
      ctx.clearRect(0, 0, W, H);

      // Pure deep navy
      ctx.fillStyle = "#050812";
      ctx.fillRect(0, 0, W, H);

      // Very subtle nebula atmosphere
      const neb1 = ctx.createRadialGradient(
        W * 0.2,
        H * 0.2,
        0,
        W * 0.2,
        H * 0.2,
        W * 0.5,
      );
      neb1.addColorStop(0, "rgba(10, 20, 80, 0.10)");
      neb1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, W, H);
      // ── Stars ─────────────────────────────────────────────────
      stars.forEach((star) => {
        // Gentle twinkling using sine wave
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const currentOpacity = star.opacity * (0.7 + twinkle * 0.3);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();

        // Tiny soft glow around each star
        const glow = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.radius * 4,
        );
        glow.addColorStop(0, `rgba(180, 210, 255, ${currentOpacity * 0.3})`);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      });
      meteors.forEach((m, i) => {
        m.life++;
        m.x += m.vx;
        m.y += m.vy;

        const lifeRatio = m.life / m.maxLife;
        let alpha: number;
        if (lifeRatio < 0.06) {
          alpha = lifeRatio / 0.06;
        } else if (lifeRatio > 0.8) {
          alpha = (1 - lifeRatio) / 0.2;
        } else {
          alpha = 1;
        }
        alpha = Math.max(0, Math.min(1, alpha));

        const [r, g, b] = m.color;

        const dist = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
        const nx = m.vx / dist;
        const ny = m.vy / dist;

        // Tail is behind the head
        const tailX = m.x - nx * m.length;
        const tailY = m.y - ny * m.length;

        ctx.save();

        // ── Core streak only — no wide glow stroke ──
        const streakGrad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        streakGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        streakGrad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${alpha * 0.2})`);
        streakGrad.addColorStop(0.88, `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`);
        streakGrad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.95})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = streakGrad;
        ctx.lineWidth = m.width;
        ctx.lineCap = "round";
        ctx.stroke();

        // ── Head bloom only — no streak glow ────────
        // Outer soft bloom
        const outerBloom = ctx.createRadialGradient(
          m.x,
          m.y,
          0,
          m.x,
          m.y,
          m.glowRadius * 2.5,
        );
        outerBloom.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`);
        outerBloom.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.08})`);
        outerBloom.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.glowRadius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = outerBloom;
        ctx.fill();

        // Inner bright white core
        const innerBloom = ctx.createRadialGradient(
          m.x,
          m.y,
          0,
          m.x,
          m.y,
          m.glowRadius * 0.6,
        );
        innerBloom.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
        innerBloom.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`);
        innerBloom.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.glowRadius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = innerBloom;
        ctx.fill();

        ctx.restore();

        // Reset when done or off screen
        if (
          m.life >= m.maxLife ||
          m.x > W + m.length + 100 ||
          m.y > H + m.length + 100
        ) {
          meteors[i] = createMeteor(W, H);
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}

export default MeteorBackground;
