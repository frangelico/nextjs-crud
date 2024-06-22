import Form from '@/app/ui/wallets/edit-form';
import Breadcrumbs from '@/app/ui/wallets/breadcrumbs';
import { fetchUsers, fetchWalletById } from '@/lib/data';
import { notFound } from 'next/navigation'; 
import { Metadata } from 'next';

export default async function Page(
    {params} : {params: {id: string}}
) {
    const id = params.id;
    const [wallet, users] = await Promise.all([
        fetchWalletById(id),
        fetchUsers(),
    ]);
    
    if (!wallet) {
        return notFound();
    }
    
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Wallets', href: '/wallets' },
          {
            label: 'Edit Wallet',
            href: `/wallets/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form wallet={wallet} users={users} />
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Edit Wallet',
};