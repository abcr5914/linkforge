/**
 * Bot / Crawler Detection
 *
 * Detects known link-preview bots and crawlers by matching against
 * their User-Agent strings. Used to skip analytics writes for
 * non-human traffic that would otherwise drain serverless compute.
 */

/** User-Agent substrings for known link-preview bots and crawlers */
const BOT_PATTERNS = [
  // Social media link-preview bots
  "twitterbot",
  "discordbot",
  "slackbot",
  "whatsapp",
  "facebookexternalhit",
  "facebot",
  "linkedinbot",
  "telegrambot",
  "applebot",
  // Search engine crawlers
  "googlebot",
  "bingbot",
  "yandexbot",
  "baiduspider",
  "duckduckbot",
  // Embed / preview services
  "embedly",
  "showyoubot",
  "outbrain",
  "pinterestbot",
  "redditbot",
  // Generic bot indicators
  "bot/",
  "crawler",
  "spider",
  "prerender",
  "headlesschrome",
];

/**
 * Checks whether a User-Agent string belongs to a known bot or crawler.
 * Case-insensitive match against known bot substrings.
 */
export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some((pattern) => ua.includes(pattern));
}
