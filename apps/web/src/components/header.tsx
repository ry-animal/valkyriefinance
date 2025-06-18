"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import UserMenu from "@/components/user-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import NextImage from "next/image";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { to: "/", label: "HOME" },
    { to: "/dashboard", label: "DASHBOARD" },
    { to: "/vault", label: "VAULT" },
    { to: "/swap", label: "SWAP" },
    { to: "/ai", label: "AI CHAT" },
    { to: "/ai-analytics", label: "AI Analytics" },
  ];

  return (
    <header className="bg-white dark:bg-black border-b-4 border-black dark:border-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between p-6">
          <Link href="/" className="brutal-hover flex items-center gap-4">
            <NextImage src="/favicon.png" alt="Valkyrie" width={72} height={72} className="dark:invert" />
            <div className="font-brutal font-black text-3xl uppercase tracking-tighter text-black dark:text-white">
              VALKYRIE
            </div>
          </Link>

          <nav className="hidden md:flex items-center">
            <div className="flex">
              {links.map((link, index) => (
                <div key={link.to} className="flex">
                  <Link
                    href={link.to}
                    className={cn(
                      "px-6 py-3 font-brutal font-black uppercase text-lg tracking-widest transition-colors duration-100 border-r-4 border-black dark:border-white",
                      pathname === link.to
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "bg-white dark:bg-black text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
                    )}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            <UserMenu />
          </div>

          <Button
            variant="ghost"
            className="md:hidden font-brutal font-black text-xl text-black dark:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            MENU
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t-4 border-black dark:border-white bg-white dark:bg-black">
            <div className="grid grid-cols-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className={cn(
                    "px-6 py-4 font-brutal font-black uppercase text-lg tracking-widest transition-colors duration-100 border-b-4 border-black dark:border-white",
                    pathname === link.to
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "bg-white dark:bg-black text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="p-6 border-b-4 border-black dark:border-white flex gap-4 items-center justify-center">
                <ModeToggle />
                <UserMenu />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
