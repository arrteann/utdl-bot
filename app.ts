require("dotenv").config();

import mongoose from "mongoose";
import { Telegraf, session } from "telegraf";
import UsersController from "./controller/users.ctrl";
import { YoutubeHelper } from "./helper/youtube";
import { MyContext, MyContextUpdate } from "./interfaces";
import { Filter } from "ytdl-core";
import  fs from "fs";

const userCtrl = new UsersController();

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN || "");

bot.use(session());

bot.start(userCtrl.startBot);

bot.command("download", (ctx: MyContext) => {
  ctx.reply("send me your link :D");
  ctx.session ??= { isWaitingForLink: true, isWaitingForType: false };
});

bot.on("text", async (ctx: MyContext) => {
  const { text }: any | string = ctx.message;

  if (ctx.session?.isWaitingForLink) {
    ctx.session ??= {
      isWaitingForLink: false,
      isWaitingForType: true,
    };

    const isValid = YoutubeHelper.isUrlValid(text);

    if (isValid) {
      const videoInfo = await YoutubeHelper.getInfo(text);
      const title = videoInfo.videoDetails.title;
      const videoID = YoutubeHelper.getID(text);
      // Selection Function

      ctx.replyWithHTML(
        `
      🎶 <b>${videoInfo.videoDetails.title}</b>
<i>Which format do you want? </i>
      `,
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Highest Quality ( Video )",
                  callback_data: String(`highestvideo|${videoID}`),
                },
                {
                  text: "Lowest Quality ( Video )",
                  callback_data: `lowestvideo|${videoID}`,
                },
              ],
              [
                {
                  text: "Highest Quality ( Audio )",
                  callback_data: `highestaudio|${videoID}`,
                },
                {
                  text: "Lowest Quality ( Audio )",
                  callback_data: `lowestaudio|${videoID}`,
                },
              ],
            ],
          },
        }
      );
    } else {
      ctx.reply("Youtube link is not valid!");
    }
  }
});

bot.on("callback_query", async (ctx: MyContext, next) => {
  const { data }: any = ctx.callbackQuery;

  const youtubeID = data.split("|")[1];
  let youtubeUrl = `https://www.youtube.com/watch?v=`;

  if (youtubeID !== null) {
    youtubeUrl += youtubeID;
  } else {
    ctx.reply("Invalid URL!");
    return;
  }

  const { title } = (await YoutubeHelper.getInfo(youtubeUrl)).videoDetails;

  let quality = "";
  let filter: Filter = "audio";

  if (data.includes("highestvideo")) {
    quality = "highestvideo";
    filter = "videoandaudio";
  } else if (data.includes("lowestvideo")) {
    quality = "lowestvideo";
    filter = "videoandaudio";
  } else if (data.includes("highestaudio")) {
    quality = "highestaudio";
    filter = "audioonly";
  } else if (data.includes("lowestaudio")) {
    quality = "lowestaudio";
    filter = "audioonly";
  }

  await ctx.editMessageText("<b>🕖 Proccessing...</b>", {
    parse_mode: "HTML",
  });

  await YoutubeHelper.download(youtubeUrl, title, {
    filter,
    quality,
  })
    .then((path) => {
      ctx.deleteMessage();

      if (filter === "audioonly") {
        ctx.sendChatAction("upload_voice", {});

        ctx.sendAudio({
          source: String(path),
        });
      } else if (filter === "videoandaudio") {
        ctx.sendChatAction("upload_video");
        ctx
          .sendVideo({
            source: String(path),
          })
          .then(async (val) => {
            fs.unlinkSync(path.toString());
          });
          
      }
    })
    .catch((e) => console.error(`[ERROR] - `, e));

  next();
});

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

const uri =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI
    : process.env.MONGO_DEV;
mongoose
  .connect(uri!)
  .then(() => {
    bot
      .launch()
      .then(() => {
        console.log("Connected Successfuly :)");
      })
      .catch((e) => console.log("Error %d", e));
  })
  .catch((err) => console.log(err));
