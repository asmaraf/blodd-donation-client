import React, { useState, useEffect, useRef, Component } from 'react';
import Spline from '@splinetool/react-spline';
import { Droplet, Sparkles } from 'lucide-react';

class SplineErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Spline 3D Scene loading caught (fallback active):', error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

const SplineHero3D = () => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const canvasRef = useRef(null);

  // Fallback 3D Canvas rendering interactive floating blood droplets & particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth || 300);
    let height = (canvas.height = canvas.offsetHeight || 300);

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 8 + 4,
      color: Math.random() > 0.3 ? '#f43f5e' : '#e11d48',
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      pulse: Math.random() * Math.PI * 2,
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw central interactive glowing 3D sphere
      const time = Date.now() * 0.002;
      const sphereX = width / 2 + Math.sin(time) * 15;
      const sphereY = height / 2 + Math.cos(time * 0.8) * 15;

      const grad = ctx.createRadialGradient(
        sphereX - 20,
        sphereY - 20,
        5,
        sphereX,
        sphereY,
        70
      );
      grad.addColorStop(0, '#fb7185');
      grad.addColorStop(0.5, '#e11d48');
      grad.addColorStop(1, '#881337');

      ctx.beginPath();
      ctx.arc(sphereX, sphereY, 65, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Render surrounding 3D Floating Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        p.pulse += 0.03;
        const currentRadius = p.radius + Math.sin(p.pulse) * 2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.75;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full h-[320px] sm:h-[400px] rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl flex items-center justify-center">
      {/* Interactive 3D Canvas Scene */}
      <canvas ref={canvasRef} className="w-full h-full absolute inset-0 z-0" />

      {/* Spline 3D Scene safely wrapped in Error Boundary */}
      {!hasError && (
        <SplineErrorBoundary>
          <Spline
            scene="https://prod.spline.design/6Wnt1d76EchdcT6O/scene.splinecode"
            onLoad={() => setLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full relative z-10 transition-opacity duration-700 ${
              loaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        </SplineErrorBoundary>
      )}


    </div>
  );
};

export default SplineHero3D;
