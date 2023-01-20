import * as ts from "ts-morph";
import { moduleLineReducer } from "./moduleLineReducer";

export function writeMethodsMapMutations(
  writer: ts.CodeBlockWriter,
  { module, mutations }: { module: string; mutations: string[] | Record<string, any> }
) {
  const mutationsLine = mutations.reduce(moduleLineReducer, []);
  writer.writeLine(`...mapMutations('${module}', [${mutationsLine}]),`);
}
