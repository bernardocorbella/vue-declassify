import { Decorator, StringLiteral } from "ts-morph";
import { unpackPropDecorator } from "./unpackPropDecorator";

export function unpackPropSyncDecorator(decorator: Decorator) {
  const decoratorArguments = decorator.getArguments();

  if (decoratorArguments.length === 0) {
    throw new Error("@PropSync does not have at least its first argument.");
  }

  const syncPathArgument = decoratorArguments[0];

  if (!(syncPathArgument instanceof StringLiteral)) {
    throw new Error("The first argument to @PropSync is not a string literal.");
  }

  return {
    sync: syncPathArgument.getLiteralValue(),
    ...unpackPropDecorator(decorator, 1),
  };
}
