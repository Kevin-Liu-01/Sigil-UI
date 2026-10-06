"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "@/components/icons";
import { Switch } from "@sigil-ui/components";
import { useThemeSwitch } from "@/components/theme-provider";

export function SigilThemeToggle() {
  const { resolvedTheme, setTheme } = useThemeSwitch();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  if (!mounted) {
    return <div className="w-14 h-8" />;
  }

  return (
    <Switch
      size="lg"
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="!h-8 !w-14"
      thumbClassName="!size-7 data-[state=checked]:!translate-x-6"
      thumbIcon={
        <>
          <Moon className="sigil-theme-glyph" data-visible={isDark} />
          <Sun className="sigil-theme-glyph" data-visible={!isDark} />
        </>
      }
    />
  );
}
