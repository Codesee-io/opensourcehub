export default function debouncePromise(fn: Function, timeMS: number) {
  let timerId: NodeJS.Timeout | undefined = undefined;

  return function debounced(...args: any[]) {
    if (timerId) {
      clearTimeout(timerId);
    }

    return new Promise((resolve) => {
      timerId = setTimeout(() => resolve(fn(...args)), timeMS);
    });
  };
}
