import { Context } from "telegraf";

export interface SessionData {
  isWaitingForLink: Boolean;
}

export interface MyContext extends Context {
  session?: SessionData;
}
