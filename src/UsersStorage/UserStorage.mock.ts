import { IUserStorage } from '../types';

export const createUsersStorageMock = (): IUserStorage => {
  return {
    saveUser: jest.fn(),
    saveUsers: jest.fn(),
    getUser: jest.fn(),
    getUsers: jest.fn(),
  };
};
