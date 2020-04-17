import { Response } from 'express';
import axios from 'axios';
import { ResultInterface } from './result';
import { RESULT_API_URL } from '../const';
import { EURO_IN_SEK } from '../const';

export async function commandJackpot(response: Response) {
  const jackpot: number = await getJackpot();
  return response.status(200).send({
    response_type: 'in_channel',
    text: `Jackpotten för nästa dragning är ish ${jackpot} millar (eurokurs ${EURO_IN_SEK})`,
  });
}

function getJackpot(): Promise<number> {
  return axios.get(RESULT_API_URL).then((response: any) => {
    const result: ResultInterface = response.data;
    return parseInt(result.next.jackpot, 10) * EURO_IN_SEK;
  });
}
