import { useEffect, useState } from "react";
import { digest, type HashAlgorithm } from "../../lib/crypto";
import { ClearButton, CopyButton, Output, ToolLayout } from "../shared";

const algorithms: HashAlgorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

export default function HashTool() {
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (!input) {
      setOutput("");
      setError("");
      return;
    }
    digest(input, algorithm)
      .then((value) => {
        if (!cancelled) {
          setOutput(value);
          setError("");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOutput("");
          setError("Unable to generate hash.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [algorithm, input]);

  return (
    <ToolLayout
      output={
        <>
          <Output value={output} />
          {error ? <p className="error">{error}</p> : null}
          <div className="actions mt-3">
            <CopyButton value={output} />
          </div>
        </>
      }
    >
      <h2>Hash</h2>
      <div className="field">
        <label htmlFor="hash-algorithm">Algorithm</label>
        <select id="hash-algorithm" value={algorithm} onChange={(event) => setAlgorithm(event.target.value as HashAlgorithm)}>
          {algorithms.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="hash-input">Input</label>
        <textarea id="hash-input" rows={12} value={input} onChange={(event) => setInput(event.target.value)} />
      </div>
      <div className="actions">
        <button className="secondary-button" type="button" onClick={() => setInput("hello")}>
          Sample
        </button>
        <ClearButton onClick={() => setInput("")} />
      </div>
    </ToolLayout>
  );
}
