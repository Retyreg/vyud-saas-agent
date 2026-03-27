import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--vyud-font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const dmSans = DM_Sans({
  variable: "--vyud-font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--vyud-font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VYUD AI — Гипер-персонализация в аутриче",
  description: "Автоматический Account Research и генерация писем с помощью Agentic AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `
          (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=108268258', 'ym');

          ym(108268258, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
        ` }} />
      </head>
      <body className="antialiased">
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/108268258" style={{ position: "absolute", left: "-9999px" }} alt="" />
          </div>
        </noscript>
        {children}
      </body>
    </html>
  );
}
