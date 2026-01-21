import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  AbsoluteFill,
} from "remotion";
import { TwitterMockup } from "./TwitterMockup";
import { AnalysisModal } from "./AnalysisModal";

// Tweet scenarios for the demo
const SCENARIOS = [
  {
    // Scenario 1: Bad tweet (engagement bait)
    tweet: "LIKE AND RETWEET IF YOU AGREE!!! Follow for more content!!!",
    score: 15,
    factors: [
      { text: "Base score", points: 40, isPositive: true },
      { text: "Engagement bait detected", points: -25, isPositive: false },
      { text: "Excessive caps (spammy)", points: -10, isPositive: false },
      { text: "Too many exclamation marks", points: -5, isPositive: false },
      { text: "No question for engagement", points: 0, isPositive: true },
    ],
    suggestions: [
      "Remove engagement bait phrases - they trigger blocks and mutes",
      "Add a genuine question to encourage replies",
      "Reduce caps lock usage for a more authentic tone",
    ],
    label: "Low Score Example",
  },
  {
    // Scenario 2: Good tweet (extension promo)
    tweet: `Just discovered a Chrome extension that analyzes tweets before posting and tells you the viral potential score.

It caught me using engagement bait I didn't even realize I was doing.

What tools do you use to improve your Twitter game?`,
    score: 85,
    factors: [
      { text: "Base score", points: 40, isPositive: true },
      { text: "Question included (+replies)", points: 20, isPositive: true },
      { text: "Strong opening hook", points: 10, isPositive: true },
      { text: "Optimal length (dwell time)", points: 15, isPositive: true },
      { text: "Thread-friendly format", points: 5, isPositive: true },
    ],
    suggestions: [],
    label: "High Score Example",
  },
  {
    // Scenario 3: Medium tweet that could be improved
    tweet: "Been working on something cool. Shipping soon. Stay tuned!",
    score: 45,
    factors: [
      { text: "Base score", points: 40, isPositive: true },
      { text: "Too short (low dwell time)", points: 5, isPositive: true },
      { text: "No question included", points: 0, isPositive: true },
      { text: "Vague content", points: 0, isPositive: true },
    ],
    suggestions: [
      "Add a question to encourage replies",
      "Include more specific details to hook readers",
      "Consider adding an image or video for +15 points",
    ],
    label: "Medium Score Example",
  },
];

// Scene component for each tweet scenario
const TweetScene: React.FC<{
  scenario: (typeof SCENARIOS)[0];
  sceneFrame: number;
  sceneDuration: number;
}> = ({ scenario, sceneFrame, sceneDuration }) => {
  const { fps } = useVideoConfig();

  // Timing constants (in frames)
  const typeStartFrame = 15;
  const typeDuration = 2.5 * fps; // 2.5 seconds to type
  const clickFrame = typeStartFrame + typeDuration + 0.5 * fps;
  const modalAppearFrame = clickFrame + 10;
  const modalDuration = 4 * fps;

  // Typing progress
  const typingProgress = interpolate(
    sceneFrame,
    [typeStartFrame, typeStartFrame + typeDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Modal visibility and animation
  const showModal = sceneFrame >= modalAppearFrame;
  const modalAnimProgress = showModal
    ? spring({
        frame: sceneFrame - modalAppearFrame,
        fps,
        config: { damping: 15, stiffness: 100 },
      })
    : 0;

  // Click indicator
  const showClickIndicator =
    sceneFrame >= clickFrame && sceneFrame < modalAppearFrame;
  const clickScale = showClickIndicator
    ? spring({
        frame: sceneFrame - clickFrame,
        fps,
        config: { damping: 10, stiffness: 200 },
      })
    : 0;

  return (
    <AbsoluteFill>
      {/* Scene label */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 100,
          padding: "8px 16px",
          backgroundColor: "rgba(16, 185, 129, 0.9)",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {scenario.label}
        </span>
      </div>

      {/* Twitter mockup */}
      <TwitterMockup
        tweetText={scenario.tweet}
        typingProgress={typingProgress}
        showCursor={sceneFrame < clickFrame}
      />

      {/* Click indicator on Post button */}
      {showClickIndicator && (
        <div
          style={{
            position: "absolute",
            top: 287,
            left: 525,
            width: 60,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(29, 155, 240, 0.4)",
            transform: `scale(${1 + clickScale * 0.3})`,
            opacity: 1 - clickScale * 0.5,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Analysis modal */}
      <AnalysisModal
        score={scenario.score}
        tweetText={scenario.tweet}
        factors={scenario.factors}
        suggestions={scenario.suggestions}
        visible={showModal}
        animationProgress={modalAnimProgress}
      />
    </AbsoluteFill>
  );
};

// Intro scene
const IntroScene: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
    delay: 10,
  });

  const subtitleSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
    delay: 25,
  });

  const badgeSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
    delay: 40,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050505",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Logo */}
      <div
        style={{
          transform: `scale(${titleSpring})`,
          opacity: titleSpring,
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 60px rgba(16, 185, 129, 0.4)",
          }}
        >
          <svg viewBox="0 0 24 24" width={48} height={48} fill="#fff">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: "#e7e9ea",
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          transform: `translateY(${(1 - titleSpring) * 50}px)`,
          opacity: titleSpring,
        }}
      >
        Tweet Viral Analyzer
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 28,
          color: "#71767b",
          margin: "20px 0 0",
          fontFamily: "system-ui, sans-serif",
          transform: `translateY(${(1 - subtitleSpring) * 30}px)`,
          opacity: subtitleSpring,
        }}
      >
        Know your tweet's viral potential before you post
      </p>

      {/* Badge */}
      <div
        style={{
          marginTop: 40,
          padding: "12px 24px",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          borderRadius: 30,
          transform: `scale(${badgeSpring})`,
          opacity: badgeSpring,
        }}
      >
        <span
          style={{
            color: "#10b981",
            fontSize: 18,
            fontWeight: 500,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Chrome Extension
        </span>
      </div>
    </AbsoluteFill>
  );
};

