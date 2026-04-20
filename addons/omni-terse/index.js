/**
 * omni-terse — Token Efficiency via Terse Output Style
 *
 * Injects a system prompt fragment that instructs the model to respond
 * concisely, eliminating the preamble, filler, and padding that inflate
 * output token counts without adding information.
 *
 * Works with all LLM providers (Claude, GPT-4, Gemini, Grok, Mistral, etc.).
 * Inspired by the "Caveman" token optimization technique (~40–75% output reduction).
 */

const TERSE_PROMPT_FRAGMENT = `## Response Style (Token Efficiency)
Be maximally concise. Eliminate all output that doesn't add information:

- No preamble: never start with "I'll now...", "Let me...", "Sure!", "Great question!", "Of course!", "Certainly!", or similar openers.
- No summaries: do not restate what you just did at the end of a response ("I've completed...", "In summary...", "To recap...").
- No padding: skip transitional phrases like "First, I'll...", "Next, I'll...", "Finally, I'll...".
- No hedging: avoid "I think", "It seems", "It appears", "You might want to" where you are confident.
- Prefer bullets over prose for lists of items.
- Prefer short direct answers over explanatory paragraphs when the answer is clear.
- Omit obvious code comments that only restate what the code does.
- When making file edits, describe what changed in one sentence, not a paragraph.
- If asked to explain something, use the minimum words needed to be clear and accurate.`;

/** @param {import('@omni-code/addon-api').AddonContext} context */
function activate(context) {
  context.registerSystemPromptFragment(TERSE_PROMPT_FRAGMENT);
}

function deactivate() {
  // No cleanup needed — prompt fragments are cleared automatically on reload.
}

module.exports = { activate, deactivate };
