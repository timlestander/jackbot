import moment from 'moment';
import { LotteryRow } from '../database';
import { generateNumbers } from '../utils/generateNumbers';
import { Response } from 'express';

export async function commandGo(response: Response, team: string) {
  let lotteryRow = await LotteryRow.findOne({
    team_id: team,
    week: moment().isoWeek(),
  });
  if (!lotteryRow) {
    lotteryRow = await LotteryRow.create({
      team_id: team,
      week: moment().isoWeek(),
      row: `Extremely likely winning row: ${generateNumbers(
        5,
        50
      )} with bonus digits ${generateNumbers(2, 10)}`,
    });
  }

  return response.status(200).send({
    response_type: 'in_channel',
    text: lotteryRow.row,
  });
}
