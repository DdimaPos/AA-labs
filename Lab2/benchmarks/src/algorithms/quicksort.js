function partition(items, leftIndex, rightIndex) {
  const pivotIndex = Math.floor((leftIndex + rightIndex) / 2);

  while (leftIndex <= rightIndex) {
    while (items[leftIndex] < items[pivotIndex]) {
      leftIndex++;
    }

    while (items[rightIndex] > items[pivotIndex]) {
      rightIndex--;
    }

    if (leftIndex <= rightIndex) {
      [items[leftIndex], items[rightIndex]] = [items[rightIndex], items[leftIndex]];
      leftIndex++;
      rightIndex--;
    }
  }

  return leftIndex;
}
function quickSort(items, leftIndex, rightIndex) {
  leftIndex = leftIndex || 0;
  rightIndex = rightIndex || items.length - 1;

  const pivotIndex = partition(items, leftIndex, rightIndex);

  if (leftIndex < pivotIndex - 1) {
    quickSort(items, leftIndex, pivotIndex - 1)
  }

  if (rightIndex > pivotIndex) {
    quickSort(items, pivotIndex, rightIndex)
  }

  return items
}

export function quickSortWrapper(array){
  return quickSort(array, 0, array.length-1)
}
