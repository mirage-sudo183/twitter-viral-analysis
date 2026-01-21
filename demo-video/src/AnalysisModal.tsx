import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

type Factor = {
  text: string;
  points: number;
  isPositive: boolean;
};

type AnalysisModalProps = {
  score: number;
  tweetText: string;
  factors: Factor[];
  suggestions: string[];
  visible: boolean;
  animationProgress?: number; // 0-1 for entrance
};

const getRating = (score: number) => {
  if (score >= 80) return { label: "Excellent", color: "#10b981" };
  if (score >= 60) return { label: "Good", color: "#14b8a6" };
  if (score >= 40) return { label: "Fair", color: "#eab308" };
  return { label: "Needs Work", color: "#ef4444" };
};

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  score,
  tweetText,
  factors,
  suggestions,
  visible,
  animationProgress = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!visible) return null;

  const rating = getRating(score);

  // Entrance animation
  const modalScale = interpolate(animationProgress, [0, 1], [0.8, 1], {
    extrapolateRight: "clamp",
  });
  const modalOpacity = interpolate(animationProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const backdropOpacity = interpolate(animationProgress, [0, 0.5], [0, 0.85], {
    extrapolateRight: "clamp",
  });

  // Score counter animation
  const displayScore = Math.round(
    interpolate(animationProgress, [0.3, 0.8], [0, score], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Glow pulse
  const glowPulse = Math.sin(frame * 0.08) * 0.3 + 0.7;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`,
          backdropFilter: "blur(8px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "relative",
          width: 520,
          maxHeight: 700,
          backgroundColor: "#0a0a0a",
          borderRadius: 24,
          border: "1px solid #1a1a1a",
          boxShadow: `0 0 60px ${rating.color}30, 0 25px 50px rgba(0, 0, 0, 0.5)`,
          transform: `scale(${modalScale})`,
          opacity: modalOpacity,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 24px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 24 24" width={18} height={18} fill="#fff">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span
              style={{
                color: "#e7e9ea",
                fontSize: 18,
                fontWeight: 600,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Viral Analysis
            </span>
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <svg viewBox="0 0 24 24" width={18} height={18} fill="#71767b">
              <path d="M18 6L6 18M6 6l12 12" stroke="#71767b" strokeWidth={2} />
            </svg>
          </div>
        </div>

        {/* Score Circle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px 24px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 160,
              height: 160,
            }}
          >
            {/* Outer glow */}
            <div
              style={{
                position: "absolute",
                top: -10,
                left: -10,
                right: -10,
                bottom: -10,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${rating.color}${Math.round(
                  glowPulse * 40
                )
                  .toString(16)
                  .padStart(2, "0")} 0%, transparent 70%)`,
              }}
            />

            {/* Circle background */}
            <svg
              width={160}
              height={160}
              style={{ position: "absolute", transform: "rotate(-90deg)" }}
            >
              <circle
                cx={80}
                cy={80}
                r={70}
                fill="none"
                stroke="#1a1a1a"
                strokeWidth={8}
              />
              <circle
                cx={80}
                cy={80}
                r={70}
                fill="none"
                stroke={rating.color}
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * displayScore) / 100}
                style={{
                  filter: `drop-shadow(0 0 10px ${rating.color})`,
                }}
              />
            </svg>

            {/* Score number */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 56,
                  fontWeight: 700,
                  color: rating.color,
                  fontFamily: "system-ui, sans-serif",
                  textShadow: `0 0 30px ${rating.color}50`,
                }}
              >
                {displayScore}
              </span>
            </div>
          </div>

          {/* Rating badge */}
          <div
            style={{
              marginTop: 16,
              padding: "8px 20px",
              borderRadius: 20,
              backgroundColor: `${rating.color}20`,
              border: `1px solid ${rating.color}40`,
            }}
          >
            <span
              style={{
                color: rating.color,
                fontSize: 16,
                fontWeight: 600,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {rating.label}
            </span>
          </div>
        </div>

        {/* Tweet Preview */}
        <div
          style={{
            margin: "0 24px",
            padding: 16,
            backgroundColor: "#111",
            borderRadius: 12,
            border: "1px solid #222",
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span
                  style={{
                    color: "#e7e9ea",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  You
                </span>
                <span
                  style={{
                    color: "#71767b",
                    fontSize: 14,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  @yourhandle
                </span>
              </div>
              <p
                style={{
                  color: "#e7e9ea",
                  fontSize: 14,
                  lineHeight: 1.4,
                  margin: "8px 0 0",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {tweetText}
              </p>
            </div>
          </div>
        </div>

        {/* Factors */}
        <div style={{ padding: "16px 24px" }}>
          <h3
            style={{
              color: "#71767b",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1,
              margin: "0 0 12px",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Scoring Factors
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {factors.map((factor, i) => {
              const factorDelay = 0.5 + i * 0.1;
              const factorOpacity = interpolate(
                animationProgress,
                [factorDelay, factorDelay + 0.2],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    backgroundColor: "#111",
                    borderRadius: 8,
                    opacity: factorOpacity,
                  }}
                >
                  <span
                    style={{
                      color: "#9ca3af",
                      fontSize: 13,
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    {factor.text}
                  </span>
                  <span
                    style={{
                      color: factor.isPositive ? "#10b981" : "#ef4444",
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    {factor.isPositive ? "+" : ""}
                    {factor.points}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div style={{ padding: "0 24px 24px" }}>
            <h3
              style={{
                color: "#71767b",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
                margin: "0 0 12px",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Suggestions
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {suggestions.map((suggestion, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    padding: "8px 12px",
                    backgroundColor: "#10b98110",
                    borderRadius: 8,
                    border: "1px solid #10b98120",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width={16}
                    height={16}
                    fill="#10b981"
                    style={{ flexShrink: 0, marginTop: 2 }}
                  >
                    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
                  </svg>
                  <span
                    style={{
                      color: "#9ca3af",
                      fontSize: 13,
                      lineHeight: 1.4,
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    {suggestion}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div
          style={{
            padding: "16px 24px 24px",
            display: "flex",
            gap: 12,
          }}
        >
          <button
            style={{
              flex: 1,
              padding: "14px 24px",
              backgroundColor: "#1a1a1a",
              color: "#e7e9ea",
              border: "1px solid #333",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Edit Tweet
          </button>
          <button
            style={{
              flex: 1,
              padding: "14px 24px",
              backgroundColor: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Post Anyway
          </button>
        </div>
      </div>
    </div>
  );
};
