"use client";

import { forwardRef, useState, type ComponentPropsWithoutRef, type HTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card";
import { CodeBlock } from "./CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";
import { Textarea } from "./Textarea";
import { cn } from "../utils";
import { useCopyToClipboard } from "../use-copy-to-clipboard";

export interface CodeTab {
  value: string;
  label: ReactNode;
  code: string;
  language?: string;
}

export interface CodeTabsProps extends HTMLAttributes<HTMLDivElement> {
  tabs: CodeTab[];
  defaultValue?: string;
}

export const CodeTabs = forwardRef<HTMLDivElement, CodeTabsProps>(function CodeTabs(
  { tabs, defaultValue, className, ...props },
  ref,
) {
  const safeTabs = tabs ?? [];
  if (safeTabs.length === 0) {
    return <div ref={ref} className={cn("text-sm text-[var(--s-text-muted)]", className)} {...props}>No code tabs available.</div>;
  }
  return (
    <div ref={ref} className={className} {...props}>
      <Tabs defaultValue={defaultValue ?? safeTabs[0]?.value}>
        <TabsList>
          {safeTabs.map((tab) => <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>)}
        </TabsList>
        {safeTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <CodeBlock code={tab.code} language={tab.language} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
});

export interface CodePreviewProps extends HTMLAttributes<HTMLDivElement> {
  preview?: ReactNode;
  code?: string;
  language?: string;
}

export const CodePreview = forwardRef<HTMLDivElement, CodePreviewProps>(function CodePreview(
  { preview, code, language, className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn("grid overflow-hidden rounded-[var(--s-card-radius,10px)] border border-[color:var(--s-border)]", className)} {...props}>
      <div className="bg-[var(--s-background)] p-4">{preview}</div>
      {code && <CodeBlock code={code} language={language} className="rounded-[var(--s-radius-none)] border-x-0 border-b-0" />}
    </div>
  );
});

export interface CopyButtonProps extends ComponentPropsWithoutRef<typeof Button> {
  value: string;
  copiedLabel?: ReactNode;
}

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton(
  { value, children = "Copy", copiedLabel = "Copied", onClick, ...props },
  ref,
) {
  const { copy, copied, error } = useCopyToClipboard(value, 1200);
  return (
    <Button
      ref={ref}
      variant="outline"
      aria-live="polite"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) void copy();
      }}
      {...props}
    >
      {error ? "Copy failed — retry" : copied ? copiedLabel : children}
    </Button>
  );
});

export interface TokenPreviewProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  value?: string;
}

export const TokenPreview = forwardRef<HTMLDivElement, TokenPreviewProps>(function TokenPreview(
  { name, value, className, ...props },
  ref,
) {
  const tokenValue = value ?? `var(${name})`;
  return (
    <div ref={ref} className={cn("flex items-center gap-3 rounded-[var(--s-radius-md,8px)] border border-[color:var(--s-border)] p-3", className)} {...props}>
      <span className="size-8 rounded-[var(--s-radius-sm,4px)] border border-[color:var(--s-border)]" style={{ background: tokenValue }} />
      <span className="grid text-sm">
        <code className="font-mono text-[var(--s-text)]">{name}</code>
        <span className="text-[var(--s-text-muted)]">{tokenValue}</span>
      </span>
    </div>
  );
});

export interface ThemeSwatchProps extends HTMLAttributes<HTMLButtonElement> {
  name?: ReactNode;
  colors?: string[];
  selected?: boolean;
}

export const ThemeSwatch = forwardRef<HTMLButtonElement, ThemeSwatchProps>(function ThemeSwatch(
  { name, colors = ["var(--s-primary)", "var(--s-surface)", "var(--s-text)"], selected, className, ...props },
  ref,
) {
  return (
    <button ref={ref} type="button" aria-pressed={selected} className={cn("grid gap-2 rounded-[var(--s-card-radius,10px)] border border-[color:var(--s-border)] p-2 text-left aria-pressed:border-[color:var(--s-primary)]", className)} {...props}>
      <span className="flex overflow-hidden rounded-[var(--s-radius-sm,4px)]">
        {colors.map((color, index) => <span key={index} className="h-8 flex-1" style={{ background: color }} />)}
      </span>
      {name && <span className="text-sm font-medium text-[var(--s-text)]">{name}</span>}
    </button>
  );
});

