export const base64ToDoubleArray = (base64: string) => {
  const binaryString = window.atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const doubleArray = new Float64Array(bytes.buffer);
  return doubleArray;
};

export const base64ToDouble = (base64: string) => {
  return base64ToDoubleArray(base64)[0];
};

export const convertToNumbers = (input: Float64Array): Float64Array =>
  input.map((d: number) => {
    const n = 1.79e300;
    return isNaN(d) || d < -n ? -n : d > n ? n : d;
  });
