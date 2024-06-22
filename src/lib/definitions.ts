// This file contains type definitions for data model.
// Could use a ORM typeORM, Prisma, Drizzle etc
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type WalletAddress = {
  id: string;
  user_id: string;
  address: string;
  date: string;
  status: 'active' | 'inactive';
};

export type LatestWallet = {
  id: string;
  name: string;
  email: string;
  address: string;
};

export type LatestWalletRaw = Omit<LatestWallet, 'address'> & {
  address: string;
};

export type WalletsTable = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  date: string;
  address: string;
  status: 'active' | 'inactive';
};

export type UsersTableType = {
  id: string;
  name: string;
  email: string;
  total_wallets: number;
  total_inactive: number;
  total_active: number;
};

export type FormattedUsersTable = {
  id: string;
  name: string;
  email: string;
  total_wallets: number;
  total_inactive: number;
  total_active: number;
};

export type UserField = {
  id: string;
  name: string;
};

export type WalletForm = {
  id: string;
  user_id: string;
  address: string;
  status: 'active' | 'inactive';
};

export type UserForm = {
  id: string;
  name: string;
  email: string;
  password: string;
};
