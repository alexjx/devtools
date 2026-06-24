import { Suspense, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { CommandPalette } from "./CommandPalette";
import { Sidebar } from "./Sidebar";
import { tools } from "../tools/registry";

export function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const active = useMemo(
    () => tools.find((tool) => tool.route === location.pathname) ?? tools[0],
    [location.pathname],
  );

  return (
    <div className="min-h-dvh bg-slate-100 text-slate-950">
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onSelect={(tool) => navigate(tool.route)}
      />
      <div className="app-shell">
        <Sidebar
          activeId={active.id}
          open={navOpen}
          onClose={() => setNavOpen(false)}
          onNavigate={(route) => {
            setNavOpen(false);
            navigate(route);
          }}
        />
        <main className="workspace">
          <header className="topbar">
            <button
              className="icon-button lg:hidden"
              type="button"
              aria-label="Open navigation"
              onClick={() => setNavOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="eyebrow">{active.category}</p>
              <h1>{active.title}</h1>
            </div>
            <button
              aria-label="Search tools"
              className="search-button"
              type="button"
              onClick={() => setPaletteOpen(true)}
            >
              <Search size={17} />
              <span>Search tools</span>
              <kbd>Ctrl K</kbd>
            </button>
          </header>
          <Suspense fallback={<div className="panel">Loading tool...</div>}>
            <Routes>
              <Route path="/" element={<Navigate to={tools[0].route} replace />} />
              {tools.map((tool) => (
                <Route key={tool.id} path={tool.route} element={<tool.component />} />
              ))}
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
