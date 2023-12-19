import "./global.css";

export default async function RootLayout({ children }) {
  return (
    <html lang={"en"}>
      <body className={"selection:bg-zinc-300/50"}>
        <div id={"modal"}></div>
        {children}
      </body>
    </html>
  );
}