export interface ThemeSwitcherProps extends HTMLAttributes<HTMLDivElement> {
  themes: Array<{ value: string; label: ReactNode; colors?: string[] }>;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const ThemeSwitcher = forwardRef<HTMLDivElement, ThemeSwitcherProps>(function ThemeSwitcher(
  { themes, value, onValueChange, className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn("grid gap-2 sm:grid-cols-3", className)} {...props}>
      {themes.map((theme) => (
        <ThemeSwatch
          key={theme.value}
          name={theme.label}
          colors={theme.colors}
          selected={theme.value === value}
          onClick={() => onValueChange?.(theme.value)}
        />
      ))}
    </div>
  );
});

export interface PromptInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  actions?: ReactNode;
}

export const PromptInput = forwardRef<HTMLTextAreaElement, PromptInputProps>(function PromptInput(
  { actions, className, ...props },
  ref,
) {
  return (
    <div className="grid gap-2 rounded-[var(--s-card-radius,10px)] border border-[color:var(--s-border)] bg-[var(--s-background)] p-2">
      <Textarea ref={ref} rows={3} className={cn("border-0 shadow-none focus-visible:ring-0", className)} {...props} />
      {actions && <div className="flex items-center justify-end gap-2">{actions}</div>}
    </div>
  );
});

export interface ChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  role?: "user" | "assistant" | "system";
  avatar?: ReactNode;
}

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(function ChatMessage(
  { role = "assistant", avatar, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="listitem"
      aria-label={`${role} message`}
      data-role={role}
      className={cn("flex gap-3 data-[role=user]:flex-row-reverse", className)}
      {...props}
    >
      {avatar && <div className="shrink-0">{avatar}</div>}
      <div className="max-w-[80%] rounded-[var(--s-card-radius,10px)] border border-[color:var(--s-border)] bg-[var(--s-surface)] px-3 py-2 text-sm data-[role=user]:bg-[var(--s-primary)] data-[role=user]:text-[var(--s-primary-contrast)]">
        {children}
      </div>
    </div>
  );
});

export const ChatThread = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ChatThread(
  { className, ...props },
  ref,
) {
  return <div ref={ref} role="list" className={cn("grid gap-4", className)} {...props} />;
});

export interface MessageComposerProps extends PromptInputProps {
  onSend?: () => void;
  sendLabel?: ReactNode;
}

export const MessageComposer = forwardRef<HTMLTextAreaElement, MessageComposerProps>(function MessageComposer(
  { onSend, sendLabel = "Send", actions, ...props },
  ref,
) {
  return <PromptInput ref={ref} actions={<>{actions}<Button type="button" onClick={onSend}>{sendLabel}</Button></>} {...props} />;
});

export interface TimelineItem {
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
}

export interface ActivityTimelineProps extends HTMLAttributes<HTMLOListElement> {
  items?: TimelineItem[];
}

export const ActivityTimeline = forwardRef<HTMLOListElement, ActivityTimelineProps>(function ActivityTimeline(
  { items, children, className, ...props },
  ref,
) {
  return (
    <ol ref={ref} className={cn("grid gap-4 border-l border-[color:var(--s-border)] pl-4", className)} {...props}>
      {items?.map((item, index) => (
        <li key={index} className="relative grid gap-1 before:absolute before:-left-[var(--s-space-20)] before:top-1.5 before:size-2 before:rounded-[var(--s-radius-full)] before:bg-[var(--s-primary)]">
          <div className="font-medium text-[var(--s-text)]">{item.title}</div>
          {item.description && <div className="text-sm text-[var(--s-text-muted)]">{item.description}</div>}
          {item.meta && <div className="text-xs text-[var(--s-text-muted)]">{item.meta}</div>}
        </li>
      ))}
      {children}
    </ol>
  );
});

export const AuditLog = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AuditLog(
  { className, ...props },
  ref,
) {
  return <div ref={ref} role="log" className={cn("grid divide-y divide-[color:var(--s-border)] rounded-[var(--s-card-radius,10px)] border border-[color:var(--s-border)]", className)} {...props} />;
});

export const Changelog = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Changelog(
  { className, ...props },
  ref,
) {
  return <div ref={ref} role="feed" className={cn("grid gap-6", className)} {...props} />;
});

export interface VersionBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  version: string;
}

export const VersionBadge = forwardRef<HTMLSpanElement, VersionBadgeProps>(function VersionBadge(
  { version, className, ...props },
  ref,
) {
  return <Badge ref={ref} className={cn("font-mono tabular-nums", className)} {...props}>v{version}</Badge>;
});

export const KeyboardKey = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function KeyboardKey(
  { className, ...props },
  ref,
) {
  return <kbd ref={ref} className={cn("rounded-[var(--s-radius-sm,4px)] border border-[color:var(--s-border)] bg-[var(--s-surface)] px-1.5 py-0.5 font-mono text-xs shadow-[var(--s-shadow-sm)]", className)} {...props} />;
});
