import { motion, AnimatePresence } from 'framer-motion';
import type { AgentStep } from '@/lib/research-agents';

interface StepOutputProps {
  step: AgentStep | null;
}

const agentBorderMap: Record<string, string> = {
  'agent-research': 'border-agent-research/30',
  'agent-filtering': 'border-agent-filtering/30',
  'agent-summarization': 'border-agent-summarization/30',
  'agent-report': 'border-agent-report/30',
};

const agentTextMap: Record<string, string> = {
  'agent-research': 'text-agent-research',
  'agent-filtering': 'text-agent-filtering',
  'agent-summarization': 'text-agent-summarization',
  'agent-report': 'text-agent-report',
};

const StepOutput = ({ step }: StepOutputProps) => {
  if (!step) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p className="text-sm font-mono">Select a completed step to view its output</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={`h-full border rounded-xl p-6 bg-card/50 ${agentBorderMap[step.color]}`}
      >
        <div className="flex items-center gap-3 mb-5">
          <span className={`text-xs font-mono px-2 py-1 rounded-md bg-muted ${agentTextMap[step.color]}`}>
            {step.agent}
          </span>
          <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
        </div>
        <div className="prose prose-invert prose-sm max-w-none">
          {step.output?.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold text-foreground mt-4 mb-2">{line.slice(2)}</h1>;
            if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-semibold text-foreground mt-4 mb-2">{line.slice(3)}</h2>;
            if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold text-foreground mt-3 mb-1">{line.slice(4)}</h3>;
            if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-foreground mt-3">{line.slice(2, -2)}</p>;
            if (line.startsWith('- ')) return <p key={i} className="text-secondary-foreground ml-4">• {line.slice(2)}</p>;
            if (line.match(/^\d+\./)) return <p key={i} className="text-secondary-foreground ml-4">{line}</p>;
            if (line.startsWith('🔍') || line.startsWith('📂') || line.startsWith('✅') || line.startsWith('📚') || line.startsWith('📊') || line.startsWith('🌐') || line.startsWith('🗣️') || line.startsWith('📈') || line.startsWith('🏷️')) return <p key={i} className="text-secondary-foreground">{line}</p>;
            if (line.trim() === '') return <div key={i} className="h-2" />;
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            return (
              <p key={i} className="text-secondary-foreground">
                {parts.map((part, j) =>
                  part.startsWith('**') && part.endsWith('**')
                    ? <strong key={j} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>
                    : part
                )}
              </p>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StepOutput;
