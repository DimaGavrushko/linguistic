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

export function compareByFrequencyDec(a: any, b: any) {
  if (b.frequency < a.frequency) {
    return -1;
  }
  if (b.frequency > a.frequency) {
    return 1;
  }
  return 0;
}

export function compareByFrequencyInc(a: any, b: any) {
  if (a.frequency < b.frequency) {
    return -1;
  }
  if (a.frequency > b.frequency) {
    return 1;
  }
  return 0;
}

export function compareByWordTagInc(a: any, b: any) {
  if (a.wordTag < b.wordTag) {
    return -1;
  }
  if (a.wordTag > b.wordTag) {
    return 1;
  }
  return 0;
}

export function compareByWordTagDec(a: any, b: any) {
  if (b.wordTag < a.wordTag) {
    return -1;
  }
  if (b.wordTag > a.wordTag) {
    return 1;
  }
  return 0;
}
