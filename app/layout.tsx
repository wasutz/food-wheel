import type { Metadata } from "next";
import "./globals.css";
// Import static config for metadata — runs server-side, resolveJsonModule is enabled
import appConfig from "@/src/config/app.config.json";

export const metadata: Metadata = {
  title:       appConfig.app.metaTitle,
  description: appConfig.app.metaDescription,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={appConfig.app.defaultLanguage}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
