declare module SlackInteractive {
  export interface User {
    id: string;
    username: string;
    name: string;
    team_id: string;
  }

  export interface Container {
    type: string;
    message_ts: string;
    channel_id: string;
    is_ephemeral: boolean;
  }

  export interface Team {
    id: string;
    domain: string;
  }

  export interface Channel {
    id: string;
    name: string;
  }

  export interface Text {
    type: string;
    text: string;
    emoji: boolean;
  }

  export interface Action {
    action_id: string;
    block_id: string;
    text: Text;
    value: string;
    type: string;
    action_ts: string;
  }

  export interface RootObject {
    type: string;
    user: User;
    api_app_id: string;
    token: string;
    container: Container;
    trigger_id: string;
    team: Team;
    channel: Channel;
    response_url: string;
    actions: Action[];
  }
}
