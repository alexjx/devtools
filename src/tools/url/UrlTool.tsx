import { useMemo, useState } from "react";
import { decodeUrl, encodeUrl } from "../../lib/codec";
import { ClearButton, CopyButton, Output, ToolLayout } from "../shared";

export default function UrlTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input) return { output: "", error: "" };
    try {
      return {
        output: mode === "encode" ? encodeUrl(input) : decodeUrl(input),
        error: "",
      };
    } catch (error) {
      return { output: "", error: error instanceof Error ? error.message : "Unable to convert." };
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
      <h2>URL</h2>
      <div className="field">
        <label htmlFor="url-mode">Mode</label>
        <select id="url-mode" value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}>
          <option value="encode">Encode component</option>
          <option value="decode">Decode component</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="url-input">Input</label>
        <textarea id="url-input" rows={12} value={input} onChange={(event) => setInput(event.target.value)} />
      </div>
      <div className="actions">
        <button className="secondary-button" type="button" onClick={() => setInput("q=dev tools&lang=en")}>
          Sample
        </button>
        <ClearButton onClick={() => setInput("")} />
      </div>
    </ToolLayout>
  );
}
