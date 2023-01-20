import { Decorator, ObjectLiteralExpression, PropertyAssignment, StringLiteral } from "ts-morph";

export function unpackWatchDecorator(decorator: Decorator) {
  const decoratorArguments = decorator.getArguments();

  if (decoratorArguments.length === 0) {
    throw new Error("@Watch does not at least its first argument.");
  }

  const watchPathArgument = decoratorArguments[0];

  if (!(watchPathArgument instanceof StringLiteral)) {
    throw new Error("The first argument to @Watch is not a string literal.");
  }

  const configuration: {
    path: string;
    deep?: string;
    immediate?: string;
  } = {
    path: watchPathArgument.getLiteralValue(),
  };

  if (decoratorArguments.length > 1) {
    const watchOptionsArgument = decoratorArguments[1];

    if (!(watchOptionsArgument instanceof ObjectLiteralExpression)) {
      throw new Error("The second argument to @Watch is not an object literal.");
    }

    const deepProperty = watchOptionsArgument.getProperty("deep");

    if (deepProperty) {
      if (!(deepProperty instanceof PropertyAssignment)) {
        throw new Error("The `deep` property to @Watch is not a property assignment.");
      }

      configuration.deep = deepProperty.getText();
    }

    const immediateProperty = watchOptionsArgument.getProperty("immediate");

    if (immediateProperty) {
      if (!(immediateProperty instanceof PropertyAssignment)) {
        throw new Error("The `immediate` property to @Watch is not a property assignment.");
      }

      configuration.immediate = immediateProperty.getText();
    }
  }

  return configuration;
}
