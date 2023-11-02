/* eslint-disable */
import { ILogger, IUserCommandsHandler, IUserStorage } from '../types';
import { ITelegramBot } from './TelegramBot';
import { GitlabClient } from '../GitlabWebhookReader/GitlabClient';

export class TelegramCommandsHandler implements IUserCommandsHandler {
  private bot: ITelegramBot;

  private logger: ILogger;

  private storage: IUserStorage;

  constructor(bot: ITelegramBot, logger: ILogger, storage: IUserStorage, private gitlabClient: GitlabClient) {
    this.logger = logger.createScope('TelegramCommandsHandler');
    this.bot = bot;
    this.storage = storage;

    // eslint-disable-next-line max-statements
    this.bot.registerCommand('roll', async (ctx) => {
      this.logger.debug('start /roll');

      const text = ctx.update.message?.text;
      let gitlabAccess = true

      if (!text) {
        this.logger.debug('no text');
        return;
      }

      const usernameRe = /roll ([0-9]+)$/;
      if (!usernameRe.test(text)) {
        this.logger.debug('Неверная команда для roll');
        ctx.reply('Неверная команда')
        return;
      }

      const match = usernameRe.exec(text);
      if (!match) {
        this.logger.debug('Неверная команда');
        ctx.reply('Неверная команда')
        return;
      }
      const MRId = Number(match[1])

      try {
        await this.gitlabClient.getMRById(MRId);
      } catch (err) {
        this.logger.debug(`${err}`);
        if(err?.response?.status === 404) {
          ctx.reply('Не нашёл такого МР')
          return;
        } else if (!err?.response) {
          ctx.reply('У меня нет доступа в Gitlab в текущий момент')
          gitlabAccess = false
        } else {
          return;
        }
      }

      const users = await this.storage.getUsers();

      let isMRexistReviewer = null;
      const isMRexist = users.some(({ mergeRequest, telegramUsername }) => {
        const isUserMRexist = mergeRequest?.includes(MRId)
        if (isUserMRexist) {
          isMRexistReviewer = telegramUsername
        }
        return isUserMRexist
      })

      if (isMRexist) {
        this.logger.debug('Для этого MR уже есть ревьюер');
        ctx.reply(`Для этого MR уже есть ревьюер - это ${isMRexistReviewer}`)
        return;
      }

      const senderTelegramUsername = `@${ctx?.update?.message?.from?.username}`

      let freeUsers = users.filter(({ reviewScore, vacation, telegramUsername }) => !vacation || telegramUsername !== senderTelegramUsername || !reviewScore)

      if (!freeUsers.length) {
        const reloadedUsers = users.map((user) => {
          return {
            ...user,
            reviewScore: 1
          }
        })
        await this.storage.saveUsers(reloadedUsers);
        freeUsers = reloadedUsers.filter(({ vacation, telegramUsername }) => !vacation || telegramUsername !== senderTelegramUsername);
      }
      const randomNum = Math.floor(Math.random() * freeUsers.length);

      const reviewer = freeUsers[randomNum];
      reviewer.mergeRequest?.push(MRId)

      try {
        if (gitlabAccess) {
          await this.gitlabClient.setReviewerById(MRId, [reviewer.gitlabId]);
        }
      } catch (err) {
        this.logger.debug(`${err}`);
        ctx.reply(`Не удалось назначить ${reviewer.telegramUsername} для МРа №${MRId} в Gitlab`)
        console.log(err)
      }

      this.storage.saveUser({
        ...reviewer,
        reviewScore: reviewer.reviewScore--,
      });

      ctx.reply(`${reviewer.telegramUsername} будет делать ревью https://github.com/QazyMode/review-bot/prodbo/is-api/-/merge_requests/${match[1]}`);
    });
  }

  start(): Promise<void> {
    this.bot.start();
    return Promise.resolve();
  }
}
