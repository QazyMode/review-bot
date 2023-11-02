import { Notifier } from '../Core';
import { ILogger, IUserCommandsHandler, IUserStorage } from '../types';
import { TelegramNotifier } from './TelegramNotifier';
import { TelegramBot } from './TelegramBot';
import { WinstonLogger } from '../Logger';
import { TelegramCommandsHandler } from './TelegramCommandsHandler';
import { GitlabClient } from '../GitlabWebhookReader/GitlabClient';

const logger = WinstonLogger.createLogger();

export function createTelegramIntegration(params: {
  storage: IUserStorage;
  logger: ILogger;
}): { notifier: Notifier; userCommandsHandler: IUserCommandsHandler } {
  if (!process.env.TG_TOKEN) {
    params.logger.error('provide TG_TOKEN');
    process.exit(1);
  }
  const bot = new TelegramBot({ token: process.env.TG_TOKEN });
  const notifier = new TelegramNotifier(params.storage, params.logger, bot);
  const gitlabClient = new GitlabClient('https://github.com/QazyMode/review-bot', process.env.GITLAB_TOKEN || '', process.env.PROJECT_ID || '', logger)
  const userCommandsHandler = new TelegramCommandsHandler(bot, params.logger, params.storage, gitlabClient);
  return { notifier, userCommandsHandler };
}
