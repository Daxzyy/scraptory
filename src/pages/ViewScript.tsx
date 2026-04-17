import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { 
  ArrowLeft, 
  Copy, 
  Download, 
  ExternalLink, 
  Check, 
  Terminal,
  FileCode
} from "lucide-react";

export default function ViewScript() {
  const { fileName } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [scriptData, setScriptData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileName) return;

    setLoading(true);
    
    // Fetch script metadata for explanation
    const fetchMetadata = fetch("/data/scripts.json")
      .then(res => res.json())
      .then(data => {
        const script = data.find((s: any) => s.fileName === fileName);
        setScriptData(script);
      });

    // Fetch raw code
    const fetchCode = fetch(`/scripts/${fileName}`)
      .then((res) => {
        if (!res.ok) throw new Error("Script not found");
        return res.text();
      });

    Promise.all([fetchMetadata, fetchCode])
      .then(([_, text]) => {
        setCode(text);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [fileName]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = fileName || "script.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4 tracking-tight">Script Not Found <span className="text-white/10">—</span> 404</h1>
        <p className="text-neutral-500 mb-8 max-w-sm mx-auto">This script doesn't exist in our repository archives.</p>
        <button onClick={() => navigate("/")} className="btn-primary">
          Return to Archive
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-6 group text-xs font-medium">
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        back to home
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 sticky top-24"
          >
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-lg w-fit mb-4">
              <FileCode className="w-5 h-5 text-neutral-300" />
            </div>
            <h1 className="text-xl font-bold mb-1 break-all">{fileName}</h1>
            <p className="text-[10px] text-neutral-500 mb-6 uppercase tracking-widest font-semibold">
              Source Payload
            </p>

            <div className="space-y-2.5">
              <button onClick={handleCopy} className="btn-primary w-full flex items-center justify-center gap-2 text-[11px] font-bold tracking-tight">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={handleDownload} className="btn-secondary w-full flex items-center justify-center gap-2 text-[11px] font-bold tracking-tight">
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
              <Link 
                to={`/raw/${fileName}`}
                target="_blank"
                className="btn-secondary w-full flex items-center justify-center gap-2 text-[11px] font-bold tracking-tight"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Raw
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="lg:w-3/4 space-y-6">
          {scriptData?.explanation && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <div className="w-1 h-3 bg-white/20 rounded-full" />
                Penjelasan Script
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed font-medium">
                {scriptData.explanation}
              </p>
            </motion.div>
          )}

          <div className="glass-card rounded-2xl overflow-hidden border-white/5">
            <div className="flex items-center justify-between px-5 py-2.5 bg-white/[0.02] border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                </div>
                <span className="text-[10px] font-mono text-neutral-500 ml-3 hidden md:inline tracking-tight">
                  {fileName} — {loading ? "..." : `${code.split('\n').length} lines`}
                </span>
              </div>
              <Terminal className="w-3.5 h-3.5 text-white/10" />
            </div>

            <div className="relative">
              {loading ? (
                <div className="p-8 space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-4 bg-white/5 rounded animate-pulse w-full" style={{ width: `${Math.random() * 40 + 60}%` }} />
                  ))}
                </div>
              ) : (
                <div className="text-[13px] font-mono scrollbar-thin scrollbar-thumb-white/10 overflow-hidden">
                  <SyntaxHighlighter
                    language={scriptData?.language?.toLowerCase() || "javascript"}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      background: 'transparent',
                      fontSize: 'inherit',
                      lineHeight: 'inherit',
                    }}
                    codeTagProps={{
                      style: {
                        fontFamily: 'inherit',
                      }
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
