import React, { useEffect, useRef } from 'react';

const BackgroundEffects = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Resize and initialize particles
    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Responsive particle count based on screen size
      const particleCount = Math.floor((canvas.width * canvas.height) / 12000);
      particles = [];
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8, // Slower, more elegant speed
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 2 + 0.5,
          color: Math.random() > 0.5 ? '#00E5FF' : '#7C3AED', // Cyan and Purple mix
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Move
        p.x += p.vx;
        p.y += p.vy;
        
        // Soft bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        // Draw Particle (Node)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow for lines
        
        // Draw Connections (Neural Network effect)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // If particles are close enough, draw a connecting line
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Opacity fades out as distance increases
            const opacity = 1 - (dist / 130);
            
            // Create a gradient line between the two node colors
            const grad = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
            // Convert hex to rgba for opacity
            const c1 = p.color === '#00E5FF' ? `rgba(0, 229, 255, ${opacity * 0.4})` : `rgba(124, 58, 237, ${opacity * 0.4})`;
            const c2 = p2.color === '#00E5FF' ? `rgba(0, 229, 255, ${opacity * 0.4})` : `rgba(124, 58, 237, ${opacity * 0.4})`;
            
            grad.addColorStop(0, c1);
            grad.addColorStop(1, c2);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(drawParticles);
    };

    initCanvas();
    drawParticles();

    window.addEventListener('resize', initCanvas);
    
    return () => {
      window.removeEventListener('resize', initCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
      {/* Dynamic Neural Network Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full opacity-60"
      />
      
      {/* Massive Ambient Glowing Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-secondary/10 blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
      
      {/* Vignette effect around the edges to focus on the center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#0B1020_120%)]" />
    </div>
  );
};

export default BackgroundEffects;
