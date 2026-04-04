import { motion } from 'framer-motion';
import { Check, Loader2, Circle } from 'lucide-react';
import type { AgentStep } from '@/lib/research-agents';

interface AgentProgressProps {
  steps: AgentStep[];
  onStepClick: (stepId: string) => void;
  activeStep: string | null;
}

const agentColorMap: Record<string, string> = {
  'agent-research': 'bg-agent-research',
  'agent-filtering': 'bg-agent-filtering',
  'agent-summarization': 'bg-agent-summarization',
  'agent-report': 'bg-agent-report',
};

const agentTextColorMap: Record<string, string> = {
  'agent-research': 'text-agent-research',
  'agent-filtering': 'text-agent-filtering',
  'agent-summarization': 'text-agent-summarization',
  'agent-report': 'text-agent-report',
};

const AgentProgress = ({ steps, onStepClick, activeStep }: AgentProgressProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
        Agent Pipeline
      </h3>
      {steps.map((step, i) => (
        <motion.button
          key={step.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => step.status === 'complete' && onStepClick(step.id)}
          className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
            activeStep === step.id
              ? 'bg-secondary border-border'
              : 'bg-transparent border-transparent hover:bg-secondary/50'
          } ${step.status === 'complete' ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              step.status === 'complete'
                ? `${agentColorMap[step.color]} text-primary-foreground`
                : step.status === 'running'
                ? `${agentColorMap[step.color]}/20 ${agentTextColorMap[step.color]}`
                : 'bg-muted text-muted-foreground'
            }`}>
              {step.status === 'complete' ? (
                <Check className="w-3.5 h-3.5" />
              ) : step.status === 'running' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Circle className="w-3 h-3" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                  step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
              <span className={`text-xs font-mono ${agentTextColorMap[step.color]} opacity-70`}>
                {step.agent}
              </span>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default AgentProgress;
