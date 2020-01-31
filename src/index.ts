import express from 'express';

const MAX_NUMBERS = 42;
const PORT = 3000;

const app = express();

app.post('/eurojackpot', (req, res) => {
  return res.send({
    ok: "true",
    message: generateResponse(7)
  });
});

function generateResponse(amount: number): string {
  const selectedNumbers: number[] = [];
  do {
    const nextNumber: number = Math.ceil(Math.random() * MAX_NUMBERS) + 1;
    if (selectedNumbers.indexOf(nextNumber) === -1) {
      selectedNumbers.push(nextNumber);
    }
  } while (selectedNumbers.length < amount);

  return `Probably the winning numbers: ${selectedNumbers.join(" - ")}`;
}

app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`Example app listening on port ${PORT}!`);
});