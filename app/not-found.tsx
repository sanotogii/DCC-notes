import Link from "next/link";
import "./chat.css";

export default function NotFound() {
  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="spark">✻</span> DCC Notes
        </div>
      </header>
      <main className="page-center">
        <div className="spark big">✻</div>
        <h1>Page not found</h1>
        <p>This page doesn&apos;t exist. Head back to the chat to ask for a file.</p>
        <Link className="btn-primary" href="/">
          Back to chat
        </Link>
      </main>
    </div>
  );
}