import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "X-Det-AI",
    template: "%s - X-Det-AI"
  },
  description: "X-Det-AI is a AI based app for detecting X-ray diseases",
  twitter: {
    card: "summary_large_image",
    images: ["/assets/Dark_Logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <Header />
      {children}
      <Toaster position="top-right" reverseOrder={false} />
      <Footer />
    </div>
  );
}