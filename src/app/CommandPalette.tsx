import { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Fuse from "fuse.js";
import { Search, X } from "lucide-react";
import { tools, type Tool } from "../tools/registry";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (tool: Tool) => void;
};

export function CommandPalette({ open, onOpenChange, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const fuse = useMemo(
    () =>
      new Fuse(tools, {
        keys: ["title", "description", "category", "aliases"],
        threshold: 0.32,
      }),
    [],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange]);

  const results = query.trim() ? fuse.search(query).map((result) => result.item) : tools;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery("");
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="command-dialog" aria-label="Command palette">
          <div className="command-search">
            <Search size={18} />
            <input
              autoFocus
              aria-label="Search tools"
              placeholder="Search tools..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Dialog.Close className="icon-button" aria-label="Close command palette">
              <X size={18} />
            </Dialog.Close>
          </div>
          <div className="command-list" role="listbox" aria-label="Tools">
            {results.map((tool) => (
              <button
                className="command-item"
                key={tool.id}
                type="button"
                onClick={() => {
                  onSelect(tool);
                  onOpenChange(false);
                  setQuery("");
                }}
              >
                <tool.icon size={18} />
                <span>
                  <strong>{tool.title}</strong>
                  <small>{tool.description}</small>
                </span>
              </button>
            ))}
            {results.length === 0 ? <p className="empty">No tools found.</p> : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
