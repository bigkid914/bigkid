import Script from "next/script";
import "./global.css";

export default async function RootLayout({ children }) {
  return (
    <html lang={"en"}>
      <head>
        <Script
          defer
          data-domain="bigkid.tv"
          src="https://analytics.soup.work/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
        ></Script>
      </head>
      <body className={"selection:bg-zinc-300/50"}>
        <div id={"modal"}></div>
        {children}
      </body>
    </html>
  );
}
