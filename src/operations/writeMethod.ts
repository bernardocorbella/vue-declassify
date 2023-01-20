import * as ts from "ts-morph";
import { writeDocs } from "./writeDocs";

export function writeMethod(writer: ts.CodeBlockWriter, method: ts.MethodDeclaration) {
  writeDocs(writer, method.getJsDocs());
  writer.write(method.getText().replace("private ", "")).write(",").newLine();
}
