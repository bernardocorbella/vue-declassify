import * as ts from "ts-morph";
import { moduleLineReducer } from "./moduleLineReducer";

export function writeComputedMapGetters(
  writer: ts.CodeBlockWriter,
  { module, getters }: { module: string; getters: string[] | Record<string, any> }
) {
  const gettersLine = getters.reduce(moduleLineReducer, []);
  writer.writeLine(`...mapGetters('${module}', [${gettersLine}]),`);
}
