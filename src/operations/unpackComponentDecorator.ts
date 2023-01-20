import { Decorator, ObjectLiteralExpression } from "ts-morph";

export function unpackComponentDecorator(decorator: Decorator) {
  const decoratorArguments = decorator.getArguments();

  if (decoratorArguments.length > 0) {
    const initialDecoratorArgument = decoratorArguments[0];

    if (!(initialDecoratorArgument instanceof ObjectLiteralExpression)) {
      throw new Error("The first argument to @Component is not an object literal.");
    }

    return {
      properties: initialDecoratorArgument.getProperties(),
    };
  }

  return {
    properties: [],
  };
}
