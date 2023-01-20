import * as ts from "ts-morph";
import { writeDocs } from "./writeDocs";
import { PostprocessCallback } from "./interface";
import { writePropOptions } from "./writePropOptions";
import { writePropType } from "./writePropType";

export function writeProp(
  writer: ts.CodeBlockWriter,
  prop: {
    declaration: ts.PropertyDeclaration;
    required?: ts.PropertyAssignment;
    default?: ts.PropertyAssignment;
  }
): PostprocessCallback[] {
  const callbacks: PostprocessCallback[] = [];
  writeDocs(writer, prop.declaration.getJsDocs());

  writer
    .write(`${prop.declaration.getName()}:`)
    .space()
    .write("{")
    .withIndentationLevel(1, () => {
      callbacks.push(...writePropType(writer, prop.declaration));
      writePropOptions(writer, prop);
    })
    .writeLine("},");

  return callbacks;
}
