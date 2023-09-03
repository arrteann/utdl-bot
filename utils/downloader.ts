import * as fs from "fs";
import ytdl from "ytdl-core";

export class DownloaderUtils {
  static async mp3(url: string) {
    const videoInfo = await ytdl.getBasicInfo(url);

    const { title } = videoInfo.videoDetails;

    const path = `./dl/${title}.mp4`;

    const outputStream = fs.createWriteStream(path); // Specify the output file name and extension

    const dl = ytdl(url, {
      quality: "highestaudio",
      filter: "audioonly",
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
}
