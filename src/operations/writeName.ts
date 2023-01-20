import * as ts from "ts-morph";

export function writeName(writer: ts.CodeBlockWriter, declaration: ts.ClassDeclaration) {
  writer.write("name:").space().quote().write(declaration.getNameOrThrow()).quote().write(",").newLine();
}
