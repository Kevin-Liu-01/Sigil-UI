"use client";

import { useState } from "react";
import { presetCatalog, type PresetCatalogEntry } from "@sigil-ui/presets";
import { Badge, Button } from "@sigil-ui/components";
import {
  useOptionalSigilActions,
  useOptionalSigilActivePreset,
} from "@/components/sandbox/token-provider";
import { useSigilSound } from "@/components/sound-provider";
import { Check } from "@/components/icons";

const CATEGORY_ORDER = ["structural", "minimal", "dark", "colorful", "editorial", "industrial", "edgeless"] as const;
type Category = (typeof CATEGORY_ORDER)[number];

const CATEGORY_LABELS: Record<Category, string> = {
  structural: "Structural",
  minimal: "Minimal",
  dark: "Dark",
  colorful: "Colorful",
  editorial: "Editorial",
  industrial: "Industrial",
  edgeless: "Edgeless",
};

function PresetCard({ preset, isActive, onApply }: { preset: PresetCatalogEntry; isActive: boolean; onApply: () => void }) {
  return (
    <div
      className="flex flex-col gap-3 p-4"
      style={{
        border: isActive ? "2px solid var(--s-primary)" : "1px solid var(--s-border-muted)",
        background: isActive ? "var(--s-surface-elevated)" : "var(--s-surface)",
        transition: "all var(--s-duration-normal, 200ms) var(--s-ease-default, ease)",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.borderColor = "var(--s-border-strong)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.borderColor = "var(--s-border-muted)";
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-[family-name:var(--s-font-display)] text-base font-bold text-[var(--s-text)]">
            {preset.label}
          </span>
          <span className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-subtle)] ml-2">
            {preset.name}
          </span>
        </div>
        <Badge size="sm" variant="outline">{preset.category}</Badge>
      </div>

      <p className="font-[family-name:var(--s-font-mono)] text-[11px] leading-relaxed text-[var(--s-text-muted)] m-0">
        {preset.description}
      </p>

      <div className="flex items-center gap-2">
        <span className="font-[family-name:var(--s-font-mono)] text-[9px] uppercase tracking-[0.06em] text-[var(--s-text-subtle)]">
          Mood
        </span>
        <span className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]">
          {preset.mood}
        </span>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-[family-name:var(--s-font-mono)] text-[9px] uppercase tracking-[0.06em] text-[var(--s-text-subtle)]">Display</span>
          <span className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]">{preset.fonts.display}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-[family-name:var(--s-font-mono)] text-[9px] uppercase tracking-[0.06em] text-[var(--s-text-subtle)]">Mono</span>
          <span className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]">{preset.fonts.mono}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-[family-name:var(--s-font-mono)] text-[9px] uppercase tracking-[0.06em] text-[var(--s-text-subtle)]">Hue</span>
          <span className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]">{preset.primaryHue}</span>
        </div>
      </div>

      <Button
        size="sm"
        variant={isActive ? "primary" : "outline"}
        className="w-full text-xs mt-1"
        onClick={onApply}
      >
        {isActive ? <><Check size={14} /> Active</> : "Apply Preset"}
      </Button>
    </div>
  );
}

const NOOP_SOUND: ReturnType<typeof useSigilSound> = {
  play: () => {},
  enabled: false,
  setEnabled: () => {},
  activePreset: "sigil",
  setActivePreset: () => {},
};

export function PresetGrid() {
  const [activeFilter, setActiveFilter] = useState<Category | "all">("all");
  const actions = useOptionalSigilActions();
  const setPreset = actions?.setPreset;
  const activePreset = useOptionalSigilActivePreset() ?? "sigil";
  let sound: ReturnType<typeof useSigilSound> = NOOP_SOUND;
  try {
    sound = useSigilSound();
  } catch {
    /* no sound provider — fall back to the no-op shim */
  }

  const handleApply = (name: string) => {
    setPreset?.(name);
    sound.play("preset");
  };

  const grouped: Record<Category, PresetCatalogEntry[]> = {
    structural: [], minimal: [], dark: [], colorful: [], editorial: [], industrial: [], edgeless: [],
  };
  for (const p of presetCatalog) {
    grouped[p.category].push(p);
  }

  const visibleCategories = activeFilter === "all"
    ? CATEGORY_ORDER
    : CATEGORY_ORDER.filter((c) => c === activeFilter);

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-8">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className="font-[family-name:var(--s-font-mono)] text-[11px] px-3 py-1 border cursor-pointer transition-all duration-[var(--s-duration-fast,150ms)]"
          style={{
            borderColor: activeFilter === "all" ? "var(--s-primary)" : "var(--s-border-muted)",
            background: activeFilter === "all" ? "var(--s-primary-muted)" : "transparent",
            color: activeFilter === "all" ? "var(--s-primary)" : "var(--s-text-muted)",
          }}
        >
          All ({presetCatalog.length})
        </button>
        {CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveFilter(cat)}
            className="font-[family-name:var(--s-font-mono)] text-[11px] px-3 py-1 border cursor-pointer transition-all duration-[var(--s-duration-fast,150ms)]"
            style={{
              borderColor: activeFilter === cat ? "var(--s-primary)" : "var(--s-border-muted)",
              background: activeFilter === cat ? "var(--s-primary-muted)" : "transparent",
              color: activeFilter === cat ? "var(--s-primary)" : "var(--s-text-muted)",
            }}
          >
            {CATEGORY_LABELS[cat]} ({grouped[cat].length})
          </button>
        ))}
      </div>

      {visibleCategories.map((cat) => {
        const presets = grouped[cat];
        if (presets.length === 0) return null;
        return (
          <div key={cat} className="mb-12">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-[family-name:var(--s-font-mono)] text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--s-text-muted)]">
                {CATEGORY_LABELS[cat]}
              </span>
              <span className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-subtle)]">
                {presets.length} presets
              </span>
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(288px, 1fr))" }}>
              {presets.map((preset) => (
                <PresetCard
                  key={preset.name}
                  preset={preset}
                  isActive={activePreset === preset.name || activePreset === `${preset.name}*`}
                  onApply={() => handleApply(preset.name)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
