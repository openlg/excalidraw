function recursionJsonKeyAndValue(obj, process) {
  if (Array.isArray(obj)) {
    obj.forEach(item => {
      recursionJsonKeyAndValue(item, process);
    });
  } else if (typeof obj === "object") {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === "object") {
        recursionJsonKeyAndValue(value, process);
      } else if (typeof value === "string") {
        const modifyValue = process(key, value);
        if (modifyValue) {
          obj[key] = modifyValue;
        }
      }
    }
  }
}

export function transformLocales(code, id) {
  if (id && id.endsWith(".json")) {
    const lang = JSON.parse(code);
    recursionJsonKeyAndValue(lang, (key, value) => {
      if (typeof value === "string" && value.match(/excalidraw/i)) {
        value = value.replaceAll("Excalidraw", "Ideadraw");
        value = value.replaceAll("excalidraw", "Ideadraw");
        value = value.replaceAll("ExcaliDraw", "Ideadraw");
      }
      return value;
    });
    return JSON.stringify(lang, "  ", "  ");
  }
  return code;
}

export function transformTsx(code, id) {
  if (id && id.endsWith("ExportToExcalidrawPlus.tsx")) {
    code = code.replaceAll("<h2>Excalidraw+</h2>", "<h2>Ideadraw+</h2>");
  }
  if (id && /className=".*virgil.*">/.test(code)) {
    const iterator = code.matchAll(/className=".*virgil.*">/g);
    let result = iterator.next();
    const replaceMap = {};
    while (!result.done) {
      replaceMap[result.value[0]] = result.value[0].replace(
        "virgil",
        "virgil XinYeNianTi",
      );
      result = iterator.next();
    }
    for (const key in replaceMap) {
      code = code.replaceAll(key, replaceMap[key]);
    }
  }
  return code;
}

export default function transform(code, id) {
  if (id.indexOf("locales") >= 0 && id.endsWith(".json")) {
    return {
      code: transformLocales(code, id),
      map: null,
    };
  }
  if (id.endsWith(".tsx") >= 0) {
    return {
      code: transformTsx(code, id),
      map: null,
    };
  }
}
