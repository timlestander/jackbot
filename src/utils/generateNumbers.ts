export function generateNumbers(amount: number, highest: number): string {
  if (amount > highest) {
    amount = highest;
  } else if (amount < 1) {
    amount = 1;
  }

  const selectedNumbers: number[] = [];

  do {
    const nextNumber: number = Math.floor(Math.random() * highest) + 1;
    if (selectedNumbers.indexOf(nextNumber) === -1) {
      selectedNumbers.push(nextNumber);
    }
  } while (selectedNumbers.length < amount);

  return selectedNumbers.join(' - ');
}
