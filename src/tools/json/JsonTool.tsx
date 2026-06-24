import { useMemo, useState } from "react";
import { formatJson, minifyJson } from "../../lib/json";
import { ClearButton, CopyButton, Output, ToolLayout } from "../shared";

export default function JsonTool() {
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input) return { output: "", error: "" };
    try {
      return { output: mode === "format" ? formatJson(input) : minifyJson(input), error: "" };
    } catch (error) {
      return { output: "", error: error instanceof Error ? error.message : "Invalid JSON." };
    }
  }, [input, mode]);

  return (
    <ToolLayout
      output={
        <>
          <Output value={result.output} />
          {result.error ? <p className="error">{result.error}</p> : null}
          <div className="actions mt-3">
            <CopyButton value={result.output} />
          </div>
        </>
      }
    >
      <h2>JSON</h2>
      <div className="field">
        <label htmlFor="json-mode">Mode</label>
        <select id="json-mode" value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}>
          <option value="format">Format</option>
          <option value="minify">Minify</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="json-input">Input</label>
        <textarea id="json-input" rows={14} value={input} onChange={(event) => setInput(event.target.value)} />
      </div>
      <div className="actions">
        <button className="secondary-button" type="button" onClick={() => setInput('{"name":"devtools","static":true}')}>
          Sample
        </button>
        <ClearButton onClick={() => setInput("")} />
      </div>
    </ToolLayout>
  );
}
