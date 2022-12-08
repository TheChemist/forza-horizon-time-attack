import Head from "next/head";
import Footer from "../components/component.footer";
import Navbar from "../components/component.navbar";
import { Oswald } from "@next/font/google";
const oswald = Oswald({ style: "normal" });
// className={oswald.className}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-svg flex flex-col bg-zinc-900"
      // style={{ backgroundImage: "/background.svg" }}
    >
      <Head>
        <title>Forza Horizon Time Attack</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="min-h-screen pt-10">{children}</main>
      <Footer />
    </div>
  );
}
