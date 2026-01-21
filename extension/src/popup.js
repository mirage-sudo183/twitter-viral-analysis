// Tweet Viral Analyzer - Popup Script

document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings
  chrome.storage.sync.get({
    enableAnalysis: true,
    blockLowScores: false,
    soundEffects: false,
    tweetsAnalyzed: 0,
    totalScore: 0,
    tweetsImproved: 0
  }, (settings) => {
    document.getElementById('enableAnalysis').checked = settings.enableAnalysis;
    document.getElementById('blockLowScores').checked = settings.blockLowScores;
    document.getElementById('soundEffects').checked = settings.soundEffects;

    // Update stats display
    document.getElementById('tweetsAnalyzed').textContent = settings.tweetsAnalyzed;
    document.getElementById('tweetsImproved').textContent = settings.tweetsImproved;

    if (settings.tweetsAnalyzed > 0) {
      const avgScore = Math.round(settings.totalScore / settings.tweetsAnalyzed);
      document.getElementById('avgScore').textContent = avgScore;
    }
  });

  // Save settings on change
  document.getElementById('enableAnalysis').addEventListener('change', (e) => {
    chrome.storage.sync.set({ enableAnalysis: e.target.checked });
  });

  document.getElementById('blockLowScores').addEventListener('change', (e) => {
    chrome.storage.sync.set({ blockLowScores: e.target.checked });
  });

  document.getElementById('soundEffects').addEventListener('change', (e) => {
    chrome.storage.sync.set({ soundEffects: e.target.checked });
  });
});
