import { useMemo, useState } from "react";
import { Check, Copy, Plus, Trash2 } from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { formatLogOutput, parseLogTime, type OutputFormat, type SourceZone } from "../../lib/time";
import { ClearButton, ToolLayout } from "../shared";

type ZoneItem = {
  id: string;
  label: string;
  timeZone: string;
};

const sampleChina = "2026-06-24 12:00:00";
const sampleUtc = "2026-06-24T04:00:00Z";
const defaultZones: ZoneItem[] = [
  { id: "utc", label: "UTC", timeZone: "UTC" },
  { id: "china", label: "China", timeZone: "Asia/Shanghai" },
];
const sourceKey = "devtools.time.source";
const formatKey = "devtools.time.format";
const zonesKey = "devtools.time.zones";
const zoneInputKey = "devtools.time.zoneInput";
const sourceValues: SourceZone[] = ["auto", "utc", "china"];
const formatValues: OutputFormat[] = ["log", "iso", "unix-seconds", "unix-milliseconds", "all"];
const epochFormats: OutputFormat[] = ["unix-seconds", "unix-milliseconds"];

export default function TimestampTool() {
  const [input, setInput] = useState(sampleChina);
  const [source, setSource] = useLocalStorage<SourceZone>(sourceKey, "china", readSource);
  const [format, setFormat] = useLocalStorage<OutputFormat>(formatKey, "all", readFormat);
  const [zones, setZones] = useLocalStorage<ZoneItem[]>(zonesKey, defaultZones, readZones);
  const [zoneInput, setZoneInput] = useLocalStorage<string>(zoneInputKey, "Asia/Tokyo", readString);
  const [zoneError, setZoneError] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return { output: "", error: "", parsed: null, rows: [] };

    try {
      const parsed = parseLogTime(input, source);
      const rows = zones.map((zone) => ({
        ...zone,
        output: formatLogOutput(parsed, zone.timeZone, format),
      }));

      return {
        parsed,
        rows,
        error: "",
      };
    } catch (error) {
      return {
        parsed: null,
        rows: [],
        output: "",
        error: error instanceof Error ? error.message : "Unable to parse time.",
      };
    }
  }, [format, input, source, zones]);

  function addZone() {
    const value = zoneInput.trim();
    if (!value) {
      setZoneError("Enter an IANA timezone such as Asia/Shanghai.");
      return;
    }

    try {
      Intl.DateTimeFormat(undefined, { timeZone: value }).format(new Date());
    } catch {
      setZoneError(`Unknown timezone: ${value}`);
      return;
    }

    if (zones.some((zone) => zone.timeZone === value)) {
      setZoneError(`${value} is already listed.`);
      return;
    }

    setZones((current) => [...current, { id: crypto.randomUUID(), label: value, timeZone: value }]);
    setZoneInput("");
    setZoneError("");
  }

  return (
    <ToolLayout
      output={
        <>
          {result.parsed ? (
            <div className="time-summary" aria-label="Parsed time">
              <ValueCard label="Parsed as" value={result.parsed.source} copy={result.parsed.source} />
              <ValueCard label="Extracted" value={result.parsed.parsedText} copy={result.parsed.parsedText} />
              <ValueCard label="UTC" value={result.parsed.utc} copy={result.parsed.utc} />
              <ValueCard label="China" value={result.parsed.china} copy={result.parsed.china} />
              <ValueCard label="Unix seconds" value={String(result.parsed.epochSec)} copy={String(result.parsed.epochSec)} />
              <ValueCard label="Unix milliseconds" value={String(result.parsed.epochMs)} copy={String(result.parsed.epochMs)} />
            </div>
          ) : null}
          {result.parsed && !epochFormats.includes(format) ? (
            <div className="time-output-list" aria-label="Converted time zones">
              {result.rows.map((row) => (
                <ValueCard
                  className="time-output-card"
                  key={row.id}
                  label={row.label}
                  value={row.output}
                  copy={row.output}
                />
              ))}
            </div>
          ) : null}
          {result.error ? <p className="error">{result.error}</p> : null}
        </>
      }
    >
      <h2>Time</h2>
      <div className="field">
        <label htmlFor="timestamp-input">Pasted time</label>
        <textarea
          id="timestamp-input"
          rows={5}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="2026-06-24 12:00:00 or 2026-06-24T04:00:00Z"
        />
        <p className="hint">
          Paste a timestamp or a full log line. The tool extracts the first supported time value; explicit offsets are used directly,
          and plain log times use the source setting below.
        </p>
        <div className="format-hints" aria-label="Supported time examples">
          <span>2026-06-24 12:00:00</span>
          <span>2026-06-24T04:00:00Z</span>
          <span>2026/06/24 12:00:00,123</span>
          <span>20260624T120000+0800</span>
          <span>1719211200</span>
          <span>1719211200000</span>
        </div>
      </div>
      <div className="control-grid two">
        <div className="field">
          <label htmlFor="timestamp-source">Source for plain log time</label>
          <select id="timestamp-source" value={source} onChange={(event) => setSource(event.target.value as SourceZone)}>
            <option value="china">China time</option>
            <option value="utc">UTC</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="timestamp-format">Output format</label>
          <select id="timestamp-format" value={format} onChange={(event) => setFormat(event.target.value as OutputFormat)}>
            <option value="all">All</option>
            <option value="log">Log time</option>
            <option value="iso">ISO</option>
            <option value="unix-seconds">Unix seconds</option>
            <option value="unix-milliseconds">Unix milliseconds</option>
          </select>
        </div>
      </div>
      <section className="zone-editor" aria-label="Output time zones">
        <div className="field">
          <label htmlFor="zone-input">Add output timezone</label>
          <div className="inline-control">
            <input
              id="zone-input"
              list="timezone-suggestions"
              value={zoneInput}
              onChange={(event) => setZoneInput(event.target.value)}
              placeholder="Asia/Tokyo"
            />
            <button className="action-button" type="button" onClick={addZone}>
              <Plus size={16} />
              Add
            </button>
          </div>
          <datalist id="timezone-suggestions">
            <option value="UTC" />
            <option value="Asia/Shanghai" />
            <option value="Asia/Tokyo" />
            <option value="America/Los_Angeles" />
            <option value="America/New_York" />
            <option value="Europe/London" />
          </datalist>
          {zoneError ? <p className="error">{zoneError}</p> : null}
        </div>
        <div className="zone-list">
          {zones.map((zone) => (
            <div className="zone-row" key={zone.id}>
              <div>
                <strong>{zone.label}</strong>
                <span>{zone.timeZone}</span>
              </div>
              <button
                aria-label={`Remove ${zone.label}`}
                className="icon-button"
                disabled={zones.length === 1}
                type="button"
                onClick={() => setZones((current) => current.filter((item) => item.id !== zone.id))}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
      <div className="actions">
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            setInput(sampleChina);
            setSource("china");
          }}
        >
          China sample
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            setInput(sampleUtc);
            setSource("utc");
          }}
        >
          UTC sample
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            setInput(new Date().toISOString());
            setSource("utc");
          }}
        >
          Now
        </button>
        <ClearButton onClick={() => setInput("")} />
      </div>
    </ToolLayout>
  );
}

