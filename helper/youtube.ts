import * as fs from "fs";
import ytdl, { Filter } from "ytdl-core";

export class YoutubeHelper {
  static async download(
    url: string,
    title: string,
    type: {
      quality: string;
      filter: Filter;
    }
  ) {
    let path = `./dl/${title}`;

    if (type.quality.includes("video")) {
      path += ".mp4";
    } else {
      path += ".mp3";
    }

    const outputStream = fs.createWriteStream(path);

    const dl = ytdl(url, {
      quality: type?.quality,
      filter: type.filter,
    }).pipe(outputStream);

    return new Promise<String>((resolve, reject) => {
      dl.on("close", () => {
        resolve(path);
      });

      dl.on("error", () => {
        console.log("CLOSED");
        reject(false);
      });
    });
  }

  static async getInfo(url: string) {
    
    const info = await ytdl.getBasicInfo(url);
    return info;
  }

  static isUrlValid(url: string) {
    return ytdl.validateURL(url);
  }

  static getID(url: string) {
    return ytdl.getVideoID(url);
  }
}


// const dlMsg = await ctx.reply("Download...");

    // await YoutubeHelper.download(text).then(async (val) => { `
    //   ctx.deleteMessage(dlMsg.message_id);
    //   console.log();
    //   const path = val?.toString();

    //   const id = await ctx.replyWithAudio(
    //     {
    //       source: path,
    //     },
    //     {
    //       caption: "Please forward it, i will be deleted after 30 seconds",
    //     }
    //   );

    //   setTimeout(() => {
    //     ctx.deleteMessage(id.message_id);
    //   }, 30000);
    // });