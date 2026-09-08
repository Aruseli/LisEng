import { createFileRoute } from '@tanstack/react-router'

import { IrregularVerbsScreen } from '@/components/app/verbs/IrregularVerbsScreen'

export const Route = createFileRoute('/_app/verbs')({
  component: IrregularVerbsScreen,
})
