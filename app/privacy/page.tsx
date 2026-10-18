import Link from "next/link";
import "../chat.css";

export const metadata = { title: "Privacy · DCC Notes" };

export default function Privacy() {
  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="spark">✻</span> DCC Notes
        </div>
        <Link className="ghost" href="/">
          Back to chat
        </Link>
      </header>

      <main className="doc">
        <h1>Privacy policy</h1>
        <p className="doc-date">Last updated: October 18, 2026</p>

        <p>
          DCC Notes is a small tool for our class. You ask for a course file
          (a TP, a chapter, slides) and it sends it to you, asks which one you
          mean, or tells you it can&apos;t find it. It is not a chatbot, and
          there are no accounts.
        </p>

        <h2>What I can see</h2>
        <p>
          Every message you send goes through n8n, the workflow tool that finds
          your file. That means I can see individual messages you type, along
          with a random chat ID the site creates for your conversation. I use
          them only to check that the bot finds the right files and to fix it
          when it doesn&apos;t.
        </p>
        <p>
          I don&apos;t see your name, email, or any account, because none is
          collected. Please don&apos;t type personal information into the chat.
          It only needs course and file names.
        </p>

        <h2>What stays on your device</h2>
        <p>
          Your chat history, the files you received, and your light/dark
          setting are saved in your own browser. They are not stored on a
          server. Delete a chat in the sidebar, or clear your browser data, and
          they are gone.
        </p>

        <h2>Where the data goes</h2>
        <p>
          The site is hosted on Cloudflare, which keeps standard request logs
          such as IP address. The n8n workflow runs on my own phone, and its
          execution history may keep your messages until I clear it. I don&apos;t
          sell or share your messages, and there are no ads, analytics, or
          tracking cookies.
        </p>

        <h2>Your choices</h2>
        <p>
          You can stop using the bot at any time. If you want a message of
          yours deleted from my side, ask me in class or at the contact below.
        </p>

        <h2>Contact</h2>
        <p>Questions about this page: khalidlazrag.contact@gmail.com.</p>
      </main>
    </div>
  );
}