import Form from '@/app/ui/users/edit-form';
// import Breadcrumbs from '@/app/ui/users/breadcrumbs';
import { notFound } from 'next/navigation'; 
import { Metadata } from 'next';
import { fetchUserById } from '@/lib/data';

export default async function Page(
    {params} : {params: {id: string}}
) {
    const id = params.id;
    const [user] = await Promise.all([
        fetchUserById(id),
    ]);
    
    if (!user) {
        return notFound();
    }
    
  return (
    <main>
      {/* <Breadcrumbs
        breadcrumbs={[
          { label: 'Users', href: '/users' },
          {
            label: 'Edit User',
            href: `/users/${id}/edit`,
            active: true,
          },
        ]}
      /> */}
      <Form user={user} />
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Edit User',
};