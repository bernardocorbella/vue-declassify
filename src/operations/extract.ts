import { ClassDeclaration, SourceFile } from "ts-morph";
import { unpackClass } from "./unpackClass";
import { unpackComponentDecorator } from "./unpackComponentDecorator";

// Extracts all Vue properties from the Vue class in a source file.
// Mostly responsible for implementing the various decorators.

export function extract(source: SourceFile) {
  const defaultExport = source.getDefaultExportSymbol();

  if (!defaultExport) {
    return;
  }

  const declaration = defaultExport.getValueDeclaration();

  if (!(declaration instanceof ClassDeclaration)) {
    return;
  }

  const decorator = declaration.getDecorator("Component");

  if (!decorator) {
    return;
  }

  return {
    declaration,
    ...unpackClass(declaration),
    decorator: {
      ...unpackComponentDecorator(decorator),
    },
  };
}
