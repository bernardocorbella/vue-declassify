import * as ts from "ts-morph";
import * as vue_class from "./vue_class";
import * as imports from "./imports";
import { PostprocessCallback, StoreAction, StoreGetter } from "./interface";
import { writeComputedMapGetters } from "./writeComputedMapGetters";
import { writeComputedGetter } from "./writeComputedGetter";
import { writeComputedProperty } from "./writeComputedProperty";
import { moduleReducer } from "./moduleReducer";

export function writeComputed(
  writer: ts.CodeBlockWriter,
  computed: Record<
    string,
    {
      getter?: ts.GetAccessorDeclaration;
      setter?: ts.SetAccessorDeclaration;
    }
  >,
  getters: vue_class.StoreGetter[]
) {
  const callbacks: PostprocessCallback[] = [];
  if (Object.keys(computed).length > 0 || getters.length > 0) {
    writer.write("computed:").space().write("{").newLine();

    const mappedGetters = getters.reduce(moduleReducer("getter", "getters"), {});

    for (const [module, { getters }] of Object.entries(mappedGetters)) {
      writeComputedMapGetters(writer, { module, getters });
    }

    for (const [name, { getter, setter }] of Object.entries(computed)) {
      if (getter) {
        if (!setter) {
          writeComputedGetter(writer, getter);
        } else {
          writeComputedProperty(writer, name, getter, setter);
        }
      }
    }

    writer.writeLine("},");

    if (Object.keys(mappedGetters).length > 0) {
      callbacks.push((source) =>
        imports.ensure(source, "vuex", {
          named: ["mapGetters"],
        })
      );
    }
  }
  return callbacks;
}
