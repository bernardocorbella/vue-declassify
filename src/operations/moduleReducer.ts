import { StoreAction, StoreGetter, StoreMutation } from "./interface";

export function moduleReducer(itemKey: string, resultKey: string) {
  return (acc: Record<string, any>, item: StoreGetter | StoreAction | StoreMutation) => {
    const result = item[itemKey] === item.identifier ? item[itemKey] : { [item.identifier]: item[itemKey] };
    if (acc.hasOwnProperty(item.module)) {
      acc[item.module][resultKey].push(result);
    } else {
      acc[item.module] = {
        [resultKey]: [result],
      };
    }
    return acc;
  };
}
