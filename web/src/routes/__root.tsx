import { useEffect } from 'react'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { ModalContainer } from '@/components/app/Modal/Modal'
import { Toast } from '@/components/app/Toast/Toast'
import { useHasuraAuth } from '@/lib/hasura/useHasuraAuth'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
      },
      { title: 'LisEng' },
      { name: 'description', content: 'Приложение для изучения английского языка' },
      { name: 'application-name', content: 'LisEng' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#f7f6f7' },
      { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#281632' },
      // Apple PWA
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'LisEng' },
      // Прочие PWA/мобильные
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'msapplication-TileColor', content: '#00b894' },
      { name: 'msapplication-tap-highlight', content: 'no' },
      { name: 'msapplication-navbutton-color', content: '#00b894' },
      { name: 'msapplication-TileImage', content: '/icons/android-chrome-192x192.png' },
      { name: 'msapplication-config', content: '/browserconfig.xml' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'manifest', href: '/manifest.webmanifest' },
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/apple-touch-icon.png' },
      { rel: 'icon', sizes: '192x192', href: '/icons/android-chrome-192x192.png' },
      { rel: 'icon', sizes: '512x512', href: '/icons/android-chrome-512x512.png' },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 p-8 text-center">
      <p className="text-lg font-semibold text-gray-900">Страница не найдена</p>
      <a href="/" className="text-sm text-accent underline">
        На главную
      </a>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 p-8 text-center">
      <p className="text-lg font-semibold text-gray-900">Что-то пошло не так</p>
      <p className="text-sm text-gray-500">{error instanceof Error ? error.message : 'Неизвестная ошибка'}</p>
      <a href="/" className="text-sm text-accent underline">
        На главную
      </a>
    </div>
  ),
})

/** Поддерживает актуальный Hasura JWT при активной сессии */
function HasuraAuthBridge() {
  useHasuraAuth()
  return null
}

/** Регистрация service worker (только прод) */
function ServiceWorkerRegistration() {
  useEffect(() => {
    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW registration failed:', err)
      })
    }
  }, [])
  return null
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <HasuraAuthBridge />
        <ServiceWorkerRegistration />
        <div id="modal-root"></div>
        <ModalContainer />
        {children}
        <Toast />
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
              TanStackQueryDevtools,
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  )
}
