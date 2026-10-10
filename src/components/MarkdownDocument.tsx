import { remarkCallouts } from "./remarkCallouts";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
export function MarkdownDocument({
  source,
  onDocument,
  documentURL,
}: {
  source: string;
  onDocument?: (href: string) => boolean;
  documentURL?: (href: string) => string | undefined;
}) {
  return (
    <div className="markdown-document">
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath, remarkCallouts]}
        rehypePlugins={[
          [
            rehypeKatex,
            {
              trust: false,
              strict: "warn",
              throwOnError: false,
              maxExpand: 1000,
            },
          ],
          [rehypeHighlight, { detect: false }],
        ]}
        skipHtml
        components={{
          a: ({ href, children }) => (
            <a
              href={href ? documentURL?.(href) || href : href}
              onClick={(e) => {
                if (
                  href &&
                  !e.ctrlKey &&
                  !e.metaKey &&
                  !e.shiftKey &&
                  e.button === 0 &&
                  onDocument?.(href)
                )
                  e.preventDefault();
              }}
            >
              {children}
            </a>
          ),
        }}
      >
        {source}
      </Markdown>
    </div>
  );
}
