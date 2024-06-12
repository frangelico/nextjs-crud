const web3 = require('@solana/web3.js');

const kp = web3.Keypair;

let keys = kp.generate();

const users = [
    {
      id: '410544b2-4001-4271-9855-fec4b6a6442a',
      name: 'User',
      email: 'user@stephenjang.com',
      password: '123456',
    },
  ];

// Lets assume the private key is already communicated to the user for the seed (no one would know the private key)
// CRUD screens should STORE the public key and DISPLAY the private key
const walletAddresses = [
    {
      user_id: users[0].id,
      address: '5xot9PVkphiX2adznghwrAuxGs2zeWisNSxMW6hU6Hkj',
      status: 'active',
      date: '2022-12-06',
    },
    {
        user_id: users[0].id,
        address: kp.generate().publicKey.toBase58(),
      status: 'active',
      date: '2022-11-14',
    },
    {
        user_id: users[0].id,
        address: kp.generate().publicKey.toBase58(),
      status: 'active',
      date: '2022-10-29',
    },
    {
        user_id: users[0].id,
        address: kp.generate().publicKey.toBase58(),
      status: 'active',
      date: '2023-09-10',
    },
    {
        user_id: users[0].id,
        address: kp.generate().publicKey.toBase58(),
      status: 'active',
      date: '2023-08-05',
    },
];
    
  module.exports = {
    users,
    walletAddresses,
  };
  