import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeepLink Generator — Smart App Short Links",
  description:
    "Convert any app URL into a smart short link that opens the native mobile app or falls back to the web browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
