import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Imposio – PDF Booklet Imposition Tool",
  description:
    "Convert any PDF into a print-ready booklet in seconds. Upload, auto-impose pages, and download — entirely in your browser. No uploads, no watermarks.",
  keywords: [
    "PDF booklet",
    "booklet imposition",
    "PDF imposition",
    "print booklet",
    "PDF tool",
    "duplex printing",
  ],
  openGraph: {
    title: "Imposio – PDF Booklet Imposition Tool",
    description: "Convert PDFs into print-ready booklets. 100% browser-based.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