// Outro scene
const OutroScene: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();

  const contentSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
    delay: 10,
  });

  const ctaSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 150 },
    delay: 30,
  });

  // Pulse animation for CTA
  const ctaPulse = Math.sin(frame * 0.1) * 0.05 + 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050505",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Content */}
      <div
        style={{
          transform: `translateY(${(1 - contentSpring) * 50}px)`,
          opacity: contentSpring,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#e7e9ea",
            margin: 0,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Stop guessing.
        </h2>
        <h2
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#10b981",
            margin: "10px 0 0",
            fontFamily: "system-ui, sans-serif",
            textShadow: "0 0 40px rgba(16, 185, 129, 0.5)",
          }}
        >
          Start knowing.
        </h2>
      </div>

      {/* CTA Button */}
      <div
        style={{
          marginTop: 60,
          transform: `scale(${ctaSpring * ctaPulse})`,
          opacity: ctaSpring,
        }}
      >
        <div
          style={{
            padding: "20px 48px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            borderRadius: 16,
            boxShadow: "0 0 40px rgba(16, 185, 129, 0.4)",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: 24,
              fontWeight: 600,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Get it free on Chrome Web Store
          </span>
        </div>
      </div>

      {/* Features list */}
      <div
        style={{
          marginTop: 50,
          display: "flex",
          gap: 40,
          transform: `translateY(${(1 - contentSpring) * 30}px)`,
          opacity: contentSpring,
        }}
      >
        {["AI-Powered Analysis", "Real-time Scoring", "Actionable Tips"].map(
          (feature, i) => (
            <div
              key={feature}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <svg viewBox="0 0 24 24" width={20} height={20} fill="#10b981">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span
                style={{
                  color: "#9ca3af",
                  fontSize: 16,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {feature}
              </span>
            </div>
          )
        )}
      </div>
    </AbsoluteFill>
  );
};

export const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene timing (in seconds)
  const introDuration = 3 * fps; // 3 seconds
  const sceneDuration = 10 * fps; // 10 seconds per tweet scenario
  const outroDuration = 5 * fps; // 5 seconds

  // Calculate which scene we're in
  const scene1Start = introDuration;
  const scene2Start = scene1Start + sceneDuration;
  const scene3Start = scene2Start + sceneDuration;
  const outroStart = scene3Start + sceneDuration;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Intro */}
      <Sequence from={0} durationInFrames={introDuration}>
        <IntroScene frame={frame} />
      </Sequence>

      {/* Tweet Scenario 1: Bad tweet */}
      <Sequence from={scene1Start} durationInFrames={sceneDuration}>
        <TweetScene
          scenario={SCENARIOS[0]}
          sceneFrame={frame - scene1Start}
          sceneDuration={sceneDuration}
        />
      </Sequence>

      {/* Tweet Scenario 2: Good tweet (promo) */}
      <Sequence from={scene2Start} durationInFrames={sceneDuration}>
        <TweetScene
          scenario={SCENARIOS[1]}
          sceneFrame={frame - scene2Start}
          sceneDuration={sceneDuration}
        />
      </Sequence>

      {/* Tweet Scenario 3: Medium tweet */}
      <Sequence from={scene3Start} durationInFrames={sceneDuration}>
        <TweetScene
          scenario={SCENARIOS[2]}
          sceneFrame={frame - scene3Start}
          sceneDuration={sceneDuration}
        />
      </Sequence>

      {/* Outro */}
      <Sequence from={outroStart} durationInFrames={outroDuration}>
        <OutroScene frame={frame - outroStart} />
      </Sequence>
    </AbsoluteFill>
  );
};
