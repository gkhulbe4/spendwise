import type { Metadata } from "next";
import { Inter, Gabarito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-gabarito",
});

export const metadata: Metadata = {
  title: "Spendwise Finance Dashboard",
  description: "Spendwise v0.1: Company Expense Management SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "antialiased min-h-screen",
          inter.variable,
          gabarito.variable,
          "font-sans"
        )}
      >
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
