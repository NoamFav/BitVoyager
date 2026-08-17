import { useMemo } from "react";

const COLORS = ["rgba(59,130,246,0.5)", "rgba(139,92,246,0.5)", "rgba(6,182,212,0.5)", "rgba(16,185,129,0.5)"];

// Shared ambient background for the Bash module (map, lesson, playground).
// Every light runs its own continuous CSS keyframe loop (randomized
// duration/delay per light) instead of a setInterval nudging styles every
// couple of seconds — genuinely animated, not "static until updated".
export default function CityBackdrop() {
  const lights = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        width: 20 + Math.random() * 100,
        height: 20 + Math.random() * 100,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        duration: 4 + Math.random() * 5,
        delay: -Math.random() * 6,
        drift: 15 + Math.random() * 25,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 z-0 bg-gradient-to-b from-gray-900 via-indigo-900 to-gray-900 overflow-hidden pointer-events-none">
      <div
        className="absolute bottom-0 left-0 right-0 h-64 bg-gray-900 opacity-60"
        style={{
          maskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='1200' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,250 L50,240 L80,190 L110,230 L140,210 L180,180 L220,240 L270,220 L300,200 L320,230 L350,210 L380,190 L420,240 L460,200 L490,230 L520,210 L550,190 L590,220 L630,230 L660,210 L690,200 L720,240 L750,220 L790,180 L830,240 L870,210 L910,230 L940,200 L980,220 L1020,240 L1050,190 L1080,210 L1110,230 L1140,200 L1170,240 L1200,250 L1200,300 L0,300 Z' fill='%23111827'/%3E%3C/svg%3E\")",
        }}
      />

      {lights.map((light) => (
        <div
          key={light.id}
          className="city-glow absolute rounded-full"
          style={{
            width: light.width,
            height: light.height,
            top: light.top,
            left: light.left,
            background: `radial-gradient(circle, ${light.color} 0%, transparent 70%)`,
            animation: `cityGlowPulse ${light.duration}s ease-in-out ${light.delay}s infinite, cityGlowDrift ${light.duration * 1.6}s ease-in-out ${light.delay}s infinite`,
            "--drift": `${light.drift}px`,
          }}
        />
      ))}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          opacity: 0.5,
        }}
      />

      <style>
        {`
          @keyframes cityGlowPulse {
            0%, 100% { opacity: 0.25; filter: blur(20px); }
            50% { opacity: 0.6; filter: blur(30px); }
          }
          @keyframes cityGlowDrift {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(var(--drift), calc(var(--drift) * -0.6)) scale(1.15); }
          }
        `}
      </style>
    </div>
  );
}
