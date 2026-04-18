import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

/**
 * Interactive 3D orb that rotates around the cursor when hovered.
 * Pure CSS 3D transforms + Framer Motion springs — no Three.js needed.
 */
export function Cursor3DOrb({
  size = 180,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position relative to container center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [40, -40]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-40, 40]), springConfig);
  const scale = useSpring(1, { damping: 20, stiffness: 200 });

  // Orbiting ring rotations
  const ring1Rotate = useMotionValue(0);
  const ring2Rotate = useMotionValue(0);
  const ring3Rotate = useMotionValue(0);

  // Animate rings continuously
  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.015;
      ring1Rotate.set(t * 50);
      ring2Rotate.set(t * -35);
      ring3Rotate.set(t * 25 + 120);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [ring1Rotate, ring2Rotate, ring3Rotate]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      // Normalize to -1..1
      mouseX.set((e.clientX - centerX) / (rect.width / 2));
      mouseY.set((e.clientY - centerY) / (rect.height / 2));
    },
    [mouseX, mouseY]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.15);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  };

  const half = size / 2;

  return (
    <div
      ref={containerRef}
      className={`relative cursor-pointer ${className}`}
      style={{ width: size, height: size, perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="w-full h-full relative"
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Core sphere */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 30%, rgba(167,139,250,0.9), rgba(139,92,246,0.6) 40%, rgba(99,102,241,0.4) 70%, rgba(79,70,229,0.2))`,
            boxShadow: isHovered
              ? `0 0 60px rgba(167,139,250,0.6), 0 0 120px rgba(139,92,246,0.3), inset 0 0 60px rgba(255,255,255,0.1)`
              : `0 0 40px rgba(167,139,250,0.3), 0 0 80px rgba(139,92,246,0.15), inset 0 0 40px rgba(255,255,255,0.05)`,
            transition: 'box-shadow 0.4s ease',
          }}
        >
          {/* Glass reflection highlight */}
          <div
            className="absolute rounded-full"
            style={{
              top: '12%',
              left: '18%',
              width: '35%',
              height: '25%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.05))',
              borderRadius: '50%',
              filter: 'blur(4px)',
            }}
          />
        </div>

        {/* Orbiting ring 1 */}
        <motion.div
          className="absolute"
          style={{
            top: 0,
            left: 0,
            width: size,
            height: size,
            rotateX: 70,
            rotateZ: ring1Rotate,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              top: -4,
              left: half - 6,
              width: 12,
              height: 12,
              background: 'linear-gradient(135deg, #c084fc, #e879f9)',
              boxShadow: '0 0 20px rgba(192,132,252,0.8)',
              borderRadius: '50%',
            }}
          />
          <div
            className="absolute inset-2 rounded-full"
            style={{
              border: '1.5px solid rgba(167,139,250,0.25)',
            }}
          />
        </motion.div>

        {/* Orbiting ring 2 */}
        <motion.div
          className="absolute"
          style={{
            top: 0,
            left: 0,
            width: size,
            height: size,
            rotateY: 70,
            rotateZ: ring2Rotate,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              top: half - 5,
              left: -4,
              width: 10,
              height: 10,
              background: 'linear-gradient(135deg, #818cf8, #6366f1)',
              boxShadow: '0 0 16px rgba(129,140,248,0.8)',
              borderRadius: '50%',
            }}
          />
          <div
            className="absolute inset-4 rounded-full"
            style={{
              border: '1px solid rgba(129,140,248,0.2)',
            }}
          />
        </motion.div>

        {/* Orbiting ring 3 */}
        <motion.div
          className="absolute"
          style={{
            top: 0,
            left: 0,
            width: size,
            height: size,
            rotateX: 45,
            rotateY: 45,
            rotateZ: ring3Rotate,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              bottom: -3,
              left: half - 4,
              width: 8,
              height: 8,
              background: 'linear-gradient(135deg, #f472b6, #ec4899)',
              boxShadow: '0 0 14px rgba(244,114,182,0.8)',
              borderRadius: '50%',
            }}
          />
          <div
            className="absolute inset-3 rounded-full"
            style={{
              border: '1px dashed rgba(244,114,182,0.15)',
            }}
          />
        </motion.div>

        {/* Center icon */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: 'translateZ(30px)' }}
        >
          <div
            className="text-3xl"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(167,139,250,0.6))',
            }}
          >
            🎓
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Floating 3D geometric shapes for background decoration.
 */
export function Floating3DShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: 1200 }}>
      {/* Rotating cube */}
      <motion.div
        animate={{ rotateX: 360, rotateY: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[15%] right-[12%] w-12 h-12"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Cube faces */}
        {[
          { transform: 'translateZ(24px)', bg: 'rgba(139,92,246,0.15)' },
          { transform: 'rotateY(180deg) translateZ(24px)', bg: 'rgba(99,102,241,0.12)' },
          { transform: 'rotateY(90deg) translateZ(24px)', bg: 'rgba(167,139,250,0.18)' },
          { transform: 'rotateY(-90deg) translateZ(24px)', bg: 'rgba(129,140,248,0.1)' },
          { transform: 'rotateX(90deg) translateZ(24px)', bg: 'rgba(192,132,252,0.15)' },
          { transform: 'rotateX(-90deg) translateZ(24px)', bg: 'rgba(168,85,247,0.12)' },
        ].map((face, i) => (
          <div
            key={i}
            className="absolute w-12 h-12"
            style={{
              transform: face.transform,
              background: face.bg,
              border: '1px solid rgba(167,139,250,0.2)',
              borderRadius: 4,
              backfaceVisibility: 'hidden',
            }}
          />
        ))}
      </motion.div>

      {/* Rotating octahedron (diamond shape) */}
      <motion.div
        animate={{ rotateY: 360, rotateZ: 180 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-[20%] left-[8%] w-10 h-10"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(244,114,182,0.2), rgba(236,72,153,0.1))',
            border: '1px solid rgba(244,114,182,0.25)',
            borderRadius: '4px',
            transform: 'rotateX(45deg) rotateZ(45deg)',
          }}
        />
        <div
          className="absolute inset-1"
          style={{
            background: 'linear-gradient(135deg, rgba(244,114,182,0.3), rgba(236,72,153,0.15))',
            border: '1px solid rgba(244,114,182,0.2)',
            borderRadius: '3px',
            transform: 'rotateX(45deg) rotateZ(45deg) translateZ(12px)',
          }}
        />
      </motion.div>

      {/* Floating torus ring */}
      <motion.div
        animate={{ rotateX: 360, rotateZ: 180 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[60%] right-[18%]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="w-16 h-16 rounded-full"
          style={{
            border: '3px solid rgba(129,140,248,0.2)',
            boxShadow: '0 0 20px rgba(129,140,248,0.1), inset 0 0 20px rgba(129,140,248,0.05)',
            transform: 'rotateX(65deg)',
          }}
        />
      </motion.div>

      {/* Small floating dots */}
      {[
        { top: '25%', left: '5%', delay: 0, size: 6, color: 'rgba(167,139,250,0.5)' },
        { top: '45%', right: '6%', delay: 1.5, size: 4, color: 'rgba(244,114,182,0.5)' },
        { top: '75%', left: '15%', delay: 3, size: 5, color: 'rgba(129,140,248,0.5)' },
        { top: '10%', left: '40%', delay: 2, size: 3, color: 'rgba(192,132,252,0.5)' },
        { top: '85%', right: '25%', delay: 4, size: 4, color: 'rgba(139,92,246,0.4)' },
      ].map((dot, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, delay: dot.delay, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute rounded-full"
          style={{
            top: dot.top,
            left: dot.left,
            right: (dot as { right?: string }).right,
            width: dot.size,
            height: dot.size,
            background: dot.color,
            boxShadow: `0 0 ${dot.size * 3}px ${dot.color}`,
          }}
        />
      ))}

      {/* Orbiting particle trail */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[35%] left-[25%] w-32 h-32"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 4 - i,
              height: 4 - i,
              background: `rgba(167,139,250,${0.6 - i * 0.15})`,
              top: i * 8,
              left: '50%',
              boxShadow: `0 0 8px rgba(167,139,250,${0.4 - i * 0.1})`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
