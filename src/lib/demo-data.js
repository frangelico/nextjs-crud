// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
    {
      id: '410544b2-4001-4271-9855-fec4b6a6442a',
      name: 'User',
      email: 'user@stephenjang.com',
      password: '123456',
    },
  ];
  
const walletAddresses = [
    {
      user_id: user[0].id,
      address: '5xot9PVkphiX2adznghwrAuxGs2zeWisNSxMW6hU6Hkj',
      status: 'active',
      date: '2022-12-06',
    },
    {
        user_id: user[0].id,
        address: 20348,
      status: 'active',
      date: '2022-11-14',
    },
    {
        user_id: user[0].id,
        address: 3040,
      status: 'active',
      date: '2022-10-29',
    },
    {
        user_id: user[0].id,
        address: 44800,
      status: 'active',
      date: '2023-09-10',
    },
    {
        user_id: user[0].id,
        address: 34577,
      status: 'active',
      date: '2023-08-05',
    },
];
    
  module.exports = {
    users,
    walletAddresses,
  };
  