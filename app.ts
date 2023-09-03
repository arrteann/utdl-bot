require("dotenv").config();

import mongoose from "mongoose";
import { Telegraf, session } from "telegraf";
import UsersController from "./controller/users.ctrl";
import { DownloaderUtils } from "./utils/downloader";
import { MyContext } from "./interfaces";

const userCtrl = new UsersController();

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN || "");

bot.use(session());

bot.start(userCtrl.startBot);

bot.command("download", (ctx: MyContext) => {
  ctx.reply("send me your link :D");
  ctx.session ??= { isWaitingForLink: true };
});

bot.on("text", async (ctx: MyContext) => {
  if (ctx.session?.isWaitingForLink) {
    ctx.session ??= { isWaitingForLink: false };

    const { text }: any = ctx.message;

    

    const dlMsg = await ctx.reply("Download...");

    await DownloaderUtils.mp3(text).then(async (val) => {
      ctx.deleteMessage(dlMsg.message_id);
      console.log();
      const path = val?.toString();
      
      const id = await ctx.replyWithAudio(
        {
          source: path,
        },
        {
          caption: "Please forward it, i will be deleted after 30 seconds",
        }
      );

      setTimeout(() => {
        ctx.deleteMessage(id.message_id);
      }, 30000);
    });
  }
});

bot.action("delete", (ctx) => ctx.deleteMessage());
bot.telegram.setMyCommands([
  {
    command: "/download",
    description: "Send the Youtube link to download it in MP3",
  },
  {
    command: "/history",
    description: "Show all your downloads",
  },
]);

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
