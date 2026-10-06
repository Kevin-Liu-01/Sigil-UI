"use client";

import type { ReactNode } from "react";
import { SigilTokensProvider } from "./sandbox/token-provider";
import { SigilDevBar, DevBarProvider } from "./devbar";
import { SigilSoundProvider } from "./sound-provider";

export function SigilShell({ children }: { children: ReactNode }) {
  return (
    <SigilTokensProvider>
      <SigilSoundProvider>
        <DevBarProvider>
          <SigilDevBar>
            {children}
          </SigilDevBar>
        </DevBarProvider>
      </SigilSoundProvider>
    </SigilTokensProvider>
  );
}
