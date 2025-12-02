// @ts-ignore: side-effect CSS import (no type declarations for .css)
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | M-SEO Next.js Test',
    default: 'M-SEO Next.js Test',
  },
  description: 'Testing M-SEO with Next.js App Router',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="nav">
          <div className="nav-container">
            <h1 className="nav-title">M-SEO Next.js Test</h1>
            <div className="nav-links">
              <a href="/">Home</a>
              <a href="/blog/example">Blog</a>
              <a href="/products/example">Product</a>
              <a href="/analytics">Analytics</a>
              <a href="/about">About</a>
            </div>
          </div>
        </nav>
        <main className="main-content">{children}</main>
        <footer className="footer">
          <p>M-SEO Next.js Test App • Framework-agnostic SEO for Next.js</p>
        </footer>
      </body>
    </html>
  );
}
