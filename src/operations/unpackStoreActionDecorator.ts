import { Decorator } from "ts-morph";
import { unpackStoreDecorator } from "./unpackStoreDecorator";

export function unpackStoreActionDecorator(decorator: Decorator) {
  const [module, action] = unpackStoreDecorator(decorator);
  const configuration = {
    module,
    action,
  };
  return configuration;
}
