# Twitter Viral Analysis

A Chrome extension that analyzes your tweets before posting to maximize viral potential based on Twitter's algorithm signals.

## Features

- **Pre-Post Analysis**: Intercepts the Post button and analyzes your tweet before it goes live
- **Viral Score (0-100)**: Get an instant score based on algorithm-friendly patterns
- **Smart Suggestions**: Actionable tips to improve engagement potential
- **Warning Detection**: Flags engagement bait and patterns that trigger blocks/mutes

## Scoring Factors

Based on Twitter's algorithm, the extension evaluates:

**Positive Signals:**
- Questions (encourage replies - heavily weighted)
- Strong opening hooks
- Optimal length for dwell time
- Media attachments (images/videos)
- Thread format
- Strategic hashtag usage (1-2)

**Negative Signals:**
- Engagement bait ("retweet if", "like if")
- Excessive caps
- Too many hashtags (>3)
- External links (can reduce reach)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/mirage-sudo183/twitter-viral-analysis.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** (toggle in top-right corner)

4. Click **Load unpacked** and select the `extension` folder

5. The extension is now active! Go to Twitter/X and try composing a tweet.

## Usage

1. Compose a tweet on Twitter/X as normal
2. Click the **Post** button (or use Ctrl/Cmd + Enter)
3. The analysis modal will appear with your score and suggestions
4. Choose **Edit Tweet** to improve it, or **Post Anyway** to publish

## Extension Settings

Click the extension icon to access settings:
- **Enable Analysis**: Toggle the pre-post analysis on/off
- **Block Low Scores**: Show extra warning for tweets scoring below 40
- **Sound Effects**: Play sound on analysis
- **Stats**: Track your analyzed tweets and average score

## Development

```bash
# Make changes to files in /extension
# Reload the extension in chrome://extensions/ to see changes
```

## License

MIT
