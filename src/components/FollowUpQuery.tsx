import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useSmartQuery, type ChatMessage } from '@/hooks/useSmartQuery';

interface FollowUpQueryProps {
  topic: string;
  reportContent: string;
}

const FollowUpQuery = ({ topic, reportContent }: FollowUpQueryProps) => {
  const [input, setInput] = useState('');
  const { messages, isLoading, error, sendMessage } = useSmartQuery();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const contextPrefix = messages.length === 0
        ? `[Context: The user has just completed research on "${topic}". Here is the report:\n${reportContent}\n\nNow answer the following follow-up question:]\n\n`
        : '';
      sendMessage(contextPrefix + input.trim());
      setInput('');
    }
  };

  const suggestions = [
    `What are the risks of ${topic}?`,
    `Compare alternatives in ${topic}`,
    `Give me actionable next steps`,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-secondary/20">
        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Follow-up Questions</h3>
          <p className="text-[10px] text-muted-foreground font-mono">Ask anything about this research</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-6 space-y-3">
            <Bot className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
            <p className="text-sm text-muted-foreground">
              Ask follow-up questions to refine or explore the research further.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  className="px-2.5 py-1 rounded-lg text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border border-border"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <FollowUpBubble key={i} message={msg} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-mono">Analyzing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-secondary/10">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            disabled={isLoading}
            className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {error && (
          <p className="text-xs text-destructive mt-2 font-mono">{error}</p>
        )}
      </form>
    </motion.div>
  );
};

const FollowUpBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === 'user';
  // Strip context prefix from display
  const displayContent = isUser
    ? message.content.replace(/^\[Context:[\s\S]*?\]\n\n/, '')
    : message.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
        isUser ? 'bg-primary/15' : 'bg-accent/15'
      }`}>
        {isUser ? (
          <User className="w-3.5 h-3.5 text-primary" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-accent" />
        )}
      </div>
      <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
        isUser ? 'bg-primary/10 text-foreground' : 'bg-secondary text-foreground'
      }`}>
        {isUser ? (
          <p>{displayContent}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_code]:text-xs [&_pre]:text-xs">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FollowUpQuery;
