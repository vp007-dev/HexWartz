import React, { useEffect, useRef } from 'react';

export default function LumosCanvas({ activeSpell = 'lumos', spellBurstTrigger = 0 }) {
  const canvasRef = useRef(null);
  const activeSpellRef = useRef(activeSpell);
  activeSpellRef.current = activeSpell;

  const burstQueueRef = useRef([]);

  // Spells color palettes
  const getSpellPalette = (spell) => {
    if (spell === 'incendio') {
      return [
        'rgba(255, 90, 40, ',   // Fiery Orange
        'rgba(242, 190, 66, ',  // Gold Spark
        'rgba(217, 70, 50, ',   // Deep Flame Crimson
        'rgba(255, 200, 80, '   // Bright Yellow Flame
      ];
    }
    if (spell === 'patronus') {
      return [
        'rgba(180, 230, 255, ',  // Silver-Cyan
        'rgba(220, 245, 255, ',  // Bright Patronus White
        'rgba(130, 195, 255, ',  // Spectral Blue
        'rgba(240, 250, 255, '   // Mist
      ];
    }
    // Lumos / Default
    return [
      'rgba(242, 190, 66, ',   // Gold
      'rgba(255, 230, 118, ',  // Bright Arcane Gold
      'rgba(204, 162, 98, ',   // Antique Amber
      'rgba(217, 120, 108, ',  // Crimson accent
      'rgba(255, 249, 235, '   // Ivory
    ];
  };

  // Add burst sparks on trigger without wiping existing particles
  useEffect(() => {
    if (spellBurstTrigger > 0) {
      burstQueueRef.current.push({
        spell: activeSpell,
        timestamp: performance.now()
      });
    }
  }, [spellBurstTrigger, activeSpell]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Optimized resize handling
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Smooth Lerped Mouse Coordinates for silky wand movement
    const targetMouse = { x: width / 2, y: height / 2, active: false };
    const mouse = { x: width / 2, y: height / 2, active: false };

    const handleMouseMove = (e) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
      targetMouse.active = true;
    };

    const handleMouseLeave = () => {
      targetMouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Particle pool - persistent across spell switches
    const particleCount = Math.min(65, Math.floor(width / 24));
    const colors = getSpellPalette(activeSpellRef.current);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        baseColor: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35 - (activeSpellRef.current === 'incendio' ? 0.7 : 0.15),
        pulsing: Math.random() * Math.PI,
        pulseSpeed: 0.018 + Math.random() * 0.025
      });
    }

    const burstParticles = [];

    let isVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let lastTime = performance.now();

    const render = (time) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const currentSpell = activeSpellRef.current;
      const currentColors = getSpellPalette(currentSpell);

      // Smooth mouse lerp for wand trailing
      if (targetMouse.active) {
        mouse.x += (targetMouse.x - mouse.x) * 0.16;
        mouse.y += (targetMouse.y - mouse.y) * 0.16;
        mouse.active = true;
      } else {
        mouse.active = false;
      }

      // Check if burst queue has events
      if (burstQueueRef.current.length > 0) {
        burstQueueRef.current.forEach((evt) => {
          const spawnX = mouse.active ? mouse.x : width / 2;
          const spawnY = mouse.active ? mouse.y : height / 2;
          const burstCount = evt.spell === 'patronus' ? 40 : 30;
          const burstColors = getSpellPalette(evt.spell);

          for (let b = 0; b < burstCount; b++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4.5 + 2;
            burstParticles.push({
              x: spawnX,
              y: spawnY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              radius: Math.random() * 2.5 + 1.2,
              alpha: 0.95,
              decay: Math.random() * 0.025 + 0.018,
              color: burstColors[Math.floor(Math.random() * burstColors.length)]
            });
          }
        });
        burstQueueRef.current = [];
      }

      ctx.clearRect(0, 0, width, height);

      // Render localized Wand Spotlight beam (bounded area instead of full-screen clear/fill)
      if (mouse.active) {
        const radius = currentSpell === 'patronus' ? 220 : 160;
        const glowGrad = ctx.createRadialGradient(mouse.x, mouse.y, 8, mouse.x, mouse.y, radius);

        if (currentSpell === 'patronus') {
          glowGrad.addColorStop(0, 'rgba(180, 230, 255, 0.11)');
          glowGrad.addColorStop(0.5, 'rgba(120, 180, 255, 0.035)');
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (currentSpell === 'incendio') {
          glowGrad.addColorStop(0, 'rgba(255, 120, 50, 0.10)');
          glowGrad.addColorStop(0.5, 'rgba(217, 70, 50, 0.03)');
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          // Lumos
          glowGrad.addColorStop(0, 'rgba(255, 230, 118, 0.09)');
          glowGrad.addColorStop(0.5, 'rgba(242, 190, 66, 0.035)');
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw standard particles with two-pass radiant glow (100x faster than ctx.shadowBlur)
      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        p.pulsing += p.pulseSpeed;
        const currentAlpha = p.alpha + Math.sin(p.pulsing) * 0.2;
        const clampedAlpha = Math.max(0.04, Math.min(0.85, currentAlpha));

        p.x += p.speedX;
        p.y += p.speedY;

        // Gentle mouse interaction
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 16900) { // 130px squared
            const dist = Math.sqrt(distSq);
            const force = (130 - dist) / 130;
            if (currentSpell === 'patronus') {
              p.x += (dx / dist) * force * 0.5;
              p.y += (dy / dist) * force * 0.5;
            } else {
              p.x -= (dx / dist) * force * 1.2;
              p.y -= (dy / dist) * force * 1.2;
            }
          }
        }

        // Boundary wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const base = p.baseColor;

        // Outer soft ethereal halo (no shadowBlur needed!)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${base}${clampedAlpha * 0.28})`;
        ctx.fill();

        // Inner bright brilliant core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${base}${clampedAlpha})`;
        ctx.fill();
      }

      // Draw burst particles with high performance
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const bp = burstParticles[i];
        bp.x += bp.vx;
        bp.y += bp.vy;
        bp.vx *= 0.96;
        bp.vy *= 0.96;
        bp.alpha -= bp.decay;

        if (bp.alpha <= 0) {
          burstParticles.splice(i, 1);
          continue;
        }

        // Outer spark halo
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, bp.radius * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `${bp.color}${bp.alpha * 0.3})`;
        ctx.fill();

        // Inner hot spark
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, bp.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${bp.color}${bp.alpha})`;
        ctx.fill();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Particle loop runs continuously without resetting on spell burst

  return (
    <canvas
      ref={canvasRef}
      className={`lumos-particle-canvas spell-mode-${activeSpell}`}
      aria-hidden="true"
    />
  );
}
