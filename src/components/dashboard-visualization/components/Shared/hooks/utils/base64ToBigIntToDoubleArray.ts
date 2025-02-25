export const base64ToBigIntToDoubleArray = (base64: string) => {
  const binaryString = window.atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const bigIntArray = Array.from(new BigInt64Array(bytes.buffer));
  const doubleArray = new Float64Array(bigIntArray.map((x) => Number(x)));
  return doubleArray;
};

export const base64ToBigIntToDouble = (base64: string) => {
  return base64ToBigIntToDoubleArray(base64)[0];
};
