"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Header() {
  const pathname = usePathname();

  const links = [
    { name: "About", path: "/about" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Skills", path: "/skills" },
    { name: "Experience", path: "/experience" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/50 border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-8 md:px-24 h-20 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-xl font-medium tracking-tight text-foreground hover:text-neutral-300 transition-colors"
        >
          Moris Khoudari
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`text-sm font-medium transition-colors ${
                pathname === link.path 
                  ? "text-foreground" 
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
