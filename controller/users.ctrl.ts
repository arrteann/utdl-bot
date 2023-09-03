import { Context } from "telegraf";
import UserService from "../services/users.service";
import { User } from "telegraf/typings/core/types/typegram";

const userService = new UserService();

class UsersController {
  async startBot(ctx: Context) {
    const isExist = await userService.isUserExist(ctx.message?.from.id!);

    if (isExist) {
      ctx.sendMessage(`Hey, ${ctx.message?.from.first_name} 👋\n`);
    } else {
      const userData = ctx.message?.from;
      const createUser = await userService.insert(userData!);
      if (createUser !== null) {
        ctx.sendMessage(`Welcome, ${ctx.message?.from.first_name} 🌹`);
      }
    }
  }
}

export default UsersController;
