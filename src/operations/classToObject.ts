import * as ts from "ts-morph";
import * as extract from "./extract";
import { writeDocs } from "./writeDocs";
import { writeName } from "./writeName";
import { writeConfig } from "./writeConfig";
import { writeProps } from "./writeProps";
import { writeData } from "./writeData";
import { writeComputed } from "./writeComputed";
import { writeMethods } from "./writeMethods";
import { writeWatches } from "./writeWatches";
import { PostprocessCallback } from "./interface";

export function classToObject(source: ts.SourceFile) {
  const vue = extract.extract(source);

  if (!vue) {
    return;
  }

  const {
    declaration,
    decorator,
    props,
    data,
    computed,
    methods,
    watches,
    storeGetters,
    storeActions,
    storeMutations,
  } = vue;

  const callbacks: PostprocessCallback[] = [(source) => source.formatText()];

  source.addExportAssignment({
    leadingTrivia: (writer) => {
      writeDocs(writer, declaration.getJsDocs());
    },
    expression: (writer) => {
      writer
        .writeLine("Vue.extend({")
        .withIndentationLevel(1, () => {
          writeName(writer, declaration);
          writeConfig(writer, decorator);
          callbacks.push(...writeProps(writer, props));
          writeData(writer, data);
          callbacks.push(...writeComputed(writer, computed, storeGetters));
          writeWatches(writer, watches);
          callbacks.push(...writeMethods(writer, methods, storeActions, storeMutations));
        })
        .write("})");
    },
    isExportEquals: false,
  });

  // Perform any processing that had to happen after we finished writing.
  for (const callback of callbacks.reverse()) {
    callback(source);
  }

  // Remove the class now that we're done reading everything.
  vue.declaration.remove();
}
