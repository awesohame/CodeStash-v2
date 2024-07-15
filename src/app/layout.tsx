import type { Metadata } from "next";
import { DM_Sans as FontSans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const fontsans = FontSans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeStash",
  description: "An utility tool for programmers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontsans.className} min-h-screen bg-dark-1`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
