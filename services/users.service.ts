import { User as TUser } from "telegraf/typings/core/types/typegram";
import User, { IUser } from "../models/user";

class UserService {
  async isUserExist(id: number) {
    const isExist = await User.findOne({ id: id });

    if (isExist === null) return false;
    else return true;
  }

  async insert(user: TUser) {
    const newUser: IUser = new User({
      id: user.id,
      firstName: user.first_name,
      username: user.username,
      isPremium: user.is_premium,
      isBot: user.is_bot,
    });

    const inserted = await newUser.save();

    return inserted;
  }

  async update() {}

  async remove() {}

  async get() {}
}

export default UserService;
