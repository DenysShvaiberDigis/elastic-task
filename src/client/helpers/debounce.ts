const debounce = (callback: Function, duration: number) => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, duration)
  }
}

export default debounce;