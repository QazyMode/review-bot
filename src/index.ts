import { Core } from './Core';
import { GitlabEventsListener } from './GitlabWebhookReader/GitlabEventsListener';
import { GitlabClient } from './GitlabWebhookReader/GitlabClient';
import { createStorage } from './UsersStorage/createStorage';
import { WinstonLogger } from './Logger';
import { createTelegramIntegration } from './TelegramIntegration/createTelegramIntegration';
import { IUserCommandsHandler } from './types';
import 'dotenv/config'

const logger = WinstonLogger.createLogger();

console.log(process.env);
console.log('process.env.GITLAB_TOKEN', process.env.GITLAB_TOKEN);

if (!process.env.GITLAB_TOKEN) {
  logger.error('provide GITLAB_TOKEN');
  process.exit(1);
}

if (!process.env.FILE_PATH) {
  logger.error('provide FILE_PATH');
  process.exit(1);
}

const storage = createStorage(logger);
const { userCommandsHandler } = createTelegramIntegration({ storage, logger });

const proxy: IUserCommandsHandler = {
  async start() {
    await userCommandsHandler.start();
  },
};

const gitlabEventsListener = new GitlabEventsListener(
  new GitlabClient('https://github.com/QazyMode/review-bot', process.env.GITLAB_TOKEN, logger),
  logger,
);

gitlabEventsListener.start(8080);

const core = new Core(proxy);

core.start();

logger.info('started');
