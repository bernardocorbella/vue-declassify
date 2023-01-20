import * as ts from "ts-morph";

export function writeConfig(
  writer: ts.CodeBlockWriter,
  decorator: {
    properties: ts.ObjectLiteralElementLike[];
  }
) {
  if (decorator.properties.length > 0) {
    for (const property of decorator.properties) {
      writer.write(property.getText());
    }

    writer.write(",").newLine();
  }
}
