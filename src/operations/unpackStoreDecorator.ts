import { Decorator, StringLiteral } from "ts-morph";

export function unpackStoreDecorator(decorator: Decorator) {
  const decoratorArguments = decorator.getArguments();

  if (decoratorArguments.length !== 1) {
    throw new Error(`unpackGetterDecorator: Found more than 1 decorator argument`);
  }

  if (!(decoratorArguments[0] instanceof StringLiteral)) {
    throw new Error(`unpackGetterDecorator: First decorator argument isn't a string literal: ${decoratorArguments[0]}`);
  }
  const argument = decoratorArguments[0] as StringLiteral;

  return argument.getLiteralText().split("/");
}
