"use client";

import { useEffect, useState, useMemo } from "react";
import "./globals.css";
import BottomNavigation from "@/components/layout/bottom-navigation/bottom-navigation";
import MiniSideBar from "@/components/layout/mini-side-bar/mini-side-bar";
import SideBar from "@/components/layout/side-bar/side-bar";
import { usePathname } from "next/navigation";
import TranslatorProvider from "@/components/providers/translator-provider";
import ThemeWrapper from "@/components/providers/theme-provider";
import TemporaryDrawer from "@/components/search/search";
import { useDrawerStore } from "@/store/search/searchStore";
import { useDrawerNotification } from "@/store/notification/notificationStore";
import TemporaryDrawerNotif from "@/components/pages/notification/notification";

export default function RootLayout({ children }) {
  const { isOpen } = useDrawerStore();
  const { openNotifDrawer } = useDrawerNotification();

  // 1️⃣ default: 0  – SSR‑safe
  const [windowWidth, setWindowWidth] = useState(0);
  const pathname = usePathname();

  // 2️⃣ window‑based logic → only in browser
  useEffect(() => {
    if (typeof window === "undefined") return;

    // set initial value
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 3️⃣ memoised bar type
  const barType = useMemo(() => {
    if (windowWidth <= 767) return "bottom";
    if (
      windowWidth <= 1279 ||
      isOpen == true ||
      pathname.includes("chat") ||
      openNotifDrawer == true
    )
      return "minibar";
    return "bar";
  }, [windowWidth, pathname, isOpen , openNotifDrawer]);

  const wrapWithBar = (content) => {
    switch (barType) {
      case "bottom":
        return <BottomNavigation>{content}</BottomNavigation>;
      case "minibar":
        return <MiniSideBar>{content}</MiniSideBar>;
      default:
        return <SideBar>{content}</SideBar>;
    }
  };

  return (
    <TranslatorProvider>
      <html lang="en">
        <body className="h-full">
          <TemporaryDrawer />
          <TemporaryDrawerNotif/>
          <ThemeWrapper>{wrapWithBar(children)}</ThemeWrapper>
        </body>
      </html>
    </TranslatorProvider>
  );
}
