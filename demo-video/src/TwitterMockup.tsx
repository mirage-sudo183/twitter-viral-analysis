import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

type TwitterMockupProps = {
  tweetText: string;
  showCursor?: boolean;
  typingProgress?: number; // 0-1, how much of text is typed
};

export const TwitterMockup: React.FC<TwitterMockupProps> = ({
  tweetText,
  showCursor = true,
  typingProgress = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const displayedText = tweetText.slice(
    0,
    Math.floor(tweetText.length * typingProgress)
  );

  const cursorOpacity = Math.sin(frame * 0.15) > 0 ? 1 : 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#000000",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Top Nav Bar */}
      <div
        style={{
          height: 53,
          borderBottom: "1px solid #2f3336",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <div style={{ width: 34 }} />
        <svg viewBox="0 0 24 24" width={28} height={28} fill="#e7e9ea">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: "#1d9bf0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg viewBox="0 0 24 24" width={20} height={20} fill="#fff">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
          </svg>
        </div>
      </div>

      {/* Main Content Area - Tweet Composer */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* Left Sidebar */}
        <div
          style={{
            width: 275,
            borderRight: "1px solid #2f3336",
            padding: "12px",
          }}
        >
          {/* Home */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "12px",
              borderRadius: 30,
            }}
          >
            <svg viewBox="0 0 24 24" width={26} height={26} fill="#e7e9ea">
              <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.409-.758z" />
            </svg>
            <span
              style={{ color: "#e7e9ea", fontSize: 20, fontWeight: "bold" }}
            >
              Home
            </span>
          </div>
          {/* Other menu items... */}
          {["Explore", "Notifications", "Messages", "Grok", "Premium"].map(
            (item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "12px",
                  borderRadius: 30,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: "#333",
                  }}
                />
                <span style={{ color: "#e7e9ea", fontSize: 20 }}>{item}</span>
              </div>
            )
          )}

          {/* Post Button */}
          <button
            style={{
              width: "90%",
              marginTop: 16,
              padding: "16px 32px",
              backgroundColor: "#1d9bf0",
              color: "#fff",
              border: "none",
              borderRadius: 30,
              fontSize: 17,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Post
          </button>
        </div>

        {/* Main Feed Area */}
        <div style={{ flex: 1, maxWidth: 600, borderRight: "1px solid #2f3336" }}>
          {/* Compose Tweet Section */}
          <div
            style={{
              padding: 16,
              borderBottom: "1px solid #2f3336",
            }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              {/* Avatar */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  flexShrink: 0,
                }}
              />

              {/* Tweet Input Area */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    minHeight: 100,
                    color: "#e7e9ea",
                    fontSize: 20,
                    lineHeight: 1.4,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {displayedText || (
                    <span style={{ color: "#71767b" }}>What is happening?!</span>
                  )}
                  {showCursor && typingProgress < 1 && (
                    <span
                      style={{
                        opacity: cursorOpacity,
                        color: "#1d9bf0",
                        fontWeight: "bold",
                      }}
                    >
                      |
                    </span>
                  )}
                </div>

                {/* Tweet Actions */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 12,
                    borderTop: "1px solid #2f3336",
                    paddingTop: 12,
                  }}
                >
                  <div style={{ display: "flex", gap: 8 }}>
                    {["image", "gif", "poll", "emoji", "schedule", "location"].map(
                      (icon, i) => (
                        <div
                          key={icon}
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 17,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width={20}
                            height={20}
                            fill="#1d9bf0"
                          >
                            <circle cx={12} cy={12} r={8} />
                          </svg>
                        </div>
                      )
                    )}
                  </div>

                  {/* Post Button */}
                  <button
                    style={{
                      padding: "8px 16px",
                      backgroundColor:
                        displayedText.length > 0 ? "#1d9bf0" : "#0e4f82",
                      color: displayedText.length > 0 ? "#fff" : "#808080",
                      border: "none",
                      borderRadius: 20,
                      fontSize: 15,
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed placeholder */}
          <div style={{ padding: 16, color: "#71767b", textAlign: "center" }}>
            <div style={{ fontSize: 14, marginTop: 20 }}>For You / Following</div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ width: 350, padding: 16 }}>
          {/* Search */}
          <div
            style={{
              backgroundColor: "#202327",
              borderRadius: 20,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <svg viewBox="0 0 24 24" width={20} height={20} fill="#71767b">
              <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z" />
            </svg>
            <span style={{ color: "#71767b", fontSize: 15 }}>Search</span>
          </div>

          {/* Trending */}
          <div
            style={{
              backgroundColor: "#16181c",
              borderRadius: 16,
              marginTop: 16,
              padding: 16,
            }}
          >
            <h2 style={{ color: "#e7e9ea", fontSize: 20, margin: 0 }}>
              What's happening
            </h2>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  padding: "12px 0",
                  borderBottom: i < 3 ? "1px solid #2f3336" : "none",
                }}
              >
                <div style={{ color: "#71767b", fontSize: 13 }}>
                  Trending in Tech
                </div>
                <div style={{ color: "#e7e9ea", fontSize: 15, fontWeight: "bold" }}>
                  #TwitterAPI
                </div>
                <div style={{ color: "#71767b", fontSize: 13 }}>12.5K posts</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
