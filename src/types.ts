export interface UserData {
  gitlabId: number;
  gitlabUsername: string;
  telegramUsername: string;
  vacation?: boolean;
  reviewScore: number;
  mergeRequest: number[]
}

export interface GitlabApprovals {
  user_has_approved: boolean;
  user_can_approve: boolean;
  approved: boolean;
  approved_by: number[];
}

export interface IUserStorage {
  saveUser(data: UserData): Promise<void>;
  saveUsers(data: UserData[]): Promise<void>;

  getUser(gitlabUsername: string): Promise<UserData | undefined>;
  getUsers(): Promise<UserData[]>;
}

export interface ILogger {
  error(message: string): void;
  info(message: string): void;
  debug(message: string): void;
  createScope(scopeName: string): ILogger;
}

export interface IUserCommandsHandler {
  start(): Promise<void>;
}
