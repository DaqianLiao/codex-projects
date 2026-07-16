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
import { loadFont } from "@remotion/google-fonts/NotoSansSC";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["chinese-simplified", "latin"],
});

// ──────────────────── Color Palette ────────────────────
const BG = "#1a1a2e";
const CARD_BG = "#16213e";
const YELLOW = "#f9ca24";
const PINK = "#f368e0";
const CYAN = "#00d2d3";
const ORANGE = "#ff9f43";
const GREEN = "#00b894";
const WHITE = "#f1f5f9";
const LIGHT_GRAY = "#c8d6e5";

// ──────────────────── Dot Grid Component ────────────────────
interface DotGridProps {
  rows: number;
  cols: number;
  color: string;
  startFrame: number;
  frame: number;
  radius?: number;
  gap?: number;
  delayPerDot?: number;
}

const DotGrid: React.FC<DotGridProps> = ({
  rows, cols, color, startFrame, frame,
  radius = 12, gap = 56, delayPerDot = 2,
}) => {
  const localFrame = frame - startFrame;
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dotIndex = r * cols + c;
      const dotDelay = dotIndex * delayPerDot;
      const dotSpring = spring({
        frame: Math.max(0, localFrame - dotDelay),
        fps: 30,
        config: { damping: 14, mass: 0.5 },
      });
      const x = c * gap - ((cols - 1) * gap) / 2;
      const y = r * gap - ((rows - 1) * gap) / 2;
      dots.push(
        <div
          key={`${r}-${c}`}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${dotSpring})`,
            width: radius * 2,
            height: radius * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${color}dd, ${color}88)`,
            boxShadow: `0 0 12px ${color}44`,
            opacity: dotSpring,
          }}
        />
      );
    }
  }
  return <>{dots}</>;
};

// ──────────────────── 1. Title Scene ────────────────────
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 10, mass: 0.5 } });
  const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const decorOpacity = interpolate(frame, [0, 15], [0, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${BG} 0%, ${CARD_BG} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Decorative floating circles */}
      {[YELLOW, PINK, CYAN, ORANGE].map((color, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 250 + i * 80,
            height: 250 + i * 80,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
            top: ["10%", "85%", "80%", "15%"][i],
            left: ["15%", "10%", "85%", "80%"][i],
            transform: `translate(-50%, -50%) scale(${1 + Math.sin(frame * 0.015 + i * 1.5) * 0.08})`,
            opacity: decorOpacity,
          }}
        />
      ))}

      {/* Title Card */}
      <div
        style={{
          textAlign: "center",
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 50}px)`,
        }}
      >
        <h1
          style={{
            fontFamily,
            fontSize: 88,
            fontWeight: 800,
            color: WHITE,
            margin: 0,
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
            letterSpacing: "0.06em",
            lineHeight: 1.3,
          }}
        >
          乘法交换律与结合律
        </h1>
        <p
          style={{
            fontFamily,
            fontSize: 32,
            color: YELLOW,
            marginTop: 24,
            marginBottom: 0,
            opacity: subtitleOpacity,
            letterSpacing: "0.2em",
            fontWeight: 500,
          }}
        >
          小学数学 · 三年级
        </p>
      </div>

      {/* Bottom decorative bar */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          width: interpolate(frame, [30, 50], [0, 120], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${YELLOW}, ${PINK}, ${CYAN})`,
          opacity: subtitleOpacity,
        }}
      />
    </AbsoluteFill>
  );
};

