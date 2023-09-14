export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function fakeName() {
  const wordList = ['cat', 'dog', 'tiger', 'shark', 'rhino', 'elephant', 'mouse'];
  const chooseWord = wordList[Math.floor(Math.random() * wordList.length)];
  const randomNumber = Math.floor(Math.random() * 1000 + 1);
  return chooseWord + randomNumber;
}
