"use client";

import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Enable hover lift effect. */
  hoverable?: boolean;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { hoverable = false, className, children, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card"
      data-hoverable={hoverable || undefined}
      className={cn(
        // Cards expand to fill their container by default. Override with
        // a width utility (e.g., `w-fit`, `max-w-sm`) when needed.
        "flex w-full flex-col gap-[var(--s-card-gap-between,16px)] rounded-[var(--s-radius-card,var(--s-card-radius,0px))] border border-[color:var(--s-border)] p-0 text-[var(--s-text)] shadow-[var(--s-card-shadow,var(--s-shadow-card,none))]",
        hoverable && "transition-all duration-[var(--s-duration-normal,200ms)] hover:[transform:var(--s-card-hover-transform,none)] hover:shadow-[var(--s-card-hover-shadow,var(--s-card-shadow,none))] hover:border-[color:var(--s-card-hover-border-color,var(--s-border))]",
        className,
      )}
      style={{
        background: "var(--s-card-background, var(--s-surface))",
        borderStyle: "var(--s-card-border-style, var(--s-border-style, solid))",
        borderWidth: "var(--s-card-border-width, var(--s-border-thin, 1px))",
        aspectRatio: "var(--s-card-aspect-ratio, auto)",
        outline: "calc(var(--s-card-outline, 0) * 1px) solid var(--s-border-muted)",
        ...style,
      } as CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
});

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="card-header"
        className={cn(
          "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 p-[var(--s-card-header-padding,var(--s-card-padding,24px))]",
          "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
          className,
        )}
        {...rest}
      />
    );
  },
);

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, children, ...rest }, ref) {
    return (
      <h3
        ref={ref}
        data-slot="card-title"
        className={cn("text-[length:var(--s-card-title-size,1.125rem)] font-[var(--s-card-title-weight,600)] leading-none tracking-tight text-[var(--s-text)]", className)}
        {...rest}
      >
        {children}
      </h3>
    );
  },
);

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...rest }, ref) {
    return (
      <p
        ref={ref}
        data-slot="card-description"
        className={cn("text-[length:var(--s-card-description-size,0.875rem)] text-[var(--s-text-muted)]", className)}
        {...rest}
      />
    );
  },
);

export const CardAction = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardAction({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="card-action"
        className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
        {...rest}
      />
    );
  },
);

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...rest }, ref) {
    return <div ref={ref} data-slot="card-content" className={cn("px-[var(--s-card-content-padding-x,var(--s-card-padding,24px))] py-[var(--s-card-content-padding-y,var(--s-card-padding,24px))]", className)} {...rest} />;
  },
);

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="card-footer"
        className={cn("flex items-center p-[var(--s-card-footer-padding,var(--s-card-padding,24px))]", className)}
        {...rest}
      />
    );
  },
);
