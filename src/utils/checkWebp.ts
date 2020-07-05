let result: null | boolean = null;
export const checkWebp = function () {
  if (result !== null) {
    return result;
  }
  try {
    result =
      document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    return result;
  } catch (err) {
    result = false;
    return result;
  }
};
