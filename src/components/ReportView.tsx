import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';

interface ReportViewProps {
  report: string;
  topic: string;
}

const ReportView = ({ report, topic }: ReportViewProps) => {
  const handleDownload = () => {
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.replace(/\s+/g, '_')}_Research_Report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Final Research Report</h2>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
      <div className="p-8 prose prose-invert max-w-none">
        {report.split('\n').map((line, i) => {
          if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-foreground mt-6 mb-3">{line.slice(2)}</h1>;
          if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-semibold text-foreground mt-5 mb-2">{line.slice(3)}</h2>;
          if (line.startsWith('- ')) return <p key={i} className="text-secondary-foreground ml-4">• {line.slice(2)}</p>;
          if (line.trim() === '') return <div key={i} className="h-3" />;
          return <p key={i} className="text-secondary-foreground leading-relaxed">{line}</p>;
        })}
      </div>
    </motion.div>
  );
};

export default ReportView;
