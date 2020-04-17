import moment from 'moment';
import { Response } from 'express';
import { CustomLotteryRow, ICustomLotteryRow } from '../database';
import Axios from 'axios';

export async function saveCustomNumber(
  response: Response,
  action: SlackInteractive.Action,
  response_url: string,
  teamId: string
) {
  let lotteryRow = await CustomLotteryRow.findOne({
    team_id: teamId,
    week: moment().isoWeek(),
  });
  if (lotteryRow) {
    lotteryRow.numbers = [...lotteryRow.numbers, Number(action.text.text)];
    await lotteryRow.save();
  } else {
    lotteryRow = await CustomLotteryRow.create({
      team_id: teamId,
      week: moment().isoWeek(),
      numbers: [action.text.text],
      bonus_numbers: [],
    });
  }
  // Send repsonse async
  Axios.post(response_url, formatCustomLotterRow(lotteryRow), {
    headers: {
      'Content-type': 'application/json',
    },
  });
  return response.send(200);
}

function formatCustomLotterRow(lotteryRow: ICustomLotteryRow) {
  return {
    response_type: 'in_channel',
    delete_original: true,
    // TODO Fix this
    text: `This week jackbot row: \n${new Array(5 || lotteryRow.numbers.length)
      .fill(0)
      .map((i, index) => lotteryRow.numbers[index] || '__')
      .join(' - ')} : ${new Array(2 || lotteryRow.numbers.length)
      .fill(0)
      .map((i, index) => lotteryRow.bonus_numbers[index] || '_')
      .join(' - ')}`,
  };
}
