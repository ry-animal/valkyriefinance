"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import UserMenu from "@/components/user-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const links = [
    { to: "/", label: "HOME" },
    { to: "/dashboard", label: "DASHBOARD" },
    { to: "/vault", label: "VAULT" },
    { to: "/ai", label: "AI CHAT" },
  ];

  return (
    <header className="bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between p-6">
          {/* Logo */}
          <Link href="/" className="brutal-hover">
            <div className="font-brutal font-black text-3xl uppercase tracking-tighter">
              VALKYRIE
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="flex">
              {links.map((link, index) => (
                <div key={link.to} className="flex">
                  <Link
                    href={link.to}
                    className={cn(
                      "px-6 py-3 font-brutal font-black uppercase text-lg tracking-widest transition-colors duration-100 border-r-4 border-black",
                      pathname === link.to
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </nav>

          {/* Right Side Controls */}
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden font-brutal font-black text-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            MENU
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-4 border-black bg-white">
            <div className="grid grid-cols-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className={cn(
                    "px-6 py-4 font-brutal font-black uppercase text-lg tracking-widest transition-colors duration-100 border-b-4 border-black",
                    pathname === link.to
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-black hover:text-white"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="p-6 border-b-4 border-black flex gap-4">
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
