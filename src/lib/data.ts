import { sql } from '@vercel/postgres';
import {
  UserField,
  UsersTableType,
  WalletForm,
  WalletsTable,
  LatestWalletRaw,
  User,
  UserForm  
} from '../lib/definitions';
import { formatAddress } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
import { log } from 'console';

// export async function fetchRevenue() {
//   // Add noStore() here to prevent the response from being cached.
//   // This is equivalent to in fetch(..., {cache: 'no-store'}).
//   noStore();

//   try {
//     // Artificially delay a response for demo purposes.
//     // Don't do this in production :)

//     console.log('Fetching revenue data...');
//     await new Promise((resolve) => setTimeout(resolve, 3000));

//     const data = await sql<Revenue>`SELECT * FROM revenue`;

//     console.log('Data fetch completed after 3 seconds.');

//     return data.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch revenue data.');
//   }
// }

export async function fetchLatestWallets() {
  noStore();

  try {
    const data = await sql<LatestWalletRaw>`
      SELECT wallet_address.address, user.name, user.email, wallet_address.id
      FROM wallet_address
      JOIN user ON wallet_address.user_id = user.id
      ORDER BY wallet_address.date DESC
      LIMIT 5`;

    const latestWallets = data.rows.map((wallet) => ({
      ...wallet,
      address: formatAddress(wallet.address),
    }));
    return latestWallets;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest wallets.');
  }
}


const ITEMS_PER_PAGE = 6;
export async function fetchFilteredWallets(
  query: string,
  currentPage: number,
) {
  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const wallets = await sql<WalletsTable>`
      SELECT
        "wallet_address".id,
        "wallet_address".address,
        "wallet_address".date,
        "wallet_address".status,
        "user".name,
        "user".email        
      FROM "wallet_address"
      JOIN "user" ON "wallet_address".user_id = "user".id
      WHERE
        "user".name ILIKE ${`%${query}%`} OR
        "user".email ILIKE ${`%${query}%`} OR
        "wallet_address".address::text ILIKE ${`%${query}%`} OR
        "wallet_address".date::text ILIKE ${`%${query}%`} OR
        "wallet_address".status ILIKE ${`%${query}%`}
      ORDER BY "wallet_address".date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return wallets.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch wallets.');
  }
}

export async function fetchWalletsPages(query: string) {
  noStore();
  
  try {

    const count = await sql`SELECT COUNT(*)
    FROM "wallet_address"
    JOIN "user" ON "wallet_address".user_id = "user".id
    WHERE
      "user".name ILIKE ${`%${query}%`} OR
      "user".email ILIKE ${`%${query}%`} OR
      "wallet_address".address::text ILIKE ${`%${query}%`} OR
      "wallet_address".date::text ILIKE ${`%${query}%`} OR
      "wallet_address".status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of wallet addresses.');
  }
}

export async function fetchWalletById(id: string) {
  noStore();

  try {
    const data = await sql<WalletForm>`
      SELECT
        wallet_address.id,
        wallet_address.user_id,
        wallet_address.address,
        wallet_address.status
      FROM wallet_address
      WHERE wallet_address.id = ${id};
    `;

    const wallet = data.rows.map((wallet) => ({
      ...wallet,
      address: wallet.address,
    }));

    return wallet[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch wallet.');
  }
}

export async function fetchUserById(id: string) {
  noStore();

  try {
    const data = await sql<UserForm>`
      SELECT
        id,
        email,
        name
      FROM "user"
      WHERE "user".id = ${id};
    `;
      
    const user = data.rows.map((user) => ({
      ...user,
    }));

    return user[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function fetchUsers() {
  noStore();

  try {
    const data = await sql<UserField>`
      SELECT
        id,
        name
      FROM users
      ORDER BY name ASC
    `;

    const users = data.rows;
    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all users.');
  }
}

export async function fetchFilteredUsers(query: string, currentPage: number) {
  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<UsersTableType>`
		SELECT
		  "user".id,
		  "user".name,
		  "user".email,
		  COUNT("wallet_address".id) AS total_wallets,
		  SUM(CASE WHEN "wallet_address".status = 'inactive' THEN 1 ELSE 0 END) AS total_inactive,
		  SUM(CASE WHEN "wallet_address".status = 'active' THEN 1 ELSE 0 END) AS total_active
		FROM "user"
		LEFT JOIN "wallet_address" ON "user".id = "wallet_address".user_id
		WHERE
    "user".name ILIKE ${`%${query}%`} OR
    "user".email ILIKE ${`%${query}%`}
		GROUP BY "user".id, "user".name, "user".email
		ORDER BY "user".name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `;

    const users = data.rows.map((user) => ({
      ...user,
      total_inactive: user.total_inactive,
      total_active: user.total_active,
    }));

    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch user table.');
  }
}

export async function getUser(email: string) {
  noStore();

  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}


export async function fetchUsersPages(query: string) {
  noStore();
  
  try {

    const count = await sql`SELECT COUNT(*)
    FROM "user"
    WHERE
      "user".name ILIKE ${`%${query}%`} OR
      "user".email ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of users.');
  }
}