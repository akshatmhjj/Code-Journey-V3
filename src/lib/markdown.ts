import "server-only";
import { Marked, type Tokens } from "marked";
import { createCssVariablesTheme, createHighlighter, type Highlighter } from "shiki";

const LANGS = ["html", "css", "javascript", "typescript", "jsx", "tsx", "dart", "kotlin", "swift", "python", "sql", "r", "bash", "json", "yaml", "rust"];
const theme = createCssVariablesTheme({ name: "cj", variablePrefix: "--shiki-", fontStyle: true });

let hl: Promise<Highlighter> | null = null;
function highlighter() {
  hl ??= createHighlighter({ themes: [theme], langs: LANGS });
  return hl;
}

/** Highlights code with the theme-aware palette (see .code-block in globals.css). */
export async function highlight(code: string, lang = "text") {
  const h = await highlighter();
  const l = LANGS.includes(lang) ? lang : "text";
  return `<div class="code-block">${h.codeToHtml(code.trimEnd(), { lang: l, theme: "cj" })}</div>`;
}

/** Renders trusted Markdown from /content to HTML. External links open in a new tab. */
export async function renderMarkdown(md: string) {
  const h = await highlighter();
  const marked = new Marked({
    gfm: true,
    renderer: {
      code({ text, lang }: Tokens.Code) {
        const l = lang && LANGS.includes(lang) ? lang : "text";
        return `<div class="code-block">${h.codeToHtml(text.trimEnd(), { lang: l, theme: "cj" })}</div>`;
      },
      link({ href, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const ext = /^https?:\/\//.test(href);
        return `<a href="${href}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>${text}</a>`;
      },
    },
  });
  return marked.parse(md);
}
