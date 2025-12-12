"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 540;
const PLANE_SPEED = 4;
const BULLET_SPEED = 8;
const MONSTER_BULLET_SPEED = 5;

const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createMonster() {
  const palette = [
    ["#ff6b6b", "#ffe66d", "#ffd93d", "#ffa3a3"],
    ["#5eead4", "#93c5fd", "#f9a8d4", "#67e8f9"],
    ["#c084fc", "#fcd34d", "#f472b6", "#a855f7"],
    ["#fb7185", "#38bdf8", "#f0abfc", "#fca5a5"],
  ];
  const colors = palette[Math.floor(Math.random() * palette.length)];
  const radius = randomBetween(60, 90);
  return {
    x: CANVAS_WIDTH / 2,
    y: 140,
    vx: randomBetween(-1.2, 1.2),
    hp: 200,
    maxHp: 200,
    radius,
    body: colors[0],
    eye: colors[1],
    accent: colors[2],
    shell: colors[3],
  };
}

export default function KaijuInteraction() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [playerHp, setPlayerHp] = useState(100);
  const [status, setStatus] = useState("Pilot the fighter, shoot the monster, dodge counter-fire.");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    let running = true;

    const keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false, Space: false };
    const plane = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 90, hp: 100, lastShot: 0 };
    let monster = createMonster();
    let bullets = [];
    let monsterBullets = [];

    const handleKeyDown = (e) => {
      if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
        e.preventDefault();
      }
    };
    const handleKeyUp = (e) => {
      if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const spawnMonsterBullet = () => {
      // aim roughly at plane with some spread
      const dx = plane.x - monster.x + randomBetween(-80, 80);
      const dy = plane.y - monster.y + randomBetween(-20, 40);
      const len = Math.hypot(dx, dy) || 1;
      const speed = MONSTER_BULLET_SPEED + Math.random() * 1.5;
      monsterBullets.push({
        x: monster.x,
        y: monster.y + monster.radius * 0.4,
        vx: (dx / len) * speed,
        vy: (dy / len) * speed,
      });
    };

    let lastMonsterShot = performance.now();

    const drawMonster = (m) => {
      ctx.save();
      ctx.translate(m.x, m.y);

      // body gradient for depth
      const grad = ctx.createRadialGradient(0, -m.radius * 0.3, m.radius * 0.2, 0, 0, m.radius * 1.1);
      grad.addColorStop(0, m.shell);
      grad.addColorStop(0.5, m.body);
      grad.addColorStop(1, "#1f0a0a");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, m.radius, m.radius * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // dorsal plates
      ctx.fillStyle = m.accent;
      for (let i = -3; i <= 3; i++) {
        const w = m.radius * 0.2;
        const h = m.radius * 0.25;
        const x = (i / 4) * m.radius * 1.1;
        ctx.beginPath();
        ctx.moveTo(x, -m.radius * 0.6);
        ctx.lineTo(x + w * 0.4, -m.radius * 0.6 - h);
        ctx.lineTo(x + w * 0.8, -m.radius * 0.6);
        ctx.closePath();
        ctx.fill();
      }

      // eyes
      ctx.fillStyle = m.eye;
      ctx.beginPath();
      ctx.ellipse(-m.radius * 0.32, -m.radius * 0.1, m.radius * 0.18, m.radius * 0.12, 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(m.radius * 0.32, -m.radius * 0.1, m.radius * 0.18, m.radius * 0.12, -0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(-m.radius * 0.3, -m.radius * 0.1, m.radius * 0.06, 0, Math.PI * 2);
      ctx.arc(m.radius * 0.3, -m.radius * 0.1, m.radius * 0.06, 0, Math.PI * 2);
      ctx.fill();

      // mouth + teeth
      ctx.fillStyle = m.accent;
      ctx.beginPath();
      ctx.arc(0, m.radius * 0.18, m.radius * 0.22, 0, Math.PI, false);
      ctx.fill();
      ctx.fillStyle = "#f8fafc";
      for (let i = -2; i <= 2; i++) {
        const tx = (i / 3) * m.radius * 0.35;
        ctx.beginPath();
        ctx.moveTo(tx, m.radius * 0.18);
        ctx.lineTo(tx + m.radius * 0.05, m.radius * 0.26);
        ctx.lineTo(tx - m.radius * 0.05, m.radius * 0.26);
        ctx.closePath();
        ctx.fill();
      }
      // lower tooth row
      ctx.fillStyle = "#e2e8f0";
      for (let i = -1; i <= 1; i++) {
        const tx = (i / 2) * m.radius * 0.28;
        ctx.beginPath();
        ctx.moveTo(tx, m.radius * 0.26);
        ctx.lineTo(tx + m.radius * 0.05, m.radius * 0.34);
        ctx.lineTo(tx - m.radius * 0.05, m.radius * 0.34);
        ctx.closePath();
        ctx.fill();
      }

      // tentacle/arms hints
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 3;
      for (let i = -2; i <= 2; i++) {
        const ang = (i / 4) * Math.PI * 0.6;
        const sx = Math.cos(ang) * m.radius * 0.9;
        const sy = Math.sin(ang) * m.radius * 0.6;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(sx * 1.2, sy + m.radius * 0.6, sx * 1.1, sy + m.radius);
        ctx.stroke();
      }

      // HP bar
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(-m.radius, -m.radius - 18, m.radius * 2, 8);
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(-m.radius, -m.radius - 18, (m.hp / m.maxHp) * m.radius * 2, 8);

      ctx.restore();
    };

    const drawPlane = () => {
      ctx.save();
      ctx.translate(plane.x, plane.y);
      ctx.fillStyle = "#60a5fa";
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(12, 16);
      ctx.lineTo(-12, 16);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#1d4ed8";
      ctx.fillRect(-6, -2, 12, 8);
      ctx.restore();
    };

    const drawBullets = () => {
      ctx.fillStyle = "#fbbf24";
      bullets.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = "#f87171";
      monsterBullets.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const loop = (ts) => {
      if (!running) return;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Background grid
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      for (let x = 0; x < CANVAS_WIDTH; x += 30) {
        ctx.fillRect(x, 0, 1, CANVAS_HEIGHT);
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 30) {
        ctx.fillRect(0, y, CANVAS_WIDTH, 1);
      }

      // Plane movement
      if (keys.ArrowLeft) plane.x -= PLANE_SPEED;
      if (keys.ArrowRight) plane.x += PLANE_SPEED;
      if (keys.ArrowUp) plane.y -= PLANE_SPEED;
      if (keys.ArrowDown) plane.y += PLANE_SPEED;
      plane.x = clamp(plane.x, 20, CANVAS_WIDTH - 20);
      plane.y = clamp(plane.y, CANVAS_HEIGHT / 2, CANVAS_HEIGHT - 30);

      // Shooting
      if (keys.Space && ts - plane.lastShot > 220) {
        bullets.push({ x: plane.x, y: plane.y - 18 });
        plane.lastShot = ts;
      }

      // Update monster movement
      monster.x += monster.vx;
      if (monster.x < monster.radius || monster.x > CANVAS_WIDTH - monster.radius) {
        monster.vx *= -1;
      }

      // Monster shooting
    if (ts - lastMonsterShot > 750) {
        spawnMonsterBullet();
        lastMonsterShot = ts;
      }

      // Update bullets
      bullets = bullets
        .map((b) => ({ ...b, y: b.y - BULLET_SPEED }))
        .filter((b) => b.y > -10);
      monsterBullets = monsterBullets
        .map((b) => ({ ...b, x: b.x + b.vx, y: b.y + b.vy }))
        .filter((b) => b.y < CANVAS_HEIGHT + 20 && b.x > -20 && b.x < CANVAS_WIDTH + 20);

      // Collisions: bullets vs monster
      bullets.forEach((b) => {
        const dx = b.x - monster.x;
        const dy = b.y - monster.y;
        if (Math.hypot(dx, dy) < monster.radius * 0.9) {
          monster.hp = Math.max(0, monster.hp - 10);
          b.y = -1000; // remove
          setScore((s) => s + 10);
        }
      });
      bullets = bullets.filter((b) => b.y > -500);

      // Collisions: monster bullets vs plane
      monsterBullets.forEach((b) => {
        const dx = b.x - plane.x;
        const dy = b.y - plane.y;
        if (Math.hypot(dx, dy) < 16) {
          plane.hp = Math.max(0, plane.hp - 10);
          setPlayerHp((hp) => Math.max(0, hp - 10));
          b.y = CANVAS_HEIGHT + 1000;
          setStatus("You've been hit! Keep moving.");
        }
      });
      monsterBullets = monsterBullets.filter((b) => b.y < CANVAS_HEIGHT + 500);

      // Win/respawn monster
      if (monster.hp <= 0) {
        monster = createMonster();
        setStatus("New kaiju variant detected. Stay sharp.");
        monsterBullets = [];
        bullets = [];
      }

      // Lose condition
      if (plane.hp <= 0) {
        setStatus("Game Over! The kaiju overran your defenses.");
        running = false;
      }

      // Draw entities
      drawMonster(monster);
      drawPlane();
      drawBullets();

      // HUD
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(12, CANVAS_HEIGHT - 46, 200, 32);
      ctx.fillStyle = plane.hp > 30 ? "#22c55e" : "#ef4444";
      ctx.fillRect(12, CANVAS_HEIGHT - 46, (plane.hp / 100) * 200, 32);
      ctx.strokeStyle = "white";
      ctx.strokeRect(12, CANVAS_HEIGHT - 46, 200, 32);
      ctx.fillStyle = "white";
      ctx.font = "14px sans-serif";
      ctx.fillText(`Plane HP: ${plane.hp}`, 20, CANVAS_HEIGHT - 25);

      if (!running && plane.hp <= 0) {
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "white";
        ctx.font = "28px sans-serif";
        ctx.fillText("GAME OVER", CANVAS_WIDTH / 2 - 90, CANVAS_HEIGHT / 2 - 10);
        ctx.font = "18px sans-serif";
        ctx.fillText("Refresh to retry", CANVAS_WIDTH / 2 - 80, CANVAS_HEIGHT / 2 + 20);
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#210000] via-[#3a0000] to-[#5a0c0c] text-slate-100 px-6 py-10 flex justify-center">
      <div className="w-full max-w-5xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-white/80">Kaiju Counter</div>
            <h1 className="text-3xl font-bold text-white">Repel the Kaiju</h1>
            <p className="text-sm text-white/80">Fly the fighter (arrow keys) and fire (space) to push back the beast. Dodge its counter-fire.</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/70">Score</div>
            <div className="text-lg font-semibold text-white">{score}</div>
            <div className="text-sm text-white/70 mt-1">Plane HP: {playerHp}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm shadow-2xl p-3">
          <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-auto rounded-xl bg-black/40" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm shadow-2xl p-4">
          <div className="text-sm text-white/80">{status}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm shadow-2xl p-4 text-sm text-white/80 space-y-1">
          <div className="font-semibold text-white">Controls</div>
          <div>Move: Arrow keys</div>
          <div>Shoot: Spacebar</div>
          <div>Goal: Damage the kaiju while dodging counter-fire. Plane HP hits 0 → Game Over.</div>
        </div>
      </div>
    </main>
  );
}
