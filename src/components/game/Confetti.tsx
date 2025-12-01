import { useEffect, useRef } from "react";

export function Confetti() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: any[] = [];
        const colors = ['#FFD700', '#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF'];

        // Initial burst
        for (let i = 0; i < 150; i++) {
            particles.push({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 1) * 20, // Upward bias
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 10
            });
        }

        let animationId: number;

        const loop = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.5; // gravity
                p.rotation += p.vRot;
                p.vx *= 0.99; // drag

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                ctx.restore();

                if (p.y > canvas.height) particles.splice(i, 1);
            });

            if (particles.length > 0) {
                animationId = requestAnimationFrame(loop);
            }
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();
        loop();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />;
}
