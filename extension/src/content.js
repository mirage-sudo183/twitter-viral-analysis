// Tweet Viral Analyzer - Content Script
// Intercepts the Post button to analyze tweets before posting

(function() {
  'use strict';

  let isAnalyzing = false;
  let modalElement = null;

  // Selectors for Twitter/X elements
  const SELECTORS = {
    postButton: '[data-testid="tweetButton"], [data-testid="tweetButtonInline"]',
    tweetTextarea: '[data-testid="tweetTextarea_0"]',
    tweetComposer: '.DraftEditor-root, [data-testid="tweetTextarea_0"]',
    replyButton: '[data-testid="reply"]'
  };

  // Initialize the extension
  function init() {
    // Use event delegation on document to catch all post button clicks
    document.addEventListener('click', handleClick, true);

    // Also intercept keyboard shortcut (Ctrl/Cmd + Enter)
    document.addEventListener('keydown', handleKeydown, true);

    console.log('[Tweet Analyzer] Extension loaded');
  }

  // Handle click events
  function handleClick(event) {
    const postButton = event.target.closest(SELECTORS.postButton);

    if (postButton && !isAnalyzing) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const tweetText = getTweetText();
      if (tweetText.trim()) {
        showAnalysisModal(tweetText, postButton);
      }
    }
  }

  // Handle keyboard shortcuts
  function handleKeydown(event) {
    const isPostShortcut = (event.ctrlKey || event.metaKey) && event.key === 'Enter';
    const isInComposer = event.target.closest(SELECTORS.tweetComposer);

    if (isPostShortcut && isInComposer && !isAnalyzing) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const tweetText = getTweetText();
      const postButton = document.querySelector(SELECTORS.postButton);

      if (tweetText.trim() && postButton) {
        showAnalysisModal(tweetText, postButton);
      }
    }
  }

  // Extract tweet text from composer
  function getTweetText() {
    // Try multiple selectors as Twitter's DOM can vary
    const textarea = document.querySelector(SELECTORS.tweetTextarea);
    if (textarea) {
      return textarea.textContent || '';
    }

    // Fallback: look for DraftEditor content
    const draftEditor = document.querySelector('.DraftEditor-editorContainer');
    if (draftEditor) {
      return draftEditor.textContent || '';
    }

    return '';
  }

  // Check if tweet has media attached
  function hasMedia() {
    const mediaPreview = document.querySelector('[data-testid="attachments"]');
    return !!mediaPreview;
  }

  // Analyze the tweet and return scores/suggestions
  function analyzeTweet(text) {
    const analysis = {
      score: 0,
      maxScore: 100,
      factors: [],
      suggestions: [],
      warnings: []
    };

    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    const charCount = text.length;
    const hasQuestion = /\?/.test(text);
    const hasHashtags = /#\w+/.test(text);
    const hashtagCount = (text.match(/#\w+/g) || []).length;
    const hasLinks = /https?:\/\/\S+/.test(text);
    const hasMention = /@\w+/.test(text);
    const hasEmoji = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u.test(text);
    const hasMedia_ = hasMedia();
    const isThread = text.includes('🧵') || /thread|1\/\d+/i.test(text);
    const hasListFormat = /^\d+\.|^-|^•/m.test(text);
    const hasHook = /^(Here's|This is|The|I just|Breaking|Unpopular opinion|Hot take|Thread|PSA|Reminder)/i.test(text.trim());

    // Engagement bait patterns (negative)
    const engagementBait = /retweet if|like if|rt if|follow for|like and retweet|smash that|don't scroll/i.test(text);
    const excessiveCaps = (text.match(/[A-Z]{4,}/g) || []).length > 2;

    // Scoring based on algorithm insights

    // 1. Reply-worthy content (questions, hooks)
    if (hasQuestion) {
      analysis.score += 20;
      analysis.factors.push({ label: 'Contains question', impact: '+20', positive: true });
    } else {
      analysis.suggestions.push('Add a question to encourage replies - replies are weighted heavily');
    }

    if (hasHook) {
      analysis.score += 10;
      analysis.factors.push({ label: 'Strong opening hook', impact: '+10', positive: true });
    } else {
      analysis.suggestions.push('Start with a hook (e.g., "Here\'s why...", "Unpopular opinion:")');
    }

    // 2. Dwell time optimization
    if (wordCount >= 20 && wordCount <= 50) {
      analysis.score += 15;
      analysis.factors.push({ label: 'Good length for dwell time', impact: '+15', positive: true });
    } else if (wordCount < 10) {
      analysis.score += 5;
      analysis.factors.push({ label: 'Short post', impact: '+5', positive: true });
      analysis.suggestions.push('Longer posts increase dwell time - consider expanding');
    } else if (wordCount > 50) {
      analysis.score += 12;
      analysis.factors.push({ label: 'Long-form content', impact: '+12', positive: true });
    }

    if (hasMedia_) {
      analysis.score += 15;
      analysis.factors.push({ label: 'Has media attached', impact: '+15', positive: true });
    } else {
      analysis.suggestions.push('Add an image or video - media increases dwell time and engagement');
    }

    if (isThread) {
      analysis.score += 10;
      analysis.factors.push({ label: 'Thread format', impact: '+10', positive: true });
    }

    // 3. Shareability factors
    if (hasListFormat) {
      analysis.score += 10;
      analysis.factors.push({ label: 'List/structured format', impact: '+10', positive: true });
    }

    if (hasEmoji) {
      analysis.score += 5;
      analysis.factors.push({ label: 'Uses emoji', impact: '+5', positive: true });
    }

    // 4. Negative signals
    if (engagementBait) {
      analysis.score -= 25;
      analysis.factors.push({ label: 'Engagement bait detected', impact: '-25', positive: false });
      analysis.warnings.push('Avoid "retweet if" / "like if" - triggers blocks and mutes');
    }

    if (excessiveCaps) {
      analysis.score -= 10;
      analysis.factors.push({ label: 'Excessive caps', impact: '-10', positive: false });
      analysis.warnings.push('Too many ALL CAPS words can seem spammy');
    }

    if (hashtagCount > 3) {
      analysis.score -= 10;
      analysis.factors.push({ label: 'Too many hashtags', impact: '-10', positive: false });
      analysis.warnings.push('More than 3 hashtags looks spammy - reduce them');
    } else if (hashtagCount >= 1 && hashtagCount <= 2) {
      analysis.score += 5;
      analysis.factors.push({ label: 'Good hashtag usage', impact: '+5', positive: true });
    }

    if (hasLinks) {
      analysis.score -= 5;
      analysis.factors.push({ label: 'Contains external link', impact: '-5', positive: false });
      analysis.suggestions.push('Consider posting link in reply - external links can reduce reach');
    }

    // Normalize score
    analysis.score = Math.max(0, Math.min(100, analysis.score + 40)); // Base score of 40

    // Determine rating
    if (analysis.score >= 80) {
      analysis.rating = 'Excellent';
      analysis.ratingClass = 'excellent';
    } else if (analysis.score >= 60) {
      analysis.rating = 'Good';
      analysis.ratingClass = 'good';
    } else if (analysis.score >= 40) {
      analysis.rating = 'Fair';
      analysis.ratingClass = 'fair';
    } else {
      analysis.rating = 'Needs Work';
      analysis.ratingClass = 'poor';
    }

    return analysis;
  }

  // Create and show the analysis modal
  function showAnalysisModal(tweetText, postButton) {
    // Remove existing modal if any
    if (modalElement) {
      modalElement.remove();
    }

    const analysis = analyzeTweet(tweetText);

    modalElement = document.createElement('div');
    modalElement.className = 'tva-modal-overlay';
    modalElement.innerHTML = `
      <div class="tva-modal">
        <div class="tva-header">
          <h2>Tweet Analysis</h2>
          <button class="tva-close" aria-label="Close">&times;</button>
        </div>

        <div class="tva-score-section">
          <div class="tva-score-circle ${analysis.ratingClass}">
            <span class="tva-score-number">${analysis.score}</span>
            <span class="tva-score-label">/ 100</span>
          </div>
          <div class="tva-rating ${analysis.ratingClass}">${analysis.rating}</div>
        </div>

        <div class="tva-preview">
          <div class="tva-preview-label">Your tweet:</div>
          <div class="tva-preview-text">${escapeHtml(tweetText)}</div>
        </div>

        <div class="tva-factors">
          <div class="tva-section-title">Scoring Factors</div>
          ${analysis.factors.map(f => `
            <div class="tva-factor ${f.positive ? 'positive' : 'negative'}">
              <span class="tva-factor-label">${f.label}</span>
              <span class="tva-factor-impact">${f.impact}</span>
            </div>
          `).join('')}
        </div>

        ${analysis.warnings.length > 0 ? `
          <div class="tva-warnings">
            <div class="tva-section-title">Warnings</div>
            ${analysis.warnings.map(w => `<div class="tva-warning">${w}</div>`).join('')}
          </div>
        ` : ''}

        ${analysis.suggestions.length > 0 ? `
          <div class="tva-suggestions">
            <div class="tva-section-title">Suggestions to Improve</div>
            ${analysis.suggestions.map(s => `<div class="tva-suggestion">${s}</div>`).join('')}
          </div>
        ` : ''}

        <div class="tva-actions">
          <button class="tva-btn tva-btn-edit">Edit Tweet</button>
          <button class="tva-btn tva-btn-post">Post Anyway</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalElement);

    // Event listeners
    const closeBtn = modalElement.querySelector('.tva-close');
    const editBtn = modalElement.querySelector('.tva-btn-edit');
    const postBtn = modalElement.querySelector('.tva-btn-post');

    closeBtn.addEventListener('click', closeModal);
    editBtn.addEventListener('click', closeModal);

    postBtn.addEventListener('click', () => {
      closeModal();
      // Trigger the actual post
      isAnalyzing = true;
      postButton.click();
      setTimeout(() => { isAnalyzing = false; }, 500);
    });

    // Close on overlay click
    modalElement.addEventListener('click', (e) => {
      if (e.target === modalElement) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', handleEscape);
  }

  function handleEscape(e) {
    if (e.key === 'Escape' && modalElement) {
      closeModal();
    }
  }

  function closeModal() {
    if (modalElement) {
      modalElement.remove();
      modalElement = null;
    }
    document.removeEventListener('keydown', handleEscape);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Start the extension
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
