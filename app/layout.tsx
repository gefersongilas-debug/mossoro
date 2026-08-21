import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mossoró Empresarial | Mobiliário profissional para empresas",
  description: "Móveis em MDF, mobiliário de aço e cadeiras corporativas para sua empresa.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}
    <Script id="gtm-base" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TBWS46VS');`}</Script>
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TBWS46VS" height="0" width="0" style={{ display: "none", visibility: "hidden" }} /></noscript>
  </body></html>;
}
