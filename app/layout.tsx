import type { Metadata } from "next";
import { Fugaz_One, Open_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";
import Head from "next/head";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Logout from '@/components/Logout';
import Image from 'next/image'
import moodly from '@moodly.svg'



const opensans = Open_Sans({ subsets: ["latin"] });
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Moodly",
  description: "Track your daily mood, every day of the year.",
};

export default function RootLayout({ children }: { children: ReactNode }) {

  const header = (
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
      <Link href="/">
      {/* <h1 className={`${fugaz.className} text-base sm:text-lg textGradient `}>Moodly</h1> */}
      <Image src="/moodly.svg" alt="Moodly Logo" width={50} height={50}/>
      </Link>
      <Logout/>
    </header>
  )

  const footer = (
    <footer className="p-4 sm:p-8 grid place-items-center">
      <p>Created by <a href="https://github.com/Mohamed-Madani" className="text-indigo-600">Mohamed Madani</a> with 💙</p>
    </footer>
  )

  return (
    <html lang="en">
      <Head />
      <AuthProvider>
      <body className={`${opensans.className} w-full max-w-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col text-slate-800`}>
        {header}
        {children}
        {footer}
        </body>
      </AuthProvider>
    </html>
  );
}
