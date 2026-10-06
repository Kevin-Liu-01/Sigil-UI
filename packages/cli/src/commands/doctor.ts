import { Command } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import path from "node:path";
import { readConfig, configExists } from "../utils/config.js";
import { discoverLocalComponents, getComponent } from "../utils/registry.js";
import { getMissingSigilSkillFiles, hasSigilCursorRule } from "../utils/skills.js";
import { printIntro, symbols } from "../utils/terminal.js";

type DiagnosticResult = {
  label: string;
  status: "pass" | "warn" | "fail";
  message: string;
};

export const doctorCommand = new Command("doctor")
  .description("Validate Sigil token consistency and project health")
  .action(async () => {
    const cwd = process.cwd();
    const results: DiagnosticResult[] = [];

    printIntro("Sigil Doctor", "Running diagnostics");

    results.push(checkConfig(cwd));
    results.push(checkTokensFile(cwd));
    results.push(checkComponentsDir(cwd));
    results.push(await checkComponentDeps(cwd));
    results.push(checkCssImport(cwd));
    results.push(checkAgentAssets(cwd));
    results.push(await checkPreset(cwd));

    const passes = results.filter((r) => r.status === "pass");
    const warns = results.filter((r) => r.status === "warn");
    const fails = results.filter((r) => r.status === "fail");

    for (const r of results) {
      const icon =
        r.status === "pass"
          ? symbols.success
          : r.status === "warn"
            ? symbols.warning
            : symbols.error;
      console.log(`  ${icon} ${chalk.bold(r.label)}: ${r.message}`);
    }

    console.log();
    console.log(
      `${chalk.green(`${passes.length} passed`)}, ${chalk.yellow(`${warns.length} warnings`)}, ${chalk.red(`${fails.length} errors`)}`,
    );

    if (fails.length > 0) process.exit(1);
  });

function checkConfig(cwd: string): DiagnosticResult {
  if (!configExists(cwd)) {
    return {
      label: "Config",
      status: "fail",
      message: "sigil.config.ts not found — run `sigil init`",
    };
  }
  const config = readConfig(cwd);
  if (!config) {
    return {
      label: "Config",
      status: "fail",
      message: "sigil.config.ts exists but could not be parsed",
    };
  }
  return { label: "Config", status: "pass", message: `preset=${config.preset}` };
}

function checkTokensFile(cwd: string): DiagnosticResult {
  const config = readConfig(cwd);
  if (!config) {
    return { label: "Tokens", status: "fail", message: "No config to read tokens path" };
  }

  const tokensPath = path.join(cwd, config.tokensPath);
  if (!fs.existsSync(tokensPath)) {
    return {
      label: "Tokens",
      status: "fail",
      message: `${config.tokensPath} not found — run \`sigil init\``,
    };
  }

  const content = fs.readFileSync(tokensPath, "utf-8");
  if (!content.includes("@import") && !content.includes("--s-")) {
    return {
      label: "Tokens",
      status: "warn",
      message: "Token file has neither an @import nor compiled --s-* custom properties",
    };
  }

  const importedPreset = content.match(
    /@sigil-ui\/presets\/([a-z0-9-]+)/i,
  )?.[1];
  if (importedPreset && importedPreset !== config.preset) {
    return {
      label: "Tokens",
      status: "fail",
      message: `Token file imports preset=${importedPreset}, but config selects preset=${config.preset}`,
    };
  }

  if (/:\s*(?:undefined|NaN|\[object Object\])\s*(?:!important)?\s*;/i.test(content)) {
    return {
      label: "Tokens",
      status: "fail",
      message: "Token file contains a malformed compiled value",
    };
  }

  const withoutComments = content.replace(/\/\*[\s\S]*?\*\//g, "");
  const openBraces = (withoutComments.match(/\{/g) ?? []).length;
  const closeBraces = (withoutComments.match(/\}/g) ?? []).length;
  if (openBraces !== closeBraces) {
    return {
      label: "Tokens",
      status: "fail",
      message: "Token file has unbalanced CSS blocks",
    };
  }

  return { label: "Tokens", status: "pass", message: config.tokensPath };
}

function checkComponentsDir(cwd: string): DiagnosticResult {
  const config = readConfig(cwd);
  if (!config) {
    return { label: "Components", status: "fail", message: "No config" };
  }

  const dir = path.join(cwd, config.componentsDir);
  if (!fs.existsSync(dir)) {
    return {
      label: "Components",
      status: "warn",
      message: `${config.componentsDir}/ not found — run \`sigil add\``,
    };
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".tsx"));
  return {
    label: "Components",
    status: "pass",
    message: `${files.length} component(s) in ${config.componentsDir}/`,
  };
}

