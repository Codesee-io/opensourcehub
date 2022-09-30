/**
 * Use this function to extract field values from a RepeatableTextFields
 * component. Returns a string array.
 */
export function getRepeatableFieldValues(name: string, formData: FormData) {
  const values: string[] = [];
  let index = 0;
  do {
    const url = formData.get(`${name}_${index}`)?.toString();
    if (url != null && url.trim().length > 0) {
      values.push(url);
      index++;
    } else {
      index = -1;
    }
  } while (index !== -1);

  return values;
}
