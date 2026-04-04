import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  isRunning: boolean;
}

const TopicInput = ({ onSubmit, isRunning }: TopicInputProps) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isRunning) {
      onSubmit(topic.trim());
    }
  };

  const suggestions = [
    'Impact of AI on Education',
    'Future of Renewable Energy',
    'Quantum Computing Applications',
    'Space Exploration Technology',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-mono mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Multi-Agent Research System
        </motion.div>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          <span className="text-foreground">Research</span>{' '}
          <span className="text-primary">Agent</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Enter a topic and watch four specialized AI agents collaborate — Research, Filter, Summarize, and Report — to produce a comprehensive research report.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center bg-card border border-border rounded-2xl overflow-hidden">
          <Search className="w-5 h-5 text-muted-foreground ml-5 shrink-0" />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your research topic..."
            className="flex-1 bg-transparent px-4 py-5 text-foreground placeholder:text-muted-foreground outline-none text-lg font-light"
            disabled={isRunning}
          />
          <button
            type="submit"
            disabled={!topic.trim() || isRunning}
            className="m-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {isRunning ? 'Researching...' : 'Start Research'}
          </button>
        </div>
      </form>

      {!isRunning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-2 mt-5 justify-center"
        >
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setTopic(s)}
              className="px-3 py-1.5 rounded-lg text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border border-border"
            >
              {s}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TopicInput;
