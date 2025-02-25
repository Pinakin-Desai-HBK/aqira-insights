export const filter = ({ y, closestToZero }: { y: number; closestToZero: number }) =>
  Math.sign(y) * Math.log1p(Math.abs(y / closestToZero));

export const filterReverse = ({ y, closestToZero }: { y: number; closestToZero: number }) =>
  Math.sign(y) * Math.expm1(Math.abs(y)) * closestToZero;
