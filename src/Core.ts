import { IUserCommandsHandler } from './types';

export interface Notifier {
  notifyReviewerAboutMr(
    reviewer: string,
    mrInfo: {
      name: string;
      link: string;
      author: string;
    },
  ): Promise<void>;
  notifyReviewerAboutFixed(
    reviewer: string,
    mrInfo: {
      name: string;
      link: string;
      author: string;
    },
  ): Promise<void>;
  notifyAuthorAboutApprove(
    author: string,
    mrInfo: {
      name: string;
      link: string;
      reviewer: string;
    },
  ): Promise<void>;
  notifyAuthorAboutWatched(
    author: string,
    mrInfo: {
      name: string;
      link: string;
      reviewer: string;
    },
  ): Promise<void>;
}

type addReviewersEvent = {
  reviewers: string[];
  mrInfo: {
    link: string;
    name: string;
    author: string;
  };

  type: 'addReviewersEvent';
};

type approvedEvent = {
  type: 'approvedEvent';
  reviewer: string;
  mrInfo: {
    author: string;
    link: string;
    name: string;
  };
};

type watchedEvent = {
  type: 'watchedEvent';
  reviewer: string;
  mrInfo: {
    link: string;
    name: string;
    author: string;
  };
};

type fixedEvent = {
  type: 'fixedEvent';
  reviewer: string;
  mrInfo: {
    link: string;
    name: string;
    author: string;
  };
};

export type GitlabEvent = approvedEvent | watchedEvent | fixedEvent | addReviewersEvent;

export interface GitlabEventsListener {
  onEvent: (cb: (event: GitlabEvent) => void) => void;
}

export class Core {
  constructor(private userCommandsHandler: IUserCommandsHandler) {
  }

  start(): void {
    this.userCommandsHandler.start();
  }
}
