import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { tools } from "../tools/registry";

const appVersion = import.meta.env.VITE_APP_VERSION;

type Props = {
  activeId: string;
  open: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
};

export function Sidebar({ activeId, open, onClose, onNavigate }: Props) {
  const content = <Nav activeId={activeId} onNavigate={onNavigate} />;

  return (
    <>
      <aside className="sidebar hidden lg:block">{content}</aside>
      <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay lg:hidden" />
          <Dialog.Content className="mobile-nav lg:hidden" aria-label="Navigation">
            <div className="mobile-nav-header">
              <strong>Devtools</strong>
              <Dialog.Close className="icon-button" aria-label="Close navigation">
                <X size={18} />
              </Dialog.Close>
            </div>
            {content}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function Nav({ activeId, onNavigate }: Pick<Props, "activeId" | "onNavigate">) {
  const groups = tools.reduce<Record<string, typeof tools>>((acc, tool) => {
    acc[tool.category] = [...(acc[tool.category] ?? []), tool];
    return acc;
  }, {});

  return (
    <nav aria-label="Tools">
      <div className="brand">
        <span>Devtools</span>
        <span className="brand-version">{appVersion}</span>
      </div>
      {Object.entries(groups).map(([category, items]) => (
        <section className="nav-group" key={category}>
          <h2>{category}</h2>
          {items.map((tool) => (
            <button
              key={tool.id}
              className={tool.id === activeId ? "nav-item active" : "nav-item"}
              type="button"
              onClick={() => onNavigate(tool.route)}
            >
              <tool.icon size={17} />
              <span>{tool.title}</span>
            </button>
          ))}
        </section>
      ))}
    </nav>
  );
}
