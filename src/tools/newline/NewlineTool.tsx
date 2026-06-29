import { useMemo, useState } from "react";
import { formatEscapedNewlines } from "../../lib/newline";
import { ClearButton, CopyButton, Output, ToolLayout } from "../shared";

const sample = "first line\\nsecond line\\nthird line";

export default function NewlineTool() {
  const [input, setInput] = useState("");
  const output = useMemo(() => formatEscapedNewlines(input), [input]);

  return (
    <ToolLayout
      output={
        <>
          <Output value={output} />
          <div className="actions mt-3">
            <CopyButton value={output} />
          </div>
        </>
      }
    >
      <h2>Newlines</h2>
      <div className="field">
        <label htmlFor="newline-input">Input</label>
        <textarea id="newline-input" rows={12} value={input} onChange={(event) => setInput(event.target.value)} />
      </div>
      <div className="actions">
        <button className="secondary-button" type="button" onClick={() => setInput(sample)}>
          Sample
        </button>
        <ClearButton onClick={() => setInput("")} />
      </div>
    </ToolLayout>
  );
}
