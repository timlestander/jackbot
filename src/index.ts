// tslint:disable-next-line:no-var-requires
require('dotenv').config();
import express, { Response, Request } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { Commands } from './const';
import { commandGo } from './commands/go';
import { commandResult } from './commands/result';
import { commandJackpot } from './commands/jackpot';
import { commandChoose } from './commands/choose';
import { saveCustomNumber } from './commands/saveCustomNumber';
import { saveCustomBonus } from './commands/saveCustomBonus';

mongoose.connection.on('error', () => {
  // tslint:disable-next-line:no-console
  console.error.bind(console, 'connection error:');
});
mongoose.connection.on('open', () => {
  // tslint:disable-next-line:no-console
  console.log('Connected to database');
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/eurojackpot', async (req: any, res: any) => {
  const command: Commands = req.body.text ? req.body.text : 'help';
  const team: string = req.body.team_id;
  console.log(command);
  switch (command) {
    case Commands.GO:
      return commandGo(res, team);
    case Commands.RESULT:
      return commandResult(res);
    case Commands.JACKPOT:
      return commandJackpot(res);
    case Commands.CHOOSE:
      return commandChoose(res, team);
    case Commands.HELP:
    default:
      return res.status(200).send({
        response_type: 'ephemeral',
        text: `Available commands are /jackbot ${Object.keys(Commands)
          // @ts-ignore
          .map((key) => Commands[key])
          .join(' | ')}`,
      });
  }
});

app.post('/interactive', async (req: Request, res: Response) => {
  const payload = JSON.parse(req.body.payload);
  const actions: SlackInteractive.Action[] = payload.actions;
  const response_url = payload.response_url;
  const team: SlackInteractive.Team = payload.team;
  if (actions.length === 0) {
    return res.send(400);
  }

  const action = actions[0];

  const values = action.value.split(':');
  switch (values[0]) {
    case 'number':
      return saveCustomNumber(res, action, response_url, team.id);
    case 'bonus':
      return saveCustomBonus(res, action, response_url, team.id);
    default:
      return res.send(400);
  }
});

app.listen(process.env.PORT || 4390, () => {
  // tslint:disable-next-line:no-console
  console.log(`Example app listening on port ${process.env.PORT || 4390}!`);
});
