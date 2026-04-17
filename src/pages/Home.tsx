import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Search, Code2, ArrowRight } from "lucide-react";

interface Script {
  id: string;
  name: string;
  fileName: string;
  description: string;
  language: string;
  author: string;
}

export default function Home() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/scripts.json")
      .then((res) => res.json())
      .then((data) => {
        setScripts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load scripts", err);
        setLoading(false);
      });
  }, []);

  const filteredScripts = scripts.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">
            Scraptory <span className="text-white/10">/</span>
          </h1>
          <p className="text-neutral-400 text-sm max-w-md">
            A collection of curated scraping scripts for developers and data enthusiasts.
          </p>
        </motion.div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search script archive..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-white/20 transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 glass-card rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {filteredScripts.map((script) => (
            <motion.div
              key={script.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="group glass-card rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-white/30 transition-colors">
                    <Code2 className="w-5 h-5 text-white/70" />
                  </div>
                  <span className="text-[10px] font-mono border border-white/10 px-2 py-1 rounded bg-white/5 opacity-60">
                    {script.language}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-1.5 transition-colors group-hover:text-white">
                  {script.name}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                  {script.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span className="text-[10px] text-neutral-500 font-medium">
                  by {script.author}
                </span>
                <Link
                  to={`/view/${script.fileName}`}
                  className="flex items-center gap-1 text-[11px] font-bold tracking-wide hover:gap-1.5 transition-all text-neutral-300 hover:text-white"
                >
                  View Code <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && filteredScripts.length === 0 && (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
          <p className="text-white/30 font-mono">No scripts found matching your search.</p>
        </div>
      )}
    </div>
  );
}
