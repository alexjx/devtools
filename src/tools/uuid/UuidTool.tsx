import { useState } from "react";
import { createUuid } from "../../lib/crypto";
import { CopyButton, Output, ToolLayout } from "../shared";

export default function UuidTool() {
  const [values, setValues] = useState<string[]>(() => [createUuid()]);

  return (
    <ToolLayout
      output={
        <>
          <Output value={values.join("\n")} />
          <div className="actions mt-3">
            <CopyButton value={values.join("\n")} />
          </div>
        </>
      }
    >
      <h2>UUID</h2>
      <div className="actions">
        <button className="action-button" type="button" onClick={() => setValues([createUuid()])}>
          Generate one
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => setValues(Array.from({ length: 10 }, () => createUuid()))}
        >
          Generate ten
        </button>
      </div>
    </ToolLayout>
  );
}
