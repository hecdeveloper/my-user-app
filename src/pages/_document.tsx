import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#2563EB" />
        <meta name="author" content="Héctor Ibarra" />
        <meta property="og:title" content="User Listing App" />
        <meta property="og:description" content="Browse and manage users in a clean interface" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
