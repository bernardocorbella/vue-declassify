import * as ts from "ts-morph";
import { writeWatch } from "./writeWatch";

export function writeWatches(
  writer: ts.CodeBlockWriter,
  watches: {
    path: string;
    method: string;
    immediate?: string;
    deep?: string;
  }[]
) {
  if (watches.length > 0) {
    writer
      .write("watch:")
      .space()
      .write("{")
      .newLine()
      .withIndentationLevel(1, () => {
        for (const watch of watches) {
          writeWatch(writer, watch);
        }
      })
      .writeLine("},");
  }
}
