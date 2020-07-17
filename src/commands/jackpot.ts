import { Response } from 'express';
import axios from 'axios';
import { ResultInterface } from './result';
import { RESULT_API_URL } from '../const';
import { EURO_IN_SEK } from '../const';

function numberWithCommas(x: any) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export async function commandJackpot(response: Response) {
  const jackpot: number = await getJackpotEuro();
  return response.status(200).send({
    response_type: 'in_channel',
    text: `This weeks jackpot is €${numberWithCommas(jackpot)} which is ${(numberWithCommas(jackpot * EURO_IN_SEK))} SEK (using EUR/SEK exchange rate of ${EURO_IN_SEK})`,
  });
}

function getJackpotEuro(): Promise<number> {
  return axios.get(RESULT_API_URL).then((response: any) => {
    const result: ResultInterface = response.data;
    return parseInt(result.next.jackpot, 10) * 1000000;
  });
}
