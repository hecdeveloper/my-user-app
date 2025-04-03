import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Layout } from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const progressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Configure NProgress
    NProgress.configure({ 
      showSpinner: false,
      minimum: 0.2,
      speed: 300,
      trickleSpeed: 150
    });

    // Reset current progress and forcefully remove loader
    const forceRemoveLoader = () => {
      document.querySelectorAll('#nprogress').forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
      NProgress.done(true);
    };

    // Safety function to ensure progress bar completes
    const ensureProgressComplete = () => {
      // Clear any existing timeout
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current);
        progressTimeoutRef.current = null;
      }
      
      // Force progress bar to complete after 1.5 seconds as a safety measure
      progressTimeoutRef.current = setTimeout(() => {
        forceRemoveLoader();
      }, 1500);
    };

    const handleStart = (url: string) => {
      const isShallow = url.includes('?') && 
                        router.pathname === url.split('?')[0] &&
                        router.asPath.split('?')[0] === url.split('?')[0];

      // Don't show progress for shallow routes (just query param changes)
      if (isShallow) {
        return;
      }
      
      forceRemoveLoader(); // Ensure clean start
      NProgress.start();
      ensureProgressComplete();
    };

    const handleComplete = () => {
      // Clear safety timeout
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current);
        progressTimeoutRef.current = null;
      }
      
      NProgress.done();
    };

    const handleError = () => {
      // Clear safety timeout
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current);
        progressTimeoutRef.current = null;
      }
      
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleError);

    // Safety cleanup on component unmount
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleError);
      
      // Clear any remaining timeout
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current);
        progressTimeoutRef.current = null;
      }
      
      // Ensure progress bar is complete when component unmounts
      forceRemoveLoader();
    };
  }, [router]);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
