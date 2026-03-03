import type { Metadata, Viewport } from "next";
import "./globals.css";
// Import static config for metadata — runs server-side, resolveJsonModule is enabled
import appConfig from "@/src/config/app.config.json";
import { ServiceWorkerRegister } from "@/src/components/shared/ServiceWorkerRegister";

export const metadata: Metadata = {
  title:       appConfig.app.metaTitle,
  description: appConfig.app.metaDescription,
  manifest:    "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: appConfig.app.title,
  },
};

export const viewport: Viewport = {
  themeColor: "#ff6b00",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={appConfig.app.defaultLanguage}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
