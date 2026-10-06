"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useSigilTokens } from "./token-provider";
import { ModelSelector, type ModelId } from "./model-selector";
import type { CanvasItemData } from "./canvas";
import type { TokenPatch } from "@sigil-ui/tokens";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type PatchAction = { patch: Record<string, unknown> };
type AddComponentAction = {
  addComponent: {
    component: string;
    props?: Record<string, unknown>;
    colSpan?: number;
  };
};
type SetPresetAction = { setPreset: string };
type RemoveComponentAction = { removeComponent: string };
type ClearCanvasAction = { clearCanvas: true };
type ParsedAction =
  | PatchAction
  | AddComponentAction
  | SetPresetAction
  | RemoveComponentAction
  | ClearCanvasAction;

type TokenDiff = {
  varName: string;
  oldValue: string;
  newValue: string;
};

type AppliedChange = {
  type: "patch" | "addComponent" | "setPreset" | "removeComponent" | "clearCanvas";
  summary: string;
  diffs?: TokenDiff[];
};

type AgentChatProps = {
  onAddComponent: (
    component: string,
    props?: Record<string, unknown>,
    colSpan?: number,
  ) => void;
  onRemoveComponent: (id: string) => void;
  onClearCanvas: () => void;
  canvasItems: CanvasItemData[];
  className?: string;
};

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function extractJsonBlocks(text: string): ParsedAction[] {
  const actions: ParsedAction[] = [];
  const regex = /```json\s*\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (
        parsed.patch ||
        parsed.addComponent ||
        parsed.setPreset ||
        parsed.removeComponent ||
        parsed.clearCanvas
      ) {
        actions.push(parsed as ParsedAction);
      }
    } catch {
      /* skip */
    }
  }
  return actions;
}

function flattenPatch(
  patch: Record<string, unknown>,
): { category: string; key: string; value: unknown }[] {
  const entries: { category: string; key: string; value: unknown }[] = [];
  for (const [category, val] of Object.entries(patch)) {
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      for (const [key, v] of Object.entries(val as Record<string, unknown>)) {
        entries.push({ category, key, value: v });
      }
    }
  }
  return entries;
}

function renderContentWithCodeBlocks(content: string) {
  const parts: { type: "text" | "json"; value: string }[] = [];
  const regex = /```json\s*\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: "json", value: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push({ type: "text", value: content.slice(lastIndex) });
  }

  return parts.map((part, i) => {
    if (part.type === "json") {
      return (
        <pre
          key={i}
          style={{
            background: "var(--s-surface-sunken, var(--s-surface))",
            border: "1px solid var(--s-border)",
            borderRadius: "6px",
            padding: "8px 10px",
            fontSize: "11px",
            lineHeight: "1.5",
            fontFamily: "var(--s-font-mono, ui-monospace, monospace)",
            overflow: "auto",
            margin: "6px 0",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {part.value}
        </pre>
      );
    }
    return (
      <span key={i} style={{ whiteSpace: "pre-wrap" }}>
        {part.value}
      </span>
    );
  });
}

export function AgentChat({
  onAddComponent,
  onRemoveComponent,
  onClearCanvas,
  canvasItems,
  className,
}: AgentChatProps) {
  const { tokens, patchTokenBatch, setPreset, activePreset } = useSigilTokens();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [model, setModel] = useState<ModelId>("gpt-5.4-mini");
  const [appliedChanges, setAppliedChanges] = useState<
    Map<string, AppliedChange[]>
  >(new Map());

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const processedBlocks = useRef(new Set<string>());

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const applyActions = useCallback(
    (messageId: string, content: string) => {
      const actions = extractJsonBlocks(content);
      const changes: AppliedChange[] = [];

      for (const action of actions) {
        const blockKey = `${messageId}:${JSON.stringify(action)}`;
        if (processedBlocks.current.has(blockKey)) continue;
        processedBlocks.current.add(blockKey);

        if ("patch" in action && action.patch) {
          const entries = flattenPatch(action.patch);
          const diffs: TokenDiff[] = [];
          const patches: TokenPatch[] = [];
          for (const { category, key, value } of entries) {
            const catObj = tokens[category as keyof typeof tokens] as Record<string, unknown> | undefined;
            const oldVal = catObj?.[key];
            const oldStr = oldVal !== undefined ? String(oldVal) : "(unset)";
            const newStr = String(value);
            diffs.push({
              varName: `--s-${category === "colors" || category === "typography" || category === "sigil" ? "" : category + "-"}${key}`,
              oldValue: oldStr,
              newValue: newStr,
            });
            patches.push({ category, key, value });
          }
          const mutation = patchTokenBatch(patches);
          changes.push(mutation.ok
            ? {
                type: "patch",
                summary: `Applied ${entries.length} token change${entries.length !== 1 ? "s" : ""}`,
                diffs,
              }
            : {
                type: "patch",
                summary: `Rejected invalid token patch: ${mutation.issues[0]?.message ?? "unknown error"}`,
                diffs: [],
              });
        }

        if ("addComponent" in action && action.addComponent) {
          const { component, props, colSpan } = action.addComponent;
          onAddComponent(component, props ?? {}, colSpan);
          changes.push({
            type: "addComponent",
            summary: `Added ${component}${colSpan ? ` (${colSpan}/12)` : ""}`,
          });
        }

        if ("setPreset" in action && typeof action.setPreset === "string") {
          setPreset(action.setPreset);
          changes.push({
            type: "setPreset",
            summary: `Switched to "${action.setPreset}"`,
          });
        }

        if ("removeComponent" in action && typeof action.removeComponent === "string") {
          onRemoveComponent(action.removeComponent);
          changes.push({
            type: "removeComponent",
            summary: "Removed component",
          });
        }

        if ("clearCanvas" in action && action.clearCanvas) {
          onClearCanvas();
          changes.push({
            type: "clearCanvas",
            summary: "Cleared canvas",
          });
        }
      }

      if (changes.length > 0) {
        setAppliedChanges((prev) => {
          const next = new Map(prev);
          next.set(messageId, [...(next.get(messageId) ?? []), ...changes]);
          return next;
        });
      }
    },
    [patchTokenBatch, setPreset, onAddComponent, onRemoveComponent, onClearCanvas],
  );

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isStreaming) return;

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: trimmed,
      };

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: "",
      };

      const allMessages = [...messages, userMessage];
      setMessages([...allMessages, assistantMessage]);
      setInput("");
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: allMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            model,
            currentTokens: tokens,
            canvasItems: canvasItems.map((item) => ({
              id: item.id,
              component: item.component,
              colSpan: item.colSpan,
              order: item.order,
            })),
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.text();
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: `Error: ${err}` }
                : m,
            ),
          );
          setIsStreaming(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setIsStreaming(false);
          return;
        }

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          accumulated += decoder.decode(value, { stream: true });
          const current = accumulated;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id ? { ...m, content: current } : m,
            ),
          );
        }

        applyActions(assistantMessage.id, accumulated);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: `Error: ${(err as Error).message}` }
                : m,
            ),
          );
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [input, isStreaming, messages, model, tokens, canvasItems, applyActions],
  );

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--s-background)",
        color: "var(--s-text)",
        fontFamily: "var(--s-font-body, system-ui, sans-serif)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid var(--s-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--s-surface)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: isStreaming ? "var(--s-warning, orange)" : "var(--s-success, green)",
            }}
          />
          <span style={{ fontSize: "12px", fontWeight: 600 }}>Token Forge Agent</span>
        </div>
        <span
          style={{ fontSize: "10px", color: "var(--s-text-subtle)" }}
        >
          generates from scratch
        </span>
      </div>

      {/* Message list */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: "auto",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "var(--s-text-muted)",
              fontSize: "13px",
              textAlign: "center",
              padding: "24px",
            }}
          >
            <span style={{ fontSize: "11px", lineHeight: "1.6" }}>
              Describe a visual direction and the agent will generate a fresh token
              sheet from scratch — try &ldquo;warm editorial with serif headlines&rdquo;
              or &ldquo;dark terminal with acid green accents&rdquo;.
            </span>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === "user";
          const changes = appliedChanges.get(msg.id);

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "88%",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  background: isUser
                    ? "var(--s-primary)"
                    : "var(--s-surface)",
                  color: isUser
                    ? "var(--s-primary-contrast, #fff)"
                    : "var(--s-text)",
                  border: isUser ? "none" : "1px solid var(--s-border)",
                }}
              >
                {isUser ? (
                  msg.content
                ) : msg.content ? (
                  renderContentWithCodeBlocks(msg.content)
                ) : (
                  <span
                    style={{
                      display: "inline-block",
                      width: "6px",
                      height: "14px",
                      background: "var(--s-text-muted)",
                      borderRadius: "1px",
                      animation: "sigil-blink 1s step-end infinite",
                    }}
                  />
                )}

                {changes && changes.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      marginTop: "6px",
                    }}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {changes.map((c, i) => (
                        <span
                          key={i}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                            padding: "2px 7px",
                            borderRadius: "9999px",
                            fontSize: "10px",
                            fontWeight: 500,
                            background:
                              c.type === "patch"
                                ? "var(--s-success-muted, oklch(0.65 0.17 160 / 0.15))"
                                : c.type === "setPreset"
                                  ? "var(--s-info-muted, oklch(0.60 0.15 250 / 0.15))"
                                  : "var(--s-accent-muted, oklch(0.70 0.12 60 / 0.15))",
                            color:
                              c.type === "patch"
                                ? "var(--s-success, oklch(0.65 0.17 160))"
                                : c.type === "setPreset"
                                  ? "var(--s-info, oklch(0.60 0.15 250))"
                                  : "var(--s-accent, oklch(0.70 0.12 60))",
                          }}
                        >
                          {c.type === "patch"
                            ? "✓"
                            : c.type === "setPreset"
                              ? "◈"
                              : c.type === "removeComponent" || c.type === "clearCanvas"
                                ? "✕"
                                : "+"}
                          {c.summary}
                        </span>
                      ))}
                    </div>

                    {/* Token diff display */}
                    {changes
                      .filter((c) => c.diffs && c.diffs.length > 0)
                      .map((c, ci) => (
                        <div
                          key={`diff-${ci}`}
                          style={{
                            padding: "6px 8px",
                            borderRadius: "6px",
                            border: "1px solid var(--s-border)",
                            background: "var(--s-surface-sunken, var(--s-surface))",
                            fontSize: "10px",
                            fontFamily: "var(--s-font-mono, ui-monospace, monospace)",
                            lineHeight: "1.6",
                            overflow: "auto",
                            maxHeight: "120px",
                          }}
                        >
                          {c.diffs!.map((d, di) => (
                            <div key={di} style={{ display: "flex", gap: "6px", alignItems: "baseline" }}>
                              <span style={{ color: "var(--s-text-muted)", minWidth: 0, flexShrink: 0 }}>
                                {d.varName}
                              </span>
                              <span style={{ color: "var(--s-error, oklch(0.60 0.20 25))", textDecoration: "line-through", opacity: 0.7 }}>
                                {d.oldValue}
                              </span>
                              <span style={{ color: "var(--s-text-muted)" }}>→</span>
                              <span style={{ color: "var(--s-success, oklch(0.65 0.17 160))", fontWeight: 600 }}>
                                {d.newValue}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isStreaming && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <button
              onClick={handleStop}
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 500,
                background:
                  "var(--s-error-muted, oklch(0.60 0.20 25 / 0.15))",
                color: "var(--s-error, oklch(0.60 0.20 25))",
                border: "none",
                cursor: "pointer",
              }}
            >
              ■ Stop
            </button>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div
        style={{
          borderTop: "1px solid var(--s-border)",
          padding: "8px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          background: "var(--s-surface)",
        }}
      >
        <div style={{ display: "flex", gap: "6px", alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe a visual direction to generate tokens…"
            rows={1}
            style={{
              flex: 1,
              resize: "none",
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid var(--s-border)",
              background: "var(--s-background)",
              color: "var(--s-text)",
              fontSize: "13px",
              lineHeight: "1.4",
              fontFamily: "inherit",
              outline: "none",
              minHeight: "36px",
              maxHeight: "120px",
            }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
            }}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={isStreaming || !input.trim()}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              background: "var(--s-primary)",
              color: "var(--s-primary-contrast, #fff)",
              fontSize: "13px",
              fontWeight: 500,
              cursor:
                isStreaming || !input.trim() ? "not-allowed" : "pointer",
              opacity: isStreaming || !input.trim() ? 0.5 : 1,
              whiteSpace: "nowrap",
              height: "36px",
            }}
          >
            Send
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ModelSelector value={model} onChange={setModel} />
          <span style={{ fontSize: "10px", color: "var(--s-text-muted)" }}>
            Shift+Enter for newline
          </span>
        </div>
      </div>

      <style>{`
        @keyframes sigil-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
