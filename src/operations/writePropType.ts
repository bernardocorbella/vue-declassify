import * as ts from "ts-morph";
import * as imports from "./imports";
import { PostprocessCallback } from "./interface";

export function writePropType(
  writer: ts.CodeBlockWriter,
  declaration: ts.PropertyDeclaration,
): PostprocessCallback[] {
  const callbacks: PostprocessCallback[] = [];
  const type = declaration.getType();
  writer.write("type: ");

  if (type.isString()) {
    writer.write("String");
  } else if (type.isNumber()) {
    writer.write("Number");
  } else if (type.isBoolean()) {
    writer.write("Boolean");
  } else {
    const actualType = declaration.getTypeNodeOrThrow().getText();

    // Vue.js props can only be primitive types, unless you use PropType.
    // However, even when using PropType, the base annotated type must be
    // the same type as the annotated one, or you get type errors anyway.
    let baseType: "Object" | "Function" | "Array";

    // HACK: Adjust Object/Function/Array based on what the type seems to be.
    // This heuristic can be improved drastically, and is part of what makes
    // a project like vue-declassify difficult.
    if (type.getCallSignatures().length > 0) {
      // This one is actually pretty safe. TS will tell us if what's inside has
      // a call signature, making it a function.
      baseType = "Function";
    } else if (actualType.startsWith("Array<") || actualType.endsWith("[]")) {
      // This is some nonsense calculation but, it's quite effective? Arrays
      // are easy to spot syntactically. This doesn't work for user-defined
      // array types though. Fortunately, those are exceedingly rare.
      baseType = "Array";
    } else {
      baseType = "Object";
    }

    writer.write(`${baseType} as PropType<${actualType}>`);

    // Add PropType to the imports afterwards, since we just used it.
    callbacks.push((source) => {
      imports.ensure(source, "@vue/composition-api", {
        named: ["PropType"],
      });
    });
  }

  writer.write(",").newLine();

  return callbacks;
}
