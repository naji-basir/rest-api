import { omit } from 'lodash';
import UserModel, { UserDocument, UserInput } from '../models/user.model';
export async function createUser(input: UserInput) {
  try {
    const user = await UserModel.create(input);
    return omit(user.toJSON(), 'password');
  } catch (error: any) {
    throw new Error(error);
  }
}
