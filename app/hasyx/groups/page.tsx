'use client'

import dynamic from 'next/dynamic';
import sidebar from '@/app/sidebar';
import pckg from '@/package.json';
import { SidebarLayout } from 'hasyx/components/sidebar/layout';

// Dynamically import to avoid build-time errors
const GroupsPageClient = dynamic(() => import('./groups-client'), { ssr: false });

export default function GroupsPage() {
  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[{ title: pckg.name as string, link: '/' }]}>
      <GroupsPageClient />
    </SidebarLayout>
  );
}
