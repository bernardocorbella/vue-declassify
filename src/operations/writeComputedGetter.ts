import * as ts from "ts-morph";
import { writeDocs } from "./writeDocs";

export function writeComputedGetter(writer: ts.CodeBlockWriter, getter: ts.GetAccessorDeclaration) {
  writeDocs(writer, getter.getJsDocs());
  writer
    .write(`${getter.getName()}():`)
    .space()
    .write(getter.getReturnTypeNode()?.getText() || "any")
    .newLine()
    .write(getter.getBodyOrThrow().getText())
    .write(",")
    .newLine();
}
