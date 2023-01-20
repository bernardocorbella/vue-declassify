import * as ts from "ts-morph";
import { moduleLineReducer } from "./moduleLineReducer";

export function writeMethodsMapActions(
  writer: ts.CodeBlockWriter,
  { module, actions }: { module: string; actions: string[] | Record<string, any> }
) {
  const actionsLine = actions.reduce(moduleLineReducer, []);
  writer.writeLine(`...mapActions('${module}', [${actionsLine}]),`);
}
