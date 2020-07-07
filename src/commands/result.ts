import { Response } from 'express';
import axios from 'axios';
import { RESULT_API_URL } from '../const';

export async function commandResult(response: Response) {
  const resultString: string = await generateResult();
  return response.status(200).send({
    response_type: 'in_channel',
    text: resultString,
  });
}

function generateResult(): Promise<string> {
  return axios.get(RESULT_API_URL).then((response: any) => {
    const result: ResultInterface = response.data;
    const { day, month, year } = result.last.date;
    return `Resulting lottery draw for ${pad(year)}-${pad(month)}-${pad(
      day
    )}\n${result.last.numbers.join(
      ' - '
    )} with digits ${result.last.euroNumbers.join(' - ')}`;
  });
}

function pad(num: number): string {
  return num < 10 ? `0${num}` : num.toString();
}

export interface ResultInterface {
  last: {
    date: {
      day: number;
      month: number;
      year: number;
    };
    numbers: number[];
    euroNumbers: number[];
  };
  next: {
    jackpot: string;
  };
}
