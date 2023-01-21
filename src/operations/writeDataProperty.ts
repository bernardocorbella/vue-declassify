import * as ts from "ts-morph";
import { writeDocs } from "./writeDocs";

export function writeDataProperty(writer: ts.CodeBlockWriter, property: ts.PropertyDeclaration) {
  writeDocs(writer, property.getJsDocs());
  const initializer = property.getInitializer();

  writer
    .write(property.getName())
    .write(":")
    .space()
    .write(initializer?.getText() ?? "undefined");

  const type = property.getTypeNode();

  if (type && initializer) {
    writer.space().write("as").space().write(type.getText());
  }

  writer.write(",").newLine();
}
