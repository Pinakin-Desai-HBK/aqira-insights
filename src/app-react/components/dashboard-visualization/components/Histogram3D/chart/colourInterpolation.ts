export const DefaultColorBand = [
  "#ff0101",
  "#ff6f01",
  "#ffe101",
  "#aaff01",
  "#3cff01",
  "#01ff38",
  "#01ffaa",
  "#01e6ff",
  "#0173ff",
  "#0101ff"
].reverse();

export const getGradient = (colors: string[], gradientRange: number) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not found");
  const grd = ctx.createLinearGradient(0, 0, gradientRange, 1);
  colors.forEach((color, i) => {
    grd.addColorStop(i / (colors.length - 1), color);
  });
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, gradientRange, 1);
  return ctx.getImageData(0, 0, gradientRange, 1);
};

export const getColorFromGradient = (val: number, max: number, gradient: ImageData, gradientRange: number) => {
  const index = Math.floor((val / max) * (gradientRange - 1));
  const data = gradient.data.slice(index * 4, index * 4 + 4);
  return data;
};
