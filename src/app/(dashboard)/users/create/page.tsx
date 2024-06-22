import Form from '@/app/ui/users/create-form';
// import Breadcrumbs from '@/app/ui/users/breadcrumbs';
import { fetchUsers } from '@/lib/data';
import { Metadata } from 'next'; 

export default async function Page() {
  return (
    <main>
      {/* <Breadcrumbs
        breadcrumbs={[
          { label: 'Users', href: '/Users' },
          {
            label: 'Create Users',
            href: '/users/create',
            active: true,
          },
        ]}
      /> */}
      <Form />
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Create Invoice',
};