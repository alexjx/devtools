import { useMemo, useState } from "react";
import { decodeBase64, encodeBase64 } from "../../lib/codec";
import { ClearButton, CopyButton, Output, ToolLayout } from "../shared";

export default function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input) return { output: "", error: "" };
    try {
      return {
        output: mode === "encode" ? encodeBase64(input) : decodeBase64(input),
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
      <h2>Base64</h2>
      <div className="field">
        <label htmlFor="base64-mode">Mode</label>
        <select id="base64-mode" value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}>
          <option value="encode">Encode</option>
          <option value="decode">Decode</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="base64-input">Input</label>
        <textarea id="base64-input" rows={12} value={input} onChange={(event) => setInput(event.target.value)} />
      </div>
      <div className="actions">
        <button className="secondary-button" type="button" onClick={() => setInput("hello, 世界")}>
          Sample
        </button>
        <ClearButton onClick={() => setInput("")} />
      </div>
    </ToolLayout>
  );
}