// ──────────────────── 2. Commutative Law Intro ────────────────────
const CommutativeIntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({ frame, fps, config: { damping: 10, mass: 0.5 } });
  const formulaSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 14, mass: 0.6 },
  });
  const descOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${BG} 0%, ${CARD_BG} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 80,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: labelSpring,
        }}
      >
        <span
          style={{
            fontFamily,
            fontSize: 22,
            color: CYAN,
            background: `${CYAN}22`,
            padding: "8px 20px",
            borderRadius: 20,
            letterSpacing: "0.1em",
            border: `1px solid ${CYAN}44`,
          }}
        >
          知识点一
        </span>
      </div>

      <h1
        style={{
          fontFamily,
          fontSize: 72,
          fontWeight: 800,
          color: CYAN,
          margin: 0,
          opacity: labelSpring,
          textShadow: `0 0 40px ${CYAN}33`,
        }}
      >
        乘法交换律
      </h1>

      <div
        style={{
          marginTop: 40,
          padding: "20px 48px",
          background: `${CARD_BG}aa`,
          borderRadius: 16,
          border: `2px solid ${CYAN}66`,
          opacity: formulaSpring,
          transform: `scale(${0.7 + 0.3 * formulaSpring})`,
          boxShadow: `0 0 30px ${CYAN}22`,
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize: 56,
            color: WHITE,
            margin: 0,
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          a x b = b x a
        </p>
      </div>

      <p
        style={{
          fontFamily,
          fontSize: 28,
          color: LIGHT_GRAY,
          marginTop: 32,
          opacity: descOpacity,
          maxWidth: 600,
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        两个数相乘，交换乘数的位置，积不变
      </p>
    </AbsoluteFill>
  );
};

// ──────────────────── 3. Commutative Law Demo ────────────────────
const CommutativeDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase1Label = spring({ frame, fps, config: { damping: 12, mass: 0.5 } });
  const phase1Result = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const showArrow = interpolate(frame, [50, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phase2Label = spring({
    frame: Math.max(0, frame - 65),
    fps,
    config: { damping: 12, mass: 0.5 },
  });
  const phase2Result = interpolate(frame, [85, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const equalOpacity = interpolate(frame, [45, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const equalGlow = interpolate(frame, [50, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const fadeBoth = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${BG} 0%, ${CARD_BG} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 40,
          fontFamily,
          fontSize: 20,
          color: LIGHT_GRAY,
          opacity: phase1Label,
        }}
      >
        拖动格子来看看交换前后的变化
      </div>

      {/* Left: 3 x 4 */}
      <div
        style={{
          position: "absolute",
          left: "30%",
          transform: "translateX(-50%)",
          opacity: fadeBoth * phase1Label,
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize: 24,
            color: CYAN,
            textAlign: "center",
            marginBottom: 16,
            fontWeight: 700,
          }}
        >
          3 x 4
        </p>
        <div style={{ position: "relative", width: 200, height: 200 }}>
          <DotGrid
            rows={3}
            cols={4}
            color={CYAN}
            startFrame={5}
            frame={frame}
            radius={14}
            gap={48}
          />
        </div>
        <p
          style={{
            fontFamily,
            fontSize: 28,
            color: CYAN,
            textAlign: "center",
            marginTop: 20,
            marginBottom: 0,
            fontWeight: 700,
            opacity: phase1Result,
          }}
        >
          = 12
        </p>
      </div>

      {/* Equal sign */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: equalOpacity,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize: 48,
            color: YELLOW,
            fontWeight: 700,
            margin: 0,
            textShadow: `0 0 ${20 + equalGlow * 20}px ${YELLOW}66`,
          }}
        >
          =
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, 60px)",
          opacity: showArrow,
        }}
      >
        <svg width={40} height={30} viewBox="0 0 40 30">
          <path
            d="M5 15 L35 15 M25 5 L35 15 L25 25"
            stroke={YELLOW}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Right: 4 x 3 */}
      <div
        style={{
          position: "absolute",
          right: "30%",
          transform: "translateX(50%)",
          opacity: fadeBoth * phase2Label,
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize: 24,
            color: PINK,
            textAlign: "center",
            marginBottom: 16,
            fontWeight: 700,
          }}
        >
          4 x 3
        </p>
        <div style={{ position: "relative", width: 200, height: 200 }}>
          <DotGrid
            rows={4}
            cols={3}
            color={PINK}
            startFrame={70}
            frame={frame}
            radius={14}
            gap={48}
          />
        </div>
        <p
          style={{
            fontFamily,
            fontSize: 28,
            color: PINK,
            textAlign: "center",
            marginTop: 20,
            marginBottom: 0,
            fontWeight: 700,
            opacity: phase2Result,
          }}
        >
          = 12
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ──────────────────── 4. Associative Law Intro ────────────────────
const AssociativeIntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({ frame, fps, config: { damping: 10, mass: 0.5 } });
  const formulaSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 14, mass: 0.6 },
  });
  const descOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${BG} 0%, ${CARD_BG} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: labelSpring,
        }}
      >
        <span
          style={{
            fontFamily,
            fontSize: 22,
            color: ORANGE,
            background: `${ORANGE}22`,
            padding: "8px 20px",
            borderRadius: 20,
            letterSpacing: "0.1em",
            border: `1px solid ${ORANGE}44`,
          }}
        >
          知识点二
        </span>
      </div>

      <h1
        style={{
          fontFamily,
          fontSize: 72,
          fontWeight: 800,
          color: ORANGE,
          margin: 0,
          opacity: labelSpring,
          textShadow: `0 0 40px ${ORANGE}33`,
        }}
      >
        乘法结合律
      </h1>

      <div
        style={{
          marginTop: 36,
          padding: "16px 40px",
          background: `${CARD_BG}aa`,
          borderRadius: 16,
          border: `2px solid ${ORANGE}66`,
          opacity: formulaSpring,
          transform: `scale(${0.7 + 0.3 * formulaSpring})`,
          boxShadow: `0 0 30px ${ORANGE}22`,
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize: 44,
            color: WHITE,
            margin: 0,
            fontWeight: 700,
          }}
        >
          (a x b) x c = a x (b x c)
        </p>
      </div>

      <p
        style={{
          fontFamily,
          fontSize: 28,
          color: LIGHT_GRAY,
          marginTop: 32,
          opacity: descOpacity,
          maxWidth: 700,
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        三个数相乘，先把前两个数相乘，再乘第三个数；
        <br />
        或者先把后两个数相乘，再乘第一个数，积不变。
      </p>
    </AbsoluteFill>
  );
};

