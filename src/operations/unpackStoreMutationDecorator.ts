import { Decorator } from "ts-morph";
import { unpackStoreDecorator } from "./unpackStoreDecorator";

export function unpackStoreMutationDecorator(decorator: Decorator) {
  const [module, mutation] = unpackStoreDecorator(decorator);
  const configuration = {
    module,
    mutation,
  };

  return configuration;
}
