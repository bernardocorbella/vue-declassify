#!/usr/bin/env node

import fs from "fs";
import program from "commander";
import { IndentationText, NewLineKind, Project, QuoteKind } from "ts-morph";
import glob from "glob";
import { declassify } from "./index";

program
  .name("vue-declassify")
  .version("1.0.0")
  .command("declassify <pattern>", {
    isDefault: true,
  })
  .description("rewrites the TypeScript Vue component to object-based syntax", {
    pattern: "glob pattern to the components (.ts or .vue file)",
  })
  .action((pattern: string) => {
    const project = new Project({
      skipAddingFilesFromTsConfig: true,
      skipFileDependencyResolution: true,
      skipLoadingLibFiles: true,
      useInMemoryFileSystem: true,
      // TODO: pass these options as CLI arguments.
      manipulationSettings: {
        newLineKind: NewLineKind.LineFeed,
        quoteKind: QuoteKind.Single,
        useTrailingCommas: false,
        indentationText: IndentationText.TwoSpaces,
      },
    });

    let mode: "ts" | "vue";

    glob(pattern, (er, paths) => {
      paths.forEach((path) => {
        console.log(`Processing: ${path}`);
        if (path.endsWith(".vue")) {
          mode = "vue";
        } else if (path.endsWith(".ts")) {
          mode = "ts";
        } else {
          throw new Error("Path doesn't seem to be a .ts or .vue file.");
        }

        // TODO: pass the encoding as a CLI argument.
        const rwOptions = { encoding: "utf-8" as const };
        const code = fs.readFileSync(path, rwOptions);
        try {
          fs.writeFileSync(path, declassify(project, code, mode), rwOptions);
          console.log(`Successfully declassified ${path}!`);
        } catch (e) {
          console.error(`declassify: There was an error processing ${path}`, e);
        }
      });
    });
  })
  .parse(process.argv);
