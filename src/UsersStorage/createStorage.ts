import { ILogger, IUserStorage } from '../types';
import { StaticJsonUsersStorage } from './StaticJsonUsersStorage';

export function createStorage(logger: ILogger): IUserStorage {
  if (!process.env.FILE_PATH) {
    throw new Error('provide FILE_PATH');
  }

  return new StaticJsonUsersStorage(process.env.FILE_PATH, logger);
}
