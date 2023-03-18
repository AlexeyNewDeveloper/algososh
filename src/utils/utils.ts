export const swap = (
  arr: Array<any>,
  firstIndex: number,
  secondIndex: number
): any => {
  if (firstIndex >= 1 && secondIndex < arr.length) {
    arr[firstIndex - 1].changing = false;
    arr[secondIndex + 1].changing = false;
    arr[firstIndex - 1].modified = true;
    arr[secondIndex + 1].modified = true;
  }
  arr[firstIndex].changing = true;
  arr[secondIndex].changing = true;
  const temp = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = temp;
  return arr;
};
