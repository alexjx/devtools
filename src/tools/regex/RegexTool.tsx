import { ExternalLink } from "lucide-react";
import { ToolLayout } from "../shared";

const links = [
  ["PCRE2", "https://regex101.com/?flavor=pcre2"],
  ["Python", "https://regex101.com/?flavor=python"],
  ["JavaScript", "https://regex101.com/?flavor=javascript"],
  ["Go docs", "https://pkg.go.dev/regexp"],
];

export default function RegexTool() {
  return (
    <ToolLayout
      output={
        <div className="output">
          Regex patterns and test strings are not stored here. Use regex101 for matching,
          explanations, substitutions, and flavor-specific debugging.
        </div>
      }
    >
      <h2>Regex101</h2>
      <p className="hint">
        This toolbox links to dedicated regex tooling instead of reimplementing multiple regex engines locally.
      </p>
      <div className="actions mt-4">
        {links.map(([label, href]) => (
          <a className="action-button" href={href} key={href} rel="noreferrer" target="_blank">
            <ExternalLink size={16} />
            {label}
          </a>
        ))}
      </div>
    </ToolLayout>
  );
}
