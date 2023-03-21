export const swap = (
  arr: Array<any>,
  firstIndex: number,
  secondIndex: number
): any[] => {
  const temp = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = temp;
  return arr;
};
