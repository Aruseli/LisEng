'use client';

import { useState, useEffect } from 'react';
import sidebar from "@/app/sidebar";
import pckg from "@/package.json";
import { SidebarLayout } from "hasyx/components/sidebar/layout";
import { Messaging } from "hasyx/components/hasyx/messaging/messaging";

export default function MessagingPage() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <SidebarLayout sidebarData={sidebar} breadcrumb={[{ title: pckg.name, link: '/' }]}>
        <div className="p-4">Loading...</div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[{ title: pckg.name, link: '/' }]}>
      <Messaging/>
    </SidebarLayout>
  );
} 