import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
  Easing,
} from "remotion";

// ──────────────────── Colors ────────────────────
const BG = "#0a0a1a";
const ACCENT1 = "#60a5fa";
const ACCENT2 = "#a78bfa";
const ACCENT3 = "#f472b6";
const ACCENT4 = "#34d399";
const WHITE = "#f1f5f9";

// ──────────────────── Helpers ────────────────────
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// ──────────────────── Scene 1: Title ────────────────────
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const subtitleOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${ACCENT1}22 0%, transparent 70%)`,
          top: "10%",
          left: "20%",
          transform: `translate(-50%, -50%) scale(${1 + Math.sin(frame * 0.02) * 0.05})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${ACCENT2}22 0%, transparent 70%)`,
          bottom: "10%",
          right: "15%",
          transform: `translate(50%, 50%) scale(${1 + Math.cos(frame * 0.025) * 0.05})`,
        }}
      />

      {/* Title */}
      <h1
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 96,
          fontWeight: 700,
          color: WHITE,
          margin: 0,
          transform: `translateY(${(1 - titleSpring) * 60}px)`,
          opacity: titleSpring,
          letterSpacing: "0.02em",
        }}
      >
        Math &amp; Motion
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 28,
          color: ACCENT1,
          marginTop: 16,
          opacity: subtitleOpacity,
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
        }}
      >
        Made with Remotion
      </p>
    </AbsoluteFill>
  );
};

// ──────────────────── Scene 2: Animated shapes ────────────────────
const ShapeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shapes = [
    { color: ACCENT1, size: 80, delay: 0, label: "π", rotate: true },
    { color: ACCENT2, size: 100, delay: 5, label: "∑", rotate: false },
    { color: ACCENT3, size: 70, delay: 10, label: "∫", rotate: true },
    { color: ACCENT4, size: 90, delay: 15, label: "∞", rotate: false },
  ];

  return (
    <AbsoluteFill style={{ background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {shapes.map((shape, i) => {
        const s = spring({
          frame: frame - shape.delay,
          fps,
          config: { damping: 14, mass: 0.8 },
        });

        const angle = (frame * 0.01 + (i * Math.PI) / 2) % (Math.PI * 2);
        const radius = 280;
        const x = 960 + Math.cos(angle) * radius * s;
        const y = 540 + Math.sin(angle) * radius * s;

        const rotation = shape.rotate
          ? interpolate(frame, [0, 60], [0, 360], {
              extrapolateRight: "repeat",
            })
          : 0;

        const scale = 0.5 + 0.5 * Math.sin(frame * 0.03 + i);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale * s})`,
              opacity: s,
              width: shape.size,
              height: shape.size,
              borderRadius: shape.rotate ? "50%" : "20%",
              background: `linear-gradient(135deg, ${shape.color}, ${shape.color}88)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Georgia, serif",
              fontSize: 32,
              fontWeight: 700,
              color: WHITE,
              boxShadow: `0 0 40px ${shape.color}44`,
              transition: "none",
            }}
          >
            {shape.label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ──────────────────── Scene 3: Formula ────────────────────
const FormulaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const reveal = spring({ frame, fps, config: { damping: 14, mass: 0.7 } });
  const glowOpacity = interpolate(frame, [0, 20], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Glow background */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${ACCENT2}33 0%, transparent 70%)`,
          opacity: glowOpacity,
        }}
      />

      {/* Formula card */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #0a0a1a 100%)",
          border: `1px solid ${ACCENT2}44`,
          borderRadius: 16,
          padding: "48px 64px",
          boxShadow: `0 0 60px ${ACCENT2}22, 0 0 120px ${ACCENT2}11`,
          opacity: reveal,
          transform: `translateY(${(1 - reveal) * 40}px)`,
          textAlign: "center" as const,
        }}
      >
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 64,
            color: ACCENT2,
            margin: 0,
            letterSpacing: "0.05em",
          }}
        >
          e<sup>iπ</sup> + 1 = 0
        </p>
        <p
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 20,
            color: ACCENT1,
            marginTop: 24,
            marginBottom: 0,
            opacity: interpolate(frame, [20, 35], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            letterSpacing: "0.1em",
          }}
        >
          Euler&rsquo;s Identity
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ──────────────────── Scene 4: Outro ────────────────────
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const lineWidth = interpolate(frame, [10, 30], [0, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  return (
    <AbsoluteFill
      style={{
        background: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn,
        transform: `scale(${0.9 + 0.1 * fadeIn})`,
      }}
    >
      <div style={{ textAlign: "center" as const }}>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 48,
            color: WHITE,
            margin: 0,
          }}
        >
          Thanks for watching
        </p>

        <div
          style={{
            width: lineWidth,
            height: 2,
            background: `linear-gradient(90deg, ${ACCENT1}, ${ACCENT2})`,
            margin: "24px auto",
            borderRadius: 1,
          }}
        />

        <p
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 18,
            color: ACCENT1,
            margin: 0,
            letterSpacing: "0.1em",
          }}
        >
          Built with Remotion
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ──────────────────── Main Composition ────────────────────
export const Demo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Sequence from={0} durationInFrames={45}>
        <TitleScene />
      </Sequence>
      <Sequence from={45} durationInFrames={60}>
        <ShapeScene />
      </Sequence>
      <Sequence from={105} durationInFrames={35}>
        <FormulaScene />
      </Sequence>
      <Sequence from={140} durationInFrames={10}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
