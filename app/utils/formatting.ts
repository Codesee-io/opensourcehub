export function pluralize(amount: number, singular: string, plural: string) {
  return amount === 1 ? singular : plural;
}

export function maybeStringToArray(text?: string): string[] {
  if (text && text.length > 0) {
    return text.split(",");
  }
  return [];
}

// Thanks, MDN
export function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} bytes`;
  } else if (size >= 1024 && size < 1048576) {
    return `${(size / 1024).toFixed(1)} KB`;
  } else {
    return `${(size / 1048576).toFixed(1)} MB`;
  }
}
