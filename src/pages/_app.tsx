import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Configure NProgress
    NProgress.configure({ showSpinner: false });

    const handleStart = () => {
      setIsLoading(true);
      NProgress.start();
    };

    const handleComplete = () => {
      setIsLoading(false);
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
