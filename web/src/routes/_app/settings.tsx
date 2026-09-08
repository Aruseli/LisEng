import { createFileRoute } from '@tanstack/react-router'

import { NotificationSettings } from '@/components/app/NotificationSettings'

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return <NotificationSettings />
}
