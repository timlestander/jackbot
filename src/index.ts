import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import schedule from 'node-schedule';

schedule.scheduleJob("0 5 * * 6", () => {
  lotteryMap.clear();
})

const RESULT_API_URL: string = "https://www.lottoland.com/api/drawings/euroJackpot";
const EURO_IN_SEK: number = 10.59;

const app = express();

const lotteryMap: Map<string, string> = new Map<string, string>();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/eurojackpot', async (req: any, res: any) => {
  const command: string = req.body.text ? req.body.text : 'help';
  const team: string = req.body.team_id;

  if (command === 'go') {
    if (!lotteryMap.has(team)) {
      lotteryMap.set(team, `Trolig vinstrad: ${generateNumbers(5, 50)} med bonusnummer ${generateNumbers(2, 10)}`);
    }

    return res.status(200).send({
      "response_type": "in_channel",
      "text": lotteryMap.get(team)
    });
  } else if (command === 'result') {
    const resultString: string = await generateResult();
    return res.status(200).send({
      "response_type": "in_channel",
      "text": resultString
    })
  } else if (command === 'jackpot') {
    const jackpot: number = await getJackpot();
    return res.status(200).send({
      "response_type": "in_channel",
      "text": `Jackpotten för nästa dragning är ish ${jackpot} millar (eurokurs ${EURO_IN_SEK})`
    })
  } else {
    return res.status(200).send({
      "response_type": "ephemeral",
      "text": "Available commands are /jackbot go | result | jackpot"
    })
  }
});

function generateNumbers(amount: number, highest: number): string {
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

  return selectedNumbers.join(" - ");
}

function generateResult(): Promise<string> {
  return axios.get(RESULT_API_URL).then((response: any) => {
    const result: ResultInterface = response.data;
    const { day, month, year } = result.last.date;
    return `Resultat för dragningen ${pad(year)}-${pad(month)}-${pad(day)}\n${result.last.numbers.join(" - ")} med bonusnummer ${result.last.euroNumbers.join(" - ")}`;
  });
}

function getJackpot(): Promise<number> {
  return axios.get(RESULT_API_URL).then((response: any) => {
    const result: ResultInterface = response.data;
    return parseInt(result.next.jackpot, 10) * EURO_IN_SEK;
  });
}

function pad(num: number): string {
  return num < 10 ? `0${num}` : num.toString();
}

app.listen(process.env.PORT || 4390, () => {
  // tslint:disable-next-line:no-console
  console.log(`Example app listening on port ${process.env.PORT || 4390}!`);
});

interface ResultInterface {
  last: {
    date: {
      day: number;
      month: number;
      year: number;
    },
    numbers: number[],
    euroNumbers: number[]
  },
  next: {
    jackpot: string;
  }
}
