import "@/app/globals.css";
import { AppClientLayout } from '@/lib/app-client-layout';
import { ModalContainer } from '@/components/app/Modal/Modal';
import { Toast } from '@/components/app/Toast/Toast';

import { getLocale } from 'hasyx/lib/i18n';
import type { Metadata, Viewport } from "next";
import schema from "../public/hasura-schema.json";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f6f7' },
    { media: '(prefers-color-scheme: dark)', color: '#281632' },
  ],
};

// ✅ Полная и исчерпывающая конфигурация metadata
export const metadata: Metadata = {
  // Основное
  title: "LisEng",
  description: "Приложение для изучения английского языка",
  applicationName: 'LisEng',
  
  // PWA и мобильные устройства
  manifest: '/manifest.webmanifest',
  formatDetection: {
    telephone: false,
  },
  
  // Иконки
  icons: {
    icon: '/favicon.ico',
    apple: [
      { url: '/icons/icon-192.webp' },
      { url: '/icons/icon-152.webp', sizes: '152x152' },
      { url: '/icons/icon-167.webp', sizes: '167x167' },
    ],
  },
  
  // Настройки для Apple устройств
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LisEng',
  },

  // Поле для всех остальных, нестандартных или редких тегов
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#000000',
    'msapplication-tap-highlight': 'no',
    'msapplication-navbutton-color': '#000000',
    'msapplication-TileImage': '/icons/icon-192.webp',
    'msapplication-config': '/browserconfig.xml',
  },
};

const defaultLocale = getLocale();

export default function RootLayout({
  children,
}: {
  children?: any;
}) {
  return (
    <>
      <html lang={defaultLocale} suppressHydrationWarning>
        <head />
        <body>
          <AppClientLayout defaultLocale={defaultLocale} schema={schema} defaultTheme={'system'}>
            <div id="modal-root"></div>
            <ModalContainer />
            {children}
            <Toast />
          </AppClientLayout>
        </body>
      </html>
    </>
  )
}