// ──────────────────── 5. Associative Law Demo ────────────────────
const AssociativeDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase1Title = spring({ frame, fps, config: { damping: 12, mass: 0.5 } });
  const group1Show = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 12, mass: 0.5 },
  });
  const group1Result = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowOpacity = interpolate(frame, [50, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phase2Title = spring({
    frame: Math.max(0, frame - 60),
    fps,
    config: { damping: 12, mass: 0.5 },
  });
  const group2Show = spring({
    frame: Math.max(0, frame - 75),
    fps,
    config: { damping: 12, mass: 0.5 },
  });
  const group2Result = interpolate(frame, [90, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [115, 135], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${BG} 0%, ${CARD_BG} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Left side: (2x3)x4 */}
      <div
        style={{
          position: "absolute",
          left: "25%",
          transform: "translateX(-50%)",
          opacity: fadeOut * phase1Title,
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize: 28,
            color: ORANGE,
            textAlign: "center",
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          (2 x 3) x 4
        </p>

        <div
          style={{
            position: "relative",
            width: 300,
            height: 120,
            opacity: group1Show,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              padding: "12px 24px",
              borderRadius: 16,
              border: `2px solid ${ORANGE}66`,
              background: `${ORANGE}18`,
              display: "flex",
              gap: 24,
              alignItems: "center",
            }}
          >
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 35%, ${ORANGE}ee, ${ORANGE}88)`,
                  boxShadow: `0 0 6px ${ORANGE}66`,
                }}
              />
            ))}
            <span
              style={{
                fontFamily,
                fontSize: 18,
                color: WHITE,
                fontWeight: 700,
              }}
            >
              = 6
            </span>
          </div>
        </div>

        <div style={{ textAlign: "center", opacity: group1Result }}>
          <svg width={24} height={30} viewBox="0 0 24 30">
            <path
              d="M12 0 L12 20 M4 12 L12 20 L20 12"
              stroke={ORANGE}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div style={{ textAlign: "center", opacity: group1Result }}>
          <p
            style={{
              fontFamily,
              fontSize: 32,
              color: ORANGE,
              fontWeight: 700,
              margin: 0,
              textShadow: `0 0 15px ${ORANGE}44`,
            }}
          >
            6 x 4 = 24
          </p>
        </div>
      </div>

      {/* = sign */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: arrowOpacity * fadeOut,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize: 36,
            color: YELLOW,
            fontWeight: 700,
          }}
        >
          =
        </p>
      </div>

      {/* Right side: 2x(3x4) */}
      <div
        style={{
          position: "absolute",
          right: "25%",
          transform: "translateX(50%)",
          opacity: fadeOut * phase2Title,
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize: 28,
            color: GREEN,
            textAlign: "center",
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          2 x (3 x 4)
        </p>

        <div
          style={{
            position: "relative",
            width: 300,
            height: 120,
            opacity: group2Show,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              padding: "12px 24px",
              borderRadius: 16,
              border: `2px solid ${GREEN}66`,
              background: `${GREEN}18`,
              display: "flex",
              gap: 24,
              alignItems: "center",
            }}
          >
            {[1, 2, 3, 4].map((_, i) => (
              <div
                key={i}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 35%, ${GREEN}ee, ${GREEN}88)`,
                  boxShadow: `0 0 6px ${GREEN}66`,
                }}
              />
            ))}
            <span
              style={{
                fontFamily,
                fontSize: 18,
                color: WHITE,
                fontWeight: 700,
              }}
            >
              = 12
            </span>
          </div>
        </div>

        <div style={{ textAlign: "center", opacity: group2Result }}>
          <svg width={24} height={30} viewBox="0 0 24 30">
            <path
              d="M12 0 L12 20 M4 12 L12 20 L20 12"
              stroke={GREEN}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div style={{ textAlign: "center", opacity: group2Result }}>
          <p
            style={{
              fontFamily,
              fontSize: 32,
              color: GREEN,
              fontWeight: 700,
              margin: 0,
              textShadow: `0 0 15px ${GREEN}44`,
            }}
          >
            2 x 12 = 24
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ──────────────────── 6. Practice Examples ────────────────────
const PracticeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 10, mass: 0.5 } });
  const ex1Opacity = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 12, mass: 0.5 },
  });
  const ex1Result = interpolate(frame, [30, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ex2Opacity = spring({
    frame: Math.max(0, frame - 45),
    fps,
    config: { damping: 12, mass: 0.5 },
  });
  const ex2Result = interpolate(frame, [58, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${BG} 0%, ${CARD_BG} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          fontFamily,
          fontSize: 48,
          fontWeight: 800,
          color: WHITE,
          position: "absolute",
          top: 40,
          margin: 0,
          opacity: titleSpring,
        }}
      >
        来练练手吧！
      </h1>

      {/* Example 1: Commutative */}
      <div
        style={{
          position: "absolute",
          left: "25%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          opacity: ex1Opacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            padding: "20px 32px",
            borderRadius: 16,
            background: `${CARD_BG}bb`,
            border: `2px solid ${CYAN}66`,
            boxShadow: `0 0 20px ${CYAN}22`,
          }}
        >
          <p
            style={{
              fontFamily,
              fontSize: 22,
              color: CYAN,
              margin: "0 0 12px 0",
              fontWeight: 600,
            }}
          >
            交换律
          </p>
          <p
            style={{
              fontFamily,
              fontSize: 40,
              color: WHITE,
              margin: 0,
              fontWeight: 700,
            }}
          >
            5 x 7 = 7 x 5
          </p>
          <p
            style={{
              fontFamily,
              fontSize: 36,
              color: YELLOW,
              margin: "12px 0 0 0",
              fontWeight: 700,
              opacity: ex1Result,
            }}
          >
            35 = 35
          </p>
        </div>
      </div>

      {/* Example 2: Associative */}
      <div
        style={{
          position: "absolute",
          right: "25%",
          top: "40%",
          transform: "translate(50%, -50%)",
          opacity: ex2Opacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            padding: "20px 32px",
            borderRadius: 16,
            background: `${CARD_BG}bb`,
            border: `2px solid ${ORANGE}66`,
            boxShadow: `0 0 20px ${ORANGE}22`,
          }}
        >
          <p
            style={{
              fontFamily,
              fontSize: 22,
              color: ORANGE,
              margin: "0 0 12px 0",
              fontWeight: 600,
            }}
          >
            结合律
          </p>
          <p
            style={{
              fontFamily,
              fontSize: 36,
              color: WHITE,
              margin: 0,
              fontWeight: 700,
            }}
          >
            (2x5)x3 = 2x(5x3)
          </p>
          <p
            style={{
              fontFamily,
              fontSize: 36,
              color: YELLOW,
              margin: "12px 0 0 0",
              fontWeight: 700,
              opacity: ex2Result,
            }}
          >
            30 = 30
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ──────────────────── 7. Summary Scene ────────────────────
const SummaryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 10, mass: 0.5 } });
  const card1Spring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 12, mass: 0.5 },
  });
  const card2Spring = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 12, mass: 0.5 },
  });
  const endOpacity = interpolate(frame, [45, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${BG} 0%, ${CARD_BG} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <h1
        style={{
          fontFamily,
          fontSize: 56,
          fontWeight: 800,
          color: WHITE,
          position: "absolute",
          top: 50,
          margin: 0,
          opacity: titleSpring,
          textShadow: "0 0 30px rgba(255,255,255,0.15)",
        }}
      >
        总结一下
      </h1>

      {/* Card 1: Commutative Law */}
      <div
        style={{
          position: "absolute",
          left: "25%",
          top: "45%",
          transform: "translate(-50%, -50%)",
          opacity: card1Spring,
        }}
      >
        <div
          style={{
            padding: "28px 36px",
            borderRadius: 20,
            background: `linear-gradient(135deg, ${CYAN}22, ${CYAN}11)`,
            border: `2px solid ${CYAN}66`,
            boxShadow: `0 8px 32px ${CYAN}22`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily,
              fontSize: 28,
              color: CYAN,
              fontWeight: 700,
              margin: "0 0 12px 0",
            }}
          >
            交换律
          </p>
          <p
            style={{
              fontFamily,
              fontSize: 36,
              color: WHITE,
              fontWeight: 700,
              margin: 0,
            }}
          >
            a x b = b x a
          </p>
        </div>
      </div>

      {/* Card 2: Associative Law */}
      <div
        style={{
          position: "absolute",
          right: "25%",
          top: "45%",
          transform: "translate(50%, -50%)",
          opacity: card2Spring,
        }}
      >
        <div
          style={{
            padding: "28px 36px",
            borderRadius: 20,
            background: `linear-gradient(135deg, ${ORANGE}22, ${ORANGE}11)`,
            border: `2px solid ${ORANGE}66`,
            boxShadow: `0 8px 32px ${ORANGE}22`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily,
              fontSize: 28,
              color: ORANGE,
              fontWeight: 700,
              margin: "0 0 12px 0",
            }}
          >
            结合律
          </p>
          <p
            style={{
              fontFamily,
              fontSize: 30,
              color: WHITE,
              fontWeight: 700,
              margin: 0,
            }}
          >
            (axb)xc = ax(bxc)
          </p>
        </div>
      </div>

      {/* Ending message */}
      <p
        style={{
          fontFamily,
          fontSize: 28,
          color: YELLOW,
          position: "absolute",
          bottom: 80,
          margin: 0,
          opacity: endOpacity,
          letterSpacing: "0.1em",
          fontWeight: 600,
          textShadow: `0 0 20px ${YELLOW}44`,
        }}
      >
        数学真有趣！继续加油
      </p>
    </AbsoluteFill>
  );
};

// ──────────────────── Main Composition ────────────────────
export const MultiplicationLaws: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Sequence from={0} durationInFrames={60} premountFor={15}>
        <TitleScene />
      </Sequence>
      <Sequence from={55} durationInFrames={60} premountFor={15}>
        <CommutativeIntroScene />
      </Sequence>
      <Sequence from={110} durationInFrames={120} premountFor={15}>
        <CommutativeDemoScene />
      </Sequence>
      <Sequence from={225} durationInFrames={60} premountFor={15}>
        <AssociativeIntroScene />
      </Sequence>
      <Sequence from={280} durationInFrames={135} premountFor={15}>
        <AssociativeDemoScene />
      </Sequence>
      <Sequence from={410} durationInFrames={75} premountFor={15}>
        <PracticeScene />
      </Sequence>
      <Sequence from={480} durationInFrames={75} premountFor={15}>
        <SummaryScene />
      </Sequence>
    </AbsoluteFill>
  );
};
