// Configure our markdown parser
const md = require("markdown-it")({
  html: true, // Allows HTML in the markdown
  breaks: true, // Outputs new lines a <br/> tags
  linkify: true, // Outputs link-like text as links
});

// Add support for Slack-style emojis :tada:
const emoji = require("markdown-it-emoji");
md.use(emoji);

export function parseMarkdown(text: string) {
  return md.render(text);
}
