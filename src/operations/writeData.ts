import * as ts from "ts-morph";
import { writeDataProperty } from "./writeDataProperty";

export function writeData(writer: ts.CodeBlockWriter, data: ts.PropertyDeclaration[]) {
  const dataWithoutRefs = data.filter((datum) => {
    if (datum.getStructure().name === "$refs") {
      return false;
    }
    return true;
  });

  if (dataWithoutRefs.length > 0) {
    writer
      .writeLine("data()")
      .space()
      .write("{")
      .newLine()
      .withIndentationLevel(1, () => {
        writer.writeLine("return {");

        for (const property of dataWithoutRefs) {
          writeDataProperty(writer, property);
        }

        writer.writeLine("};");
      })
      .writeLine("},");
  }
}
