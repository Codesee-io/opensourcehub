export function deleteEmptyFields<T>(thing: T): Partial<T> {
  const withoutEmptyFields: Partial<T> = {};
  Object.keys(thing).forEach((key) => {
    if (thing[key as keyof T] != null) {
      withoutEmptyFields[key as keyof T] = thing[key as keyof T];
    }
  });

  return withoutEmptyFields;
}
