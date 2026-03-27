export function debounce(func, delay, timeoutId, context, searchValue) {
  clearTimeout(timeoutId);
  // Set a new timeout
  const _this_ = getCurrentPages()[getCurrentPages().length - 1]
  const timeout = setTimeout(() => {
    func.call(context, searchValue);
  }, delay);

  _this_.setData({
    timeoutId: timeout
  });
}