function ValueCard({
  label,
  value,
  copy,
  className = "",
}: {
  label: string;
  value: string;
  copy: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    await navigator.clipboard.writeText(copy);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className={`time-value-card ${className}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <button className="copy-chip" type="button" aria-label={`Copy ${label}`} onClick={copyValue}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

function readSource(value: unknown): SourceZone | null {
  return typeof value === "string" && sourceValues.includes(value as SourceZone) ? (value as SourceZone) : null;
}

function readFormat(value: unknown): OutputFormat | null {
  return typeof value === "string" && formatValues.includes(value as OutputFormat) ? (value as OutputFormat) : null;
}

function readString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function readZones(value: unknown): ZoneItem[] | null {
  if (!Array.isArray(value)) return null;

  const zones = value
    .map((item): ZoneItem | null => {
      if (!item || typeof item !== "object") return null;
      const id = "id" in item && typeof item.id === "string" ? item.id : "";
      const label = "label" in item && typeof item.label === "string" ? item.label : "";
      const timeZone = "timeZone" in item && typeof item.timeZone === "string" ? item.timeZone : "";
      if (!id || !label || !isTimeZone(timeZone)) return null;
      return { id, label, timeZone };
    })
    .filter((item): item is ZoneItem => item !== null);

  return zones.length ? zones : null;
}

function isTimeZone(value: string) {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value }).format(new Date());
    return true;
  } catch {
    return false;
  }
}
