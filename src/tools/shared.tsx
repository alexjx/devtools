import { useState } from "react";
import type { ReactNode } from "react";
import { Copy, RotateCcw } from "lucide-react";

export function ToolLayout({
  children,
  output,
}: {
  children: ReactNode;
  output: ReactNode;
}) {
  return (
    <div className="tool">
      <section className="panel">{children}</section>
      <section className="panel">
        <h2>Output</h2>
        {output}
      </section>
    </div>
  );
}

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className="secondary-button"
      type="button"
      disabled={!value}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }}
    >
      <Copy size={16} />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="secondary-button" type="button" onClick={onClick}>
      <RotateCcw size={16} />
      Clear
    </button>
  );
}

export function Output({ value }: { value: string }) {
  return <pre className="output">{value || "Nothing to show yet."}</pre>;
}
