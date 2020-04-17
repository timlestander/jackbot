import { Response } from 'express';
import { formatCustomInput } from '../formatCustomInput';

export async function commandChoose(response: Response, team: string) {
  return response.status(200).send({
    response_type: 'ephemeral',
    ...formatCustomInput(),
  });
}
