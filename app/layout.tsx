import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";

// Import font (similar to Futura LT BT)
const futura = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-futura",
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Design District CPH",
  description: "Udstillere og brands – Design District CPH Directory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <body className={`${futura.variable} font-sans antialiased bg-white text-zinc-900`}>
        {children}
      </body>
    </html>
  );
}
