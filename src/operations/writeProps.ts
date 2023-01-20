import * as ts from "ts-morph";
import { PostprocessCallback } from "./interface";
import { writeProp } from "./writeProp";

export function writeProps(
  writer: ts.CodeBlockWriter,
  props: {
    declaration: ts.PropertyDeclaration;
    required?: ts.PropertyAssignment;
    default?: ts.PropertyAssignment;
  }[]
): PostprocessCallback[] {
  const callbacks: PostprocessCallback[] = [];

  if (props.length > 0) {
    writer
      .write("props:")
      .space()
      .write("{")
      .newLine()
      .withIndentationLevel(1, () => {
        for (let prop of props) {
          callbacks.push(...writeProp(writer, prop));
        }
      })
      .writeLine("},");
  }

  return callbacks;
}
