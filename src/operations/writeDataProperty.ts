import * as ts from "ts-morph";
import { writeDocs } from "./writeDocs";

export function writeDataProperty(writer: ts.CodeBlockWriter, property: ts.PropertyDeclaration) {
  writeDocs(writer, property.getJsDocs());
  writer.write(property.getName()).write(":").space().write(property.getInitializerOrThrow().getText());

  const type = property.getTypeNode();

  if (type) {
    writer.space().write("as").space().write(type.getText());
  }

  writer.write(",").newLine();
}
