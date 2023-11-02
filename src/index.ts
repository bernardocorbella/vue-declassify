import { Project } from "ts-morph";

import * as imports from "./operations/imports";
import * as classToObject from "./operations/classToObject";

export function declassify(
  project: Project,
  code: string,
  mode: "ts" | "vue",
): string {
  switch (mode) {
    case "vue":
      return declassifyVue(project, code);

    case "ts":
      return declassifyTypeScript(project, code);
  }
}

function extractTsCode(code: string): string {
  const match = code.match(/<script[^>]*>\s*(?<code>.*)<\/script>/s);

  if (!match || !match.groups) {
    throw new Error(`extractTsCode: provided string has no <script> tag.`);
  }

  return match.groups["code"];
}

function declassifyVue(project: Project, code: string) {
  const tsCode = extractTsCode(code);

  return code.replace(tsCode, declassifyTypeScript(project, tsCode));
}

function declassifyTypeScript(project: Project, code: string) {
  const importsToRemove = [
    "vue-class-component",
    "vue-property-decorator",
    "vuex-class",
  ];
  const source = project.createSourceFile("test.ts", code, {
    overwrite: true,
  });
  let shouldDeclassify = false;

  for (const i of importsToRemove) {
    if (imports.find(source, i) !== undefined) {
      shouldDeclassify = true;
      break;
    }
  }

  if (!shouldDeclassify) {
    console.log("Skipping file");
    return source.getFullText();
  }

  imports.remove(source, ...importsToRemove);
  imports.ensure(source, "vue", {
    named: ["defineComponent"],
  });
  classToObject.classToObject(source);
  return source.getFullText();
}
