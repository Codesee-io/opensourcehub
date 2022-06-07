export function validateDateString(date?: string) {
  if (typeof date !== "string" || isNaN(Date.parse(date))) {
    return "Please provide a valid date";
  }
  return null;
}

type StringValidationOptions = {
  minLength?: number;
};

export function validateString(
  text?: string,
  options: StringValidationOptions = {}
) {
  if (typeof text !== "string") {
    return "Please fill out this field";
  }

  if (options.minLength && text.trim().length < options.minLength) {
    return `Please write at least ${options.minLength} characters`;
  }

  return null;
}
