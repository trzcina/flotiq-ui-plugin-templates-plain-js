import { getRelationData } from "../../common/api-helpers";
import {
  addElementToCache,
  getCachedElement,
} from "../../common/plugin-element-cache";

const textColors = [
  "rgb(255 92 255)",
];

export function handleGridPlugin(
  { accessor, contentObject, inputType, data },
  client,
  pluginInfo,
) {
  if (!["text", "number", "datasource"].includes(inputType)) return;

  const cacheKey = `${pluginInfo.id}-${contentObject.id}-${accessor}`;

  let element = getCachedElement(cacheKey)?.element;
  if (!element) {
    element = document.createElement("div");
    element.classList.add("plugin-name-cell-renderer");
    if (inputType === "text") {
      const textColor = 'red';
      element.style.color = textColor;
      element.textContent = data;
    } else if (inputType === "number") {
      element.style.fontWeight = 900;
      element.textContent = data;
    } else {
      if (data)
        Promise.all(
          data.map((relation) =>
            getRelationData(client, relation.dataUrl).then(
              (data) =>
                data.internal?.objectTitle ||
                data.title ||
                data.name ||
                data.id,
            ),
          ),
        ).then((resultArray) => {
          const joinedData = (resultArray || []).filter((r) => !!r).join(", ");
          element.textContent = joinedData;
        });
    }
  }

  addElementToCache(element, cacheKey);

  return element;
}
