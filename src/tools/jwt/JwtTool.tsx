import { useMemo, useState } from "react";
import { decodeJwt } from "../../lib/jwt";
import { ClearButton, CopyButton, Output, ToolLayout } from "../shared";

export default function JwtTool() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input) return { output: "", error: "" };
    try {
      const decoded = decodeJwt(input);
      return {
        output: JSON.stringify({ header: decoded.header, payload: decoded.payload }, null, 2),
        error: "",
      };
    } catch (error) {
      return { output: "", error: error instanceof Error ? error.message : "Unable to decode JWT." };
    }
  }, [input]);

  return (
    <ToolLayout
      output={
        <>
          <Output value={result.output} />
          {result.error ? <p className="error">{result.error}</p> : null}
          <p className="hint">Signatures are not verified.</p>
          <div className="actions mt-3">
            <CopyButton value={result.output} />
          </div>
        </>
      }
    >
      <h2>JWT</h2>
      <div className="field">
        <label htmlFor="jwt-input">Token</label>
        <textarea id="jwt-input" rows={12} value={input} onChange={(event) => setInput(event.target.value)} />
      </div>
      <div className="actions">
        <button
          className="secondary-button"
          type="button"
          onClick={() =>
            setInput(
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiRGV2dG9vbHMifQ.signature",
            )
          }
        >
          Sample
        </button>
        <ClearButton onClick={() => setInput("")} />
      </div>
    </ToolLayout>
  );
}
