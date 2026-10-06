"use client";

import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { cn } from "../../utils";

export interface CommitDay {
  date: string;
  count: number;
}

export interface CommitGridProps extends HTMLAttributes<HTMLDivElement> {
  data: CommitDay[];
  /** Number of weeks to show. @default 52 */
  weeks?: number;
  /** Last date to render, formatted as YYYY-MM-DD. Defaults to the latest date in data. */
  endDate?: string;
  /** Size of each cell in px. @default 12 */
  cellSize?: number;
  /** Fill the available width with evenly sized square cells. @default false */
  responsive?: boolean;
  /** Gap between cells in px. @default 2 */
  gap?: number;
  /** Color for filled cells. @default "var(--s-success)" */
  color?: string;
  /** Day labels on left side. @default true */
  showDayLabels?: boolean;
  /** Month labels on top. @default true */
  showMonthLabels?: boolean;
}

const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function latestDate(data: CommitDay[]): string {
  return data.reduce((latest, day) => (day.date > latest ? day.date : latest), data[0]?.date ?? "1970-01-01");
}

function parseIsoDate(date: string): Date {
  const [year = 1970, month = 1, day = 1] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function addUtcDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function intensityLevel(count: number, max: number): number {
  if (count === 0) return 0;
  if (max === 0) return 0;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

export const CommitGrid = forwardRef<HTMLDivElement, CommitGridProps>(
  function CommitGrid(
    { data, weeks = 52, endDate, cellSize = 12, responsive = false, gap = 2, color, showDayLabels = true, showMonthLabels = true, className, style, ...rest },
    ref,
  ) {
    const totalDays = weeks * 7;
    const dayMap = new Map(data.map((d) => [d.date, d.count]));
    const maxCount = Math.max(...data.map((d) => d.count), 1);

    const rangeEndDate = parseIsoDate(endDate ?? latestDate(data));
    const startDate = addUtcDays(rangeEndDate, -totalDays + 1);
    const startDayOfWeek = startDate.getUTCDay();

    const grid: { date: string; count: number; dayOfWeek: number; month: number }[][] = [];
    let currentWeek: { date: string; count: number; dayOfWeek: number; month: number }[] = [];

    for (let i = 0; i < totalDays + startDayOfWeek; i++) {
      if (i < startDayOfWeek) {
        currentWeek.push({ date: "", count: -1, dayOfWeek: i % 7, month: -1 });
      } else {
        const d = addUtcDays(startDate, i - startDayOfWeek);
        const dateStr = formatIsoDate(d);
        currentWeek.push({
          date: dateStr,
          count: dayMap.get(dateStr) ?? 0,
          dayOfWeek: d.getUTCDay(),
          month: d.getUTCMonth(),
        });
      }

      if (currentWeek.length === 7) {
        grid.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) grid.push(currentWeek);

    const opacityLevels = [0.06, 0.3, 0.5, 0.7, 0.95];
    const size = responsive ? "var(--s-commit-cell-size)" : cellSize;
    const columnSize = responsive ? `calc(var(--s-commit-cell-size) + ${gap}px)` : cellSize + gap;

    return (
      <div
        ref={ref}
        data-slot="commit-grid"
        data-responsive={responsive || undefined}
        className={cn("inline-flex flex-col gap-1", className)}
        style={{
          ...(responsive ? {
            width: "100%", containerType: "inline-size",
            "--s-commit-cell-size": `max(0px, calc((100cqw - ${showDayLabels ? 28 : 0}px - ${Math.max(0, grid.length - 1) * gap}px) / ${Math.max(1, grid.length)}))`,
          } : {}),
          ...style,
        } as CSSProperties}
        {...rest}
      >
        {showMonthLabels && (
          <div className="flex" style={{ paddingLeft: showDayLabels ? 28 : 0, gap: responsive ? gap : undefined }}>
            {grid.map((week, wi) => {
              const firstValid = week.find((d) => d.month >= 0);
              const prevWeek = grid[wi - 1];
              const prevMonth = prevWeek?.find((d) => d.month >= 0)?.month;
              const showLabel = firstValid && (wi === 0 || firstValid.month !== prevMonth);
              return (
                <div key={wi} className="text-[9px] text-[var(--s-text-muted)] font-[family-name:var(--s-font-mono)]" style={{ width: responsive ? size : columnSize, minWidth: responsive ? size : columnSize }}>
                  {showLabel ? monthNames[firstValid!.month] : ""}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex gap-0">
          {showDayLabels && (
            <div className="flex flex-col shrink-0 pr-1" style={{ gap }}>
              {dayLabels.map((label, i) => (
                <div
                  key={i}
                  className="text-[9px] text-[var(--s-text-muted)] font-[family-name:var(--s-font-mono)] flex items-center justify-end"
                  style={{ height: size, width: 24 }}
                >
                  {label}
                </div>
              ))}
            </div>
          )}

          <div className="flex" style={{ gap }}>
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap }}>
                {week.map((day, di) => {
                  if (day.count < 0) {
                    return <div key={di} style={{ width: size, height: size }} />;
                  }
                  const level = intensityLevel(day.count, maxCount);
                  return (
                    <div
                      key={di}
                      className="rounded-[1px]"
                      style={{
                        width: size,
                        height: size,
                        backgroundColor: color ?? "var(--s-success)",
                        opacity: opacityLevels[level],
                      }}
                      title={`${day.date}: ${day.count} contributions`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
);
