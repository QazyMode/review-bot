import fs from 'fs';
import { UserData, IUserStorage, ILogger } from '../types';

type FileSchema = Record<string, UserData>;
export class StaticJsonUsersStorage implements IUserStorage {
  private logger: ILogger;

  constructor(private filePath: string, logger: ILogger) {
    this.logger = logger.createScope('StaticJsonUsersStorage');
  }

  private readFile(): FileSchema {
    if (!fs.existsSync(this.filePath)) {
      return {
        "rb188468": {
          "gitlabId": 821,
          "gitlabUsername":"rb188468",
          "telegramUsername": "@AlekseyMatsekha",
          "vacation": true,
          "reviewScore": 0,
          "mergeRequest": []
        },
        "rb192699": {
          "gitlabId": 1064,
          "gitlabUsername":"rb192699",
          "telegramUsername": "@eugfomin",
          "reviewScore": 1,
          "mergeRequest": []
        }
      };
    }

    this.logger.debug('readFile');
    return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
  }

  private writeFile(fileData: FileSchema): void {
    this.logger.debug('writeFile');
    fs.writeFileSync(this.filePath, JSON.stringify(fileData), 'utf-8');
  }

  saveUser(data: UserData): Promise<void> {
    this.logger.debug(`saveUser ${JSON.stringify(data)}`);
    const users = this.readFile();

    users[data.gitlabUsername] = data;

    this.writeFile(users);

    return Promise.resolve();
  }

  saveUsers(data: UserData[]): Promise<void> {
    this.logger.debug(`saveUsers ${JSON.stringify(data)}`);

    const users = this.readFile();
    data.forEach(item => {
      users[item.gitlabUsername] = item
    })
    this.writeFile(users);

    return Promise.resolve();
  }

  getUser(gitlabUsername: string): Promise<UserData | undefined> {
    const users = this.readFile();
    this.logger.debug(`getUser ${gitlabUsername}`);
    return Promise.resolve(users[gitlabUsername]);
  }

  getUsers(): Promise<UserData[]> {
    const data = this.readFile();
    return Promise.resolve(Object.values(data));
  }
}
