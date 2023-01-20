import { Decorator, ObjectLiteralExpression, PropertyAssignment } from "ts-morph";

export function unpackPropDecorator(decorator: Decorator, argumentIndex = 0) {
  const configuration: {
    required?: PropertyAssignment;
    default?: PropertyAssignment;
  } = {};

  const decoratorArguments = decorator.getArguments();

  if (decoratorArguments.length > 0) {
    const propOptionsArgument = decoratorArguments[argumentIndex];

    if (!(propOptionsArgument instanceof ObjectLiteralExpression)) {
      throw new Error("The first argument to @Prop is not an object literal.");
    }

    const requiredProperty = propOptionsArgument.getProperty("required");

    if (requiredProperty) {
      if (!(requiredProperty instanceof PropertyAssignment)) {
        throw new Error("The `required` value to @Prop is not a property assignment.");
      }

      configuration.required = requiredProperty;
    }

    const defaultProperty = propOptionsArgument.getProperty("default");

    if (defaultProperty) {
      if (!(defaultProperty instanceof PropertyAssignment)) {
        throw new Error("The `default` value to @Prop is not a property assignment.");
      }

      configuration.default = defaultProperty;
    }
  }

  return configuration;
}
