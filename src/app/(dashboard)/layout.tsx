import type { Metadata } from "next";
import "../globals.css";
import { getServerSession } from "next-auth";
import NextSessionProvider from "@/provider/NextSessionProvider";
import QueryProvider from "@/provider/QueryProvider";
import Navbar from "@/components/ui/Navbar";
import "@uploadthing/react/styles.css";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Nora Admin | Make A Difference With Every Step!",
  description: "Nora Online Shop Admin Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <NextSessionProvider session={session}>
      <html lang="en">
        <body>
          <QueryProvider>
            <Navbar />
            {children}
          </QueryProvider>
        </body>
      </html>
    </NextSessionProvider>
  );
}
