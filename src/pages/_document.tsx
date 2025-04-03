import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#2563EB" />
        <meta name="author" content="Héctor Ibarra" />
        <meta property="og:title" content="User Listing App" />
        <meta property="og:description" content="Browse and manage users in a clean interface" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
