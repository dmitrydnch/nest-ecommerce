export function exclude(object: any, fields: string[]) {
  for (const key of fields) {
    delete object[key];
  }
  return object;
}
