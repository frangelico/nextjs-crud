import Form from '@/app/ui/wallets/create-form';
// import Breadcrumbs from '@/app/ui/wallets/breadcrumbs';
import { fetchUsers } from '@/lib/data';
import { Metadata } from 'next'; 

export default async function Page() {
  const users = await fetchUsers();
 
  return (
    <main>
      {/* <Breadcrumbs
        breadcrumbs={[
          { label: 'Wallets', href: '/Wallets' },
          {
            label: 'Create Wallets',
            href: '/Wallets/create',
            active: true,
          },
        ]}
      /> */}
      <Form users={users} />
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Create Wallet',
};