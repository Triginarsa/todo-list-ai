import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

const ORIGIN_URL =
  process.env.NODE_ENV === "production"
    ? "https://todo.triginarsa.com"
    : "http://localhost:3000";

export const metadata: Metadata = {
  title: "todolist",
  description: "A simple todolist app with AI features",
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL(ORIGIN_URL),
  alternates: {
    canonical: ORIGIN_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.className}>
        <div>{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
