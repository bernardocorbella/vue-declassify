export function moduleLineReducer(acc: string[], item: string | Record<string, any>) {
  if (typeof item === "string") {
    acc.push(`'${item}'`);
  } else {
    const [key, value] = Object.entries(item)[0];
    acc.push(`{ ${key}: '${value}' }`);
  }
  return acc;
}
