import { Command } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import path from "node:path";
import { readConfig, configExists } from "../utils/config.js";
import { detectProject, PM_INSTALL } from "../utils/detect.js";
import {
  getComponent,
  listComponentNames,
  resolveComponentSource,
} from "../utils/registry.js";
import { collectComponentTree, copyComponentTree } from "../utils/copy-component.js";
import { printIntro, symbols } from "../utils/terminal.js";

export const addCommand = new Command("add")
  .description("Add Sigil components to your project")
  .argument("[components...]", "component names to add")
  .option("-a, --all", "add all available components")
  .option("-o, --overwrite", "overwrite existing files")
  .option("-d, --dir <dir>", "override components directory")
  .action(async (componentNames: string[], opts) => {
    const cwd = process.cwd();
    printIntro("Sigil Add", "Copy token-driven components into your project");

    if (!configExists(cwd)) {
      console.log(
        symbols.error,
        "No sigil.config.ts found. Run",
        chalk.cyan("sigil init"),
        "first.",
      );
      process.exit(1);
    }

    const config = readConfig(cwd)!;
    const detection = detectProject(cwd);
    const componentsDir = path.join(cwd, opts.dir ?? config.componentsDir);

    if (opts.all) {
      componentNames = listComponentNames();
    }

    if (componentNames.length === 0) {
      console.log(chalk.yellow("No components specified."));
      console.log();
      console.log("Usage:");
      console.log(`  ${chalk.cyan("sigil add <component> [component...]")}`);
      console.log(`  ${chalk.cyan("sigil add --all")}`);
      console.log();
      console.log("Available components:");
      for (const name of listComponentNames()) {
        console.log(`  ${chalk.gray("•")} ${name}`);
      }
      return;
    }

    fs.ensureDirSync(componentsDir);
    const added: string[] = [];
    const skipped: string[] = [];
    const failed: string[] = [];
    const depsToInstall = new Set<string>();

    for (const name of resolveWithDependencies(componentNames)) {
      const entry = getComponent(name);
      if (!entry) {
        console.log(symbols.error, `Unknown component: ${chalk.bold(name)}`);
        failed.push(name);
        continue;
      }

      for (const file of entry.files) {
        const destPath = path.join(componentsDir, file);

        if (fs.existsSync(destPath) && !opts.overwrite) {
          console.log(symbols.skip, `${file} already exists (use --overwrite to replace)`);
          skipped.push(name);
          continue;
        }

        const sourcePath = resolveComponentSource(name, file, cwd);

        try {
          const tree = collectComponentTree(sourcePath);
          copyComponentTree(tree, destPath, opts.overwrite, entry.exportAlias);
          for (const dependency of tree.dependencies) depsToInstall.add(dependency);
          console.log(symbols.success, `Added ${file} with ${tree.files.length} source file(s)`);
        } catch (error) {
          console.log(symbols.error, `Could not add ${file}: ${error instanceof Error ? error.message : String(error)}`);
          failed.push(name);
          continue;
        }

        added.push(name);
      }

      for (const dep of entry.dependencies) {
        depsToInstall.add(dep);
      }
    }

    if (depsToInstall.size > 0) {
      const pm = PM_INSTALL[detection.packageManager];
      console.log();
      console.log(chalk.bold("Install required dependencies:"));
      console.log(`  ${chalk.cyan(`${pm} ${[...depsToInstall].join(" ")}`)}`);
    }

    console.log();
    if (added.length > 0) {
      console.log(chalk.green(`Added ${added.length} component(s).`));
    }
    if (skipped.length > 0) {
      console.log(chalk.yellow(`Skipped ${skipped.length} existing component(s).`));
    }
    if (failed.length > 0) {
      console.log(chalk.red(`Failed: ${failed.join(", ")}`));
      process.exitCode = 1;
    }
  });

function resolveWithDependencies(names: string[]): string[] {
  const resolved = new Set<string>();
  const queue = [...names];

  while (queue.length > 0) {
    const name = queue.shift()!;
    if (resolved.has(name)) continue;
    resolved.add(name);

    const entry = getComponent(name);
    if (entry) {
      for (const dep of entry.registryDependencies) {
        if (!resolved.has(dep)) queue.push(dep);
      }
    }
  }

  return [...resolved];
}
