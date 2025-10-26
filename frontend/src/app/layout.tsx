"use client";
import { Geist, Geist_Mono, Nunito, Outfit, Oswald } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import Footer from "./components/Footer";
import { AppContextProvider } from "./context/AppContext";
import { usePathname } from "next/navigation";
import { WhatsappChatbot } from "./components/WhatsappChatbot";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import MuiThemeProvider from "./mui/ThemeProvider";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "700"],
});
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "700"],
});
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop();

  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${nunito.variable}
          ${outfit.variable}
          ${oswald.variable}
          antialiased
        `}
      >
        {/* Load runtime env before any interactive scripts */}
        <Script id="runtime-env" src="/env.js" strategy="beforeInteractive" />
          <MuiThemeProvider>
            <AppContextProvider>
              {!(lastSegment === "admin-dashboard") && <Header />}
              <section>{children}</section>
              <WhatsappChatbot />
              {!(lastSegment === "admin-dashboard") && <Footer />}
            </AppContextProvider>
          </MuiThemeProvider>
        
        <Toaster />
      </body>
    </html>
  );
}
