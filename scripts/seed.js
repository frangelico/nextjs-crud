const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    //Use uuid for better security vs incremental id
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS "user" (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created user table`);

    // Populate table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO user (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedWallets(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Solana addresses are base58 encoded string, buffer, Uint8Array, number and an array of numbers

    // Create the "invoices" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS "wallet_address" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL
  );
`;

    console.log(`Created wallet_address table`);


    // Create the "invoices" table if it doesn't exist
    const alterTable = await client.sql`
    ALTER TABLE IF EXISTS "wallet_address" 
        ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "user"(id)
    ;
    `;

    // Insert data into the "invoices" table
    const insertedWallets = await Promise.all(
      wallets.map(
        (address) => client.sql`
        INSERT INTO wallet_address (user_id, status, date, address)
        VALUES (${address.user_id}, ${address.status}, ${address.date}, ${invoice.address})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedWallets.length} wallets`);

    return {
      createTable,
      invoices: insertedWallets,
    };
  } catch (error) {
    console.error('Error seeding wallets:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedWallets(client);  

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
