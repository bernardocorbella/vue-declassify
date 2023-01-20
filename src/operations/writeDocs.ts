import * as ts from "ts-morph";

export function writeDocs(writer: ts.CodeBlockWriter, docs: ts.JSDoc[]) {
  for (const doc of docs) {
    writer.writeLine("/**");

    for (const line of doc.getInnerText().split("\n")) {
      writer.write(" *").conditionalWrite(!!line.trim(), " ").write(line).newLine();
    }

    writer.writeLine(" */");
  }
}
