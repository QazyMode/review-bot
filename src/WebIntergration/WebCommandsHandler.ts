import { IUserCommandsHandler, IUserStorage } from '../types';
import { createServer } from './server';

export class WebCommandsHandler implements IUserCommandsHandler {
  private server: any;

  constructor(usersStorage: IUserStorage) {
    this.server = createServer({
      config: {
        adminPassword: 'PROstoadmin',
      },
      usersStorage,
    });
  }

  async start(): Promise<void> {
    await this.server.listen('8080');
  }
}
