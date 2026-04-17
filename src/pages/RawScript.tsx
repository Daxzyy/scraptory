import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function RawScript() {
  const { fileName } = useParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileName) return;

    fetch(`/scripts/${fileName}`)
      .then((res) => {
        if (!res.ok) throw new Error("Script not found");
        return res.text();
      })
      .then((text) => {
        setCode(text);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [fileName]);

  if (loading) {
    return <div className="bg-black text-white p-4 font-mono">Loading raw content...</div>;
  }

  if (error) {
    return <div className="bg-black text-white p-4 font-mono">Error: {error}</div>;
  }

  return (
    <pre className="bg-black text-white p-4 font-mono text-sm whitespace-pre min-h-screen selection:bg-white selection:text-black">
      {code}
    </pre>
  );
}
