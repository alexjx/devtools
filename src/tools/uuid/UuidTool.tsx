import { useState } from "react";
import {
  createUuid,
  isNameBasedUuid,
  uuidVersions,
  type UuidNamespace,
  type UuidOptions,
  type UuidVersion,
} from "../../lib/crypto";
import { CopyButton, Output, ToolLayout } from "../shared";

const versionInfo: Record<UuidVersion, { title: string; description: string }> = {
  v1: {
    title: "Time + Node",
    description: "Timestamp, clock sequence, and node identifier. Older time-based UUID.",
  },
  v3: {
    title: "Name MD5",
    description: "Deterministic namespace + name UUID using MD5. Mostly legacy.",
  },
  v4: {
    title: "Random",
    description: "Random UUID. Best default for most general use.",
  },
  v5: {
    title: "Name SHA-1",
    description: "Deterministic namespace + name UUID using SHA-1. Prefer over v3.",
  },
  v6: {
    title: "Ordered Time",
    description: "Time-based like v1, reordered so IDs sort better by creation time.",
  },
  v7: {
    title: "Unix Time",
    description: "Unix timestamp plus randomness. Modern sortable UUID.",
  },
};

export default function UuidTool() {
  const [version, setVersion] = useState<UuidVersion>("v4");
  const [name, setName] = useState("");
  const [namespace, setNamespace] = useState<UuidNamespace>("dns");
  const [customNamespace, setCustomNamespace] = useState("");
  const [values, setValues] = useState<string[]>(() => [createUuid({ version: "v4" })]);
  const [error, setError] = useState("");

  const nameBased = isNameBasedUuid(version);

  function options(nextVersion = version): UuidOptions {
    return {
      version: nextVersion,
      name,
      namespace,
      customNamespace,
    };
  }

  function generate(count: number, nextVersion = version) {
    try {
      const nextCount = isNameBasedUuid(nextVersion) ? 1 : count;
      setValues(Array.from({ length: nextCount }, () => createUuid(options(nextVersion))));
      setError("");
    } catch (caught) {
      setValues([]);
      setError(caught instanceof Error ? caught.message : "Unable to generate UUID.");
    }
  }

  function selectVersion(nextVersion: UuidVersion) {
    setVersion(nextVersion);

    if (isNameBasedUuid(nextVersion) && !name) {
      setValues([]);
      setError("");
      return;
    }

    generate(1, nextVersion);
  }

  return (
    <ToolLayout
      output={
        <>
          <Output value={values.join("\n")} />
          {error ? <p className="error">{error}</p> : null}
          <div className="actions mt-3">
            <CopyButton value={values.join("\n")} />
          </div>
        </>
      }
    >
      <h2>UUID</h2>
      <div className="field">
        <span className="field-label" id="uuid-version-label">
          Version
        </span>
        <div className="format-buttons uuid-version-grid" role="group" aria-labelledby="uuid-version-label">
          {uuidVersions.map((item) => {
            const info = versionInfo[item];
            return (
              <button
                key={item}
                className="format-button detail"
                type="button"
                aria-pressed={version === item}
                onClick={() => selectVersion(item)}
              >
                <span>
                  <strong>{item}</strong>
                  {info.title}
                </span>
                <small>{info.description}</small>
              </button>
            );
          })}
        </div>
      </div>
      {nameBased ? (
        <>
          <div className="field">
            <label htmlFor="uuid-name">Name</label>
            <input id="uuid-name" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="control-grid two">
            <div className="field">
              <label htmlFor="uuid-namespace">Namespace</label>
              <select
                id="uuid-namespace"
                value={namespace}
                onChange={(event) => setNamespace(event.target.value as UuidNamespace)}
              >
                <option value="dns">DNS</option>
                <option value="url">URL</option>
                <option value="custom">Custom UUID</option>
              </select>
            </div>
            {namespace === "custom" ? (
              <div className="field">
                <label htmlFor="uuid-custom-namespace">Custom namespace</label>
                <input
                  id="uuid-custom-namespace"
                  value={customNamespace}
                  onChange={(event) => setCustomNamespace(event.target.value)}
                />
              </div>
            ) : null}
          </div>
        </>
      ) : null}
      <div className="actions">
        <button className="action-button" type="button" onClick={() => generate(1)}>
          Generate one
        </button>
        <button
          className="secondary-button"
          type="button"
          disabled={nameBased}
          onClick={() => generate(10)}
        >
          Generate ten
        </button>
        {nameBased ? (
          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              setName("example.com");
              setNamespace("dns");
              setCustomNamespace("");
              try {
                setValues([createUuid({ version, name: "example.com", namespace: "dns" })]);
                setError("");
              } catch (caught) {
                setValues([]);
                setError(caught instanceof Error ? caught.message : "Unable to generate UUID.");
              }
            }}
          >
            Sample name
          </button>
        ) : null}
      </div>
    </ToolLayout>
  );
}
