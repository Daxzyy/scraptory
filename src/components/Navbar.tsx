import { Link } from "react-router-dom";
import { Terminal, Github } from "lucide-react";
import { motion } from "motion/react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg border border-white/10 bg-white/5 transition-colors group-hover:border-white/20">
            <Terminal className="w-4 h-4 text-neutral-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Scraptory
          </span>
        </Link>

        <div className="flex items-center gap-6 text-xs font-semibold">
          <Link
            to="/"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Archive
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 border border-white/10 rounded-full hover:bg-white/5 transition-colors"
          >
            <Github className="w-3.5 h-3.5 text-neutral-400" />
          </a>
        </div>
      </div>
    </nav>
  );
}
