import type { Metadata } from "next";
import "../globals.css";
import { getSession } from "next-auth/react";
import NextSessionProvider from "@/provider/NextSessionProvider";
import QueryProvider from "@/provider/QueryProvider";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Nora Admin| Auth",
  description: "Where style meets comfort",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession();
  
  if(session){
    redirect('/')
  }

  return (
    <NextSessionProvider session={session}>
      <html lang="en">
        <body>
            <QueryProvider>
               {children}
            </QueryProvider>
        </body>
      </html>
    </NextSessionProvider>
  );
}