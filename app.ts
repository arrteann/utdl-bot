require("dotenv").config();

import mongoose from "mongoose";
import { Context, Markup, Telegraf } from "telegraf";
import UsersController from "./controller/users.ctrl";

const userCtrl = new UsersController();

const bot = new Telegraf(process.env.BOT_TOKEN || "");

bot.start(userCtrl.startBot);

mongoose
  .connect("mongodb://127.0.0.1:27017/", {})
  .then(() => {
    bot
      .launch()
      .then(() => {
        console.log("Connected Successfuly :)");
      })
      .catch((e) => console.log("Error %d", e));
  })
  .catch((err) => console.log(err));
