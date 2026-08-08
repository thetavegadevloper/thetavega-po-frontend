export function getByPath(obj, path) {
  return String(path).split(".").reduce((acc, key) => acc?.[key], obj);
}

export function setByPath(obj, path, value) {
  const copy = structuredClone(obj);
  const keys = String(path).split(".");
  let cursor = copy;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
    } else {
      if (cursor[key] === undefined || cursor[key] === null) {
        cursor[key] = /^\d+$/.test(keys[index + 1]) ? [] : {};
      }
      cursor = cursor[key];
    }
  });
  return copy;
}
