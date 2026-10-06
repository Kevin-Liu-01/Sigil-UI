declare module "culori" {
  export function converter(mode: string): (color: string) => unknown;
  export function formatCss(color: unknown): string | undefined;
  export function formatHex(color: string): string | undefined;
}
