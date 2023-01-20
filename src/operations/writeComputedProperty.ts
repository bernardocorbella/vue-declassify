import * as ts from "ts-morph";
import { writeDocs } from "./writeDocs";

export function writeComputedProperty(
  writer: ts.CodeBlockWriter,
  name: string,
  getter: ts.GetAccessorDeclaration,
  setter: ts.SetAccessorDeclaration
) {
  writer
    .write(name)
    .write(":")
    .space()
    .write("{")
    .newLine()
    .withIndentationLevel(1, () => {
      const setParameter = setter.getParameters()[0];

      if (!setParameter) {
        throw new Error("Computed setter doesn't seem to have a parameter.");
      }

      writeDocs(writer, getter.getJsDocs());
      writer
        .write(`get()`)
        .write(":")
        .space()
        // Computed property getters need to match the setter's return type,
        // But there's actually a variety of places this can be obtained...
        // try them all before giving up with `any`.
        .write(getter.getReturnTypeNode()?.getText() || setParameter.getTypeNode()?.getText() || "any")
        .newLine()
        .write(getter.getBodyOrThrow().getText())
        .write(",")
        .newLine();

      writeDocs(writer, setter.getJsDocs());
      writer
        .write("set(")
        .write(setParameter.getText())
        .write(")")
        .newLine()
        .write(setter.getBodyOrThrow().getText())
        .write(",")
        .newLine();
    })
    .writeLine("},");
}
