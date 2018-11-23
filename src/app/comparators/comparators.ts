export function compareByKeyInc(a: any, b: any) {
  if (a.key < b.key) {
    return -1;
  }
  if (a.key > b.key) {
    return 1;
  }
  return 0;
}

export function compareByKeyDec(a: any, b: any) {
  if (b.key < a.key) {
    return -1;
  }
  if (b.key > a.key) {
    return 1;
  }
  return 0;
}

export function compareByValueInc(a: any, b: any) {
  return a.value - b.value;
}

export function compareByValueDec(a: any, b: any) {
  return b.value - a.value;
}
