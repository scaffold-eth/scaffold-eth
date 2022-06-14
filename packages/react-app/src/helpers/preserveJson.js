const context = typeof window === "undefined" ? global : window;
const FLAG_TYPED_ARRAY = "FLAG_TYPED_ARRAY";

/**
 * These are used as little hacks to preserve Uint8Arrays over HTTP body requests.
 *
 * You will call stringify before sending and parse on the receiving end.
 */
export const parse = str => {
  return JSON.parse(str, function (key, value) {
    // the reviver function looks for the typed array flag
    try {
      if ("flag" in value && value.flag === FLAG_TYPED_ARRAY) {
        // if found, we convert it back to a typed array
        // @ts-ignore
        return new context[value.constructor](value.data);
      }
    } catch (e) {}

    // if flag not found no conversion is done
    return value;
  });
};

export const stringify = obj => {
  return JSON.stringify(obj, function (key, value) {
    if (value && value instanceof Uint8Array) {
      var replacement = {
        constructor: value.constructor.name,
        // @ts-ignore
        data: Array.apply([], value),
        flag: FLAG_TYPED_ARRAY,
      };
      return replacement;
    }
    return value;
  });
};