async function checkComponentDeps(cwd: string): Promise<DiagnosticResult> {
  const config = readConfig(cwd);
  if (!config) {
    return { label: "Dependencies", status: "fail", message: "No config" };
  }

  const dir = path.join(cwd, config.componentsDir);
  const localComponents = await discoverLocalComponents(dir);

  const missingDeps: string[] = [];
  for (const comp of localComponents) {
    const entry = getComponent(comp);
    if (!entry) continue;

    for (const dep of entry.dependencies) {
      const depPath = path.join(cwd, "node_modules", dep);
      if (!fs.existsSync(depPath)) {
        missingDeps.push(dep);
      }
    }
  }

  if (missingDeps.length > 0) {
    return {
      label: "Dependencies",
      status: "warn",
      message: `Missing: ${[...new Set(missingDeps)].join(", ")}`,
    };
  }

  return { label: "Dependencies", status: "pass", message: "All component deps installed" };
}

function checkCssImport(cwd: string): DiagnosticResult {
  const config = readConfig(cwd);
  if (!config) {
    return { label: "CSS Import", status: "fail", message: "No config" };
  }

  const globalCandidates = [
    "src/app/globals.css",
    "src/styles/globals.css",
    "src/index.css",
    "app/globals.css",
    "styles/globals.css",
    "apps/web/app/global.css",
  ];

  for (const candidate of globalCandidates) {
    const fullPath = path.join(cwd, candidate);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      if (content.includes("sigil") || content.includes("@sigil-ui")) {
        return {
          label: "CSS Import",
          status: "pass",
          message: `Sigil tokens imported in ${candidate}`,
        };
      }
    }
  }

  return {
    label: "CSS Import",
    status: "warn",
    message: "Could not find Sigil token import in global CSS",
  };
}

function checkAgentAssets(cwd: string): DiagnosticResult {
  const agentPath = path.join(cwd, ".sigil", "AGENTS.md");
  if (!fs.existsSync(agentPath)) {
    return {
      label: "Agent Assets",
      status: "warn",
      message: ".sigil/AGENTS.md not found — run `sigil init` without `--no-agent`",
    };
  }

  const missingSkills = getMissingSigilSkillFiles(cwd);
  if (missingSkills.length > 0) {
    return {
      label: "Agent Assets",
      status: "warn",
      message: `Missing Sigil skills: ${missingSkills.slice(0, 3).join(", ")}${missingSkills.length > 3 ? ", ..." : ""}`,
    };
  }

  if (!hasSigilCursorRule(cwd)) {
    return {
      label: "Agent Assets",
      status: "warn",
      message: ".cursor/rules/sigil-skills.mdc not found — rerun `sigil init` to enforce installed skills",
    };
  }

  return { label: "Agent Assets", status: "pass", message: "Agent instructions and Sigil skills installed" };
}

async function checkPreset(cwd: string): Promise<DiagnosticResult> {
  const config = readConfig(cwd);
  if (!config) {
    return { label: "Preset", status: "fail", message: "No config" };
  }

  const { PRESET_NAMES } = await import("../utils/presets.js");
  const builtins = PRESET_NAMES;

  if (builtins.includes(config.preset as (typeof builtins)[number])) {
    try {
      const [{ presets }, { compileToCss }] = await Promise.all([
        import("@sigil-ui/presets"),
        import("@sigil-ui/tokens"),
      ]);
      const loader = presets[config.preset as keyof typeof presets];
      if (!loader) throw new Error("preset loader is missing");
      const preset = await loader();
      compileToCss(preset.tokens, { validation: "strict" });
      return {
        label: "Preset",
        status: "pass",
        message: `Built-in preset validated: ${config.preset}`,
      };
    } catch (error) {
      return {
        label: "Preset",
        status: "fail",
        message: `Preset ${config.preset} failed validation: ${error instanceof Error ? error.message : "unknown error"}`,
      };
    }
  }

  const customPath = path.join(cwd, `sigil.preset.${config.preset}.ts`);
  if (fs.existsSync(customPath)) {
    return { label: "Preset", status: "pass", message: `Custom preset: ${config.preset}` };
  }

  return {
    label: "Preset",
    status: "warn",
    message: `Preset "${config.preset}" not found as built-in or custom file`,
  };
}
