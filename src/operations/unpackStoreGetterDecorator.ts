import { Decorator } from "ts-morph";
import { unpackStoreDecorator } from "./unpackStoreDecorator";

export function unpackStoreGetterDecorator(decorator: Decorator) {
  const [module, getter] = unpackStoreDecorator(decorator);
  const configuration = {
    module,
    getter,
  };

  return configuration;
}
