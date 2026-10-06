import fs from "fs-extra";
import path from "node:path";

const CONFIG_FILENAME = "sigil.config.ts";
const TOKEN_FILENAME = "sigil.tokens.css";

export type SigilConfig = {
  preset: string;
  componentsDir: string;
  tokensPath: string;
  typescript: boolean;
  features?: string[];
  projectType?: string;
};

const DEFAULT_CONFIG: SigilConfig = {
  preset: "sigil",
  componentsDir: "src/components/ui",
  tokensPath: "src/styles/sigil.tokens.css",
  typescript: true,
};

export function getConfigPath(cwd: string = process.cwd()): string {
  return path.join(cwd, CONFIG_FILENAME);
}

export function getTokensPath(cwd: string = process.cwd()): string | null {
  const config = readConfig(cwd);
  if (!config) return null;
  return path.join(cwd, config.tokensPath);
}

export function configExists(cwd: string = process.cwd()): boolean {
  return fs.existsSync(getConfigPath(cwd));
}

export function readConfig(cwd: string = process.cwd()): SigilConfig | null {
  const configPath = getConfigPath(cwd);
  if (!fs.existsSync(configPath)) return null;

  const content = fs.readFileSync(configPath, "utf-8");

  const presetMatch = content.match(/preset:\s*["']([^"']+)["']/);
  const componentsDirMatch = content.match(/componentsDir:\s*["']([^"']+)["']/);
  const tokensPathMatch = content.match(/tokensPath:\s*["']([^"']+)["']/);
  const typescriptMatch = content.match(/typescript:\s*(true|false)/);

  return {
    preset: presetMatch?.[1] ?? DEFAULT_CONFIG.preset,
    componentsDir: componentsDirMatch?.[1] ?? DEFAULT_CONFIG.componentsDir,
    tokensPath: tokensPathMatch?.[1] ?? DEFAULT_CONFIG.tokensPath,
    typescript: typescriptMatch ? typescriptMatch[1] === "true" : DEFAULT_CONFIG.typescript,
  };
}

export function writeConfig(config: SigilConfig, cwd: string = process.cwd()): void {
  const configPath = getConfigPath(cwd);
  const content = `import type { SigilConfig } from "@sigil-ui/cli/config";

const config: SigilConfig = {
  preset: "${config.preset}",
  componentsDir: "${config.componentsDir}",
  tokensPath: "${config.tokensPath}",
  typescript: ${config.typescript},
};

export default config;
`;

  fs.ensureDirSync(path.dirname(configPath));
  fs.writeFileSync(configPath, content, "utf-8");
}

export function writeTokensCss(
  cssContent: string,
  tokensRelPath: string,
  cwd: string = process.cwd(),
): void {
  const tokensPath = path.join(cwd, tokensRelPath);
  fs.ensureDirSync(path.dirname(tokensPath));
  fs.writeFileSync(tokensPath, cssContent, "utf-8");
}

export { DEFAULT_CONFIG, TOKEN_FILENAME, CONFIG_FILENAME };
