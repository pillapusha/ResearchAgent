import { useState, useCallback } from 'react';
import TopicInput from '@/components/TopicInput';
import AgentProgress from '@/components/AgentProgress';
import StepOutput from '@/components/StepOutput';
import ReportView from '@/components/ReportView';
import FollowUpQuery from '@/components/FollowUpQuery';
import HistorySidebar from '@/components/HistorySidebar';
import { AGENT_STEPS, generateAgentOutput, type AgentStep } from '@/lib/research-agents';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useResearchHistory, type ResearchEntry } from '@/hooks/useResearchHistory';
import SmartQueryBox from '@/components/SmartQueryBox';

const Index = () => {
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [showReport, setShowReport] = useState(false);
  const { history, saveEntry, deleteEntry, clearHistory } = useResearchHistory();

  const runWorkflow = useCallback(async (inputTopic: string) => {
    setTopic(inputTopic);
    setIsRunning(true);
    setShowReport(false);
    setActiveStep(null);

    const initialSteps: AgentStep[] = AGENT_STEPS.map((s) => ({
      ...s,
      status: 'pending' as const,
    }));
    setSteps(initialSteps);

    const completedSteps = [...initialSteps];

    for (let i = 0; i < initialSteps.length; i++) {
      setSteps((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: 'running' } : s))
      );
      setActiveStep(initialSteps[i].id);

      await new Promise((r) => setTimeout(r, 1800 + Math.random() * 1200));

      const output = generateAgentOutput(initialSteps[i].id, inputTopic);
      completedSteps[i] = { ...completedSteps[i], status: 'complete', output };
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: 'complete', output } : s
        )
      );
    }

    setIsRunning(false);
    setShowReport(true);
    saveEntry(inputTopic, completedSteps);
  }, [saveEntry]);

  const loadEntry = useCallback((entry: ResearchEntry) => {
    setTopic(entry.topic);
    setSteps(entry.steps);
    setIsRunning(false);
    setShowReport(true);
    setActiveStep(null);
  }, []);

  const reset = () => {
    setSteps([]);
    setIsRunning(false);
    setActiveStep(null);
    setTopic('');
    setShowReport(false);
  };

  const selectedStep = steps.find((s) => s.id === activeStep) || null;
  const reportStep = steps.find((s) => s.id === 'report');
  const hasStarted = steps.length > 0;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <HistorySidebar
          history={history}
          onSelect={loadEntry}
          onDelete={deleteEntry}
          onClear={clearHistory}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border px-4 shrink-0">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <span className="ml-3 text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Research Agent
            </span>
          </header>

          <div className="flex-1 relative">
            <div className="fixed inset-0 bg-[linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] bg-[size:64px_64px] opacity-30 pointer-events-none" />

            <div className="relative z-10">
              {!hasStarted ? (
                <div className="flex items-center justify-center min-h-[calc(100vh-3rem)] px-6">
                  <TopicInput onSubmit={runWorkflow} isRunning={isRunning} />
                </div>
              ) : (
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">
                        Researching: <span className="text-primary">{topic}</span>
                      </h1>
                      <p className="text-sm text-muted-foreground font-mono mt-1">
                        {isRunning ? 'Agents are working...' : 'Research complete'}
                      </p>
                    </div>
                    {!isRunning && (
                      <button
                        onClick={reset}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium"
                      >
                        <RotateCcw className="w-4 h-4" />
                        New Research
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                    <div className="bg-card border border-border rounded-2xl p-4">
                      <AgentProgress
                        steps={steps}
                        onStepClick={setActiveStep}
                        activeStep={activeStep}
                      />
                    </div>

                    <div className="space-y-6">
                      <AnimatePresence mode="wait">
                        {showReport && reportStep?.output ? (
                          <ReportView report={reportStep.output} topic={topic} />
                        ) : (
                          <motion.div key="step-output" className="min-h-[400px]">
                            <StepOutput step={selectedStep} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {showReport && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => setShowReport(false)}
                          className="text-sm text-muted-foreground hover:text-foreground font-mono transition-colors"
                        >
                          ← View individual step outputs
                        </motion.button>
                      )}

                      {!showReport && steps.some((s) => s.id === 'report' && s.status === 'complete') && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => setShowReport(true)}
                          className="text-sm text-primary hover:text-primary/80 font-mono transition-colors"
                        >
                          View final report →
                        </motion.button>
                      )}

                      {/* Follow-up query box after research completes */}
                      {!isRunning && reportStep?.output && (
                        <FollowUpQuery topic={topic} reportContent={reportStep.output} />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <SmartQueryBox />
      </div>
    </SidebarProvider>
  );
};

export default Index;
