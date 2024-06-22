import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/wallets/table';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchWalletsPages } from '@/lib/data';
import { Metadata } from 'next';
import { CreateWallet } from '@/app/ui/wallets/buttons';
 
export const metadata: Metadata = {
  title: 'Wallets',
};

export default async function Page({
    searchParams,    
}: {
    searchParams? : {
        query?: string;
        page?: string;
    }
}) {

    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchWalletsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Wallets</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search wallets..." />
        <CreateWallet />
      </div>
       <Suspense key={query + currentPage}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}