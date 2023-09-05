import { Context } from "telegraf";

export interface SessionData {
  isWaitingForLink?: Boolean;
  isWaitingForType?: Boolean;
  url?: string;
  title?: string;
}

export interface MyContext extends Context {
  session?: SessionData;
}

export interface MyContextUpdate extends MyContext {
  // call
  callback_query: {
    data?: String;
  };
}
