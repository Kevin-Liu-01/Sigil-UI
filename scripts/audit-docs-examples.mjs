#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const web = path.join(root, "apps/web");
const directory = path.join(web, ".docs-example-check");
const output = path.join(root, "output/product-polish/docs-complete-audit");
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const virtualFiles = new Map();
fs.mkdirSync(output, { recursive: true });
const examples = [];
try {
  for (const file of walk(path.join(web, "content/docs")).filter((file) => file.endsWith(".mdx"))) {
    const source = fs.readFileSync(file, "utf8");
    for (const [index, match] of [...source.matchAll(/<ComponentPreview[^>]*>([\s\S]*?)<\/ComponentPreview>/g)].entries()) {
      const body = match[1].trim();
      const names = [...new Set([...body.matchAll(/<([A-Z]\w*)\b/g)].map((match) => match[1]))];
      const target = path.join(directory, `${examples.length}.tsx`);
      virtualFiles.set(target, `import { ${names.join(", ")} } from "../components/mdx-components";\nexport default function Example() { return <>${body}</>; }\n`);
      examples.push({ target, route: path.relative(path.join(web, "content/docs"), file), index });
    }
  }
  const config = ts.readConfigFile(path.join(web, "tsconfig.json"), ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, web);
  const options = { ...parsed.options, incremental: false, noEmit: true };
  const host = ts.createCompilerHost(options);
  const readSource = host.getSourceFile.bind(host);
  const fileExists = host.fileExists.bind(host);
  const directoryExists = host.directoryExists.bind(host);
  host.fileExists = (file) => virtualFiles.has(file) || fileExists(file);
  host.directoryExists = (dir) => dir === directory || directoryExists(dir);
  host.getSourceFile = (file, languageVersion, onError, shouldCreateNewSourceFile) => virtualFiles.has(file)
    ? ts.createSourceFile(file, virtualFiles.get(file), languageVersion, true, ts.ScriptKind.TSX)
    : readSource(file, languageVersion, onError, shouldCreateNewSourceFile);
  const program = ts.createProgram(examples.map((example) => example.target), options, host);
  const findings = ts.getPreEmitDiagnostics(program).filter((diagnostic) => diagnostic.file?.fileName.startsWith(directory)).map((diagnostic) => {
    const example = examples.find((example) => example.target === diagnostic.file.fileName);
    return { route: example.route, preview: example.index + 1, line: diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start ?? 0).line + 1, message: ts.flattenDiagnosticMessageText(diagnostic.messageText, " ") };
  });
  fs.writeFileSync(path.join(output, "example-types.json"), JSON.stringify({ examples: examples.length, findings }, null, 2));
  console.log(`${examples.length} preview examples; ${findings.length} type errors. See output/product-polish/docs-complete-audit/example-types.json`);
  if (findings.length) process.exitCode = 1;
} finally {
  virtualFiles.clear();
}
