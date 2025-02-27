const canvas = document.createElement("canvas");

export const getTextWidth = (text: string, font: string) => {
  // re-use canvas object for better performance
  const context = canvas.getContext("2d");
  if (context) {
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }
  return undefined;
};

const getCssStyle = (el: Element, prop: string) => {
  return window.getComputedStyle(el, null).getPropertyValue(prop);
};

export const getCanvasFont = (el: HTMLElement = document.body) => {
  const fontWeight = getCssStyle(el, "font-weight") || "normal";
  const fontSize = getCssStyle(el, "font-size") || "16px";
  const fontFamily = getCssStyle(el, "font-family") || "Times New Roman";
  return `${fontWeight} ${fontSize} ${fontFamily}`;
};
