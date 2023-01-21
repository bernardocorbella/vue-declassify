import * as ts from "ts-morph";

export function writeWatch(
  writer: ts.CodeBlockWriter,
  watch: {
    path: string;
    method: string;
    immediate?: string;
    deep?: string;
  }
) {
  writer
    .quote()
    .write(watch.path)
    .quote()
    .write(":")
    .space()
    .write("{")
    .newLine()
    .withIndentationLevel(1, () => {
      writer.write("handler:").space().write(`'${watch.method}'`).write(",").newLine();

      if (watch.immediate) {
        writer.write(watch.immediate).write(",").newLine();
      }

      if (watch.deep) {
        writer.write(watch.deep).write(",").newLine();
      }
    })
    .writeLine("},");
}
