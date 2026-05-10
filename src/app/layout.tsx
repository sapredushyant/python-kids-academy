import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import AchievementToast from '@/components/AchievementToast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Python Academy — Learn Python Like a Pro!',
  description:
    'An interactive Python learning adventure for kids aged 10-14. Master Python through games, challenges, and real code!',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><text y="32" font-size="32">🐍</text></svg>',
  },
};

// ---------------------------------------------------------------------------
// Deterministic star generator — LCG: seed=42, a=1664525, c=1013904223, m=2^32
// Produces the same values on server and client, avoiding SSR hydration mismatches.
// ---------------------------------------------------------------------------
function lcgNext(seed: number): number {
  // JavaScript bitwise ops work on 32-bit signed integers.
  // We keep the result in the unsigned 32-bit range via >>> 0.
  return (((seed * 1664525) >>> 0) + 1013904223) >>> 0;
}

interface StarProps {
  x: number;       // left position as a percentage (0-99)
  y: number;       // top position as a percentage (0-99)
  size: number;    // diameter in px (1-3)
  duration: number;// twinkle duration in seconds (2-5)
  delay: number;   // animation delay in seconds (0-5)
}

function generateStars(count: number): StarProps[] {
  const stars: StarProps[] = [];
  let seed = 42;

  for (let i = 0; i < count; i++) {
    seed = lcgNext(seed);
    const x = seed % 100;

    seed = lcgNext(seed);
    const y = seed % 100;

    seed = lcgNext(seed);
    const size = 1 + (seed % 3); // 1, 2, or 3

    seed = lcgNext(seed);
    const duration = 2 + (seed % 4); // 2, 3, 4, or 5

    seed = lcgNext(seed);
    const delay = seed % 6; // 0 – 5

    stars.push({ x, y, size, duration, delay });
  }

  return stars;
}

const STARS = generateStars(40);

// ---------------------------------------------------------------------------
// Starfield — rendered once on the server, no client JS needed.
// ---------------------------------------------------------------------------
function Starfield() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {STARS.map((star, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            // CSS custom properties consumed by the .star keyframe in globals.css
            ['--duration' as string]: `${star.duration}s`,
            ['--delay' as string]: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root layout
// ---------------------------------------------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body
        style={{
          background: 'var(--space-950)',
          position: 'relative',
        }}
      >
        {/* Fixed cosmic starfield behind all content */}
        <Starfield />

        {/* Subtle radial gradient overlay for depth */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 0,
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(109,40,217,0.15) 0%, transparent 60%)',
          }}
        />

        {/* All page content sits above the starfield */}
        <div className="relative" style={{ zIndex: 1 }}>
          <Navigation />
          <main>{children}</main>
          <AchievementToast />
        </div>
      </body>
    </html>
  );
}
